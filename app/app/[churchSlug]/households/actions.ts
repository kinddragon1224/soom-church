"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { RelationshipType } from "@prisma/client";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { parseGidoMemberMeta, updateGidoHouseholdMeta, updateGidoMemberMeta } from "@/lib/gido-home-config";
import { prisma } from "@/lib/prisma";

function asOptionalString(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text || null;
}

function parseLines(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function asFamilyRole(value: FormDataEntryValue | null) {
  const role = String(value || "").trim();
  if (role === "SELF" || role === "SPOUSE" || role === "CHILD" || role === "FAMILY") return role;
  return null;
}

function asRelationshipType(value: FormDataEntryValue | null) {
  const type = String(value || "").trim();
  if (
    type === RelationshipType.SPOUSE ||
    type === RelationshipType.PARENT ||
    type === RelationshipType.CHILD ||
    type === RelationshipType.SIBLING ||
    type === RelationshipType.GRANDPARENT ||
    type === RelationshipType.GRANDCHILD ||
    type === RelationshipType.GUARDIAN ||
    type === RelationshipType.RELATIVE ||
    type === RelationshipType.CAREGIVER ||
    type === RelationshipType.CUSTOM
  ) {
    return type;
  }
  return null;
}

function revalidateGidoViews(churchId: string) {
  revalidateTag(`church:${churchId}:members`);
  revalidateTag(`church:${churchId}:dashboard`);
  revalidateTag(`church:${churchId}:households`);
}

export async function updateGidoHouseholdSettings(churchSlug: string, returnPath: string, formData: FormData) {
  const householdId = String(formData.get("householdId") || "").trim();
  if (!householdId) redirect(returnPath);

  const prayerOrderInput = String(formData.get("prayerOrder") || "").trim();
  const prayerOrder = prayerOrderInput ? Number(prayerOrderInput) : null;

  const { membership } = await requireWorkspaceMembership(churchSlug);
  if (!membership) redirect(returnPath);

  const household = await prisma.household.findFirst({
    where: { id: householdId, churchId: membership.church.id },
    select: { id: true, churchId: true, notes: true },
  });
  if (!household) redirect(returnPath);

  await prisma.household.update({
    where: { id: household.id },
    data: {
      notes: updateGidoHouseholdMeta(household.notes, {
        prayerOrder: Number.isFinite(prayerOrder) ? prayerOrder : null,
        prayers: parseLines(formData.get("prayers")),
        contacts: parseLines(formData.get("contacts")),
      }),
    },
  });

  revalidateGidoViews(membership.church.id);
  redirect(returnPath);
}

export async function createGidoHouseholdSpouse(churchSlug: string, returnPath: string, formData: FormData) {
  const householdId = String(formData.get("householdId") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const birthDateInput = String(formData.get("birthDate") || "").trim();
  const partnerMemberId = String(formData.get("partnerMemberId") || "").trim();
  const gender = String(formData.get("gender") || "OTHER").trim() as any;
  const phone = String(formData.get("phone") || "").trim();

  if (!householdId || !name || !birthDateInput) redirect(returnPath);

  const { membership, userId } = await requireWorkspaceMembership(churchSlug);
  if (!membership) redirect(returnPath);

  const household = await prisma.household.findFirst({
    where: { id: householdId, churchId: membership.church.id },
    select: { id: true, churchId: true },
  });
  if (!household) redirect(returnPath);

  const partnerMember = partnerMemberId
    ? await prisma.member.findFirst({
        where: { id: partnerMemberId, churchId: membership.church.id, householdId: household.id, isDeleted: false },
        select: { id: true, groupId: true, districtId: true },
      })
    : null;

  const sampleHouseholdMember = partnerMember
    ? partnerMember
    : await prisma.member.findFirst({
        where: { churchId: membership.church.id, householdId: household.id, isDeleted: false },
        orderBy: { createdAt: "asc" },
        select: { id: true, groupId: true, districtId: true },
      });

  const created = await prisma.member.create({
    data: {
      churchId: membership.church.id,
      householdId: household.id,
      districtId: sampleHouseholdMember?.districtId ?? null,
      groupId: sampleHouseholdMember?.groupId ?? null,
      name,
      gender,
      birthDate: new Date(birthDateInput),
      phone,
      email: null,
      address: null,
      registeredAt: new Date(),
      position: null,
      statusTag: "등록대기",
      requiresFollowUp: false,
      notes: updateGidoMemberMeta(null, { familyRole: "SPOUSE" }),
      currentJob: null,
      previousChurch: null,
      previousFaith: null,
      baptismStatus: null,
    },
  });

  if (partnerMember) {
    const existingLink = await prisma.memberRelationship.findFirst({
      where: {
        churchId: membership.church.id,
        relationshipType: RelationshipType.SPOUSE,
        OR: [
          { fromMemberId: partnerMember.id, toMemberId: created.id },
          { fromMemberId: created.id, toMemberId: partnerMember.id },
        ],
      },
      select: { id: true },
    });

    if (!existingLink) {
      await prisma.memberRelationship.create({
        data: {
          churchId: membership.church.id,
          fromMemberId: partnerMember.id,
          toMemberId: created.id,
          relationshipType: RelationshipType.SPOUSE,
          isPrimaryFamilyLink: true,
        },
      });
    }
  }

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_CREATED",
      targetType: "Member",
      targetId: created.id,
      memberId: created.id,
      metadata: JSON.stringify({ mode: "household-spouse", householdId: household.id, partnerMemberId: partnerMember?.id ?? null }),
    },
  });

  revalidateGidoViews(membership.church.id);
  redirect(returnPath);
}

