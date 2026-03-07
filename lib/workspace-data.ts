import { prisma } from "@/lib/prisma";
import { startOfMonth } from "@/lib/date";
import { unstable_cache } from "next/cache";

export async function getWorkspaceDashboardData(churchId: string) {
  return unstable_cache(
    async () => {
      const monthStart = startOfMonth(new Date());

      const [
        totalMembers,
        newThisMonth,
        pendingApplications,
        followUpMembers,
        unassignedMembers,
        recentMembers,
        recentApplications,
        recentNotices,
        recentLogs,
      ] = await Promise.all([
        prisma.member.count({ where: { churchId, isDeleted: false } }),
        prisma.member.count({ where: { churchId, isDeleted: false, registeredAt: { gte: monthStart } } }),
        prisma.application.count({ where: { churchId, status: "PENDING" } }),
        prisma.member.count({ where: { churchId, isDeleted: false, requiresFollowUp: true } }),
        prisma.member.count({ where: { churchId, isDeleted: false, OR: [{ districtId: null }, { groupId: null }] } }),
        prisma.member.findMany({
          where: { churchId, isDeleted: false },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, name: true, statusTag: true, registeredAt: true },
        }),
        prisma.application.findMany({
          where: { churchId },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, applicantName: true, status: true, createdAt: true },
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
      ]);

      return {
        totalMembers,
        newThisMonth,
        pendingApplications,
        followUpMembers,
        unassignedMembers,
        recentMembers,
        recentApplications,
        recentNotices,
        recentLogs,
      };
    },
    [`workspace-dashboard-${churchId}`],
    { revalidate: 20, tags: [`church:${churchId}:dashboard`] },
  )();
}

export async function getWorkspaceMembers(churchId: string) {
  return unstable_cache(
    async () =>
      prisma.member.findMany({
        where: { churchId, isDeleted: false },
        include: { district: true, group: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    [`workspace-members-${churchId}`],
    { revalidate: 20, tags: [`church:${churchId}:members`] },
  )();
}

export async function getWorkspaceApplications(churchId: string) {
  return unstable_cache(
    async () =>
      prisma.application.findMany({
        where: { churchId },
        include: { form: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    [`workspace-applications-${churchId}`],
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
