import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export default async function PlatformAdminSubscriptionsPage() {
  const subscriptions = await prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
    include: { church: { select: { name: true, slug: true } } },
    take: 100,
  });

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">구독 / 플랜 현황</h2>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="min-w-[760px]">
          <thead><tr><th>교회</th><th>플랜</th><th>상태</th><th>트라이얼 종료</th><th>청구 종료</th></tr></thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr key={s.id}>
                <td>{s.church.name}</td>
                <td>{s.plan}</td>
                <td>{s.status}</td>
                <td>{s.trialEndsAt ? new Date(s.trialEndsAt).toLocaleDateString("ko-KR") : "-"}</td>
                <td>{s.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString("ko-KR") : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
