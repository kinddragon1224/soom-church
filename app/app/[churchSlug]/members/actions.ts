"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CareCategory, Gender, IntakeCandidateStatus, MemberOrgRole, RelationshipType, SacramentType } from "@prisma/client";
import { updateGidoMemberMeta } from "@/lib/gido-home-config";
import { getStatusUpdatePatch } from "@/lib/member-status";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceMembership } from "@/lib/church-context";

function asOptionalString(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text || null;
}

function parseDate(value: FormDataEntryValue | null, fallback = new Date()) {
  const text = String(value || "").trim();
  return text ? new Date(text) : fallback;
}

function asFamilyRole(value: FormDataEntryValue | null) {
  const role = String(value || "").trim();
  if (role === "SELF" || role === "SPOUSE" || role === "CHILD" || role === "FAMILY") return role;
  return undefined;
}

async function getScopedMember(churchSlug: string, memberId: string) {
  const { membership, userId } = await requireWorkspaceMembership(churchSlug);
  if (!membership) return null;

  const member = await prisma.member.findFirst({
    where: { id: memberId, churchId: membership.church.id },
  });
  if (!member) return null;

  return { membership, userId, member };
}

function getMemberPayload(formData: FormData, churchId: string) {
  return {
    churchId,
    name: String(formData.get("name") || "").trim(),
    gender: String(formData.get("gender") || "OTHER").trim() as any,
    birthDate: parseDate(formData.get("birthDate")),
    phone: String(formData.get("phone") || "").trim(),
    email: asOptionalString(formData.get("email")),
    address: asOptionalString(formData.get("address")),
    householdId: asOptionalString(formData.get("householdId")),
    districtId: asOptionalString(formData.get("districtId")),
    groupId: asOptionalString(formData.get("groupId")),
    registeredAt: parseDate(formData.get("registeredAt")),
    position: asOptionalString(formData.get("position")),
    statusTag: String(formData.get("statusTag") || "등록대기").trim(),
    requiresFollowUp: formData.get("requiresFollowUp") === "on",
    notes: asOptionalString(formData.get("notes")),
    currentJob: asOptionalString(formData.get("currentJob")),
    previousChurch: asOptionalString(formData.get("previousChurch")),
    previousFaith: asOptionalString(formData.get("previousFaith")),
    baptismStatus: asOptionalString(formData.get("baptismStatus")),
  };
}

async function refreshMemberView(churchId: string, memberId: string) {
  revalidateTag(`church:${churchId}:member:${memberId}`);
  revalidateTag(`church:${churchId}:members`);
  revalidateTag(`church:${churchId}:dashboard`);
  revalidateTag(`church:${churchId}:organizations`);
}

async function inferPlacementFromGroupAndHousehold(
  churchId: string,
  {
    householdId,
    groupId,
    districtId,
  }: {
    householdId: string | null;
    groupId: string | null;
    districtId: string | null;
  },
) {
  let nextGroupId = groupId;
  let nextDistrictId = districtId;

  if (nextGroupId) {
    const group = await prisma.group.findFirst({
      where: { id: nextGroupId, churchId },
      select: { id: true, districtId: true },
    });

    if (group) {
      nextGroupId = group.id;
      nextDistrictId = group.districtId;
    } else {
      nextGroupId = null;
    }
  }

  if (householdId && (!nextGroupId || !nextDistrictId)) {
    const sampleMember = await prisma.member.findFirst({
      where: {
        churchId,
        householdId,
        isDeleted: false,
        OR: [{ groupId: { not: null } }, { districtId: { not: null } }],
      },
      orderBy: [{ createdAt: "asc" }],
      select: { groupId: true, districtId: true },
    });

    if (!nextGroupId) nextGroupId = sampleMember?.groupId ?? null;
    if (!nextDistrictId) nextDistrictId = sampleMember?.districtId ?? null;
  }

  if (nextGroupId && !nextDistrictId) {
    const group = await prisma.group.findFirst({
      where: { id: nextGroupId, churchId },
      select: { districtId: true },
    });
    nextDistrictId = group?.districtId ?? null;
  }

  return {
    groupId: nextGroupId,
    districtId: nextDistrictId,
  };
}

