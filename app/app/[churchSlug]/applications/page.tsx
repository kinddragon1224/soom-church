import Link from "next/link";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { formatDate } from "@/lib/date";
import { getWorkspaceApplications } from "@/lib/workspace-data";

export const dynamic = "force-dynamic";

type ApplicationViewStatus = "ALL" | "PENDING" | "IN_REVIEW" | "APPROVED";
type ApplicationStatus = "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";

const statusLabel: Record<ApplicationStatus, string> = {
  PENDING: "접수됨",
  IN_REVIEW: "확인중",
  APPROVED: "승인됨",
  REJECTED: "보류",
};

const statusTone: Record<ApplicationStatus, string> = {
  PENDING: "border-[#eadfcd] bg-[#fff7e8] text-[#8C6A2E]",
  IN_REVIEW: "border-[#d9e3f5] bg-[#eff4ff] text-[#365b96]",
  APPROVED: "border-[#d7e8dc] bg-[#eefbf3] text-[#2d7a46]",
  REJECTED: "border-[#e6dfd5] bg-white text-[#8C7A5B]",
};

const stageLabel: Record<ApplicationStatus, string> = {
  PENDING: "1단계 · 접수 확인",
  IN_REVIEW: "2단계 · 내용 검토",
  APPROVED: "3단계 · 안내 연결",
  REJECTED: "보류 · 재확인 필요",
};

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
  const requestedStatus = searchParams?.status;
  const status: ApplicationViewStatus =
    requestedStatus === "PENDING" ||
    requestedStatus === "IN_REVIEW" ||
    requestedStatus === "APPROVED"
      ? requestedStatus
      : "ALL";

  const allApplications = await getWorkspaceApplications(church.id, { status: "ALL" });
  const applications =
    status === "ALL" ? allApplications : allApplications.filter((item) => item.status === status);

  const counts = {
    all: allApplications.length,
    pending: allApplications.filter((item) => item.status === "PENDING").length,
    review: allApplications.filter((item) => item.status === "IN_REVIEW").length,
    approved: allApplications.filter((item) => item.status === "APPROVED").length,
  };

  const filters = [
    { key: "ALL", label: "전체", value: counts.all },
    { key: "PENDING", label: "접수됨", value: counts.pending },
    { key: "IN_REVIEW", label: "확인중", value: counts.review },
    { key: "APPROVED", label: "승인됨", value: counts.approved },
  ] as const;

  const actionRail = [
    {
      title: `바로 확인 ${counts.pending}건`,
      desc: "새로 들어온 신청부터 먼저 열어 초기 응답이 밀리지 않게 정리합니다.",
      href: "?status=PENDING",
    },
    {
      title: `검토 진행 ${counts.review}건`,
      desc: "확인중에 오래 머무는 신청이 없는지 보고 다음 안내를 이어갑니다.",
      href: "?status=IN_REVIEW",
    },
    {
      title: `승인 완료 ${counts.approved}건`,
      desc: "승인 이후 연결 안내까지 끝났는지 마지막 흐름을 점검합니다.",
      href: "?status=APPROVED",
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
                신청 상태를
                <br />
                바로 처리 흐름으로 정리합니다
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                접수, 확인, 승인 단계를 한 화면에서 나눠 보고 다음 응답이 필요한 신청부터 바로 처리하는 실사용 신청 화면입니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[240px] lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">{church.name}</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">applications</span>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">ALL</p>
              <p className="mt-2 text-2xl font-semibold">{counts.all}</p>
              <p className="mt-2 text-xs text-white/60">전체 신청</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">NEW</p>
              <p className="mt-2 text-2xl font-semibold">{counts.pending}</p>
              <p className="mt-2 text-xs text-white/60">먼저 응답할 신청</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">IN PROGRESS</p>
              <p className="mt-2 text-2xl font-semibold">{counts.review}</p>
              <p className="mt-2 text-xs text-white/60">확인중 흐름</p>
            </div>
          </div>
        </div>

        <section className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">QUICK FILTERS</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">상태별 보기</h2>
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
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">지금 먼저 볼 흐름</h2>
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
          <div className="flex flex-col gap-3 border-b border-[#efe7da] pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">APPLICATION LIST</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">신청 목록</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#8C7A5B]">
              <span className="rounded-full border border-[#eadfcd] bg-[#fff7e8] px-3 py-1 text-[#8C6A2E]">{applications.length}건 표시</span>
              <span>
                {status === "PENDING"
                  ? "접수됨 보기"
                  : status === "IN_REVIEW"
                    ? "확인중 보기"
                    : status === "APPROVED"
                      ? "승인됨 보기"
                      : "전체 보기"}
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            <div className="hidden grid-cols-[minmax(0,1.2fr)_180px_140px_auto] gap-3 px-3 text-[11px] tracking-[0.16em] text-[#9a8b7a] md:grid">
              <span>신청자 / 폼</span>
              <span>상태</span>
              <span>등록일</span>
              <span className="text-right">다음 단계</span>
            </div>

            {applications.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">
                아직 표시할 신청이 없어. 신청 폼과 접수 흐름이 시작되면 여기서 바로 관리할 수 있어.
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] px-3 py-3 transition hover:border-[#dfd3bf] hover:bg-white"
                >
                  <div className="flex flex-col gap-3 md:grid md:grid-cols-[minmax(0,1.2fr)_180px_140px_auto] md:items-center md:gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#111111]">{app.applicantName}</p>
                      <p className="mt-1 truncate text-xs text-[#7a6d5c]">{app.form.title}</p>
                    </div>

                    <div>
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] ${statusTone[app.status as ApplicationStatus]}`}>
                        {statusLabel[app.status as ApplicationStatus]}
                      </span>
                    </div>

                    <p className="text-xs text-[#8c7a5b] md:text-right">{formatDate(app.createdAt)}</p>

                    <div className="flex items-center md:justify-end">
                      <div className="rounded-full border border-[#e6dfd5] bg-white px-3 py-1 text-[11px] text-[#6a5e51]">
                        {stageLabel[app.status as ApplicationStatus]}
                      </div>
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
