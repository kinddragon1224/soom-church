import { startOfMonth } from "./date";
import { prisma } from "./prisma";

function inferNextAction(statusTag: string, requiresFollowUp: boolean) {
  if (requiresFollowUp) return "48시간 내 연락";
  if (statusTag === "등록대기") return "등록 검토";
  if (statusTag === "새가족") return "첫 만남 안내";
  if (statusTag === "정착중") return "목장 연결 점검";
  if (statusTag === "목장배정완료") return "리더 인사 연결";
  if (statusTag === "봉사연결") return "봉사 온보딩";
  if (statusTag === "심방필요") return "심방 일정 수립";
  return "상태 확인";
}

function inferFollowUpReason(member: {
  statusTag: string;
  groupId: string | null;
  notes: string | null;
  registeredAt: Date;
}) {
  if (!member.groupId) return "목장 미배정";
  if (member.statusTag === "심방필요") return "심방 필요 상태";
  if (member.notes?.includes("심방")) return "심방 필요 메모 있음";
  const daysFromRegistered = Math.floor((Date.now() - new Date(member.registeredAt).getTime()) / (1000 * 60 * 60 * 24));
  if (daysFromRegistered >= 7) return "등록 후 7일 경과";
  return "신청 후 미응답";
}

export async function getDashboardData() {
  const monthStart = startOfMonth(new Date());

  const [
    totalMembers,
    newThisMonth,
    pendingApplications,
    followUpMembers,
    unassignedMembers,
    districtCounts,
    recentMembers,
    recentApplications,
    recentNotices,
    recentActivityLogs,
    followUpPanel,
  ] = await Promise.all([
    prisma.member.count({ where: { isDeleted: false } }),
    prisma.member.count({ where: { isDeleted: false, registeredAt: { gte: monthStart } } }),
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.member.count({ where: { isDeleted: false, requiresFollowUp: true } }),
    prisma.member.count({ where: { isDeleted: false, OR: [{ districtId: null }, { groupId: null }] } }),
    prisma.district.findMany({
      include: { _count: { select: { members: { where: { isDeleted: false } } } } },
      orderBy: { name: "asc" },
    }),
    prisma.member.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        statusTag: true,
        requiresFollowUp: true,
        district: { select: { name: true, leadName: true } },
        registeredAt: true,
      },
    }),
    prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, applicantName: true, status: true, createdAt: true, form: { select: { title: true } } },
    }),
    prisma.notice.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, pinned: true, createdAt: true },
    }),
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, action: true, targetType: true, createdAt: true },
    }),
    prisma.member.findMany({
      where: { isDeleted: false, requiresFollowUp: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        statusTag: true,
        district: { select: { name: true } },
        groupId: true,
        notes: true,
        registeredAt: true,
        updatedAt: true,
      },
    }),
  ]);

  const districtFollowups = await Promise.all(
    districtCounts.map(async (d) => {
      const followUps = await prisma.member.count({
        where: { isDeleted: false, districtId: d.id, requiresFollowUp: true },
      });
      return { district: d.name, count: d._count.members, followUps };
    }),
  );

  const urgentChecklist = [
    { label: "후속관리 확인", value: followUpMembers, href: "/members?followup=1" },
    { label: "미처리 신청 확인", value: pendingApplications, href: "/applications" },
    { label: "미배정 목원 점검", value: unassignedMembers, href: "/districts" },
  ];

  return {
    totalMembers,
    newThisMonth,
    pendingApplications,
    followUpMembers,
    unassignedMembers,
    urgentChecklist,
    districtCounts: districtFollowups,
    recentMembers: recentMembers.map((m) => ({
      ...m,
      nextAction: inferNextAction(m.statusTag, m.requiresFollowUp),
      leaderName: m.district?.leadName ?? "미배정",
    })),
    recentApplications,
    recentNotices: recentNotices.map((n) => ({
      ...n,
      scopeLabel: n.pinned ? "전체 공지" : "일반 공지",
      publishStatus: "게시중",
    })),
    recentActivityLogs,
    followUpPanel: followUpPanel.map((m) => ({
      ...m,
      reason: inferFollowUpReason(m),
    })),
  };
}