export async function createWorkspaceMember(churchSlug: string, formData: FormData) {
  const { membership, userId } = await requireWorkspaceMembership(churchSlug);
  if (!membership) return;

  const data = getMemberPayload(formData, membership.church.id);
  if (!data.name || !data.phone) return;

  const created = await prisma.member.create({ data });
  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_CREATED",
      targetType: "Member",
      targetId: created.id,
      memberId: created.id,
    },
  });

  await refreshMemberView(membership.church.id, created.id);
  redirect(`/app/${churchSlug}/members/${created.id}/summary`);
}

export async function createQuickWorkspaceMember(churchSlug: string, returnPath: string, formData: FormData) {
  const { membership, userId } = await requireWorkspaceMembership(churchSlug);
  if (!membership) redirect(returnPath);

  const name = String(formData.get("name") || "").trim();
  const birthDateInput = String(formData.get("birthDate") || "").trim();
  const householdId = asOptionalString(formData.get("householdId"));
  const groupIdInput = asOptionalString(formData.get("groupId"));
  const phone = String(formData.get("phone") || "").trim();
  const familyRole = asFamilyRole(formData.get("familyRole"));

  if (!name || !birthDateInput) redirect(returnPath);

  const placement = await inferPlacementFromGroupAndHousehold(membership.church.id, {
    householdId,
    groupId: groupIdInput,
    districtId: null,
  });

  const created = await prisma.member.create({
    data: {
      churchId: membership.church.id,
      name,
      gender: String(formData.get("gender") || "OTHER").trim() as any,
      birthDate: parseDate(formData.get("birthDate")),
      phone,
      email: null,
      address: null,
      householdId,
      districtId: placement.districtId,
      groupId: placement.groupId,
      registeredAt: new Date(),
      position: asOptionalString(formData.get("position")),
      statusTag: "등록대기",
      requiresFollowUp: formData.get("requiresFollowUp") === "on",
      notes: familyRole ? updateGidoMemberMeta(null, { familyRole }) : null,
      currentJob: null,
      previousChurch: null,
      previousFaith: null,
      baptismStatus: null,
    },
  });

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_CREATED",
      targetType: "Member",
      targetId: created.id,
      memberId: created.id,
      metadata: JSON.stringify({ mode: "quick" }),
    },
  });

  await refreshMemberView(membership.church.id, created.id);
  redirect(returnPath);
}

export async function confirmIntakeCandidateAsMember(churchSlug: string, returnPath: string, formData: FormData) {
  const { membership, userId } = await requireWorkspaceMembership(churchSlug);
  if (!membership) redirect(returnPath);

  const candidateId = String(formData.get("candidateId") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const birthDateInput = String(formData.get("birthDate") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const householdId = asOptionalString(formData.get("householdId"));
  const groupIdInput = asOptionalString(formData.get("groupId"));
  const genderInput = String(formData.get("gender") || "OTHER").trim();

  if (!candidateId || !name || !birthDateInput) redirect(returnPath);

  const candidate = await prisma.intakeCandidate.findFirst({
    where: { id: candidateId, churchId: membership.church.id },
    select: { id: true, proposedHouseholdName: true },
  });
  if (!candidate) redirect(returnPath);

  let resolvedHouseholdId = householdId;
  if (!resolvedHouseholdId && candidate.proposedHouseholdName) {
    const household = await prisma.household.findFirst({
      where: { churchId: membership.church.id, name: candidate.proposedHouseholdName },
      select: { id: true },
    });
    resolvedHouseholdId = household?.id ?? null;
  }

  const placement = await inferPlacementFromGroupAndHousehold(membership.church.id, {
    householdId: resolvedHouseholdId,
    groupId: groupIdInput,
    districtId: null,
  });

  const gender = genderInput === "MALE"
    ? Gender.MALE
    : genderInput === "FEMALE"
      ? Gender.FEMALE
      : Gender.OTHER;

  const created = await prisma.member.create({
    data: {
      churchId: membership.church.id,
      name,
      gender,
      birthDate: parseDate(formData.get("birthDate")),
      phone,
      email: null,
      address: null,
      householdId: resolvedHouseholdId,
      districtId: placement.districtId,
      groupId: placement.groupId,
      registeredAt: new Date(),
      position: null,
      statusTag: "등록대기",
      requiresFollowUp: false,
      notes: null,
      currentJob: null,
      previousChurch: null,
      previousFaith: null,
      baptismStatus: null,
    },
  });

  await prisma.intakeCandidate.update({
    where: { id: candidate.id },
    data: { status: IntakeCandidateStatus.CONFIRMED },
  });

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_CREATED_FROM_INTAKE",
      targetType: "Member",
      targetId: created.id,
      memberId: created.id,
      metadata: JSON.stringify({ candidateId: candidate.id }),
    },
  });

  await refreshMemberView(membership.church.id, created.id);
  redirect(returnPath);
}

