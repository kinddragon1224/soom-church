"use client";

import Link from "next/link";
import { LayoutDashboard, Users, Building2, ClipboardList, Megaphone, History } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menus = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/members", label: "교인", icon: Users },
  { href: "/districts", label: "교구/목장", icon: Building2 },
  { href: "/applications", label: "신청", icon: ClipboardList },
  { href: "/notices", label: "공지", icon: Megaphone },
  { href: "/activity-logs", label: "활동 로그", icon: History },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="mb-5">
        <p className="text-xs text-muted-foreground">SOOM CHURCH HUB</p>
        <h1 className="text-lg font-bold text-primary sm:text-xl">숨 관리자</h1>
      </div>
      <nav className="space-y-1">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const active = pathname === menu.href || pathname.startsWith(`${menu.href}/`);
          return (
            <Link
              key={menu.href}
              href={menu.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                active ? "bg-primary text-white" : "hover:bg-muted",
              )}
            >
              <Icon size={16} />
              {menu.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-white p-4 lg:block">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="h-full w-full border-r border-border bg-white p-4">
      <SidebarContent onNavigate={onNavigate} />
    </aside>
  );
}
