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
      { key: "notices", label: "공지", href: "notices", hint: "전달 흐름" },
    ],
  },
  {
    title: "system",
    items: [{ key: "settings", label: "설정", href: "settings", hint: "워크스페이스 기본값" }],
  },
] as const;

const topUtilityItems = [
  { label: "검색", value: "⌘K" },
  { label: "플랜", value: "무료" },
  { label: "역할", value: "owner" },
] as const;

type NavItem = {
  key: string;
  label: string;
  href: string;
  hint: string;
};

export function WorkspaceShell({
  church,
  children,
}: {
  church: { name: string; slug: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const base = `/app/${church.slug}`;

  const flatItems: NavItem[] = navSections.flatMap((section) => section.items.map((item) => ({ ...item })));
  const currentItem =
    flatItems.find((item) => pathname === `${base}/${item.href}` || pathname.startsWith(`${base}/${item.href}/`)) ?? flatItems[0];

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
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">LIVE</span>
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
                            <span
                              className={`rounded-full px-2 py-1 text-[9px] uppercase tracking-[0.16em] ${
                                active ? "bg-black/10 text-[#3d3118]" : "bg-white/6 text-white/24"
                              }`}
                            >
                              {active ? "on" : ""}
                            </span>
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
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 bg-[#F4F0E8] lg:h-full lg:min-h-0 lg:overflow-y-auto lg:rounded-[30px] lg:border lg:border-[#DDD1BE] lg:bg-[#F4F0E8] lg:shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="border-b border-[#E3D9C9] bg-[#FBF9F4] px-5 py-4 sm:px-7 lg:sticky lg:top-0 lg:z-20 lg:rounded-t-[30px]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#8C7A5B]">
                  <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1">SOOM WORKSPACE</span>
                  <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1">{church.name}</span>
                </div>
                <div className="mt-3 flex items-end gap-3">
                  <h1 className="text-[1.65rem] font-semibold tracking-[-0.05em] text-[#121212]">{currentItem.label}</h1>
                  <p className="pb-1 text-xs text-[#7B6F60]">{currentItem.hint}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 lg:items-end">
                <div className="flex w-full flex-wrap items-center gap-2 lg:justify-end">
                  {topUtilityItems.map((item) => (
                    <div key={item.label} className="inline-flex items-center gap-2 rounded-full border border-[#E7E0D4] bg-white px-3 py-1.5 text-xs text-[#6A5E51]">
                      <span className="text-[#9A8B7A]">{item.label}</span>
                      <span className="font-medium text-[#121212]">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`${base}/members`} className="inline-flex min-h-10 items-center justify-center rounded-[12px] bg-[#0F172A] px-4 text-sm font-semibold text-white">
                    사람 열기
                  </Link>
                  <Link href={`${base}/applications`} className="inline-flex min-h-10 items-center justify-center rounded-[12px] border border-[#E7E0D4] bg-white px-4 text-sm font-medium text-[#121212]">
                    신청 보기
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0 p-5 sm:p-7">{children}</div>
        </section>
      </div>
    </main>
  );
}
