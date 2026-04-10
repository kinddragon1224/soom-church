import {
  CareCategory,
  ExtractedUpdateStatus,
  Gender,
  IntakeCandidateType,
  Prisma,
  RelationshipType,
  ReviewItemStatus,
  ReviewReason,
  SacramentType,
} from "@prisma/client";
import { parseGidoHouseholdMeta, updateGidoHouseholdMeta } from "@/lib/gido-home-config";

const careCategoryMap: Record<string, CareCategory> = {
  VISIT: CareCategory.VISIT,
  ATTENDANCE: CareCategory.ATTENDANCE,
  COUNSEL: CareCategory.COUNSEL,
  HEALTH: CareCategory.HEALTH,
  FINANCE: CareCategory.FINANCE,
  JOB: CareCategory.JOB,
  MARRIAGE: CareCategory.MARRIAGE,
  DIVORCE: CareCategory.DIVORCE,
  FUNERAL: CareCategory.FUNERAL,
  FAMILY: CareCategory.FAMILY,
  MINISTRY: CareCategory.MINISTRY,
  NOTE: CareCategory.NOTE,
  CUSTOM: CareCategory.CUSTOM,
};

const relationshipTypeMap: Record<string, RelationshipType> = {
  SPOUSE: RelationshipType.SPOUSE,
  PARENT: RelationshipType.PARENT,
  CHILD: RelationshipType.CHILD,
  SIBLING: RelationshipType.SIBLING,
  GRANDPARENT: RelationshipType.GRANDPARENT,
  GRANDCHILD: RelationshipType.GRANDCHILD,
  GUARDIAN: RelationshipType.GUARDIAN,
  RELATIVE: RelationshipType.RELATIVE,
  CAREGIVER: RelationshipType.CAREGIVER,
  CUSTOM: RelationshipType.CUSTOM,
};

const sacramentTypeMap: Record<string, SacramentType> = {
  BAPTISM: SacramentType.BAPTISM,
  INFANT_BAPTISM: SacramentType.INFANT_BAPTISM,
  CONFIRMATION: SacramentType.CONFIRMATION,
  COMMUNION: SacramentType.COMMUNION,
  MEMBERSHIP_TRANSFER: SacramentType.MEMBERSHIP_TRANSFER,
  CUSTOM: SacramentType.CUSTOM,
};

type DbClient = Prisma.TransactionClient;

type ExtractedUpdateRecord = Prisma.ExtractedUpdateGetPayload<{
  include: {
    reviewItems: true;
  };
}>;

type ApplyOutcome = {
  applied: boolean;
  redirectedToReview?: boolean;
  entityType?: string;
  entityId?: string;
};

function asRecord(value: Prisma.JsonValue | null | undefined) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {} as Record<string, unknown>;
  return value as Record<string, unknown>;
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() || null : null;
}

function asBoolean(value: unknown) {
  return typeof value === "boolean" ? value : null;
}

function asDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function uniqueStrings(values: (string | null | undefined)[]) {
  return [...new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])];
}

function firstNonEmpty(...values: (string | null | undefined)[]) {
  return values.map((value) => value?.trim()).find(Boolean) ?? null;
}

function appendUnique(list: string[], value: string | null) {
  if (!value) return list;
  return [...new Set([...list, value])];
}

function parseCareCategory(value: string | null, fallback: CareCategory) {
  if (!value) return fallback;
  return careCategoryMap[value.toUpperCase()] ?? fallback;
}

function parseRelationshipType(value: string | null) {
  if (!value) return null;
  return relationshipTypeMap[value.toUpperCase()] ?? null;
}

function parseSacramentType(value: string | null) {
  if (!value) return null;
  return sacramentTypeMap[value.toUpperCase()] ?? null;
}

function parseGender(value: string | null) {
  if (!value) return null;
  const normalized = value.toUpperCase();
  if (normalized === "MALE") return Gender.MALE;
  if (normalized === "FEMALE") return Gender.FEMALE;
  if (normalized === "OTHER") return Gender.OTHER;
  return null;
}

function buildReviewTitle(update: ExtractedUpdateRecord) {
  return update.reviewPrompt || `${update.targetMemberHint ?? update.targetHouseholdHint ?? "이 항목"} ${update.sourceSummary ?? "확인 필요"}`.trim();
}

