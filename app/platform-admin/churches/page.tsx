import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type OnboardingMeta = {
  ownerName?: string;
  role?: string;
  ministry?: string;
  teamName?: string;
  attendanceBand?: string;
  primaryGoal?: string;
  setupNote?: string;
  createdFrom?: string;
};

function parseOnboardingMeta(metadata: string | null): OnboardingMeta | null {
  if (!metadata) {
    return null;
  }

  try {
    return JSON.parse(metadata) as OnboardingMeta;
  } catch {
    return null;
  }
}

function roleLabel(role?: string) {
  if (!role) return "-";

  return (
    {
      OWNER: "소유자",
      ADMIN: "관리자",
      PASTOR: "교역자",
      LEADER: "리더",
      VIEWER: "열람",
    }[role] ?? role
  );
}

function statusTone(isActive: boolean) {
  return isActive
    ? "border-[#d8ead8] bg-[#f3fbf2] text-[#2f6b39]"
    : "border-[#eadfd3] bg-[#fcf7f1] text-[#8b6f47]";
}

function planStatusLabel(status?: string) {
  return (
    {
      TRIALING: "체험중",
      ACTIVE: "유료 운영중",
      CANCELED: "해지됨",
      PAST_DUE: "결제 확인 필요",
      INCOMPLETE: "설정 미완료",
    }[status ?? ""] ?? (status || "상태 없음")
  );
}

