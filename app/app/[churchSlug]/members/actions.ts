"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceMembership } from "@/lib/church-context";

export async function softDeleteMember(churchSlug: string, memberId: string) {
  const { membership, userId } = await requireWorkspaceMembership(churchSlug);
  if (!membership) return;

  const member = await prisma.member.findFirst({ where: { id: memberId, churchId: membership.church.id } });
  if (!member) return;

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

  redirect(`/app/${churchSlug}/members`);
}

export async function restoreMember(churchSlug: string, memberId: string) {
  const { membership, userId } = await requireWorkspaceMembership(churchSlug);
  if (!membership) return;

  const member = await prisma.member.findFirst({ where: { id: memberId, churchId: membership.church.id } });
  if (!member) return;

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

  revalidateTag(`church:${membership.church.id}:member:${member.id}`);
  revalidateTag(`church:${membership.church.id}:members`);
  redirect(`/app/${churchSlug}/members/${member.id}`);
}

export async function addCareRecord(churchSlug: string, memberId: string, formData: FormData) {
  const { membership, userId } = await requireWorkspaceMembership(churchSlug);
  if (!membership) return;

  const member = await prisma.member.findFirst({ where: { id: memberId, churchId: membership.church.id } });
  if (!member) return;

  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "VISIT").trim();
  const summary = String(formData.get("summary") || "").trim();
  const happenedAtRaw = String(formData.get("happenedAt") || "").trim();

  if (!title) return;

  await prisma.memberCareRecord.create({
    data: {
      churchId: membership.church.id,
      memberId: member.id,
      category: category as any,
      title,
      summary: summary || null,
      happenedAt: happenedAtRaw ? new Date(happenedAtRaw) : new Date(),
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

  revalidateTag(`church:${membership.church.id}:member:${member.id}`);
  redirect(`/app/${churchSlug}/members/${member.id}`);
}
