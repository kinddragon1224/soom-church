import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const navItems = [
  { href: "/app/beta", label: "Home" },
  { href: "/app/beta/chat", label: "Chat" },
  { href: "/app/beta/world", label: "World" },
  { href: "/app/beta/records", label: "Records" },
  { href: "/app/beta/settings", label: "Settings" },
];

export default async function BetaLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?next=/app/beta");
  }

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#171717]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[248px] shrink-0 flex-col border-r border-white/6 bg-[#10141c] px-4 py-5 text-white lg:flex">
          <div>
            <Link href="/app/beta" className="text-[1rem] font-medium tracking-[-0.04em] text-white/92">
              soom beta os
            </Link>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] tracking-[0.16em] text-white/58">
                BETA
              </span>
              <span className="text-[11px] text-white/38">operating system</span>
            </div>
          </div>

          <div className="mt-6 rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
            <p className="text-[10px] tracking-[0.18em] text-white/34">WORKSPACE</p>
            <p className="mt-2 text-sm font-medium text-white">새 beta 운영 개발 OS</p>
            <p className="mt-4 text-[12px] leading-5 text-white/56">기본 구조부터 단계별로 다시 세우는 작업 공간.</p>
          </div>

          <div className="mt-5 border-t border-white/6 pt-4">
            <p className="px-3 text-[10px] uppercase tracking-[0.18em] text-white/24">flow</p>
            <div className="mt-2 grid gap-1.5">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-[16px] px-3 py-3 text-white/62 transition hover:bg-white/5 hover:text-white">
                  <p className="text-sm font-medium">{item.label}</p>
                </Link>
              ))}
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
