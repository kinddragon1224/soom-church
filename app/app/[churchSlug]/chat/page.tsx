import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getChatThread, getEmptyChatMessages } from "@/lib/chat-review-data";
import { submitChatMessage } from "./actions";

export default async function ChurchChatPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  if (membership.church.slug !== "gido") {
    redirect(`/app/${membership.church.slug}/dashboard`);
  }

  const captures = await getChatThread(membership.church.id);
  const messages = captures.length > 0 ? captures : getEmptyChatMessages();
  const sendMessage = submitChatMessage.bind(null, params.churchSlug);

  return (
    <section className="overflow-hidden rounded-[30px] border border-[#e7dfd3] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="border-b border-[#efe7da] px-5 py-4 lg:px-6">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8c7a5b]">
          <span className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-2.5 py-1">MORA CHAT</span>
          <span className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-2.5 py-1">mokjang input</span>
        </div>
        <h1 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.05em] text-[#111111]">목장 운영 입력</h1>
        <p className="mt-2 text-sm leading-6 text-[#5f564b]">
          목원 등록, 심방 기록, 기도제목, 이벤트, 후속조치를 그냥 말하듯 넣으면 돼.
        </p>
      </div>

      <div className="flex min-h-[760px] flex-col bg-[#fcfbf8]">
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
              className="min-h-[140px] w-full resize-none rounded-[20px] border border-[#efe7da] bg-white px-4 py-3 text-sm leading-6 text-[#171717] outline-none placeholder:text-[#9a8b7a] focus:border-[#111827]"
              placeholder="예: 오상준 형제 허벅지 다쳐서 내일 병원 가. 중보기도 올렸고 다음 주에 한번 연락해봐야 해."
              required
            />
            <div className="mt-3 flex items-center justify-end">
              <button className="inline-flex h-11 items-center justify-center rounded-[16px] bg-[#111827] px-5 text-sm font-semibold text-white">
                보내기
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
