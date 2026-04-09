import Link from "next/link";
import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { buildGidoRecoveryQueries, buildGidoReviewCandidates, buildGidoTimelineEvents } from "@/lib/gido-chat-first";
import { getGidoWorkspaceData } from "@/lib/gido-workspace-data";

export default async function ChurchTodayPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  if (membership.church.slug !== "gido") {
    redirect(`/app/${membership.church.slug}/dashboard`);
  }

  const base = `/app/${membership.church.slug}`;
  const data = await getGidoWorkspaceData(membership.church.id);
  const reviewCandidates = buildGidoReviewCandidates(data);
  const timelineEvents = buildGidoTimelineEvents(data).slice(0, 6);
  const recoveryQueries = buildGidoRecoveryQueries(data);
  const followUpMembers = data.members.filter((member) => member.requiresFollowUp);

  return (
    <div className="flex flex-col gap-5 text-[#171717]">
      <section className="overflow-hidden rounded-[30px] border border-[#e7dfd3] bg-[linear-gradient(135deg,#0f172a_0%,#14213d_55%,#1d3557_100%)] text-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
        <div className="grid gap-5 px-6 py-6 lg:grid-cols-[minmax(0,1.1fr)_320px] lg:px-7">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/70">
              <span className="rounded-full border border-white/12 bg-white/10 px-2.5 py-1">TODAY</span>
              <span className="rounded-full border border-white/12 bg-white/10 px-2.5 py-1">chat-first</span>
              <span className="rounded-full border border-white/12 bg-white/10 px-2.5 py-1">telegram + 모라</span>
            </div>
            <h1 className="mt-4 text-[2rem] font-semibold tracking-[-0.05em] text-white lg:text-[2.4rem]">
              오늘 처리할 것만 먼저 보자
            </h1>
            <p className="mt-3 max-w-[700px] text-sm leading-6 text-white/74">
              입력은 채팅에서 하고, 여기서는 오늘 바뀐 것과 검토할 것, 바로 연락할 사람만 본다.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="검토 대기" value={`${reviewCandidates.length}건`} />
              <MetricCard label="바로 연락" value={`${followUpMembers.length}명`} />
              <MetricCard label="사람" value={`${data.stats.memberCount}명`} />
              <MetricCard label="가정" value={`${data.stats.householdCount}가정`} />
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/8 p-5">
            <p className="text-[11px] tracking-[0.18em] text-white/56">TODAY LOOP</p>
            <div className="mt-4 grid gap-3 text-sm text-white/80">
              <StepItem step="1" title="모라와 대화" body="목장 근황과 변화는 채팅으로 보낸다." />
              <StepItem step="2" title="Review 확인" body="애매한 것만 승인하거나 수정한다." />
              <StepItem step="3" title="People / Households 복구" body="기록과 관계를 필요한 곳만 바로 본다." />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.06fr_0.94fr]">
        <article className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-[#95897b]">REVIEW PREVIEW</p>
              <h2 className="mt-2 text-[1.25rem] font-semibold tracking-[-0.03em] text-[#111111]">지금 확인할 카드</h2>
            </div>
            <Link href={`${base}/review`} className="rounded-[12px] border border-[#e7dfd3] bg-[#faf7f2] px-3 py-2 text-sm text-[#3f372d]">
              Review 열기
            </Link>
          </div>

          <div className="mt-5 grid gap-3">
            {reviewCandidates.slice(0, 5).map((item) => (
              <div key={item.id} className="rounded-[20px] border border-[#efe7da] bg-[#fcfbf8] p-4">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8c7a5b]">
                  <span className="rounded-full border border-[#e6dccd] bg-white px-2.5 py-1">{item.kind}</span>
                  <span>{item.reason}</span>
                  <span>·</span>
                  <span>{item.confidence}</span>
                </div>
                <p className="mt-3 text-base font-semibold text-[#111111]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#6f6256]">
                  <span className="rounded-full border border-[#e6dccd] bg-white px-2.5 py-1">대상 {item.targetLabel}</span>
                  <span className="rounded-full border border-[#e6dccd] bg-white px-2.5 py-1">{item.sourceLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-4">
          <article className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-[#95897b]">QUICK RECOVER</p>
              <h2 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-[#111111]">바로 복구할 질문</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {recoveryQueries.map((item) => (
                <div key={item.label} className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">
                  <p className="text-sm font-semibold text-[#111111]">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.query}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[0.16em] text-[#95897b]">NEXT ACTION</p>
                <h2 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-[#111111]">바로 갈 곳</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3 text-sm">
              <QuickLink href={`${base}/review`} title="Review" body="애매한 카드부터 처리" />
              <QuickLink href={`${base}/people`} title="People" body="사람 레코드 복구" />
              <QuickLink href={`${base}/households`} title="Households" body="가정 관계 확인" />
              <QuickLink href={`${base}/timeline`} title="Timeline" body="최근 기록 흐름 보기" />
            </div>
          </article>
        </div>
      </section>

      <article className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] tracking-[0.16em] text-[#95897b]">TIMELINE PREVIEW</p>
            <h2 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-[#111111]">최근 흐름</h2>
          </div>
          <Link href={`${base}/timeline`} className="rounded-[12px] border border-[#e7dfd3] bg-[#faf7f2] px-3 py-2 text-sm text-[#3f372d]">
            Timeline 열기
          </Link>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {timelineEvents.map((item) => (
            <div key={item.id} className="rounded-[20px] border border-[#efe7da] bg-[#fcfbf8] p-4">
              <p className="text-[11px] tracking-[0.16em] text-[#8c7a5b]">{item.meta}</p>
              <p className="mt-2 text-base font-semibold text-[#111111]">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.body}</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/8 px-4 py-4">
      <p className="text-[11px] tracking-[0.16em] text-white/48">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function StepItem({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/6 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-[#0f172a]">{step}</span>
        <p className="font-medium text-white">{title}</p>
      </div>
      <p className="mt-2 text-[13px] leading-6 text-white/72">{body}</p>
    </div>
  );
}

function QuickLink({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link href={href} className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] px-4 py-4 transition hover:bg-[#f8f4ee]">
      <p className="text-sm font-semibold text-[#111111]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{body}</p>
    </Link>
  );
}
