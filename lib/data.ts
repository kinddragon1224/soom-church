import { startOfMonth } from "./date";
import { prisma } from "./prisma";

export async function getDashboardData() {
  const monthStart = startOfMonth(new Date());

  const [
    totalMembers,
    newThisMonth,
    pendingApplications,
    followUpMembers,
    districtCounts,
    recentMembers,
    recentApplications,
    recentNotices,
  ] = await Promise.all([
    prisma.member.count({ where: { isDeleted: false } }),
    prisma.member.count({ where: { isDeleted: false, registeredAt: { gte: monthStart } } }),
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.member.count({ where: { isDeleted: false, requiresFollowUp: true } }),
    prisma.district.findMany({
      include: { _count: { select: { members: { where: { isDeleted: false } } } } },
      orderBy: { name: "asc" },
    }),
    prisma.member.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, statusTag: true, district: { select: { name: true } }, registeredAt: true },
    }),
    prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, applicantName: true, status: true, createdAt: true, form: { select: { title: true } } },
    }),
    prisma.notice.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, createdAt: true },
    }),
  ]);

  return {
    totalMembers,
    newThisMonth,
    pendingApplications,
    followUpMembers,
    districtCounts: districtCounts.map((d) => ({ district: d.name, count: d._count.members })),
    recentMembers,
    recentApplications,
    recentNotices,
  };
}
