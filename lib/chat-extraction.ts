import { z } from "zod";

const updateTypeValues = [
  "member_profile",
  "household_profile",
  "relationship",
  "prayer",
  "care_record",
  "attendance",
  "church_event",
  "follow_up",
  "status_change",
] as const;

const reviewReasonValues = [
  "ambiguous_member_match",
  "ambiguous_household_match",
  "relationship_uncertain",
  "duplicate_candidate",
  "low_confidence",
  "missing_required_field",
  "conflicting_existing_data",
] as const;

const ExtractedCandidateSchema = z.object({
  updateType: z.enum(updateTypeValues),
  confidence: z.number().min(0).max(1).default(0.5),
  targetMemberHint: z.string().trim().nullable().optional(),
  targetHouseholdHint: z.string().trim().nullable().optional(),
  payload: z.record(z.any()).default({}),
  ambiguityFlags: z.array(z.enum(reviewReasonValues)).default([]),
  reviewReason: z.enum(reviewReasonValues).nullable().optional(),
  sourceSummary: z.string().trim().nullable().optional(),
  suggestedAction: z.string().trim().default("Review에서 확인"),
  reviewPrompt: z.string().trim().nullable().optional(),
});

const ExtractionResponseSchema = z.object({
  assistantReply: z.string().trim().default("정리해둘게."),
  updates: z.array(ExtractedCandidateSchema).default([]),
});

export type InternalUpdateType = (typeof updateTypeValues)[number];
export type InternalReviewReason = (typeof reviewReasonValues)[number];
export type ExtractedCandidate = z.infer<typeof ExtractedCandidateSchema>;
export type StructuredChatExtraction = z.infer<typeof ExtractionResponseSchema>;

const updateTypeDescriptions: Record<InternalUpdateType, string> = {
  member_profile: "사람 기본정보",
  household_profile: "가정 정보",
  relationship: "관계",
  prayer: "기도제목",
  care_record: "돌봄 기록",
  attendance: "출석 변화",
  church_event: "교회 이벤트",
  follow_up: "후속조치",
  status_change: "상태 변화",
};

function trimText(value: string, max = 120) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

function uniqueStrings(values: (string | null | undefined)[]) {
  return [...new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])];
}

function detectMemberMatches(text: string, memberNames: string[]) {
  const normalized = text.replace(/\s+/g, "");
  return uniqueStrings(
    [...memberNames]
      .sort((a, b) => b.length - a.length)
      .filter((name) => normalized.includes(name.replace(/\s+/g, ""))),
  );
}

function detectHouseholdMatches(text: string, householdNames: string[]) {
  const directMatches = uniqueStrings(
    [...householdNames]
      .sort((a, b) => b.length - a.length)
      .filter((name) => text.includes(name)),
  );

  const householdAlias = text.match(/([가-힣A-Za-z0-9]{2,12})네/);
  if (householdAlias?.[0]) directMatches.unshift(householdAlias[0]);

  return uniqueStrings(directMatches);
}

function buildReviewPrompt(updateType: InternalUpdateType, summary: string, memberHint?: string | null, householdHint?: string | null) {
  const target = memberHint || householdHint || "이 내용";
  const actionMap: Record<InternalUpdateType, string> = {
    member_profile: "사람 기본정보로 저장할까?",
    household_profile: "가정 정보로 저장할까?",
    relationship: "관계 후보로 저장할까?",
    prayer: "기도제목으로 저장할까?",
    care_record: "건강/돌봄 기록으로 저장할까?",
    attendance: "출석 변화로 저장할까?",
    church_event: "교회 이벤트로 저장할까?",
    follow_up: "후속조치로 저장할까?",
    status_change: "상태 변화로 저장할까?",
  };

  return `${target} ${summary} -> ${actionMap[updateType]}`;
}

