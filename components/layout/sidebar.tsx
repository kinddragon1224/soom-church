import Link from "next/link";
import { LayoutDashboard, Users, Building2, ClipboardList, Megaphone, History } from "lucide-react";

const menus = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/members", label: "교인", icon: Users },
  { href: "/districts", label: "교구/목장", icon: Building2 },
  { href: "/applications", label: "신청", icon: ClipboardList },
  { href: "/notices", label: "공지", icon: Megaphone },
  { href: "/activity-logs", label: "활동 로그", icon: History },
];

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-border bg-white p-4">
      <div className="mb-6">
        <p className="text-xs text-muted-foreground">SOOM CHURCH HUB</p>
        <h1 className="text-xl font-bold text-primary">숨 관리자</h1>
      </div>
      <nav className="space-y-1">
        {menus.map((menu) => {
          const Icon = menu.icon;
          return (
            <Link key={menu.href} href={menu.href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
              <Icon size={16} />
              {menu.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
