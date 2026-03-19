import Link from "next/link";

const problemPoints = [
  "하고 싶은 말은 많은데, 어떻게 보여줘야 할지 정리가 어렵습니다.",
  "홈페이지, 디자인, 영상을 따로 맡기면 메시지 흐름이 끊깁니다.",
  "급하게 만들면 결과물은 생겨도 브랜드 인상은 남지 않습니다.",
  "사역자는 본질에 집중해야 하는데 디지털 실무가 계속 쌓입니다.",
];

const solutions = [
  {
    title: "전달을 위한 제작",
    desc: "행사, 부서, 집회, 모집, 소개처럼 교회가 꼭 설명해야 하는 내용을 링크 하나, 화면 하나, 결과물 하나로 정리합니다.",
  },
  {
    title: "반복을 위한 콘텐츠",
    desc: "설교 쇼츠, 카드뉴스, 하이라이트처럼 한 번 만들고 끝나는 작업이 아니라 계속 쌓이고 반복 전달되는 콘텐츠를 만듭니다.",
  },
  {
    title: "운영을 위한 구조",
    desc: "신청, 설문, 명단 관리, 내부 정리처럼 사역 현장에서 반복되는 흐름을 더 단순하고 덜 헷갈리게 만듭니다.",
  },
];

const featuredServices = [
  {
    title: "랜딩페이지",
    price: "30만 원부터",
    desc: "행사, 집회, 모집, 사역 소개를 한 페이지에 깔끔하게 정리해 링크 하나로 바로 전달할 수 있게 만듭니다.",
    note: "반응형 기본 페이지 기준 / 신청·설문·DB 기능은 추가 견적",
  },
  {
    title: "설교·사역 콘텐츠 디자인",
    price: "장당 3만 원부터",
    desc: "설교 PPT, 안내 자료, 유인물, 리플렛처럼 메시지를 더 잘 읽히게 만드는 디자인 작업입니다.",
    note: "PPT / 유인물 / 리플렛 / 소개 자료 등 목적에 맞게 구성",
  },
  {
    title: "AI 영상 제작",
    price: "15초 50만 원부터",
    desc: "짧지만 인상 깊은 영상으로 사역의 메시지와 분위기를 전달합니다.",
    note: "15초 / 30초 / 1분 단위 제작 가능",
  },
];

const extraServices = [
  "설교 쇼츠 패키지 — 월 4개 19만 원부터",
  "유인물 디자인 — 15만 원부터",
  "3단 리플렛 — 30만 원부터",
  "신청·설문·DB 기능 추가 — 별도 견적",
  "간편 명단 관리 웹 — MVP 49만 원부터",
];