function inferRelationshipType(sentence: string) {
  if (/아내|남편|배우자|부부/.test(sentence)) return "SPOUSE";
  if (/어머니|엄마|아버지|아빠|부모/.test(sentence)) return "PARENT";
  if (/자녀|아들|딸/.test(sentence)) return "CHILD";
  if (/형제|자매|오빠|언니|누나|동생/.test(sentence)) return "SIBLING";
  if (/보호자/.test(sentence)) return "GUARDIAN";
  if (/친척|가족/.test(sentence)) return "RELATIVE";
  return null;
}

function inferAttendanceStatus(sentence: string) {
  if (/결석|빠졌|불참|못 왔|안 왔|못왔|안왔/.test(sentence)) return "ABSENT";
  if (/출석|참석|예배.*왔|함께 왔|같이 왔|드렸어/.test(sentence)) return "ATTENDED";
  return null;
}

function inferChurchEventType(sentence: string) {
  if (/헌아|유아세례/.test(sentence)) return "INFANT_BAPTISM";
  if (/침례|세례/.test(sentence)) return "BAPTISM";
  if (/입교/.test(sentence)) return "CONFIRMATION";
  if (/성찬/.test(sentence)) return "COMMUNION";
  if (/등록|이명/.test(sentence)) return "MEMBERSHIP_TRANSFER";
  return null;
}

function shouldCreateRelationshipCandidate(sentence: string, memberMatches: string[]) {
  if (!/아내|남편|배우자|부부|자녀|아들|딸|엄마|어머니|아버지|아빠|부모|형제|자매|오빠|언니|누나|동생|보호자|가족|관계|연결/.test(sentence)) {
    return false;
  }

  if (memberMatches.length >= 2) return true;
  return /관계|연결|배우자 추가|배우자 등록|가족 연결|자녀 등록/.test(sentence);
}

function extractRelationshipTargets(memberMatches: string[]) {
  return {
    fromMemberName: memberMatches[0] ?? null,
    toMemberName: memberMatches[1] ?? null,
  };
}

function createFallbackCandidate(args: {
  updateType: InternalUpdateType;
  sentence: string;
  targetMemberHint?: string | null;
  targetHouseholdHint?: string | null;
  payload?: Record<string, unknown>;
  ambiguityFlags?: InternalReviewReason[];
  suggestedAction?: string;
  reviewReason?: InternalReviewReason | null;
  confidence?: number;
}) {
  const summary = trimText(args.sentence.replace(/\s+/g, " ").trim(), 72);
  const ambiguityFlags = uniqueStrings(args.ambiguityFlags ?? []) as InternalReviewReason[];

  return ExtractedCandidateSchema.parse({
    updateType: args.updateType,
    confidence: args.confidence ?? (ambiguityFlags.length > 0 ? 0.64 : 0.86),
    targetMemberHint: args.targetMemberHint ?? null,
    targetHouseholdHint: args.targetHouseholdHint ?? null,
    payload: {
      summary,
      rawText: args.sentence,
      memberName: args.targetMemberHint ?? undefined,
      householdName: args.targetHouseholdHint ?? undefined,
      ...args.payload,
    },
    ambiguityFlags,
    reviewReason: args.reviewReason ?? ambiguityFlags[0] ?? null,
    sourceSummary: summary,
    suggestedAction: args.suggestedAction ?? `${updateTypeDescriptions[args.updateType]}로 정리`,
    reviewPrompt: buildReviewPrompt(args.updateType, summary, args.targetMemberHint, args.targetHouseholdHint),
  });
}