export async function createGidoHouseholdChild(churchSlug: string, returnPath: string, formData: FormData) {
  const householdId = String(formData.get("householdId") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const birthDateInput = String(formData.get("birthDate") || "").trim();
  const parentMemberId = String(formData.get("parentMemberId") || "").trim();
  const gender = String(formData.get("gender") || "OTHER").trim() as any;

  if (!householdId || !name || !birthDateInput) redirect(returnPath);

  const { membership, userId } = await requireWorkspaceMembership(churchSlug);
  if (!membership) redirect(returnPath);

  const household = await prisma.household.findFirst({
    where: { id: householdId, churchId: membership.church.id },
    select: { id: true, churchId: true },
  });
  if (!household) redirect(returnPath);

  const parentMember = parentMemberId
    ? await prisma.member.findFirst({
        where: { id: parentMemberId, churchId: membership.church.id, householdId: household.id, isDeleted: false },
        select: { id: true, groupId: true, districtId: true },
      })
    : null;

  const sampleHouseholdMember = parentMember
    ? parentMember
    : await prisma.member.findFirst({
        where: { churchId: membership.church.id, householdId: household.id, isDeleted: false },
        orderBy: { createdAt: "asc" },
        select: { id: true, groupId: true, districtId: true },
      });

  const created = await prisma.member.create({
    data: {
      churchId: membership.church.id,
      householdId: household.id,
      districtId: sampleHouseholdMember?.districtId ?? null,
      groupId: sampleHouseholdMember?.groupId ?? null,
      name,
      gender,
      birthDate: new Date(birthDateInput),
      phone: "",
      email: null,
      address: null,
      registeredAt: new Date(),
      position: null,
      statusTag: "등록대기",
      requiresFollowUp: false,
      notes: updateGidoMemberMeta(null, { familyRole: "CHILD" }),
      currentJob: null,
      previousChurch: null,
      previousFaith: null,
      baptismStatus: null,
    },
  });

  if (parentMember) {
    const existingLink = await prisma.memberRelationship.findFirst({
      where: {
        churchId: membership.church.id,
        fromMemberId: parentMember.id,
        toMemberId: created.id,
        relationshipType: "CHILD",
      },
      select: { id: true },
    });

    if (!existingLink) {
      await prisma.memberRelationship.create({
        data: {
          churchId: membership.church.id,
          fromMemberId: parentMember.id,
          toMemberId: created.id,
          relationshipType: "CHILD",
        },
      });
    }
  }

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_CREATED",
      targetType: "Member",
      targetId: created.id,
      memberId: created.id,
      metadata: JSON.stringify({ mode: "household-child", householdId: household.id, parentMemberId: parentMember?.id ?? null }),
    },
  });

  revalidateGidoViews(membership.church.id);
  redirect(returnPath);
}

