"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type GidoWorkspaceShellProps = {
  base: string;
  church: { name: string; slug: string };
  role: string;
  currentUserName?: string;
  children: React.ReactNode;
};

type SidebarItem = {
  key: "today" | "review" | "people" | "households" | "timeline" | "search";
  label: string;
  hint: string;
  href: string;
  tone: string;
};

const sidebarItems = (base: string): SidebarItem[] => [
  { key: "today", label: "Today", hint: "오늘 바로 처리", href: `${base}/today`, tone: "#f3f4f6" },
  { key: "review", label: "Review", hint: "AI 검토 대기", href: `${base}/review`, tone: "#f0c674" },
  { key: "people", label: "People", hint: "사람 레코드", href: `${base}/people`, tone: "#7dd3a7" },
  { key: "households", label: "Households", hint: "가정 관계", href: `${base}/households`, tone: "#d2a8ff" },
  { key: "timeline", label: "Timeline", hint: "기록 흐름", href: `${base}/timeline`, tone: "#7cc6ff" },
  { key: "search", label: "Search", hint: "빠른 복구", href: `${base}/search`, tone: "#8be9d5" },
];

export default function GidoWorkspaceShell({ base, church, role, currentUserName, children }: GidoWorkspaceShellProps) {
  const pathname = usePathname();
  const items = sidebarItems(base);

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#171717]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[272px] shrink-0 flex-col bg-[#0b0f17] px-4 py-5 text-white lg:flex">
          <div className="px-1">
            <Link href={`${base}/today`} className="text-[1rem] font-medium tracking-[-0.04em] text-white/92">
              soom ops
            </Link>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] tracking-[0.16em] text-white/58">
                CHAT-FIRST
              </span>
              <span className="text-[11px] text-white/38">mokjang os beta</span>
            </div>
          </div>

          <div className="mt-6 rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
            <p className="text-[10px] tracking-[0.18em] text-white/34">WORKSPACE</p>
            <p className="mt-2 text-sm font-medium text-white">{church.name}</p>
            <p className="mt-1 text-xs text-white/46">{currentUserName ?? role}</p>
            <p className="mt-4 text-[12px] leading-5 text-white/56">
              대화는 모라에서 하고, 여기서는 오늘 할 일과 검토, 복구만 본다.
            </p>
          </div>

          <div className="mt-5 border-t border-white/6 pt-4">
            <p className="px-3 text-[10px] uppercase tracking-[0.18em] text-white/24">flow</p>
            <div className="mt-2 grid gap-1.5">
              {items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`) ||
                  (item.key === "today" && pathname === `${base}/dashboard`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group rounded-[16px] px-3 py-3 transition ${active ? "bg-white/8 text-white" : "text-white/62 hover:bg-white/5 hover:text-white"}`}
                  >
                    <div className="flex items-start gap-3">
                      <SidebarIcon tone={item.tone} active={active}>
                        <SidebarGlyph name={item.key} />
                      </SidebarIcon>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className={`mt-1 text-[11px] ${active ? "text-white/56" : "text-white/34"}`}>{item.hint}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <div className="rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c8a96b] text-sm font-semibold text-[#111111]">
                  {(currentUserName ?? church.name).slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{currentUserName ?? church.name}</p>
                  <p className="truncate text-[11px] text-white/42">{church.slug}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-white/44">
              <Link href="/app" className="rounded-[14px] border border-white/8 bg-white/[0.03] px-2 py-3 transition hover:bg-white/6 hover:text-white/74">
                <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/10">
                  <SidebarGlyph name="profile" compact />
                </div>
                목록
              </Link>
              <Link href={`${base}/members`} className="rounded-[14px] border border-white/8 bg-white/[0.03] px-2 py-3 transition hover:bg-white/6 hover:text-white/74">
                <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/10">
                  <SidebarGlyph name="people" compact />
                </div>
                기존 사람
              </Link>
              <Link href="/contact" className="rounded-[14px] border border-white/8 bg-white/[0.03] px-2 py-3 transition hover:bg-white/6 hover:text-white/74">
                <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/10">
                  <SidebarGlyph name="help" compact />
                </div>
                도움
              </Link>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <div className="min-h-[calc(100vh-2rem)] rounded-[30px] border border-[#e8e1d6] bg-[#fbfaf7] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-5 lg:p-6">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

function SidebarIcon({ tone, active, children }: { tone: string; active: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${active ? "border-white/12 bg-white/12 text-white" : "border-white/6 bg-white/[0.04] text-white/74 group-hover:border-white/10 group-hover:bg-white/[0.08]"}`}
      style={{ boxShadow: active ? `inset 0 0 0 1px ${tone}22` : undefined }}
    >
      <span style={{ color: tone }}>{children}</span>
    </span>
  );
}

function SidebarGlyph({
  name,
  compact = false,
}: {
  name: "today" | "review" | "people" | "households" | "timeline" | "search" | "profile" | "help";
  compact?: boolean;
}) {
  const size = compact ? 12 : 15;

  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "today":
      return <svg {...common}><path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h10" /></svg>;
    case "review":
      return <svg {...common}><path d="M9 11.5 11 13.5 15.5 9" /><path d="M21 12a9 9 0 1 1-5.27-8.2" /></svg>;
    case "people":
      return <svg {...common}><path d="M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1" /><circle cx="9.5" cy="7" r="3" /><path d="M17 11a3 3 0 1 0 0-6" /><path d="M21 20v-1a4 4 0 0 0-3-3.87" /></svg>;
    case "households":
      return <svg {...common}><path d="M4 11.5 12 5l8 6.5" /><path d="M6 10.5V20h12v-9.5" /><path d="M10 20v-5h4v5" /></svg>;
    case "timeline":
      return <svg {...common}><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><circle cx="4.5" cy="6" r="1.5" /><circle cx="4.5" cy="12" r="1.5" /><circle cx="4.5" cy="18" r="1.5" /></svg>;
    case "search":
      return <svg {...common}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>;
    case "profile":
      return <svg {...common}><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>;
    case "help":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 4.1 2c-.9.7-1.6 1.2-1.6 2.5" /><path d="M12 17h.01" /></svg>;
  }
}
