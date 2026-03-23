import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PlatformAdminChurchesPage() {
  const churches = await prisma.church.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { memberships: true, members: true } },
      subscriptions: { select: { plan: true, status: true }, take: 1, orderBy: { createdAt: "desc" } },
      activityLogs: {
        where: { action: "WORKSPACE_ONBOARDED" },
        select: { metadata: true, createdAt: true },
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
    take: 50,
  });

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">교회 워크스페이스 목록</h2>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="min-w-[1100px] text-sm">
          <thead><tr><th>교회명</th><th>슬러그</th><th>담당자</th><th>온보딩 메모</th><th>멤버십</th><th>교인 데이터</th><th>플랜</th><th>상태</th></tr></thead>
          <tbody>
            {churches.map((c) => {
              const raw = c.activityLogs[0]?.metadata;
              let onboarding: any = null;
              try {
                onboarding = raw ? JSON.parse(raw) : null;
              } catch {}
              return (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.slug}</td>
                  <td>{onboarding?.ownerName ?? "-"}</td>
                  <td>{[onboarding?.role, onboarding?.ministry].filter(Boolean).join(" · ") || "-"}</td>
                  <td>{c._count.memberships}</td>
                  <td>{c._count.members}</td>
                  <td>{c.subscriptions[0]?.plan ?? "FREE"}</td>
                  <td>{c.isActive ? "ACTIVE" : "INACTIVE"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
