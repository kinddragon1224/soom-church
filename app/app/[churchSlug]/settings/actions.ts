"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { OrganizationUnitType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceMembership } from "@/lib/church-context";

function asOptionalString(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text || null;
}

async function getScopedChurch(churchSlug: string) {
  const { membership, userId } = await requireWorkspaceMembership(churchSlug);
  if (!membership) return null;
  return { membership, userId };
}

async function refreshSettings(churchId: string) {
  revalidateTag(`church:${churchId}:settings`);
  revalidateTag(`church:${churchId}:members`);
  revalidateTag(`church:${churchId}:organizations`);
}

export async function createHouseholdDefault(churchSlug: string, formData: FormData) {
  const scoped = await getScopedChurch(churchSlug);
  if (!scoped) return;
  const { membership, userId } = scoped;

  const name = String(formData.get("name") || "").trim();
  const address = asOptionalString(formData.get("address"));
  const notes = asOptionalString(formData.get("notes"));
  if (!name) return;

  const household = await prisma.household.create({
    data: { churchId: membership.church.id, name, address, notes },
  });

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "HOUSEHOLD_DEFAULT_CREATED",
      targetType: "Household",
      targetId: household.id,
    },
  });

  await refreshSettings(membership.church.id);
  redirect(`/app/${churchSlug}/settings#member-defaults`);
}

export async function createDistrictDefault(churchSlug: string, formData: FormData) {
  const scoped = await getScopedChurch(churchSlug);
  if (!scoped) return;
  const { membership, userId } = scoped;

  const name = String(formData.get("name") || "").trim();
  const leadName = asOptionalString(formData.get("leadName"));
  if (!name) return;

  const district = await prisma.district.create({
    data: { churchId: membership.church.id, name, leadName },
  });

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "DISTRICT_DEFAULT_CREATED",
      targetType: "District",
      targetId: district.id,
    },
  });

  await refreshSettings(membership.church.id);
  redirect(`/app/${churchSlug}/settings#member-defaults`);
}

export async function createGroupDefault(churchSlug: string, formData: FormData) {
  const scoped = await getScopedChurch(churchSlug);
  if (!scoped) return;
  const { membership, userId } = scoped;

  const name = String(formData.get("name") || "").trim();
  const districtId = String(formData.get("districtId") || "").trim();
  if (!name || !districtId) return;

  const district = await prisma.district.findFirst({
    where: { id: districtId, churchId: membership.church.id },
    select: { id: true },
  });
  if (!district) return;

  const group = await prisma.group.create({
    data: { churchId: membership.church.id, districtId: district.id, name },
  });

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "GROUP_DEFAULT_CREATED",
      targetType: "Group",
      targetId: group.id,
      metadata: JSON.stringify({ districtId }),
    },
  });

  await refreshSettings(membership.church.id);
  redirect(`/app/${churchSlug}/settings#member-defaults`);
}

export async function updateChurchTerminology(churchSlug: string, formData: FormData) {
  const scoped = await getScopedChurch(churchSlug);
  if (!scoped) return;
  const { membership, userId } = scoped;

  const entries = [
    {
      type: OrganizationUnitType.DISTRICT,
      singular: String(formData.get("districtSingular") || "교구").trim(),
      plural: asOptionalString(formData.get("districtPlural")) ?? String(formData.get("districtSingular") || "교구").trim(),
    },
    {
      type: OrganizationUnitType.DEPARTMENT,
      singular: String(formData.get("departmentSingular") || "부서").trim(),
      plural: asOptionalString(formData.get("departmentPlural")) ?? String(formData.get("departmentSingular") || "부서").trim(),
    },
    {
      type: OrganizationUnitType.GROUP,
      singular: String(formData.get("groupSingular") || "목장").trim(),
      plural: asOptionalString(formData.get("groupPlural")) ?? String(formData.get("groupSingular") || "목장").trim(),
    },
  ];

  for (const entry of entries) {
    if (!entry.singular) continue;
    await prisma.organizationUnitLabel.upsert({
      where: { churchId_type: { churchId: membership.church.id, type: entry.type } },
      update: { singular: entry.singular, plural: entry.plural },
      create: { churchId: membership.church.id, type: entry.type, singular: entry.singular, plural: entry.plural },
    });
  }

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "CHURCH_TERMINOLOGY_UPDATED",
      targetType: "OrganizationUnitLabel",
      metadata: JSON.stringify(entries),
    },
  });

  await refreshSettings(membership.church.id);
  redirect(`/app/${churchSlug}/settings#terminology`);
}