async function createApplyResult(
  tx: DbClient,
  extractedUpdateId: string,
  entityType: string,
  entityId: string,
  patch: Record<string, unknown>,
  actorId?: string | null,
) {
  await tx.applyResult.create({
    data: {
      extractedUpdateId,
      appliedEntityType: entityType,
      appliedEntityId: entityId,
      appliedPatchJson: patch as Prisma.InputJsonValue,
      actorId: actorId ?? null,
    },
  });
}

async function redirectToReview(
  tx: DbClient,
  update: ExtractedUpdateRecord,
  reason: ReviewReason,
  note: string,
) {
  const existingPending = await tx.reviewItem.findFirst({
    where: {
      extractedUpdateId: update.id,
      status: ReviewItemStatus.PENDING,
    },
    select: { id: true },
  });

  if (!existingPending) {
    await tx.reviewItem.create({
      data: {
        churchId: update.churchId,
        extractedUpdateId: update.id,
        reviewReason: reason,
        title: buildReviewTitle(update),
        summary: update.sourceSummary ?? note,
        suggestedAction: update.suggestedAction ?? note,
      },
    });
  }

  await tx.extractedUpdate.update({
    where: { id: update.id },
    data: {
      status: ExtractedUpdateStatus.NEEDS_REVIEW,
      ambiguityFlags: [reason] as unknown as Prisma.InputJsonValue,
    },
  });

  return { applied: false, redirectedToReview: true } satisfies ApplyOutcome;
}

async function resolveMember(tx: DbClient, churchId: string, hints: (string | null | undefined)[]) {
  for (const hint of uniqueStrings(hints)) {
    const matches = await tx.member.findMany({
      where: {
        churchId,
        isDeleted: false,
        name: hint,
      },
      select: { id: true, name: true, notes: true, statusTag: true, requiresFollowUp: true },
      take: 2,
    });

    if (matches.length === 1) return matches[0];
  }

  return null;
}

async function resolveHousehold(tx: DbClient, churchId: string, hints: (string | null | undefined)[]) {
  for (const hint of uniqueStrings(hints)) {
    const exactMatches = await tx.household.findMany({
      where: { churchId, name: hint },
      select: { id: true, name: true, notes: true },
      take: 2,
    });
    if (exactMatches.length === 1) return exactMatches[0];

    const partialMatches = await tx.household.findMany({
      where: {
        churchId,
        name: { contains: hint.replace(/네$/, "") },
      },
      select: { id: true, name: true, notes: true },
      take: 2,
    });
    if (partialMatches.length === 1) return partialMatches[0];
  }

  return null;
}

async function applyMemberCareRecord(
  tx: DbClient,
  update: ExtractedUpdateRecord,
  payload: Record<string, unknown>,
  actorId?: string | null,
  defaultCategory: CareCategory = CareCategory.NOTE,
  titleFallback = "운영 기록",
) {
  const member = await resolveMember(tx, update.churchId, [
    update.targetMemberHint,
    asString(payload.memberName),
  ]);

  if (!member) {
    return redirectToReview(tx, update, ReviewReason.AMBIGUOUS_MEMBER_MATCH, "사람 연결을 먼저 확인해줘.");
  }

  const summary = firstNonEmpty(asString(payload.summary), update.sourceSummary, asString(payload.rawText));
  const title = firstNonEmpty(asString(payload.title), summary, titleFallback) ?? titleFallback;
  const created = await tx.memberCareRecord.create({
    data: {
      churchId: update.churchId,
      memberId: member.id,
      category: parseCareCategory(asString(payload.category), defaultCategory),
      title,
      summary,
      details: asString(payload.rawText),
      happenedAt: asDate(payload.happenedAt) ?? new Date(),
      recordedBy: actorId ?? null,
    },
  });

  await createApplyResult(tx, update.id, "MemberCareRecord", created.id, {
    memberId: member.id,
    title,
    summary,
    category: created.category,
  }, actorId);

  return { applied: true, entityType: "MemberCareRecord", entityId: created.id } satisfies ApplyOutcome;
}

