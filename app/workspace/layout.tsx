"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navSections = [
  {
    title: "workspace",
    items: [
      { href: "/workspace", label: "홈", hint: "운영 요약" },
      { href: "/workspace/people", label: "사람", hint: "후속관리" },
      { href: "/workspace/notices", label: "커뮤니케이션", hint: "공지 흐름" },
      { href: "/workspace/tasks", label: "작업 흐름", hint: "팀 마감" },
      { href: "/workspace/content", label: "콘텐츠 스튜디오", hint: "제작 파이프라인" },
    ],
  },
  {
    title: "system",
    items: [{ href: "/workspace/settings", label: "설정", hint: "도입 구조" }],
  },
];

const utilityLinks = [
  { href: "/pricing", label: "상품 구조" },
  { href: "/contact", label: "도입 문의" },
  { href: "/ai-guides", label: "블로그" },
];

const pulseItems = [
  { label: "오늘 후속 연락", value: "3건", tone: "gold" },
  { label: "예약 공지", value: "4건", tone: "slate" },
  { label: "콘텐츠 검토", value: "2건", tone: "slate" },
];

const activeRoute = {
  "/workspace": { title: "운영 홈", desc: "지금 처리해야 할 흐름을 한 화면에서 정리합니다." },
  "/workspace/people": { title: "사람 흐름", desc: "새가족부터 정착과 봉사 연결까지 상태를 관리합니다." },
  "/workspace/notices": { title: "커뮤니케이션", desc: "대상별 공지와 예약 발송 흐름을 맞춥니다." },
  "/workspace/tasks": { title: "작업 흐름", desc: "사역팀이 마감까지 놓치지 않도록 보드를 공유합니다." },
  "/workspace/content": { title: "콘텐츠 스튜디오", desc: "설교·행사 요청을 결과물까지 한 파이프라인으로 연결합니다." },
  "/workspace/settings": { title: "워크스페이스 설정", desc: "도입 상태와 팀 기본값을 정리합니다." },
} as const;

const moduleCards = [
  { href: "/workspace/people", label: "사람", value: "후속관리 9건", note: "48시간 안에 연락이 필요한 흐름", tone: "slate" },
  { href: "/workspace/notices", label: "공지", value: "예약 4건", note: "수요일·주말 발송 점검 필요", tone: "gold" },
  { href: "/workspace/tasks", label: "작업", value: "오늘 마감 2건", note: "체크리스트와 검토가 연결된 상태", tone: "slate" },
  { href: "/workspace/content", label: "콘텐츠", value: "검토 1건", note: "썸네일 승인 후 바로 배포 가능", tone: "slate" },
] as const;

const workspaceControlStats = [
  { label: "team response", value: "2h 10m", note: "첫 연락 평균 응답 시간" },
  { label: "handoff health", value: "3 / 4", note: "사람→공지→콘텐츠 연결 상태" },
  { label: "active owners", value: "4명", note: "지금 흐름을 맡은 담당자" },
] as const;

const automationRail = [
  { label: "ready", title: "48시간 미응답 감지", note: "첫 연락이 늦어지면 담당자에게 다시 알려줍니다." },
  { label: "draft", title: "예약 공지 재확인", note: "발송 24시간 전에 링크·일정 변경 여부를 점검합니다." },
  { label: "review", title: "콘텐츠 승인 handoff", note: "검토 완료 시 공지 흐름으로 바로 넘길 준비 상태입니다." },
] as const;

const teamRhythm = [
  { role: "사무국", focus: "새가족 배정 정리", state: "오늘" },
  { role: "청년부 리더", focus: "수련회 안내 문구 확인", state: "수요일 전" },
  { role: "콘텐츠팀", focus: "부활절 영상 썸네일 확정", state: "승인 대기" },
] as const;

