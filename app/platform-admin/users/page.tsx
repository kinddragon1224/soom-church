import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type OnboardingMeta = {
  role?: string;
  ministry?: string;
  teamName?: string;
  attendanceBand?: string;
  primaryGoal?: string;
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

export default async function PlatformAdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      memberships: {
        include: {
          church: {
            select: {
              name: true,
              slug: true,
              isActive: true,
              activityLogs: {
                where: { action: "WORKSPACE_ONBOARDED" },
                select: { metadata: true },
                take: 1,
                orderBy: { createdAt: "desc" },
              },
            },
          },
        },
        orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
      },
    },
    take: 50,
  });

  const rows = users.map((user) => {
    const primaryMembership = user.memberships[0];
    const activeMemberships = user.memberships.filter((membership) => membership.isActive);

    const memberships = user.memberships.map((membership) => {
      const onboarding = parseOnboardingMeta(membership.church?.activityLogs[0]?.metadata ?? null);
      const team = onboarding?.teamName ?? onboarding?.ministry ?? null;
      const goal = onboarding?.primaryGoal ?? null;
      const attendance = onboarding?.attendanceBand ?? null;
      const source = onboarding?.createdFrom === "app-onboarding" ? "앱 온보딩" : onboarding?.createdFrom ?? null;

      return {
        id: membership.id,
        churchName: membership.church?.name ?? "삭제된 교회",
        slug: membership.church?.slug ?? "-",
        role: roleLabel(membership.role),
        isActive: membership.isActive,
        churchActive: membership.church?.isActive ?? false,
        team,
        goal,
        attendance,
        source,
      };
    });

    const onboardingMembershipCount = memberships.filter((membership) => membership.source).length;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAtLabel: new Date(user.createdAt).toLocaleString("ko-KR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      isActive: user.isActive,
      memberships,
      primaryRole: primaryMembership ? roleLabel(primaryMembership.role) : "미배정",
      primaryChurch: primaryMembership?.church?.name ?? "소속 없음",
      activeMembershipCount: activeMemberships.length,
      workspaceCount: user.memberships.length,
      onboardingMembershipCount,
    };
  });

  const activeUserCount = rows.filter((row) => row.isActive).length;
  const linkedUserCount = rows.filter((row) => row.workspaceCount > 0).length;
  const multiWorkspaceCount = rows.filter((row) => row.workspaceCount > 1).length;
  const onboardingLinkedCount = rows.filter((row) => row.onboardingMembershipCount > 0).length;

  return (
    <section className="space-y-4 text-[#111111]">
      <div className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">PLATFORM / USERS</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#111111]">가입 사용자 조회</h2>
            <p className="mt-2 text-sm text-[#5f564b]">최근 가입 사용자와 소속 워크스페이스, 온보딩 메타까지 한 줄 흐름으로 바로 확인하는 운영 화면.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-[#8C7A5B]">
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1.5">최근 50명</span>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1.5">활성 계정 {activeUserCount}</span>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1.5">워크스페이스 연결 {linkedUserCount}</span>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1.5">온보딩 메타 연결 {onboardingLinkedCount}</span>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1.5">다중 소속 {multiWorkspaceCount}</span>
          </div>
        </div>
      </div>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-3 border-b border-[#efe7da] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">USER LIST</p>
            <h3 className="mt-2 text-lg font-semibold text-[#111111]">계정 · 소속 · 온보딩 메타 한눈에 보기</h3>
          </div>
          <p className="text-xs text-[#8C7A5B]">설명보다 상태·소속·메타 우선</p>
        </div>

        <div className="mt-4 grid gap-2">
          <div className="hidden grid-cols-[minmax(0,1.05fr)_minmax(0,1.5fr)_120px_130px] gap-3 px-3 text-[11px] tracking-[0.16em] text-[#9a8b7a] lg:grid">
            <span>사용자</span>
            <span>소속 워크스페이스 / 온보딩 메타</span>
            <span>주 역할</span>
            <span className="text-right">계정 상태</span>
          </div>

          {rows.map((row) => (
            <div
              key={row.id}
              className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] px-3 py-3 transition hover:border-[#dfd3bf] hover:bg-white"
            >
              <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.5fr)_120px_130px] lg:items-center lg:gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[#111111]">{row.name}</p>
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">
                      {row.workspaceCount === 0 ? "미연결" : `${row.workspaceCount}개 워크스페이스`}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-[#7a6d5c]">{row.email}</p>
                  <p className="mt-2 text-xs text-[#8c7a5b]">가입 {row.createdAtLabel} · 현재 기준 {row.primaryChurch}</p>
                </div>

                <div className="min-w-0">
                  {row.memberships.length > 0 ? (
                    <div className="grid gap-2">
                      {row.memberships.map((membership) => (
                        <div
                          key={membership.id}
                          className="rounded-2xl border border-[#ebe3d6] bg-white px-3 py-2.5"
                        >
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#6f6251]">
                            <span className="rounded-full border border-[#e8e0d4] bg-[#fcfbf8] px-2.5 py-1">
                              {membership.churchName} · {membership.role}
                            </span>
                            {membership.team ? (
                              <span className="rounded-full border border-[#e8e0d4] bg-[#fcfbf8] px-2.5 py-1">{membership.team}</span>
                            ) : null}
                            {membership.attendance ? (
                              <span className="rounded-full border border-[#e8e0d4] bg-[#fcfbf8] px-2.5 py-1">{membership.attendance}</span>
                            ) : null}
                            {membership.source ? (
                              <span className="rounded-full border border-[#e8e0d4] bg-[#fcfbf8] px-2.5 py-1">{membership.source}</span>
                            ) : null}
                            {!membership.isActive ? <span>멤버십중지</span> : membership.churchActive ? null : <span>교회비활성</span>}
                          </div>
                          <p className="mt-2 line-clamp-1 text-xs text-[#8c7a5b]">
                            {membership.goal ?? "온보딩 목표 없음"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#8c7a5b]">아직 소속된 워크스페이스 없음</p>
                  )}
                  <p className="mt-2 text-xs text-[#8c7a5b]">활성 멤버십 {row.activeMembershipCount}개 · 온보딩 메타 연결 {row.onboardingMembershipCount}개</p>
                </div>

                <div>
                  <div className="inline-flex rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#6a5e51]">
                    {row.primaryRole}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 lg:justify-end">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] ${statusTone(row.isActive)}`}>
                    {row.isActive ? "사용중" : "비활성"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
