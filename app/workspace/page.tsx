import Link from "next/link";

const stats = [
  { label: "people", value: "128", delta: "+12 this week" },
  { label: "pending", value: "6", delta: "2 due today" },
  { label: "broadcasts", value: "4", delta: "1 scheduled" },
  { label: "content", value: "8", delta: "3 in review" },
];

const onboardingSteps = [
  { step: "step 1", title: "워크스페이스 기본 정보 정리", action: "시작", muted: false },
  { step: "step 2", title: "사람 상태 체계 만들기", action: "설정", muted: false },
  { step: "step 3", title: "팀원 초대", action: "초대", muted: false },
  { step: "step 4", title: "사람 연락처 추가", action: "추가", muted: true },
];

const feedItems = [
  { title: "온보딩에서 자동 연락처 수집", body: "새가족 등록 흐름에 연락처 수집 단계를 추가해 사람 기록을 더 빠르게 쌓을 수 있습니다.", cta: "워크플로우 보기", meta: "5분 전" },
  { title: "SOOM+ 콘텐츠 스튜디오 미리 보기", body: "설교를 쇼츠, 안내 콘텐츠, 행사 페이지 흐름으로 연결하는 기능을 준비하고 있습니다.", cta: "자세히 보기", meta: "오늘" },
  { title: "그룹별 공지 발송 준비", body: "부서·사역팀별로 다른 공지를 보내는 흐름을 곧 연결할 수 있도록 구조를 정리하고 있습니다.", cta: "공지 보기", meta: "이번 주" },
];

const quickLinks = [
  { title: "문의함 보기", desc: "들어온 문의와 요청 확인", href: "/contact" },
  { title: "공지 보내기", desc: "주요 공지 초안/예약", href: "/workspace/notices" },
  { title: "사람 상태 보기", desc: "새가족·후속관리 흐름", href: "/workspace/people" },
  { title: "그룹 관리", desc: "팀/부서 구조 준비", href: "/workspace/people" },
  { title: "콘텐츠 요청 보기", desc: "쇼츠·영상·페이지 진행", href: "/workspace/content" },
  { title: "블로그 보기", desc: "운영과 AI 글 아카이브", href: "/ai-guides" },
];

const supportLinks = [
  { title: "블로그", desc: "운영과 AI 관련 글을 계속 쌓습니다.", href: "/ai-guides" },
  { title: "도움말 센터", desc: "기능 설명과 사용 흐름을 정리합니다.", href: "/workspace/settings" },
  { title: "문의하기", desc: "직접 도움을 받고 싶다면 바로 연결하세요.", href: "/contact" },
];

const tasks = [
  { title: "새가족 후속관리 배정", owner: "김선용", priority: "높음", status: "진행중" },
  { title: "수련회 신청 페이지 수정", owner: "최재성", priority: "중간", status: "검토" },
  { title: "주보 공지 문구 정리", owner: "사무국", priority: "중간", status: "대기" },
];

