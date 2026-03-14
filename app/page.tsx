import Link from "next/link";

const solutions = [
  {
    title: "제작",
    desc: "행사 페이지, 설교 쇼츠, AI 영상을 빠르게 제작합니다.",
    items: ["행사·부서 랜딩페이지", "설교 쇼츠", "AI 영상 제작"],
  },
  {
    title: "운영",
    desc: "신청, 명단, 워크스페이스 같은 운영 흐름을 단정하게 정리합니다.",
    items: ["신청 웹", "간편 명단 관리", "교회별 워크스페이스"],
  },
  {
    title: "콘텐츠",
    desc: "설교 요약, 나눔지, 음성 콘텐츠까지 메시지 전달을 돕습니다.",
    items: ["설교 요약", "목장 나눔지", "TTS 음성 콘텐츠"],
  },
];

const offers = [
  { title: "행사·부서 랜딩페이지", price: "6.9만 원부터", desc: "교회가 가장 빠르게 결정할 수 있는 대표 상품" },
  { title: "AI 영상 제작", price: "15초 5만 원부터", desc: "행사 홍보, 설교 하이라이트, 사역 소개용" },
  { title: "설교 쇼츠 패키지", price: "월 4개 5만 원", desc: "주일 설교 핵심 구간 반복 납품" },
];