async function applyPrayer(
  tx: DbClient,
  update: ExtractedUpdateRecord,
  payload: Record<string, unknown>,
  actorId?: string | null,
) {
  const prayerText = firstNonEmpty(asString(payload.summary), update.sourceSummary, asString(payload.rawText));
  const household = await resolveHousehold(tx, update.churchId, [
    update.targetHouseholdHint,
    asString(payload.householdName),
  ]);

  if (household && prayerText) {
    const meta = parseGidoHouseholdMeta(household.notes);
    await tx.household.update({
      where: { id: household.id },
      data: {
        notes: updateGidoHouseholdMeta(household.notes, {
          prayers: appendUnique(meta.prayers ?? [], prayerText),
        }),
      },
    });

    await createApplyResult(tx, update.id, "Household", household.id, {
      prayer: prayerText,
      householdId: household.id,
    }, actorId);

    return { applied: true, entityType: "Household", entityId: household.id } satisfies ApplyOutcome;
  }

  return applyMemberCareRecord(tx, update, { ...payload, title: "기도제목", category: "NOTE" }, actorId, CareCategory.NOTE, "기도제목");
}

async function applyFollowUp(
  tx: DbClient,
  update: ExtractedUpdateRecord,
  payload: Record<string, unknown>,
  actorId?: string | null,
) {
  const member = await resolveMember(tx, update.churchId, [
    update.targetMemberHint,
    asString(payload.memberName),
  ]);

  if (member) {
    await tx.member.update({
      where: { id: member.id },
      data: { requiresFollowUp: true },
    });

    return applyMemberCareRecord(
      tx,
      update,
      { ...payload, category: "NOTE", title: asString(payload.title) ?? "후속조치" },
      actorId,
      CareCategory.NOTE,
      "후속조치",
    );
  }

  const household = await resolveHousehold(tx, update.churchId, [
    update.targetHouseholdHint,
    asString(payload.householdName),
  ]);
  const contactText = firstNonEmpty(asString(payload.summary), update.sourceSummary, asString(payload.rawText));

  if (household && contactText) {
    const meta = parseGidoHouseholdMeta(household.notes);
    await tx.household.update({
      where: { id: household.id },
      data: {
        notes: updateGidoHouseholdMeta(household.notes, {
          contacts: appendUnique(meta.contacts ?? [], contactText),
        }),
      },
    });

    await createApplyResult(tx, update.id, "Household", household.id, {
      contact: contactText,
      householdId: household.id,
    }, actorId);

    return { applied: true, entityType: "Household", entityId: household.id } satisfies ApplyOutcome;
  }

  return redirectToReview(tx, update, ReviewReason.MISSING_REQUIRED_FIELD, "후속 대상이 누구인지 확인해줘.");
}

async function applyStatusChange(
  tx: DbClient,
  update: ExtractedUpdateRecord,
  payload: Record<string, unknown>,
  actorId?: string | null,
) {
  const member = await resolveMember(tx, update.churchId, [
    update.targetMemberHint,
    asString(payload.memberName),
  ]);
  if (!member) {
    return redirectToReview(tx, update, ReviewReason.AMBIGUOUS_MEMBER_MATCH, "상태를 바꿀 사람을 먼저 확인해줘.");
  }

  const nextStatusTag = asString(payload.statusTag);
  const requiresFollowUp = asBoolean(payload.requiresFollowUp);

  if (!nextStatusTag && requiresFollowUp === null) {
    return applyMemberCareRecord(tx, update, { ...payload, category: "NOTE", title: "상태 변화" }, actorId, CareCategory.NOTE, "상태 변화");
  }

  await tx.member.update({
    where: { id: member.id },
    data: {
      ...(nextStatusTag ? { statusTag: nextStatusTag } : {}),
      ...(requiresFollowUp !== null ? { requiresFollowUp } : {}),
    },
  });

  await createApplyResult(tx, update.id, "Member", member.id, {
    statusTag: nextStatusTag,
    requiresFollowUp,
  }, actorId);

  return { applied: true, entityType: "Member", entityId: member.id } satisfies ApplyOutcome;
}

