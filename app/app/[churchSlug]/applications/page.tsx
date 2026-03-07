import { requireWorkspaceMembership } from "@/lib/church-context";
import { getWorkspaceApplications } from "@/lib/workspace-data";
import { formatDate } from "@/lib/date";

export default async function ChurchApplicationsPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  const church = membership.church;
  const applications = await getWorkspaceApplications(church.id);

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{church.name} · 신청</h2>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="min-w-[700px]">
          <thead><tr><th>신청자</th><th>폼</th><th>상태</th><th>등록일</th></tr></thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.applicantName}</td>
                <td>{app.form.title}</td>
                <td>{app.status}</td>
                <td>{formatDate(app.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
