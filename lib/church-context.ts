import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function getChurchBySlug(churchSlug: string) {
  const church = await prisma.church.findUnique({
    where: { slug: churchSlug },
    select: { id: true, slug: true, name: true, timezone: true, isActive: true },
  });

  if (!church || !church.isActive) notFound();
  return church;
}

export async function getFirstChurchByUserId(userId: string) {
  const membership = await prisma.churchMembership.findFirst({
    where: { userId, isActive: true, church: { isActive: true } },
    include: { church: { select: { id: true, slug: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });

  return membership?.church ?? null;
}
