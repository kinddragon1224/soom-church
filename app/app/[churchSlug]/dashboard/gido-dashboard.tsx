import Link from "next/link";
import { GIDO_ACTIVE_LEADER_NAMES, GIDO_ROTATION_TRACKS } from "@/lib/gido-leadership";
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
  const urgentMemberCount = data.members.filter((member) => member.requiresFollowUp).length;

  const startSteps = [
    { step: "Step 1", label: "이번 진행 가정 확인", href: `${base}/households`, action: "열기", done: GIDO_ROTATION_TRACKS.length > 0 },
    { step: "Step 2", label: "후속 필요한 목원 확인", href: `${base}/followups`, action: "열기", done: urgentMemberCount > 0 },
    { step: "Step 3", label: "최근 근황 확인", href: `${base}/updates`, action: "열기", done: data.updates.length > 0 },
    { step: "Step 4", label: "새 목원 추가", href: `${base}/members/new`, action: "추가", done: false },
  ];

  const completedSteps = startSteps.filter((step) => step.done).length;
  const progress = Math.round((completedSteps / startSteps.length) * 100);

  const flowItems = [
    ...data.updates.slice(0, 2).map((item) => ({ type: "근황", title: item.title, body: item.body })),
    ...data.followUps.slice(0, 2).map((item) => ({ type: "후속", title: item.title, body: item.note })),
  ].slice(0, 4);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-4 rounded-[28px] border border-[#ece4d9] bg-white px-6 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-[2rem] font-semibold tracking-[-0.06em] text-[#111111]">Welcome, {displayName}</h1>
          <p className="mt-1 text-sm leading-6 text-[#6b5f50]">오늘 필요한 화면만 남겼어. 여기서 바로 들어가면 돼.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`${base}/members/new`} className="rounded-[14px] border border-[#e6dfd5] bg-white px-4 py-2.5 text-sm font-medium text-[#171717]">
            새 목원 추가
          </Link>
          <Link href={`${base}/members`} className="rounded-[14px] bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white">
            목원 관리
          </Link>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.95fr_0.78fr]">
        <article className="rounded-[28px] border border-[#ebe4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#8f8478]">Get Started with G.I.D.O</p>
              <h2 className="mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-[#111111]">이번 주 목장 진행</h2>
            </div>
            <span className="text-xs text-[#8f8478]">{progress}% complete</span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#f1ece4]">
            <div className="h-full rounded-full bg-[#111827]" style={{ width: `${progress}%` }} />
          </div>

          <div className="mt-5 space-y-3">
            {startSteps.map((step) => (
              <div key={step.label} className="flex items-center justify-between gap-3 rounded-[18px] border border-[#eee8de] bg-[#fcfbf8] px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] ${step.done ? "border-[#111827] bg-[#111827] text-white" : "border-[#d8cdbd] text-[#8f8478]"}`}>
                    ○
                  </span>
                  <div>
                    <p className="text-[11px] text-[#8f8478]">{step.step}</p>
                    <p className="text-sm font-medium text-[#171717]">{step.label}</p>
                  </div>
                </div>
                <Link href={step.href} className="min-w-[86px] rounded-[12px] bg-[#111827] px-3 py-2 text-center text-xs font-semibold text-white">
                  {step.action}
                </Link>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-[#ebe4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex rounded-full border border-[#ece5db] bg-[#f7f5f0] p-1">
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#171717] shadow-sm">Feed</span>
              <span className="px-3 py-1.5 text-xs font-medium text-[#8c8175]">Notifications</span>
            </div>
            <span className="text-xs text-[#8f8478]">{flowItems.length} items</span>
          </div>

          <div className="mt-4 space-y-3">
            {flowItems.length === 0 ? (
              <EmptyBox text="최근 흐름이 아직 없어." compact />
            ) : (
              flowItems.map((item) => (
                <article key={`${item.type}-${item.title}`} className="rounded-[18px] border border-[#eee8de] bg-[#fcfbf8] p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#111827] text-xs font-semibold text-white">
                      soom
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-[#e4dbc9] bg-white px-2 py-0.5 text-[10px] text-[#6f6256]">{item.type}</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-[#111111]">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-[#5f564b]">{item.body}</p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </article>

        <article className="overflow-hidden rounded-[28px] border border-[#ebe4d8] bg-[linear-gradient(180deg,#2d6d46_0%,#111827_100%)] p-5 text-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-white/70">이번 주 중보</p>
              <h2 className="mt-3 text-[1.9rem] font-semibold leading-[1.05] tracking-[-0.06em]">
                {highlightHousehold ? highlightHousehold.title : data.groupName}
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/80">
                {highlightHousehold?.prayers[0] ?? "이번 주 함께 품을 기도제목부터 차분히 정리해봐."}
              </p>
            </div>

            <div className="mt-8 space-y-3 text-sm text-white/80">
              <p>현 목자 {GIDO_ACTIVE_LEADER_NAMES.length}명</p>
              <p>순환 진행 {GIDO_ROTATION_TRACKS.length}가정</p>
            </div>

            <div className="mt-6">
              <Link href={`${base}/households`} className="inline-flex rounded-[14px] bg-white px-4 py-2.5 text-sm font-semibold text-[#111827]">
                가정별 중보 보기
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ActionCard title="후속 관리" desc="이번 주 챙길 사람과 실제 후속 카드를 모아서 봐." href={`${base}/followups`} />
        <ActionCard title="가정별 중보" desc="가정 단위 기도제목과 연락 메모를 확인해." href={`${base}/households`} />
        <ActionCard title="목원 보기" desc="사람별 디테일 관리 화면으로 바로 들어가." href={`${base}/members`} />
      </section>
    </div>
  );
}

function ActionCard({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="rounded-[24px] border border-[#ebe4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] transition hover:translate-y-[-1px] hover:shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
      <p className="text-sm font-semibold text-[#171717]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{desc}</p>
    </Link>
  );
}

function EmptyBox({ text, compact = false }: { text: string; compact?: boolean }) {
  return <div className={`rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] text-sm text-[#5f564b] ${compact ? "p-4" : "p-6"}`}>{text}</div>;
}
