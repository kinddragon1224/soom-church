import Link from "next/link";

const stats = [
  { label: "활성 멤버", value: "128", delta: "+12" },
  { label: "미처리 요청", value: "6", delta: "오늘 2건" },
  { label: "이번 주 공지", value: "4", delta: "예약 1건" },
  { label: "콘텐츠 진행", value: "8", delta: "검토 3건" },
];

const broadcasts = [
  { title: "수련회 신청 오픈 안내", channel: "카카오톡 채널", status: "예약", when: "오늘 18:00" },
  { title: "주일 예배 공지", channel: "문자", status: "발송 완료", when: "어제" },
  { title: "청년부 모임 리마인드", channel: "푸시", status: "초안", when: "대기" },
];

const tasks = [
  { title: "새가족 후속관리 배정", owner: "김선용", priority: "높음", status: "진행중" },
  { title: "수련회 신청 페이지 수정", owner: "최재성", priority: "중간", status: "검토" },
  { title: "주보 공지 문구 정리", owner: "사무국", priority: "중간", status: "대기" },
  { title: "쇼츠 업로드 캘린더 확정", owner: "콘텐츠", priority: "높음", status: "진행중" },
];

const people = [
  { name: "김은혜", tag: "새가족", status: "후속 연락 필요" },
  { name: "박준호", tag: "정착중", status: "소그룹 연결 중" },
  { name: "이수민", tag: "봉사연결", status: "미디어팀 상담" },
  { name: "최다은", tag: "교구미배정", status: "배정 검토 필요" },
];

const contentPipeline = [
  { title: "설교 쇼츠 3건", stage: "제작중" },
  { title: "수련회 랜딩 페이지", stage: "기획" },
  { title: "유튜브 채널 구조 정리", stage: "완료" },
  { title: "부활절 홍보영상", stage: "검토" },
];

const quickActions = ["공지 작성", "멤버 추가", "콘텐츠 요청", "작업 생성"];

export default function WorkspacePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/[0.03] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] text-white/38">DASHBOARD</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[2rem]">대흥교회 청년부 워크스페이스</h1>
          <p className="mt-2 text-sm text-white/56">오늘 처리해야 할 운영 흐름과 진행 상태를 한 번에 봅니다.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.08] px-3 py-1.5 text-emerald-200">무료 플랜</span>
          <span className="rounded-full border border-white/10 bg-[#091122] px-3 py-1.5 text-white/60">팀원 4명</span>
          <span className="rounded-full border border-white/10 bg-[#091122] px-3 py-1.5 text-white/60">콘텐츠 8건 진행</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-white/44">{item.label}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-2xl font-semibold text-white">{item.value}</p>
              <span className="text-xs text-white/44">{item.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs tracking-[0.18em] text-white/38">BROADCASTS</p>
              <h2 className="mt-2 text-lg font-semibold text-white">브로드캐스트</h2>
            </div>
            <Link href="/workspace/notices" className="text-xs text-white/56 hover:text-white">전체 보기</Link>
          </div>
          <div className="mt-4 grid gap-3">
            {broadcasts.map((item) => (
              <div key={item.title} className="rounded-[18px] border border-white/10 bg-[#091122] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-white/44">{item.channel}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/68">{item.status}</span>
                </div>
                <p className="mt-3 text-xs text-white/46">{item.when}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs tracking-[0.18em] text-white/38">QUICK ACTIONS</p>
              <h2 className="mt-2 text-lg font-semibold text-white">빠른 작업</h2>
            </div>
            <Link href="/workspace/tasks" className="text-xs text-white/56 hover:text-white">작업 보드</Link>
          </div>
          <div className="mt-4 grid gap-3">
            {quickActions.map((item) => (
              <button key={item} type="button" className="rounded-[18px] border border-white/10 bg-[#091122] px-4 py-3 text-left text-sm text-white/74 transition hover:bg-white/[0.08]">
                {item}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-[18px] border border-indigo-400/15 bg-indigo-400/[0.08] p-4">
            <p className="text-xs tracking-[0.18em] text-indigo-200/70">UPGRADE</p>
            <p className="mt-2 text-sm font-medium text-white">향후 유료 플랜에서 자동화와 팀 확장 기능이 붙습니다.</p>
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs tracking-[0.18em] text-white/38">TASKS</p>
              <h2 className="mt-2 text-lg font-semibold text-white">진행 중인 작업</h2>
            </div>
            <Link href="/workspace/tasks" className="text-xs text-white/56 hover:text-white">전체 보기</Link>
          </div>
          <div className="mt-4 grid gap-3">
            {tasks.map((task) => (
              <div key={task.title} className="rounded-[18px] border border-white/10 bg-[#091122] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{task.title}</p>
                    <p className="mt-1 text-xs text-white/44">담당: {task.owner}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/68">{task.priority}</span>
                    <span className="text-[11px] text-white/42">{task.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs tracking-[0.18em] text-white/38">PEOPLE</p>
              <h2 className="mt-2 text-lg font-semibold text-white">사람 상태</h2>
            </div>
            <Link href="/workspace/people" className="text-xs text-white/56 hover:text-white">전체 보기</Link>
          </div>
          <div className="mt-4 grid gap-3">
            {people.map((person) => (
              <div key={person.name} className="rounded-[18px] border border-white/10 bg-[#091122] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{person.name}</p>
                    <p className="mt-1 text-xs text-white/44">{person.status}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/68">{person.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.18em] text-white/38">CONTENT PIPELINE</p>
            <h2 className="mt-2 text-lg font-semibold text-white">콘텐츠 진행 현황</h2>
          </div>
          <Link href="/workspace/content" className="text-xs text-white/56 hover:text-white">전체 보기</Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {contentPipeline.map((item) => (
            <div key={item.title} className="rounded-[18px] border border-white/10 bg-[#091122] p-4">
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="mt-3 text-xs text-white/44">상태: {item.stage}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