export async function updateWorkspaceMember(churchSlug: string, memberId: string, formData: FormData) {
  const scoped = await getScopedMember(churchSlug, memberId);
  if (!scoped) return;

  const { membership, userId, member } = scoped;
  const data = getMemberPayload(formData, membership.church.id);
  if (!data.name || !data.phone) return;

  const updated = await prisma.member.update({ where: { id: member.id }, data });
  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_UPDATED",
      targetType: "Member",
      targetId: updated.id,
      memberId: updated.id,
    },
  });

  await refreshMemberView(membership.church.id, updated.id);
  redirect(`/app/${churchSlug}/members/${updated.id}/summary`);
}

export async function updateMemberStatus(churchSlug: string, memberId: string, formData: FormData) {
  const scoped = await getScopedMember(churchSlug, memberId);
  if (!scoped) return;

  const { membership, userId, member } = scoped;
  const statusTag = String(formData.get("statusTag") || "").trim();
  const requiresFollowUp = formData.get("requiresFollowUp") === "on";
  if (!statusTag) return;

  await prisma.member.update({
    where: { id: member.id },
    data: getStatusUpdatePatch(statusTag, requiresFollowUp),
  });

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_STATUS_UPDATED",
      targetType: "Member",
      targetId: member.id,
      memberId: member.id,
      metadata: JSON.stringify({ statusTag, requiresFollowUp }),
    },
  });

  await refreshMemberView(membership.church.id, member.id);
  redirect(`/app/${churchSlug}/members/${member.id}/summary`);
}

export async function advanceMemberStatus(churchSlug: string, memberId: string) {
  const scoped = await getScopedMember(churchSlug, memberId);
  if (!scoped) return;

  const { membership, userId, member } = scoped;
  const nextStatusMap: Record<string, string> = {
    등록대기: "새가족",
    새가족: "정착중",
    정착중: "목장배정완료",
    목장배정완료: "봉사연결",
    봉사연결: "봉사연결",
    휴면: "새가족",
    심방필요: "정착중",
  };
  const nextStatus = nextStatusMap[member.statusTag] ?? member.statusTag;

  await prisma.member.update({
    where: { id: member.id },
    data: getStatusUpdatePatch(nextStatus, member.requiresFollowUp),
  });

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_STATUS_ADVANCED",
      targetType: "Member",
      targetId: member.id,
      memberId: member.id,
      metadata: JSON.stringify({ from: member.statusTag, to: nextStatus }),
    },
  });

  await refreshMemberView(membership.church.id, member.id);
  redirect(`/app/${churchSlug}/members/${member.id}/summary`);
}

export async function softDeleteMember(churchSlug: string, memberId: string) {
  const scoped = await getScopedMember(churchSlug, memberId);
  if (!scoped) return;

  const { membership, userId, member } = scoped;

  await prisma.member.update({ where: { id: member.id }, data: { isDeleted: true } });
  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_SOFT_DELETED",
      targetType: "Member",
      targetId: member.id,
      memberId: member.id,
    },
  });

  await refreshMemberView(membership.church.id, member.id);
  redirect(`/app/${churchSlug}/members`);
}

export async function restoreMember(churchSlug: string, memberId: string) {
  const scoped = await getScopedMember(churchSlug, memberId);
  if (!scoped) return;

  const { membership, userId, member } = scoped;

  await prisma.member.update({ where: { id: member.id }, data: { isDeleted: false } });
  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_RESTORED",
      targetType: "Member",
      targetId: member.id,
      memberId: member.id,
    },
  });

  await refreshMemberView(membership.church.id, member.id);
  redirect(`/app/${churchSlug}/members/${member.id}`);
}

