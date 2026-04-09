import Link from "next/link";
import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getAppliedRecordLog } from "@/lib/chat-apply-log";

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

const toneByKind: Record<string, string> = {
  FOLLOW_UP: "border-[#f1d7ad] bg-[#fff7ea] text-[#8c5d16]",
  CARE_RECORD: "border-[#d9e1f2] bg-[#f5f8ff] text-[#355a8b]",
  PRAYER: "border-[#e2d6f6] bg-[#f8f3ff] text-[#6a4aa3]",
  RELATIONSHIP: "border-[#d7eadb] bg-[#f4fbf5] text-[#35634a]",
  STATUS_CHANGE: "border-[#f0d4df] bg-[#fff6f9] text-[#944b67]",
  CHURCH_EVENT: "border-[#f5dfc2] bg-[#fff8ef] text-[#9b6b1d]",
};

export default async function ChurchTimelinePage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  if (membership.church.slug !== "gido") {
    redirect(`/app/${membership.church.slug}/dashboard`);
  }

  const base = `/app/${membership.church.slug}`;
  const events = await getAppliedRecordLog(membership.church.id, 80);

  return (
    <div className="flex flex-col gap-5 text-[#171717]">
      <header className="rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">TIMELINE</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">실제 반영 타임라인</h1>
            <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#5f564b]">
              이제 예시 데이터가 아니라 apply 결과를 시간순으로 본다. Chat에서 확정된 기록만 여기로 내려온다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={`${base}/chat`} className="rounded-[12px] border border-[#e7dfd3] bg-[#faf7f2] px-3 py-2 text-sm text-[#3f372d]">Chat</Link>
            <Link href={`${base}/review`} className="rounded-[12px] border border-[#e7dfd3] bg-[#faf7f2] px-3 py-2 text-sm text-[#3f372d]">Review</Link>
            <Link href={`${base}/people`} className="rounded-[12px] border border-[#111827] bg-[#111827] px-3 py-2 text-sm text-white">People</Link>
          </div>
        </div>
      </header>

      <section className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
        <div className="grid gap-4">
          {events.length === 0 ? (
            <div className="rounded-[20px] border border-[#efe7da] bg-[#fcfbf8] px-4 py-10 text-center text-sm text-[#6f6256]">
              아직 반영된 타임라인 이벤트가 없어.
            </div>
          ) : (
            events.map((item, index) => (
              <div key={item.id} className="grid gap-3 lg:grid-cols-[72px_minmax(0,1fr)] lg:gap-4">
                <div className="flex items-start gap-3 lg:flex-col lg:items-center">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e8dfd3] bg-[#faf7f2] text-sm font-semibold text-[#111111]">
                    {index + 1}
                  </span>
                  <div className="hidden h-full w-px bg-[#efe7da] lg:block" />
                </div>

                <div className="rounded-[22px] border border-[#efe7da] bg-[#fcfbf8] p-4 lg:p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8c7a5b]">
                    <span className={`rounded-full border px-2.5 py-1 ${toneByKind[item.updateType] ?? "border-[#d9e1f2] bg-[#f5f8ff] text-[#355a8b]"}`}>{item.updateTypeLabel}</span>
                    <span>{formatDateTime(item.appliedAt)}</span>
                    {item.primaryHouseholdId ? <span>가정 반영</span> : null}
                    {item.primaryMemberId ? <span>사람 반영</span> : null}
                  </div>
                  <h2 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-[#111111]">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.body}</p>
                  <div className="mt-4 rounded-[16px] border border-[#ebe3d6] bg-white px-3 py-3 text-[12px] leading-5 text-[#7c6f62]">
                    원문: {item.captureText}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
