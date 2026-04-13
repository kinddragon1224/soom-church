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

export async function getAccessibleChurchesByUserId(userId: string) {
  const memberships = await prisma.churchMembership.findMany({
    where: { userId, isActive: true, church: { isActive: true } },
    select: {
      role: true,
      createdAt: true,
      church: { select: { id: true, slug: true, name: true } },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  return memberships.map((membership) => ({
    role: membership.role,
    joinedAt: membership.createdAt,
    church: membership.church,
  }));
}

export async function getFirstChurchByUserId(userId: string) {
  const memberships = await getAccessibleChurchesByUserId(userId);
  return memberships[0]?.church ?? null;
}

export async function getRecentChurchByUserId(userId: string) {
  const latestLog = await prisma.activityLog.findFirst({
    where: {
      actorId: userId,
      churchId: { not: null },
      church: { isActive: true },
    },
    orderBy: { createdAt: "desc" },
    select: {
      church: {
        select: { id: true, slug: true, name: true },
      },
    },
  });

  if (latestLog?.church) {
    return latestLog.church;
  }

  return getFirstChurchByUserId(userId);
}

export async function getCurrentUserOrRedirect(next?: string) {
  await requireAuth(next);
  const userId = await getCurrentUserId();
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
  const userId = await getCurrentUserOrRedirect(`/app/${churchSlug}/dashboard`);
  const membership = await getAccessibleChurchBySlug(userId, churchSlug);
  return { userId, membership };
}