async function applyRelationship(
  tx: DbClient,
  update: ExtractedUpdateRecord,
  payload: Record<string, unknown>,
  actorId?: string | null,
) {
  const fromMember = await resolveMember(tx, update.churchId, [
    asString(payload.fromMemberName),
    update.targetMemberHint,
    asString(payload.memberName),
  ]);
  const toMember = await resolveMember(tx, update.churchId, [
    asString(payload.toMemberName),
    asString(payload.relatedMemberName),
  ]);
  const relationshipType = parseRelationshipType(asString(payload.relationshipType));

  if (!fromMember || !toMember || !relationshipType || fromMember.id === toMember.id) {
    return redirectToReview(tx, update, ReviewReason.RELATIONSHIP_UNCERTAIN, "관계 연결 대상을 먼저 확인해줘.");
  }

  const existing = await tx.memberRelationship.findFirst({
    where: {
      churchId: update.churchId,
      relationshipType,
      OR: [
        { fromMemberId: fromMember.id, toMemberId: toMember.id },
        { fromMemberId: toMember.id, toMemberId: fromMember.id },
      ],
    },
    select: { id: true },
  });

  if (existing) {
    await createApplyResult(tx, update.id, "MemberRelationship", existing.id, {
      fromMemberId: fromMember.id,
      toMemberId: toMember.id,
      relationshipType,
      deduped: true,
    }, actorId);
    return { applied: true, entityType: "MemberRelationship", entityId: existing.id } satisfies ApplyOutcome;
  }

  const created = await tx.memberRelationship.create({
    data: {
      churchId: update.churchId,
      fromMemberId: fromMember.id,
      toMemberId: toMember.id,
      relationshipType,
      customRelationship: relationshipType === RelationshipType.CUSTOM ? asString(payload.customRelationship) : null,
      notes: asString(payload.rawText),
      isPrimaryFamilyLink: relationshipType === RelationshipType.SPOUSE,
    },
  });

  await createApplyResult(tx, update.id, "MemberRelationship", created.id, {
    fromMemberId: fromMember.id,
    toMemberId: toMember.id,
    relationshipType,
  }, actorId);

  return { applied: true, entityType: "MemberRelationship", entityId: created.id } satisfies ApplyOutcome;
}

async function applyChurchEvent(
  tx: DbClient,
  update: ExtractedUpdateRecord,
  payload: Record<string, unknown>,
  actorId?: string | null,
) {
  const member = await resolveMember(tx, update.churchId, [update.targetMemberHint, asString(payload.memberName)]);
  if (!member) {
    return redirectToReview(tx, update, ReviewReason.AMBIGUOUS_MEMBER_MATCH, "이벤트 대상 사람을 먼저 확인해줘.");
  }

  const sacramentType = parseSacramentType(asString(payload.sacramentType) ?? asString(payload.eventType));
  if (!sacramentType) {
    return applyMemberCareRecord(tx, update, { ...payload, category: "NOTE", title: "교회 이벤트" }, actorId, CareCategory.NOTE, "교회 이벤트");
  }

  const created = await tx.memberFaithMilestone.create({
    data: {
      churchId: update.churchId,
      memberId: member.id,
      type: sacramentType,
      customType: sacramentType === SacramentType.CUSTOM ? asString(payload.customType) ?? asString(payload.eventType) : null,
      happenedAt: asDate(payload.happenedAt),
      churchName: asString(payload.churchName),
      officiant: asString(payload.officiant),
      notes: firstNonEmpty(asString(payload.summary), asString(payload.rawText)),
    },
  });

  await createApplyResult(tx, update.id, "MemberFaithMilestone", created.id, {
    memberId: member.id,
    type: sacramentType,
  }, actorId);

  return { applied: true, entityType: "MemberFaithMilestone", entityId: created.id } satisfies ApplyOutcome;
}

async function applyHouseholdProfile(
  tx: DbClient,
  update: ExtractedUpdateRecord,
  payload: Record<string, unknown>,
  actorId?: string | null,
) {
  const household = await resolveHousehold(tx, update.churchId, [update.targetHouseholdHint, asString(payload.householdName)]);
  if (!household) {
    return redirectToReview(tx, update, ReviewReason.AMBIGUOUS_HOUSEHOLD_MATCH, "가정 대상을 먼저 확인해줘.");
  }

  const nextAddress = asString(payload.address);
  const nextSummary = firstNonEmpty(asString(payload.summary), asString(payload.rawText));
  const nextName = asString(payload.name);

  if (!nextAddress && !nextSummary && !nextName) {
    return redirectToReview(tx, update, ReviewReason.MISSING_REQUIRED_FIELD, "가정에 반영할 정보가 부족해.");
  }

  const meta = parseGidoHouseholdMeta(household.notes);
  await tx.household.update({
    where: { id: household.id },
    data: {
      ...(nextName ? { name: nextName } : {}),
      ...(nextAddress ? { address: nextAddress } : {}),
      notes: nextSummary
        ? updateGidoHouseholdMeta(household.notes, { contacts: appendUnique(meta.contacts ?? [], nextSummary) })
        : household.notes,
    },
  });

  await createApplyResult(tx, update.id, "Household", household.id, {
    name: nextName,
    address: nextAddress,
    summary: nextSummary,
  }, actorId);

  return { applied: true, entityType: "Household", entityId: household.id } satisfies ApplyOutcome;
}

