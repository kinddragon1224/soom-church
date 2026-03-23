import Link from "next/link";
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
  const approvedCount = applications.filter((item) => item.status === "APPROVED").length;
  const reviewCount = applications.filter((item) => item.status === "IN_REVIEW").length;

  const filters = [
    { key: "ALL", label: "전체", value: applications.length },
    { key: "PENDING", label: "미처리", value: pendingCount },
  ] as const;

  const actionRail = [
    {
      title: `미처리 신청 ${pendingCount}건`,
      desc: "바로 열어서 상태를 바꾸고 담당 흐름을 정리합니다.",
      href: `?status=PENDING`,
    },
    {
      title: `검토중 ${reviewCount}건`,
      desc: "확인 중인 신청이 오래 머무르지 않게 점검합니다.",
      href: `?status=ALL`,
    },
    {
      title: `승인 완료 ${approvedCount}건`,
      desc: "승인 이후 다음 커뮤니케이션이 이어지는지 확인합니다.",
      href: `?status=ALL`,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] tracking-[0.2em] text-white/46">APPLICATION WORKSPACE</p>
              <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[2.7rem]">
                신청과 접수 흐름을
                <br />
                운영 기준으로 정리합니다
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                새 신청이 밀리지 않도록 상태와 다음 처리 흐름을 한 화면에서 빠르게 확인하는 실사용 신청 화면입니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[240px] lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">{church.name}</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">applications</span>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">TOTAL</p>
              <p className="mt-2 text-2xl font-semibold">{applications.length}</p>
              <p className="mt-2 text-xs text-white/60">현재 화면 기준 신청</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">PENDING</p>
              <p className="mt-2 text-2xl font-semibold">{pendingCount}</p>
              <p className="mt-2 text-xs text-white/60">바로 처리 필요</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">IN REVIEW</p>
              <p className="mt-2 text-2xl font-semibold">{reviewCount}</p>
              <p className="mt-2 text-xs text-white/60">검토중 흐름</p>
            </div>
          </div>
        </div>

        <section className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">QUICK FILTERS</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">바로 보기</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">applications</span>
          </div>
          <div className="mt-4 grid gap-3">
            {filters.map((item) => (
              <Link
                key={item.key}
                href={`?status=${item.key}`}
                className={`rounded-[18px] border p-4 transition ${status === item.key ? "border-[#C8A96B] bg-[#fff7e8]" : "border-[#ece6dc] bg-white hover:bg-[#fcfbf8]"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#111111]">{item.label}</p>
                  <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{item.value}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.86fr_1.14fr]">
        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">ACTION RAIL</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">지금 먼저 할 일</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">운영 우선순위</span>
            </div>
            <div className="mt-4 grid gap-3">
              {actionRail.map((item) => (
                <Link key={item.title} href={item.href} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 transition hover:bg-white">
                  <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">APPLICATION LIST</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">신청 목록</h2>
            </div>
            <span className="text-xs text-[#8C7A5B]">{status === "PENDING" ? "미처리 보기" : "전체 보기"}</span>
          </div>
          <div className="mt-4 grid gap-3">
            {applications.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">
                아직 표시할 신청이 없어. 신청 폼과 접수 흐름이 시작되면 여기서 바로 관리할 수 있어.
              </div>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-[#111111]">{app.applicantName}</p>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] ${app.status === "PENDING" ? "bg-[#fff4df] text-[#8C6A2E]" : app.status === "APPROVED" ? "bg-[#eefbf3] text-[#2d7a46]" : "bg-white text-[#8C7A5B] border border-[#e6dfd5]"}`}>{app.status}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#5f564b]">폼: {app.form.title}</p>
                      <p className="mt-1 text-[11px] text-[#9a8b7a]">등록일 {formatDate(app.createdAt)}</p>
                    </div>
                    <div className="grid gap-2 text-[11px] text-[#7a6d5c] sm:min-w-[180px]">
                      <div className="rounded-[12px] border border-[#e6dfd5] bg-white px-3 py-2">다음 단계: 상태 갱신</div>
                      <div className="rounded-[12px] border border-[#e6dfd5] bg-white px-3 py-2">흐름: 신청 → 확인 → 연결</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </div>
  );
}
