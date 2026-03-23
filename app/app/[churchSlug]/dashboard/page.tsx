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
    { label: "등록 인원", value: String(data.totalMembers), delta: `+${data.newThisMonth}`, tone: "slate" },
    { label: "후속 연락", value: String(data.followUpMembers), delta: `오늘 ${Math.min(data.followUpMembers, 3)}`, tone: "amber" },
    { label: "미처리 신청", value: String(data.pendingApplications), delta: "확인", tone: "slate" },
  ] as const;

  const focusItems = [
    {
      label: "먼저",
      title: `후속 연락 ${data.followUpMembers}건`,
      desc: "먼저 연락할 사람부터 처리",
      href: `${base}/members?filter=followup`,
      cta: "사람 보기",
    },
    {
      label: "지금",
      title: `미처리 신청 ${data.pendingApplications}건`,
      desc: "대기 신청 바로 정리",
      href: `${base}/applications?status=PENDING`,
      cta: "신청 보기",
    },
    {
      label: "다음",
      title: `미배정 인원 ${data.unassignedMembers}명`,
      desc: "연결 비어 있는 사람 확인",
      href: `${base}/members?filter=unassigned`,
      cta: "배정 보기",
    },
  ] as const;

  const getStartedItems = [
    { step: 1, title: "기본 정보 확인", href: `${base}/settings`, cta: "설정" },
    { step: 2, title: "팀원 구조 정리", href: `${base}/settings`, cta: "역할" },
    { step: 3, title: "사람 데이터 정리", href: `${base}/members`, cta: "사람" },
  ] as const;

  const recentItems = [
    {
      section: "신청",
      title: data.recentApplications[0]?.applicantName ?? "아직 신청이 없어",
      meta: data.recentApplications[0]
        ? `${data.recentApplications[0].status} · ${formatDate(data.recentApplications[0].createdAt)}`
        : "새 신청이 들어오면 여기에 보여줘",
      href: `${base}/applications`,
      cta: "전체 보기",
    },
    {
      section: "공지",
      title: data.recentNotices[0]?.title ?? "아직 공지가 없어",
      meta: data.recentNotices[0]
        ? `${data.recentNotices[0].pinned ? "상단고정" : "일반"} · ${formatDate(data.recentNotices[0].createdAt)}`
        : "새 공지를 만들면 여기에 보여줘",
      href: `${base}/notices`,
      cta: "전체 보기",
    },
    {
      section: "사람",
      title: `후속 ${data.followUpMembers}명 · 미배정 ${data.unassignedMembers}명`,
      meta: "사람 흐름에서 바로 정리 가능",
      href: `${base}/members`,
      cta: "열기",
    },
  ] as const;

  const productAreas = [
    { title: "사람", href: `${base}/members`, health: `후속 ${data.followUpMembers}` },
    { title: "신청", href: `${base}/applications`, health: `대기 ${data.pendingApplications}` },
    { title: "공지", href: `${base}/notices`, health: `최근 ${data.recentNotices.length}` },
    { title: "설정", href: `${base}/settings`, health: "기본값" },
  ] as const;

  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.24fr_0.76fr]">
        <div className="overflow-hidden rounded-[32px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] tracking-[0.2em] text-white/46">WORKSPACE HOME</p>
                <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] text-white/70">실사용 워크스페이스</span>
              </div>
              <h1 className="mt-3 text-[2.25rem] font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-[3rem]">
                오늘 필요한 흐름만
                <br />
                바로 본다
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/66">사람, 신청, 공지, 설정을 한 화면에서 바로 연다.</p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[250px] lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">{church.name}</span>
              <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/12 px-3 py-1.5 text-xs text-[#f1dfb2]">무료 플랜</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">운영 모드</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 xl:grid-cols-[1fr_220px]">
            <div className="grid gap-2 sm:grid-cols-3">
              {focusItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-[18px] border border-white/10 bg-white/8 p-4 transition hover:bg-white/12"
                >
                  <p className="text-[11px] tracking-[0.16em] text-white/42">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-xs text-white/62">{item.desc}</p>
                  <p className="mt-4 text-xs font-medium text-[#f1dfb2]">{item.cta}</p>
                </Link>
              ))}
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
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">GET STARTED</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">시작 순서</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">3 steps</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#efe7da]"><div className="h-full w-[32%] rounded-full bg-[#C8A96B]" /></div>
          <div className="mt-4 grid gap-2">
            {getStartedItems.map((item) => (
              <div key={item.step} className="flex items-center justify-between gap-3 rounded-[18px] border border-[#ece6dc] bg-white px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">STEP {item.step}</p>
                  <p className="mt-1 text-sm font-semibold text-[#111111]">{item.title}</p>
                </div>
                <Link href={item.href} className="rounded-[12px] border border-[#e1d7c7] bg-white px-3 py-2 text-xs font-medium text-[#111111]">{item.cta}</Link>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
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

      <section className="grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">FOCUS QUEUE</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">지금 처리할 항목</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-[#fff7e8] px-3 py-1 text-[11px] text-[#8C6A2E]">우선순위 3개</span>
          </div>
          <div className="mt-4 grid gap-3">
            {focusItems.map((item) => (
              <Link key={item.title} href={item.href} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 transition hover:bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] tracking-[0.16em] text-[#8C7A5B]">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-[#111111]">{item.title}</p>
                    <p className="mt-2 text-sm text-[#5f564b]">{item.desc}</p>
                  </div>
                  <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{item.cta}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">RECENT ITEMS</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">최근 항목</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">바로가기 중심</span>
            </div>
            <div className="mt-4 grid gap-3">
              {recentItems.map((item) => (
                <Link key={item.section} href={item.href} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 transition hover:bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] tracking-[0.16em] text-[#8C7A5B]">{item.section}</p>
                      <p className="mt-2 text-sm font-semibold text-[#111111]">{item.title}</p>
                      <p className="mt-2 text-sm text-[#5f564b]">{item.meta}</p>
                    </div>
                    <span className="text-xs font-medium text-[#8C6A2E]">{item.cta}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">AREAS</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">핵심 영역</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">4 modules</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {productAreas.map((item) => (
                <Link key={item.title} href={item.href} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 transition hover:bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{item.health}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
