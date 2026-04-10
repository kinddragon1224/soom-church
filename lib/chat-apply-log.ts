import { Prisma, RelationshipType, SacramentType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type AppliedRecordLogItem = {
  id: string;
  appliedAt: Date;
  updateType: string;
  updateTypeLabel: string;
  entityType: string | null;
  title: string;
  body: string;
  captureText: string;
  primaryMemberId: string | null;
  relatedMemberIds: string[];
  primaryHouseholdId: string | null;
  relatedHouseholdIds: string[];
};

function asRecord(value: Prisma.JsonValue | null | undefined) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {} as Record<string, unknown>;
  return value as Record<string, unknown>;
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function firstNonEmpty(...values: (string | null | undefined)[]) {
  return values.find((value) => typeof value === "string" && value.trim()) ?? null;
}

function uniqueStrings(values: (string | null | undefined)[]) {
  return [...new Set(values.filter((value): value is string => Boolean(value && value.trim())))] as string[];
}

function trimText(value: string, max = 180) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1)}…`;
}

function formatUpdateTypeLabel(type: string) {
  switch (type) {
    case "MEMBER_PROFILE":
      return "사람 정보";
    case "HOUSEHOLD_PROFILE":
      return "가정 정보";
    case "RELATIONSHIP":
      return "관계";
    case "PRAYER":
      return "기도";
    case "CARE_RECORD":
      return "돌봄 기록";
    case "ATTENDANCE":
      return "출석";
    case "CHURCH_EVENT":
      return "교회 이벤트";
    case "FOLLOW_UP":
      return "후속";
    case "STATUS_CHANGE":
      return "상태 변화";
    default:
      return type;
  }
}

function formatRelationshipLabel(type: RelationshipType, customRelationship?: string | null) {
  if (customRelationship?.trim()) return customRelationship.trim();
  switch (type) {
    case RelationshipType.SPOUSE:
      return "배우자";
    case RelationshipType.PARENT:
      return "부모";
    case RelationshipType.CHILD:
      return "자녀";
    case RelationshipType.SIBLING:
      return "형제자매";
    case RelationshipType.GRANDPARENT:
      return "조부모";
    case RelationshipType.GRANDCHILD:
      return "손자녀";
    case RelationshipType.GUARDIAN:
      return "보호자";
    case RelationshipType.RELATIVE:
      return "친인척";
    case RelationshipType.CAREGIVER:
      return "돌봄 담당";
    case RelationshipType.CUSTOM:
      return "직접 관계";
    default:
      return type;
  }
}

function formatSacramentLabel(type: SacramentType, customType?: string | null) {
  if (type === SacramentType.CUSTOM) return customType?.trim() || "교회 이벤트";
  switch (type) {
    case SacramentType.BAPTISM:
      return "침례";
    case SacramentType.INFANT_BAPTISM:
      return "유아세례/헌아";
    case SacramentType.CONFIRMATION:
      return "입교";
    case SacramentType.COMMUNION:
      return "성찬";
    case SacramentType.MEMBERSHIP_TRANSFER:
      return "등록/이명";
    default:
      return type;
  }
}

function buildMemberPatchSummary(patch: Record<string, unknown>) {
  const parts = [
    asString(patch.summary),
    asString(patch.phone) ? `연락처 ${asString(patch.phone)}` : null,
    asString(patch.email) ? `이메일 ${asString(patch.email)}` : null,
    asString(patch.address) ? `주소 ${asString(patch.address)}` : null,
    asString(patch.currentJob) ? `직업 ${asString(patch.currentJob)}` : null,
    asString(patch.statusTag) ? `상태 ${asString(patch.statusTag)}` : null,
    typeof patch.requiresFollowUp === "boolean" ? `후속 ${patch.requiresFollowUp ? "필요" : "해제"}` : null,
  ].filter(Boolean) as string[];

  return parts.join(" · ") || null;
}

function buildHouseholdPatchSummary(patch: Record<string, unknown>) {
  const parts = [
    asString(patch.prayer) ? `기도 ${asString(patch.prayer)}` : null,
    asString(patch.contact) ? `연락 ${asString(patch.contact)}` : null,
    asString(patch.summary),
    asString(patch.address) ? `주소 ${asString(patch.address)}` : null,
    asString(patch.name) ? `이름 ${asString(patch.name)}` : null,
  ].filter(Boolean) as string[];

  return parts.join(" · ") || null;
}

export async function getAppliedRecordLog(churchId: string, limit = 40): Promise<AppliedRecordLogItem[]> {
  const applyResults = await prisma.applyResult.findMany({
    where: {
      extractedUpdate: {
        is: { churchId },
      },
    },
    include: {
      extractedUpdate: {
        include: {
          capture: true,
        },
      },
    },
    orderBy: { appliedAt: "desc" },
    take: limit,
  });

  if (applyResults.length === 0) return [];

  const careRecordIds = uniqueStrings(
    applyResults
      .filter((item) => item.appliedEntityType === "MemberCareRecord")
      .map((item) => item.appliedEntityId),
  );
  const milestoneIds = uniqueStrings(
    applyResults
      .filter((item) => item.appliedEntityType === "MemberFaithMilestone")
      .map((item) => item.appliedEntityId),
  );
  const relationshipIds = uniqueStrings(
    applyResults
      .filter((item) => item.appliedEntityType === "MemberRelationship")
      .map((item) => item.appliedEntityId),
  );
  const memberIds = uniqueStrings(
    applyResults
      .filter((item) => item.appliedEntityType === "Member")
      .map((item) => item.appliedEntityId),
  );
  const householdIds = uniqueStrings(
    applyResults
      .filter((item) => item.appliedEntityType === "Household")
      .map((item) => item.appliedEntityId),
  );
  const intakeCandidateIds = uniqueStrings(
    applyResults
      .filter((item) => item.appliedEntityType === "IntakeCandidate")
      .map((item) => item.appliedEntityId),
  );

  const [careRecords, milestones, relationships, members, households, intakeCandidates] = await Promise.all([
    careRecordIds.length > 0
      ? prisma.memberCareRecord.findMany({
          where: { id: { in: careRecordIds } },
          select: {
            id: true,
            title: true,
            summary: true,
            details: true,
            member: {
              select: {
                id: true,
                name: true,
                householdId: true,
                household: { select: { id: true, name: true } },
              },
            },
          },
        })
      : Promise.resolve([]),
    milestoneIds.length > 0
      ? prisma.memberFaithMilestone.findMany({
          where: { id: { in: milestoneIds } },
          select: {
            id: true,
            type: true,
            customType: true,
            notes: true,
            member: {
              select: {
                id: true,
                name: true,
                householdId: true,
                household: { select: { id: true, name: true } },
              },
            },
          },
        })
      : Promise.resolve([]),
    relationshipIds.length > 0
      ? prisma.memberRelationship.findMany({
          where: { id: { in: relationshipIds } },
          select: {
            id: true,
            relationshipType: true,
            customRelationship: true,
            notes: true,
            fromMember: {
              select: {
                id: true,
                name: true,
                householdId: true,
                household: { select: { id: true, name: true } },
              },
            },
            toMember: {
              select: {
                id: true,
                name: true,
                householdId: true,
                household: { select: { id: true, name: true } },
              },
            },
          },
        })
      : Promise.resolve([]),
    memberIds.length > 0
      ? prisma.member.findMany({
          where: { id: { in: memberIds } },
          select: {
            id: true,
            name: true,
            statusTag: true,
            requiresFollowUp: true,
            householdId: true,
            household: { select: { id: true, name: true } },
          },
        })
      : Promise.resolve([]),
    householdIds.length > 0
      ? prisma.household.findMany({
          where: { id: { in: householdIds } },
          select: {
            id: true,
            name: true,
            address: true,
          },
        })
      : Promise.resolve([]),
    intakeCandidateIds.length > 0
      ? prisma.intakeCandidate.findMany({
          where: { id: { in: intakeCandidateIds } },
          select: {
            id: true,
            candidateType: true,
            proposedName: true,
            proposedPhone: true,
            proposedHouseholdName: true,
            summary: true,
          },
        })
      : Promise.resolve([]),
  ]);

  const careRecordById = new Map(careRecords.map((item) => [item.id, item]));
  const milestoneById = new Map(milestones.map((item) => [item.id, item]));
  const relationshipById = new Map(relationships.map((item) => [item.id, item]));
  const memberById = new Map(members.map((item) => [item.id, item]));
  const householdById = new Map(households.map((item) => [item.id, item]));
  const intakeCandidateById = new Map(intakeCandidates.map((item) => [item.id, item]));

  return applyResults.map((result) => {
    const patch = asRecord(result.appliedPatchJson);
    const captureText = trimText(result.extractedUpdate.capture.rawText, 220);
    const sourceSummary = firstNonEmpty(asString(patch.summary), result.extractedUpdate.sourceSummary, captureText) ?? "최근 반영 기록";
    const fallback = {
      title: `${formatUpdateTypeLabel(result.extractedUpdate.updateType)} 반영`,
      body: trimText(sourceSummary),
      primaryMemberId: null as string | null,
      relatedMemberIds: [] as string[],
      primaryHouseholdId: null as string | null,
      relatedHouseholdIds: [] as string[],
    };

    if (result.appliedEntityType === "MemberCareRecord" && result.appliedEntityId) {
      const record = careRecordById.get(result.appliedEntityId);
      if (record) {
        return {
          id: result.id,
          appliedAt: result.appliedAt,
          updateType: result.extractedUpdate.updateType,
          updateTypeLabel: formatUpdateTypeLabel(result.extractedUpdate.updateType),
          entityType: result.appliedEntityType,
          title: `${record.member.name} · ${record.title}`,
          body: trimText(firstNonEmpty(record.summary, record.details, sourceSummary) ?? sourceSummary),
          captureText,
          primaryMemberId: record.member.id,
          relatedMemberIds: [record.member.id],
          primaryHouseholdId: record.member.householdId ?? null,
          relatedHouseholdIds: uniqueStrings([record.member.householdId ?? null]),
        };
      }
    }

    if (result.appliedEntityType === "MemberFaithMilestone" && result.appliedEntityId) {
      const milestone = milestoneById.get(result.appliedEntityId);
      if (milestone) {
        const eventLabel = formatSacramentLabel(milestone.type, milestone.customType);
        return {
          id: result.id,
          appliedAt: result.appliedAt,
          updateType: result.extractedUpdate.updateType,
          updateTypeLabel: formatUpdateTypeLabel(result.extractedUpdate.updateType),
          entityType: result.appliedEntityType,
          title: `${milestone.member.name} · ${eventLabel}`,
          body: trimText(firstNonEmpty(milestone.notes, sourceSummary) ?? sourceSummary),
          captureText,
          primaryMemberId: milestone.member.id,
          relatedMemberIds: [milestone.member.id],
          primaryHouseholdId: milestone.member.householdId ?? null,
          relatedHouseholdIds: uniqueStrings([milestone.member.householdId ?? null]),
        };
      }
    }

    if (result.appliedEntityType === "MemberRelationship" && result.appliedEntityId) {
      const relationship = relationshipById.get(result.appliedEntityId);
      if (relationship) {
        const sharedHouseholdId = relationship.fromMember.householdId && relationship.fromMember.householdId === relationship.toMember.householdId
          ? relationship.fromMember.householdId
          : null;

        return {
          id: result.id,
          appliedAt: result.appliedAt,
          updateType: result.extractedUpdate.updateType,
          updateTypeLabel: formatUpdateTypeLabel(result.extractedUpdate.updateType),
          entityType: result.appliedEntityType,
          title: `${relationship.fromMember.name} · ${formatRelationshipLabel(relationship.relationshipType, relationship.customRelationship)} · ${relationship.toMember.name}`,
          body: trimText(firstNonEmpty(relationship.notes, sourceSummary) ?? sourceSummary),
          captureText,
          primaryMemberId: relationship.fromMember.id,
          relatedMemberIds: uniqueStrings([relationship.fromMember.id, relationship.toMember.id]),
          primaryHouseholdId: sharedHouseholdId,
          relatedHouseholdIds: uniqueStrings([relationship.fromMember.householdId ?? null, relationship.toMember.householdId ?? null]),
        };
      }
    }

    if (result.appliedEntityType === "Member" && result.appliedEntityId) {
      const member = memberById.get(result.appliedEntityId);
      if (member) {
        return {
          id: result.id,
          appliedAt: result.appliedAt,
          updateType: result.extractedUpdate.updateType,
          updateTypeLabel: formatUpdateTypeLabel(result.extractedUpdate.updateType),
          entityType: result.appliedEntityType,
          title: `${member.name} · ${formatUpdateTypeLabel(result.extractedUpdate.updateType)}`,
          body: trimText(firstNonEmpty(buildMemberPatchSummary(patch), sourceSummary) ?? sourceSummary),
          captureText,
          primaryMemberId: member.id,
          relatedMemberIds: [member.id],
          primaryHouseholdId: member.householdId ?? null,
          relatedHouseholdIds: uniqueStrings([member.householdId ?? null]),
        };
      }
    }

    if (result.appliedEntityType === "Household" && result.appliedEntityId) {
      const household = householdById.get(result.appliedEntityId);
      if (household) {
        return {
          id: result.id,
          appliedAt: result.appliedAt,
          updateType: result.extractedUpdate.updateType,
          updateTypeLabel: formatUpdateTypeLabel(result.extractedUpdate.updateType),
          entityType: result.appliedEntityType,
          title: `${household.name} · ${formatUpdateTypeLabel(result.extractedUpdate.updateType)}`,
          body: trimText(firstNonEmpty(buildHouseholdPatchSummary(patch), household.address, sourceSummary) ?? sourceSummary),
          captureText,
          primaryMemberId: null,
          relatedMemberIds: [],
          primaryHouseholdId: household.id,
          relatedHouseholdIds: [household.id],
        };
      }
    }

    if (result.appliedEntityType === "IntakeCandidate" && result.appliedEntityId) {
      const candidate = intakeCandidateById.get(result.appliedEntityId);
      if (candidate) {
        return {
          id: result.id,
          appliedAt: result.appliedAt,
          updateType: result.extractedUpdate.updateType,
          updateTypeLabel: "등록 후보",
          entityType: result.appliedEntityType,
          title: `${candidate.proposedName ?? "이름 미상"} · 등록 후보`,
          body: trimText(firstNonEmpty(candidate.summary, candidate.proposedPhone ? `연락처 ${candidate.proposedPhone}` : null, candidate.proposedHouseholdName ? `가정 ${candidate.proposedHouseholdName}` : null, sourceSummary) ?? sourceSummary),
          captureText,
          primaryMemberId: null,
          relatedMemberIds: [],
          primaryHouseholdId: null,
          relatedHouseholdIds: [],
        };
      }
    }

    return {
      id: result.id,
      appliedAt: result.appliedAt,
      updateType: result.extractedUpdate.updateType,
      updateTypeLabel: formatUpdateTypeLabel(result.extractedUpdate.updateType),
      entityType: result.appliedEntityType,
      title: fallback.title,
      body: fallback.body,
      captureText,
      primaryMemberId: fallback.primaryMemberId,
      relatedMemberIds: fallback.relatedMemberIds,
      primaryHouseholdId: fallback.primaryHouseholdId,
      relatedHouseholdIds: fallback.relatedHouseholdIds,
    };
  });
}
