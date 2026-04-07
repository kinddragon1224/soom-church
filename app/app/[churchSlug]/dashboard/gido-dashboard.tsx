import Link from "next/link";
import type { ReactNode } from "react";
import { GIDO_ACTIVE_LEADER_NAMES, GIDO_ROTATION_TRACKS } from "@/lib/gido-leadership";
import { type GidoMemberView, getGidoWorkspaceData } from "@/lib/gido-workspace-data";
import GidoHomeFeedPanel, { type GidoHomePanelItem } from "./gido-home-feed-panel";

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
  const workspaceLabel = data.groupName;
  const urgentMemberCount = data.members.filter((member) => member.requiresFollowUp).length;
  const dailyPrayerTargets = getDailyPrayerTargets(data.members, 2);
  const todayPrayer = dailyPrayerTargets[0] ?? null;
  const nextPrayer = dailyPrayerTargets[1] ?? null;
  const todayPrayerHousehold = todayPrayer ? data.households.find((household) => household.title === todayPrayer.householdName) : null;
  const prayerLead = todayPrayerHousehold?.prayers[0] ?? "오늘은 이 사람의 삶과 마음, 가정의 흐름을 차분히 함께 품어보자.";

  const startSteps = [
    {
      step: "Step 1",
      label: "오늘의 중보 대상 확인",
      href: todayPrayer ? `${base}/members/${todayPrayer.id}` : `${base}/households`,
      action: "보기",
      done: Boolean(todayPrayer),
    },
    {
      step: "Step 2",
      label: "후속 필요한 목원 확인",
      href: `${base}/followups`,
      action: "열기",
      done: urgentMemberCount > 0,
    },
    {
      step: "Step 3",
      label: "이번 모임 전할 근황 확인",
      href: `${base}/updates`,
      action: "열기",
      done: data.updates.length > 0,
    },
    {
      step: "Step 4",
      label: "가정별 메모 확인",
      href: `${base}/households`,
      action: "열기",
      done: data.stats.contactCount > 0 || data.stats.prayerCount > 0,
    },
  ];

  const completedSteps = startSteps.filter((step) => step.done).length;
  const progress = Math.round((completedSteps / startSteps.length) * 100);

  const feedItems: GidoHomePanelItem[] = [
    ...data.updates.slice(0, 3).map((item, index) => ({
      key: `update-${index}-${item.title}`,
      label: "근황",
      title: item.title,
      body: item.body,
      href: `${base}/updates`,
      meta: item.due || "공유 준비",
      tone: "green" as const,
    })),
    ...data.followUps.slice(0, 3).map((item, index) => ({
      key: `followup-${index}-${item.title}`,
      label: "후속",
      title: item.title,
      body: item.note,
      href: `${base}/followups`,
      meta: item.priority,
      tone: item.priority === "높음" ? ("amber" as const) : ("navy" as const),
    })),
  ].slice(0, 6);

  const notificationItemsBase: Array<GidoHomePanelItem | null> = [
    todayPrayer
      ? {
          key: `prayer-${todayPrayer.id}`,
          label: "오늘의 중보",
          title: todayPrayer.name,
          body: `${todayPrayer.householdName} 흐름 안에서 함께 기도할 차례야.`,
          href: `${base}/members/${todayPrayer.id}`,
          meta: todayPrayer.statusTag,
          tone: "green" as const,
        }
      : null,
    {
      key: "followup-alert",
      label: "후속",
      title: urgentMemberCount > 0 ? `후속 필요한 목원 ${urgentMemberCount}명` : "급한 후속 없음",
      body: urgentMemberCount > 0 ? "이번 주에 먼저 연락할 사람부터 확인하면 돼." : "지금은 새로운 후속 알림이 없어.",
      href: `${base}/followups`,
      meta: "운영 알림",
      tone: urgentMemberCount > 0 ? ("amber" as const) : ("navy" as const),
    },
    {
      key: "updates-alert",
      label: "근황",
      title: data.updates.length > 0 ? `공유할 근황 ${data.updates.length}건` : "새 근황 없음",
      body: data.updates.length > 0 ? "모임 전에 읽어둘 근황이 있어." : "지금은 새로 정리된 근황이 없어.",
      href: `${base}/updates`,
      meta: "공유 준비",
      tone: "purple" as const,
    },
    {
      key: "rotation-alert",
      label: "진행",
      title: `순환 진행 가정 ${GIDO_ROTATION_TRACKS.length}가정`,
      body: "올해 순환 흐름 안에서 어느 가정이 진행을 맡는지 바로 확인할 수 있어.",
      href: `${base}/households`,
      meta: "운영 기준",
      tone: "navy" as const,
    },
  ];

  const notificationItems = notificationItemsBase.filter((item): item is GidoHomePanelItem => item !== null);

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <header className="flex flex-col gap-4 rounded-[26px] border border-[#eee7dc] bg-white px-6 py-5 shadow-[0_6px_18px_rgba(15,23,42,0.03)] lg:flex-row lg:items-center lg:justify-between lg:px-7 lg:py-6">
        <div>
          <h1 className="text-[1.85rem] font-semibold tracking-[-0.05em] text-[#111111]">Welcome, {workspaceLabel}</h1>
          <p className="mt-1 text-[13px] leading-6 text-[#6f6458]">
            {currentUserName ? `${currentUserName} 계정으로 들어왔어. ` : ""}
            목장 운영에 필요한 화면만 남겼어.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <HeaderButton href={todayPrayer ? `${base}/members/${todayPrayer.id}` : `${base}/households`} tone="secondary">오늘의 중보</HeaderButton>
          <HeaderButton href={`${base}/members`} tone="primary">목원 관리</HeaderButton>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.95fr_0.82fr]">
        <article className="rounded-[26px] border border-[#eee7dc] bg-white p-5 shadow-[0_6px_18px_rgba(15,23,42,0.03)] lg:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-[#95897b]">MOKJANG HOME</p>
              <h2 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-[#111111]">오늘 목장 체크</h2>
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

        <GidoHomeFeedPanel feedItems={feedItems} notificationItems={notificationItems} />

        <article className="overflow-hidden rounded-[26px] border border-[#ebe4d8] bg-[linear-gradient(180deg,#2d6d46_0%,#111827_100%)] p-5 text-white shadow-[0_8px_24px_rgba(15,23,42,0.05)] lg:p-6">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-white/68">TODAY PRAYER</p>
              <h2 className="mt-3 text-[1.75rem] font-semibold leading-[1.06] tracking-[-0.05em]">
                {todayPrayer ? todayPrayer.name : workspaceLabel}
              </h2>
              <p className="mt-2 text-[12px] text-white/74">
                {todayPrayer ? `${todayPrayer.householdName} · ${todayPrayer.statusTag}` : "오늘 함께 품을 중보 대상을 아직 정하지 못했어."}
              </p>
              <p className="mt-4 text-[13px] leading-6 text-white/84">{prayerLead}</p>
            </div>

            <div className="mt-6 grid gap-2 text-[11px] text-white/82">
              <span className="rounded-full border border-white/14 bg-white/10 px-2.5 py-1">전체 {data.stats.memberCount}명 순환</span>
              <span className="rounded-full border border-white/14 bg-white/10 px-2.5 py-1">현 목자 {GIDO_ACTIVE_LEADER_NAMES.length}명 포함</span>
              {nextPrayer ? <span className="rounded-full border border-white/14 bg-white/10 px-2.5 py-1">다음 순서 {nextPrayer.name}</span> : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={todayPrayer ? `${base}/members/${todayPrayer.id}` : `${base}/households`} className="inline-flex h-10 items-center rounded-[12px] bg-white px-4 text-[13px] font-medium text-[#111827]">
                오늘 중보 보기
              </Link>
              <Link href={`${base}/households`} className="inline-flex h-10 items-center rounded-[12px] border border-white/18 bg-white/10 px-4 text-[13px] font-medium text-white">
                중보 흐름 보기
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <ActionCard title="후속 관리" desc="이번 주 먼저 연락할 사람과 후속 카드를 모아서 봐." href={`${base}/followups`} meta={`${urgentMemberCount}명`} />
        <ActionCard title="가정별 중보" desc="가정 단위 기도제목과 연락 메모를 같이 확인해." href={`${base}/households`} meta={`${data.stats.householdCount}가정`} />
        <ActionCard title="최근 근황" desc="모임 전에 공유할 소식과 메모를 여기서 정리해." href={`${base}/updates`} meta={`${data.updates.length}건`} />
        <ActionCard title="목원 보기" desc="사람별 상세 화면으로 바로 들어가 상태를 관리해." href={`${base}/members`} meta={`${data.stats.memberCount}명`} />
      </section>
    </div>
  );
}

function getDailyPrayerTargets(members: GidoMemberView[], count: number) {
  if (members.length === 0) return [];

  const sortedMembers = [...members].sort((a, b) => {
    const householdCompare = a.householdName.localeCompare(b.householdName, "ko-KR");
    if (householdCompare !== 0) return householdCompare;
    return a.name.localeCompare(b.name, "ko-KR");
  });

  const dateKey = getSeoulDateKey();
  const seed = Number(dateKey.replace(/-/g, ""));
  const startIndex = seed % sortedMembers.length;

  return Array.from({ length: Math.min(count, sortedMembers.length) }, (_, index) => sortedMembers[(startIndex + index) % sortedMembers.length]);
}

function getSeoulDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const get = (type: "year" | "month" | "day") => parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function HeaderButton({ href, tone, children }: { href: string; tone: "primary" | "secondary"; children: ReactNode }) {
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

function ActionButton({ href, children }: { href: string; children: ReactNode }) {
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
