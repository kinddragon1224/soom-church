import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getAppliedRecordLog } from "@/lib/chat-apply-log";
import { prisma } from "@/lib/prisma";
import ChatComposer from "./chat-composer";

export default async function ChurchChatPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  if (membership.church.slug !== "gido") {
    redirect(`/app/${membership.church.slug}/dashboard`);
  }

  const [memberCount, followUpCount, pendingCandidates, recentLogs] = await Promise.all([
    prisma.member.count({ where: { churchId: membership.church.id, isDeleted: false } }),
    prisma.member.count({ where: { churchId: membership.church.id, isDeleted: false, requiresFollowUp: true } }),
    prisma.intakeCandidate.count({ where: { churchId: membership.church.id, status: "PENDING" } }),
    getAppliedRecordLog(membership.church.id, 8),
  ]);

  const recentAttendanceCount = recentLogs.filter((item) => item.updateType === "ATTENDANCE").length;

  return (
    <ChatComposer
      churchSlug={params.churchSlug}
      summary={{
        memberCount,
        followUpCount,
        pendingCandidates,
        recentAttendanceCount,
        recentLogs: recentLogs.slice(0, 3).map((item) => ({
          id: item.id,
          title: item.title,
          body: item.body,
        })),
      }}
    />
  );
}
