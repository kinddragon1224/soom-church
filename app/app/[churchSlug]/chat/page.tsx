import Link from "next/link";
import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { buildGidoRecoveryQueries } from "@/lib/gido-chat-first";
import { getGidoWorkspaceData } from "@/lib/gido-workspace-data";
import { formatReviewReason, getChatThread, getEmptyChatMessages, getPendingReviewQueue } from "@/lib/chat-review-data";
import { submitChatMessage } from "./actions";

export default async function ChurchChatPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  if (membership.church.slug !== "gido") {
    redirect(`/app/${membership.church.slug}/dashboard`);
  }

  const base = `/app/${membership.church.slug}`;
  const [data, captures, reviewItems] = await Promise.all([
    getGidoWorkspaceData(membership.church.id),
    getChatThread(membership.church.id),
    getPendingReviewQueue(membership.church.id),
  ]);

  const messages = captures.length > 0 ? captures : getEmptyChatMessages();
  const recoveryQueries = buildGidoRecoveryQueries(data);
  const sendMessage = submitChatMessage.bind(null, params.churchSlug);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="overflow-hidden rounded-[30px] border border-[#e7dfd3] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="border-b border-[#efe7da] px-5 py-4 lg:px-6">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8c7a5b]">
            <span className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-2.5 py-1">MORA CHAT</span>
            <span className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-2.5 py-1">gido workspace</span>
            <span className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-2.5 py-1">review {reviewItems.length}건</span>
          </div>
          <h1 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.05em] text-[#111111]">목장 운영 채팅</h1>
          <p className="mt-2 text-sm leading-6 text-[#5f564b]">
            목자는 여기서 말하고, 애매한 내용만 Review Queue로 보낸다. People, Households, Timeline은 이 대화 결과가 쌓이는 탭이다.
          </p>
        </div>

        <div className="flex min-h-[720px] flex-col bg-[#fcfbf8]">
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5 lg:px-6">
            {messages.map((message) => {
              const assistant = message.speakerRole === "ASSISTANT" || message.speakerRole === "SYSTEM";
              const meta = assistant ? "모라" : "목자";

              return (
                <div key={message.id} className={`flex ${assistant ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[85%] rounded-[24px] px-4 py-3 shadow-[0_4px_14px_rgba(15,23,42,0.04)] ${
                      assistant ? "border border-[#e7dfd3] bg-white text-[#171717]" : "bg-[#111827] text-white"
                    }`}
                  >
                    <p className={`text-[11px] ${assistant ? "text-[#8c7a5b]" : "text-white/58"}`}>{meta}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{message.rawText}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#efe7da] bg-white px-4 py-4 sm:px-5 lg:px-6">
            <form action={sendMessage} className="rounded-[26px] border border-[#e7dfd3] bg-[#fcfbf8] p-3">
              <textarea
                name="message"
                className="min-h-[132px] w-full resize-none rounded-[20px] border border-[#efe7da] bg-white px-4 py-3 text-sm leading-6 text-[#171717] outline-none placeholder:text-[#9a8b7a] focus:border-[#111827]"
                placeholder="예: 민수네 어머니 수술 잡혔고, 이번 주 예배는 아내도 같이 왔어. 다음 주에 한번 연락해야 할 것 같아."
                required
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2 text-[11px] text-[#8c7a5b]">
                  <span className="rounded-full border border-[#e7dfd3] bg-white px-2.5 py-1">member</span>
                  <span className="rounded-full border border-[#e7dfd3] bg-white px-2.5 py-1">household</span>
                  <span className="rounded-full border border-[#e7dfd3] bg-white px-2.5 py-1">prayer</span>
                  <span className="rounded-full border border-[#e7dfd3] bg-white px-2.5 py-1">care_record</span>
                  <span className="rounded-full border border-[#e7dfd3] bg-white px-2.5 py-1">attendance</span>
                </div>
                <button className="inline-flex h-11 items-center justify-center rounded-[16px] bg-[#111827] px-5 text-sm font-semibold text-white">
                  보내기
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <aside className="grid gap-4">
        <article className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
          <p className="text-[10px] tracking-[0.16em] text-[#95897b]">THIS CHAT WILL UPDATE</p>
          <div className="mt-4 grid gap-3 text-sm">
            <QuickLink href={`${base}/review`} title="Review" body={`${reviewItems.length}건 검토 대기`} />
            <QuickLink href={`${base}/people`} title="People" body="사람별 레코드 연결" />
            <QuickLink href={`${base}/households`} title="Households" body="가정 관계 반영" />
            <QuickLink href={`${base}/timeline`} title="Timeline" body="기록 흐름 누적" />
          </div>
        </article>

        <article className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-[#95897b]">REVIEW PREVIEW</p>
              <h2 className="mt-2 text-[1.15rem] font-semibold tracking-[-0.03em] text-[#111111]">바로 생길 검토 카드</h2>
            </div>
            <Link href={`${base}/review`} className="text-sm text-[#8c6a2e] underline underline-offset-4">
              열기
            </Link>
          </div>
          <div className="mt-4 grid gap-3">
            {reviewItems.length === 0 ? (
              <div className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4 text-sm leading-6 text-[#6f6256]">
                지금은 Review Queue에 올라온 카드가 없어.
              </div>
            ) : (
              reviewItems.slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">
                  <p className="text-[11px] text-[#8c7a5b]">{formatReviewReason(item.reviewReason)}</p>
                  <p className="mt-2 text-sm font-semibold text-[#111111]">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.summary}</p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
          <p className="text-[10px] tracking-[0.16em] text-[#95897b]">RECOVER</p>
          <h2 className="mt-2 text-[1.15rem] font-semibold tracking-[-0.03em] text-[#111111]">자주 찾을 질문</h2>
          <div className="mt-4 grid gap-3">
            {recoveryQueries.map((item) => (
              <div key={item.label} className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">
                <p className="text-sm font-semibold text-[#111111]">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.query}</p>
              </div>
            ))}
          </div>
        </article>
      </aside>
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