const processSteps = [
  "필요한 작업을 간단히 알려주세요",
  "범위와 일정을 빠르게 정리합니다",
  "합의된 범위대로 제작합니다",
  "필요하면 반복 납품과 운영 구조까지 이어갑니다",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050b16] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#050b16]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-church-main.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,22,0.82)_0%,rgba(5,11,22,0.48)_45%,rgba(5,11,22,0.3)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,22,0.24)_0%,rgba(5,11,22,0.2)_30%,rgba(5,11,22,0.76)_100%)]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-10 pt-5 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between gap-4">
            <Link href="/" className="font-display text-[1.85rem] font-semibold tracking-[-0.08em] text-white sm:text-[2.3rem]">
              soom
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-white/80 md:flex">
              <Link href="/">홈</Link>
              <Link href="/pricing">상품</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">문의</Link>
            </nav>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/45 bg-white/5 px-5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              문의하기
            </Link>
          </header>

          <div className="flex flex-1 items-end py-16 sm:py-24 lg:py-28">
            <div className="max-w-4xl">
              <p className="text-xs tracking-[0.24em] text-white/54">CHURCH CONTENT · DESIGN · WEB</p>
              <h1 className="mt-5 font-display text-[2.8rem] font-semibold leading-[1.02] tracking-[-0.06em] text-white sm:text-[4.5rem] lg:text-[6rem]">
                교회와 사역자를 위한
                <br />
                콘텐츠·디자인·웹팀
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                숨(soom)은 교회와 사역의 메시지가 더 선명하게 전달되도록
                홈페이지, 디자인, 영상, 운영용 웹을 만듭니다.
              </p>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/58 sm:text-base">
                복잡하게 흩어진 디지털 작업을 설명하기 쉬운 결과물로 정리합니다.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/pricing" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#09111f] transition hover:bg-white/90">
                  대표 서비스 보기
                </Link>
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 bg-white/5 px-6 text-sm font-medium text-white transition hover:bg-white/10">
                  문의하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f1ec] text-[#0c1220]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-xs tracking-[0.24em] text-[#7a6f67]">PROBLEM</p>
              <h2 className="mt-5 font-display text-[2.2rem] leading-[1.08] tracking-[-0.05em] sm:text-[3.5rem]">
                좋은 내용이 있어도
                <br />
                정리가 안 되면 전달은 약해집니다
              </h2>
            </div>
            <div className="grid gap-3">
              {problemPoints.map((point) => (
                <div key={point} className="rounded-[24px] border border-[#e3ddd4] bg-white px-5 py-5 text-sm leading-7 text-[#3f4759] shadow-[0_16px_40px_rgba(16,24,40,0.06)] sm:text-base">
                  {point}
                </div>
              ))}
              <p className="pt-3 text-sm leading-7 text-[#5d667d] sm:text-base">
                숨은 작업을 하나씩 처리하는 팀이 아니라, 교회와 사역의 전달 방식을 먼저 정리하는 팀입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#070d18]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.24em] text-white/38">SOLUTION</p>
            <h2 className="mt-5 font-display text-[2.2rem] leading-[1.08] tracking-[-0.05em] text-white sm:text-[3.5rem]">
              기획부터 제작까지,
              <br />
              한 흐름으로 정리합니다
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
              웹, 디자인, 영상, 운영 도구를 따로 파는 것이 아니라 실제 필요한 흐름에 맞게 설계합니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {solutions.map((item) => (
              <article key={item.title} className="rounded-[30px] border border-white/10 bg-white/[0.03] p-7 shadow-[0_24px_80px_rgba(2,6,23,0.28)]">
                <h3 className="text-[1.55rem] font-semibold tracking-[-0.03em] text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/62">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#070d18_0%,#111827_100%)]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs tracking-[0.24em] text-white/38">FEATURED SERVICES</p>
              <h2 className="mt-5 font-display text-[2.2rem] leading-[1.08] tracking-[-0.05em] text-white sm:text-[3.5rem]">
                가장 먼저 많이 찾는
                <br />
                대표 서비스
              </h2>
            </div>
            <Link href="/pricing" className="text-sm text-white/62 underline-offset-4 transition hover:text-white hover:underline">
              전체 상품 보기
            </Link>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <article key={service.title} className="rounded-[32px] border border-white/10 bg-[#0b1327]/88 p-7 shadow-[0_24px_80px_rgba(2,6,23,0.36)]">
                <p className="text-xs tracking-[0.22em] text-white/38">STARTING AT</p>
                <p className="mt-3 text-[1.9rem] font-semibold leading-none text-white">{service.price}</p>
                <h3 className="mt-6 text-[1.7rem] font-semibold tracking-[-0.03em] text-white">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/66">{service.desc}</p>
                <p className="mt-4 text-sm leading-6 text-white/42">{service.note}</p>
                <div className="mt-7 flex gap-3">
                  <Link href="/pricing" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-4 text-sm text-white">
                    자세히 보기
                  </Link>
                  <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-[#09111f]">
                    문의하기
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f4ee] text-[#0c1220]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs tracking-[0.24em] text-[#7a6f67]">EXPAND</p>
              <h2 className="mt-5 font-display text-[2.2rem] leading-[1.08] tracking-[-0.05em] sm:text-[3.4rem]">
                필요에 따라 이렇게
                <br />
                확장할 수 있습니다
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#5d667d] sm:text-base">
                대표 서비스로 시작하고, 필요하면 콘텐츠·운영·기능까지 이어서 확장할 수 있습니다.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {extraServices.map((item) => (
                <div key={item} className="rounded-[24px] border border-[#e6dfd5] bg-white px-5 py-5 text-sm leading-7 text-[#334155] shadow-[0_16px_40px_rgba(20,30,60,0.06)] sm:text-base">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#050b16]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-8 rounded-[36px] border border-white/10 bg-[#0b1327]/92 p-7 shadow-[0_24px_80px_rgba(2,6,23,0.42)] lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
            <div>
              <p className="text-xs tracking-[0.24em] text-white/38">PROCESS</p>
              <h2 className="mt-5 font-display text-[2.2rem] leading-[1.08] tracking-[-0.05em] text-white sm:text-[3.2rem]">
                복잡하게 시작하지 않아도 됩니다
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
                정리가 안 된 상태로 문의해도 괜찮습니다. 지금 필요한 수준부터 함께 정리해드립니다.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#09111f]">
                  문의하기
                </Link>
                <Link href="/about" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 text-sm font-medium text-white">
                  About 보기
                </Link>
              </div>
            </div>
            <div className="grid gap-3">
              {processSteps.map((step, index) => (
                <div key={step} className="rounded-[24px] border border-white/8 bg-[#091122] px-5 py-5">
                  <p className="text-xs tracking-[0.16em] text-white/38">0{index + 1}</p>
                  <p className="mt-2 text-sm leading-7 text-white/82">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f1ec] text-[#0c1220]">
        <div className="mx-auto max-w-7xl px-5 py-18 sm:px-8 lg:px-10 lg:py-20">
          <div className="rounded-[34px] border border-[#e3ddd4] bg-white px-6 py-10 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:px-10">
            <p className="text-xs tracking-[0.24em] text-[#7a6f67]">READY TO START</p>
            <h2 className="mt-5 font-display text-[2rem] leading-[1.1] tracking-[-0.05em] sm:text-[3rem]">
              우리 교회와 사역에는
              <br />
              어떤 방식이 맞을지 함께 정리해보세요
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5d667d] sm:text-base">
              홈페이지, 디자인, 영상, 운영 도구까지 지금 필요한 범위만 가볍게 상담할 수 있습니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-semibold text-white">
                문의하기
              </Link>
              <Link href="/pricing" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d9d0c2] px-6 text-sm font-medium text-[#0c1220]">
                상품 보기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