const nextActionMap = {
  "/workspace": [
    { label: "사람", title: "새가족 첫 연락 배정", note: "오늘 안에 담당자와 첫 연락 시점을 붙여야 합니다." },
    { label: "공지", title: "수련회 안내 예약 점검", note: "발송 채널과 문구를 마지막으로 확인합니다." },
    { label: "콘텐츠", title: "부활절 영상 승인", note: "썸네일과 자막 톤만 정리하면 바로 배포할 수 있습니다." },
  ],
  "/workspace/people": [
    { label: "오늘", title: "김은혜 첫 연락", note: "주일 첫 방문 이후 48시간 안에 연락을 시작해야 합니다." },
    { label: "정착", title: "정하늘 소그룹 연결", note: "첫 안내 이후 다음 관계 연결이 끊기지 않게 이어줍니다." },
    { label: "배정", title: "교구 미배정 2명 검토", note: "리더 회의 전에 담당 교구와 연결 여부를 확인합니다." },
  ],
  "/workspace/notices": [
    { label: "예약", title: "수련회 안내 수요일 발송", note: "신청 링크와 마감일이 최신 버전인지 다시 확인합니다." },
    { label: "리마인드", title: "봉사자 안내 오늘 발송", note: "예배 시간 변경이 반영됐는지 검토가 필요합니다." },
    { label: "초안", title: "청년부 모임 공지 문구 조정", note: "푸시 제목 길이와 톤을 채널에 맞게 압축합니다." },
  ],
  "/workspace/tasks": [
    { label: "마감", title: "새가족 후속 연락 완료", note: "오늘 처리 기준 작업부터 먼저 닫아야 합니다." },
    { label: "검토", title: "수련회 페이지 검수", note: "신청 버튼 문구와 마감 시점을 마지막으로 확인합니다." },
    { label: "현장", title: "부활절 체크리스트 정리", note: "역할 배정 누락 없이 오늘 마감선까지 끌어옵니다." },
  ],
  "/workspace/content": [
    { label: "쇼츠", title: "설교 클립 3건 편집", note: "자막 톤과 컷 길이를 같은 결로 맞춥니다." },
    { label: "랜딩", title: "수련회 페이지 시안 정리", note: "안내 문구와 신청 흐름을 한 화면으로 압축합니다." },
    { label: "배포", title: "부활절 영상 검토 완료", note: "썸네일 승인 후 공지 흐름과 같이 배포합니다." },
  ],
  "/workspace/settings": [
    { label: "기본값", title: "워크스페이스 이름·구조 점검", note: "교회명, 부서, 담당자 구조가 실제 운영과 맞는지 봅니다." },
    { label: "도입", title: "사람 상태 체계 정리", note: "새가족, 정착, 봉사연결 같은 기본 상태를 먼저 잡습니다." },
    { label: "확장", title: "공지·콘텐츠 연결 준비", note: "운영 루틴이 잡히면 다음 확장 포인트를 열 수 있습니다." },
  ],
} as const;

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const current = activeRoute[pathname as keyof typeof activeRoute] ?? activeRoute["/workspace"];
  const nextActions = nextActionMap[pathname as keyof typeof nextActionMap] ?? nextActionMap["/workspace"];

  return (
    <main className="min-h-screen bg-[#EDE6D8] text-[#121212] lg:h-dvh lg:min-h-0 lg:overflow-hidden">
      <div className="grid min-h-screen lg:h-full lg:min-h-0 lg:grid-cols-[296px_minmax(0,1fr)] lg:gap-3 lg:p-3">
        <aside className="border-b border-[#1b2740] bg-[#0F172A] px-4 py-5 text-white lg:h-full lg:min-h-0 lg:overflow-y-auto lg:rounded-[28px] lg:border lg:border-[#16233b] lg:shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
          <div className="lg:flex lg:min-h-full lg:flex-col lg:py-1">
            <div className="flex items-start justify-between gap-3 px-1">
              <div>
                <Link href="/workspace" className="font-display text-[1.6rem] font-semibold tracking-[-0.08em] text-white">
                  SOOM workspace
                </Link>
                <p className="mt-2 text-xs text-white/52">교회 운영과 실행을 한곳에서 정리하는 허브</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] tracking-[0.16em] text-white/50">DEMO</span>
            </div>

            <div className="mt-6 rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
              <p className="text-[11px] tracking-[0.18em] text-white/38">CURRENT WORKSPACE</p>
              <p className="mt-2 text-sm font-semibold text-white">대흥교회 청년부</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/58">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">무료 플랜</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">팀원 4명</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">월요일 운영 모드</span>
              </div>
              <div className="mt-4 rounded-[18px] border border-[#C8A96B]/20 bg-[#C8A96B]/10 px-3 py-3">
                <p className="text-[11px] tracking-[0.16em] text-[#E7D7B1]">WORKSPACE HEALTH</p>
                <p className="mt-2 text-sm font-medium text-white">기본 도입 단계 진행중</p>
                <p className="mt-2 text-xs leading-5 text-white/54">사람 상태 체계와 공지 흐름을 맞추면 운영 시작선이 정리됩니다.</p>
              </div>
              <div className="mt-4 grid gap-2">
                {pulseItems.map((item) => (
                  <div key={item.label} className="rounded-[16px] border border-white/8 bg-[#111c33] px-3 py-3">
                    <p className="text-[11px] text-white/40">{item.label}</p>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{item.value}</p>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] ${
                          item.tone === "gold" ? "bg-[#C8A96B]/18 text-[#E7D7B1]" : "bg-white/8 text-white/62"
                        }`}
                      >
                        live
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {navSections.map((section) => (
                <div key={section.title}>
                  <p className="px-2 text-[11px] uppercase tracking-[0.18em] text-white/28">{section.title}</p>
                  <div className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
                    {section.items.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`rounded-[16px] px-3 py-3 text-sm transition ${
                            active
                              ? "bg-[#C8A96B] text-[#121212] shadow-[0_10px_24px_rgba(200,169,107,0.25)]"
                              : "text-white/72 hover:bg-white/6 hover:text-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className={`font-medium ${active ? "font-semibold" : ""}`}>{item.label}</p>
                              <p className={`mt-1 text-[11px] ${active ? "text-[#3f3216]" : "text-white/36"}`}>{item.hint}</p>
                            </div>
                            {active ? <span className="text-[10px] uppercase tracking-[0.18em]">now</span> : null}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
              <p className="text-[11px] tracking-[0.18em] text-white/38">SHORTCUTS</p>
              <div className="mt-3 grid gap-2">
                {utilityLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-[14px] border border-white/8 bg-white/[0.03] px-3 py-2.5 text-sm text-white/74 transition hover:bg-white/8 hover:text-white">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 lg:mt-auto">
              <div className="rounded-[18px] border border-[#C8A96B]/20 bg-[#C8A96B]/10 p-4">
                <p className="text-xs tracking-[0.18em] text-[#E7D7B1]">UPGRADE</p>
                <p className="mt-2 text-sm font-medium text-white">무료로 시작하고, 운영이 자리 잡히면 확장하세요</p>
                <p className="mt-2 text-xs leading-5 text-white/54">사람 관리, 공지, 작업 흐름, 콘텐츠 요청까지 같은 구조로 이어집니다.</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 bg-[#F4F0E8] lg:h-full lg:min-h-0 lg:overflow-y-auto lg:rounded-[30px] lg:border lg:border-[#DDD1BE] lg:bg-[#F4F0E8] lg:shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="border-b border-[#E3D9C9] bg-[#FBF9F4] px-5 py-4 sm:px-7 lg:sticky lg:top-0 lg:z-20 lg:rounded-t-[30px] lg:backdrop-blur-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">SOOM WORKSPACE</p>
                  <h1 className="mt-2 text-[1.9rem] font-semibold tracking-[-0.05em] text-[#121212]">{current.title}</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F564B]">{current.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-[#8C7A5B]">
                  <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1">대흥교회 청년부</span>
                  <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1">무료 플랜</span>
                  <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1">팀원 4명</span>
                  <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1">월요일 운영 모드</span>
                </div>
              </div>
              <div className="flex flex-col items-stretch gap-3 lg:min-w-[420px] lg:items-end">
                <div className="flex flex-col gap-2 lg:w-full lg:max-w-[440px]">
                  <div className="flex items-center gap-2 rounded-[16px] border border-[#E7E0D4] bg-white px-3 py-3 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                    <span className="text-sm text-[#8C7A5B]">⌘K</span>
                    <span className="text-sm text-[#7B6F60]">사람, 공지, 작업, 콘텐츠를 검색하세요</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#8C7A5B]">
                    <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1.5">알림 3건</span>
                    <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1.5">자동화 준비 2건</span>
                    <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1.5">김선용 · owner</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href="/" className="inline-flex min-h-10 items-center justify-center rounded-[12px] border border-[#E7E0D4] bg-white px-4 text-sm font-medium text-[#121212]">
                    홈으로
                  </Link>
                  <Link href="/pricing" className="inline-flex min-h-10 items-center justify-center rounded-[12px] border border-[#E7E0D4] bg-white px-4 text-sm font-medium text-[#121212]">
                    상품 보기
                  </Link>
                  <Link href="/signup" className="inline-flex min-h-10 items-center justify-center rounded-[12px] bg-[#0F172A] px-4 text-sm font-semibold text-white">
                    무료로 시작하기
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 xl:grid-cols-4">
              {moduleCards.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-[20px] border p-4 transition ${
                      active
                        ? "border-[#C8A96B] bg-[#fff8ea] shadow-[0_12px_30px_rgba(200,169,107,0.16)]"
                        : "border-[#E7E0D4] bg-white hover:border-[#d8ccb8] hover:bg-[#fffdf8]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] tracking-[0.18em] text-[#8C7A5B]">{item.label}</p>
                        <p className="mt-2 text-sm font-semibold text-[#121212]">{item.value}</p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] ${
                          active
                            ? "bg-[#C8A96B] text-[#2f2513]"
                            : item.tone === "gold"
                              ? "bg-[#fff4df] text-[#8C6A2E]"
                              : "bg-[#f3f4f6] text-[#5f564b]"
                        }`}
                      >
                        {active ? "현재" : "live"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.note}</p>
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 rounded-[24px] border border-[#E7E0D4] bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)] sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[11px] tracking-[0.18em] text-[#8C7A5B]">NEXT ACTIONS</p>
                  <h2 className="mt-2 text-lg font-semibold text-[#121212]">이 화면에서 바로 이어질 실행 흐름</h2>
                </div>
                <p className="text-xs text-[#8C7A5B]">현재 페이지 기준 우선순위 3개</p>
              </div>
              <div className="mt-4 grid gap-3 xl:grid-cols-3">
                {nextActions.map((item) => (
                  <div key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-[#FCFBF8] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full border border-[#E7E0D4] bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.label}</span>
                      <span className="text-[11px] text-[#9A8B7A]">ready</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[#121212]">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-[24px] border border-[#E7E0D4] bg-[#fffaf0] p-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)] sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-[11px] tracking-[0.18em] text-[#8C7A5B]">WORKSPACE CONTROL</p>
                    <h2 className="mt-2 text-lg font-semibold text-[#121212]">도입과 운영 상태를 같이 보는 컨트롤 레이어</h2>
                  </div>
                  <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1 text-[11px] text-[#8C6A2E]">월요일 운영 모드</span>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  {workspaceControlStats.map((item) => (
                    <div key={item.label} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#8C7A5B]">{item.label}</p>
                      <div className="mt-3 flex items-end justify-between gap-3">
                        <p className="text-[1.6rem] font-semibold tracking-[-0.05em] text-[#121212]">{item.value}</p>
                        <span className="rounded-full bg-[#F6F1E5] px-2.5 py-1 text-[10px] text-[#8C6A2E]">live</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.note}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[24px] border border-[#E7E0D4] bg-white p-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)] sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-[11px] tracking-[0.18em] text-[#8C7A5B]">TEAM RHYTHM</p>
                    <h2 className="mt-2 text-lg font-semibold text-[#121212]">지금 누가 다음 공을 잡고 있는지</h2>
                  </div>
                  <p className="text-xs text-[#8C7A5B]">실행 담당</p>
                </div>
                <div className="mt-4 grid gap-3">
                  {teamRhythm.map((item) => (
                    <div key={item.role + item.focus} className="rounded-[18px] border border-[#ECE5D8] bg-[#FCFBF8] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[#121212]">{item.role}</p>
                        <span className="rounded-full border border-[#E7E0D4] bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.state}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.focus}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="min-w-0 p-5 sm:p-7">
            <div className="mb-6 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
              <section className="rounded-[24px] border border-[#E7E0D4] bg-white p-5 shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-[11px] tracking-[0.18em] text-[#8C7A5B]">AUTOMATION RAIL</p>
                    <h2 className="mt-2 text-lg font-semibold text-[#121212]">반복 운영을 자동화로 넘길 준비</h2>
                  </div>
                  <p className="text-xs text-[#8C7A5B]">사람 · 공지 · 콘텐츠 공통</p>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  {automationRail.map((item) => (
                    <div key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-[#FCFBF8] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-[#E7E0D4] bg-white px-2.5 py-1 text-[11px] uppercase text-[#8C6A2E]">{item.label}</span>
                        <span className="text-[11px] text-[#9A8B7A]">rule</span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[#121212]">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.note}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-5 text-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
                <p className="text-[11px] tracking-[0.18em] text-white/44">PRODUCT PROMISE</p>
                <h2 className="mt-3 text-[1.8rem] font-semibold leading-[1.02] tracking-[-0.05em]">
                  단순한 화면이 아니라
                  <br />
                  운영 구조가 보이는 데모
                </h2>
                <p className="mt-4 max-w-[28rem] text-sm leading-6 text-white/68">
                  SOOM workspace는 사람, 공지, 작업, 콘텐츠가 따로 노는 도구가 아니라 서로 handoff 되는 제품 구조를 보여주는 방향으로 정리하고 있습니다.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/74">
                  <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">운영 우선순위 중심</span>
                  <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">교회 문맥에 맞는 구조</span>
                  <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">무료 시작 + 실행 확장</span>
                </div>
              </section>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
