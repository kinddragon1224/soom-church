import Link from "next/link";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getWorkspaceDashboardData } from "@/lib/workspace-data";
import { formatDate } from "@/lib/date";

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
    { label: "등록 인원", value: String(data.totalMembers), delta: `+${data.newThisMonth} 이번 달`, tone: "slate" },
    { label: "후속관리 필요", value: String(data.followUpMembers), delta: `오늘 ${Math.min(data.followUpMembers, 3)}건`, tone: "amber" },
    { label: "미처리 신청", value: String(data.pendingApplications), delta: "바로 확인 필요", tone: "slate" },
    { label: "미배정 인원", value: String(data.unassignedMembers), delta: "교구 연결 필요", tone: "slate" },
  ] as const;

  const commandCenter = [
    {
      label: "가장 먼저",
      title: `후속 연락 ${data.followUpMembers}건`,
      desc: "먼저 연락할 사람부터 정리합니다.",
      href: `${base}/members?filter=followup`,
    },
    {
      label: "지금 확인",
      title: `미처리 신청 ${data.pendingApplications}건`,
      desc: "미처리 신청을 바로 정리합니다.",
      href: `${base}/applications?status=PENDING`,
    },
    {
      label: "연결 필요",
      title: `미배정 인원 ${data.unassignedMembers}명`,
      desc: "배정이 비어 있는 사람을 연결합니다.",
      href: `${base}/members?filter=unassigned`,
    },
  ] as const;

  const inboxItems = [
    {
      title: `후속관리 교인 ${data.followUpMembers}명`,
      desc: "지금 먼저 연락해야 하는 사람입니다.",
      meta: "사람",
      priority: "오늘",
      href: `${base}/members?filter=followup`,
    },
    {
      title: `미처리 신청 ${data.pendingApplications}건`,
      desc: "지금 상태를 바꿔야 하는 신청입니다.",
      meta: "신청",
      priority: "지금",
      href: `${base}/applications?status=PENDING`,
    },
    {
      title: `최근 공지 ${data.recentNotices.length}건`,
      desc: "중요 공지와 고정 상태를 봅니다.",
      meta: "공지",
      priority: "확인",
      href: `${base}/notices`,
    },
  ] as const;

  const productAreas = [
    {
      title: "사람 흐름",
      desc: "교인과 상태, 후속관리 흐름을 실제 운영 기준으로 정리합니다.",
      href: `${base}/members`,
      cta: "사람 보러가기",
      health: `후속 ${data.followUpMembers}건`,
    },
    {
      title: "신청 흐름",
      desc: "새가족, 신청, 접수 이후 처리 상태를 한곳에서 봅니다.",
      href: `${base}/applications`,
      cta: "신청 보러가기",
      health: `대기 ${data.pendingApplications}건`,
    },
    {
      title: "공지 흐름",
      desc: "공지와 전달 흐름을 운영 리듬에 맞게 관리합니다.",
      href: `${base}/notices`,
      cta: "공지 보러가기",
      health: `최근 ${data.recentNotices.length}건`,
    },
    {
      title: "설정",
      desc: "워크스페이스 기본값과 운영 기준을 정리합니다.",
      href: `${base}/settings`,
      cta: "설정 보러가기",
      health: "기본값 점검",
    },
  ] as const;

  const onboardingSteps = [
    { step: 1, title: "기본 워크스페이스 확인", desc: "교회명, 역할, 기본 운영 기준을 먼저 점검해요.", href: `${base}/settings`, cta: "설정 열기" },
    { step: 2, title: "팀원 초대 준비", desc: "함께 운영할 팀원과 역할 구조를 정리해요.", href: `${base}/settings`, cta: "구성 보기" },
    { step: 3, title: "사람 데이터 정리", desc: "후속관리와 미배정 인원부터 먼저 정리해요.", href: `${base}/members`, cta: "사람 열기" },
    { step: 4, title: "공지 흐름 연결", desc: "주간 공지와 전달 리듬을 한곳에 모아요.", href: `${base}/notices`, cta: "공지 열기" },
  ] as const;

  const feedItems = [
    {
      title: "가입 온보딩이 연결됐어요",
      body: "가입과 동시에 워크스페이스를 만들 수 있어요.",
      cta: "회원가입 보기",
      href: "/signup",
      time: "방금 반영",
    },
    {
      title: "후속관리 흐름을 먼저 정리해보세요",
      body: `후속관리 ${data.followUpMembers}명 · 미배정 ${data.unassignedMembers}명`,
      cta: "사람 보기",
      href: `${base}/members?filter=followup`,
      time: "운영 제안",
    },
    {
      title: "공지와 신청 흐름을 함께 보세요",
      body: `미처리 신청 ${data.pendingApplications}건 · 최근 공지 ${data.recentNotices.length}건`,
      cta: "신청 보기",
      href: `${base}/applications?status=PENDING`,
      time: "실사용 개선중",
    },
  ] as const;

  const operatingSignals = [
    { label: "follow-up", title: "후속관리 상태", value: `${data.followUpMembers}명`, note: "먼저 연락해야 할 흐름" },
    { label: "applications", title: "신청 처리", value: `${data.pendingApplications}건`, note: "미처리 신청 현황" },
    { label: "members", title: "미배정 인원", value: `${data.unassignedMembers}명`, note: "교구·목장 연결 필요" },
    { label: "notices", title: "최근 공지", value: `${data.recentNotices.length}건`, note: "최신 공지와 상단고정" },
  ] as const;

  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.22fr_0.78fr]">
        <div className="overflow-hidden rounded-[32px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] tracking-[0.2em] text-white/46">CHURCH OPERATIONS HUB</p>
                <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] text-white/70">실사용 워크스페이스</span>
              </div>
              <h1 className="mt-3 text-[2.25rem] font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-[3rem]">
                오늘 처리해야 할 운영 흐름을
                <br />
                한 화면에서 정리합니다
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                오늘 처리할 흐름과 다음 액션만 먼저 보여주는 홈입니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[250px] lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">{church.name}</span>
              <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/12 px-3 py-1.5 text-xs text-[#f1dfb2]">무료 플랜</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">실제 운영 모드</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 xl:grid-cols-[1fr_240px]">
            <div className="rounded-[24px] border border-white/10 bg-white/8 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] tracking-[0.18em] text-white/42">TODAY'S FOCUS</p>
                  <p className="mt-2 text-sm text-white/68">지금 볼 일 3개</p>
                </div>
                <span className="rounded-full border border-white/10 bg-[#0f1a30] px-3 py-1 text-[11px] text-white/70">운영 체크</span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-white/82 sm:grid-cols-3">
                {commandCenter.map((item) => (
                  <div key={item.title} className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">{item.title}</div>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              <Link href={`${base}/members`} className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-white px-5 text-sm font-semibold text-[#09111f]">
                사람 흐름 열기
              </Link>
              <Link href={`${base}/applications`} className="inline-flex min-h-11 items-center justify-center rounded-[14px] border border-white/14 bg-white/5 px-5 text-sm font-medium text-white">
                신청 보기
              </Link>
              <Link href={`${base}/notices`} className="inline-flex min-h-11 items-center justify-center rounded-[14px] border border-white/14 bg-white/5 px-5 text-sm font-medium text-white">
                공지 보기
              </Link>
            </div>
          </div>
        </div>

        <section className="rounded-[30px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">SETUP</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">바로 할 일</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">실행 중심</span>
          </div>
          <div className="mt-4 grid gap-3">
            {commandCenter.map((item) => (
              <Link key={item.title} href={item.href} className="rounded-[18px] border border-[#ece6dc] bg-white p-4 transition hover:bg-[#fcfbf8]">
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-[#111111]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((item) => (
          <div key={item.label} className="rounded-[22px] border border-[#e6dfd5] bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,0.05)]">
            <p className="text-xs tracking-[0.16em] text-[#8C7A5B]">{item.label}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-[1.9rem] font-semibold tracking-[-0.04em] text-[#111111]">{item.value}</p>
              <span className={`rounded-full px-2.5 py-1 text-[11px] ${item.tone === "amber" ? "bg-[#fff4df] text-[#8C6A2E]" : "bg-[#f3f4f6] text-[#5f564b]"}`}>{item.delta}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-3 xl:grid-cols-4">
        {operatingSignals.map((item) => (
          <div key={item.title} className="rounded-[22px] border border-[#e6dfd5] bg-[#fcfbf8] p-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9a8b7a]">{item.label}</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-lg font-semibold text-[#111111]">{item.title}</p>
              <span className="rounded-full border border-[#eadfcd] bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.value}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.note}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">GET STARTED</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">시작 단계</h2>
              </div>
              <span className="rounded-full border border-[#eadfcd] bg-[#fff7e8] px-3 py-1 text-[11px] text-[#8C6A2E]">0% complete</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#efe7da]">
              <div className="h-full w-[18%] rounded-full bg-[#C8A96B]" />
            </div>
            <div className="mt-4 grid gap-3">
              {onboardingSteps.map((item) => (
                <div key={item.step} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] tracking-[0.16em] text-[#8C7A5B]">STEP {item.step}</p>
                      <p className="mt-2 text-sm font-semibold text-[#111111]">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.desc}</p>
                    </div>
                    <Link href={item.href} className="rounded-[12px] border border-[#e1d7c7] bg-white px-3 py-2 text-xs font-medium text-[#111111]">{item.cta}</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">FEED</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">피드</h2>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-[#0F172A] px-3 py-1 text-white">Feed</span>
                <span className="rounded-full border border-[#e6dfd5] bg-white px-3 py-1 text-[#8C7A5B]">Notifications</span>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {feedItems.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.body}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <Link href={item.href} className="text-xs font-medium text-[#8C6A2E]">{item.cta}</Link>
                    <span className="text-[11px] text-[#9a8b7a]">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">PRIORITY INBOX</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">우선 확인</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">운영 허브</span>
            </div>
            <div className="mt-4 grid gap-3">
              {inboxItems.map((item) => (
                <Link key={item.title} href={item.href} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 transition hover:bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{item.meta}</span>
                        <span className="text-[11px] text-[#9a8b7a]">{item.priority}</span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[#111111]">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.desc}</p>
                    </div>
                    <span className="rounded-[12px] border border-[#e1d7c7] bg-white px-3 py-2 text-xs font-medium text-[#111111]">보기</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">RECENT APPLICATIONS</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">신청</h2>
              </div>
              <Link href={`${base}/applications`} className="text-xs text-[#8C7A5B] hover:text-[#121212]">전체 보기</Link>
            </div>
            <div className="mt-4 grid gap-3">
              {data.recentApplications.map((item) => (
                <div key={item.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <p className="text-sm font-semibold text-[#111111]">{item.applicantName}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">상태: {item.status}</p>
                  <p className="mt-2 text-[11px] text-[#9a8b7a]">{formatDate(item.createdAt)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">RECENT NOTICES</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">공지</h2>
              </div>
              <Link href={`${base}/notices`} className="text-xs text-[#8C7A5B] hover:text-[#121212]">전체 보기</Link>
            </div>
            <div className="mt-4 grid gap-3">
              {data.recentNotices.map((item) => (
                <div key={item.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                  <p className="mt-2 text-[11px] text-[#9a8b7a]">{item.pinned ? "상단고정" : "일반"} · {formatDate(item.createdAt)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">PRODUCT AREAS</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">영역</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">핵심 모듈</span>
            </div>
            <div className="mt-4 grid gap-3">
              {productAreas.map((item) => (
                <Link key={item.title} href={item.href} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 transition hover:bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{item.health}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.desc}</p>
                  <p className="mt-3 text-xs font-medium text-[#8C6A2E]">{item.cta}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
