import Link from "next/link";

const navItems = [
  { href: "/workspace", label: "home" },
  { href: "/workspace/people", label: "people" },
  { href: "/workspace/notices", label: "communications" },
  { href: "/workspace/tasks", label: "tasks" },
  { href: "/workspace/content", label: "content studio" },
  { href: "/workspace/settings", label: "settings" },
];

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#111111]">
      <div className="grid min-h-screen lg:grid-cols-[250px_1fr]">
        <aside className="flex min-h-full flex-col border-r border-white/6 bg-[#0b0b0c] px-4 py-5 text-white">
          <div className="flex items-center justify-between gap-3 px-2">
            <Link href="/workspace" className="font-display text-[1.65rem] font-semibold tracking-[-0.08em] text-white">
              gloo workspace
            </Link>
            <span className="text-xs text-white/34">demo</span>
          </div>

          <div className="mt-7 grid gap-1.5">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-[14px] px-3 py-2.5 text-sm capitalize transition ${index === 0 ? "bg-white text-[#111111] font-semibold" : "text-white/70 hover:bg-white/6 hover:text-white"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto space-y-3 px-2">
            <div className="rounded-[18px] border border-white/8 bg-white/[0.04] p-4">
              <p className="text-xs tracking-[0.18em] text-white/36">WORKSPACE</p>
              <p className="mt-2 text-sm font-semibold text-white">SOOM</p>
              <p className="mt-1 text-xs text-white/42">무료 플랜 · team 4</p>
            </div>
            <div className="rounded-[18px] border border-emerald-400/12 bg-emerald-400/[0.06] p-4">
              <p className="text-xs tracking-[0.18em] text-emerald-200/70">UPGRADE</p>
              <p className="mt-2 text-sm font-medium text-white">무료로 시작하고, 필요할 때 확장</p>
            </div>
          </div>
        </aside>

        <section className="min-w-0 bg-[#f4f5f7]">
          <div className="flex items-center justify-between gap-4 border-b border-[#e7e8eb] bg-white px-5 py-4 sm:px-7">
            <div>
              <p className="text-xs tracking-[0.18em] text-[#9aa0a6]">SOOM WORKSPACE</p>
              <p className="mt-1 text-sm text-[#5f6368]">교회와 사역팀을 위한 운영 대시보드</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/signup" className="inline-flex min-h-10 items-center justify-center rounded-[12px] bg-[#111111] px-4 text-sm font-semibold text-white">
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
