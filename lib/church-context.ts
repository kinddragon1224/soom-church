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
