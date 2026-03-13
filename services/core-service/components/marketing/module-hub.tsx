import Link from "next/link";
import { Bell, BookOpenText, ClipboardList, Users2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const modules = [
  {
    title: "숨 교적",
    desc: "교인·가족·상태를 한 화면에서 관리",
    state: "활성",
    href: "/login",
    icon: Users2,
  },
  {
    title: "숨 신청",
    desc: "주차·행사·접수 현황을 빠르게 점검",
    state: "활성",
    href: "/login",
    icon: ClipboardList,
  },
  {
    title: "숨 알림",
    desc: "공지 전달 흐름을 정리하고 추적",
    state: "활성",
    href: "/login",
    icon: Bell,
  },
  {
    title: "숨 기록",
    desc: "사역 기록과 아카이브 연결 준비",
    state: "준비 중",
    href: "#",
    icon: BookOpenText,
  },
];

export function ModuleHub() {
  return (
    <section className="space-y-2">
      <div>
        <p className="text-xs text-muted-foreground">SOOM MODULE HUB</p>
        <h2 className="text-lg font-semibold">교회 운영 모듈</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {modules.map((m) => {
          const Icon = m.icon;
          const disabled = m.href === "#";
          return (
            <Link
              key={m.title}
              href={m.href}
              aria-disabled={disabled}
              className={disabled ? "pointer-events-none" : ""}
            >
              <Card className={`p-4 shadow-panel transition ${disabled ? "opacity-70" : "hover:-translate-y-0.5 hover:border-primary/30"}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted">
                    <Icon size={16} />
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${m.state === "활성" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>{m.state}</span>
                </div>
                <h3 className="mt-3 text-sm font-semibold">{m.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
