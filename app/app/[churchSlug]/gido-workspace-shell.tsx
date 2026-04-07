"use client";

import Link from "next/link";

type GidoWorkspaceShellProps = {
  base: string;
  church: { name: string; slug: string };
  role: string;
  summary: {
    totalMembers: number;
    followUpMembers: number;
    pendingApplications: number;
    unassignedMembers: number;
    newThisMonth: number;
  };
  children: React.ReactNode;
};

const navItems = (base: string) => [
  { label: "워크스페이스 홈", href: `${base}/dashboard` },
  { label: "목원 등록", href: `${base}/dashboard#member-register` },
  { label: "목원 관리", href: `${base}/dashboard#member-manage` },
  { label: "후속 관리", href: `${base}/dashboard#followups` },
  { label: "근황 메모", href: `${base}/dashboard#updates` },
  { label: "가정별 중보", href: `${base}/dashboard#households` },
];

export default function GidoWorkspaceShell({ base, church, role, summary, children }: GidoWorkspaceShellProps) {
  const items = navItems(base);

  return (
    <main className="min-h-screen bg-[#f5f1ea] text-[#171717]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 py-4 sm:px-6 lg:flex-row lg:gap-4 lg:px-8 lg:py-6">
        <aside className="mb-4 rounded-[28px] border border-[#e7dece] bg-white/95 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] lg:mb-0 lg:w-[280px] lg:shrink-0">
          <div>
            <p className="text-[11px] tracking-[0.22em] text-[#9a8b7a]">MOKJANG WORKSPACE</p>
            <h1 className="mt-2 text-[1.55rem] font-semibold tracking-[-0.06em] text-[#111111]">{church.name}</h1>
            <p className="mt-2 text-sm leading-6 text-[#6f6256]">목원 등록, 가정별 중보, 후속 연락, 근황 메모를 단순하게 관리하는 전용 화면</p>
          </div>

          <div className="mt-5 grid gap-2">
            <div className="rounded-[18px] border border-[#ece3d5] bg-[#fcfaf6] p-3.5">
              <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">권한</p>
              <p className="mt-2 text-sm font-semibold text-[#111111]">{role}</p>
            </div>
            <div className="rounded-[18px] border border-[#ece3d5] bg-[#fcfaf6] p-3.5">
              <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">목원</p>
              <p className="mt-2 text-sm font-semibold text-[#111111]">{summary.totalMembers}명</p>
            </div>
            <div className="rounded-[18px] border border-[#ece3d5] bg-[#fcfaf6] p-3.5">
              <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">후속</p>
              <p className="mt-2 text-sm font-semibold text-[#111111]">{summary.followUpMembers}건</p>
            </div>
          </div>

          <nav className="mt-5 grid gap-2">
            {items.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-[16px] border px-4 py-3 text-sm ${index === 0 ? "border-[#111827] bg-[#111827] font-semibold text-white" : "border-[#eadfcd] bg-white text-[#3d342c]"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-5 grid gap-2">
            <Link href="/app" className="rounded-[14px] border border-[#ece3d5] bg-[#fcfaf6] px-4 py-3 text-sm text-[#6f6256]">
              워크스페이스 목록
            </Link>
            <form action="/api/logout" method="post">
              <button type="submit" className="w-full rounded-[14px] border border-[#ece3d5] bg-[#fcfaf6] px-4 py-3 text-left text-sm text-[#6f6256]">
                로그아웃
              </button>
            </form>
          </div>
        </aside>

        <section className="min-w-0 flex-1 rounded-[32px] border border-[#e6ddcf] bg-[#fffdf9] shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="border-b border-[#efe6d9] px-5 py-5 sm:px-7 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">G.I.D.O</p>
                <h2 className="mt-2 text-[1.9rem] font-semibold tracking-[-0.06em] text-[#111111]">오늘 처리할 것만 남긴 목장 워크스페이스</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f6256]">복잡한 교회 운영 화면 대신, 목원 등록과 가정별 중보, 후속 관리, 근황 메모를 빠르게 다루는 G.I.D.O 전용 구조로 정리했습니다.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-2 text-xs text-[#6f6256]">새 멤버 {summary.newThisMonth}</span>
                <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-2 text-xs text-[#6f6256]">미배정 {summary.unassignedMembers}</span>
                <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-2 text-xs text-[#6f6256]">신청 {summary.pendingApplications}</span>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7 lg:p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
