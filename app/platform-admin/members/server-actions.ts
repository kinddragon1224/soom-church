"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function permanentlyDeleteMember(memberId: string) {
  const member = await prisma.member.findUnique({ where: { id: memberId } });
  if (!member) return;

  await prisma.activityLog.create({
    data: {
      churchId: member.churchId,
      action: "MEMBER_HARD_DELETED",
      targetType: "Member",
      targetId: member.id,
      memberId: member.id,
      metadata: "platform-admin permanent delete",
    },
  });

  await prisma.member.delete({ where: { id: member.id } });
  redirect("/platform-admin/members");
}
