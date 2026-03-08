import { Blocks, Building2, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "공식 홈페이지",
    desc: "소개·기능·요금·문의·시작 흐름",
    sub: "공홈은 신뢰와 시작 경로에 집중",
    icon: LayoutDashboard,
  },
  {
    title: "교회 워크스페이스",
    desc: "교회별 운영 데이터 분리",
    sub: "로그인 후 교회 단위로 안전하게 접근",
    icon: Building2,
  },
  {
    title: "핵심 모듈",
    desc: "교적·신청·알림·후속관리",
    sub: "한 화면에서 운영 흐름을 연결",
    icon: Blocks,
  },
  {
    title: "운영 안정성",
    desc: "권한 가드와 확장 가능한 구조",
    sub: "SaaS 확장을 위한 기초 울타리 내장",
    icon: ShieldCheck,
  },
];

export function FeatureCards() {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {features.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="p-4 shadow-panel transition hover:-translate-y-0.5 hover:border-primary/30">
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted">
              <Icon size={16} />
            </div>
            <h2 className="text-sm font-semibold">{item.title}</h2>
            <p className="mt-1 text-sm text-foreground">{item.desc}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.sub}</p>
          </Card>
        );
      })}
    </section>
  );
}
