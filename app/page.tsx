import Link from "next/link";

const solutions = [
  {
    label: "제작",
    title: "행사 페이지와 설교 콘텐츠를 빠르게 제작합니다",
    desc: "교회가 지금 바로 써야 하는 페이지와 영상을 단정하게 정리합니다.",
  },
  {
    label: "운영",
    title: "신청 웹과 운용 도구를 가볍고 명확하게 구축합니다",
    desc: "복잡한 흐름보다 현장에서 바로 쓰는 구조를 먼저 만듭니다.",
  },
  {
    label: "콘텐츠",
    title: "설교 요약과 나눔지, 음성 콘텐츠까지 이어갑니다",
    desc: "메시지가 한 번 전달되고 끝나지 않도록 콘텐츠 흐름을 연결합니다.",
  },
];

const outputs = [
  { title: "행사·부서 랜딩페이지", meta: "6.9만 원부터", desc: "교회가 가장 빠르게 결정할 수 있는 대표 상품" },
  { title: "설교 쇼츠 패키지", meta: "월 4개 5만 원", desc: "주일 설교 핵심 구간 반복 납품" },
  { title: "AI 영상 제작", meta: "15초 5만 원부터", desc: "행사 홍보, 설교 하이라이트, 사역 소개용" },
  { title: "간편 명단 관리 웹", meta: "MVP 15만 원", desc: "작은 조직이 바로 쓸 수 있는 운영용 도구" },
];

