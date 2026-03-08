import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PlatformAdminPage() {
  const [churchCount, userCount, activeMembershipCount, subscriptionCount] = await Promise.all([
    prisma.church.count({ where: { isActive: true } }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.churchMembership.count({ where: { isActive: true } }),
    prisma.subscription.count(),
  ]);

  const cards = [
    ["활성 교회", churchCount, "/platform-admin/churches"],
    ["활성 사용자", userCount, "/platform-admin/users"],
    ["활성 멤버십", activeMembershipCount, "/platform-admin/users"],
    ["구독 레코드", subscriptionCount, "/platform-admin/subscriptions"],
  ] as const;

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-xl font-semibold">플랫폼 운영 개요</h2>
        <p className="mt-2 text-sm text-muted-foreground">교회 워크스페이스, 사용자, 구독 상태를 한 화면에서 점검합니다.</p>
      </section>

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
