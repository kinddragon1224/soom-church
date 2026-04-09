"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { parseGidoMemberMeta, updateGidoHouseholdMeta, updateGidoMemberMeta } from "@/lib/gido-home-config";
import { prisma } from "@/lib/prisma";

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

  revalidateTag(`church:${household.churchId}:members`);
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

  revalidateTag(`church:${household.churchId}:members`);
  revalidateTag(`church:${household.churchId}:dashboard`);
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

  revalidateTag(`church:${member.churchId}:members`);
  revalidateTag(`church:${member.churchId}:dashboard`);
  revalidateTag(`church:${member.churchId}:households`);
  redirect(returnPath);
}
