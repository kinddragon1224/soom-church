import Link from "next/link";
import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getAppliedRecordLog } from "@/lib/chat-apply-log";
import { getGidoWorkspaceData } from "@/lib/gido-workspace-data";

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export default async function ChurchPeoplePage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  if (membership.church.slug !== "gido") {
    redirect(`/app/${membership.church.slug}/members`);
  }

  const base = `/app/${membership.church.slug}`;
  const [data, logs] = await Promise.all([
    getGidoWorkspaceData(membership.church.id),
    getAppliedRecordLog(membership.church.id, 80),
  ]);

  const memberCards = data.members
    .map((member) => {
      const recentLogs = logs.filter((item) => item.relatedMemberIds.includes(member.id)).slice(0, 3);
      const latestAt = recentLogs[0]?.appliedAt?.getTime() ?? 0;
      return {
        ...member,
        recentLogs,
        latestAt,
      };
    })
    .filter((member) => member.recentLogs.length > 0 || member.requiresFollowUp)
    .sort((a, b) => {
      if (b.latestAt !== a.latestAt) return b.latestAt - a.latestAt;
      if (a.requiresFollowUp !== b.requiresFollowUp) return Number(b.requiresFollowUp) - Number(a.requiresFollowUp);
      return a.name.localeCompare(b.name, "ko-KR");
    });

  const activeCount = memberCards.filter((member) => member.recentLogs.length > 0).length;
  const followUpCount = memberCards.filter((member) => member.requiresFollowUp).length;

  return (
    <div className="flex flex-col gap-5 text-[#171717]">
      <header className="rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">PEOPLE RECORDS</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">사람별 반영 기록</h1>
            <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#5f564b]">
              Chat에서 실제 반영된 결과를 사람 기준으로 본다. 지금은 members 목록이 아니라, 최근 적용 로그가 붙은 사람부터 먼저 보여준다.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label="전체 사람" value={`${data.members.length}명`} />
            <MetricCard label="최근 반영" value={`${activeCount}명`} />
            <MetricCard label="후속 필요" value={`${followUpCount}명`} />
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <Link href={`${base}/chat`} className="rounded-[12px] border border-[#e7dfd3] bg-[#faf7f2] px-3 py-2 text-sm text-[#3f372d]">Chat</Link>
        <Link href={`${base}/review`} className="rounded-[12px] border border-[#e7dfd3] bg-[#faf7f2] px-3 py-2 text-sm text-[#3f372d]">Review</Link>
        <Link href={`${base}/timeline`} className="rounded-[12px] border border-[#111827] bg-[#111827] px-3 py-2 text-sm text-white">Timeline</Link>
      </div>

      <section className="grid gap-4 xl:grid-cols-2">
        {memberCards.length === 0 ? (
          <div className="rounded-[24px] border border-[#ece4d8] bg-white px-5 py-10 text-center text-sm text-[#6f6256] shadow-[0_8px_24px_rgba(15,23,42,0.04)] xl:col-span-2">
            아직 사람별 반영 기록이 없어. Chat에서 먼저 운영 내용을 보내면 여기부터 쌓여.
          </div>
        ) : (
          memberCards.map((member) => (
            <article key={member.id} className="rounded-[24px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8c7a5b]">
                    <span className="rounded-full border border-[#e6dccd] bg-[#fcfbf8] px-2.5 py-1">{member.householdName}</span>
                    <span className="rounded-full border border-[#e6dccd] bg-[#fcfbf8] px-2.5 py-1">상태 {member.statusTag}</span>
                    {member.requiresFollowUp ? (
                      <span className="rounded-full border border-[#f1d7ad] bg-[#fff7ea] px-2.5 py-1 text-[#8c5d16]">후속 필요</span>
                    ) : null}
                  </div>
                  <h2 className="mt-3 text-[1.25rem] font-semibold tracking-[-0.03em] text-[#111111]">{member.name}</h2>
                </div>

                <Link href={`/app/${membership.church.slug}/members/${member.id}`} className="rounded-[12px] border border-[#e7dfd3] bg-white px-3 py-2 text-sm text-[#3f372d]">
                  상세 보기
                </Link>
              </div>

              <div className="mt-4 grid gap-3">
                {member.recentLogs.length === 0 ? (
                  <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-4 text-sm text-[#6f6256]">
                    아직 이 사람에게 직접 반영된 로그는 없고, 후속 필요 상태만 잡혀 있어.
                  </div>
                ) : (
                  member.recentLogs.map((item) => (
                    <div key={item.id} className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8c7a5b]">
                        <span className="rounded-full border border-[#e6dccd] bg-white px-2.5 py-1">{item.updateTypeLabel}</span>
                        <span>{formatDateTime(item.appliedAt)}</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-[#111111]">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.body}</p>
                      <p className="mt-3 text-[12px] leading-5 text-[#8c7a5b]">원문: {item.captureText}</p>
                    </div>
                  ))
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#ece4d8] bg-white p-4">
      <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[#111111]">{value}</p>
    </div>
  );
}
