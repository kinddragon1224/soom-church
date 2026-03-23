const taskStats = [
  { label: "전체 작업", value: "23", delta: "+4 이번 주" },
  { label: "진행중", value: "8", delta: "담당자 5명" },
  { label: "검토", value: "5", delta: "오늘 2건" },
  { label: "대기", value: "10", delta: "정리 필요" },
];

const tasks = [
  { title: "새가족 후속 연락", owner: "김선용", state: "진행중", priority: "높음", deadline: "오늘" },
  { title: "수련회 안내 페이지 검수", owner: "최재성", state: "검토", priority: "중간", deadline: "이번 주" },
  { title: "주보 공지 정리", owner: "사무국", state: "대기", priority: "중간", deadline: "금요일" },
  { title: "부활절 행사 체크리스트", owner: "사역팀", state: "진행중", priority: "높음", deadline: "오늘" },
];

const lanes = [
  { title: "대기", items: ["주보 공지 정리", "행사 신청 폼 점검"] },
  { title: "진행중", items: ["새가족 후속 연락", "부활절 행사 체크리스트"] },
  { title: "검토", items: ["수련회 안내 페이지 검수"] },
];

const workflowSteps = [
  { title: "할 일 수집", desc: "사역, 행정, 콘텐츠 요청을 먼저 모읍니다." },
  { title: "담당 배정", desc: "누가 처리할지와 우선순위를 바로 붙입니다." },
  { title: "진행 공유", desc: "막힌 일과 검토 대기를 팀이 같이 봅니다." },
  { title: "마감 확인", desc: "예배 전과 행사 전 마감 기준으로 마무리합니다." },
];

const reviewItems = [
  { title: "수련회 안내 페이지 검수", note: "신청 버튼 문구 최종 확인", status: "검토" },
  { title: "부활절 행사 체크리스트", note: "현장 역할 배정 누락 여부 확인", status: "오늘" },
  { title: "주보 공지 정리", note: "예배 순서 변경 반영 필요", status: "대기" },
];

const handoffBoards = [
  { title: "사람 흐름에서 들어온 후속 연락", desc: "새가족 등록 뒤 첫 연락과 소그룹 연결은 작업 보드에서 마감까지 추적합니다.", target: "사람" },
  { title: "검토 완료 후 공지 예약", desc: "행사·예배 준비 태스크가 끝나면 바로 커뮤니케이션 모듈로 넘겨 발송을 붙입니다.", target: "커뮤니케이션" },
  { title: "콘텐츠 요청과 체크리스트 연결", desc: "영상·랜딩 제작 요청은 현장 일정 태스크와 같이 묶여야 누락이 없습니다.", target: "콘텐츠" },
];

const workflowRules = [
  { title: "마감 없는 작업 금지", note: "예배 전, 행사 전처럼 실제 운영 시점을 붙여야 우선순위가 살아납니다.", state: "rule" },
  { title: "검토는 담당자와 분리", note: "실행한 사람과 최종 확인하는 사람을 나눠야 막판 실수가 줄어듭니다.", state: "review" },
  { title: "막힌 일 즉시 공유", note: "대기 상태가 길어지는 작업은 보드 상단으로 끌어올려 바로 드러냅니다.", state: "signal" },
];

export default function WorkspaceTasksPage() {
  return (
    <div className="flex flex-col gap-6 text-[#121212]">
      <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="overflow-hidden rounded-[30px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] tracking-[0.2em] text-white/46">WORKFLOW BOARD</p>
                <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] text-white/70">운영 마감 중심</span>
              </div>
              <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-[2.8rem]">
                해야 할 일을 모으는 데서 끝내지 않고
                <br />
                마감까지 보이게 정리합니다
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                교회 운영과 사역 준비는 일정이 겹치기 쉬우니, 지금 누가 무엇을 처리 중인지와 오늘 막히는 일을 먼저 보여주는 보드입니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[250px] lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">진행중 8건</span>
              <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/12 px-3 py-1.5 text-xs text-[#f1dfb2]">오늘 마감 2건</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">검토 5건</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 xl:grid-cols-[1fr_230px]">
            <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 sm:p-5">
              <p className="text-[11px] tracking-[0.18em] text-white/42">TODAY'S DEADLINES</p>
              <div className="mt-4 grid gap-2 text-sm text-white/82 sm:grid-cols-3">
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">새가족 후속 연락</div>
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">부활절 체크리스트</div>
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">수련회 페이지 검토</div>
              </div>
            </div>
            <div className="grid gap-3">
              <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-white px-5 text-sm font-semibold text-[#09111f]">
                작업 생성
              </button>
              <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-[14px] border border-white/14 bg-white/5 px-5 text-sm font-medium text-white">
                보드 보기
              </button>
            </div>
          </div>
        </div>

        <section className="rounded-[30px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">WORKFLOW RULE</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">작업 흐름 구조</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">4단계</span>
          </div>
          <div className="mt-4 grid gap-3">
            {workflowSteps.map((item, index) => (
              <div key={item.title} className="rounded-[18px] border border-[#ece6dc] bg-white p-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e6dfd5] bg-[#f8f2e5] text-xs font-semibold text-[#8C6A2E]">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {taskStats.map((item) => (
          <div key={item.label} className="rounded-[20px] border border-[#E7E0D4] bg-[#FCFBF8] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs text-[#8C7A5B]">{item.label}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-2xl font-semibold text-[#121212]">{item.value}</p>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#121212]">작업 흐름 리스트</h2>
            <span className="text-xs text-[#8C7A5B]">우선순위 포함</span>
          </div>
          <div className="mt-4 grid gap-3">
            {tasks.map((task) => (
              <div key={task.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#121212]">{task.title}</p>
                    <p className="mt-1 text-xs text-[#5F564B]">담당: {task.owner} · 마감: {task.deadline}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full border border-[#E7E0D4] bg-[#F6F1E5] px-3 py-1 text-[11px] text-[#8C6A2E]">{task.priority}</span>
                    <span className="text-[11px] text-[#8C7A5B]">{task.state}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">BOARD VIEW</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">칸반 보드</h2>
            <div className="mt-4 grid gap-3">
              {lanes.map((lane) => (
                <div key={lane.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                  <p className="text-sm font-semibold text-[#121212]">{lane.title}</p>
                  <div className="mt-3 grid gap-2">
                    {lane.items.map((item) => (
                      <div key={item} className="rounded-[14px] border border-[#ECE5D8] bg-[#FCFBF8] px-3 py-2 text-sm text-[#5F564B]">{item}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">REVIEW QUEUE</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">검토와 마감</h2>
            <div className="mt-4 grid gap-3">
              {reviewItems.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#121212]">{item.title}</p>
                    <span className="text-[11px] text-[#8C7A5B]">{item.status}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">NEXT HANDOFF</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">다른 모듈과 연결되는 일</h2>
            <div className="mt-4 grid gap-3">
              {handoffBoards.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#121212]">{item.title}</p>
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.target}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">WORKFLOW RULES</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">보드 운영 기준</h2>
            <div className="mt-4 grid gap-3">
              {workflowRules.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#121212]">{item.title}</p>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[#8C7A5B]">{item.state}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.note}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