const trust = [
  "대흥침례교회 실제 사역 흐름 기반",
  "교회 친화적 디지털 제작/운영 경험",
  "작은 납품에서 플랫폼까지 확장 가능한 구조",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050b16] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_80%_18%,rgba(99,102,241,0.18),transparent_24%),linear-gradient(180deg,#050b16_0%,#091224_100%)]">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-5 sm:px-8 sm:pb-20 lg:px-10 lg:pb-28 lg:pt-8">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <span className="font-display text-sm tracking-[0.2em] text-white/86">SOOM</span>
            </Link>
            <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2 py-2 text-sm text-white/70 lg:flex">
              <a href="#solutions" className="rounded-full px-4 py-2 transition hover:bg-white/[0.06] hover:text-white">Solutions</a>
              <a href="#offers" className="rounded-full px-4 py-2 transition hover:bg-white/[0.06] hover:text-white">Offers</a>
              <a href="#contact" className="rounded-full px-4 py-2 transition hover:bg-white/[0.06] hover:text-white">Consulting</a>
            </nav>
          </header>

          <div className="grid gap-8 pt-12 sm:gap-10 sm:pt-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:pt-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <span className="font-display text-xs tracking-[0.22em] text-white/55">CHURCH DIGITAL STUDIO</span>
              </div>
              <h1 className="mt-5 max-w-5xl text-[2.6rem] font-semibold leading-[0.96] text-white sm:mt-6 sm:text-6xl lg:text-[6.2rem]">
                교회가 지금 필요한 디지털 작업을
                <br />
                더 크게, 더 단순하게.
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:mt-7 sm:text-lg sm:leading-8">
                숨은 교회를 위한 디지털 제작 스튜디오이자 운영 플랫폼이다. 행사 페이지, 설교 콘텐츠, 신청 웹, 운영 도구를 하나의 흐름으로 정리한다.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
                <a href="#offers" className="inline-flex min-h-12 items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.28)]">대표 상품 보기</a>
                <a href="#contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white">상담 문의</a>
              </div>
            </div>

            <div>
              <div className="rounded-[30px] border border-white/10 bg-[#0b1327]/92 p-3.5 shadow-[0_24px_80px_rgba(2,6,23,0.42)] sm:rounded-[36px] sm:p-5">
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-white/8 bg-[#091122] p-4 sm:rounded-[28px] sm:p-5 sm:col-span-2">
                    <p className="font-display text-xs tracking-[0.18em] text-white/45">PRIMARY MESSAGE</p>
                    <h2 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-3xl">작은 납품에서 시작해 구조로 확장</h2>
                    <p className="mt-3 text-sm leading-6 text-white/66 sm:leading-7">지금 당장 필요한 결과물을 먼저 만들고, 반복되는 운영 문제는 플랫폼 구조로 연결한다.</p>
                  </div>
                  <div className="rounded-[20px] border border-white/8 bg-[#091122] p-4 sm:rounded-[24px] sm:p-5">
                    <p className="text-xs tracking-[0.18em] text-white/42">SOLUTIONS</p>
                    <p className="mt-2 text-xl font-semibold text-white sm:mt-3 sm:text-2xl">3</p>
                  </div>
                  <div className="rounded-[20px] border border-white/8 bg-[#091122] p-4 sm:rounded-[24px] sm:p-5">
                    <p className="text-xs tracking-[0.18em] text-white/42">PRIMARY OFFERS</p>
                    <p className="mt-2 text-xl font-semibold text-white sm:mt-3 sm:text-2xl">3</p>
                  </div>
                  <div className="rounded-[20px] border border-white/8 bg-[#091122] p-4 sm:rounded-[24px] sm:p-5 sm:col-span-2">
                    <p className="text-xs tracking-[0.18em] text-white/42">WORKFLOW</p>
                    <p className="mt-2 text-sm leading-6 text-white/76 sm:mt-3 sm:text-base sm:leading-7">제작 · 운영 · 콘텐츠를 분리하지 않고 하나의 흐름으로 제안</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-18 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-display text-xs tracking-[0.2em] text-white/45">SOLUTIONS</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                숨은 교회를 위해
                <br />
                세 가지 방식으로 일한다.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/62 sm:text-base">교회가 실제로 겪는 필요를 제작, 운영, 콘텐츠의 세 축으로 정리한다.</p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {solutions.map((item, index) => (
              <article key={item.title} className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1327]/90 shadow-[0_24px_80px_rgba(2,6,23,0.34)] sm:rounded-[34px]">
                <div className="h-20 bg-gradient-to-b from-indigo-500/18 to-transparent sm:h-28" />
                <div className="-mt-7 px-5 pb-6 sm:-mt-10 sm:px-7 sm:pb-8">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xs tracking-[0.18em] text-white/48">0{index + 1}</p>
                    <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/52">{item.title}</div>
                  </div>
                  <h3 className="mt-4 text-[1.75rem] font-semibold text-white sm:mt-5 sm:text-3xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/66 sm:mt-4 sm:leading-7">{item.desc}</p>
                  <ul className="mt-6 space-y-3 text-sm text-white/80">
                    {item.items.map((sub) => (
                      <li key={sub} className="rounded-2xl border border-white/8 bg-[#091122] px-4 py-3.5 sm:py-4">{sub}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="offers" className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.01),rgba(99,102,241,0.02))]">
        <div className="mx-auto max-w-7xl px-5 py-18 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-display text-xs tracking-[0.2em] text-white/45">PRIMARY OFFERS</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                지금 가장 빠르게
                <br />
                결정할 수 있는 제안.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/62 sm:text-base">대표 상품은 짧고 명확하게 제안하고, 나머지는 상담에서 확장한다.</p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <article className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0b1327]/92 shadow-[0_24px_80px_rgba(2,6,23,0.42)] sm:rounded-[36px]">
              <div className="border-b border-white/10 px-6 py-6 sm:px-8">
                <p className="font-display text-xs tracking-[0.18em] text-indigo-100/58">FEATURED OFFER</p>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-[2rem] font-semibold leading-tight text-white sm:text-4xl">행사·부서 랜딩페이지</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/66 sm:mt-4 sm:text-base sm:leading-7">행사 소개, 일정, 장소, 신청 버튼까지. 교회가 가장 빠르게 결정할 수 있는 대표 상품.</p>
                  </div>
                  <div className="inline-flex w-fit rounded-full border border-indigo-300/18 bg-indigo-400/10 px-3 py-1 text-xs font-medium tracking-[0.12em] text-indigo-100">6.9만 원부터</div>
                </div>
              </div>
              <div className="grid gap-3 px-5 py-5 sm:grid-cols-2 sm:gap-4 sm:px-8 sm:py-8">
                <div className="rounded-2xl border border-white/8 bg-[#091122] px-4 py-4 text-sm text-white/78">모바일 중심 1페이지 구성</div>
                <div className="rounded-2xl border border-white/8 bg-[#091122] px-4 py-4 text-sm text-white/78">수정 1회</div>
                <div className="rounded-2xl border border-white/8 bg-[#091122] px-4 py-4 text-sm text-white/78">짧은 납기</div>
                <div className="rounded-2xl border border-white/8 bg-[#091122] px-4 py-4 text-sm text-white/78">교회 행사에 바로 적용 가능</div>
              </div>
            </article>

            <div className="grid gap-4">
              {offers.map((offer) => (
                <article key={offer.title} className="rounded-[26px] border border-white/10 bg-[#0b1327]/88 p-5 shadow-[0_18px_60px_rgba(2,6,23,0.34)] sm:rounded-[30px] sm:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-[1.6rem] font-semibold leading-tight text-white sm:text-2xl">{offer.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-white/64 sm:leading-7">{offer.desc}</p>
                    </div>
                    <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs tracking-[0.12em] text-white/55">{offer.price}</div>
                  </div>
                </article>
              ))}

              <article className="rounded-[30px] border border-white/10 bg-[#0b1327]/78 p-6 sm:p-7">
                <p className="font-display text-xs tracking-[0.18em] text-white/44">TRUST</p>
                <ul className="mt-4 space-y-3 text-sm text-white/72">
                  {trust.map((item) => (
                    <li key={item} className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400/90" />{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-18 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
          <div className="grid gap-6 rounded-[30px] border border-white/10 bg-[#0b1327]/92 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.42)] sm:rounded-[38px] sm:p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
            <div>
              <p className="font-display text-xs tracking-[0.2em] text-white/45">CONSULTING</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-5xl">필요한 작업이 있다면 짧고 분명하게 남겨주세요.</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/66 sm:mt-5 sm:text-base sm:leading-7">필요한 결과물과 일정만 알려주면 가장 가볍고 빠른 방식으로 제안합니다.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.28)]">문의 남기기</Link>
                <a href="#offers" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white">대표 상품 보기</a>
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
