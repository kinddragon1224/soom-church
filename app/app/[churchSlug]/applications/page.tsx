import Link from "next/link";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { formatDate } from "@/lib/date";
import { getWorkspaceApplications } from "@/lib/workspace-data";

export const dynamic = "force-dynamic";

type ApplicationStatusFilter = "ALL" | "PENDING" | "IN_REVIEW" | "APPROVED";

function getStatusMeta(status: string) {
  if (status === "PENDING") {
    return {
      label: "미처리",
      tone: "bg-[#fff4df] text-[#8C6A2E]",
      nextStep: "상태 확인",
      lane: "지금",
    };
  }

  if (status === "APPROVED") {
    return {
      label: "승인됨",
      tone: "bg-[#eefbf3] text-[#2d7a46]",
      nextStep: "후속 연결",
      lane: "연결",
    };
  }

  return {
    label: "확인중",
    tone: "border border-[#E7E0D4] bg-white text-[#5f564b]",
    nextStep: "검토 계속",
    lane: "검토",
  };
}

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
  const status: ApplicationStatusFilter =
    requestedStatus === "PENDING" || requestedStatus === "IN_REVIEW" || requestedStatus === "APPROVED"
      ? requestedStatus
      : "ALL";

  const applications = await getWorkspaceApplications(church.id, { status });
  const allApplications = status === "ALL" ? applications : await getWorkspaceApplications(church.id, { status: "ALL" });

  const pendingCount = allApplications.filter((item) => item.status === "PENDING").length;
  const reviewCount = allApplications.filter((item) => item.status === "IN_REVIEW").length;
  const approvedCount = allApplications.filter((item) => item.status === "APPROVED").length;
  const oldestPending = allApplications.filter((item) => item.status === "PENDING").at(-1);
  const latestReview = allApplications.find((item) => item.status === "IN_REVIEW");
  const latestApproved = allApplications.find((item) => item.status === "APPROVED");

  const filterChips = [
    { key: "ALL", label: "전체", value: allApplications.length },
    { key: "PENDING", label: "미처리", value: pendingCount },
    { key: "IN_REVIEW", label: "확인중", value: reviewCount },
    { key: "APPROVED", label: "승인됨", value: approvedCount },
  ] as const;

  const statusRail = [
    {
      label: "바로 확인",
      value: pendingCount > 0 ? `${pendingCount}건` : "비어 있음",
      meta: oldestPending ? `${oldestPending.applicantName} · ${formatDate(oldestPending.createdAt)}` : "새 미처리 신청 없음",
      href: "?status=PENDING",
      cta: "열기",
    },
    {
      label: "확인중",
      value: reviewCount > 0 ? `${reviewCount}건` : "안정",
      meta: latestReview ? `${latestReview.applicantName} · ${latestReview.form.title}` : "멈춘 검토 없음",
      href: "?status=IN_REVIEW",
      cta: "보기",
    },
    {
      label: "승인 후 연결",
      value: approvedCount > 0 ? `${approvedCount}건` : "없음",
      meta: latestApproved ? `${latestApproved.applicantName} · ${formatDate(latestApproved.createdAt)}` : "후속 연결 대기 없음",
      href: "?status=APPROVED",
      cta: "보기",
    },
  ] as const;

  const focusRows = [
    pendingCount > 0
      ? {
          lane: "지금",
          title: `${oldestPending?.applicantName ?? "미처리 신청"} 먼저 확인`,
          desc: oldestPending
            ? `${formatDate(oldestPending.createdAt)} 접수 · 오래된 순서부터 정리`
            : "미처리 신청부터 먼저 정리",
          href: "?status=PENDING",
          cta: "미처리 보기",
        }
      : null,
    reviewCount > 0
      ? {
          lane: "검토",
          title: `${latestReview?.applicantName ?? "확인중 신청"} 다음 판단`,
          desc: latestReview ? `${latestReview.form.title} · 담당자 확인 흐름 유지` : "확인중 항목 정리",
          href: "?status=IN_REVIEW",
          cta: "확인중 보기",
        }
      : null,
    approvedCount > 0
      ? {
          lane: "연결",
          title: `${latestApproved?.applicantName ?? "승인 신청"} 후속 연결`,
          desc: latestApproved ? `${latestApproved.form.title} · 승인 후 다음 단계 이동` : "승인 항목 후속 연결",
          href: "?status=APPROVED",
          cta: "승인 보기",
        }
      : null,
  ].filter(Boolean) as { lane: string; title: string; desc: string; href: string; cta: string }[];

  const todayLine =
    pendingCount > 0
      ? `미처리 ${pendingCount}건부터 보면 돼. 가장 오래된 신청을 먼저 꺼내놨어.`
      : reviewCount > 0
        ? `지금은 확인중 ${reviewCount}건만 정리하면 돼.`
        : approvedCount > 0
          ? `승인된 신청 ${approvedCount}건의 다음 연결만 이어주면 돼.`
          : "지금 멈춰 있는 신청 흐름은 없어.";

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="overflow-hidden rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_58%,#243252_100%)] text-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
        <div className="grid gap-px bg-white/10 xl:grid-cols-[minmax(0,1.25fr)_360px]">
          <div className="p-5 sm:p-6">
            <p className="text-[11px] tracking-[0.2em] text-white/46">APPLICATIONS</p>
            <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.06em] text-white sm:text-[2.6rem]">신청 흐름만 빠르게 정리</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/68">{todayLine}</p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <Link href={`?status=${status}`} className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-white/82">
                현재 필터 {filterChips.find((item) => item.key === status)?.label}
              </Link>
              <Link href="?status=PENDING" className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-white/82">
                미처리 {pendingCount}건
              </Link>
              <Link href="?status=IN_REVIEW" className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-white/82">
                확인중 {reviewCount}건
              </Link>
              <Link href="?status=APPROVED" className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-white/82">
                승인 {approvedCount}건
              </Link>
            </div>
          </div>

          <div className="grid gap-px bg-white/10">
            <div className="bg-white/6 px-5 py-4 sm:px-6">
              <p className="text-[11px] tracking-[0.18em] text-white/46">QUICK OPEN</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="?status=PENDING" className="rounded-[14px] bg-white px-3 py-2 text-sm font-semibold text-[#111111]">미처리 열기</Link>
                <Link href={`/app/${church.slug}/members`} className="rounded-[14px] border border-white/12 bg-white/8 px-3 py-2 text-sm text-white/82">사람 보기</Link>
                <Link href={`/app/${church.slug}/dashboard`} className="rounded-[14px] border border-white/12 bg-white/8 px-3 py-2 text-sm text-white/82">홈</Link>
              </div>
            </div>

            <div className="divide-y divide-white/10 bg-white/4">
              {statusRail.map((item) => (
                <Link key={item.label} href={item.href} className="grid gap-2 px-5 py-4 transition hover:bg-white/6 sm:grid-cols-[96px_88px_minmax(0,1fr)_56px] sm:items-center sm:px-6">
                  <p className="text-[11px] tracking-[0.18em] text-white/46">{item.label}</p>
                  <p className="text-sm font-semibold text-white">{item.value}</p>
                  <p className="text-sm text-white/64">{item.meta}</p>
                  <p className="text-xs font-medium text-[#f1dfb2] sm:text-right">{item.cta}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex flex-wrap items-center gap-2">
          {filterChips.map((item) => (
            <Link
              key={item.key}
              href={item.key === "ALL" ? "?status=ALL" : `?status=${item.key}`}
              className={`rounded-full px-3 py-2 text-sm transition ${
                status === item.key ? "bg-[#0F172A] text-white" : "border border-[#E7E0D4] bg-white text-[#5f564b]"
              }`}
            >
              {item.label} {item.value}
            </Link>
          ))}
          <Link href="?status=PENDING" className="rounded-full border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#5f564b]">오래된 순</Link>
          <Link href="?status=APPROVED" className="rounded-full border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#5f564b]">후속 연결</Link>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
        <section className="overflow-hidden rounded-[24px] border border-[#e6dfd5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between border-b border-[#efe7da] px-5 py-4">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">FOCUS QUEUE</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">지금 볼 신청</h2>
            </div>
            <span className="text-xs text-[#8C7A5B]">상태별 우선 3개</span>
          </div>

          <div className="divide-y divide-[#f1eadf]">
            {focusRows.length > 0 ? (
              focusRows.map((item) => (
                <Link key={item.title} href={item.href} className="grid gap-3 px-5 py-4 transition hover:bg-[#fcfbf8] sm:grid-cols-[74px_minmax(0,1fr)_88px] sm:items-center">
                  <p className="text-[11px] tracking-[0.18em] text-[#8C7A5B]">{item.lane}</p>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                    <p className="mt-1 text-sm text-[#5f564b]">{item.desc}</p>
                  </div>
                  <p className="text-xs font-medium text-[#8C6A2E] sm:text-right">{item.cta}</p>
                </Link>
              ))
            ) : (
              <div className="px-5 py-8 text-sm text-[#5f564b]">지금 바로 처리할 신청은 없어.</div>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-[24px] border border-[#e6dfd5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between border-b border-[#efe7da] px-5 py-4">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">APPLICATION LIST</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">신청 목록</h2>
            </div>
            <span className="text-xs text-[#8C7A5B]">{applications.length}건 표시</span>
          </div>

          {applications.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-base font-semibold text-[#111111]">지금 보이는 신청이 없어</p>
              <p className="mt-2 text-sm text-[#5f564b]">다른 상태 필터를 열거나 새 신청이 들어오면 여기서 바로 관리할 수 있어.</p>
              <div className="mt-4">
                <Link href="?status=ALL" className="rounded-[14px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">전체 신청 보기</Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#f1eadf]">
              {applications.map((app) => {
                const meta = getStatusMeta(app.status);

                return (
                  <Link
                    key={app.id}
                    href={app.status === "PENDING" ? "?status=PENDING" : app.status === "IN_REVIEW" ? "?status=IN_REVIEW" : "?status=APPROVED"}
                    className="grid gap-3 px-5 py-4 transition hover:bg-[#fcfbf8] sm:grid-cols-[62px_minmax(0,1.2fr)_110px_130px_92px] sm:items-center"
                  >
                    <p className="text-[11px] tracking-[0.18em] text-[#8C7A5B]">{meta.lane}</p>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#111111]">{app.applicantName}</p>
                      <p className="mt-1 text-sm text-[#5f564b]">{app.form.title}</p>
                    </div>
                    <div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] ${meta.tone}`}>{meta.label}</span>
                    </div>
                    <p className="text-sm text-[#5f564b]">{meta.nextStep}</p>
                    <p className="text-xs text-[#8C7A5B] sm:text-right">{formatDate(app.createdAt)}</p>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
