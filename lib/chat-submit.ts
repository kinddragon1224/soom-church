import { ChatSpeakerRole, ExtractedUpdateStatus, ExtractedUpdateType, Prisma, ReviewReason } from "@prisma/client";
import { applyExtractedUpdate } from "@/lib/extracted-update-apply";
import { extractStructuredChatUpdates, type InternalReviewReason, type InternalUpdateType } from "@/lib/chat-extraction";
import { prisma } from "@/lib/prisma";

const updateTypeMap: Record<InternalUpdateType, ExtractedUpdateType> = {
  member_profile: ExtractedUpdateType.MEMBER_PROFILE,
  household_profile: ExtractedUpdateType.HOUSEHOLD_PROFILE,
  relationship: ExtractedUpdateType.RELATIONSHIP,
  prayer: ExtractedUpdateType.PRAYER,
  care_record: ExtractedUpdateType.CARE_RECORD,
  attendance: ExtractedUpdateType.ATTENDANCE,
  church_event: ExtractedUpdateType.CHURCH_EVENT,
  follow_up: ExtractedUpdateType.FOLLOW_UP,
  status_change: ExtractedUpdateType.STATUS_CHANGE,
};

const reviewReasonMap: Record<InternalReviewReason, ReviewReason> = {
  ambiguous_member_match: ReviewReason.AMBIGUOUS_MEMBER_MATCH,
  ambiguous_household_match: ReviewReason.AMBIGUOUS_HOUSEHOLD_MATCH,
  relationship_uncertain: ReviewReason.RELATIONSHIP_UNCERTAIN,
  duplicate_candidate: ReviewReason.DUPLICATE_CANDIDATE,
  low_confidence: ReviewReason.LOW_CONFIDENCE,
  missing_required_field: ReviewReason.MISSING_REQUIRED_FIELD,
  conflicting_existing_data: ReviewReason.CONFLICTING_EXISTING_DATA,
};

export async function submitStructuredChatMessage(args: {
  churchId: string;
  churchName: string;
  userId?: string | null;
  rawText: string;
}) {
  const rawText = args.rawText.trim();
  if (!rawText) {
    return { ok: false as const, message: "입력 내용이 비어 있어." };
  }

  const [memberNames, householdNames] = await Promise.all([
    prisma.member.findMany({
      where: { churchId: args.churchId, isDeleted: false },
      select: { name: true },
      orderBy: { name: "asc" },
    }),
    prisma.household.findMany({
      where: { churchId: args.churchId },
      select: { name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const extraction = await extractStructuredChatUpdates({
    churchName: args.churchName,
    memberNames: memberNames.map((item) => item.name),
    householdNames: householdNames.map((item) => item.name),
    messageText: rawText,
  });

  const pastorCapture = await prisma.chatCapture.create({
    data: {
      churchId: args.churchId,
      speakerRole: ChatSpeakerRole.PASTOR,
      rawText,
      threadKey: "main",
      happenedAt: new Date(),
      capturedAt: new Date(),
      sourceChannel: "WEB_CHAT",
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    let reviewCount = 0;
    let appliedCount = 0;

    for (const update of extraction.updates) {
      const ambiguityFlags = update.ambiguityFlags.filter((flag): flag is InternalReviewReason => Boolean(reviewReasonMap[flag]));
      const createdUpdate = await tx.extractedUpdate.create({
        data: {
          churchId: args.churchId,
          captureId: pastorCapture.id,
          updateType: updateTypeMap[update.updateType],
          confidence: update.confidence,
          payloadJson: update.payload as Prisma.InputJsonValue,
          targetMemberHint: update.targetMemberHint ?? null,
          targetHouseholdHint: update.targetHouseholdHint ?? null,
          ambiguityFlags: ambiguityFlags as unknown as Prisma.InputJsonValue,
          sourceSummary: update.sourceSummary ?? null,
          suggestedAction: update.suggestedAction,
          reviewPrompt: update.reviewPrompt ?? null,
          status: ambiguityFlags.length > 0 ? ExtractedUpdateStatus.NEEDS_REVIEW : ExtractedUpdateStatus.CONFIRMED,
        },
      });

      if (ambiguityFlags.length > 0) {
        const reviewReason = reviewReasonMap[update.reviewReason ?? ambiguityFlags[0]];
        await tx.reviewItem.create({
          data: {
            churchId: args.churchId,
            extractedUpdateId: createdUpdate.id,
            reviewReason,
            title: update.reviewPrompt ?? `${update.targetMemberHint ?? update.targetHouseholdHint ?? "이 항목"} 검토 필요`,
            summary: update.sourceSummary ?? rawText,
            suggestedAction: update.suggestedAction,
          },
        });
        reviewCount += 1;
        continue;
      }

      const outcome = await applyExtractedUpdate(tx, createdUpdate.id, args.userId);
      if (outcome.applied) appliedCount += 1;
      if (outcome.redirectedToReview) reviewCount += 1;
    }

    const assistantReply =
      extraction.updates.length === 0
        ? "정리할 내용을 아직 잡지 못했어. 조금만 더 구체적으로 말해줘."
        : `${extraction.updates.length}개 항목으로 읽었어. ${appliedCount > 0 ? `${appliedCount}건은 바로 반영했고 ` : ""}${reviewCount > 0 ? `확인이 필요한 ${reviewCount}건은 따로 보관할게.` : "바로 기록해뒀어."}`;

    await tx.chatCapture.create({
      data: {
        churchId: args.churchId,
        speakerRole: ChatSpeakerRole.ASSISTANT,
        rawText: assistantReply,
        threadKey: "main",
        happenedAt: new Date(),
        capturedAt: new Date(),
        sourceChannel: "PIPELINE",
      },
    });

    return { appliedCount, reviewCount, assistantReply, updateCount: extraction.updates.length };
  });

  return { ok: true as const, ...result };
}
