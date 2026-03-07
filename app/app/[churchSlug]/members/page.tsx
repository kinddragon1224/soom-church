import { StatusBadge } from "@/components/ui/badge";
import { getChurchBySlug } from "@/lib/church-context";
import { getWorkspaceMembers } from "@/lib/workspace-data";

export default async function ChurchMembersPage({ params }: { params: { churchSlug: string } }) {
  const church = await getChurchBySlug(params.churchSlug);
  const members = await getWorkspaceMembers(church.id);

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{church.name} · 교인</h2>
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
