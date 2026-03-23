import Link from "next/link";

const overviewStats = [
  { label: "등록 인원", value: "128", delta: "+12 이번 주", tone: "slate" },
  { label: "후속관리 필요", value: "9", delta: "오늘 3건", tone: "amber" },
  { label: "예약 공지", value: "4", delta: "이번 주 발송", tone: "slate" },
  { label: "완료율", value: "76%", delta: "이번 주 기준", tone: "slate" },
];

const setupItems = [
  { step: "01", title: "워크스페이스 기본 정보 정리", desc: "이름, 부서 구조, 담당자만 먼저 맞추면 됩니다.", action: "시작하기", done: true },
  { step: "02", title: "사람 상태 체계 만들기", desc: "새가족, 정착, 봉사연결 같은 상태를 먼저 정합니다.", action: "설정", done: false },
  { step: "03", title: "팀원 초대", desc: "사무국, 목회자, 콘텐츠 담당자를 초대해 함께 운영합니다.", action: "초대", done: false },
  { step: "04", title: "연락 흐름 연결", desc: "공지 발송과 후속 연락 흐름을 이어서 운영 준비를 마칩니다.", action: "준비중", done: false },
];

const quickActions = [
  { title: "새가족 후속 연락", desc: "48시간 안에 연락이 필요한 3명을 먼저 확인합니다.", href: "/workspace/people", cta: "사람 흐름 열기", urgency: "오늘" },
  { title: "수련회 안내 발송", desc: "예약 공지 1건이 이번 주 발송 대기 중입니다.", href: "/workspace/notices", cta: "공지 확인", urgency: "이번 주" },
  { title: "부활절 영상 검토", desc: "콘텐츠팀 검토 대기 1건을 오늘 안에 마무리합니다.", href: "/workspace/content", cta: "콘텐츠 보기", urgency: "검토" },
];

const weeklyRhythm = [
  { day: "월", title: "운영 정리", desc: "후속 연락, 담당 배정, 이번 주 우선순위를 정리합니다." },
  { day: "수", title: "공지 점검", desc: "주중 공지와 예약 발송 문구를 확정합니다." },
  { day: "금", title: "예배·행사 준비", desc: "주말 안내, 영상, 현장 체크리스트를 마감합니다." },
];

const inboxItems = [
  { title: "새가족 3명 후속 연락 필요", desc: "예배 방문 이후 48시간 안에 첫 연락 권장", meta: "사람", priority: "오늘" },
  { title: "수련회 공지 예약 확인", desc: "카카오톡/문자 이중 발송 전 최종 문구 점검", meta: "커뮤니케이션", priority: "이번 주" },
  { title: "부활절 홍보영상 검토", desc: "썸네일과 자막 톤만 결정하면 바로 배포 가능", meta: "콘텐츠", priority: "대기" },
];

const workflowLanes = [
  {
    title: "이번 주 우선순위",
    accent: "bg-[#fff7e8] border-[#efdfb8]",
    items: ["새가족 후속 연락 배정", "부활절 행사 체크리스트 정리", "수련회 안내 페이지 검수"],
  },
  {
    title: "운영 루틴",
    accent: "bg-white border-[#e8e3d7]",
    items: ["주보 공지 문구 업데이트", "유튜브 업로드 캘린더 정리", "다음 주 봉사자 리마인드"],
  },
];

const productAreas = [
  {
    title: "사람 흐름",
    desc: "새가족부터 봉사 연결까지 한 상태 체계로 관리합니다.",
    href: "/workspace/people",
    cta: "사람 보러가기",
    health: "정리 필요 9건",
  },
  {
    title: "커뮤니케이션",
    desc: "주요 공지, 예약 발송, 채널별 메시지 흐름을 정리합니다.",
    href: "/workspace/notices",
    cta: "공지 보러가기",
    health: "예약 4건",
  },
  {
    title: "작업 흐름",
    desc: "사역팀이 해야 할 일을 상태와 담당자 기준으로 공유합니다.",
    href: "/workspace/tasks",
    cta: "보드 보러가기",
    health: "검토 5건",
  },
  {
    title: "콘텐츠 스튜디오",
    desc: "쇼츠, 행사 페이지, 유튜브 운영 요청을 한 파이프라인으로 모읍니다.",
    href: "/workspace/content",
    cta: "콘텐츠 보기",
    health: "제작중 7건",
  },
];

const teamBoard = [
  { team: "사무국", focus: "새가족 후속 연락", status: "오늘 2건 남음" },
  { team: "미디어팀", focus: "부활절 홍보영상 검토", status: "검토 대기" },
  { team: "청년부 리더", focus: "수련회 신청 안내 확정", status: "문구 확인중" },
];

