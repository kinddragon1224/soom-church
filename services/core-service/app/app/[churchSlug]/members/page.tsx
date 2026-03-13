import { StatusBadge } from "@/components/ui/badge";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { startOfMonth } from "@/lib/date";
import { getWorkspaceMembers } from "@/lib/workspace-data";

export default async function ChurchMembersPage({
  params,
  searchParams,
}: {
  params: { churchSlug: string };
  searchParams?: { filter?: string };
}) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) {
    return (
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-semibold">접근 권한이 없습니다</h2>
        <p className="mt-2 text-sm text-muted-foreground">워크스페이스 선택 화면으로 돌아가 다시 시도해주세요.</p>
      </section>
    );
  }

  const church = membership.church;
  const filter = searchParams?.filter ?? "all";
  const filterLabel = filter === "new" ? "이번 달 신규" : filter === "followup" ? "후속관리 필요" : "전체";
  const members = await getWorkspaceMembers(church.id, {
    followUpOnly: filter === "followup",
    registeredFrom: filter === "new" ? startOfMonth(new Date()) : undefined,
  });

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">{church.name} · 교인</h2>
        <div className="flex flex-wrap gap-2 text-xs">
          <a href={`?filter=all`} className={`rounded-full border px-2.5 py-1 ${filter === "all" ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>전체</a>
          <a href={`?filter=new`} className={`rounded-full border px-2.5 py-1 ${filter === "new" ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>이번 달 신규</a>
          <a href={`?filter=followup`} className={`rounded-full border px-2.5 py-1 ${filter === "followup" ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>후속관리 필요</a>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">현재 보기: {filterLabel}</p>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="min-w-[760px]">
          <thead><tr><th>이름</th><th>연락처</th><th>교구/목장</th><th>상태</th><th>후속관리</th></tr></thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.phone}</td>
                <td>{m.district?.name ?? "-"} / {m.group?.name ?? "-"}</td>
                <td><StatusBadge>{m.statusTag}</StatusBadge></td>
                <td>{m.requiresFollowUp ? "필요" : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
