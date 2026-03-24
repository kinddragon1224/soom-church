import Link from "next/link";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getWorkspaceDashboardData } from "@/lib/workspace-data";
import { formatDate } from "@/lib/date";

function getActivityLabel(action: string) {
  const labels: Record<string, string> = {
    WORKSPACE_ONBOARDED: "워크스페이스 시작",
    MEMBER_CREATED: "사람 등록",
    MEMBER_UPDATED: "사람 수정",
    APPLICATION_CREATED: "신청 접수",
    APPLICATION_UPDATED: "신청 처리",
    NOTICE_CREATED: "공지 작성",
    NOTICE_UPDATED: "공지 수정",
    DISTRICT_CREATED: "교구 생성",
    GROUP_CREATED: "목장 생성",
  };

  return labels[action] ?? action.replaceAll("_", " ").toLowerCase();
}

export default async function ChurchDashboardPage({ params }: { params: { churchSlug: string } }) {
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
  const data = await getWorkspaceDashboardData(church.id);
  const base = `/app/${church.slug}`;

  const overviewStats = [
    {
      label: "전체 사람",
      value: String(data.totalMembers),
      meta: `이번 달 +${data.newThisMonth}`,
      href: `${base}/members`,
      cta: "목록",
    },
    {
      label: "후속 연락",
      value: String(data.followUpMembers),
      meta: data.followUpMembers > 0 ? `오늘 우선 ${Math.min(data.followUpMembers, 3)}건` : "오늘 비어 있음",
      href: `${base}/members?filter=followup`,
      cta: "바로 보기",
    },
    {
      label: "미처리 신청",
      value: String(data.pendingApplications),
      meta: data.pendingApplications > 0 ? "바로 확인" : "새 신청 대기 없음",
      href: `${base}/applications?status=PENDING`,
      cta: "확인",
    },
    {
      label: "미배정",
      value: String(data.unassignedMembers),
      meta: data.unassignedMembers > 0 ? "연결 필요" : "배정 안정",
      href: `${base}/members?filter=unassigned`,
      cta: "정리",
    },
  ] as const;

  const queueRows = [
    {
      lane: "지금",
      title:
        data.followUpMembers > 0
          ? `${data.nextFollowUpMember?.name ?? "후속 대상"} 연락 먼저`
          : "후속 연락 비어 있음",
      desc:
        data.followUpMembers > 0
          ? `${data.nextFollowUpMember?.statusTag ?? "후속 필요"} · 남은 ${data.followUpMembers}건 중 먼저 처리`
          : "급한 후속 연락이 없어",
      metric: data.followUpMembers > 0 ? `${Math.min(data.followUpMembers, 3)}건 먼저` : "비어 있음",
      href: `${base}/members?filter=followup`,
      cta: "사람 보기",
    },
    {
      lane: "다음",
      title:
        data.pendingApplications > 0
          ? `${data.nextPendingApplication?.applicantName ?? "새 신청"} 확인`
          : "미처리 신청 비어 있음",
      desc:
        data.pendingApplications > 0
          ? `${formatDate(data.nextPendingApplication?.createdAt ?? new Date())} 접수 · 남은 ${data.pendingApplications}건 정리`
          : "지금은 대기 신청이 없어",
      metric: data.pendingApplications > 0 ? "확인 필요" : "안정",
      href: `${base}/applications?status=PENDING`,
      cta: "신청 보기",
    },
    {
      lane: "정리",
      title:
        data.unassignedMembers > 0
          ? `${data.nextUnassignedMember?.name ?? "미배정 인원"} 배정 연결`
          : "미배정 인원 비어 있음",
      desc:
        data.unassignedMembers > 0
          ? `${data.nextUnassignedMember?.statusTag ?? "배정 필요"} · 남은 ${data.unassignedMembers}명 연결`
          : "배정 빠진 인원이 없어",
      metric: data.unassignedMembers > 0 ? "연결 필요" : "완료",
      href: `${base}/members?filter=unassigned`,
      cta: "배정 보기",
    },
  ] as const;

  const moduleRows = [
    { title: "사람", value: `${data.totalMembers}명`, meta: `후속 ${data.followUpMembers} · 미배정 ${data.unassignedMembers}`, href: `${base}/members`, cta: "열기" },
    { title: "신청", value: `${data.pendingApplications}건`, meta: data.recentApplications[0] ? `${data.recentApplications[0].applicantName} · ${formatDate(data.recentApplications[0].createdAt)}` : "새 신청이 들어오면 여기에 표시", href: `${base}/applications`, cta: "열기" },
    { title: "공지", value: `${data.recentNotices.length}개`, meta: data.recentNotices[0] ? `${data.recentNotices[0].pinned ? "상단고정" : "일반"} · ${data.recentNotices[0].title}` : "최근 공지가 아직 없음", href: `${base}/notices`, cta: "열기" },
    { title: "설정", value: "기본값", meta: "역할, 초대, 기본 흐름 정리", href: `${base}/settings`, cta: "열기" },
  ] as const;

  const recentRows = [
    {
      section: "최근 신청",
      title: data.recentApplications[0]?.applicantName ?? "아직 신청이 없어",
      meta: data.recentApplications[0]
        ? `${data.recentApplications[0].status} · ${formatDate(data.recentApplications[0].createdAt)}`
        : "새 신청이 들어오면 여기서 바로 확인",
      href: `${base}/applications`,
      cta: "전체 보기",
    },
    {
      section: "최근 공지",
      title: data.recentNotices[0]?.title ?? "아직 공지가 없어",
      meta: data.recentNotices[0]
        ? `${data.recentNotices[0].pinned ? "상단고정" : "일반"} · ${formatDate(data.recentNotices[0].createdAt)}`
        : "새 공지를 만들면 여기서 바로 확인",
      href: `${base}/notices`,
      cta: "전체 보기",
    },
    {
      section: "최근 등록",
      title: data.recentMembers[0]?.name ?? "아직 등록 인원이 없어",
      meta: data.recentMembers[0]
        ? `${data.recentMembers[0].statusTag} · ${formatDate(data.recentMembers[0].registeredAt)}`
        : "새 사람을 등록하면 여기서 바로 확인",
      href: `${base}/members`,
      cta: "전체 보기",
    },
  ] as const;

  const activityRows = data.recentLogs.map((log) => ({
    id: log.id,
    title: getActivityLabel(log.action),
    meta: `${log.targetType} · ${formatDate(log.createdAt)}`,
  }));

  const todayLine =
    data.followUpMembers > 0
      ? `후속 연락 ${data.followUpMembers}건부터 정리하면 돼.`
      : data.pendingApplications > 0
        ? `새 신청 ${data.pendingApplications}건 먼저 확인하면 돼.`
        : data.unassignedMembers > 0
          ? `미배정 ${data.unassignedMembers}명 연결만 마무리하면 돼.`
          : "오늘 급한 운영 항목은 비어 있어.";

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="overflow-hidden rounded-[30px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_58%,#243252_100%)] text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
        <div className="grid gap-px bg-white/10 xl:grid-cols-[minmax(0,1.2fr)_420px]">
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] tracking-[0.2em] text-white/46">WORKSPACE HOME</p>
              <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] text-white/70">운영 모드</span>
            </div>
            <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[2.8rem]">
              오늘 처리할 흐름만
              <br />
              바로 정리한다
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/66">{todayLine}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-[18px] border border-white/10 bg-white/8 px-4 py-3">
                <p className="text-[11px] tracking-[0.16em] text-white/42">WORKSPACE</p>
                <p className="mt-2 text-sm font-semibold text-white">{church.name}</p>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/8 px-4 py-3">
                <p className="text-[11px] tracking-[0.16em] text-white/42">PLAN</p>
                <p className="mt-2 text-sm font-semibold text-[#f1dfb2]">무료 플랜</p>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/8 px-4 py-3">
                <p className="text-[11px] tracking-[0.16em] text-white/42">QUICK OPEN</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <Link href={`${base}/members`} className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-white/82">사람</Link>
                  <Link href={`${base}/applications`} className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-white/82">신청</Link>
                  <Link href={`${base}/notices`} className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-white/82">공지</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-white/10">
            <div className="bg-white/6 px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] tracking-[0.18em] text-white/46">TODAY BOARD</p>
                  <h2 className="mt-2 text-lg font-semibold text-white">지금 바로 볼 항목</h2>
                </div>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] text-white/72">우선 2개</span>
              </div>
            </div>

            <div className="divide-y divide-white/10 bg-white/4">
              {queueRows.slice(0, 2).map((item) => (
                <Link key={item.title} href={item.href} className="grid gap-2 px-5 py-4 transition hover:bg-white/6 sm:grid-cols-[58px_minmax(0,1fr)_84px] sm:items-center sm:px-6">
                  <p className="text-[11px] tracking-[0.18em] text-white/46">{item.lane}</p>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-white/64">{item.desc}</p>
                  </div>
                  <p className="text-xs font-medium text-[#f1dfb2] sm:text-right">{item.cta}</p>
                </Link>
              ))}
            </div>

            <div className="bg-white/6 px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] tracking-[0.18em] text-white/46">LAST CHANGE</p>
                  <p className="mt-2 text-sm font-semibold text-white">{activityRows[0]?.title ?? "아직 최근 활동이 없어"}</p>
                </div>
                <p className="text-xs text-white/60">{activityRows[0]?.meta ?? "기록 대기"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-[#e6dfd5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between border-b border-[#efe7da] px-5 py-4">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">STATUS RAIL</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">오늘 상태</h2>
          </div>
          <span className="text-xs text-[#8C7A5B]">한 줄 확인</span>
        </div>

        <div className="divide-y divide-[#f1eadf]">
          {overviewStats.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="grid gap-3 px-5 py-4 transition hover:bg-[#fcfbf8] sm:grid-cols-[96px_92px_minmax(0,1fr)_72px] sm:items-center"
            >
              <p className="text-[11px] tracking-[0.16em] text-[#8C7A5B]">{item.label}</p>
              <p className="text-[1.7rem] font-semibold tracking-[-0.05em] text-[#111111]">{item.value}</p>
              <p className="text-sm text-[#5f564b]">{item.meta}</p>
              <p className="text-xs font-medium text-[#8C6A2E] sm:text-right">{item.cta}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <section className="overflow-hidden rounded-[24px] border border-[#e6dfd5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between border-b border-[#efe7da] px-5 py-4">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">FOCUS QUEUE</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">지금 처리할 항목</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-[#fff7e8] px-3 py-1 text-[11px] text-[#8C6A2E]">우선순위 3개</span>
          </div>

          <div className="divide-y divide-[#f1eadf]">
            {queueRows.map((item) => (
              <Link key={item.title} href={item.href} className="grid gap-3 px-5 py-4 transition hover:bg-[#fcfbf8] sm:grid-cols-[88px_minmax(0,1fr)_120px_88px] sm:items-center">
                <p className="text-[11px] tracking-[0.18em] text-[#8C7A5B]">{item.lane}</p>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                  <p className="mt-1 text-sm text-[#5f564b]">{item.desc}</p>
                </div>
                <p className="text-xs text-[#8C7A5B] sm:text-right">{item.metric}</p>
                <p className="text-xs font-medium text-[#8C6A2E] sm:text-right">{item.cta}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-4">
          <section className="overflow-hidden rounded-[24px] border border-[#e6dfd5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between border-b border-[#efe7da] px-5 py-4">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">MODULES</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">핵심 영역</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">4 modules</span>
            </div>

            <div className="divide-y divide-[#f1eadf]">
              {moduleRows.map((item) => (
                <Link key={item.title} href={item.href} className="grid gap-3 px-5 py-4 transition hover:bg-[#fcfbf8] sm:grid-cols-[88px_88px_minmax(0,1fr)_48px] sm:items-center">
                  <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                  <p className="text-sm font-semibold tracking-[-0.02em] text-[#111111]">{item.value}</p>
                  <p className="text-sm text-[#5f564b]">{item.meta}</p>
                  <p className="text-xs font-medium text-[#8C6A2E] sm:text-right">{item.cta}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-[24px] border border-[#e6dfd5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between border-b border-[#efe7da] px-5 py-4">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">RECENT</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">최근 흐름</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">바로가기 중심</span>
            </div>

            <div className="divide-y divide-[#f1eadf]">
              {recentRows.map((item) => (
                <Link key={item.section} href={item.href} className="grid gap-3 px-5 py-4 transition hover:bg-[#fcfbf8] sm:grid-cols-[88px_minmax(0,1fr)_72px] sm:items-center">
                  <p className="text-[11px] tracking-[0.16em] text-[#8C7A5B]">{item.section}</p>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                    <p className="mt-1 text-sm text-[#5f564b]">{item.meta}</p>
                  </div>
                  <p className="text-xs font-medium text-[#8C6A2E] sm:text-right">{item.cta}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-[24px] border border-[#e6dfd5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between border-b border-[#efe7da] px-5 py-4">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">ACTIVITY</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">최근 활동</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">운영 로그 5개</span>
            </div>

            <div className="divide-y divide-[#f1eadf]">
              {activityRows.length > 0 ? (
                activityRows.map((item) => (
                  <div key={item.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_140px] sm:items-center">
                    <p className="text-sm font-medium text-[#111111]">{item.title}</p>
                    <p className="text-xs text-[#8C7A5B] sm:text-right">{item.meta}</p>
                  </div>
                ))
              ) : (
                <div className="px-5 py-4 text-sm text-[#5f564b]">최근 활동이 아직 없어.</div>
              )}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