const principles = [
  "교회가 지금 바로 써야 하는 결과물부터 시작",
  "짧은 납기와 명확한 범위",
  "운영과 유지보수는 별도",
  "작은 납품에서 플랫폼 구조로 확장",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050b16] text-white">
      <section className="relative min-h-screen overflow-hidden bg-[#050b16]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-church-main.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,22,0.86)_0%,rgba(5,11,22,0.72)_38%,rgba(5,11,22,0.42)_62%,rgba(5,11,22,0.68)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,22,0.12)_0%,rgba(5,11,22,0.36)_58%,rgba(5,11,22,0.74)_100%)]" />
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 pb-10 pt-6 sm:px-8 lg:px-10">
          <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <nav className="hidden items-center gap-2 text-sm text-white/68 lg:flex">
              <a href="#message" className="rounded-full px-4 py-2 transition hover:bg-white/[0.06] hover:text-white">Message</a>
              <a href="#solutions" className="rounded-full px-4 py-2 transition hover:bg-white/[0.06] hover:text-white">Solutions</a>
              <a href="#outputs" className="rounded-full px-4 py-2 transition hover:bg-white/[0.06] hover:text-white">Outputs</a>
              <a href="#contact" className="rounded-full px-4 py-2 transition hover:bg-white/[0.06] hover:text-white">Consulting</a>
            </nav>
            <Link href="/" className="justify-self-center inline-flex items-center rounded-full border border-white/10 bg-black/20 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-sm">
              <span className="font-display text-sm tracking-[0.2em] text-white/86">SOOM</span>
            </Link>
            <div className="justify-self-end">
              <Link href="/login" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-black/20 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/28">
                로그인
              </Link>
            </div>
          </header>

          <div className="mt-auto grid gap-8 pb-10 pt-20 lg:pb-16 lg:pt-28">
            <div className="relative z-10 max-w-5xl">
              <h1 className="mt-6 max-w-5xl text-[2.9rem] font-semibold leading-[0.94] text-white sm:text-6xl lg:text-[6.2rem]">
                교회 홈페이지부터 운용 도구까지,
                <br />
                빠르게 시작하세요
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-7 text-white/82 sm:text-lg sm:leading-8">
                행사, 설교, 신청, 운영에 필요한 디지털 작업을
                <br />
                교회에 맞는 구조로 정리하고 제작합니다.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#outputs" className="inline-flex min-h-12 items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.28)]">대표 상품 보기</a>
                <a href="#contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-black/20 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm">상담 문의</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="message" className="border-t border-white/10 bg-[#f4f5f7] text-[#0a1020]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <p className="font-display text-xs tracking-[0.2em] text-[#4d5a7a]">MESSAGE</p>
          <h2 className="mt-6 max-w-6xl text-[3rem] font-semibold leading-[0.95] sm:text-6xl lg:text-[7rem]">
            교회 운영은 더 단정하게.
            <br />
            메시지는 더 선명하게.
          </h2>
        </div>
      </section>

      <section id="solutions" className="bg-[#050b16]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-display text-xs tracking-[0.2em] text-white/45">SOLUTIONS</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                숨은 교회를 위해
                <br />
                세 가지 방식으로 일합니다.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/62 sm:text-base">
              제작, 운영, 콘텐츠를 따로 보지 않고 교회가 실제로 겪는 필요를 장면처럼 이어서 설계합니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {solutions.map((item) => (
              <article key={item.label} className="rounded-[34px] border border-white/10 bg-[#0b1327]/92 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.34)] sm:p-7">
                <p className="font-display text-xs tracking-[0.18em] text-indigo-100/58">{item.label}</p>
                <h3 className="mt-4 text-3xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/66">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="outputs" className="bg-[linear-gradient(180deg,#0b1327_0%,#050b16_100%)]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-display text-xs tracking-[0.2em] text-white/45">OUTPUTS</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                지금 바로 설명되고,
                <br />
                바로 납품되는 결과물.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/62 sm:text-base">
              제품처럼 보이지만 설명은 짧고 분명해야 합니다. 교회가 듣자마자 이해할 수 있는 구조로 제안합니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {outputs.map((item) => (
              <article key={item.title} className="rounded-[32px] border border-white/10 bg-[#0b1327]/88 p-6 shadow-[0_20px_70px_rgba(2,6,23,0.34)] sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-white sm:text-3xl">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/66">{item.desc}</p>
                  </div>
                  <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs tracking-[0.12em] text-white/55">
                    {item.meta}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f5f7] text-[#0a1020]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="font-display text-xs tracking-[0.2em] text-[#4d5a7a]">EXPANSION</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                작은 납품에서 시작해,
                <br />
                교회별 운용 구조로 확장합니다.
              </h2>
            </div>
            <div className="grid gap-3">
              {principles.map((item) => (
                <div key={item} className="rounded-[26px] border border-[#d9deea] bg-white px-5 py-5 text-sm leading-7 text-[#22304f] shadow-[0_16px_40px_rgba(20,30,60,0.08)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-white/10 bg-[#050b16]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-8 rounded-[38px] border border-white/10 bg-[#0b1327]/92 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.42)] lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
            <div>
              <p className="font-display text-xs tracking-[0.2em] text-white/45">CONSULTING</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
                필요한 작업이 있다면
                <br />
                짧고 분명하게 남겨주세요.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                필요한 결과물과 일정만 알려주면 가장 가볍고 빠른 방식으로 제안합니다.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.28)]">
                  문의 남기기
                </Link>
                <a href="#outputs" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white">
                  대표 결과물 보기
                </a>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-[26px] border border-white/8 bg-[#091122] px-5 py-5"><p className="text-xs tracking-[0.16em] text-white/42">01</p><p className="mt-2 text-sm text-white/78">원하는 작업을 간단히 알려주세요</p></div>
              <div className="rounded-[26px] border border-white/8 bg-[#091122] px-5 py-5"><p className="text-xs tracking-[0.16em] text-white/42">02</p><p className="mt-2 text-sm text-white/78">필요 범위와 납기만 빠르게 정리합니다</p></div>
              <div className="rounded-[26px] border border-white/8 bg-[#091122] px-5 py-5"><p className="text-xs tracking-[0.16em] text-white/42">03</p><p className="mt-2 text-sm text-white/78">합의된 범위대로 제작 후 납품합니다</p></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
