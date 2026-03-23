const tasks = [
  { title: "새가족 후속 연락", owner: "김선용", state: "진행중" },
  { title: "수련회 안내 페이지 검수", owner: "최재성", state: "검토" },
  { title: "주보 공지 정리", owner: "사무국", state: "대기" },
];

export default function WorkspaceTasksPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs tracking-[0.24em] text-white/38">TASKS</p>
        <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-white sm:text-[2.4rem]">작업</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/62 sm:text-base">해야 할 일, 담당자, 상태를 한눈에 보는 작업 보드입니다.</p>
      </div>
      <div className="grid gap-3">
        {tasks.map((task) => (
          <div key={task.title} className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-base font-semibold text-white">{task.title}</p>
            <p className="mt-2 text-sm text-white/58">담당: {task.owner}</p>
            <p className="mt-1 text-xs text-white/44">상태: {task.state}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
