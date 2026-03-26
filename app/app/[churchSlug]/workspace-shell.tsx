"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navSections = [
  {
    title: "workspace",
    items: [
      { key: "dashboard", label: "홈", href: "dashboard", hint: "운영 요약" },
      { key: "members", label: "사람", href: "members", hint: "교인과 상태" },
      { key: "applications", label: "신청", href: "applications", hint: "접수와 처리" },
      { key: "organizations", label: "조직", href: "organizations", hint: "교구와 부서" },
      { key: "notices", label: "공지", href: "notices", hint: "전달 흐름" },
      { key: "records", label: "기록", href: "records", hint: "심방과 사역 메모" },
    ],
  },
  {
    title: "system",
    items: [{ key: "settings", label: "설정", href: "settings", hint: "워크스페이스 기본값" }],
  },
] as const;

type NavItem = {
  key: string;
  label: string;
  href: string;
  hint: string;
};

type WorkspaceShellProps = {
  church: { name: string; slug: string };
  role: string;
  summary: {
    totalMembers: number;
    newThisMonth: number;
    followUpMembers: number;
    pendingApplications: number;
    unassignedMembers: number;
  };
  children: React.ReactNode;
};

export function WorkspaceShell({ church, role, summary, children }: WorkspaceShellProps) {
  const pathname = usePathname();
  const base = `/app/${church.slug}`;

  const flatItems: NavItem[] = navSections.flatMap((section) => section.items.map((item) => ({ ...item })));
  const currentItem =
    flatItems.find((item) => pathname === `${base}/${item.href}` || pathname.startsWith(`${base}/${item.href}/`)) ?? flatItems[0];

  const topUtilityItems = [
    { label: "플랜", value: "무료", tone: "neutral" },
    { label: "역할", value: role.toLowerCase(), tone: "neutral" },
    {
      label: "오늘 후속",
      value: summary.followUpMembers > 0 ? `${summary.followUpMembers}건` : "비어 있음",
      tone: summary.followUpMembers > 0 ? "alert" : "neutral",
    },
    {
      label: "미처리 신청",
      value: summary.pendingApplications > 0 ? `${summary.pendingApplications}건` : "안정",
      tone: summary.pendingApplications > 0 ? "alert" : "neutral",
    },
    {
      label: "미배정",
      value: summary.unassignedMembers > 0 ? `${summary.unassignedMembers}명` : "완료",
      tone: summary.unassignedMembers > 0 ? "alert" : "neutral",
    },
  ] as const;

  const quickActionsBySection: Record<string, { label: string; href: string; primary?: boolean }[]> = {
    dashboard: [
      { label: "사람 열기", href: `${base}/members`, primary: true },
      { label: "신청 보기", href: `${base}/applications` },
      { label: "공지 보기", href: `${base}/notices` },
    ],
    members: [
      { label: "후속 연락", href: `${base}/members?filter=followup`, primary: true },
      { label: "전체 사람", href: `${base}/members?filter=all` },
      { label: "이번 달 등록", href: `${base}/members?filter=new` },
    ],
    applications: [
      { label: "미처리 신청", href: `${base}/applications?status=PENDING`, primary: true },
      { label: "사람 보기", href: `${base}/members` },
      { label: "홈", href: `${base}/dashboard` },
    ],
    organizations: [
      { label: "미배정 사람", href: `${base}/members?filter=followup`, primary: true },
      { label: "사람 보기", href: `${base}/members` },
      { label: "홈", href: `${base}/dashboard` },
    ],
    notices: [
      { label: "최근 공지", href: `${base}/notices`, primary: true },
      { label: "사람 보기", href: `${base}/members` },
      { label: "홈", href: `${base}/dashboard` },
    ],
    records: [
      { label: "기록 보기", href: `${base}/records`, primary: true },
      { label: "사람 보기", href: `${base}/members` },
      { label: "홈", href: `${base}/dashboard` },
    ],
    settings: [
      { label: "기본값 점검", href: `${base}/settings`, primary: true },
      { label: "사람 보기", href: `${base}/members` },
      { label: "홈", href: `${base}/dashboard` },
    ],
  };

  const sectionStatusByKey: Record<string, { label: string; value: string; tone?: "neutral" | "alert" }[]> = {
    dashboard: [
      { label: "전체 사람", value: `${summary.totalMembers}명` },
      { label: "오늘 후속", value: summary.followUpMembers > 0 ? `${summary.followUpMembers}건` : "없음", tone: summary.followUpMembers > 0 ? "alert" : "neutral" },
      { label: "미처리 신청", value: summary.pendingApplications > 0 ? `${summary.pendingApplications}건` : "없음", tone: summary.pendingApplications > 0 ? "alert" : "neutral" },
    ],
    members: [
      { label: "전체 사람", value: `${summary.totalMembers}명` },
      { label: "이번 달 등록", value: summary.newThisMonth > 0 ? `${summary.newThisMonth}명` : "없음" },
      { label: "후속 필요", value: summary.followUpMembers > 0 ? `${summary.followUpMembers}명` : "없음", tone: summary.followUpMembers > 0 ? "alert" : "neutral" },
    ],
    applications: [
      { label: "미처리", value: summary.pendingApplications > 0 ? `${summary.pendingApplications}건` : "없음", tone: summary.pendingApplications > 0 ? "alert" : "neutral" },
      { label: "이번 달 등록", value: summary.newThisMonth > 0 ? `${summary.newThisMonth}명` : "없음" },
      { label: "후속 연계", value: summary.followUpMembers > 0 ? `${summary.followUpMembers}명` : "없음" },
    ],
    organizations: [
      { label: "미배정", value: summary.unassignedMembers > 0 ? `${summary.unassignedMembers}명` : "없음", tone: summary.unassignedMembers > 0 ? "alert" : "neutral" },
      { label: "전체 사람", value: `${summary.totalMembers}명` },
      { label: "후속 필요", value: summary.followUpMembers > 0 ? `${summary.followUpMembers}명` : "없음" },
    ],
    notices: [
      { label: "전달 대기", value: summary.pendingApplications > 0 ? `${summary.pendingApplications}건 참고` : "안정" },
      { label: "후속 필요", value: summary.followUpMembers > 0 ? `${summary.followUpMembers}명` : "없음" },
      { label: "전체 사람", value: `${summary.totalMembers}명` },
    ],
    records: [
      { label: "기록 공간", value: "심방 / 사역 / 운영 메모" },
      { label: "기록 기준", value: "사람별 / 팀별 / 최근순" },
      { label: "연결", value: "사람 흐름과 후속 연결" },
    ],
    settings: [
      { label: "후속 기본값", value: summary.followUpMembers > 0 ? `${summary.followUpMembers}명 영향` : "안정" },
      { label: "신청 기본값", value: summary.pendingApplications > 0 ? `${summary.pendingApplications}건 영향` : "안정" },
      { label: "조직 기본값", value: summary.unassignedMembers > 0 ? `${summary.unassignedMembers}명 영향` : "안정" },
    ],
  };

  const navBadgeByKey: Partial<Record<string, string>> = {
    dashboard: summary.followUpMembers > 0 ? `${summary.followUpMembers}` : "",
    members: summary.newThisMonth > 0 ? `+${summary.newThisMonth}` : `${summary.totalMembers}`,
    applications: summary.pendingApplications > 0 ? `${summary.pendingApplications}` : "",
    organizations: summary.unassignedMembers > 0 ? `${summary.unassignedMembers}` : "",
  };

  const quickActions = quickActionsBySection[currentItem.key] ?? quickActionsBySection.dashboard;
  const sectionStatus = sectionStatusByKey[currentItem.key] ?? sectionStatusByKey.dashboard;

  return (
    <main className="min-h-screen bg-[#EDE6D8] text-[#121212] lg:h-dvh lg:min-h-0 lg:overflow-hidden">
      <div className="grid min-h-screen lg:h-full lg:min-h-0 lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-3 lg:p-3">
        <aside className="border-b border-[#1b2740] bg-[#0F172A] px-4 py-5 text-white lg:h-full lg:min-h-0 lg:overflow-y-auto lg:rounded-[28px] lg:border lg:border-[#16233b] lg:shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
          <div className="lg:flex lg:min-h-full lg:flex-col lg:py-1">
            <div className="flex items-start justify-between gap-3 px-1">
              <div>
                <Link href={`${base}/dashboard`} className="font-display text-[1.55rem] font-semibold tracking-[-0.08em] text-white">
                  SOOM workspace
                </Link>
                <p className="mt-2 text-xs text-white/52">교회 운영 흐름을 한곳에서 정리</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] tracking-[0.16em] text-white/50">LIVE</span>
            </div>

            <div className="mt-5 rounded-[20px] border border-white/8 bg-white/[0.04] p-3.5">
              <p className="text-[10px] tracking-[0.2em] text-white/34">WORKSPACE</p>
              <p className="mt-2 text-sm font-semibold text-white">{church.name}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-white/58">
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">무료</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">{summary.totalMembers}명</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">후속 {summary.followUpMembers}건</span>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {navSections.map((section) => (
                <div key={section.title}>
                  <p className="px-2 text-[10px] uppercase tracking-[0.22em] text-white/28">{section.title}</p>
                  <div className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
                    {section.items.map((item) => {
                      const href = `${base}/${item.href}`;
                      const active = pathname === href || pathname.startsWith(`${href}/`);
                      const badge = navBadgeByKey[item.key];

                      return (
                        <Link
                          key={item.key}
                          href={href}
                          className={`rounded-[16px] border px-3 py-3 text-sm transition ${
                            active
                              ? "border-[#C8A96B]/40 bg-[#C8A96B] text-[#16120b] shadow-[0_12px_28px_rgba(200,169,107,0.24)]"
                              : "border-white/0 text-white/72 hover:border-white/8 hover:bg-white/6 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className={`font-medium ${active ? "font-semibold" : ""}`}>{item.label}</p>
                              <p className={`mt-1 text-[10px] ${active ? "text-[#47391d]" : "text-white/36"}`}>{item.hint}</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {badge ? (
                                <span
                                  className={`rounded-full px-2 py-1 text-[9px] font-semibold ${
                                    active ? "bg-black/10 text-[#3d3118]" : "bg-white/8 text-white/62"
                                  }`}
                                >
                                  {badge}
                                </span>
                              ) : null}
                              <span
                                className={`rounded-full px-2 py-1 text-[9px] uppercase tracking-[0.16em] ${
                                  active ? "bg-black/10 text-[#3d3118]" : "bg-white/6 text-white/24"
                                }`}
                              >
                                {active ? "on" : ""}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[20px] border border-white/8 bg-white/[0.04] p-3.5">
              <p className="text-[10px] tracking-[0.2em] text-white/34">SHORTCUTS</p>
              <div className="mt-3 grid gap-2">
                <Link href="/" className="rounded-[14px] border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-white/74 transition hover:bg-white/8 hover:text-white">홈</Link>
                <Link href="/app" className="rounded-[14px] border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-white/74 transition hover:bg-white/8 hover:text-white">워크스페이스</Link>
                <form action="/api/logout" method="post">
                  <button type="submit" className="w-full rounded-[14px] border border-white/8 bg-white/[0.03] px-3 py-2 text-left text-sm text-white/74 transition hover:bg-white/8 hover:text-white">로그아웃</button>
                </form>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 bg-[#F4F0E8] lg:h-full lg:min-h-0 lg:overflow-y-auto lg:rounded-[30px] lg:border lg:border-[#DDD1BE] lg:bg-[#F4F0E8] lg:shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="border-b border-[#E3D9C9] bg-[#FBF9F4] px-5 py-4 sm:px-7 lg:sticky lg:top-0 lg:z-20 lg:rounded-t-[30px]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#8C7A5B]">
                    <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1">SOOM WORKSPACE</span>
                    <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1">{church.name}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-end gap-3">
                    <h1 className="text-[1.65rem] font-semibold tracking-[-0.05em] text-[#121212]">{currentItem.label}</h1>
                    <p className="pb-1 text-xs text-[#7B6F60]">{currentItem.hint}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  {quickActions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className={`inline-flex min-h-10 items-center justify-center rounded-[12px] px-4 text-sm ${
                        action.primary
                          ? "bg-[#0F172A] font-semibold text-white"
                          : "border border-[#E7E0D4] bg-white font-medium text-[#121212]"
                      }`}
                    >
                      {action.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
                {topUtilityItems.map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-[16px] border px-3.5 py-3 ${
                      item.tone === "alert"
                        ? "border-[#E9D8B0] bg-[#FFF7E8]"
                        : "border-[#E7E0D4] bg-white"
                    }`}
                  >
                    <p className="text-[11px] tracking-[0.16em] text-[#9A8B7A]">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-[#121212]">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-2 md:grid-cols-3">
                {sectionStatus.map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-[16px] border px-3.5 py-3 ${
                      item.tone === "alert"
                        ? "border-[#E9D8B0] bg-[#FFF7E8]"
                        : "border-[#E7E0D4] bg-[#F6F1E8]"
                    }`}
                  >
                    <p className="text-[11px] tracking-[0.16em] text-[#9A8B7A]">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-[#121212]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="min-w-0 p-5 sm:p-7">{children}</div>
        </section>
      </div>
    </main>
  );
}
