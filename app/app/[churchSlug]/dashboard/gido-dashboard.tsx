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
    <div className="flex flex-col gap-4 lg:gap-5">
      <header className="flex flex-col gap-4 rounded-[26px] border border-[#eee7dc] bg-white px-6 py-5 shadow-[0_6px_18px_rgba(15,23,42,0.03)] lg:flex-row lg:items-center lg:justify-between lg:px-7 lg:py-6">
        <div>
          <h1 className="text-[1.85rem] font-semibold tracking-[-0.05em] text-[#111111]">Welcome, {displayName}</h1>
          <p className="mt-1 text-[13px] leading-6 text-[#6f6458]">오늘 필요한 화면만 남겼어. 여기서 바로 들어가면 돼.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <HeaderButton href={`${base}/members/new`} tone="secondary">새 목원 추가</HeaderButton>
          <HeaderButton href={`${base}/members`} tone="primary">목원 관리</HeaderButton>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.95fr_0.78fr]">
        <article className="rounded-[26px] border border-[#eee7dc] bg-white p-5 shadow-[0_6px_18px_rgba(15,23,42,0.03)] lg:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-[#95897b]">GET STARTED WITH G.I.D.O</p>
              <h2 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-[#111111]">이번 주 목장 진행</h2>
            </div>
            <span className="rounded-full border border-[#ece4d8] bg-[#faf7f2] px-2.5 py-1 text-[10px] text-[#8f8478]">{progress}% complete</span>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#f2ede5]">
            <div className="h-full rounded-full bg-[#111827]" style={{ width: `${progress}%` }} />
          </div>

          <div className="mt-5 space-y-2.5">
            {startSteps.map((step) => (
              <div key={step.label} className="flex items-center justify-between gap-3 rounded-[16px] border border-[#f0ebe3] bg-[#fcfbf8] px-4 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${step.done ? "border-[#111827] bg-[#111827] text-white" : "border-[#d9cfbf] text-[#95897b]"}`}>
                    •
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[0.08em] text-[#95897b]">{step.step}</p>
                    <p className="truncate text-[13px] font-medium text-[#1a1a1a]">{step.label}</p>
                  </div>
                </div>
                <ActionButton href={step.href}>{step.action}</ActionButton>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[26px] border border-[#eee7dc] bg-white p-5 shadow-[0_6px_18px_rgba(15,23,42,0.03)] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex rounded-full border border-[#ece5db] bg-[#f7f5f0] p-1">
              <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-[#171717] shadow-sm">Feed</span>
              <span className="px-3 py-1.5 text-[11px] font-medium text-[#8c8175]">Notifications</span>
            </div>
            <span className="text-[11px] text-[#8f8478]">{flowItems.length} items</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {flowItems.length === 0 ? (
              <EmptyBox text="최근 흐름이 아직 없어." compact />
            ) : (
              flowItems.map((item) => (
                <article key={`${item.type}-${item.title}`} className="rounded-[16px] border border-[#f0ebe3] bg-[#fcfbf8] p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#111827] text-[10px] font-semibold text-white">
                      soom
                    </span>
                    <div className="min-w-0">
                      <span className="rounded-full border border-[#e4dbc9] bg-white px-2 py-0.5 text-[10px] text-[#6f6256]">{item.type}</span>
                      <p className="mt-2 text-[13px] font-semibold text-[#111111]">{item.title}</p>
                      <p className="mt-1 text-[13px] leading-6 text-[#5f564b]">{item.body}</p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </article>

        <article className="overflow-hidden rounded-[26px] border border-[#ebe4d8] bg-[linear-gradient(180deg,#2d6d46_0%,#111827_100%)] p-5 text-white shadow-[0_8px_24px_rgba(15,23,42,0.05)] lg:p-6">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-white/68">THIS WEEK</p>
              <h2 className="mt-3 text-[1.75rem] font-semibold leading-[1.06] tracking-[-0.05em]">
                {highlightHousehold ? highlightHousehold.title : data.groupName}
              </h2>
              <p className="mt-3 text-[13px] leading-6 text-white/80">
                {highlightHousehold?.prayers[0] ?? "이번 주 함께 품을 기도제목부터 차분히 정리해봐."}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-[11px] text-white/82">
              <span className="rounded-full border border-white/14 bg-white/10 px-2.5 py-1">현 목자 {GIDO_ACTIVE_LEADER_NAMES.length}명</span>
              <span className="rounded-full border border-white/14 bg-white/10 px-2.5 py-1">순환 진행 {GIDO_ROTATION_TRACKS.length}가정</span>
            </div>

            <div className="mt-6">
              <Link href={`${base}/households`} className="inline-flex h-10 items-center rounded-[12px] bg-white px-4 text-[13px] font-medium text-[#111827]">
                가정별 중보 보기
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ActionCard title="후속 관리" desc="이번 주 챙길 사람과 실제 후속 카드를 모아서 봐." href={`${base}/followups`} meta={`${urgentMemberCount}명`} />
        <ActionCard title="가정별 중보" desc="가정 단위 기도제목과 연락 메모를 확인해." href={`${base}/households`} meta={`${data.stats.householdCount}가정`} />
        <ActionCard title="목원 보기" desc="사람별 디테일 관리 화면으로 바로 들어가." href={`${base}/members`} meta={`${data.stats.memberCount}명`} />
      </section>
    </div>
  );
}

function HeaderButton({ href, tone, children }: { href: string; tone: "primary" | "secondary"; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`inline-flex h-10 items-center rounded-[12px] px-4 text-[13px] font-medium transition ${
        tone === "primary"
          ? "bg-[#111827] text-white"
          : "border border-[#e9e1d4] bg-white text-[#171717] hover:bg-[#faf7f2]"
      }`}
    >
      {children}
    </Link>
  );
}

function ActionButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex h-9 min-w-[78px] items-center justify-center rounded-[11px] bg-[#111827] px-3 text-[12px] font-medium text-white">
      {children}
    </Link>
  );
}

function ActionCard({ title, desc, href, meta }: { title: string; desc: string; href: string; meta: string }) {
  return (
    <Link href={href} className="rounded-[24px] border border-[#ebe4d8] bg-white p-5 shadow-[0_6px_18px_rgba(15,23,42,0.03)] transition hover:translate-y-[-1px] hover:shadow-[0_10px_24px_rgba(15,23,42,0.05)] lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[14px] font-semibold text-[#171717]">{title}</p>
        <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-2.5 py-1 text-[10px] text-[#6f6256]">{meta}</span>
      </div>
      <p className="mt-2 text-[13px] leading-6 text-[#5f564b]">{desc}</p>
    </Link>
  );
}

function EmptyBox({ text, compact = false }: { text: string; compact?: boolean }) {
  return <div className={`rounded-[16px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] text-[13px] text-[#5f564b] ${compact ? "p-4" : "p-6"}`}>{text}</div>;
}
