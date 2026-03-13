import { getApplicationSummary, listApplications } from "@/lib/application-service";
import { prisma } from "@/lib/prisma";
import { startOfMonth } from "@/lib/date";
import { unstable_cache } from "next/cache";

export async function getWorkspaceDashboardData(churchId: string) {
  return unstable_cache(
    async () => {
      const monthStart = startOfMonth(new Date());
      const applicationSummaryPromise = getApplicationSummary(churchId, 5);

      const [
        totalMembers,
        newThisMonth,
        followUpMembers,
        unassignedMembers,
        recentMembers,
        recentNotices,
        recentLogs,
        applicationSummary,
      ] = await Promise.all([
        prisma.member.count({ where: { churchId, isDeleted: false } }),
        prisma.member.count({ where: { churchId, isDeleted: false, registeredAt: { gte: monthStart } } }),
        prisma.member.count({ where: { churchId, isDeleted: false, requiresFollowUp: true } }),
        prisma.member.count({ where: { churchId, isDeleted: false, OR: [{ districtId: null }, { groupId: null }] } }),
        prisma.member.findMany({
          where: { churchId, isDeleted: false },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, name: true, statusTag: true, registeredAt: true },
        }),
        prisma.notice.findMany({
          where: { churchId },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, title: true, pinned: true, createdAt: true },
        }),
        prisma.activityLog.findMany({
          where: { churchId },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, action: true, targetType: true, createdAt: true },
        }),
        applicationSummaryPromise,
      ]);

      return {
        totalMembers,
        newThisMonth,
        pendingApplications: applicationSummary.pendingCount,
        followUpMembers,
        unassignedMembers,
        recentMembers,
        recentApplications: applicationSummary.recentApplications,
        recentNotices,
        recentLogs,
      };
    },
    [`workspace-dashboard-${churchId}`],
    { revalidate: 20, tags: [`church:${churchId}:dashboard`] },
  )();
}

export async function getWorkspaceMembers(
  churchId: string,
  options?: { followUpOnly?: boolean; registeredFrom?: Date },
) {
  const followUpOnly = Boolean(options?.followUpOnly);
  const registeredFromKey = options?.registeredFrom ? options.registeredFrom.toISOString() : "all";

  return unstable_cache(
    async () =>
      prisma.member.findMany({
        where: {
          churchId,
          isDeleted: false,
          ...(followUpOnly ? { requiresFollowUp: true } : {}),
          ...(options?.registeredFrom ? { registeredAt: { gte: options.registeredFrom } } : {}),
        },
        include: { district: true, group: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    [`workspace-members-${churchId}-${followUpOnly ? "followup" : "all"}-${registeredFromKey}`],
    { revalidate: 20, tags: [`church:${churchId}:members`] },
  )();
}

export async function getWorkspaceApplications(churchId: string, options?: { status?: string }) {
  const status = options?.status === "PENDING" ? "PENDING" : undefined;
  const cacheKey = status ?? "ALL";

  return unstable_cache(
    async () => listApplications({ churchId, status, limit: 50 }),
    [`workspace-applications-${churchId}-${cacheKey}`],
    { revalidate: 20, tags: [`church:${churchId}:applications`] },
  )();
}

export async function getWorkspaceNotices(churchId: string) {
  return unstable_cache(
    async () =>
      prisma.notice.findMany({
        where: { churchId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    [`workspace-notices-${churchId}`],
    { revalidate: 20, tags: [`church:${churchId}:notices`] },
  )();
}
