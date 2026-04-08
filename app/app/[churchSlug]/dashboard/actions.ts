"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { updateGidoMemberMeta } from "@/lib/gido-home-config";
import { prisma } from "@/lib/prisma";

async function getScopedMember(churchSlug: string, memberId: string) {
  const { membership } = await requireWorkspaceMembership(churchSlug);
  if (!membership) return null;

  const member = await prisma.member.findFirst({
    where: {
      id: memberId,
      churchId: membership.church.id,
      isDeleted: false,
    },
    select: {
      id: true,
      notes: true,
      churchId: true,
    },
  });

  if (!member) return null;
  return { membership, member };
}

export async function pinDashboardMember(churchSlug: string, returnPath: string, formData: FormData) {
  const memberId = String(formData.get("memberId") || "").trim();
  if (!memberId) redirect(returnPath);

  const scoped = await getScopedMember(churchSlug, memberId);
  if (!scoped) redirect(returnPath);

  await prisma.member.update({
    where: { id: scoped.member.id },
    data: {
      notes: updateGidoMemberMeta(scoped.member.notes, {
        homePinned: true,
        homePinnedAt: new Date().toISOString(),
      }),
    },
  });

  revalidateTag(`church:${scoped.member.churchId}:members`);
  revalidateTag(`church:${scoped.member.churchId}:member:${scoped.member.id}`);
  redirect(returnPath);
}

export async function unpinDashboardMember(churchSlug: string, returnPath: string, formData: FormData) {
  const memberId = String(formData.get("memberId") || "").trim();
  if (!memberId) redirect(returnPath);

  const scoped = await getScopedMember(churchSlug, memberId);
  if (!scoped) redirect(returnPath);

  await prisma.member.update({
    where: { id: scoped.member.id },
    data: {
      notes: updateGidoMemberMeta(scoped.member.notes, {
        homePinned: false,
        homePinnedAt: null,
      }),
    },
  });

  revalidateTag(`church:${scoped.member.churchId}:members`);
  revalidateTag(`church:${scoped.member.churchId}:member:${scoped.member.id}`);
  redirect(returnPath);
}
