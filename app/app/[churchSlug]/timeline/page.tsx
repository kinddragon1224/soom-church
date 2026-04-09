import Link from "next/link";
import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { buildGidoTimelineEvents } from "@/lib/gido-chat-first";
import { getGidoWorkspaceData } from "@/lib/gido-workspace-data";

const toneByKind: Record<string, string> = {
  follow_up: "border-[#f1d7ad] bg-[#fff7ea] text-[#8c5d16]",
  update: "border-[#d9e1f2] bg-[#f5f8ff] text-[#355a8b]",
  household: "border-[#e2d6f6] bg-[#f8f3ff] text-[#6a4aa3]",
};

export default async function ChurchTimelinePage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  if (membership.church.slug !== "gido") {
    redirect(`/app/${membership.church.slug}/dashboard`);
  }

  const base = `/app/${membership.church.slug}`;
  const data = await getGidoWorkspaceData(membership.church.id);
  const events = buildGidoTimelineEvents(data);

  return (
    <div className="flex flex-col gap-5 text-[#171717]">
      <header className="rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">TIMELINE</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">최근 기록 흐름</h1>
            <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#5f564b]">
              심방, 후속, 가정 메모, 근황을 시간 흐름처럼 이어서 보는 자리야. 지금은 v2 골격부터 먼저 잡아둔다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={`${base}/today`} className="rounded-[12px] border border-[#e7dfd3] bg-[#faf7f2] px-3 py-2 text-sm text-[#3f372d]">Today</Link>
            <Link href={`${base}/review`} className="rounded-[12px] border border-[#111827] bg-[#111827] px-3 py-2 text-sm text-white">Review</Link>
          </div>
        </div>
      </header>

      <section className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
        <div className="grid gap-4">
          {events.length === 0 ? (
            <div className="rounded-[20px] border border-[#efe7da] bg-[#fcfbf8] px-4 py-10 text-center text-sm text-[#6f6256]">
              아직 표시할 타임라인 이벤트가 없어.
            </div>
          ) : (
            events.map((item, index) => (
              <div key={item.id} className="grid gap-3 lg:grid-cols-[64px_minmax(0,1fr)] lg:gap-4">
                <div className="flex items-start gap-3 lg:flex-col lg:items-center">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e8dfd3] bg-[#faf7f2] text-sm font-semibold text-[#111111]">
                    {index + 1}
                  </span>
                  <div className="hidden h-full w-px bg-[#efe7da] lg:block" />
                </div>

                <div className="rounded-[22px] border border-[#efe7da] bg-[#fcfbf8] p-4 lg:p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8c7a5b]">
                    <span className={`rounded-full border px-2.5 py-1 ${toneByKind[item.kind] ?? toneByKind.update}`}>{item.kind}</span>
                    <span>{item.meta}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-[#111111]">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.body}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
