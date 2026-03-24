"use client";

import Link from "next/link";
import { Building2, ClipboardList, CreditCard, LayoutDashboard, Newspaper, Users, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type MenuGroup = {
  title: string;
  items: { href: string; label: string; icon: LucideIcon }[];
};

const menuGroups: MenuGroup[] = [
  {
    title: "플랫폼",
    items: [
      { href: "/platform-admin", label: "개요", icon: LayoutDashboard },
      { href: "/platform-admin/churches", label: "교회 목록", icon: Building2 },
      { href: "/platform-admin/users", label: "사용자", icon: Users },
      { href: "/platform-admin/subscriptions", label: "구독", icon: CreditCard },
      { href: "/platform-admin/provisioning", label: "워크스페이스 생성", icon: Wrench },
    ],
  },
  {
    title: "콘텐츠",
    items: [
      { href: "/guides", label: "AI 안내서", icon: Newspaper },
      { href: "/ai-guides", label: "공개 페이지", icon: ClipboardList },
    ],
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="mb-5 rounded-[20px] border border-white/8 bg-white/[0.04] p-4 text-white">
        <p className="text-[11px] tracking-[0.18em] text-white/46">SOOM PLATFORM</p>
        <h1 className="mt-2 text-lg font-semibold">숨 플랫폼 운영 콘솔</h1>
        <p className="mt-2 text-xs text-white/60">워크스페이스, 사용자, 구독, 콘텐츠를 관리하는 관리자 전용 화면</p>
      </div>

      <nav className="space-y-5">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/34">{group.title}</p>
            <div className="space-y-1">
              {group.items.map((menu) => {
                const Icon = menu.icon;
                const active = pathname === menu.href || pathname.startsWith(`${menu.href}/`);
                return (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2 rounded-[14px] px-3 py-2.5 text-sm transition",
                      active ? "bg-white text-[#0F172A]" : "text-white/74 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    <Icon size={16} />
                    {menu.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/8 bg-[#0f172a] p-4 lg:block">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="h-full w-full border-r border-white/8 bg-[#0f172a] p-4">
      <SidebarContent onNavigate={onNavigate} />
    </aside>
  );
}
