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
  key: "dashboard" | "members" | "followups" | "households" | "updates";
  label: string;
  href: string;
  tone: string;
};

const sidebarItems = (base: string): SidebarItem[] => [
  { key: "dashboard", label: "홈", href: `${base}/dashboard`, tone: "#f3f4f6" },
  { key: "members", label: "목원", href: `${base}/members`, tone: "#7dd3a7" },
  { key: "followups", label: "돌봄", href: `${base}/followups`, tone: "#7cc6ff" },
  { key: "households", label: "중보", href: `${base}/households`, tone: "#d2a8ff" },
  { key: "updates", label: "근황", href: `${base}/updates`, tone: "#8be9d5" },
];

export default function GidoWorkspaceShell({ base, church, role, currentUserName, children }: GidoWorkspaceShellProps) {
  const pathname = usePathname();
  const items = sidebarItems(base);

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#171717]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[248px] shrink-0 flex-col bg-[#0b0b0c] px-4 py-5 text-white lg:flex">
          <div className="px-1">
            <Link href={base} className="text-[1rem] font-medium tracking-[-0.04em] text-white/92">
              soom workspace
            </Link>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] tracking-[0.16em] text-white/42">
                G.I.D.O
              </span>
              <span className="text-[11px] text-white/34">목장 운영</span>
            </div>
          </div>

          <div className="mt-6 rounded-[18px] border border-white/8 bg-white/[0.04] p-3.5">
            <p className="text-[10px] tracking-[0.18em] text-white/34">WORKSPACE</p>
            <p className="mt-2 text-sm font-medium text-white">{church.name}</p>
            <p className="mt-1 text-xs text-white/46">{currentUserName ?? role}</p>
          </div>

          <div className="mt-6">
            <Link
              href={`${base}/dashboard`}
              className={`flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm transition ${pathname === `${base}/dashboard` ? "bg-white/8 text-white" : "text-white/62 hover:bg-white/5 hover:text-white"}`}
            >
              <SidebarIcon tone="#f3f4f6" active={pathname === `${base}/dashboard`}>
                <SidebarGlyph name="home" />
              </SidebarIcon>
              <span>홈</span>
            </Link>
          </div>

          <div className="mt-5 border-t border-white/6 pt-4">
            <p className="px-3 text-[10px] uppercase tracking-[0.18em] text-white/24">products</p>
            <div className="mt-2 grid gap-1">
              {items.filter((item) => item.key !== "dashboard").map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm transition ${active ? "bg-white/8 text-white" : "text-white/62 hover:bg-white/5 hover:text-white"}`}
                  >
                    <SidebarIcon tone={item.tone} active={active}>
                      <SidebarGlyph name={item.key} />
                    </SidebarIcon>
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <div className="rounded-[18px] border border-white/8 bg-white/[0.04] p-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d14eff] text-sm font-semibold text-white">
                  {(currentUserName ?? church.name).slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{currentUserName ?? church.name}</p>
                  <p className="truncate text-[11px] text-white/42">{church.name}</p>
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
              <Link href="/contact" className="rounded-[14px] border border-white/8 bg-white/[0.03] px-2 py-3 transition hover:bg-white/6 hover:text-white/74">
                <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/10">
                  <SidebarGlyph name="help" compact />
                </div>
                도움
              </Link>
              <Link href="/pricing" className="rounded-[14px] border border-white/8 bg-white/[0.03] px-2 py-3 transition hover:bg-white/6 hover:text-white/74">
                <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/10">
                  <SidebarGlyph name="spark" compact />
                </div>
                플랜
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
      className={`flex h-7 w-7 items-center justify-center rounded-full border transition ${active ? "border-white/12 bg-white/12 text-white" : "border-white/6 bg-white/[0.04] text-white/74 group-hover:border-white/10 group-hover:bg-white/[0.08]"}`}
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
  name: "home" | "dashboard" | "members" | "followups" | "households" | "updates" | "spark" | "profile" | "help";
  compact?: boolean;
}) {
  const size = compact ? 12 : 14;

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
    case "home":
    case "dashboard":
      return <svg {...common}><path d="M3 10.5 12 3l9 7.5" /><path d="M5.5 9.5V20h13V9.5" /></svg>;
    case "members":
      return <svg {...common}><path d="M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1" /><circle cx="9.5" cy="7" r="3" /><path d="M17 11a3 3 0 1 0 0-6" /><path d="M21 20v-1a4 4 0 0 0-3-3.87" /></svg>;
    case "followups":
      return <svg {...common}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
    case "households":
      return <svg {...common}><path d="M4 11.5 12 5l8 6.5" /><path d="M6 10.5V20h12v-9.5" /><path d="M10 20v-5h4v5" /></svg>;
    case "updates":
      return <svg {...common}><path d="M14 3h7v7" /><path d="M10 14 21 3" /><path d="M21 14v7h-7" /><path d="M3 10 14 21" /></svg>;
    case "spark":
      return <svg {...common}><path d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7z" /></svg>;
    case "profile":
      return <svg {...common}><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>;
    case "help":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 4.1 2c-.9.7-1.6 1.2-1.6 2.5" /><path d="M12 17h.01" /></svg>;
  }
}
