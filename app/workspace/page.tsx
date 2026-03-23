import Link from "next/link";

const stats = [
  { label: "people", value: "128", delta: "+12 this week" },
  { label: "pending", value: "6", delta: "2 due today" },
  { label: "broadcasts", value: "4", delta: "1 scheduled" },
  { label: "content", value: "8", delta: "3 in review" },
];

const broadcasts = [
  { title: "수련회 신청 오픈 안내", channel: "카카오톡 채널", status: "scheduled", when: "today 18:00" },
  { title: "주일 예배 공지", channel: "문자", status: "sent", when: "yesterday" },
  { title: "청년부 모임 리마인드", channel: "push", status: "draft", when: "pending" },
];

const tasks = [
  { title: "새가족 후속관리 배정", owner: "김선용", priority: "high", status: "in progress" },
  { title: "수련회 신청 페이지 수정", owner: "최재성", priority: "medium", status: "review" },
  { title: "주보 공지 문구 정리", owner: "사무국", priority: "medium", status: "queued" },
  { title: "쇼츠 업로드 캘린더 확정", owner: "콘텐츠", priority: "high", status: "in progress" },
];

const people = [
  { name: "김은혜", tag: "new", status: "후속 연락 필요" },
  { name: "박준호", tag: "settling", status: "소그룹 연결 중" },
  { name: "이수민", tag: "serving", status: "미디어팀 상담" },
  { name: "최다은", tag: "unassigned", status: "배정 검토 필요" },
];

const contentPipeline = [
  { title: "설교 쇼츠 3건", stage: "editing" },
  { title: "수련회 랜딩 페이지", stage: "planning" },
  { title: "유튜브 채널 구조 정리", stage: "done" },
  { title: "부활절 홍보영상", stage: "review" },
];

const quickActions = ["공지 작성", "멤버 추가", "콘텐츠 요청", "작업 생성"];

export default function WorkspacePage() {
  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[2.15rem] font-semibold tracking-[-0.05em] text-[#111111] sm:text-[2.5rem]">Welcome, 선용</h1>
          <p className="mt-2 text-sm text-[#6b7280]">오늘 처리해야 할 운영 흐름과 진행 상태를 한 번에 봅니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-[10px] border border-[#e5e7eb] bg-white px-3 py-2 text-xs text-[#6b7280]">무료 플랜</span>
          <button type="button" className="rounded-[10px] bg-[#111111] px-4 py-2 text-sm font-medium text-white">Manage team</button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr_0.65fr]">
        <section className="rounded-[22px] border border-[#e6e7ea] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <p className="text-[11px] tracking-[0.18em] text-[#9aa0a6]">GET STARTED</p>
          <h2 className="mt-2 text-xl font-semibold text-[#111111]">워크스페이스 시작하기</h2>
          <p className="mt-2 text-sm text-[#6b7280]">무료로 시작하고 필요한 흐름을 차근차근 채워가세요.</p>
          <div className="mt-5 grid gap-3">
            {[
              ["step 1", "워크스페이스 기본 정보 정리", "Start"],
              ["step 2", "사람 상태 체계 잡기", "Setup"],
              ["step 3", "팀원 초대", "Invite"],
              ["step 4", "콘텐츠 흐름 연결", "Add"],
            ].map(([step, label, action]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-[16px] border border-[#eceef1] bg-[#fafafa] px-4 py-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#9aa0a6]">{step}</p>
                  <p className="mt-1 text-sm font-medium text-[#111111]">{label}</p>
                </div>
                <button type="button" className="rounded-[10px] bg-[#111111] px-4 py-2 text-xs font-medium text-white">{action}</button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[22px] border border-[#e6e7ea] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-2">
            <button type="button" className="rounded-[10px] bg-[#f3f4f6] px-3 py-2 text-xs font-medium text-[#111111]">Feed</button>
            <button type="button" className="rounded-[10px] px-3 py-2 text-xs text-[#9aa0a6]">Notifications</button>
          </div>
          <div className="mt-4 grid gap-3">
            {broadcasts.map((item) => (
              <div key={item.title} className="rounded-[16px] border border-[#eceef1] bg-[#fafafa] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#176B4D] text-xs font-semibold text-white">so</div>
                    <div>
                      <p className="text-sm font-medium text-[#111111]">{item.title}</p>
                      <p className="mt-1 text-xs text-[#6b7280]">{item.channel}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#9aa0a6]">{item.when}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-[#e5e7eb] bg-white px-3 py-1 text-[11px] text-[#6b7280]">{item.status}</span>
                  <button type="button" className="rounded-[10px] border border-[#e5e7eb] bg-white px-3 py-2 text-xs font-medium text-[#111111]">View</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,#C8A96B_0%,#8C6A2E_100%)] p-5 text-white shadow-[0_12px_32px_rgba(140,106,46,0.22)]">
          <p className="text-xs tracking-[0.16em] text-white/76">SOOM+</p>
          <h2 className="mt-24 text-[2rem] font-semibold leading-[1.02] tracking-[-0.05em]">Introducing
            <br />Content Studio</h2>
          <p className="mt-4 text-sm leading-7 text-white/78">설교를 쇼츠, 안내 콘텐츠, 행사 페이지 흐름으로 연결하세요.</p>
          <button type="button" className="mt-6 rounded-[12px] bg-[#0F172A] px-4 py-3 text-sm font-medium text-white">무료 체험 시작</button>
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
            <h2 className="text-lg font-semibold text-[#111111]">진행 중인 작업</h2>
            <Link href="/workspace/tasks" className="text-xs text-[#6b7280] hover:text-[#111111]">View board</Link>
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
            <h2 className="text-lg font-semibold text-[#111111]">View my People</h2>
            <Link href="/workspace/people" className="text-xs text-[#6b7280] hover:text-[#111111]">Open</Link>
          </div>
          <div className="mt-4 grid gap-3">
            {people.map((person) => (
              <div key={person.name} className="rounded-[16px] border border-[#eceef1] bg-[#fafafa] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#111111]">{person.name}</p>
                    <p className="mt-1 text-xs text-[#6b7280]">{person.status}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] text-[#6b7280] border border-[#e5e7eb]">{person.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[22px] border border-[#e6e7ea] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#111111]">Content pipeline</h2>
            <Link href="/workspace/content" className="text-xs text-[#6b7280] hover:text-[#111111]">Open</Link>
          </div>
          <div className="mt-4 grid gap-3">
            {contentPipeline.map((item) => (
              <div key={item.title} className="rounded-[16px] border border-[#eceef1] bg-[#fafafa] p-4">
                <p className="text-sm font-medium text-[#111111]">{item.title}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-[#9aa0a6]">{item.stage}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((item) => (
          <button key={item} type="button" className="rounded-[18px] border border-[#e6e7ea] bg-white px-4 py-4 text-left text-sm font-medium text-[#111111] shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:bg-[#fafafa]">
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
