import { prisma } from "@/lib/prisma";

export default async function PlatformAdminChurchesPage() {
  const churches = await prisma.church.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { memberships: true, members: true } },
      subscriptions: { select: { plan: true, status: true }, take: 1, orderBy: { createdAt: "desc" } },
    },
    take: 50,
  });

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">교회 워크스페이스 목록</h2>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="min-w-[760px]">
          <thead><tr><th>교회명</th><th>슬러그</th><th>멤버십</th><th>교인 데이터</th><th>플랜</th><th>상태</th></tr></thead>
          <tbody>
            {churches.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.slug}</td>
                <td>{c._count.memberships}</td>
                <td>{c._count.members}</td>
                <td>{c.subscriptions[0]?.plan ?? "FREE"}</td>
                <td>{c.isActive ? "ACTIVE" : "INACTIVE"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
