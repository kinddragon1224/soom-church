const mokjangStats = [
  { label: "전체 멤버", value: "14", delta: "리더 포함" },
  { label: "참석 예정", value: "9", delta: "이번 주" },
  { label: "후속 연락", value: "4", delta: "오늘 2건" },
  { label: "돌봄 필요", value: "3", delta: "메모 확인" },
];

const members = [
  { name: "김은혜", state: "가끔 참석", attendance: "2주 연속 결석", note: "주중에 안부 확인 필요", nextStep: "오늘 저녁 연락", owner: "김선용" },
  { name: "박준호", state: "정기 참석", attendance: "지난주 참석", note: "이번 주 나눔 진행", nextStep: "모임 전 자료 공유", owner: "리더" },
  { name: "이수민", state: "새로 연결", attendance: "첫 방문 후 대기", note: "첫 인사 후 관계 연결 필요", nextStep: "이번 주 커피 약속", owner: "김선용" },
  { name: "정하늘", state: "정기 참석", attendance: "지난주 참석", note: "기도제목 업데이트 필요", nextStep: "모임 후 메모 정리", owner: "리더" },
  { name: "오민재", state: "장기 미참석", attendance: "3주 결석", note: "직장 이슈로 일정 불안정", nextStep: "주말 안부 연락", owner: "김선용" },
];

const weeklyFlow = [
  { title: "모임 전 확인", desc: "이번 주 참석 여부와 오랜만에 빠진 사람을 먼저 확인합니다." },
  { title: "모임 기록", desc: "참석, 기도제목, 특이사항을 모임 직후 바로 남깁니다." },
  { title: "후속 연락", desc: "결석자, 새로 온 사람, 돌봄이 필요한 사람을 따로 챙깁니다." },
  { title: "다음 주 준비", desc: "메모를 다음 모임의 확인 항목과 연결합니다." },
];

const followUpQueue = [
  { name: "김은혜", note: "2주 연속 결석, 안부 확인 먼저", due: "오늘" },
  { name: "오민재", note: "3주 결석, 일정/상황 확인 필요", due: "이번 주" },
  { name: "이수민", note: "첫 방문 후 관계 연결", due: "48시간" },
];

const recentGatherings = [
  { date: "4월 1주", summary: "참석 8명 · 결석 3명 · 미응답 2명", note: "은혜/민재 후속 연락 필요" },
  { date: "3월 4주", summary: "참석 9명 · 결석 2명", note: "정하늘 기도제목 업데이트" },
  { date: "3월 3주", summary: "참석 7명 · 결석 4명", note: "장기 미참석자 점검 시작" },
];

const handoffSignals = [
  {
    title: "결석 → 후속 연락",
    desc: "2주 이상 빠진 사람은 자동으로 후속 연락 큐에 올립니다.",
    target: "작업 흐름",
    owner: "리더",
    due: "모임 다음날",
    action: "안부 연락 태스크 생성",
  },
  {
    title: "기도제목 → 돌봄 메모",
    desc: "중요한 상황은 모임 기록에서 끝내지 말고 사람 메모로 이어갑니다.",
    target: "사람",
    owner: "김선용",
    due: "기록 직후",
    action: "민감 메모 저장",
  },
  {
    title: "새 연결 → 정착 흐름",
    desc: "처음 온 사람은 다음 만남 약속과 소개 흐름까지 바로 붙입니다.",
    target: "목장",
    owner: "리더",
    due: "48시간",
    action: "첫 만남 follow-up",
  },
];

const automationReady = [
  { title: "2주 결석 감지", note: "오래 안 보인 사람을 자동으로 모아줍니다.", state: "ready" },
  { title: "모임 후 follow-up 추천", note: "기록에 남긴 메모를 기준으로 다음 행동을 제안합니다.", state: "draft" },
  { title: "새 멤버 첫 연락 체크", note: "첫 방문 이후 48시간 안에 챙겨야 할 사람을 띄웁니다.", state: "review" },
];