export default async function PlatformAdminChurchesPage() {
  const churches = await prisma.church.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { memberships: true, members: true } },
      subscriptions: { select: { plan: true, status: true }, take: 1, orderBy: { createdAt: "desc" } },
      activityLogs: {
        where: { action: "WORKSPACE_ONBOARDED" },
        select: { metadata: true, createdAt: true },
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
    take: 50,
  });

  const rows = churches.map((church) => {
    const onboarding = parseOnboardingMeta(church.activityLogs[0]?.metadata ?? null);
    const ownerName = onboarding?.ownerName ?? "-";
    const role = roleLabel(onboarding?.role);
    const team = onboarding?.teamName ?? onboarding?.ministry ?? "팀 정보 없음";
    const attendance = onboarding?.attendanceBand ?? "출석 규모 없음";
    const goal = onboarding?.primaryGoal ?? "우선 목표 없음";
    const setupNote = onboarding?.setupNote?.trim() || "운영 메모 없음";
    const createdFrom = onboarding?.createdFrom === "app-onboarding" ? "앱 온보딩" : onboarding?.createdFrom ?? "legacy";
    const createdAt = church.activityLogs[0]?.createdAt ?? church.createdAt;
    const plan = church.subscriptions[0]?.plan ?? "FREE";
    const planStatus = church.subscriptions[0]?.status ?? "-";

    const needsAttention = !church.isActive || planStatus === "TRIALING" || church._count.members === 0 || createdFrom === "legacy";

    return {
      id: church.id,
      name: church.name,
      slug: church.slug,
      ownerName,
      role,
      team,
      attendance,
      goal,
      setupNote,
      createdFrom,
      createdAt,
      createdAtLabel: new Date(createdAt).toLocaleString("ko-KR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      memberships: church._count.memberships,
      members: church._count.members,
      plan,
      planStatus,
      planStatusLabel: planStatusLabel(planStatus),
      isActive: church.isActive,
      needsAttention,
      membersHref: `/app/${church.slug}/members`,
    };
  });

  const onboardingCount = rows.filter((row) => row.createdFrom !== "legacy").length;
  const trialCount = rows.filter((row) => row.planStatus === "TRIALING").length;
  const activeCount = rows.filter((row) => row.isActive).length;
  const inactiveCount = rows.length - activeCount;
  const legacyCount = rows.filter((row) => row.createdFrom === "legacy").length;
  const emptyCount = rows.filter((row) => row.members === 0).length;
  const attentionCount = rows.filter((row) => row.needsAttention).length;

  const latestOnboarded = rows.find((row) => row.createdFrom !== "legacy") ?? rows[0] ?? null;
  const trialWorkspace = rows.find((row) => row.planStatus === "TRIALING") ?? null;
  const emptyWorkspace = rows.find((row) => row.members === 0) ?? null;
  const attentionWorkspace = rows.find((row) => row.needsAttention) ?? null;

  const focusCards = [
    latestOnboarded
      ? {
          label: "방금 온보딩",
          title: latestOnboarded.name,
          note: `${latestOnboarded.ownerName} · ${latestOnboarded.team} · ${latestOnboarded.createdAtLabel}`,
          href: `/platform-admin/churches/${latestOnboarded.id}`,
          cta: "상세 보기",
        }
      : {
          label: "방금 온보딩",
          title: "연결된 워크스페이스 없음",
          note: "최근 온보딩 데이터가 아직 없습니다.",
          href: undefined,
          cta: "대기",
        },
    trialWorkspace
      ? {
          label: "체험중 확인",
          title: `${trialWorkspace.name} · ${trialWorkspace.plan}`,
          note: `${trialWorkspace.goal} · 사람 ${trialWorkspace.members}명`,
          href: `/platform-admin/churches/${trialWorkspace.id}`,
          cta: "상세 보기",
        }
      : {
          label: "체험중 확인",
          title: "체험중 워크스페이스 없음",
          note: "지금은 trial 상태 워크스페이스가 없습니다.",
          href: undefined,
          cta: "대기",
        },
    emptyWorkspace
      ? {
          label: "데이터 비어 있음",
          title: emptyWorkspace.name,
          note: `${emptyWorkspace.team} · 교인 데이터 0명 · ${emptyWorkspace.setupNote}`,
          href: emptyWorkspace.membersHref,
          cta: "사람 보기",
        }
      : {
          label: "데이터 비어 있음",
          title: "교인 데이터 0명 없음",
          note: "최근 50개 워크스페이스는 모두 교인 데이터가 있습니다.",
          href: undefined,
          cta: "완료",
        },
    attentionWorkspace
      ? {
          label: "지금 열어볼 곳",
          title: attentionWorkspace.name,
          note: `${attentionWorkspace.planStatusLabel} · ${attentionWorkspace.members === 0 ? "교인 데이터 없음" : `교인 ${attentionWorkspace.members}명`} · ${attentionWorkspace.isActive ? "운영중" : "비활성"}`,
          href: `/platform-admin/churches/${attentionWorkspace.id}`,
          cta: "상세 보기",
        }
      : {
          label: "지금 열어볼 곳",
          title: "긴급 확인 대상 없음",
          note: "체험, 비활성, 빈 데이터 워크스페이스가 없습니다.",
          href: undefined,
          cta: "안정",
        },
  ];

  const attentionRail = [
    {
      label: "즉시 확인",
      value: attentionCount,
      note: "체험·비활성·빈 데이터·legacy",
    },
    {
      label: "빈 데이터",
      value: emptyCount,
      note: "교인 0명 워크스페이스",
    },
    {
      label: "legacy",
      value: legacyCount,
      note: "온보딩 메타 없음",
    },
    {
      label: "trial",
      value: trialCount,
      note: "유료 전환 체크 대상",
    },
  ];

  return (
    <section className="space-y-4 text-[#111111]">
      <div className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">PLATFORM / CHURCHES</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#111111]">교회 워크스페이스 조회</h2>
            <p className="mt-2 text-sm text-[#5f564b]">온보딩 입력값, 현재 플랜, 운영 상태를 한 줄 흐름으로 빠르게 보는 관리자 화면.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-[#8C7A5B]">
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1.5">최근 50개</span>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1.5">활성 {activeCount}</span>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1.5">온보딩 메타 {onboardingCount}</span>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1.5">체험중 {trialCount}</span>
          </div>
        </div>
      </div>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-3 border-b border-[#efe7da] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">WORKSPACE LIST</p>
            <h3 className="mt-2 text-lg font-semibold text-[#111111]">온보딩 기준으로 보는 교회 목록</h3>
          </div>
          <p className="text-xs text-[#8C7A5B]">설명보다 상태·버튼·메모 우선</p>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] px-4 py-3">
            <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">ACTIVE</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#111111]">{activeCount}</p>
            <p className="mt-1 text-xs text-[#8c7a5b]">현재 운영중인 워크스페이스</p>
          </div>
          <div className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] px-4 py-3">
            <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">INACTIVE</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#111111]">{inactiveCount}</p>
            <p className="mt-1 text-xs text-[#8c7a5b]">비활성 전환된 워크스페이스</p>
          </div>
          <div className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] px-4 py-3">
            <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">TRIAL</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#111111]">{trialCount}</p>
            <p className="mt-1 text-xs text-[#8c7a5b]">체험중 플랜 상태</p>
          </div>
          <div className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] px-4 py-3">
            <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">ONBOARDED</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#111111]">{onboardingCount}</p>
            <p className="mt-1 text-xs text-[#8c7a5b]">앱 온보딩 메타 연결됨</p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 xl:grid-cols-4">
          {focusCards.map((card) => (
            <div key={card.label} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] px-4 py-3">
              <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{card.label}</p>
              <p className="mt-2 text-sm font-semibold text-[#111111]">{card.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-[#8c7a5b]">{card.note}</p>
              <div className="mt-3">
                {card.href ? (
                  <Link
                    href={card.href}
                    className="inline-flex rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#6a5e51] transition hover:border-[#d8c8af] hover:text-[#8C6A2E]"
                  >
                    {card.cta}
                  </Link>
                ) : (
                  <span className="inline-flex rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#9a8b7a]">
                    {card.cta}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {attentionRail.map((item) => (
            <div key={item.label} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#111111]">{item.value}</p>
                </div>
                <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">focus</span>
              </div>
              <p className="mt-1 text-xs text-[#8c7a5b]">{item.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-2">
          <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1.15fr)_120px_210px] gap-3 px-3 text-[11px] tracking-[0.16em] text-[#9a8b7a] lg:grid">
            <span>교회 / 담당자</span>
            <span>온보딩 입력값</span>
            <span>플랜</span>
            <span className="text-right">운영 상태 / 이동</span>
          </div>

          {rows.map((row) => (
            <div
              key={row.id}
              className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] px-3 py-3 transition hover:border-[#dfd3bf] hover:bg-white"
            >
              <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.15fr)_120px_210px] lg:items-center lg:gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[#111111]">{row.name}</p>
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{row.slug}</span>
                    {row.planStatus === "TRIALING" ? (
                      <span className="rounded-full border border-[#eadfc9] bg-[#fff8ec] px-2.5 py-1 text-[11px] text-[#9b7331]">trial</span>
                    ) : null}
                    {row.members === 0 ? (
                      <span className="rounded-full border border-[#eadfd3] bg-[#fcf7f1] px-2.5 py-1 text-[11px] text-[#8b6f47]">빈 데이터</span>
                    ) : null}
                    {row.createdFrom === "legacy" ? (
                      <span className="rounded-full border border-[#e2def4] bg-[#f7f5ff] px-2.5 py-1 text-[11px] text-[#6657a8]">legacy</span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-[#7a6d5c]">
                    {row.ownerName} · {row.role} · {row.createdAtLabel}
                  </p>
                  <p className="mt-2 line-clamp-1 text-xs text-[#8c7a5b]">{row.setupNote}</p>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2 text-[11px] text-[#6f6251]">
                    <span className="rounded-full border border-[#e8e0d4] bg-white px-2.5 py-1">{row.team}</span>
                    <span className="rounded-full border border-[#e8e0d4] bg-white px-2.5 py-1">{row.attendance}</span>
                    <span className="rounded-full border border-[#e8e0d4] bg-white px-2.5 py-1">{row.createdFrom}</span>
                  </div>
                  <p className="mt-2 line-clamp-1 text-sm text-[#3f382f]">{row.goal}</p>
                  <p className="mt-1 text-xs text-[#8c7a5b]">멤버십 {row.memberships} · 교인 데이터 {row.members}</p>
                </div>

                <div>
                  <div className="inline-flex rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#6a5e51]">
                    {row.plan}
                  </div>
                  <p className="mt-2 text-xs text-[#8c7a5b]">{row.planStatusLabel}</p>
                </div>

                <div className="flex flex-col items-start gap-2 lg:items-end">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] ${statusTone(row.isActive)}`}>
                    {row.isActive ? "운영중" : "비활성"}
                  </span>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <Link
                      href={`/platform-admin/churches/${row.id}`}
                      className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#6a5e51] transition hover:border-[#d8c8af] hover:text-[#8C6A2E]"
                    >
                      상세
                    </Link>
                    <Link
                      href={row.membersHref}
                      className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#6a5e51] transition hover:border-[#d8c8af] hover:text-[#8C6A2E]"
                    >
                      사람
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
