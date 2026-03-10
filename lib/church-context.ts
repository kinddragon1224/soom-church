import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId, requireAuth } from "@/lib/auth";

export async function getChurchBySlug(churchSlug: string) {
  const church = await prisma.church.findUnique({
    where: { slug: churchSlug },
    select: { id: true, slug: true, name: true, timezone: true, isActive: true },
  });

  if (!church || !church.isActive) return null;
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

export function getCurrentUserOrRedirect(next?: string) {
  requireAuth(next);
  const userId = getCurrentUserId();
  if (!userId) {
    const loginPath = next ? `/login?next=${encodeURIComponent(next)}` : "/login";
    redirect(loginPath);
  }
  return userId;
}

export async function getAccessibleChurchBySlug(userId: string, churchSlug: string) {
  const membership = await prisma.churchMembership.findFirst({
    where: {
      userId,
      isActive: true,
      church: {
        slug: churchSlug,
        isActive: true,
      },
    },
    select: {
      role: true,
      church: { select: { id: true, slug: true, name: true, timezone: true, isActive: true } },
    },
  });

  if (!membership) return null;
  return membership;
}

export async function requireWorkspaceMembership(churchSlug: string) {
  const userId = getCurrentUserOrRedirect(`/app/${churchSlug}/dashboard`);
  const membership = await getAccessibleChurchBySlug(userId, churchSlug);
  return { userId, membership };
}
