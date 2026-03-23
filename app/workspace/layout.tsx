import Link from "next/link";

const navItems = [
  { href: "/workspace", label: "대시보드" },
  { href: "/workspace/people", label: "사람" },
  { href: "/workspace/notices", label: "공지" },
  { href: "/workspace/tasks", label: "작업" },
  { href: "/workspace/content", label: "콘텐츠" },
  { href: "/workspace/settings", label: "설정" },
];

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#07101d] text-white">
      <section className="border-b border-white/10 bg-[#07101d]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
          <div>
            <Link href="/" className="font-display text-[1.9rem] font-semibold tracking-[-0.08em] text-white sm:text-[2.3rem]">
              soom
            </Link>
            <p className="mt-1 text-xs text-white/42">workspace demo</p>
          </div>
          <div className="flex gap-2">
            <Link href="/signup" className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-[#09111f]">
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0b1327]/92 shadow-[0_24px_80px_rgba(2,6,23,0.42)]">
            <div className="grid lg:grid-cols-[260px_1fr]">
              <aside className="border-b border-white/10 bg-[#0a1222] p-5 lg:border-b-0 lg:border-r">
                <p className="text-xs tracking-[0.2em] text-white/32">SOOM WORKSPACE</p>
                <div className="mt-4 rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold">대흥교회 청년부</p>
                  <p className="mt-1 text-xs text-white/46">무료 플랜 · 데모</p>
                </div>
                <div className="mt-5 grid gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-[16px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/76 transition hover:bg-white/[0.08]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-5 rounded-[20px] border border-emerald-400/15 bg-emerald-400/[0.06] p-4">
                  <p className="text-xs tracking-[0.18em] text-emerald-200/70">FREE PLAN</p>
                  <p className="mt-2 text-sm font-semibold text-white">무료로 시작하고, 필요할 때 확장</p>
                  <p className="mt-2 text-xs leading-6 text-white/58">향후 결제/플랜이 붙어도 지금은 가볍게 흐름을 정리하는 데 집중합니다.</p>
                </div>
              </aside>

              <div className="min-w-0 p-5 sm:p-7">{children}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
