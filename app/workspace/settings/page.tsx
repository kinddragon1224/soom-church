const settingsItems = [
  { title: "워크스페이스 이름", desc: "대흥교회 청년부 워크스페이스", meta: "브랜드 기본값" },
  { title: "팀원 초대", desc: "현재 팀원 4명", meta: "사무국 · 목회자 · 콘텐츠" },
  { title: "무료 플랜 상태", desc: "기본 기능 사용 중", meta: "도입 단계" },
  { title: "향후 확장 준비", desc: "사람·공지·작업 흐름 중심으로 구조 정리 중", meta: "업그레이드 후보" },
];

const rolloutSteps = [
  { title: "기본 정보", desc: "교회 이름, 부서, 담당자 구조를 먼저 맞춥니다." },
  { title: "팀 참여", desc: "사무국, 목회자, 담당자를 초대해 운영 주체를 정리합니다." },
  { title: "운영 흐름", desc: "사람 상태, 공지, 작업 보드를 기본 루틴에 맞춥니다." },
  { title: "확장 연결", desc: "필요하면 콘텐츠 제작과 추가 플로우를 붙입니다." },
];

const planChecks = [
  { title: "현재 플랜", desc: "무료 플랜으로 기본 도입 가능", status: "활성" },
  { title: "팀원 구성", desc: "운영 담당 2명, 검토 1명, 콘텐츠 1명", status: "정리됨" },
  { title: "다음 확장 포인트", desc: "예약 공지와 콘텐츠 요청 흐름 연결", status: "검토중" },
];

const moduleReadiness = [
  { title: "사람 흐름", desc: "새가족 상태 체계와 담당자 기준이 먼저 정리돼야 합니다.", state: "기본값 준비" },
  { title: "커뮤니케이션", desc: "부서별 채널, 예약 기준, 메시지 톤을 같은 구조로 맞춥니다.", state: "연결 준비" },
  { title: "콘텐츠 스튜디오", desc: "브리프 입력과 배포 handoff 규칙이 잡히면 확장할 수 있습니다.", state: "다음 단계" },
];

const rolloutRules = [
  { title: "기본값부터 먼저", note: "도입 초기에 모든 기능을 여는 대신 실제 운영 루틴에 필요한 것부터 시작합니다.", state: "rule" },
  { title: "팀 역할 명확화", note: "누가 입력하고 누가 검토하는지 정해져야 워크스페이스가 살아납니다.", state: "owner" },
  { title: "확장은 handoff 이후", note: "사람·공지·작업 흐름이 붙은 뒤 콘텐츠와 자동화를 넓히는 순서가 안전합니다.", state: "sequence" },
];

export default function WorkspaceSettingsPage() {
  return (
    <div className="flex flex-col gap-6 text-[#121212]">
      <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="overflow-hidden rounded-[30px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] tracking-[0.2em] text-white/46">WORKSPACE SETTINGS</p>
                <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] text-white/70">도입 구조 중심</span>
              </div>
              <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-[2.8rem]">
                워크스페이스 기본값을 먼저 맞추고
                <br />
                그다음 운영을 확장합니다
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                이름, 팀원, 무료 플랜 상태, 앞으로 붙일 기능까지 지금 어디까지 준비됐는지 한 번에 보는 설정 화면입니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[250px] lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">무료 플랜</span>
              <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/12 px-3 py-1.5 text-xs text-[#f1dfb2]">도입 진행중</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">팀원 4명</span>
            </div>
          </div>

          <div className="mt-6 rounded-[22px] border border-white/10 bg-white/8 p-4 sm:p-5">
            <p className="text-[11px] tracking-[0.18em] text-white/42">CURRENT SETUP</p>
            <div className="mt-4 grid gap-2 text-sm text-white/82 sm:grid-cols-3">
              <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">이름과 팀 구조 정리</div>
              <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">사람 상태 체계 준비</div>
              <div className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">콘텐츠 확장 검토</div>
            </div>
          </div>
        </div>

        <section className="rounded-[30px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">ROLLOUT PLAN</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">도입 순서</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">4단계</span>
          </div>
          <div className="mt-4 grid gap-3">
            {rolloutSteps.map((item, index) => (
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

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="grid gap-3">
          {settingsItems.map((item) => (
            <div key={item.title} className="rounded-[20px] border border-[#E7E0D4] bg-[#FCFBF8] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#121212]">{item.title}</p>
                  <p className="mt-2 text-sm text-[#5F564B]">{item.desc}</p>
                </div>
                <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">{item.meta}</span>
              </div>
            </div>
          ))}
        </section>

        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">PLAN CHECKS</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">현재 상태</h2>
            <div className="mt-4 grid gap-3">
              {planChecks.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#121212]">{item.title}</p>
                    <span className="text-[11px] text-[#8C7A5B]">{item.status}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">MODULE READINESS</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">모듈별 도입 준비</h2>
            <div className="mt-4 grid gap-3">
              {moduleReadiness.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#121212]">{item.title}</p>
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.state}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">ROLLOUT RULES</p>
            <h2 className="mt-2 text-lg font-semibold text-[#121212]">확장 순서 기준</h2>
            <div className="mt-4 grid gap-3">
              {rolloutRules.map((item) => (
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
