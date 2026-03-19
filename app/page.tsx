import Link from "next/link";

const focusAreas = [
  {
    title: "전달을 위한 제작",
    desc: "행사 페이지, 부서 소개, 신청 웹, PPT, 유인물처럼 교회가 바로 설명하고 바로 전달할 수 있는 결과물을 만듭니다.",
  },
  {
    title: "반복을 위한 콘텐츠",
    desc: "설교 쇼츠, 하이라이트 영상, 반복 전달용 콘텐츠처럼 한 번으로 끝나지 않는 작업을 꾸준히 이어갑니다.",
  },
  {
    title: "운영을 위한 구조",
    desc: "명단 관리, 신청·설문, 데이터 정리, 운영용 웹처럼 교회 안에서 반복되는 흐름을 더 단순하게 만듭니다.",
  },
];

const featuredServices = [
  {
    title: "랜딩페이지",
    price: "30만 원부터",
    desc: "행사, 부서, 집회, 모집 안내를 한 페이지에 깔끔하게 정리해 링크 하나로 바로 전달할 수 있게 만듭니다.",
    note: "기본 반응형 페이지 기준 / 신청·설문·DB 기능은 추가 견적",
  },
  {
    title: "설교 쇼츠 패키지",
    price: "월 4개 19만 원부터",
    desc: "주일 설교 핵심 구간을 짧게 정리해 교회 채널과 성도에게 다시 전달할 수 있도록 반복 납품합니다.",
    note: "설교 핵심을 짧고 선명하게 다시 전하는 반복 패키지",
  },
  {
    title: "간편 명단 관리 웹",
    price: "MVP 49만 원부터",
    desc: "작은 조직이나 부서가 명단, 신청, 상태, 담당 내용을 헷갈리지 않게 정리하고 공유할 수 있는 운영용 웹입니다.",
    note: "작은 조직이 바로 쓸 수 있는 운영 도구",
  },
];

const extraServices = [
  { title: "PPT 기획 및 제작", price: "장당 3만 원부터" },
  { title: "유인물 디자인", price: "15만 원부터" },
  { title: "고퀄리티 AI 영상", price: "15초 50만 원부터" },
  { title: "신청·설문·DB 기능 추가", price: "기능별 별도 견적" },
];

