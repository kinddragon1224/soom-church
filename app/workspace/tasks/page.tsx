const taskStats = [
  { label: "전체 작업", value: "23" },
  { label: "진행중", value: "8" },
  { label: "검토", value: "5" },
  { label: "대기", value: "10" },
];

const tasks = [
  { title: "새가족 후속 연락", owner: "김선용", state: "진행중", priority: "높음" },
  { title: "수련회 안내 페이지 검수", owner: "최재성", state: "검토", priority: "중간" },
  { title: "주보 공지 정리", owner: "사무국", state: "대기", priority: "중간" },
  { title: "부활절 행사 체크리스트", owner: "사역팀", state: "진행중", priority: "높음" },
];

const lanes = [
  { title: "대기", items: ["주보 공지 정리", "행사 신청 폼 점검"] },
  { title: "진행중", items: ["새가족 후속 연락", "부활절 행사 체크리스트"] },
  { title: "검토", items: ["수련회 안내 페이지 검수"] },
];

export default function WorkspaceTasksPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs tracking-[0.24em] text-white/38">TASKS</p>
          <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-white sm:text-[2.4rem]">작업</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/62 sm:text-base">해야 할 일, 담당자, 상태를 한눈에 보는 작업 보드입니다.</p>
        </div>
        <button type="button" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#09111f]">작업 생성</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {taskStats.map((item) => (
          <div key={item.label} className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-white/44">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">작업 리스트</h2>
            <span className="text-xs text-white/44">우선순위 포함</span>
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
                    <span className="text-[11px] text-white/42">{task.state}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs tracking-[0.18em] text-white/38">BOARD VIEW</p>
          <div className="mt-4 grid gap-3">
            {lanes.map((lane) => (
              <div key={lane.title} className="rounded-[18px] border border-white/10 bg-[#091122] p-4">
                <p className="text-sm font-semibold text-white">{lane.title}</p>
                <div className="mt-3 grid gap-2">
                  {lane.items.map((item) => (
                    <div key={item} className="rounded-[14px] border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/70">{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