async function applyMemberProfile(
  tx: DbClient,
  update: ExtractedUpdateRecord,
  payload: Record<string, unknown>,
  actorId?: string | null,
) {
  const member = await resolveMember(tx, update.churchId, [update.targetMemberHint, asString(payload.memberName)]);

  const patch = {
    ...(asString(payload.phone) ? { phone: asString(payload.phone)! } : {}),
    ...(asString(payload.email) ? { email: asString(payload.email) } : {}),
    ...(asString(payload.address) ? { address: asString(payload.address) } : {}),
    ...(asString(payload.currentJob) ? { currentJob: asString(payload.currentJob) } : {}),
  };

  if (member) {
    if (Object.keys(patch).length === 0) {
      return redirectToReview(tx, update, ReviewReason.MISSING_REQUIRED_FIELD, "사람 기본정보로 반영할 내용이 부족해.");
    }

    await tx.member.update({ where: { id: member.id }, data: patch });
    await createApplyResult(tx, update.id, "Member", member.id, patch, actorId);

    return { applied: true, entityType: "Member", entityId: member.id } satisfies ApplyOutcome;
  }

  if (asBoolean(payload.registrationIntent)) {
    const candidate = await tx.intakeCandidate.create({
      data: {
        churchId: update.churchId,
        extractedUpdateId: update.id,
        candidateType: IntakeCandidateType.MEMBER_REGISTRATION,
        proposedName: firstNonEmpty(asString(payload.proposedName), asString(payload.memberName), update.targetMemberHint),
        proposedPhone: asString(payload.proposedPhone) ?? asString(payload.phone),
        proposedBirthDate: asDate(payload.proposedBirthDate),
        proposedGender: parseGender(asString(payload.proposedGender)),
        proposedHouseholdName: firstNonEmpty(asString(payload.proposedHouseholdName), update.targetHouseholdHint),
        summary: firstNonEmpty(asString(payload.summary), update.sourceSummary, asString(payload.rawText)),
        payloadJson: payload as Prisma.InputJsonValue,
      },
    });

    await createApplyResult(tx, update.id, "IntakeCandidate", candidate.id, {
      candidateType: "MEMBER_REGISTRATION",
      proposedName: candidate.proposedName,
      proposedPhone: candidate.proposedPhone,
      proposedHouseholdName: candidate.proposedHouseholdName,
    }, actorId);

    return { applied: true, entityType: "IntakeCandidate", entityId: candidate.id } satisfies ApplyOutcome;
  }

  return redirectToReview(tx, update, ReviewReason.AMBIGUOUS_MEMBER_MATCH, "사람 대상을 먼저 확인해줘.");
}

export async function applyExtractedUpdate(
  tx: DbClient,
  extractedUpdateId: string,
  actorId?: string | null,
): Promise<ApplyOutcome> {
  const update = await tx.extractedUpdate.findUnique({
    where: { id: extractedUpdateId },
    include: { reviewItems: true },
  });

  if (!update) return { applied: false };

  const payload = asRecord(update.payloadJson);

  switch (update.updateType) {
    case "CARE_RECORD":
      return applyMemberCareRecord(tx, update, payload, actorId, CareCategory.HEALTH, "건강 기록");
    case "ATTENDANCE":
      return applyMemberCareRecord(tx, update, { ...payload, category: "ATTENDANCE", title: asString(payload.title) ?? "출석 변화" }, actorId, CareCategory.ATTENDANCE, "출석 변화");
    case "PRAYER":
      return applyPrayer(tx, update, payload, actorId);
    case "FOLLOW_UP":
      return applyFollowUp(tx, update, payload, actorId);
    case "STATUS_CHANGE":
      return applyStatusChange(tx, update, payload, actorId);
    case "RELATIONSHIP":
      return applyRelationship(tx, update, payload, actorId);
    case "CHURCH_EVENT":
      return applyChurchEvent(tx, update, payload, actorId);
    case "HOUSEHOLD_PROFILE":
      return applyHouseholdProfile(tx, update, payload, actorId);
    case "MEMBER_PROFILE":
      return applyMemberProfile(tx, update, payload, actorId);
    default:
      return redirectToReview(tx, update, ReviewReason.LOW_CONFIDENCE, "아직 자동 반영 규칙이 없는 타입이야. Review에서 확인해줘.");
  }
}
