import Link from "next/link";
import SiteHeader from "@/components/site-header";

const consultingPrograms = [
  {
    title: "AI 시대 진로 진단",
    desc: "머릿속에서만 맴도는 불안과 선택지를 꺼내놓고, 지금 당장 붙잡을 수 있는 방향부터 같이 정리합니다.",
  },
  {
    title: "커리어 리디자인",
    desc: "지금까지 해온 일을 버리지 않고, AI 시대에 다시 써먹을 수 있는 언어와 흐름으로 바꿔봅니다.",
  },
  {
    title: "AI 활용 포트폴리오 기획",
    desc: "툴 사용법만 배우고 끝나지 않도록, 내 이름으로 보여줄 수 있는 결과물의 뼈대를 만듭니다.",
  },
];

const audience = [
  "요즘 자꾸 “내 일이 계속 괜찮을까?”라는 생각이 드는 분",
  "이직, 전환, 재시작을 생각하지만 말로 정리가 잘 안 되는 분",
  "자격증, 경험, 관심사는 있는데 어떻게 팔 수 있을지 막막한 분",
  "비개발자지만 AI로 내 결과물을 직접 만들어보고 싶은 분",
];

const methodSteps = [
  {
    step: "01",
    title: "일단 지금 이야기를 꺼냅니다",
    desc: "경력, 관심, 강점, 불안 요소를 평가하듯 묻지 않고 차분히 펼쳐봅니다.",
  },
  {
    step: "02",
    title: "사라질 일보다 남길 일을 봅니다",
    desc: "AI가 빼앗는 것만 보지 않고, 내 경험과 조합해 다시 만들 수 있는 역할을 찾습니다.",
  },
  {
    step: "03",
    title: "다음 2주를 작게 정합니다",
    desc: "거창한 결심 대신 오늘 이후 실제로 움직일 수 있는 작은 실행안을 남깁니다.",
  },
];

