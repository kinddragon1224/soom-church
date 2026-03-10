import { requireWorkspaceMembership } from "@/lib/church-context";
import { formatDate } from "@/lib/date";
import { prisma } from "@/lib/prisma";

export default async function ChurchApplicationsPage({
  params,
  searchParams,
}: {
  params: { churchSlug: string };
  searchParams?: { status?: string };
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
  const status = searchParams?.status === "PENDING" ? "PENDING" : "ALL";
  const applications = await prisma.application.findMany({
    where: {
      churchId: church.id,
      ...(status === "PENDING" ? { status: "PENDING" } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      applicantName: true,
      status: true,
      createdAt: true,
      form: {
        select: {
          title: true,
        },
      },
    },
  });

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">{church.name} · 신청</h2>
        <div className="flex flex-wrap gap-2 text-xs">
          <a href={`?status=ALL`} className={`rounded-full border px-2.5 py-1 ${status === "ALL" ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>전체</a>
          <a href={`?status=PENDING`} className={`rounded-full border px-2.5 py-1 ${status === "PENDING" ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>미처리</a>
        </div>
      </div>
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
