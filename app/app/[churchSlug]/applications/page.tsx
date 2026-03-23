import { requireWorkspaceMembership } from "@/lib/church-context";
import { formatDate } from "@/lib/date";
import { getWorkspaceApplications } from "@/lib/workspace-data";

export const dynamic = "force-dynamic";

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
      <section className="rounded-[24px] border border-[#E7E0D4] bg-white p-5 text-[#121212] shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
        <h2 className="text-lg font-semibold">접근 권한이 없어</h2>
        <p className="mt-2 text-sm text-[#5F564B]">워크스페이스 선택 화면으로 돌아가 다시 시도해줘.</p>
      </section>
    );
  }

  const church = membership.church;
  const status = searchParams?.status === "PENDING" ? "PENDING" : "ALL";
  const applications = await getWorkspaceApplications(church.id, { status });

  const pendingCount = applications.filter((item) => item.status === "PENDING").length;
  const reviewCount = applications.filter((item) => item.status === "IN_REVIEW").length;
  const approvedCount = applications.filter((item) => item.status === "APPROVED").length;

  const filterChips = [
    { key: "ALL", label: "전체", value: applications.length },
    { key: "PENDING", label: "미처리", value: pendingCount },
    { key: "REVIEW", label: "검토중", value: reviewCount },
    { key: "APPROVED", label: "승인", value: approvedCount },
  ] as const;

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">APPLICATIONS</p>
            <h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">신청</h2>
            <p className="mt-2 text-sm text-[#5f564b]">신청과 처리 상태를 한 화면에서 정리</p>
          </div>

          <div className="flex flex-col gap-3 xl:min-w-[520px] xl:items-end">
            <div className="flex w-full items-center gap-2 rounded-[16px] border border-[#E7E0D4] bg-[#FBF9F4] px-4 py-3">
              <span className="text-sm text-[#8C7A5B]">⌕</span>
              <span className="text-sm text-[#7B6F60]">신청 검색</span>
            </div>
            <div className="flex flex-wrap gap-2 xl:justify-end">
              <button className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-2 text-sm font-medium text-[#121212]">내보내기</button>
              <button className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-2 text-sm font-medium text-[#121212]">폼 관리</button>
              <button className="rounded-[14px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">신청 추가</button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex flex-wrap items-center gap-2">
          {filterChips.map((item) => {
            const active =
              (item.key === "ALL" && status === "ALL") ||
              (item.key === "PENDING" && status === "PENDING");
            return (
              <a
                key={item.key}
                href={item.key === "ALL" ? "?status=ALL" : item.key === "PENDING" ? "?status=PENDING" : "?status=ALL"}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  active ? "bg-[#0F172A] text-white" : "border border-[#E7E0D4] bg-white text-[#5f564b]"
                }`}
              >
                {item.label} {item.value}
              </a>
            );
          })}
          <button className="rounded-full border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#5f564b]">상태</button>
          <button className="rounded-full border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#5f564b]">담당자</button>
          <button className="rounded-full border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#5f564b]">최근 등록</button>
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-[#e6dfd5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between border-b border-[#efe7da] px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-[#111111]">신청 목록</p>
            <p className="mt-1 text-xs text-[#8C7A5B]">{applications.length}건</p>
          </div>
          <button className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-xs font-medium text-[#121212]">흐름 관리</button>
        </div>

        {applications.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-base font-semibold text-[#111111]">아직 등록된 신청이 없어</p>
            <p className="mt-2 text-sm text-[#5f564b]">신청 폼과 접수가 시작되면 여기서 바로 관리할 수 있어.</p>
            <div className="mt-4">
              <button className="rounded-[14px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">첫 신청 만들기</button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#FBF9F4] text-[#8C7A5B]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">이름</th>
                  <th className="px-4 py-3 text-left font-medium">상태</th>
                  <th className="px-4 py-3 text-left font-medium">신청 폼</th>
                  <th className="px-4 py-3 text-left font-medium">다음 단계</th>
                  <th className="px-4 py-3 text-left font-medium">등록일</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-t border-[#f1eadf] text-[#111111]">
                    <td className="px-4 py-3 font-medium">{app.applicantName}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] ${
                        app.status === "PENDING"
                          ? "bg-[#fff4df] text-[#8C6A2E]"
                          : app.status === "APPROVED"
                            ? "bg-[#eefbf3] text-[#2d7a46]"
                            : "border border-[#E7E0D4] bg-white text-[#5f564b]"
                      }`}>
                        {app.status === "PENDING" ? "미처리" : app.status === "APPROVED" ? "승인" : "검토중"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#5f564b]">{app.form.title}</td>
                    <td className="px-4 py-3 text-[#5f564b]">
                      {app.status === "PENDING" ? "상태 확인" : app.status === "APPROVED" ? "후속 연결" : "검토 계속"}
                    </td>
                    <td className="px-4 py-3 text-[#5f564b]">{formatDate(app.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
