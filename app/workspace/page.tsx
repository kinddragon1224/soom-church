import Link from "next/link";

const quickStats = [
  { label: "오늘 할 일", value: "7" },
  { label: "미처리 요청", value: "4" },
  { label: "이번 주 공지", value: "3" },
  { label: "콘텐츠 진행", value: "5" },
];

const recentTasks = [
  "새가족 후속관리 상태 정리",
  "주일 공지 문구 점검",
  "수련회 신청 페이지 확인",
  "이번 주 쇼츠 업로드 준비",
];

const recentActivity = [
  "청년부 공지 초안 저장",
  "수련회 신청 상태 업데이트",
  "쇼츠 요청 카드 생성",
  "새가족 상태 변경",
];

export default function WorkspacePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs tracking-[0.24em] text-white/38">WORKSPACE DEMO</p>
          <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-white sm:text-[2.6rem]">교회와 사역팀을 위한 워크스페이스</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/62 sm:text-base">
            사람, 공지, 작업, 콘텐츠 흐름을 한곳에서 정리하는 숨 워크스페이스 데모입니다.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/signup" className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-[#09111f]">
            무료로 시작하기
          </Link>
          <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-5 text-sm font-medium text-white">
            도입 문의하기
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickStats.map((item) => (
          <div key={item.label} className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-white/44">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs tracking-[0.18em] text-white/38">THIS WEEK</p>
          <h2 className="mt-3 text-xl font-semibold">이번 주 운영 요약</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
            미처리 요청, 공지 점검, 콘텐츠 준비 상황을 한 번에 보고 지금 가장 먼저 해야 할 일을 정리할 수 있습니다.
          </p>
          <div className="mt-5 grid gap-3">
            {recentTasks.map((task, index) => (
              <div key={task} className="flex items-center justify-between rounded-[18px] border border-white/10 bg-[#091122] px-4 py-3">
                <p className="text-sm text-white/80">{task}</p>
                <span className="text-xs text-white/38">0{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs tracking-[0.18em] text-white/38">QUICK ACTIONS</p>
            <div className="mt-4 grid gap-3">
              <Link href="/workspace/notices" className="rounded-[18px] border border-white/10 bg-[#091122] px-4 py-3 text-sm text-white/78">공지 작성</Link>
              <Link href="/workspace/people" className="rounded-[18px] border border-white/10 bg-[#091122] px-4 py-3 text-sm text-white/78">사람 상태 업데이트</Link>
              <Link href="/workspace/content" className="rounded-[18px] border border-white/10 bg-[#091122] px-4 py-3 text-sm text-white/78">콘텐츠 요청 등록</Link>
              <Link href="/workspace/tasks" className="rounded-[18px] border border-white/10 bg-[#091122] px-4 py-3 text-sm text-white/78">작업 보드 확인</Link>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs tracking-[0.18em] text-white/38">RECENT ACTIVITY</p>
            <div className="mt-4 grid gap-3">
              {recentActivity.map((item) => (
                <div key={item} className="rounded-[18px] border border-white/10 bg-[#091122] px-4 py-3 text-sm text-white/70">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
