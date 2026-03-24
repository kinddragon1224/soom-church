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
        nextFollowUpMember,
        nextPendingApplication,
        nextUnassignedMember,
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
          select: { id: true, name: true, statusTag: true, registeredAt: true, districtId: true, groupId: true },
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
        prisma.member.findFirst({
          where: { churchId, isDeleted: false, requiresFollowUp: true },
          orderBy: [{ updatedAt: "asc" }, { createdAt: "asc" }],
          select: { id: true, name: true, statusTag: true, updatedAt: true },
        }),
        prisma.application.findFirst({
          where: { churchId, status: "PENDING" },
          orderBy: { createdAt: "asc" },
          select: { id: true, applicantName: true, createdAt: true },
        }),
        prisma.member.findFirst({
          where: { churchId, isDeleted: false, OR: [{ districtId: null }, { groupId: null }] },
          orderBy: [{ updatedAt: "asc" }, { createdAt: "asc" }],
          select: { id: true, name: true, statusTag: true, updatedAt: true },
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
        nextFollowUpMember,
        nextPendingApplication,
        nextUnassignedMember,
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

export async function getWorkspaceApplications(
  churchId: string,
  options?: { status?: "ALL" | "PENDING" | "IN_REVIEW" | "APPROVED" },
) {
  const status =
    options?.status === "PENDING" || options?.status === "IN_REVIEW" || options?.status === "APPROVED"
      ? options.status
      : "ALL";

  return unstable_cache(
    async () =>
      prisma.application.findMany({
        where: {
          churchId,
          ...(status === "ALL" ? {} : { status }),
        },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          applicantName: true,
          status: true,
          createdAt: true,
          form: {
            select: {
              title: true,
            },
          },
        },
      }),
    [`workspace-applications-${churchId}-${status}`],
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

export async function getWorkspaceMemberRecord(churchId: string, memberId: string) {
  return unstable_cache(
    async () =>
      prisma.member.findFirst({
        where: { id: memberId, churchId, isDeleted: false },
        include: {
          household: true,
          district: true,
          group: true,
          organizations: {
            include: { organization: true },
            orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
          },
          relationshipsFrom: {
            include: { toMember: true },
            orderBy: { createdAt: "asc" },
          },
          relationshipsTo: {
            include: { fromMember: true },
            orderBy: { createdAt: "asc" },
          },
          careRecords: {
            orderBy: { happenedAt: "desc" },
            take: 20,
          },
          lifeStatuses: {
            orderBy: [{ isActive: "desc" }, { happenedAt: "desc" }],
            take: 20,
          },
          faithMilestones: {
            orderBy: { happenedAt: "desc" },
            take: 20,
          },
        },
      }),
    [`workspace-member-record-${churchId}-${memberId}`],
    { revalidate: 20, tags: [`church:${churchId}:member:${memberId}`] },
  )();
}