const processSteps = [
  "어떤 작업이 필요한지 간단히 알려주세요",
  "필요 범위와 일정만 빠르게 정리합니다",
  "합의된 범위대로 제작 후 납품합니다",
  "필요하면 반복 납품과 운영 구조까지 이어갑니다",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050b16] text-white">
      <section className="relative min-h-screen overflow-hidden bg-[#050b16]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-church-main.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,22,0.56)_0%,rgba(5,11,22,0.28)_38%,rgba(5,11,22,0.2)_62%,rgba(5,11,22,0.48)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,22,0.24)_0%,rgba(5,11,22,0.12)_30%,rgba(5,11,22,0.38)_74%,rgba(5,11,22,0.74)_100%)]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 pb-8 pt-4 sm:px-8 sm:pt-6 lg:px-10">
          <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
            <div className="justify-self-start">
              <details className="group relative lg:hidden">
                <summary className="flex min-h-9 min-w-9 cursor-pointer list-none items-center justify-center rounded-full border border-white/60 bg-black/10 px-3 text-white backdrop-blur-sm transition hover:bg-white/10 [&::-webkit-details-marker]:hidden">
                  <span className="text-lg leading-none">☰</span>
                </summary>
                <div className="absolute left-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-2xl border border-white/12 bg-[#0a1122]/96 p-2 text-sm text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                  <a href="#message" className="block rounded-xl px-3 py-2.5 transition hover:bg-white/8">Message</a>
                  <a href="#concept" className="block rounded-xl px-3 py-2.5 transition hover:bg-white/8">Concept</a>
                  <a href="#featured" className="block rounded-xl px-3 py-2.5 transition hover:bg-white/8">Services</a>
                  <a href="#contact" className="block rounded-xl px-3 py-2.5 transition hover:bg-white/8">Contact</a>
                </div>
              </details>
              <nav className="hidden items-center gap-5 text-[13px] font-medium text-white/90 lg:flex xl:gap-6">
                <a href="#message" className="transition hover:text-white/70">Message</a>
                <a href="#concept" className="transition hover:text-white/70">Concept</a>
                <a href="#featured" className="transition hover:text-white/70">Services</a>
                <a href="#contact" className="transition hover:text-white/70">Contact</a>
              </nav>
            </div>
            <Link href="/" className="justify-self-center text-center font-display text-[1.65rem] font-semibold tracking-[-0.08em] text-white sm:text-[2.2rem]">
              soom
            </Link>
            <div className="justify-self-end">
              <Link href="/login" className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/60 px-3.5 py-2 text-[11px] font-medium text-white backdrop-blur-sm transition hover:bg-white/10 sm:min-h-11 sm:px-5 sm:text-sm">
                로그인
              </Link>
            </div>
          </header>

          <div className="relative flex flex-1 flex-col justify-center pb-16 pt-16 sm:pt-28 lg:pb-16 lg:pt-24">
            <div className="mx-auto w-full max-w-[1180px] text-center">
              <h1 className="font-display text-[1.95rem] font-light leading-[1.08] tracking-[-0.05em] text-white sm:text-[3.9rem] md:text-[4.9rem] lg:text-[5.9rem] xl:text-[6.5rem]">
                <span className="block sm:hidden">목회에 집중하세요.</span>
                <span className="block sm:hidden">나머지는 저희가</span>
                <span className="block sm:hidden">맡겠습니다.</span>
                <span className="hidden whitespace-nowrap sm:block">목회에 집중하세요.</span>
                <span className="hidden whitespace-nowrap sm:block lg:translate-x-[0.32em]">나머지는 저희가 맡겠습니다.</span>
              </h1>
            </div>

            <p className="mx-auto mt-4 text-center text-[12px] tracking-[0.16em] text-white/62 sm:mt-6 sm:text-[13px]">
              -모두의 집사-
            </p>

            <div className="mx-auto mt-5 max-w-[320px] text-center text-[13px] leading-6 text-white/82 sm:mt-8 sm:max-w-[760px] sm:text-[15px] sm:leading-7">
              <div className="sm:hidden">
                <p>숨은 교회가 필요한 디지털 작업을</p>
                <p>가장 쉽게 맡길 수 있도록 돕는 팀입니다.</p>
              </div>
              <div className="hidden sm:block">
                <p>숨은 교회가 필요한 디지털 작업을</p>
                <p>가장 쉽게 맡길 수 있도록 돕는 실행 파트너입니다.</p>
              </div>
            </div>

            <div className="mx-auto mt-6 flex w-full max-w-[320px] flex-col items-center justify-center gap-2.5 sm:mt-9 sm:max-w-none sm:flex-row sm:gap-4">
              <a href="#featured" className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/55 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 sm:min-h-12 sm:min-w-[168px] sm:w-auto sm:px-6">
                대표 서비스 보기
              </a>
              <a href="#contact" className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.28)] sm:min-h-12 sm:min-w-[168px] sm:w-auto sm:px-6">
                문의하기
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="message" className="border-t border-white/10 bg-[#f4f5f7] text-[#0a1020]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[11px] font-medium tracking-[0.24em] text-[#5c6785]">MESSAGE</p>
              <h2 className="mt-5 text-[2.5rem] font-normal tracking-[-0.04em] text-[#0a1226] sm:text-[3.7rem] lg:text-[4.8rem]" style={{ fontFamily: "var(--font-serif-ko)" }}>
                사람에 더 집중하고,
                <br />
                기술은 더 조용하게.
              </h2>
            </div>
            <div className="max-w-[560px] text-[15px] leading-8 text-[#44506d]">
              <p>
                교회가 사람을 더 잘 돌보고 메시지를 더 선명하게 전할 수 있도록,
                필요한 디지털 작업을 복잡한 설명 없이 단정한 구조로 정리하고 제작합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="concept" className="bg-[#050b16]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="max-w-5xl">
            <p className="text-[11px] font-medium tracking-[0.24em] text-white/42">CONCEPT</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              상품이 많은 팀이 아니라,
              <br />
              교회 일을 정리해주는 팀이어야 합니다.
            </h2>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-white/62 sm:text-base">
              숨은 웹, 디자인, 영상, 운영 도구를 따로 파는 팀이 아니라,
              교회가 설명하기 어렵고 손이 많이 가는 디지털 작업을 가장 이해하기 쉬운 결과물로 정리해주는 팀이 되려고 합니다.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {focusAreas.map((area) => (
              <article key={area.title} className="rounded-[30px] border border-white/10 bg-[#0b1327]/88 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.28)] sm:p-7">
                <h3 className="text-[1.6rem] font-semibold tracking-[-0.03em] text-white sm:text-[1.8rem]">{area.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/62">{area.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="featured" className="bg-[linear-gradient(180deg,#0b1327_0%,#050b16_100%)]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-[11px] font-medium tracking-[0.24em] text-white/42">FEATURED SERVICES</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              먼저 보여드릴 대표 서비스
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              처음 미팅에서 설명하기 쉽고, 교회가 실제로 가장 빠르게 이해할 수 있는 대표 서비스부터 보여드립니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <article key={service.title} className="rounded-[30px] border border-white/10 bg-[#0b1327]/88 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.28)] sm:p-7">
                <p className="text-[11px] tracking-[0.18em] text-white/42">PRICE</p>
                <p className="mt-3 text-[1.8rem] font-semibold leading-none text-white sm:text-[2rem]">{service.price}</p>
                <h3 className="mt-5 text-2xl font-semibold text-white">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/66">{service.desc}</p>
                <p className="mt-4 text-sm text-white/50">{service.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f5f7] text-[#0a1020]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-[11px] font-medium tracking-[0.24em] text-[#5c6785]">EXTRA SERVICES</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                필요하면 함께
                <br />
                확장할 수 있습니다
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {extraServices.map((item) => (
                <div key={item.title} className="rounded-[24px] border border-[#d9deea] bg-white px-5 py-5 shadow-[0_16px_40px_rgba(20,30,60,0.08)]">
                  <p className="text-[1.05rem] font-semibold text-[#0a1226]">{item.title}</p>
                  <p className="mt-2 text-sm text-[#44506d]">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#050b16]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-8 rounded-[38px] border border-white/10 bg-[#0b1327]/92 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.42)] lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
            <div>
              <p className="text-[11px] font-medium tracking-[0.24em] text-white/42">CONTACT</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
                길게 설명하지 않아도 됩니다
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                어떤 작업이 필요한지, 언제까지 필요한지만 알려주세요.
                가장 가볍게 시작할 수 있는 방식으로 정리해 제안합니다.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.28)]">
                  작업 문의 남기기
                </Link>
                <a href="#featured" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white">
                  대표 서비스 먼저 보기
                </a>
              </div>
            </div>
            <div className="grid gap-3">
              {processSteps.map((step, index) => (
                <div key={step} className="rounded-[26px] border border-white/8 bg-[#091122] px-5 py-5 shadow-[0_16px_40px_rgba(2,6,23,0.24)]">
                  <p className="text-xs tracking-[0.16em] text-white/42">0{index + 1}</p>
                  <p className="mt-2 text-sm text-white/82">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
