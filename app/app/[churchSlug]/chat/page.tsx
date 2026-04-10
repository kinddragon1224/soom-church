import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getAppliedRecordLog, type AppliedRecordLogItem } from "@/lib/chat-apply-log";
import { prisma } from "@/lib/prisma";
import ChatComposer from "./chat-composer";

function getWorldEffect(log: AppliedRecordLogItem | undefined, requiresFollowUp: boolean) {
  if (requiresFollowUp) {
    return {
      label: "돌봄 필요",
      tone: "amber" as const,
      detail: "곧 챙겨야 하는 상태",
    };
  }

  switch (log?.updateType) {
    case "PRAYER":
      return { label: "기도", tone: "violet" as const, detail: "기도 이슈가 열려 있어" };
    case "CARE_RECORD":
      return { label: "심방", tone: "sky" as const, detail: "최근 돌봄 기록이 있어" };
    case "FOLLOW_UP":
      return { label: "후속", tone: "amber" as const, detail: "다음 연락이 잡혀 있어" };
    case "ATTENDANCE":
      return { label: "출석", tone: "emerald" as const, detail: "최근 출석 변화가 반영됐어" };
    case "CHURCH_EVENT":
      return { label: "이벤트", tone: "rose" as const, detail: "교회 이벤트가 기록됐어" };
    default:
      return { label: "평온", tone: "stone" as const, detail: "아직 특별한 이슈가 없어" };
  }
}

export default async function ChurchChatPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  if (membership.church.slug !== "gido") {
    redirect(`/app/${membership.church.slug}/dashboard`);
  }

  const [memberCount, followUpCount, pendingCandidates, recentLogs, worldMembers] = await Promise.all([
    prisma.member.count({ where: { churchId: membership.church.id, isDeleted: false } }),
    prisma.member.count({ where: { churchId: membership.church.id, isDeleted: false, requiresFollowUp: true } }),
    prisma.intakeCandidate.count({ where: { churchId: membership.church.id, status: "PENDING" } }),
    getAppliedRecordLog(membership.church.id, 12),
    prisma.member.findMany({
      where: { churchId: membership.church.id, isDeleted: false },
      orderBy: [{ requiresFollowUp: "desc" }, { updatedAt: "desc" }],
      take: 10,
      select: {
        id: true,
        name: true,
        statusTag: true,
        requiresFollowUp: true,
        household: { select: { name: true } },
      },
    }),
  ]);

  const recentAttendanceCount = recentLogs.filter((item) => item.updateType === "ATTENDANCE").length;
  const recentLogByMemberId = new Map<string, AppliedRecordLogItem>();
  recentLogs.forEach((item) => {
    item.relatedMemberIds.forEach((memberId) => {
      if (!recentLogByMemberId.has(memberId)) {
        recentLogByMemberId.set(memberId, item);
      }
    });
  });

  return (
    <ChatComposer
      churchSlug={params.churchSlug}
      world={{
        memberCount,
        followUpCount,
        pendingCandidates,
        recentAttendanceCount,
        members: worldMembers.map((member, index) => {
          const recentLog = recentLogByMemberId.get(member.id);
          const effect = getWorldEffect(recentLog, member.requiresFollowUp);
          return {
            id: member.id,
            name: member.name,
            initial: member.name.slice(0, 1),
            householdName: member.household?.name ?? null,
            statusTag: member.statusTag,
            effectLabel: effect.label,
            effectTone: effect.tone,
            effectDetail: effect.detail,
            active: index === 0,
          };
        }),
        recentLogs: recentLogs.slice(0, 3).map((item) => ({
          id: item.id,
          title: item.title,
          body: item.body,
        })),
      }}
    />
  );
}
