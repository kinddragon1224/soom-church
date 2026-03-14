import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export default async function PlatformAdminPage() {
  const [churchCount, subscriptionCount] = await Promise.all([
    prisma.church.count({ where: { isActive: true } }),
    prisma.subscription.count(),
  ]);

  const cards = [
    ["활성 교회", churchCount, "/platform-admin/churches"],
    ["구독 레코드", subscriptionCount, "/platform-admin/subscriptions"],
    ["워크스페이스 생성", "바로가기", "/platform-admin/provisioning"],
  ] as const;

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-xl font-semibold">플랫폼 운영 개요</h2>
        <p className="mt-2 text-sm text-muted-foreground">교회 워크스페이스와 구독 상태를 간결하게 관리합니다.</p>
      </section>

      <section className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {cards.map(([label, value, href]) => (
          <Link key={label} href={href} className="rounded-lg border border-border bg-card p-3 hover:bg-muted">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold leading-none">{value}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