function fallbackExtract({
  messageText,
  memberNames,
  householdNames,
}: {
  messageText: string;
  memberNames: string[];
  householdNames: string[];
}): StructuredChatExtraction {
  const sentences = messageText
    .split(/\n+|(?<=[.!?])\s+|(?<=[다요]\.)\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const updates: ExtractedCandidate[] = [];

  for (const sentence of sentences.length > 0 ? sentences : [messageText.trim()]) {
    const memberMatches = detectMemberMatches(sentence, memberNames);
    const householdMatches = detectHouseholdMatches(sentence, householdNames);
    const targetMemberHint = memberMatches[0] ?? null;
    const targetHouseholdHint = householdMatches[0] ?? null;
    const sharedFlags: InternalReviewReason[] = [];

    if (memberMatches.length > 1) sharedFlags.push("ambiguous_member_match");
    if (householdMatches.length > 1) sharedFlags.push("ambiguous_household_match");

    if (/수술|입원|아프|병원|건강|회복|치료/.test(sentence)) {
      const flags = [...sharedFlags];
      if (!targetMemberHint) flags.push("ambiguous_member_match");
      updates.push(
        createFallbackCandidate({
          updateType: "care_record",
          sentence,
          targetMemberHint,
          targetHouseholdHint,
          payload: { category: "HEALTH" },
          ambiguityFlags: flags,
          suggestedAction: "건강 기록으로 저장할지 확인",
          reviewReason: flags[0] ?? null,
        }),
      );
    }

    if (/기도|중보/.test(sentence)) {
      const flags = [...sharedFlags];
      if (!targetMemberHint && !targetHouseholdHint) flags.push("low_confidence");
      updates.push(
        createFallbackCandidate({
          updateType: "prayer",
          sentence,
          targetMemberHint,
          targetHouseholdHint,
          payload: { category: "NOTE" },
          ambiguityFlags: flags,
          suggestedAction: "기도제목으로 저장할지 확인",
          reviewReason: flags[0] ?? null,
        }),
      );
    }

    if (/결석|출석|참석|예배.*왔|예배.*못|안 왔|빠졌|함께 왔|같이 왔|드렸어/.test(sentence)) {
      const flags = [...sharedFlags];
      if (!targetMemberHint && !targetHouseholdHint) flags.push("low_confidence");
      updates.push(
        createFallbackCandidate({
          updateType: "attendance",
          sentence,
          targetMemberHint,
          targetHouseholdHint,
          payload: {
            category: "ATTENDANCE",
            attendanceStatus: inferAttendanceStatus(sentence),
          },
          ambiguityFlags: flags,
          suggestedAction: "출석 변화로 저장할지 확인",
          reviewReason: flags[0] ?? null,
        }),
      );
    }

    if (/침례|세례|입교|성찬|등록|이명|헌아/.test(sentence)) {
      const flags = [...sharedFlags];
      if (!targetMemberHint) flags.push("ambiguous_member_match");
      updates.push(
        createFallbackCandidate({
          updateType: "church_event",
          sentence,
          targetMemberHint,
          targetHouseholdHint,
          payload: {
            eventType: inferChurchEventType(sentence),
            sacramentType: inferChurchEventType(sentence),
          },
          ambiguityFlags: flags,
          suggestedAction: "교회 이벤트로 저장할지 확인",
          reviewReason: flags[0] ?? null,
        }),
      );
    }

    if (shouldCreateRelationshipCandidate(sentence, memberMatches)) {
      const relationshipTargets = extractRelationshipTargets(memberMatches);
      const flags = [...sharedFlags];
      if (!relationshipTargets.fromMemberName || !relationshipTargets.toMemberName) flags.push("relationship_uncertain");
      updates.push(
        createFallbackCandidate({
          updateType: "relationship",
          sentence,
          targetMemberHint,
          targetHouseholdHint,
          payload: {
            relationshipType: inferRelationshipType(sentence),
            fromMemberName: relationshipTargets.fromMemberName ?? undefined,
            toMemberName: relationshipTargets.toMemberName ?? undefined,
            relatedMemberName: relationshipTargets.toMemberName ?? undefined,
          },
          ambiguityFlags: flags,
          suggestedAction: "배우자/가족 관계로 연결할지 확인",
          reviewReason: flags[0] ?? null,
          confidence: flags.includes("relationship_uncertain") ? 0.58 : 0.82,
        }),
      );
    }

    if (/연락|전화|챙겨|심방|방문|다음 주|후속/.test(sentence)) {
      const flags = [...sharedFlags];
      if (!targetMemberHint && !targetHouseholdHint) flags.push("low_confidence");
      updates.push(
        createFallbackCandidate({
          updateType: "follow_up",
          sentence,
          targetMemberHint,
          targetHouseholdHint,
          payload: { requiresFollowUp: true, category: "NOTE" },
          ambiguityFlags: flags,
          suggestedAction: "후속조치 카드로 저장할지 확인",
          reviewReason: flags[0] ?? null,
        }),
      );
    }
  }

  const deduped = updates.filter((item, index, array) => {
    const key = `${item.updateType}:${item.sourceSummary}:${item.targetMemberHint ?? ""}:${item.targetHouseholdHint ?? ""}`;
    return array.findIndex((candidate) => `${candidate.updateType}:${candidate.sourceSummary}:${candidate.targetMemberHint ?? ""}:${candidate.targetHouseholdHint ?? ""}` === key) === index;
  });

  const finalUpdates = deduped.length > 0
    ? deduped
    : [
        createFallbackCandidate({
          updateType: "status_change",
          sentence: messageText,
          ambiguityFlags: ["low_confidence"],
          suggestedAction: "어떤 기록으로 저장할지 Review에서 확인",
          reviewReason: "low_confidence",
          confidence: 0.42,
        }),
      ];

  const needsReview = finalUpdates.filter((item) => item.ambiguityFlags.length > 0).length;
  const assistantReply = `${finalUpdates.length}개 항목으로 정리했어. ${needsReview > 0 ? `애매한 ${needsReview}건은 Review에 올려둘게.` : "바로 정리 가능한 항목으로 묶어뒀어."}`;

  return ExtractionResponseSchema.parse({
    assistantReply,
    updates: finalUpdates,
  });
}

function sanitizeJsonText(value: string) {
  const fenced = value.match(/```json\s*([\s\S]*?)```/i) || value.match(/```\s*([\s\S]*?)```/i);
  return (fenced?.[1] ?? value).trim();
}

async function extractWithLLM({
  churchName,
  memberNames,
  householdNames,
  messageText,
}: {
  churchName: string;
  memberNames: string[];
  householdNames: string[];
  messageText: string;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || process.env.LLM_MODEL || "gpt-4.1-mini";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You extract structured mokjang operations from Korean chat messages. Return JSON only. Prefer the smallest set of high-signal updates, not every possible interpretation. For each update, use updateType from the allowed lowercase set, confidence 0..1, payload object, ambiguityFlags array, reviewReason when needed, suggestedAction, sourceSummary, and reviewPrompt like '김민수 어머니 수술 예정 -> 건강 기록으로 저장할까?'. Use payload keys when relevant: relationship={fromMemberName,toMemberName,relationshipType,customRelationship}, church_event={memberName,eventType,sacramentType,happenedAt,churchName,officiant}, attendance={memberName or householdName,attendanceStatus}, follow_up={memberName or householdName,requiresFollowUp}, care_record/prayer={memberName or householdName,category,summary}. If kinship words like '어머니' appear inside a health or prayer note, do not create a relationship update unless two actual members are identifiable or the user explicitly asks to connect the relationship. Never invent a second person name. Put ambiguity into ambiguityFlags. Keep assistantReply short and Korean.",
          },
          {
            role: "user",
            content: JSON.stringify({
              churchName,
              memberNames: memberNames.slice(0, 200),
              householdNames: householdNames.slice(0, 120),
              messageText,
              allowedUpdateTypes: updateTypeValues,
              allowedReviewReasons: reviewReasonValues,
            }),
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) return null;

    const parsed = JSON.parse(sanitizeJsonText(content));
    return ExtractionResponseSchema.parse(parsed);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function extractStructuredChatUpdates(args: {
  churchName: string;
  memberNames: string[];
  householdNames: string[];
  messageText: string;
}) {
  const llmResult = await extractWithLLM(args);
  if (llmResult) return llmResult;
  return fallbackExtract(args);
}
