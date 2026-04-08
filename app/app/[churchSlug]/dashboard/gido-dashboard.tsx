import Link from "next/link";
import type { ReactNode } from "react";
import { GIDO_ACTIVE_LEADER_NAMES, GIDO_ROTATION_TRACKS } from "@/lib/gido-leadership";
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
  const prayerLead = todayPrayer?.prayers[0] ?? "오늘의 중보 메모 없음";
  const todayPrayerHref = `${base}/households`;
  const todayPrayerMembers = todayPrayer?.members.slice(0, 4).map((member) => member.name).join(", ") ?? "";
  const dashboardPath = `${base}/dashboard`;
  const decoratedMembers = buildGidoMembersView(
    data.members.map((member) => ({
      ...member,
      phone: null,
      household: member.householdName === "미분류" ? null : { name: member.householdName },
    })),
    { filter: "priority" },
  ).decoratedMembers;
  const homePinnedMembers = [...decoratedMembers]
    .filter((member) => member.homePinned)
    .sort((a, b) => {
      const pinnedAtDiff = (a.homePinnedAt ?? "").localeCompare(b.homePinnedAt ?? "");
      if (pinnedAtDiff !== 0) return pinnedAtDiff;
      return a.name.localeCompare(b.name, "ko-KR");
    })
    .slice(0, 6);
  const homePinCandidates = decoratedMembers.filter((member) => !member.homePinned);


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
          key: `prayer-${todayPrayer.title}`,
          label: "오늘의 중보",
          title: todayPrayer.title,
          body: todayPrayerMembers || "가정 구성원 확인",
          href: todayPrayerHref,
          meta: `${todayPrayer.members.length}명`,
          tone: "green" as const,
        }
      : null,
    {
      key: "followup-alert",
      label: "후속",
      title: urgentMemberCount > 0 ? `후속 필요한 목원 ${urgentMemberCount}명` : "급한 후속 없음",
      body: urgentMemberCount > 0 ? "확인할 후속 대상 있음" : "새 후속 알림 없음",
      href: `${base}/followups`,
      meta: "운영 알림",
      tone: urgentMemberCount > 0 ? ("amber" as const) : ("navy" as const),
    },
    {
      key: "updates-alert",
      label: "근황",
      title: data.updates.length > 0 ? `공유할 근황 ${data.updates.length}건` : "새 근황 없음",
      body: data.updates.length > 0 ? "확인할 근황 있음" : "새 근황 없음",
      href: `${base}/updates`,
      meta: "공유 준비",
      tone: "purple" as const,
    },
    {
      key: "rotation-alert",
      label: "진행",
      title: `순환 진행 가정 ${GIDO_ROTATION_TRACKS.length}가정`,
      body: "순환 진행 가정 현황",
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
          <p className="mt-1 text-[13px] leading-6 text-[#6f6458]">{currentUserName ? `${currentUserName} 계정` : "워크스페이스"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <HeaderButton href={todayPrayerHref} tone="secondary">오늘의 중보 가정</HeaderButton>
          <HeaderButton href={`${base}/members?filter=priority`} tone="primary">운영 우선 목원</HeaderButton>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.95fr_0.82fr]">
        <article className="rounded-[26px] border border-[#eee7dc] bg-white p-5 shadow-[0_6px_18px_rgba(15,23,42,0.03)] lg:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-[#95897b]">HOME PICKS</p>
              <h2 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-[#111111]">지금 바로 볼 목원</h2>
            </div>
            <span className="rounded-full border border-[#ece4d8] bg-[#faf7f2] px-2.5 py-1 text-[10px] text-[#8f8478]">선택 {homePinnedMembers.length}명</span>
          </div>

          <div className="mt-5 space-y-2.5">
            {homePinnedMembers.length === 0 ? (
              <div className="rounded-[16px] border border-dashed border-[#d9cfbf] bg-[#fcfbf8] px-4 py-5 text-[13px] leading-6 text-[#5f564b]">
                홈에 고정된 목원 없음
              </div>
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
                    <ActionButton href={`${base}/members/${member.id}?filter=priority`}>상세</ActionButton>
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
                <option key={member.id} value={member.id}>{member.name}{"birthLabel" in member && typeof member.birthLabel === "string" ? ` · ${member.birthLabel}` : ""}</option>
              ))}
            </select>
            <button className="rounded-[12px] bg-[#111827] px-4 py-2 text-sm font-semibold text-white">추가</button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`${base}/members`} className="inline-flex h-9 items-center rounded-[11px] border border-[#e7e0d4] bg-white px-3 text-[12px] font-medium text-[#171717]">
              전체 members
            </Link>
          </div>
        </article>

        <GidoHomeFeedPanel feedItems={feedItems} notificationItems={notificationItems} />

        <article className="overflow-hidden rounded-[26px] border border-[#ebe4d8] bg-[linear-gradient(180deg,#2d6d46_0%,#111827_100%)] p-5 text-white shadow-[0_8px_24px_rgba(15,23,42,0.05)] lg:p-6">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-[10px] tracking-[0.16em] text-white/68">TODAY PRAYER</p>
              <h2 className="mt-3 text-[1.75rem] font-semibold leading-[1.06] tracking-[-0.05em]">
                {todayPrayer ? todayPrayer.title : workspaceLabel}
              </h2>
              <p className="mt-2 text-[12px] text-white/74">{todayPrayer ? `${todayPrayer.members.length}명 가정` : "오늘 중보 가정 없음"}</p>
              <p className="mt-4 text-[13px] leading-6 text-white/84">{prayerLead}</p>
              {todayPrayerMembers ? <p className="mt-3 text-[12px] text-white/68">구성원 {todayPrayerMembers}</p> : null}
            </div>

            <div className="mt-6 grid gap-2 text-[11px] text-white/82">
              <span className="rounded-full border border-white/14 bg-white/10 px-2.5 py-1">전체 {data.stats.memberCount}명 순환</span>
              <span className="rounded-full border border-white/14 bg-white/10 px-2.5 py-1">현 목자 {GIDO_ACTIVE_LEADER_NAMES.length}명 포함</span>
              {nextPrayer ? <span className="rounded-full border border-white/14 bg-white/10 px-2.5 py-1">다음 순서 {nextPrayer.title}</span> : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={todayPrayerHref} className="inline-flex h-10 items-center rounded-[12px] bg-white px-4 text-[13px] font-medium text-[#111827]">
                오늘 중보 가정
              </Link>
              <Link href={`${base}/households`} className="inline-flex h-10 items-center rounded-[12px] border border-white/18 bg-white/10 px-4 text-[13px] font-medium text-white">
                중보 보기
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <ActionCard title="후속 관리" desc="후속 대상과 카드 확인" href={`${base}/followups`} meta={`${urgentMemberCount}명`} />
        <ActionCard title="가정별 중보" desc="가정별 기도제목과 연락 메모" href={`${base}/households`} meta={`${data.stats.householdCount}가정`} />
        <ActionCard title="최근 근황" desc="공유할 근황과 메모" href={`${base}/updates`} meta={`${data.updates.length}건`} />
        <ActionCard title="운영 우선 목원" desc="후속, 현 목자, 순환 진행 가정 목록" href={`${base}/members?filter=priority`} meta={`${urgentMemberCount}명 후속`} />
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