const feedItems = [
  {
    title: "설교를 쇼츠로 연결하는 구조 정리 중",
    body: "콘텐츠 요청이 들어오면 예배 후 짧은 영상, 안내 문구, 행사 홍보 흐름으로 바로 이어질 수 있게 구조를 다듬고 있습니다.",
    meta: "SOOM+ · 오늘",
  },
  {
    title: "부서별 공지 구조 준비",
    body: "청년부, 교구, 봉사팀처럼 그룹별로 다른 메시지를 보낼 수 있는 흐름을 기준으로 설계하고 있습니다.",
    meta: "커뮤니케이션 · 이번 주",
  },
];

const commandCenter = [
  {
    label: "가장 먼저",
    title: "후속 연락 3건",
    desc: "주일 방문 이후 48시간 안에 연락해야 하는 새가족이 있습니다.",
    href: "/workspace/people",
  },
  {
    label: "이번 주 안에",
    title: "예약 공지 최종 점검",
    desc: "수련회 안내 발송 전 채널과 문구를 다시 확인합니다.",
    href: "/workspace/notices",
  },
  {
    label: "콘텐츠 연결",
    title: "부활절 영상 승인",
    desc: "썸네일과 자막 톤만 확정하면 바로 배포할 수 있습니다.",
    href: "/workspace/content",
  },
];

const pipelineSteps = [
  { title: "사람 유입", desc: "새가족 등록과 신청 정보를 먼저 받습니다." },
  { title: "후속 정리", desc: "담당자 배정과 상태 태그를 바로 붙입니다." },
  { title: "공지 발송", desc: "대상별 안내 문구와 예약 발송을 맞춥니다." },
  { title: "콘텐츠 확장", desc: "필요하면 쇼츠와 행사 페이지 제작까지 연결합니다." },
];

