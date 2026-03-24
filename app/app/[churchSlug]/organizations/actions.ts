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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function getScopedChurch(churchSlug: string) {
  const { membership, userId } = await requireWorkspaceMembership(churchSlug);
  if (!membership) return null;
  return { membership, userId };
}

async function refreshOrganizationView(churchId: string) {
  revalidateTag(`church:${churchId}:organizations`);
  revalidateTag(`church:${churchId}:members`);
  revalidateTag(`church:${churchId}:dashboard`);
}

export async function createOrganizationUnit(churchSlug: string, formData: FormData) {
  const scoped = await getScopedChurch(churchSlug);
  if (!scoped) return;

  const { membership, userId } = scoped;
  const name = String(formData.get("name") || "").trim();
  const type = String(formData.get("type") || OrganizationUnitType.CUSTOM).trim() as OrganizationUnitType;
  const parentId = asOptionalString(formData.get("parentId"));

  if (!name) return;

  const baseSlug = slugify(String(formData.get("slug") || "") || name);
  const slugSeed = baseSlug || `org-${Date.now()}`;
  let slug = slugSeed;
  let suffix = 1;

  while (
    await prisma.organizationUnit.findFirst({
      where: { churchId: membership.church.id, slug },
      select: { id: true },
    })
  ) {
    slug = `${slugSeed}-${suffix++}`;
  }

  const created = await prisma.organizationUnit.create({
    data: {
      churchId: membership.church.id,
      name,
      slug,
      type,
      parentId,
    },
  });

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "ORGANIZATION_CREATED",
      targetType: "OrganizationUnit",
      targetId: created.id,
      metadata: JSON.stringify({ type, parentId }),
    },
  });

  await refreshOrganizationView(membership.church.id);
  redirect(`/app/${churchSlug}/organizations`);
}

export async function updateOrganizationUnit(churchSlug: string, formData: FormData) {
  const scoped = await getScopedChurch(churchSlug);
  if (!scoped) return;

  const { membership, userId } = scoped;
  const unitId = String(formData.get("unitId") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const type = String(formData.get("type") || OrganizationUnitType.CUSTOM).trim() as OrganizationUnitType;
  const parentIdRaw = asOptionalString(formData.get("parentId"));
  const parentId = parentIdRaw === unitId ? null : parentIdRaw;

  if (!unitId || !name) return;

  const unit = await prisma.organizationUnit.findFirst({
    where: { id: unitId, churchId: membership.church.id },
    select: { id: true, slug: true },
  });
  if (!unit) return;

  await prisma.organizationUnit.update({
    where: { id: unit.id },
    data: { name, type, parentId },
  });

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "ORGANIZATION_UPDATED",
      targetType: "OrganizationUnit",
      targetId: unit.id,
      metadata: JSON.stringify({ type, parentId }),
    },
  });

  await refreshOrganizationView(membership.church.id);
  redirect(`/app/${churchSlug}/organizations`);
}

export async function updateOrganizationLabel(churchSlug: string, formData: FormData) {
  const scoped = await getScopedChurch(churchSlug);
  if (!scoped) return;

  const { membership, userId } = scoped;
  const type = String(formData.get("type") || "").trim() as OrganizationUnitType;
  const singular = String(formData.get("singular") || "").trim();
  const plural = asOptionalString(formData.get("plural"));

  if (!type || !singular) return;

  const label = await prisma.organizationUnitLabel.upsert({
    where: {
      churchId_type: {
        churchId: membership.church.id,
        type,
      },
    },
    update: { singular, plural },
    create: {
      churchId: membership.church.id,
      type,
      singular,
      plural,
    },
  });

  await prisma.activityLog.create({
    data: {
      churchId: membership.church.id,
      actorId: userId,
      action: "ORGANIZATION_LABEL_UPDATED",
      targetType: "OrganizationUnitLabel",
      targetId: label.id,
      metadata: JSON.stringify({ type, singular, plural }),
    },
  });

  await refreshOrganizationView(membership.church.id);
  redirect(`/app/${churchSlug}/organizations`);
}
