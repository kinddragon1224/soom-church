import Link from "next/link";

const heroChips = ["학생 진로", "AI 활용 커리어", "재취업/전직", "경력 재정의"];

const floatingSignals = [
  { label: "AI SIGNAL", value: "work shift detected", className: "left-4 top-[18%] sm:left-[-1.5rem]" },
  { label: "CAREER MAP", value: "3 audience tracks", className: "right-4 top-[10%] sm:right-[-1.25rem]" },
  { label: "NEXT ACTION", value: "7-day move", className: "bottom-[18%] right-2 sm:right-[-2rem]" },
  { label: "WORK SHIFT", value: "translate experience", className: "bottom-[30%] left-2 sm:left-[-2.25rem]" },
];

const problemCards = [
  {
    label: "STUDENT / PARENT",
    title: "과목은 골랐는데 진로 문장이 없습니다.",
    desc: "생기부와 학과 이름은 있는데, 왜 그 방향인지 말할 기준이 약합니다.",
  },
  {
    label: "20s CAREER",
    title: "경험은 있는데 이력서에서 장면이 안 보입니다.",
    desc: "AI를 써봤다는 말보다, 무엇을 줄이고 어떤 결과를 냈는지가 필요합니다.",
  },
  {
    label: "SECOND CAREER",
    title: "경력은 긴데 다시 팔 첫 문장이 약합니다.",
    desc: "전부 말할수록 흐려집니다. 남길 일과 버릴 일을 접어야 다시 팔립니다.",
  },
];

const methodSteps = [
  {
    step: "READ",
    title: "흐름을 읽습니다",
    desc: "AI, 직업 변화, 교육/채용 신호, 개인의 현재 위치를 같이 봅니다.",
  },
  {
    step: "TRANSLATE",
    title: "막힌 지점을 번역합니다",
    desc: "불안과 경험을 과목, 직무, 경력, 포트폴리오 언어로 바꿉니다.",
  },
  {
    step: "ACT",
    title: "다음 행동을 정합니다",
    desc: "다음 7일에 할 작은 실험, 문장, 결과물을 정합니다.",
  },
];

const audienceTracks = [
  {
    label: "01",
    title: "학생 / 부모",
    items: ["고교학점제 과목 선택", "생기부 활동 방향", "학과/진로 문장 정리", "부모-아이 기준 조율"],
  },
  {
    label: "02",
    title: "20대 커리어",
    items: ["이력서/면접 문장", "AI 활용 증거 만들기", "퇴사 전 실험 설계", "창업 아이디어 검증"],
  },
  {
    label: "03",
    title: "후반전 커리어",
    items: ["경력 재정의", "재취업 첫 문장", "AI 업무 적용", "버릴 일/남길 일 정리"],
  },
];

const offerItems = ["현재 선택 상황 정리", "막힌 이유 1개 진단", "AI 시대 직업/진로 흐름 해석", "다음 7일 행동 3개", "필요 시 포트폴리오/콘텐츠 방향 제안"];
const pipeline = ["Research", "Strategy", "Writing", "Session", "Action"];

