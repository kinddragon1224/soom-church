import { requireWorkspaceMembership } from "@/lib/church-context";
import { getWorkspaceNotices } from "@/lib/workspace-data";
import { formatDate } from "@/lib/date";

export default async function ChurchNoticesPage({ params }: { params: { churchSlug: string } }) {
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
  const notices = await getWorkspaceNotices(church.id);

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{church.name} · 공지</h2>
      <ul className="space-y-2 rounded-xl border border-border bg-card p-3">
        {notices.map((n) => (
          <li key={n.id} className="rounded-md border border-border p-2.5">
            <p className="text-sm font-medium">{n.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{n.pinned ? "상단고정" : "일반"} · {formatDate(n.createdAt)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
