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

const sidebarItems = (base: string) => [
  { label: "홈", href: `${base}/dashboard` },
  { label: "목원", href: `${base}/members` },
  { label: "후속", href: `${base}/dashboard#followups` },
  { label: "중보", href: `${base}/dashboard#households` },
  { label: "근황", href: `${base}/dashboard#updates` },
];

export default function GidoWorkspaceShell({ base, church, role, currentUserName, children }: GidoWorkspaceShellProps) {
  const pathname = usePathname();
  const items = sidebarItems(base);

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#171717]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[272px] shrink-0 flex-col bg-[#0f0f10] px-5 py-6 text-white lg:flex">
          <div className="flex items-center justify-between">
            <Link href={base} className="text-[1.05rem] font-medium tracking-[-0.04em] text-white/92">
              soom workspace
            </Link>
            <div className="flex items-center gap-2 text-white/40">
              <span className="text-sm">⌂</span>
              <span className="text-sm">•</span>
            </div>
          </div>

          <div className="mt-8 grid gap-1">
            {items.map((item, index) => {
              const active = index === 0 ? pathname === `${base}/dashboard` : pathname.startsWith(item.href.split("#")[0]);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm transition ${active ? "bg-white/8 text-white" : "text-white/62 hover:bg-white/5 hover:text-white"}`}
                >
                  <span className={`h-2 w-2 rounded-full ${active ? "bg-white" : "bg-white/30"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto rounded-[18px] border border-white/10 bg-white/5 p-3.5">
            <p className="text-xs text-white/44">workspace</p>
            <p className="mt-2 text-sm font-medium text-white">{church.name}</p>
            <p className="mt-1 text-xs text-white/52">{currentUserName ?? role}</p>
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