export default function WorkspacePage() {
  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.22fr_0.78fr]">
        <div className="overflow-hidden rounded-[32px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] tracking-[0.2em] text-white/46">CHURCH OPERATIONS HUB</p>
                <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] text-white/70">운영 우선순위 중심</span>
              </div>
              <h1 className="mt-3 text-[2.25rem] font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-[3rem]">
                오늘 처리해야 할 운영 흐름을
                <br />
                한 화면에서 정리합니다
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                사람, 공지, 작업, 콘텐츠 요청이 흩어지지 않도록 지금 먼저 처리할 흐름부터 한 화면에 모아 보여주는 워크스페이스입니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[250px] lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">대흥교회 청년부</span>
              <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/12 px-3 py-1.5 text-xs text-[#f1dfb2]">무료 플랜</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">팀원 4명 온라인</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 xl:grid-cols-[1fr_240px]">
            <div className="rounded-[24px] border border-white/10 bg-white/8 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] tracking-[0.18em] text-white/42">TODAY'S FOCUS</p>
                  <p className="mt-2 text-sm text-white/68">가장 급한 일 3개만 먼저 정리했습니다.</p>
                </div>
                <span className="rounded-full border border-white/10 bg-[#0f1a30] px-3 py-1 text-[11px] text-white/70">월요일 운영 체크</span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-white/82 sm:grid-cols-3">
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">새가족 후속 연락 3건</div>
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">수련회 안내 예약 점검</div>
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">부활절 영상 최종 검토</div>
              </div>
            </div>
            <div className="grid gap-3">
              <Link href="/workspace/tasks" className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-white px-5 text-sm font-semibold text-[#09111f]">
                오늘 할 일 보기
              </Link>
              <Link href="/workspace/people" className="inline-flex min-h-11 items-center justify-center rounded-[14px] border border-white/14 bg-white/5 px-5 text-sm font-medium text-white">
                사람 흐름 열기
              </Link>
              <Link href="/workspace/tasks" className="inline-flex min-h-11 items-center justify-center rounded-[14px] border border-white/14 bg-white/5 px-5 text-sm font-medium text-white">
                보드 열기
              </Link>
            </div>
          </div>
        </div>

        <section className="rounded-[30px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">SETUP</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">도입 체크리스트</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">1 / 4 완료</span>
          </div>
          <div className="mt-4 grid gap-3">
            {setupItems.map((item) => (
              <div key={item.title} className="rounded-[18px] border border-[#ece6dc] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">STEP {item.step}</p>
                    <p className="mt-1 text-sm font-semibold text-[#111111]">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    className={`rounded-[12px] px-3 py-2 text-xs font-medium ${item.done ? "border border-[#d9e7d7] bg-[#edf7eb] text-[#3d6f36]" : "bg-[#0F172A] text-white"}`}
                  >
                    {item.done ? "완료" : item.action}
                  </button>
                </div>
              </div>
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

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">COMMAND CENTER</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">지금 먼저 풀 일</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">우선순위 기준</span>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {commandCenter.map((item) => (
                <Link key={item.title} href={item.href} className="rounded-[20px] border border-[#ede6d8] bg-[#fcfbf8] p-4 transition hover:bg-white">
                  <p className="text-[11px] tracking-[0.16em] text-[#8C7A5B]">{item.label}</p>
                  <p className="mt-3 text-base font-semibold text-[#111111]">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">ACTION CENTER</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">지금 바로 움직일 일</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">오늘 기준</span>
            </div>
            <div className="mt-4 grid gap-3">
              {quickActions.map((item) => (
                <Link key={item.title} href={item.href} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 transition hover:bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                        <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.urgency}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.desc}</p>
                    </div>
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-3 py-1 text-[11px] text-[#8C6A2E]">바로가기</span>
                  </div>
                  <p className="mt-3 text-xs font-medium text-[#8C6A2E]">{item.cta}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">PRIORITY INBOX</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">지금 바로 확인할 것</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">운영 허브</span>
            </div>
            <div className="mt-4 grid gap-3">
              {inboxItems.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{item.meta}</span>
                        <span className="text-[11px] text-[#9a8b7a]">{item.priority}</span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[#111111]">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.desc}</p>
                    </div>
                    <button type="button" className="rounded-[12px] border border-[#e1d7c7] bg-white px-3 py-2 text-xs font-medium text-[#111111]">
                      보기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">WORKFLOWS</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">운영 흐름 보드</h2>
              </div>
              <Link href="/workspace/tasks" className="text-xs text-[#6b7280] hover:text-[#111111]">전체 보드</Link>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              {workflowLanes.map((lane) => (
                <div key={lane.title} className={`rounded-[18px] border p-4 ${lane.accent}`}>
                  <p className="text-sm font-semibold text-[#111111]">{lane.title}</p>
                  <div className="mt-3 grid gap-2">
                    {lane.items.map((item) => (
                      <div key={item} className="rounded-[14px] border border-[#e7dfd1] bg-white px-3 py-3 text-sm text-[#5f564b]">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#e6dfd5] bg-[#fffaf0] p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">PRODUCT STRUCTURE</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">교회 운영 흐름 구조</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">운영 흐름 기준</span>
            </div>
            <div className="mt-4 grid gap-3">
              {pipelineSteps.map((step, index) => (
                <div key={step.title} className="rounded-[18px] border border-[#eadfcd] bg-white p-4">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e6dfd5] bg-[#f8f2e5] text-xs font-semibold text-[#8C6A2E]">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">{step.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#D8BD86_0%,#A67C36_100%)] p-5 text-white shadow-[0_14px_36px_rgba(140,106,46,0.18)]">
            <p className="text-xs tracking-[0.18em] text-white/74">SOOM+ CONTENT FLOW</p>
            <h2 className="mt-10 text-[1.9rem] font-semibold leading-[1.02] tracking-[-0.05em]">
              설교부터 안내까지
              <br />
              한 흐름으로 연결
            </h2>
            <p className="mt-4 max-w-[18rem] text-sm leading-6 text-white/84">콘텐츠 스튜디오가 붙으면 쇼츠, 행사 페이지, 공지 문구까지 같은 파이프라인으로 이어집니다.</p>
            <Link href="/workspace/content" className="mt-6 inline-flex rounded-[12px] bg-[#0F172A] px-4 py-3 text-sm font-medium text-white">
              콘텐츠 흐름 보기
            </Link>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">WEEKLY RHYTHM</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">주간 운영 리듬</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">교회 운영 기준</span>
            </div>
            <div className="mt-4 grid gap-3">
              {weeklyRhythm.map((item) => (
                <div key={item.day} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e6dfd5] bg-white text-sm font-semibold text-[#8C6A2E]">{item.day}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">PRODUCT AREAS</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">핵심 영역</h2>
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

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[#111111]">팀 포커스</h2>
              <span className="text-xs text-[#8C7A5B]">오늘</span>
            </div>
            <div className="mt-4 grid gap-3">
              {teamBoard.map((item) => (
                <div key={item.team} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#111111]">{item.team}</p>
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">{item.status}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.focus}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[#111111]">제품 업데이트</h2>
              <span className="text-xs text-[#8C7A5B]">최근</span>
            </div>
            <div className="mt-4 grid gap-3">
              {feedItems.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.body}</p>
                  <p className="mt-3 text-[11px] text-[#9a8b7a]">{item.meta}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