function SignalBar({ index }: { index: number }) {
  return (
    <div className="flex items-end gap-1.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((bar) => (
        <span
          key={bar}
          className="block w-1.5 rounded-full bg-[#ff5b2e]"
          style={{ height: `${10 + ((bar + index) % 4) * 8}px`, opacity: 0.35 + bar * 0.12 }}
        />
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff6b35]">{children}</p>;
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050507] text-[#f6f1e8] selection:bg-[#ff5b2e] selection:text-white">
      <section className="relative isolate min-h-screen overflow-hidden border-b border-white/10 bg-[#050507]">
        <div className="absolute inset-0 -z-30 bg-[#050507]" />
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_67%_28%,rgba(79,123,255,0.28)_0%,rgba(79,123,255,0)_28%),radial-gradient(circle_at_24%_20%,rgba(255,91,46,0.24)_0%,rgba(255,91,46,0)_30%),linear-gradient(115deg,#050507_0%,#080b12_42%,#111826_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.22] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:54px_54px]" />
        <div className="absolute left-[-8vw] top-[15vh] h-[34rem] w-[34rem] rounded-full border border-white/10 opacity-50" />
        <div className="absolute right-[8vw] top-[8vh] h-[44rem] w-[44rem] rounded-full border border-[#4b7bff]/20 opacity-70" />
        <div className="absolute right-[17vw] top-[22vh] h-[26rem] w-[26rem] rounded-full border border-[#ff5b2e]/20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-52 bg-gradient-to-t from-[#050507] via-[#050507]/72 to-transparent" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-5 pb-6 pt-5 sm:px-8 lg:px-10">
          <header className="z-30 flex items-center justify-between gap-4">
            <Link href="/" className="text-[2rem] font-black tracking-[-0.12em] text-white sm:text-[2.45rem]">
              soom
            </Link>
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/54 backdrop-blur md:flex">
              <span className="h-2 w-2 rounded-full bg-[#73d6b6] shadow-[0_0_22px_rgba(115,214,182,0.95)]" />
              live career signal / Seoul
            </div>
            <Link href="/contact" className="hidden min-h-11 items-center justify-center rounded-full border border-white/15 bg-white px-5 text-sm font-black text-[#050507] transition hover:bg-[#ff5b2e] hover:text-white sm:inline-flex">
              30분 방향 진단 신청
            </Link>
          </header>

          <div className="relative grid min-w-0 flex-1 items-center gap-8 py-10 lg:grid-cols-[0.82fr_1.18fr] lg:py-12">
            <div className="relative z-20 w-full max-w-[22rem] min-w-0 sm:max-w-3xl">
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#ff6b35]">AI Career Intelligence</p>
              <h1 className="mt-5 max-w-full break-all text-[clamp(2.65rem,13vw,3.35rem)] sm:break-normal font-black leading-[0.9] tracking-[-0.075em] text-white sm:leading-[0.78] sm:tracking-[-0.13em] sm:text-[7rem] lg:text-[8.8rem]">
                커리어는
                <br />
                이제 해석의
                <br />
                문제입니다.
              </h1>
              <div className="mt-7 w-full max-w-[22rem] min-w-0 sm:max-w-2xl border-l border-[#ff5b2e] pl-5">
                <p className="break-words text-base font-bold leading-8 text-[#f3efe7] break-all sm:text-xl sm:break-normal">
                  AI 시대 진로·직업·커리어의 막힌 선택을 읽고, 다음 7일의 행동으로 번역합니다.
                </p>
                <p className="mt-3 break-words text-sm leading-7 text-[#9ca3af] break-all sm:break-normal">
                  학생 진로, 20대 커리어, 40~50대 후반전 커리어까지. 더 많은 정보가 아니라 지금 선택할 기준을 만듭니다.
                </p>
              </div>
              <div className="mt-8 flex w-full max-w-full flex-col gap-3 sm:flex-row">
                <Link href="/diagnosis" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#ff5b2e] px-6 text-sm font-black text-white shadow-[0_20px_70px_rgba(255,91,46,0.34)] transition hover:bg-white hover:text-[#050507]">
                  3분 커리어 진단 시작
                </Link>
                <Link href="/contact" className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/14 bg-white/[0.04] px-6 text-sm font-black text-white transition hover:border-white/35 hover:bg-white/10 sm:w-auto">
                  30분 방향 진단 신청
                </Link>
              </div>
              <div className="mt-7 grid w-full max-w-[22rem] min-w-0 sm:max-w-xl grid-cols-2 gap-2.5 sm:grid-cols-4">
                {heroChips.map((chip) => (
                  <span key={chip} className="min-w-0 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-center text-[11px] font-black text-white/66 backdrop-blur">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative z-10 min-h-[560px] w-full min-w-0 overflow-hidden lg:min-h-[760px] lg:overflow-visible">
              <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] sm:h-[54rem] sm:w-[54rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_210deg,rgba(255,91,46,0.02),rgba(79,123,255,0.22),rgba(115,214,182,0.12),rgba(255,91,46,0.24),rgba(255,91,46,0.02))] opacity-90 blur-[1px]" />
              <div className="absolute left-1/2 top-1/2 h-[25rem] w-[25rem] sm:h-[39rem] sm:w-[39rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/18" />
              <div className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] sm:h-[25rem] sm:w-[25rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#4b7bff]/28" />

              <div className="absolute left-[4%] right-[4%] top-[8%] z-0 hidden text-center text-[7.5rem] font-black uppercase leading-none tracking-[-0.12em] text-white/[0.045] lg:block">
                CAREER<br />INTEL
              </div>

              <div className="absolute inset-x-0 bottom-0 top-[7%] overflow-hidden rounded-[2rem] sm:inset-x-[7%] sm:top-[3%] sm:rounded-[3rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.02))] shadow-[0_40px_140px_rgba(0,0,0,0.58)] backdrop-blur-sm">
                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:38px_38px]" />
                <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/24 to-transparent" />
                <img
                  src="/sunyong-profile.jpg"
                  alt="AI 시대 커리어 인텔리전스 스튜디오 숨의 시그니처 인물 사진"
                  className="absolute bottom-0 left-1/2 h-[98%] max-w-none -translate-x-1/2 object-contain grayscale contrast-125 saturate-50 [filter:grayscale(1)_contrast(1.2)_drop-shadow(0_28px_80px_rgba(0,0,0,0.74))]"
                />
                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#080b12]/72 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050507] via-[#050507]/42 to-transparent" />
              </div>

              <div className="absolute left-0 top-[12%] z-20 w-[min(13.5rem,56vw)] rounded-3xl border border-white/12 bg-[#080b12]/78 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.42)] backdrop-blur-md transition hover:-translate-y-1 hover:border-[#ff5b2e]/55">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#ff6b35]">AI SIGNAL</p>
                <p className="mt-2 text-xl font-black tracking-[-0.05em] text-white">직업 변화 감지</p>
                <div className="mt-4 flex items-end gap-1.5">{[18, 28, 14, 34, 24, 42].map((h) => <span key={h} className="w-1.5 rounded-full bg-[#ff5b2e]" style={{ height: `${h}px` }} />)}</div>
              </div>

              <div className="absolute right-0 top-[18%] z-20 w-[min(14rem,50vw)] rounded-3xl border border-white/12 bg-[#080b12]/78 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.42)] backdrop-blur-md transition hover:-translate-y-1 hover:border-[#4b7bff]/55">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#4b7bff]">CAREER MAP</p>
                <div className="mt-4 grid gap-2 text-xs font-bold text-white/70">
                  <span>Student / Parent</span>
                  <span>20s Career</span>
                  <span>Second Career</span>
                </div>
              </div>

              <div className="absolute bottom-[16%] left-0 z-20 w-[min(14.5rem,58vw)] sm:left-[3%] rounded-3xl border border-white/12 bg-[#f3efe7] p-4 text-[#080b12] shadow-[0_22px_70px_rgba(0,0,0,0.34)] transition hover:-translate-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#9b3a1c]">NEXT ACTION</p>
                <p className="mt-2 text-2xl font-black leading-none tracking-[-0.07em]">7일 행동 3개</p>
                <p className="mt-3 text-xs font-bold leading-5 text-[#4b5563]">정답보다 먼저 움직일 기준을 만듭니다.</p>
              </div>

              <div className="absolute bottom-[9%] right-0 z-20 w-[min(15rem,58vw)] sm:right-[3%] rounded-3xl border border-white/12 bg-[#080b12]/78 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.42)] backdrop-blur-md transition hover:-translate-y-1 hover:border-[#73d6b6]/55">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#73d6b6]">WORK SHIFT</p>
                <p className="mt-2 text-sm font-bold leading-6 text-white/76">정보 → 기준 → 문장 → 행동</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[72%] rounded-full bg-[#73d6b6]" /></div>
              </div>

              <div className="absolute left-1/2 top-[52%] z-30 hidden -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/54 backdrop-blur lg:block">
                READ → TRANSLATE → ACT
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="intelligence" className="overflow-hidden border-b border-white/10 bg-[#080b12]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-4xl">
            <SectionLabel>Why People Are Stuck</SectionLabel>
            <h2 className="mt-5 break-words text-[2.2rem] font-black leading-[1.06] tracking-[-0.045em] text-white break-all sm:break-normal sm:text-[4.5rem] sm:leading-[0.98] sm:tracking-[-0.08em]">
              선택이 막히는 이유는
              <br />
              정보 부족이 아닐 때가 많습니다.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {problemCards.map((card, index) => (
              <article key={card.label} className="group min-h-[20rem] rounded-[34px] border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#4f8cff]/45 hover:bg-white/[0.06]">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[11px] font-black tracking-[0.22em] text-[#73d6b6]">{card.label}</p>
                  <span className="text-xs font-black text-white/28">0{index + 1}</span>
                </div>
                <h3 className="mt-10 text-[1.9rem] font-black leading-[1.02] tracking-[-0.06em] text-white">{card.title}</h3>
                <p className="mt-5 text-sm leading-7 text-[#aab0bb]">{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="method" className="border-b border-white/10 bg-[#050507]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:px-10 lg:py-24">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <SectionLabel>Read / Translate / Act</SectionLabel>
            <h2 className="mt-5 break-words text-[2.15rem] font-black leading-[1.06] tracking-[-0.045em] text-white break-all sm:break-normal sm:text-[4.2rem] sm:leading-[1] sm:tracking-[-0.078em]">
              숨은 커리어를
              <br />
              세 단계로 봅니다.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#9ca3af]">
              감으로 찍지 않습니다. 흐름을 읽고, 막힌 말을 번역하고, 다음 행동으로 접습니다.
            </p>
          </div>
          <div className="relative grid gap-5 before:absolute before:left-6 before:top-6 before:hidden before:h-[calc(100%-3rem)] before:w-px before:bg-gradient-to-b before:from-[#ff5b2e] before:via-white/15 before:to-[#4f8cff] sm:before:block">
            {methodSteps.map((step, index) => (
              <article key={step.step} className="relative rounded-[34px] border border-white/10 bg-[#0b0f17] p-6 transition hover:border-[#ff5b2e]/45 hover:bg-[#101622] sm:ml-14">
                <div className="absolute -left-[3.95rem] top-7 hidden h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#050507] text-sm font-black text-[#ff5b2e] sm:flex">
                  {index + 1}
                </div>
                <p className="text-[11px] font-black tracking-[0.26em] text-[#ff6b35]">{step.step}</p>
                <h3 className="mt-4 text-[2rem] font-black tracking-[-0.06em] text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#aab0bb]">{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#080b12]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <SectionLabel>Audience Tracks</SectionLabel>
          <h2 className="mt-5 break-words text-[2.2rem] font-black leading-[1.06] tracking-[-0.045em] text-white break-all sm:break-normal sm:text-[4.5rem] sm:leading-[0.98] sm:tracking-[-0.08em]">누구에게 필요한가</h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {audienceTracks.map((track) => (
              <article key={track.title} className="rounded-[34px] border border-white/10 bg-white/[0.035] p-6 transition hover:-translate-y-1 hover:border-[#73d6b6]/45 hover:bg-white/[0.06]">
                <p className="text-[11px] font-black tracking-[0.26em] text-[#4f8cff]">TRACK {track.label}</p>
                <h3 className="mt-5 text-[2.25rem] font-black tracking-[-0.075em] text-white">{track.title}</h3>
                <div className="mt-7 grid gap-2.5">
                  {track.items.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-[#050507]/52 px-4 py-3 text-sm font-bold text-white/70">
                      {item}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="offer" className="border-b border-white/10 bg-[#050507]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:py-24">
          <div>
            <SectionLabel>Primary Session</SectionLabel>
            <h2 className="mt-5 break-words text-[2.15rem] font-black leading-[1.06] tracking-[-0.045em] text-white break-all sm:break-normal sm:text-[4.2rem] sm:leading-[1] sm:tracking-[-0.078em]">
              30분이면 정답은 몰라도,
              <br />
              다음 행동은 정할 수 있습니다.
            </h2>
          </div>
          <div className="rounded-[40px] border border-white/10 bg-[#f4e7d0] p-6 text-[#080b12] shadow-[0_30px_100px_rgba(244,231,208,0.08)] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-[#9c4a24]">30-minute AI Career Direction Session</p>
            <h3 className="mt-5 text-[2.35rem] font-black leading-[1] tracking-[-0.08em]">30분 AI 커리어 방향 진단</h3>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {offerItems.map((item) => (
                <div key={item} className="rounded-2xl border border-[#080b12]/10 bg-white/55 px-4 py-4 text-sm font-black text-[#18140f]">
                  {item}
                </div>
              ))}
            </div>
            <Link href="/contact" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[#080b12] px-6 text-sm font-black text-white transition hover:bg-[#ff5b2e]">
              내 상황 정리하기
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#080b12]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <SectionLabel>Operating System</SectionLabel>
              <h2 className="mt-5 break-words text-[2.15rem] font-black leading-[1.06] tracking-[-0.045em] text-white break-all sm:break-normal sm:text-[4.2rem] sm:leading-[1] sm:tracking-[-0.078em]">
                매일 자료를 보고,
                <br />
                글과 상담의 기준을 업데이트합니다.
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-[#aab0bb]">
                숨은 감으로만 말하지 않습니다. 매일 진로, 직업, AI 커리어 자료를 수집하고 학생·20대·중장년의 선택 문제로 번역합니다.
              </p>
            </div>
            <div className="grid min-w-0 gap-3 self-end">
              {pipeline.map((item, index) => (
                <div key={item} className="grid min-w-0 grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[24px] border border-white/10 bg-white/[0.035] px-5 py-5 transition hover:border-[#4f8cff]/45 hover:bg-white/[0.06]">
                  <span className="text-xs font-black text-[#ff5b2e]">0{index + 1}</span>
                  <span className="min-w-0 text-xl font-black tracking-[-0.04em] text-white">{item}</span>
                  <SignalBar index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#050507]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-end lg:px-10 lg:py-24">
          <div>
            <SectionLabel>Final Action</SectionLabel>
            <h2 className="mt-5 max-w-5xl text-[2.8rem] font-black leading-[0.96] tracking-[-0.085em] text-white sm:text-[5rem]">
              지금 막힌 선택을
              <br />
              하나만 가져오세요.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#aab0bb]">
              과목, 학과, 이력서, 퇴사, 재취업, AI 활용. 문제를 크게 들고 와도 괜찮습니다. 먼저 한 문장으로 접고, 다음 행동 하나부터 정리합니다.
            </p>
          </div>
          <Link href="/contact" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[#050507] transition hover:bg-[#ff5b2e] hover:text-white">
            30분 방향 진단 신청
          </Link>
        </div>
      </section>
    </main>
  );
}
