import { requireWorkspaceMembership } from "@/lib/church-context";
import { getWorkspaceDashboardData } from "@/lib/workspace-data";
import { formatDate } from "@/lib/date";
import { StatusBadge } from "@/components/ui/badge";

export default async function ChurchDashboardPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);

  if (!membership) return null;
  const church = membership.church;

  const data = await getWorkspaceDashboardData(church.id);

  const kpis = [
    ["총 교인 수", data.totalMembers],
    ["이번 달 신규", data.newThisMonth],
    ["미처리 신청", data.pendingApplications],
    ["후속관리", data.followUpMembers],
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-semibold">{church.name} 운영 현황</h2>
        <p className="mt-1 text-xs text-muted-foreground">데이터는 churchId 스코프로 조회됩니다.</p>
      </section>

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {kpis.map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold leading-none">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-3">
          <h3 className="mb-2 text-sm font-semibold">최근 등록 교인</h3>
          <ul className="space-y-2">
            {data.recentMembers.map((m) => (
              <li key={m.id} className="rounded-md border border-border p-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{m.name}</p>
                  <StatusBadge>{m.statusTag}</StatusBadge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">등록일 {formatDate(m.registeredAt)}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-3">
          <h3 className="mb-2 text-sm font-semibold">최근 신청</h3>
          <ul className="space-y-2">
            {data.recentApplications.map((a) => (
              <li key={a.id} className="rounded-md border border-border p-2 text-sm">
                <p className="font-medium">{a.applicantName}</p>
                <p className="text-xs text-muted-foreground">{a.status} · {formatDate(a.createdAt)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
