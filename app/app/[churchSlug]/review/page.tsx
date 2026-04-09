import Link from "next/link";
import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { buildGidoReviewCandidates } from "@/lib/gido-chat-first";
import { getGidoWorkspaceData } from "@/lib/gido-workspace-data";

const filterLabels = ["전체", "사람", "가정", "관계", "기록", "후속"];

const toneByConfidence: Record<string, string> = {
  높음: "border-[#f1d7ad] bg-[#fff7ea] text-[#8c5d16]",
  중간: "border-[#d9e1f2] bg-[#f5f8ff] text-[#355a8b]",
  낮음: "border-[#e5dfd4] bg-[#faf7f2] text-[#6f6256]",
};

export default async function ChurchReviewPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  if (membership.church.slug !== "gido") {
    redirect(`/app/${membership.church.slug}/dashboard`);
  }

  const base = `/app/${membership.church.slug}`;
  const data = await getGidoWorkspaceData(membership.church.id);
  const reviewCandidates = buildGidoReviewCandidates(data);
  const selected = reviewCandidates[0] ?? null;

  return (
    <div className="flex flex-col gap-5 text-[#171717]">
      <header className="rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">REVIEW QUEUE</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">검토 대기 큐</h1>
            <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#5f564b]">
              채팅에서 바로 확정하기 애매한 것만 여기로 모은다. 목표는 많이 쓰는 게 아니라, 빠르게 승인하고 지나가는 거야.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={`${base}/today`} className="rounded-[12px] border border-[#e7dfd3] bg-[#faf7f2] px-3 py-2 text-sm text-[#3f372d]">
              Today
            </Link>
            <Link href={`${base}/people`} className="rounded-[12px] border border-[#111827] bg-[#111827] px-3 py-2 text-sm text-white">
              People
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_360px]">
        <article className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
          <div className="flex flex-wrap items-center gap-2">
            {filterLabels.map((label) => (
              <span key={label} className={`rounded-full border px-3 py-1.5 text-[12px] ${label === "전체" ? "border-[#111827] bg-[#111827] text-white" : "border-[#e7dfd3] bg-[#faf7f2] text-[#5f564b]"}`}>
                {label}
              </span>
            ))}
          </div>

          <div className="mt-5 grid gap-3">
            {reviewCandidates.length === 0 ? (
              <div className="rounded-[20px] border border-[#efe7da] bg-[#fcfbf8] px-4 py-10 text-center text-sm text-[#6f6256]">
                지금은 검토 대기 카드가 없어.
              </div>
            ) : (
              reviewCandidates.map((item) => (
                <div key={item.id} className="rounded-[22px] border border-[#efe7da] bg-[#fcfbf8] p-4 lg:p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8c7a5b]">
                    <span className="rounded-full border border-[#e6dccd] bg-white px-2.5 py-1">{item.kind}</span>
                    <span>{item.reason}</span>
                    <span className={`rounded-full border px-2.5 py-1 ${toneByConfidence[item.confidence] ?? toneByConfidence.낮음}`}>{item.confidence}</span>
                  </div>
                  <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#111111]">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.summary}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px] text-[#6f6256]">
                      <span className="rounded-full border border-[#e6dccd] bg-white px-2.5 py-1">대상 {item.targetLabel}</span>
                      <span className="rounded-full border border-[#e6dccd] bg-white px-2.5 py-1">{item.sourceLabel}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-sm">
                    <button className="rounded-[12px] bg-[#111827] px-3.5 py-2 text-white">승인</button>
                    <button className="rounded-[12px] border border-[#e7dfd3] bg-white px-3.5 py-2 text-[#3f372d]">수정 후 승인</button>
                    <button className="rounded-[12px] border border-[#e7dfd3] bg-white px-3.5 py-2 text-[#3f372d]">보류</button>
                    <button className="rounded-[12px] border border-[#e7dfd3] bg-white px-3.5 py-2 text-[#3f372d]">무시</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        <aside className="grid gap-4">
          <article className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
            <p className="text-[10px] tracking-[0.16em] text-[#95897b]">SELECTED CARD</p>
            <h2 className="mt-2 text-[1.15rem] font-semibold tracking-[-0.03em] text-[#111111]">우측 패널 초안</h2>

            {selected ? (
              <div className="mt-5 grid gap-4 text-sm">
                <div className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">
                  <p className="text-[11px] tracking-[0.16em] text-[#8c7a5b]">원문 요약</p>
                  <p className="mt-2 leading-6 text-[#5f564b]">{selected.summary}</p>
                </div>
                <div className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">
                  <p className="text-[11px] tracking-[0.16em] text-[#8c7a5b]">제안 액션</p>
                  <p className="mt-2 leading-6 text-[#5f564b]">{selected.suggestedAction}</p>
                </div>
                <div className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">
                  <p className="text-[11px] tracking-[0.16em] text-[#8c7a5b]">반영 위치</p>
                  <div className="mt-3 grid gap-2">
                    <Link href={`${base}/people`} className="rounded-[12px] border border-[#e7dfd3] bg-white px-3 py-2 text-[#3f372d]">People에서 확인</Link>
                    <Link href={`${base}/households`} className="rounded-[12px] border border-[#e7dfd3] bg-white px-3 py-2 text-[#3f372d]">Households에서 확인</Link>
                    <Link href={`${base}/timeline`} className="rounded-[12px] border border-[#e7dfd3] bg-white px-3 py-2 text-[#3f372d]">Timeline에서 확인</Link>
                  </div>
                </div>
              </div>
            ) : null}
          </article>

          <article className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
            <p className="text-[10px] tracking-[0.16em] text-[#95897b]">MVP NOTE</p>
            <div className="mt-4 grid gap-3 text-sm text-[#5f564b]">
              <div className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">지금은 review UI 골격부터 바꿔둔 상태야.</div>
              <div className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">다음 단계는 Prisma review queue 모델과 실제 capture 연결이야.</div>
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
