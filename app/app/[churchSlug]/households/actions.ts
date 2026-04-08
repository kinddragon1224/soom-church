"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { updateGidoHouseholdMeta } from "@/lib/gido-home-config";
import { prisma } from "@/lib/prisma";

function parseLines(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
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
