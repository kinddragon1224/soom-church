import Link from "next/link";
import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { formatReviewReason, formatUpdateType, getPendingReviewQueue } from "@/lib/chat-review-data";
import { resolveReviewItem } from "./actions";

const filterLabels = ["전체", "사람", "가정", "관계", "기록", "출석", "후속"];

export default async function ChurchReviewPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  if (membership.church.slug !== "gido") {
    redirect(`/app/${membership.church.slug}/dashboard`);
  }

  const base = `/app/${membership.church.slug}`;
  const reviewItems = await getPendingReviewQueue(membership.church.id);
  const selected = reviewItems[0] ?? null;
  const reviewAction = resolveReviewItem.bind(null, params.churchSlug);

  return (
    <div className="flex flex-col gap-5 text-[#171717]">
      <header className="rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">REVIEW QUEUE</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">검토 대기 큐</h1>
            <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#5f564b]">
              채팅 입력에서 ambiguity flag가 생긴 항목만 여기로 올라온다. 예시처럼, `김민수 어머니 수술 예정 -&gt; 건강 기록으로 저장할까?` 같은 카드 흐름으로 본다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={`${base}/chat`} className="rounded-[12px] border border-[#e7dfd3] bg-[#faf7f2] px-3 py-2 text-sm text-[#3f372d]">
              Chat
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
            {reviewItems.length === 0 ? (
              <div className="rounded-[20px] border border-[#efe7da] bg-[#fcfbf8] px-4 py-10 text-center text-sm text-[#6f6256]">
                지금은 검토 대기 카드가 없어.
              </div>
            ) : (
              reviewItems.map((item) => (
                <div key={item.id} className="rounded-[22px] border border-[#efe7da] bg-[#fcfbf8] p-4 lg:p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8c7a5b]">
                    <span className="rounded-full border border-[#e6dccd] bg-white px-2.5 py-1">{formatUpdateType(item.extractedUpdate.updateType)}</span>
                    <span>{formatReviewReason(item.reviewReason)}</span>
                    <span className="rounded-full border border-[#e6dccd] bg-white px-2.5 py-1">{Math.round(item.extractedUpdate.confidence * 100)}%</span>
                  </div>

                  <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#111111]">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.summary}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px] text-[#6f6256]">
                      {item.extractedUpdate.targetMemberHint ? (
                        <span className="rounded-full border border-[#e6dccd] bg-white px-2.5 py-1">사람 {item.extractedUpdate.targetMemberHint}</span>
                      ) : null}
                      {item.extractedUpdate.targetHouseholdHint ? (
                        <span className="rounded-full border border-[#e6dccd] bg-white px-2.5 py-1">가정 {item.extractedUpdate.targetHouseholdHint}</span>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-sm">
                    <form action={reviewAction}>
                      <input type="hidden" name="reviewItemId" value={item.id} />
                      <input type="hidden" name="status" value="APPROVED" />
                      <button className="rounded-[12px] bg-[#111827] px-3.5 py-2 text-white">승인</button>
                    </form>
                    <form action={reviewAction}>
                      <input type="hidden" name="reviewItemId" value={item.id} />
                      <input type="hidden" name="status" value="EDITED_AND_APPROVED" />
                      <button className="rounded-[12px] border border-[#e7dfd3] bg-white px-3.5 py-2 text-[#3f372d]">수정 후 승인</button>
                    </form>
                    <form action={reviewAction}>
                      <input type="hidden" name="reviewItemId" value={item.id} />
                      <input type="hidden" name="status" value="SKIPPED" />
                      <button className="rounded-[12px] border border-[#e7dfd3] bg-white px-3.5 py-2 text-[#3f372d]">보류</button>
                    </form>
                    <form action={reviewAction}>
                      <input type="hidden" name="reviewItemId" value={item.id} />
                      <input type="hidden" name="status" value="REJECTED" />
                      <button className="rounded-[12px] border border-[#e7dfd3] bg-white px-3.5 py-2 text-[#3f372d]">무시</button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        <aside className="grid gap-4">
          <article className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
            <p className="text-[10px] tracking-[0.16em] text-[#95897b]">SELECTED CARD</p>
            <h2 className="mt-2 text-[1.15rem] font-semibold tracking-[-0.03em] text-[#111111]">우측 패널</h2>

            {selected ? (
              <div className="mt-5 grid gap-4 text-sm">
                <div className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">
                  <p className="text-[11px] tracking-[0.16em] text-[#8c7a5b]">원문</p>
                  <p className="mt-2 whitespace-pre-wrap leading-6 text-[#5f564b]">{selected.extractedUpdate.capture.rawText}</p>
                </div>
                <div className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">
                  <p className="text-[11px] tracking-[0.16em] text-[#8c7a5b]">추출 결과</p>
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-[12px] leading-5 text-[#5f564b]">
                    {JSON.stringify(selected.extractedUpdate.payloadJson, null, 2)}
                  </pre>
                </div>
                <div className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">
                  <p className="text-[11px] tracking-[0.16em] text-[#8c7a5b]">제안 액션</p>
                  <p className="mt-2 leading-6 text-[#5f564b]">{selected.suggestedAction}</p>
                </div>
              </div>
            ) : null}
          </article>

          <article className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
            <p className="text-[10px] tracking-[0.16em] text-[#95897b]">PIPELINE</p>
            <div className="mt-4 grid gap-3 text-sm text-[#5f564b]">
              <div className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">1. Chat에서 메시지 입력</div>
              <div className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">2. Capture 저장</div>
              <div className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">3. AI extract</div>
              <div className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">4. ambiguity flag가 있으면 Review Queue 등록</div>
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
