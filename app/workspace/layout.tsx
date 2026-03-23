"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navSections = [
  {
    title: "workspace",
    items: [
      { href: "/workspace", label: "홈" },
      { href: "/workspace/people", label: "사람" },
      { href: "/workspace/notices", label: "커뮤니케이션" },
      { href: "/workspace/tasks", label: "작업 흐름" },
      { href: "/workspace/content", label: "콘텐츠 스튜디오" },
    ],
  },
  {
    title: "system",
    items: [{ href: "/workspace/settings", label: "설정" }],
  },
];

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#F4F0E8] text-[#121212]">
      <div className="grid min-h-screen lg:grid-cols-[268px_1fr]">
        <aside className="border-b border-[#1b2740] bg-[#0F172A] px-4 py-5 text-white lg:min-h-full lg:border-b-0 lg:border-r">
          <div className="flex items-start justify-between gap-3 px-1">
            <div>
              <Link href="/workspace" className="font-display text-[1.6rem] font-semibold tracking-[-0.08em] text-white">
                SOOM workspace
              </Link>
              <p className="mt-2 text-xs text-white/52">교회 운영과 실행을 한곳에서 정리하는 허브</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] tracking-[0.16em] text-white/50">DEMO</span>
          </div>

          <div className="mt-6 rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
            <p className="text-[11px] tracking-[0.18em] text-white/38">CURRENT WORKSPACE</p>
            <p className="mt-2 text-sm font-semibold text-white">대흥교회 청년부</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/58">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">무료 플랜</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">팀원 4명</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">이번 주 공지 3건</span>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {navSections.map((section) => (
              <div key={section.title}>
                <p className="px-2 text-[11px] uppercase tracking-[0.18em] text-white/28">{section.title}</p>
                <div className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
                  {section.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`rounded-[14px] px-3 py-2.5 text-sm transition ${active ? "bg-[#C8A96B] font-semibold text-[#121212] shadow-[0_10px_24px_rgba(200,169,107,0.25)]" : "text-white/72 hover:bg-white/6 hover:text-white"}`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 lg:mt-auto">
            <div className="rounded-[18px] border border-[#C8A96B]/20 bg-[#C8A96B]/10 p-4">
              <p className="text-xs tracking-[0.18em] text-[#E7D7B1]">UPGRADE</p>
              <p className="mt-2 text-sm font-medium text-white">무료로 시작하고, 운영이 자리 잡히면 확장하세요</p>
              <p className="mt-2 text-xs leading-5 text-white/54">사람 관리, 공지, 작업 흐름, 콘텐츠 요청까지 한 구조로 이어집니다.</p>
            </div>
          </div>
        </aside>

        <section className="min-w-0 bg-[#F4F0E8]">
          <div className="flex flex-col gap-4 border-b border-[#E3D9C9] bg-[#FBF9F4] px-5 py-4 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">SOOM WORKSPACE</p>
              <p className="mt-1 text-sm text-[#5F564B]">교회와 사역팀을 위한 운영 대시보드</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/" className="inline-flex min-h-10 items-center justify-center rounded-[12px] border border-[#E7E0D4] bg-white px-4 text-sm font-medium text-[#121212]">
                홈으로
              </Link>
              <Link href="/pricing" className="inline-flex min-h-10 items-center justify-center rounded-[12px] border border-[#E7E0D4] bg-white px-4 text-sm font-medium text-[#121212]">
                상품 보기
              </Link>
              <Link href="/signup" className="inline-flex min-h-10 items-center justify-center rounded-[12px] bg-[#0F172A] px-4 text-sm font-semibold text-white">
                무료로 시작하기
              </Link>
            </div>
          </div>

          <div className="min-w-0 p-5 sm:p-7">{children}</div>
        </section>
      </div>
    </main>
  );
}
