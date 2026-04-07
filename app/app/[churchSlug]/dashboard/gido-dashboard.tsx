import Link from "next/link";
import { getGidoWorkspaceData } from "@/lib/gido-workspace-data";

export default async function GidoDashboardPage({
  churchId,
  base,
  currentUserName,
}: {
  churchId: string;
  base: string;
  currentUserName?: string;
}) {
  const data = await getGidoWorkspaceData(churchId);
  const displayName = currentUserName?.split(" ").pop() ?? "목자";
  const highlightHousehold = data.households[0];
  const followUpPreview = data.followUps.slice(0, 3);
  const latestUpdate = data.updates[0];
  const urgentMemberCount = data.members.filter((member) => member.requiresFollowUp).length;

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-4 rounded-[28px] border border-[#ece4d9] bg-white px-6 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[2rem] font-semibold tracking-[-0.06em] text-[#111111]">{displayName}, 오늘은 여기서 시작하면 돼</h1>
          <p className="mt-1 text-sm leading-6 text-[#6b5f50]">홈은 가볍게 두고, 실제 작업은 각 페이지에서 하게 줄였어.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`${base}/members`} className="rounded-[14px] border border-[#e6dfd5] bg-white px-4 py-2.5 text-sm font-medium text-[#171717]">
            목원 관리
          </Link>
          <Link href={`${base}/members/new`} className="rounded-[14px] bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white">
            새 목원 추가
          </Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <QuickCard title="목원" desc="사람별 관리 화면으로 바로 들어가." href={`${base}/members`} meta={`${data.stats.memberCount}명`} />
        <QuickCard title="후속" desc="이번 주 챙길 사람만 모아서 봐." href={`${base}/followups`} meta={`${urgentMemberCount}명`} />
        <QuickCard title="중보" desc="가정 단위 기도제목을 확인해." href={`${base}/households`} meta={`${data.stats.householdCount}가정`} />
        <QuickCard title="근황" desc="최근 기록과 메모만 따로 봐." href={`${base}/updates`} meta={`${data.updates.length}건`} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <article className="rounded-[28px] border border-[#ebe4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#8f8478]">TODAY</p>
              <h2 className="mt-2 text-[1.25rem] font-semibold tracking-[-0.04em] text-[#111111]">지금 체크할 것</h2>
            </div>
            <Link href={`${base}/followups`} className="rounded-full border border-[#ebe2d5] bg-white px-3 py-1 text-[11px] text-[#6f6256]">
              후속 전체 보기
            </Link>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <StatCard label="후속 필요" value={`${urgentMemberCount}명`} tone={urgentMemberCount > 0 ? "alert" : "neutral"} />
            <StatCard label="근황 기록" value={`${data.updates.length}건`} />
            <StatCard label="기도제목" value={`${data.stats.prayerCount}개`} />
          </div>

          <div className="mt-4 grid gap-3">
            {followUpPreview.length > 0 ? (
              followUpPreview.map((item) => (
                <article key={`${item.title}-${item.due}`} className="rounded-[18px] border border-[#eee8de] bg-[#fcfbf8] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#171717]">{item.title}</p>
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.priority}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.note}</p>
                </article>
              ))
            ) : (
              <EmptyBox text="지금 바로 챙길 후속 카드는 없어." />
            )}

            {latestUpdate ? (
              <article className="rounded-[18px] border border-[#eee8de] bg-[#fcfbf8] p-4">
                <p className="text-xs text-[#8f8478]">최근 근황</p>
                <p className="mt-2 text-sm font-semibold text-[#171717]">{latestUpdate.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#5f564b]">{latestUpdate.body}</p>
              </article>
            ) : null}
          </div>
        </article>

        <article className="overflow-hidden rounded-[28px] border border-[#ebe4d8] bg-[linear-gradient(180deg,#2d6d46_0%,#111827_100%)] p-5 text-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-white/70">THIS WEEK</p>
              <h2 className="mt-3 text-[1.9rem] font-semibold leading-[1.04] tracking-[-0.06em]">
                {highlightHousehold ? highlightHousehold.title : data.groupName}
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/78">
                {highlightHousehold?.prayers[0] ?? "이번 주 함께 품을 기도제목부터 차분히 정리해봐."}
              </p>
              {highlightHousehold?.members?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {highlightHousehold.members.slice(0, 4).map((member) => (
                    <span key={`${highlightHousehold.id}-${member.name}`} className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] text-white/82">
                      {member.name}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <Link href={`${base}/households`} className="inline-flex rounded-[14px] bg-white px-4 py-2.5 text-sm font-semibold text-[#111827]">
                가정별 중보 보기
              </Link>
              <Link href={`${base}/updates`} className="inline-flex rounded-[14px] border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white">
                근황 보기
              </Link>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

function QuickCard({ title, desc, href, meta }: { title: string; desc: string; href: string; meta: string }) {
  return (
    <Link href={href} className="rounded-[24px] border border-[#ebe4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] transition hover:translate-y-[-1px] hover:shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#171717]">{title}</p>
        <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-2.5 py-1 text-[11px] text-[#6f6256]">{meta}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{desc}</p>
    </Link>
  );
}

function StatCard({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "alert" }) {
  return (
    <div className={`rounded-[18px] border p-4 ${tone === "alert" ? "border-[#e9d8b0] bg-[#fff7e8]" : "border-[#ece4d8] bg-[#fcfbf8]"}`}>
      <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{label}</p>
      <p className="mt-2 text-base font-semibold text-[#111111]">{value}</p>
    </div>
  );
}

function EmptyBox({ text }: { text: string }) {
  return <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">{text}</div>;
}
