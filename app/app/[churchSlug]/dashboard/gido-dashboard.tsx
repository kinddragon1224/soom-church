import Link from "next/link";
import type { ReactNode } from "react";
import { GIDO_ACTIVE_LEADER_NAMES } from "@/lib/gido-leadership";
import { buildGidoMembersView } from "@/lib/gido-members-view";
import { getDailyPrayerHouseholds } from "@/lib/gido-prayer-rotation";
import { getGidoWorkspaceData } from "@/lib/gido-workspace-data";
import { pinDashboardMember, unpinDashboardMember } from "./actions";
import GidoHomeFeedPanel, { type GidoHomePanelItem } from "./gido-home-feed-panel";

export default async function GidoDashboardPage({
  churchId,
  churchSlug,
  base,
  currentUserName,
}: {
  churchId: string;
  churchSlug: string;
  base: string;
  currentUserName?: string;
}) {
  const data = await getGidoWorkspaceData(churchId);
  const workspaceLabel = data.groupName;
  const urgentMemberCount = data.members.filter((member) => member.requiresFollowUp).length;
  const dailyPrayerTargets = getDailyPrayerHouseholds(
    data.households.filter((household) => household.members.length > 0),
    2,
  );
  const todayPrayer = dailyPrayerTargets[0] ?? null;
  const nextPrayer = dailyPrayerTargets[1] ?? null;
  const prayerLead = todayPrayer?.prayers[0] ?? "오늘 확인할 중보 메모 없음";
  const todayPrayerHref = `${base}/households`;
  const todayPrayerMembers = todayPrayer?.members.slice(0, 4).map((member) => member.name).join(", ") ?? "";
  const dashboardPath = `${base}/dashboard`;

  const memberView = buildGidoMembersView(
    data.members.map((member) => ({
      ...member,
      phone: null,
      household: member.householdName === "미분류" ? null : { name: member.householdName },
    })),
    { filter: "priority" },
  );

  const decoratedMembers = memberView.decoratedMembers;
  const rankedMembers = memberView.rankedMembers;
  const homePinnedMembers = [...decoratedMembers]
    .filter((member) => member.homePinned)
    .sort((a, b) => {
      const pinnedAtDiff = (a.homePinnedAt ?? "").localeCompare(b.homePinnedAt ?? "");
      if (pinnedAtDiff !== 0) return pinnedAtDiff;
      return a.name.localeCompare(b.name, "ko-KR");
    })
    .slice(0, 6);
  const homePinCandidates = decoratedMembers.filter((member) => !member.homePinned);
  const managementTargets = rankedMembers.filter((member) => member.requiresFollowUp).slice(0, 4);

  const feedItems: GidoHomePanelItem[] = [
    ...data.updates.slice(0, 4).map((item, index) => ({
      key: `update-${index}-${item.title}`,
      label: "근황",
      title: item.title,
      body: item.body,
      href: `${base}/updates`,
      meta: item.due || "공유 준비",
      tone: "green" as const,
    })),
    ...data.followUps.slice(0, 2).map((item, index) => ({
      key: `followup-${index}-${item.title}`,
      label: "관리",
      title: item.title,
      body: item.note,
      href: `${base}/followups`,
      meta: item.priority,
      tone: item.priority === "높음" ? ("amber" as const) : ("navy" as const),
    })),
  ].slice(0, 6);

  const notificationItems: GidoHomePanelItem[] = [
    {
      key: "manage-alert",
      label: "관리",
      title: urgentMemberCount > 0 ? `관리 필요한 목원 ${urgentMemberCount}명` : "급한 관리 없음",
      body: urgentMemberCount > 0 ? "관리 보드에서 오늘 처리할 대상을 확인해줘." : "지금은 급한 관리 항목이 없어.",
      href: `${base}/followups`,
      meta: "운영 알림",
      tone: urgentMemberCount > 0 ? ("amber" as const) : ("navy" as const),
    },
    {
      key: "prayer-alert",
      label: "중보",
      title: todayPrayer ? `${todayPrayer.title} 가정 순서` : "오늘 중보 가정 없음",
      body: todayPrayer
        ? `${todayPrayerMembers || "가정 구성원 확인"} · ${prayerLead}`
        : "가정 중보 순서를 먼저 설정해두면 홈에서 바로 확인할 수 있어.",
      href: todayPrayerHref,
      meta: todayPrayer ? `${todayPrayer.members.length}명` : "가정 설정",
      tone: "green" as const,
    },
    {
      key: "updates-alert",
      label: "근황",
      title: data.updates.length > 0 ? `공유할 근황 ${data.updates.length}건` : "새 근황 없음",
      body: data.updates.length > 0 ? "최근 근황을 확인하고 필요한 사람을 이어서 챙겨줘." : "지금은 새로 정리된 근황이 없어.",
      href: `${base}/updates`,
      meta: "업데이트",
      tone: "purple" as const,
    },
  ];

  const startItems = [
    {
      step: "1단계",
      title: "목원 추가",
      body: "새 목원이나 새가족을 먼저 등록해.",
      href: `${base}/members#quick-add`,
      cta: "시작",
    },
    {
      step: "2단계",
      title: "관리 대상 확인",
      body: urgentMemberCount > 0 ? `오늘 관리 필요한 목원 ${urgentMemberCount}명` : "지금은 급한 관리 대상 없음",
      href: `${base}/followups`,
      cta: "확인",
    },
    {
      step: "3단계",
      title: "오늘 중보 확인",
      body: todayPrayer ? `${todayPrayer.title} 가정 중보와 연락 메모 확인` : "가정별 중보 순서 확인",
      href: todayPrayerHref,
      cta: "열기",
    },
    {
      step: "4단계",
      title: "기록 정리",
      body: "심방, 출석, 이벤트 기록은 목원 관리에서 이어서 정리해.",
      href: `${base}/members`,
      cta: "이동",
    },
  ];

  const shortcutItems = [
    {
      title: "목원 관리",
      desc: "목원 추가, 기본 정보, 가정, 출석, 이벤트, 소속 관리",
      href: `${base}/members`,
      meta: `${data.stats.memberCount}명`,
    },
    {
      title: "관리 보드",
      desc: "오늘 처리할 관리 대상과 기록 카드 확인",
      href: `${base}/followups`,
      meta: `${urgentMemberCount}명`,
    },
    {
      title: "중보",
      desc: "가정별 기도제목과 연락 메모, 순서 확인",
      href: `${base}/households`,
      meta: `${data.stats.householdCount}가정`,
    },
    {
      title: "근황",
      desc: "최근 공유할 근황과 메모 정리",
      href: `${base}/updates`,
      meta: `${data.updates.length}건`,
    },
  ];

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <header className="flex flex-col gap-4 rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:flex-row lg:items-start lg:justify-between lg:px-7">
        <div>
          <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">SOOM WORKSPACE HOME</p>
          <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">
            환영합니다{currentUserName ? ` ${currentUserName}` : ""}
          </h1>
          <p className="mt-3 max-w-[720px] text-sm leading-6 text-[#5f564b]">
            {workspaceLabel} 운영을 시작할 준비가 됐어. 홈은 빠르게 들어가는 시작점이고, 실제 사람 관리와 기록은 각 워크스페이스에서 이어서 처리하면 돼.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <HeaderButton href={`${base}/settings`} tone="secondary">설정</HeaderButton>
          <HeaderButton href={`${base}/members`} tone="primary">목원 관리</HeaderButton>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.96fr_0.86fr]">
        <article className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-[#95897b]">START HERE</p>
              <h2 className="mt-2 text-[1.25rem] font-semibold tracking-[-0.03em] text-[#111111]">오늘 시작하기</h2>
            </div>
            <span className="rounded-full border border-[#ece4d8] bg-[#faf7f2] px-2.5 py-1 text-[10px] text-[#8f8478]">홈</span>
          </div>

          <div className="mt-5 grid gap-3">
            {startItems.map((item) => (
              <div key={item.title} className="grid gap-3 rounded-[18px] border border-[#f0ebe3] bg-[#fcfbf8] p-4 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
                <span className="inline-flex h-8 items-center rounded-full border border-[#e4dbc9] bg-white px-3 text-[11px] font-medium text-[#6f6256]">
                  {item.step}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#5f564b]">{item.body}</p>
                </div>
                <Link href={item.href} className="inline-flex h-9 items-center justify-center rounded-[11px] bg-[#111827] px-4 text-[12px] font-medium text-white">
                  {item.cta}
                </Link>
              </div>
            ))}
          </div>
        </article>

        <GidoHomeFeedPanel feedItems={feedItems} notificationItems={notificationItems} />

        <article className="overflow-hidden rounded-[26px] border border-[#ebe4d8] bg-[linear-gradient(180deg,#1d3f31_0%,#111827_100%)] p-5 text-white shadow-[0_8px_24px_rgba(15,23,42,0.05)] lg:p-6">
          <div className="flex h-full flex-col justify-between gap-6">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-white/64">BETA WORKSPACE</p>
              <h2 className="mt-3 text-[1.7rem] font-semibold leading-[1.08] tracking-[-0.05em]">
                우리 목장부터 운영하는 숨 베타
              </h2>
              <p className="mt-3 text-[13px] leading-6 text-white/80">
                숨은 목자가 목원을 관리하기 편하게 만드는 워크스페이스야. 홈은 빠른 진입점으로 두고, 실제 운영은 목원 관리와 기록 화면에서 이어간다.
              </p>
            </div>

            <div className="grid gap-2 text-[11px] text-white/82">
              <span className="rounded-full border border-white/14 bg-white/10 px-2.5 py-1">전체 목원 {data.stats.memberCount}명</span>
              <span className="rounded-full border border-white/14 bg-white/10 px-2.5 py-1">현 목자 {GIDO_ACTIVE_LEADER_NAMES.length}명</span>
              <span className="rounded-full border border-white/14 bg-white/10 px-2.5 py-1">관리 필요 {urgentMemberCount}명</span>
              {nextPrayer ? <span className="rounded-full border border-white/14 bg-white/10 px-2.5 py-1">다음 중보 {nextPrayer.title}</span> : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href={`${base}/members`} className="inline-flex h-10 items-center rounded-[12px] bg-white px-4 text-[13px] font-medium text-[#111827]">
                목원 관리 열기
              </Link>
              <Link href={todayPrayerHref} className="inline-flex h-10 items-center rounded-[12px] border border-white/18 bg-white/10 px-4 text-[13px] font-medium text-white">
                오늘 중보 보기
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        {shortcutItems.map((item) => (
          <ShortcutCard key={item.title} title={item.title} desc={item.desc} href={item.href} meta={item.meta} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-[#95897b]">PINNED PEOPLE</p>
              <h2 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-[#111111]">바로 가는 목원</h2>
            </div>
            <span className="rounded-full border border-[#ece4d8] bg-[#faf7f2] px-2.5 py-1 text-[10px] text-[#8f8478]">{homePinnedMembers.length}명</span>
          </div>

          <div className="mt-5 space-y-2.5">
            {homePinnedMembers.length === 0 ? (
              <EmptyBox text="홈에 고정된 목원이 아직 없어. 자주 보는 목원을 추가해두면 여기서 바로 들어갈 수 있어." compact />
            ) : (
              homePinnedMembers.map((member, index) => (
                <div key={member.id} className="flex items-center justify-between gap-3 rounded-[16px] border border-[#f0ebe3] bg-[#fcfbf8] px-4 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#d9cfbf] bg-white text-[11px] font-semibold text-[#111827]">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-[#1a1a1a]">{member.name}</p>
                      <p className="mt-1 truncate text-[12px] text-[#6f6458]">{member.household?.name ?? "미분류"}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <SmallActionButton href={`${base}/members/${member.id}?filter=priority`}>열기</SmallActionButton>
                    <form action={unpinDashboardMember.bind(null, churchSlug, dashboardPath)}>
                      <input type="hidden" name="memberId" value={member.id} />
                      <button className="inline-flex h-9 items-center rounded-[11px] border border-[#e7e0d4] bg-white px-3 text-[12px] font-medium text-[#171717]">
                        해제
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>

          <form action={pinDashboardMember.bind(null, churchSlug, dashboardPath)} className="mt-4 grid gap-3 rounded-[16px] border border-[#ece4d8] bg-[#fbfaf7] p-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <select name="memberId" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" defaultValue="">
              <option value="">홈에 추가할 목원 선택</option>
              {homePinCandidates.map((member) => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
            <button className="rounded-[12px] bg-[#111827] px-4 py-2 text-sm font-semibold text-white">추가</button>
          </form>
        </article>

        <article className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-[#95897b]">TODAY BRIEF</p>
              <h2 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-[#111111]">오늘 상황</h2>
              <p className="mt-2 text-sm leading-6 text-[#5f564b]">홈에서는 상태만 빠르게 보고, 실제 작업은 각 화면에서 이어가면 돼.</p>
            </div>
            <Link href={`${base}/members`} className="inline-flex h-10 items-center rounded-[12px] border border-[#E7E0D4] bg-white px-4 text-sm font-medium text-[#121212]">
              목원 관리 열기
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MiniMetric label="목원" value={`${data.stats.memberCount}명`} />
            <MiniMetric label="관리 필요" value={`${urgentMemberCount}명`} tone={urgentMemberCount > 0 ? "alert" : "neutral"} />
            <MiniMetric label="가정" value={`${data.stats.householdCount}개`} />
            <MiniMetric label="근황" value={`${data.updates.length}건`} />
          </div>

          <div className="mt-5 grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#111111]">오늘 먼저 볼 대상</p>
              <Link href={`${base}/followups`} className="text-[12px] text-[#8C6A2E] underline underline-offset-4">
                관리 보드 보기
              </Link>
            </div>

            {managementTargets.length === 0 ? (
              <EmptyBox text="지금 바로 챙길 관리 대상은 없어." compact />
            ) : (
              managementTargets.map((member) => (
                <div key={member.id} className="flex items-center justify-between gap-3 rounded-[16px] border border-[#f0ebe3] bg-[#fcfbf8] px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-[#1a1a1a]">{member.name}</p>
                    <p className="mt-1 truncate text-[12px] text-[#6f6458]">{member.household?.name ?? "미분류"} · {member.priorityReason.title}</p>
                  </div>
                  <SmallActionButton href={`${base}/members/${member.id}?filter=followup`}>열기</SmallActionButton>
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </div>
  );
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

function SmallActionButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex h-9 min-w-[72px] items-center justify-center rounded-[11px] bg-[#111827] px-3 text-[12px] font-medium text-white">
      {children}
    </Link>
  );
}

function ShortcutCard({ title, desc, href, meta }: { title: string; desc: string; href: string; meta: string }) {
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

function MiniMetric({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "alert" }) {
  return (
    <div className={`rounded-[18px] border p-4 ${tone === "alert" ? "border-[#ead9af] bg-[#fff7e8]" : "border-[#ece4d8] bg-[#fbfaf7]"}`}>
      <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[#111111]">{value}</p>
    </div>
  );
}

function EmptyBox({ text, compact = false }: { text: string; compact?: boolean }) {
  return <div className={`rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] text-sm text-[#5f564b] ${compact ? "p-4" : "p-6"}`}>{text}</div>;
}
