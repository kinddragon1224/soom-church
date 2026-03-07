import { prisma } from "@/lib/prisma";
import { startOfMonth } from "@/lib/date";

export async function getWorkspaceDashboardData(churchId: string) {
  const monthStart = startOfMonth(new Date());

  const [
    totalMembers,
    newThisMonth,
    pendingApplications,
    followUpMembers,
    recentMembers,
    recentApplications,
    recentNotices,
    recentLogs,
  ] = await Promise.all([
    prisma.member.count({ where: { churchId, isDeleted: false } }),
    prisma.member.count({ where: { churchId, isDeleted: false, registeredAt: { gte: monthStart } } }),
    prisma.application.count({ where: { churchId, status: "PENDING" } }),
    prisma.member.count({ where: { churchId, isDeleted: false, requiresFollowUp: true } }),
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
    recentMembers,
    recentApplications,
    recentNotices,
    recentLogs,
  };
}

export async function getWorkspaceMembers(churchId: string) {
  return prisma.member.findMany({
    where: { churchId, isDeleted: false },
    include: { district: true, group: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getWorkspaceApplications(churchId: string) {
  return prisma.application.findMany({
    where: { churchId },
    include: { form: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getWorkspaceNotices(churchId: string) {
  return prisma.notice.findMany({
    where: { churchId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