const proofPoints = [
  "직업상담사 관점으로 불안을 무시하지 않습니다",
  "기획자 관점으로 생각을 결과물 형태로 정리합니다",
  "비개발자로 AI를 써서 실제 제품을 만들어본 경험이 있습니다",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5efe5] text-[#15120d]">
      <section className="relative overflow-hidden border-b border-[#d9cbb8] bg-[#f5efe5]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0)_28%),radial-gradient(circle_at_82%_12%,rgba(238,169,88,0.32)_0%,rgba(238,169,88,0)_26%),linear-gradient(135deg,#f8f2e8_0%,#e9dccb_48%,#f5efe5_100%)]" />
        <div className="absolute bottom-[-18rem] right-[-12rem] h-[38rem] w-[38rem] rounded-full border border-[#c99f6a]/40 bg-[#d99b52]/10 blur-2xl" />

        <div className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col px-5 pb-8 pt-4 sm:px-8 lg:px-10">
          <SiteHeader current="home" ctaHref="/contact" ctaLabel="상담 문의" />

          <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
            <div>
              <p className="text-xs font-semibold tracking-[0.28em] text-[#9a6b32]">SOOM CAREER DESIGN</p>
              <h1 className="mt-5 max-w-4xl text-[3.2rem] font-semibold leading-[0.96] tracking-[-0.075em] text-[#15120d] sm:text-[5.2rem] lg:text-[6.6rem]">
                AI 시대,
                <br />
                내 일을
                <br />
                다시 붙잡습니다
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-[#5c5146] sm:text-lg">
                막연히 불안한데 어디서부터 말해야 할지 모르겠다면, 거기서부터 시작해도 됩니다. 숨은 진로 상담과 기획의 언어로 지금의 고민을 다음 행동으로 바꿉니다.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#17130d] px-6 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(23,19,13,0.16)]">
                  진로 상담 문의
                </Link>
                <Link href="#programs" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#cdbda6] bg-white/60 px-6 text-sm font-semibold text-[#22180d]">
                  프로그램 보기
                </Link>
              </div>
            </div>

            <div className="rounded-[38px] border border-[#dbcab2] bg-[#17130d] p-5 text-white shadow-[0_28px_80px_rgba(72,50,24,0.18)]">
              <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(155deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))] p-6">
                <p className="text-xs tracking-[0.24em] text-white/42">POSITIONING</p>
                <h2 className="mt-4 text-[2rem] font-semibold leading-[1.08] tracking-[-0.05em] sm:text-[2.7rem]">
                  불안을 듣고,
                  <br />
                  흐름을 잡고,
                  <br />
                  실행을 남깁니다
                </h2>
                <div className="mt-8 grid gap-3">
                  {proofPoints.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-6 text-white/76">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="programs" className="bg-[#15120d] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.24em] text-white/42">PROGRAMS</p>
            <h2 className="mt-5 text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.06em] sm:text-[4rem]">
              괜찮다는 말만 하고
              <br />
              끝내지 않겠습니다
            </h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {consultingPrograms.map((item) => (
              <article key={item.title} className="rounded-[32px] border border-white/10 bg-white/[0.04] p-7">
                <h3 className="text-[1.55rem] font-semibold tracking-[-0.04em]">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/64">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5efe5]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-24">
          <div>
            <p className="text-xs tracking-[0.24em] text-[#9a6b32]">WHO IT IS FOR</p>
            <h2 className="mt-5 text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.055em] text-[#15120d] sm:text-[3.4rem]">
              이런 분들을 위해
              <br />
              만들었습니다
            </h2>
            <p className="mt-6 text-sm leading-7 text-[#6b5d4f] sm:text-base">
              답을 대신 정해드리기보다, 혼자서는 흐릿했던 경험과 가능성을 같이 정리해 다음 행동이 보이게 만듭니다.
            </p>
          </div>
          <div className="grid gap-3">
            {audience.map((item) => (
              <div key={item} className="rounded-[24px] border border-[#dfd0bd] bg-white/72 px-5 py-5 text-sm font-medium text-[#30261b] shadow-[0_14px_34px_rgba(72,50,24,0.06)]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#efe4d5]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="rounded-[40px] border border-[#d8c5ac] bg-[#fffaf2] p-7 shadow-[0_24px_70px_rgba(72,50,24,0.1)] sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="text-xs tracking-[0.24em] text-[#9a6b32]">METHOD</p>
                <h2 className="mt-5 text-[2.1rem] font-semibold leading-[1.07] tracking-[-0.055em] text-[#15120d] sm:text-[3.2rem]">
                  모라는 이렇게
                  <br />
                  함께 정리합니다
                </h2>
                <p className="mt-6 text-sm leading-7 text-[#6b5d4f]">
                  모라는 이 프로젝트에서 함께 생각을 붙잡는 AI 파트너입니다. 말이 길어져도 괜찮습니다. 흩어진 문장 안에서 질문, 강점, 다음 행동을 같이 찾아냅니다.
                </p>
              </div>
              <div className="grid gap-4">
                {methodSteps.map((item) => (
                  <article key={item.step} className="rounded-[26px] border border-[#e2d2bd] bg-white px-5 py-5">
                    <p className="text-[11px] font-semibold tracking-[0.22em] text-[#b27a35]">STEP {item.step}</p>
                    <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[#15120d]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#6b5d4f]">{item.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#15120d] text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:px-10">
          <div>
            <p className="text-xs tracking-[0.24em] text-white/38">START</p>
            <h2 className="mt-4 text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.05em] sm:text-[3rem]">
              아직 정리되지 않은 말이어도 괜찮습니다.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">
              “이게 상담할 만한 고민인가?” 싶어도 괜찮습니다. 현재 상황을 남겨주시면 가장 현실적인 시작점을 함께 찾겠습니다.
            </p>
          </div>
          <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#15120d]">
            상담 문의하기
          </Link>
        </div>
      </section>
    </main>
  );
}
