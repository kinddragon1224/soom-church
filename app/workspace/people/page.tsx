const peopleStats = [
  { label: "전체 인원", value: "128", delta: "+12 이번 주" },
  { label: "새가족", value: "14", delta: "이번 달 5명" },
  { label: "후속관리 필요", value: "9", delta: "오늘 3건" },
  { label: "교구 미배정", value: "6", delta: "리더 확인 필요" },
];

const people = [
  { name: "김은혜", tag: "새가족", status: "후속 연락 필요", owner: "김선용", nextStep: "오늘 문자 발송" },
  { name: "박준호", tag: "정착중", status: "소그룹 연결 중", owner: "사무국", nextStep: "목장 배정 확인" },
  { name: "이수민", tag: "봉사연결", status: "미디어팀 상담", owner: "콘텐츠", nextStep: "면담 일정 확정" },
  { name: "최다은", tag: "교구미배정", status: "배정 검토 필요", owner: "사무국", nextStep: "리더 회의 안건" },
  { name: "정하늘", tag: "새가족", status: "첫 안내 완료", owner: "김선용", nextStep: "다음 주 소그룹 연결" },
];

const journeySteps = [
  { title: "유입", desc: "예배 방문, 행사 신청, 새가족 등록으로 처음 들어옵니다." },
  { title: "첫 연락", desc: "48시간 안에 담당자를 배정하고 첫 안내를 보냅니다." },
  { title: "정착", desc: "소그룹, 교구, 봉사 연결로 관계를 이어갑니다." },
  { title: "참여 확장", desc: "사역팀과 봉사 흐름 안으로 자연스럽게 연결합니다." },
];

const followUpQueue = [
  { name: "김은혜", note: "주일 첫 방문, 담당자 배정 전", due: "오늘" },
  { name: "오민재", note: "청년부 수련회 신청 후 연락 대기", due: "24시간" },
  { name: "정하늘", note: "소그룹 연결 안내 후 확인 필요", due: "이번 주" },
];

const teamNotes = [
  { team: "사무국", focus: "교구 미배정 2명 정리", status: "회의 전" },
  { team: "청년부 리더", focus: "새가족 첫 만남 배정", status: "오늘" },
  { team: "미디어팀", focus: "봉사 연결 상담 1건", status: "이번 주" },
];

const handoffSignals = [
  {
    title: "첫 연락 후 작업 생성",
    desc: "연락이 시작되면 소그룹 연결과 후속 체크를 작업 흐름으로 넘깁니다.",
    target: "작업 흐름",
    owner: "사무국",
    due: "오늘 오후",
    action: "첫 연락 완료 후 후속 태스크 생성",
  },
  {
    title: "정착 상태별 안내 발송",
    desc: "정착중, 봉사연결 같은 상태에 따라 다음 안내 메시지를 붙입니다.",
    target: "커뮤니케이션",
    owner: "청년부 리더",
    due: "이번 주",
    action: "상태 변경 시 환영/안내 메시지 예약",
  },
  {
    title: "간증·봉사 스토리 후보",
    desc: "관계가 깊어진 사람은 콘텐츠 스토리 후보로 이어질 수 있습니다.",
    target: "콘텐츠",
    owner: "콘텐츠팀",
    due: "다음 검토",
    action: "스토리 후보 태그 후 제작 큐로 전달",
  },
];

const automationReady = [
  { title: "48시간 미응답 알림", note: "첫 방문 후 연락이 늦어지면 담당자에게 다시 알립니다.", state: "ready" },
  { title: "상태 변경 체크포인트", note: "새가족 → 정착중 전환 시 다음 액션을 자동으로 보여줍니다.", state: "draft" },
  { title: "교구 미배정 감지", note: "배정 없이 오래 머문 인원을 따로 모아 점검합니다.", state: "review" },
];

export default function WorkspacePeoplePage() {
  return (
    <div className="flex flex-col gap-6 text-[#121212]">
      <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="overflow-hidden rounded-[30px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] tracking-[0.2em] text-white/46">PEOPLE FLOW</p>
                <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] text-white/70">새가족 후속관리 중심</span>
              </div>
              <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-[2.8rem]">
                사람 흐름이 끊기지 않도록
                <br />
                상태와 다음 행동을 같이 봅니다
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                새가족 등록부터 정착과 봉사 연결까지, 누가 지금 멈춰 있는지와 다음에 무엇을 해야 하는지를 같은 화면에서 정리합니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[250px] lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">후속관리 9건</span>
              <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/12 px-3 py-1.5 text-xs text-[#f1dfb2]">오늘 연락 3건</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">담당자 4명</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 xl:grid-cols-[1fr_230px]">
            <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 sm:p-5">
              <p className="text-[11px] tracking-[0.18em] text-white/42">TODAY'S FOLLOW-UP</p>
              <div className="mt-4 grid gap-2 text-sm text-white/82 sm:grid-cols-3">
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">김은혜 첫 연락</div>
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">정하늘 소그룹 연결</div>
                <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">교구 미배정 2명 검토</div>
              </div>
            </div>
            <div className="grid gap-3">
              <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-white px-5 text-sm font-semibold text-[#09111f]">
                사람 추가
              </button>
              <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-[14px] border border-white/14 bg-white/5 px-5 text-sm font-medium text-white">
                상태 필터
              </button>
            </div>
          </div>
        </div>

        <section className="rounded-[30px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">JOURNEY MAP</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">정착 흐름 구조</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">4단계</span>
          </div>
          <div className="mt-4 grid gap-3">
            {journeySteps.map((item, index) => (
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
        {peopleStats.map((item) => (
          <div key={item.label} className="rounded-[20px] border border-[#E7E0D4] bg-[#FCFBF8] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs text-[#8C7A5B]">{item.label}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-2xl font-semibold text-[#121212]">{item.value}</p>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#121212]">사람 상태 리스트</h2>
            <span className="text-xs text-[#8C7A5B]">최근 업데이트순</span>
          </div>
          <div className="mt-4 grid gap-3">
            {people.map((person) => (
              <div key={person.name} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-[#121212]">{person.name}</p>
                      <span className="rounded-full border border-[#E7E0D4] bg-[#F6F1E5] px-3 py-1 text-[11px] text-[#8C6A2E]">{person.tag}</span>
                    </div>
                    <p className="mt-1 text-xs text-[#5F564B]">담당: {person.owner}</p>
                  </div>
                  <span className="text-[11px] text-[#8C7A5B]">{person.status}</span>
                </div>
                <p className="mt-3 text-sm text-[#5F564B]">다음 액션: {person.nextStep}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">FOLLOW-UP QUEUE</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">지금 연락할 사람</h2>
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
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">TEAM NOTES</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">팀 포커스</h2>
            <div className="mt-4 grid gap-3">
              {teamNotes.map((item) => (
                <div key={item.team} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#121212]">{item.team}</p>
                    <span className="text-[11px] text-[#8C7A5B]">{item.status}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.focus}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">NEXT HANDOFF</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">다음 모듈로 넘길 흐름</h2>
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
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">자동화로 붙일 수 있는 루틴</h2>
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