export async function addCareRecord(churchSlug: string, memberId: string, formData: FormData) {
  const scoped = await getScopedMember(churchSlug, memberId);
  if (!scoped) return;

  const { membership, userId, member } = scoped;
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "VISIT").trim() as CareCategory;
  const summary = asOptionalString(formData.get("summary"));
  const happenedAt = parseDate(formData.get("happenedAt"));

  if (!title) return;

  await prisma.memberCareRecord.create({
    data: {
      churchId: membership.church.id,
      memberId: member.id,
      category,
      title,
      summary,
      happenedAt,
      recordedBy: userId,
    },
  });

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_CARE_RECORDED",
      targetType: "MemberCareRecord",
      targetId: member.id,
      memberId: member.id,
    },
  });

  await refreshMemberView(membership.church.id, member.id);
  redirect(`/app/${churchSlug}/members/${member.id}`);
}

export async function addAttendanceRecord(churchSlug: string, memberId: string, formData: FormData) {
  const scoped = await getScopedMember(churchSlug, memberId);
  if (!scoped) return;

  const { membership, userId, member } = scoped;
  const attendanceType = String(formData.get("attendanceType") || "주일예배").trim();
  const attendanceStatus = String(formData.get("attendanceStatus") || "출석").trim();
  const summary = asOptionalString(formData.get("summary"));
  const happenedAt = parseDate(formData.get("happenedAt"));

  await prisma.memberCareRecord.create({
    data: {
      churchId: membership.church.id,
      memberId: member.id,
      category: CareCategory.ATTENDANCE,
      title: `${attendanceType} · ${attendanceStatus}`,
      summary,
      happenedAt,
      recordedBy: userId,
    },
  });

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_ATTENDANCE_RECORDED",
      targetType: "MemberCareRecord",
      targetId: member.id,
      memberId: member.id,
      metadata: JSON.stringify({ attendanceType, attendanceStatus }),
    },
  });

  await refreshMemberView(membership.church.id, member.id);
  redirect(`/app/${churchSlug}/members/${member.id}`);
}

export async function addMinistryRecord(churchSlug: string, memberId: string, formData: FormData) {
  const scoped = await getScopedMember(churchSlug, memberId);
  if (!scoped) return;

  const { membership, userId, member } = scoped;
  const ministryName = String(formData.get("ministryName") || "").trim();
  const ministryRole = String(formData.get("ministryRole") || "참여").trim();
  const summary = asOptionalString(formData.get("summary"));
  const happenedAt = parseDate(formData.get("happenedAt"));

  if (!ministryName) return;

  await prisma.memberCareRecord.create({
    data: {
      churchId: membership.church.id,
      memberId: member.id,
      category: CareCategory.MINISTRY,
      title: `${ministryName} · ${ministryRole}`,
      summary,
      happenedAt,
      recordedBy: userId,
    },
  });

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_MINISTRY_RECORDED",
      targetType: "MemberCareRecord",
      targetId: member.id,
      memberId: member.id,
      metadata: JSON.stringify({ ministryName, ministryRole }),
    },
  });

  await refreshMemberView(membership.church.id, member.id);
  redirect(`/app/${churchSlug}/members/${member.id}`);
}

export async function addFaithMilestone(churchSlug: string, memberId: string, formData: FormData) {
  const scoped = await getScopedMember(churchSlug, memberId);
  if (!scoped) return;

  const { membership, userId, member } = scoped;
  const type = String(formData.get("type") || "BAPTISM").trim() as SacramentType;
  const happenedAtInput = String(formData.get("happenedAt") || "").trim();
  const churchName = asOptionalString(formData.get("churchName"));
  const officiant = asOptionalString(formData.get("officiant"));
  const notes = asOptionalString(formData.get("notes"));

  await prisma.memberFaithMilestone.create({
    data: {
      churchId: membership.church.id,
      memberId: member.id,
      type,
      happenedAt: happenedAtInput ? new Date(happenedAtInput) : null,
      churchName,
      officiant,
      notes,
    },
  });

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_FAITH_MILESTONE_RECORDED",
      targetType: "MemberFaithMilestone",
      targetId: member.id,
      memberId: member.id,
      metadata: JSON.stringify({ type }),
    },
  });

  await refreshMemberView(membership.church.id, member.id);
  redirect(`/app/${churchSlug}/members/${member.id}`);
}