export async function createGidoHouseholdFamilyLink(churchSlug: string, returnPath: string, formData: FormData) {
  const householdId = String(formData.get("householdId") || "").trim();
  const fromMemberId = String(formData.get("fromMemberId") || "").trim();
  const toMemberId = String(formData.get("toMemberId") || "").trim();
  const relationshipType = asRelationshipType(formData.get("relationshipType"));
  const customRelationship = asOptionalString(formData.get("customRelationship"));
  const notes = asOptionalString(formData.get("notes"));

  if (!householdId || !fromMemberId || !toMemberId || !relationshipType || fromMemberId === toMemberId) redirect(returnPath);

  const { membership, userId } = await requireWorkspaceMembership(churchSlug);
  if (!membership) redirect(returnPath);

  const members = await prisma.member.findMany({
    where: {
      churchId: membership.church.id,
      householdId,
      isDeleted: false,
      id: { in: [fromMemberId, toMemberId] },
    },
    select: { id: true },
  });
  if (members.length !== 2) redirect(returnPath);

  const existingLink = await prisma.memberRelationship.findFirst({
    where: {
      churchId: membership.church.id,
      relationshipType,
      OR: [
        { fromMemberId, toMemberId },
        { fromMemberId: toMemberId, toMemberId: fromMemberId },
      ],
    },
    select: { id: true },
  });

  const createdLink = !existingLink
    ? await prisma.memberRelationship.create({
      data: {
        churchId: membership.church.id,
        fromMemberId,
        toMemberId,
        relationshipType,
        customRelationship,
        notes,
        isPrimaryFamilyLink: relationshipType === RelationshipType.SPOUSE,
      },
      })
    : null;

  if (createdLink) {
    await prisma.activityLog.create({
      data: {
        churchId: membership.church.id,
        actorId: userId,
        action: "MEMBER_FAMILY_LINK_CREATED",
        targetType: "MemberRelationship",
        targetId: createdLink.id,
        memberId: fromMemberId,
        metadata: JSON.stringify({ householdId, fromMemberId, toMemberId, relationshipType }),
      },
    });
  }

  revalidateGidoViews(membership.church.id);
  redirect(returnPath);
}

export async function removeGidoHouseholdFamilyLink(churchSlug: string, returnPath: string, formData: FormData) {
  const householdId = String(formData.get("householdId") || "").trim();
  const relationshipId = String(formData.get("relationshipId") || "").trim();
  if (!householdId || !relationshipId) redirect(returnPath);

  const { membership, userId } = await requireWorkspaceMembership(churchSlug);
  if (!membership) redirect(returnPath);

  const relationship = await prisma.memberRelationship.findFirst({
    where: {
      id: relationshipId,
      churchId: membership.church.id,
      fromMember: { is: { householdId, isDeleted: false } },
      toMember: { is: { householdId, isDeleted: false } },
    },
    select: { id: true, fromMemberId: true },
  });
  if (!relationship) redirect(returnPath);

  await prisma.memberRelationship.delete({ where: { id: relationship.id } });

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "MEMBER_FAMILY_LINK_REMOVED",
      targetType: "MemberRelationship",
      targetId: relationship.id,
      memberId: relationship.fromMemberId,
      metadata: JSON.stringify({ householdId }),
    },
  });

  revalidateGidoViews(membership.church.id);
  redirect(returnPath);
}

export async function updateGidoHouseholdMemberRole(churchSlug: string, returnPath: string, formData: FormData) {
  const householdId = String(formData.get("householdId") || "").trim();
  const memberId = String(formData.get("memberId") || "").trim();
  if (!householdId || !memberId) redirect(returnPath);

  const { membership } = await requireWorkspaceMembership(churchSlug);
  if (!membership) redirect(returnPath);

  const member = await prisma.member.findFirst({
    where: {
      id: memberId,
      churchId: membership.church.id,
      householdId,
      isDeleted: false,
    },
    select: {
      id: true,
      churchId: true,
      householdId: true,
      notes: true,
    },
  });
  if (!member) redirect(returnPath);

  const familyRole = asFamilyRole(formData.get("familyRole"));

  if (familyRole === "SELF") {
    const householdMembers = await prisma.member.findMany({
      where: {
        churchId: membership.church.id,
        householdId: member.householdId,
        isDeleted: false,
        NOT: { id: member.id },
      },
      select: { id: true, notes: true },
    });

    for (const item of householdMembers) {
      const meta = parseGidoMemberMeta(item.notes);
      if (meta.familyRole === "SELF") {
        await prisma.member.update({
          where: { id: item.id },
          data: {
            notes: updateGidoMemberMeta(item.notes, { familyRole: null }),
          },
        });
      }
    }
  }

  await prisma.member.update({
    where: { id: member.id },
    data: {
      notes: updateGidoMemberMeta(member.notes, { familyRole }),
    },
  });

  revalidateGidoViews(membership.church.id);
  redirect(returnPath);
}
