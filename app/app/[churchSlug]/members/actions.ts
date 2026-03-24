"use server";

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

  redirect(`/app/${churchSlug}/members/${member.id}`);
}