export async function createFamilyLink(churchSlug: string, memberId: string, formData: FormData) {
  const scoped = await getScopedMember(churchSlug, memberId);
  if (!scoped) return;

  const { membership, userId, member } = scoped;
  const relatedMemberId = String(formData.get("relatedMemberId") || "").trim();
  const relationshipType = String(formData.get("relationshipType") || "CUSTOM").trim() as RelationshipType;
  const customRelationship = asOptionalString(formData.get("customRelationship"));
  const notes = asOptionalString(formData.get("notes"));

  if (!relatedMemberId || relatedMemberId === member.id) return;

  const relatedMember = await prisma.member.findFirst({
    where: { id: relatedMemberId, churchId: membership.church.id, isDeleted: false },
    select: { id: true, name: true },
  });
  if (!relatedMember) return;

  const existing = await prisma.memberRelationship.findFirst({
    where: {
      churchId: membership.church.id,
      relationshipType,
      OR: [
        { fromMemberId: member.id, toMemberId: relatedMember.id },
        { fromMemberId: relatedMember.id, toMemberId: member.id },
      ],
    },
  });

  if (!existing) {
    await prisma.memberRelationship.create({
      data: {
        churchId: membership.church.id,
        fromMemberId: member.id,
        toMemberId: relatedMember.id,
        relationshipType,
        customRelationship,
        notes,
      },
    });
  }

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_FAMILY_LINK_CREATED",
      targetType: "MemberRelationship",
      targetId: member.id,
      memberId: member.id,
      metadata: JSON.stringify({ relatedMemberId, relationshipType }),
    },
  });

  await refreshMemberView(membership.church.id, member.id);
  redirect(`/app/${churchSlug}/members/${member.id}`);
}

export async function updateFamilyLink(churchSlug: string, memberId: string, formData: FormData) {
  const scoped = await getScopedMember(churchSlug, memberId);
  if (!scoped) return;

  const { membership, userId, member } = scoped;
  const relationshipId = String(formData.get("relationshipId") || "").trim();
  const relationshipType = String(formData.get("relationshipType") || "CUSTOM").trim() as RelationshipType;
  const customRelationship = asOptionalString(formData.get("customRelationship"));
  const notes = asOptionalString(formData.get("notes"));

  if (!relationshipId) return;

  const relationship = await prisma.memberRelationship.findFirst({
    where: {
      id: relationshipId,
      churchId: membership.church.id,
      OR: [{ fromMemberId: member.id }, { toMemberId: member.id }],
    },
  });
  if (!relationship) return;

  await prisma.memberRelationship.update({
    where: { id: relationship.id },
    data: { relationshipType, customRelationship, notes },
  });

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_FAMILY_LINK_UPDATED",
      targetType: "MemberRelationship",
      targetId: relationship.id,
      memberId: member.id,
    },
  });

  await refreshMemberView(membership.church.id, member.id);
  redirect(`/app/${churchSlug}/members/${member.id}`);
}

export async function removeFamilyLink(churchSlug: string, memberId: string, formData: FormData) {
  const scoped = await getScopedMember(churchSlug, memberId);
  if (!scoped) return;

  const { membership, userId, member } = scoped;
  const relationshipId = String(formData.get("relationshipId") || "").trim();
  if (!relationshipId) return;

  const relationship = await prisma.memberRelationship.findFirst({
    where: {
      id: relationshipId,
      churchId: membership.church.id,
      OR: [{ fromMemberId: member.id }, { toMemberId: member.id }],
    },
  });
  if (!relationship) return;

  await prisma.memberRelationship.delete({ where: { id: relationship.id } });
  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_FAMILY_LINK_REMOVED",
      targetType: "MemberRelationship",
      targetId: relationship.id,
      memberId: member.id,
    },
  });

  await refreshMemberView(membership.church.id, member.id);
  redirect(`/app/${churchSlug}/members/${member.id}`);
}