export default function WorkspacePage() {
  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[2.15rem] font-semibold tracking-[-0.05em] text-[#111111] sm:text-[2.5rem]">돌아오셨네요, 선용</h1>
          <p className="mt-2 text-sm text-[#6b7280]">오늘 처리해야 할 운영 흐름과 진행 상태를 한 번에 봅니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-[10px] border border-[#E7E0D4] bg-white px-3 py-2 text-xs text-[#8C7A5B]">무료 플랜</span>
          <button type="button" className="rounded-[10px] bg-[#0F172A] px-4 py-2 text-sm font-medium text-white">팀 관리</button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr_0.65fr]">
        <section className="rounded-[22px] border border-[#e6e7ea] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9aa0a6]">GET STARTED WITH MESSAGING</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">메시징 시작하기</h2>
            </div>
            <span className="text-xs text-[#8C7A5B]">0% 완료</span>
          </div>
          <div className="mt-5 grid gap-3">
            {onboardingSteps.map((item) => (
              <div key={item.title} className="rounded-[16px] border border-[#eceef1] bg-[#fafafa] px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#9aa0a6]">{item.step}</p>
                    <p className="mt-1 text-sm font-medium text-[#111111]">{item.title}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="rounded-[10px] bg-[#0F172A] px-4 py-2 text-xs font-medium text-white">{item.action}</button>
                    {item.muted ? <button type="button" className="rounded-[10px] border border-[#E7E0D4] bg-white px-3 py-2 text-xs text-[#6b7280]">건너뛰기</button> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[22px] border border-[#e6e7ea] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-2">
            <button type="button" className="rounded-[10px] bg-[#f3f4f6] px-3 py-2 text-xs font-medium text-[#111111]">피드</button>
            <button type="button" className="rounded-[10px] px-3 py-2 text-xs text-[#9aa0a6]">알림</button>
          </div>
          <div className="mt-4 grid gap-3">
            {feedItems.map((item) => (
              <div key={item.title} className="rounded-[16px] border border-[#eceef1] bg-[#fafafa] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F172A] text-xs font-semibold text-white">so</div>
                    <div>
                      <p className="text-sm font-medium text-[#111111]">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[#6b7280]">{item.body}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#9aa0a6]">{item.meta}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <button type="button" className="rounded-[10px] border border-[#e5e7eb] bg-white px-3 py-2 text-xs font-medium text-[#111111]">{item.cta}</button>
                  <button type="button" className="text-[11px] text-[#8C7A5B]">자세히</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,#D8BD86_0%,#A67C36_100%)] p-5 text-white shadow-[0_12px_32px_rgba(140,106,46,0.18)]">
          <p className="text-xs tracking-[0.16em] text-white/76">SOOM+</p>
          <h2 className="mt-16 text-[1.85rem] font-semibold leading-[1.04] tracking-[-0.05em]">콘텐츠 스튜디오
            <br />미리 보기</h2>
          <p className="mt-3 max-w-[16rem] text-sm leading-6 text-white/82">설교를 쇼츠, 안내 콘텐츠, 행사 페이지 흐름으로 연결하세요.</p>
          <button type="button" className="mt-5 rounded-[12px] bg-[#0F172A] px-4 py-3 text-sm font-medium text-white">자세히 보기</button>
        </section>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-[20px] border border-[#e6e7ea] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs uppercase tracking-[0.16em] text-[#9aa0a6]">{item.label}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-2xl font-semibold text-[#111111]">{item.value}</p>
              <span className="text-xs text-[#6b7280]">{item.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr]">
        <section className="rounded-[22px] border border-[#e6e7ea] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#111111]">빠른 이동</h2>
            <span className="text-xs text-[#8C7A5B]">핵심 액션</span>
          </div>
          <div className="mt-4 grid gap-3">
            {quickLinks.map((item) => (
              <Link key={item.title} href={item.href} className="rounded-[16px] border border-[#eceef1] bg-[#fafafa] p-4 transition hover:bg-white">
                <p className="text-sm font-medium text-[#111111]">{item.title}</p>
                <p className="mt-2 text-sm text-[#6b7280]">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[22px] border border-[#e6e7ea] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#111111]">진행 중인 작업</h2>
            <Link href="/workspace/tasks" className="text-xs text-[#6b7280] hover:text-[#111111]">보드 보기</Link>
          </div>
          <div className="mt-4 grid gap-3">
            {tasks.map((task) => (
              <div key={task.title} className="rounded-[16px] border border-[#eceef1] bg-[#fafafa] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#111111]">{task.title}</p>
                    <p className="mt-1 text-xs text-[#6b7280]">{task.owner}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] text-[#6b7280] border border-[#e5e7eb]">{task.priority}</span>
                </div>
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-[#9aa0a6]">{task.status}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[22px] border border-[#e6e7ea] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#111111]">지원과 리소스</h2>
            <span className="text-xs text-[#8C7A5B]">support</span>
          </div>
          <div className="mt-4 grid gap-3">
            {supportLinks.map((item) => (
              <Link key={item.title} href={item.href} className="rounded-[16px] border border-[#eceef1] bg-[#fafafa] p-4 transition hover:bg-white">
                <p className="text-sm font-medium text-[#111111]">{item.title}</p>
                <p className="mt-2 text-sm text-[#6b7280]">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