export default function WorkspaceMokjangPage() {
  return (
    <div className="flex flex-col gap-6 text-[#121212]">
      <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="overflow-hidden rounded-[30px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] tracking-[0.2em] text-white/46">MOKJANG PILOT</p>
                <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] text-white/70">우리 목장부터 시작</span>
              </div>
              <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-[2.8rem]">
                목장 운영이 기억에 남지 않도록
                <br />
                사람 흐름을 먼저 정리합니다
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                참석, 결석, 기도제목, 후속 연락을 한 화면에서 보고 우리 목장 운영을 파일럿으로 검증하는 첫 버전입니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[260px] lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">오늘 연락 2건</span>
              <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/12 px-3 py-1.5 text-xs text-[#f1dfb2]">2주 결석 2명</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">이번 주 모임 준비중</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 xl:grid-cols-[1fr_230px]">
            <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 sm:p-5">
              <p className="text-[11px] tracking-[0.18em] text-white/42">THIS WEEK</p>
              <div className="mt-4 grid gap-2 text-sm text-white/82 sm:grid-cols-3">
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">결석자 안부 확인</div>
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">새 연결 1명 follow-up</div>
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">지난 모임 메모 정리</div>
              </div>
            </div>
            <div className="grid gap-3">
              <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-white px-5 text-sm font-semibold text-[#09111f]">
                모임 기록
              </button>
              <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-[14px] border border-white/14 bg-white/5 px-5 text-sm font-medium text-white">
                멤버 추가
              </button>
            </div>
          </div>
        </div>

        <section className="rounded-[30px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">WEEKLY FLOW</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">목장 운영 루틴</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">4단계</span>
          </div>
          <div className="mt-4 grid gap-3">
            {weeklyFlow.map((item, index) => (
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
        {mokjangStats.map((item) => (
          <div key={item.label} className="rounded-[20px] border border-[#E7E0D4] bg-[#FCFBF8] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs text-[#8C7A5B]">{item.label}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-2xl font-semibold text-[#121212]">{item.value}</p>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
        <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#121212]">멤버 상태 리스트</h2>
            <span className="text-xs text-[#8C7A5B]">최근 흐름 기준</span>
          </div>
          <div className="mt-4 grid gap-3">
            {members.map((member) => (
              <div key={member.name} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-[#121212]">{member.name}</p>
                      <span className="rounded-full border border-[#E7E0D4] bg-[#F6F1E5] px-3 py-1 text-[11px] text-[#8C6A2E]">{member.state}</span>
                    </div>
                    <p className="mt-1 text-xs text-[#5F564B]">담당: {member.owner}</p>
                  </div>
                  <span className="text-[11px] text-[#8C7A5B]">{member.attendance}</span>
                </div>
                <p className="mt-3 text-sm text-[#5F564B]">상황 메모: {member.note}</p>
                <p className="mt-2 text-sm text-[#5F564B]">다음 액션: {member.nextStep}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">FOLLOW-UP QUEUE</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">오늘 연락할 사람</h2>
            <div className="mt-4 grid gap-3">
              {followUpQueue.map((item) => (
                <div key={item.name} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#121212]">{item.name}</p>
                    <span className="rounded-full border border-[#e6dfd5] bg-[#fff4df] px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.due}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">RECENT GATHERINGS</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">최근 모임 기록</h2>
            <div className="mt-4 grid gap-3">
              {recentGatherings.map((item) => (
                <div key={item.date} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#121212]">{item.date}</p>
                    <span className="text-[11px] text-[#8C7A5B]">기록</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.summary}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">NEXT HANDOFF</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">다음 흐름으로 넘길 신호</h2>
            <div className="mt-4 grid gap-3">
              {handoffSignals.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#121212]">{item.title}</p>
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.target}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.desc}</p>
                  <div className="mt-3 grid gap-2 text-[11px] text-[#7a6d5c] sm:grid-cols-3">
                    <div className="rounded-[12px] border border-[#e6dfd5] bg-[#fcfbf8] px-3 py-2">담당: {item.owner}</div>
                    <div className="rounded-[12px] border border-[#e6dfd5] bg-[#fcfbf8] px-3 py-2">기한: {item.due}</div>
                    <div className="rounded-[12px] border border-[#e6dfd5] bg-[#fcfbf8] px-3 py-2">다음 액션: {item.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">AUTOMATION READY</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">다음에 붙일 자동화</h2>
            <div className="mt-4 grid gap-3">
              {automationReady.map((item) => (
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