export async function addOrganizationMembership(churchSlug: string, memberId: string, formData: FormData) {
  const scoped = await getScopedMember(churchSlug, memberId);
  if (!scoped) return;

  const { membership, userId, member } = scoped;
  const organizationId = String(formData.get("organizationId") || "").trim();
  const role = String(formData.get("role") || "MEMBER").trim() as MemberOrgRole;
  const customRoleLabel = asOptionalString(formData.get("customRoleLabel"));
  const notes = asOptionalString(formData.get("notes"));
  const isPrimary = formData.get("isPrimary") === "on";

  if (!organizationId) return;

  const organization = await prisma.organizationUnit.findFirst({
    where: { id: organizationId, churchId: membership.church.id },
    select: { id: true, name: true },
  });
  if (!organization) return;

  const existing = await prisma.memberOrganization.findFirst({
    where: { churchId: membership.church.id, memberId: member.id, organizationId: organization.id },
  });

  if (isPrimary) {
    await prisma.memberOrganization.updateMany({
      where: { churchId: membership.church.id, memberId: member.id },
      data: { isPrimary: false },
    });
  }

  if (existing) {
    await prisma.memberOrganization.update({
      where: { id: existing.id },
      data: { role, customRoleLabel, notes, isPrimary },
    });
  } else {
    await prisma.memberOrganization.create({
      data: {
        churchId: membership.church.id,
        memberId: member.id,
        organizationId: organization.id,
        role,
        customRoleLabel,
        notes,
        isPrimary,
      },
    });
  }

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_ORGANIZATION_LINK_CREATED",
      targetType: "MemberOrganization",
      targetId: member.id,
      memberId: member.id,
      metadata: JSON.stringify({ organizationId, role }),
    },
  });

  await refreshMemberView(membership.church.id, member.id);
  redirect(`/app/${churchSlug}/members/${member.id}`);
}

export async function updateOrganizationMembership(churchSlug: string, memberId: string, formData: FormData) {
  const scoped = await getScopedMember(churchSlug, memberId);
  if (!scoped) return;

  const { membership, userId, member } = scoped;
  const linkId = String(formData.get("linkId") || "").trim();
  const role = String(formData.get("role") || "MEMBER").trim() as MemberOrgRole;
  const customRoleLabel = asOptionalString(formData.get("customRoleLabel"));
  const notes = asOptionalString(formData.get("notes"));
  const isPrimary = formData.get("isPrimary") === "on";

  if (!linkId) return;

  const link = await prisma.memberOrganization.findFirst({
    where: { id: linkId, churchId: membership.church.id, memberId: member.id },
  });
  if (!link) return;

  if (isPrimary) {
    await prisma.memberOrganization.updateMany({
      where: { churchId: membership.church.id, memberId: member.id },
      data: { isPrimary: false },
    });
  }

  await prisma.memberOrganization.update({
    where: { id: link.id },
    data: { role, customRoleLabel, notes, isPrimary },
  });

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_ORGANIZATION_LINK_UPDATED",
      targetType: "MemberOrganization",
      targetId: link.id,
      memberId: member.id,
    },
  });

  await refreshMemberView(membership.church.id, member.id);
  redirect(`/app/${churchSlug}/members/${member.id}`);
}

export async function removeOrganizationMembership(churchSlug: string, memberId: string, formData: FormData) {
  const scoped = await getScopedMember(churchSlug, memberId);
  if (!scoped) return;

  const { membership, userId, member } = scoped;
  const linkId = String(formData.get("linkId") || "").trim();
  if (!linkId) return;

  const link = await prisma.memberOrganization.findFirst({
    where: { id: linkId, churchId: membership.church.id, memberId: member.id },
  });
  if (!link) return;

  await prisma.memberOrganization.delete({ where: { id: link.id } });
  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_ORGANIZATION_LINK_REMOVED",
      targetType: "MemberOrganization",
      targetId: link.id,
      memberId: member.id,
    },
  });

  await refreshMemberView(membership.church.id, member.id);
  redirect(`/app/${churchSlug}/members/${member.id}`);
}
