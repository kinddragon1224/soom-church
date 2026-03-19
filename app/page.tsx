import Link from "next/link";

const principles = [
  "교회가 지금 바로 써야 하는 결과물부터 시작",
  "짧은 납기와 분명한 범위로 제안",
  "운영과 유지보수는 별도 구조로 정리",
  "작은 납품에서 교회별 운영 구조로 확장",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050b16] text-white">
      <section className="relative min-h-screen overflow-hidden bg-[#050b16]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-church-main.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,22,0.38)_0%,rgba(5,11,22,0.2)_24%,rgba(5,11,22,0.12)_50%,rgba(5,11,22,0.3)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,22,0.3)_0%,rgba(5,11,22,0.12)_30%,rgba(5,11,22,0.28)_72%,rgba(5,11,22,0.7)_100%)]" />
        <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 pb-8 pt-4 sm:px-8 sm:pt-6 lg:px-10">
          <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
            <div className="justify-self-start">
              <details className="group relative lg:hidden">
                <summary className="flex min-h-9 min-w-9 cursor-pointer list-none items-center justify-center rounded-full border border-white/60 bg-black/10 px-3 text-white backdrop-blur-sm transition hover:bg-white/10 [&::-webkit-details-marker]:hidden">
                  <span className="text-lg leading-none">☰</span>
                </summary>
                <div className="absolute left-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-2xl border border-white/12 bg-[#0a1122]/96 p-2 text-sm text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                  <a href="#solutions" className="block rounded-xl px-3 py-2.5 transition hover:bg-white/8">Solutions</a>
                  <a href="#message" className="block rounded-xl px-3 py-2.5 transition hover:bg-white/8">Message</a>
                  <a href="#outputs" className="block rounded-xl px-3 py-2.5 transition hover:bg-white/8">Outputs</a>
                  <a href="#contact" className="block rounded-xl px-3 py-2.5 transition hover:bg-white/8">Consulting</a>
                </div>
              </details>
              <nav className="hidden items-center gap-5 text-[13px] font-medium text-white/90 lg:flex xl:gap-6">
                <a href="#solutions" className="transition hover:text-white/70">Solutions</a>
                <a href="#message" className="transition hover:text-white/70">Message</a>
                <a href="#outputs" className="transition hover:text-white/70">Outputs</a>
                <a href="#contact" className="transition hover:text-white/70">Consulting</a>
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

            <div className="mx-auto mt-5 max-w-[300px] text-center text-[13px] leading-6 text-white/82 sm:mt-8 sm:max-w-[680px] sm:text-[15px] sm:leading-7">
              <div className="sm:hidden">
                <p>행사 페이지, 설교 콘텐츠, 신청 웹을</p>
                <p>짧고 분명하게 제작합니다.</p>
                <p className="mt-2">바로 이해되고 바로 쓸 수 있는</p>
                <p>결과물을 먼저 만듭니다.</p>
              </div>
              <div className="hidden sm:block">
                <p>행사 페이지, 부서 소개, 신청 웹처럼</p>
                <p>바로 설명되고 바로 쓸 수 있는 결과물을</p>
                <p>짧은 납기와 분명한 범위로 제작합니다</p>
              </div>
            </div>

            <div className="mx-auto mt-6 flex w-full max-w-[320px] flex-col items-center justify-center gap-2.5 sm:mt-9 sm:max-w-none sm:flex-row sm:gap-4">
              <a href="#outputs" className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/55 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 sm:min-h-12 sm:min-w-[168px] sm:w-auto sm:px-6">
                대표 상품 보기
              </a>
              <a href="#contact" className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/55 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 sm:min-h-12 sm:min-w-[168px] sm:w-auto sm:px-6">
                상담 문의
              </a>
            </div>
            <div className="mx-auto mt-5 h-px w-[220px] bg-gradient-to-r from-indigo-400/0 via-indigo-400/90 to-pink-400/80 sm:mt-6 sm:hidden" />
            <div className="mx-auto mt-6 hidden h-px w-[320px] bg-gradient-to-r from-indigo-400/0 via-indigo-400/90 to-pink-400/80 sm:block lg:w-[420px]" />
          </div>
        </div>
      </section>

      <section id="message" className="border-t border-white/10 bg-[#f4f5f7] text-[#0a1020]">
        <div className="mx-auto flex min-h-screen max-w-[1540px] items-center px-4 py-14 sm:px-8 lg:px-12">
          <div className="grid w-full gap-12 lg:grid-cols-[minmax(420px,0.78fr)_minmax(0,1fr)] lg:items-center lg:gap-20 xl:gap-28">
            <div className="max-w-[620px] lg:-translate-y-1">
              <p className="text-[11px] font-medium tracking-[0.24em] text-[#5c6785]">MESSAGE</p>
              <h2
                className="mt-5 text-[2.35rem] font-normal tracking-[-0.04em] text-[#0a1226] sm:text-[3.7rem] lg:text-[4.45rem] xl:text-[5rem]"
                style={{ fontFamily: 'var(--font-serif-ko)' }}
              >
                <span className="block leading-[1.08] sm:hidden">사람에 더</span>
                <span className="block leading-[1.08] sm:hidden">집중하고</span>
                <span className="mt-[0.38em] block leading-[1.08] sm:hidden">기술은 더</span>
                <span className="block leading-[1.08] sm:hidden">조용하게.</span>
                <span className="hidden sm:block leading-[1.02]">사람에 더</span>
                <span className="hidden sm:block leading-[1.02]">집중하고</span>
                <span className="hidden sm:block mt-[0.34em] leading-[1.02]">기술은 더</span>
                <span className="hidden sm:block leading-[1.02]">조용하게.</span>
              </h2>
              <div className="mt-10 max-w-[320px] whitespace-pre-line text-[14px] leading-7 text-[#44506d] sm:mt-12 sm:max-w-[500px] sm:text-[15px]">
                <div className="sm:hidden">
                  <p>교회가 사람을 더 잘 돌보고</p>
                  <p>메시지를 더 선명하게 전할 수 있도록,</p>
                  <p className="mt-2">필요한 디지털 작업을 복잡한 설명 없이</p>
                  <p>단정한 구조로 정리하고 제작합니다.</p>
                </div>
                <div className="hidden sm:block">
                  {`교회가 사람을 더 잘 돌보고
메시지를 더 선명하게 전할 수 있도록,
필요한 디지털 작업을 복잡한 설명 없이
단정한 구조로 정리하고 제작합니다.`}
                </div>
              </div>
              <div className="mt-7 sm:mt-8">
                <Link
                  href="/login"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#0b1327] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(8,17,38,0.14)] transition hover:bg-[#16203a] sm:min-h-12 sm:px-6"
                >
                  로그인
                </Link>
              </div>
            </div>

            <div className="hidden lg:block" />
          </div>
        </div>
      </section>

      <section id="solutions" className="bg-[#050b16]">
        <div className="mx-auto flex min-h-screen max-w-[1540px] items-center px-4 py-16 sm:px-8 lg:px-12">
          <div className="w-full">
            <div className="max-w-[1240px]">
              <p className="text-[11px] font-medium tracking-[0.24em] text-white/42">SOLUTIONS</p>
            </div>

            <div className="mt-6 flex flex-col gap-4 lg:mt-8 lg:flex-row lg:items-end lg:justify-between">
              <p className="text-[1.75rem] font-light tracking-[-0.04em] text-white/92 sm:text-[2.2rem] lg:text-[2.6rem]">
                작게 맡기기 쉽고,
                필요하면 운영 구조까지 이어집니다.
              </p>
              <p className="max-w-[460px] text-sm leading-6 text-white/58 sm:text-[15px] sm:leading-7">
                처음에는 행사 페이지나 설교 콘텐츠처럼 바로 써야 하는 결과물부터 시작하고,
                이후 반복 납품과 운영 구조까지 교회 상황에 맞게 확장합니다.
              </p>
            </div>

            <div className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-3">
              {solutions.map((item, index) => (
                <article
                  key={item.label}
                  className="group overflow-hidden rounded-[30px] border border-white/8 bg-[#0a1122] shadow-[0_24px_80px_rgba(2,6,23,0.28)] transition hover:-translate-y-1 hover:border-white/14 hover:bg-[#0c152a]"
                >
                  <div
                    className={
                      index === 0
                        ? "relative aspect-[0.95/1] overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(129,140,248,0.28),transparent_24%),linear-gradient(180deg,#16203a_0%,#0b1327_100%)]"
                        : index === 1
                          ? "relative aspect-[0.95/1] overflow-hidden bg-[radial-gradient(circle_at_82%_16%,rgba(96,165,250,0.22),transparent_22%),linear-gradient(180deg,#111827_0%,#09111f_100%)]"
                          : "relative aspect-[0.95/1] overflow-hidden bg-[radial-gradient(circle_at_80%_18%,rgba(236,72,153,0.18),transparent_22%),radial-gradient(circle_at_16%_78%,rgba(129,140,248,0.2),transparent_20%),linear-gradient(180deg,#18122b_0%,#0d1324_100%)]"
                    }
                  >
                    {index === 0 ? (
                      <>
                        <div className="absolute left-6 top-6 h-[72%] w-[58%] rounded-[24px] border border-white/10 bg-[#f8fbff] shadow-[0_18px_50px_rgba(15,23,42,0.24)]" />
                        <div className="absolute left-10 top-12 h-2 w-24 rounded-full bg-[#d9e3f2]" />
                        <div className="absolute left-10 top-18 h-3 w-40 rounded-full bg-[#0f172a]" />
                        <div className="absolute left-10 top-26 h-24 w-[46%] rounded-[18px] bg-[linear-gradient(135deg,#c7d2fe_0%,#e9d5ff_100%)]" />
                        <div className="absolute right-6 top-14 w-[34%] rounded-[20px] border border-white/10 bg-[#10192d] p-3 shadow-[0_18px_40px_rgba(2,6,23,0.3)]">
                          <div className="h-20 rounded-[14px] bg-[linear-gradient(135deg,#4338ca_0%,#ec4899_100%)]" />
                          <div className="mt-3 h-2 w-16 rounded-full bg-white/25" />
                          <div className="mt-2 h-2 w-10 rounded-full bg-white/15" />
                        </div>
                        <div className="absolute bottom-6 left-8 flex gap-2 text-[10px] text-[#51607e]">
                          <span className="rounded-full bg-white px-2 py-1">PAGE</span>
                          <span className="rounded-full bg-white px-2 py-1">SHORTS</span>
                          <span className="rounded-full bg-white px-2 py-1">FORM</span>
                        </div>
                      </>
                    ) : index === 1 ? (
                      <>
                        <div className="absolute inset-x-6 top-6 rounded-[24px] border border-white/10 bg-[#0d172b] p-4 shadow-[0_20px_60px_rgba(2,6,23,0.32)]">
                          <div className="flex items-center justify-between">
                            <div className="h-3 w-24 rounded-full bg-white/12" />
                            <div className="rounded-full border border-cyan-400/25 px-2 py-1 text-[10px] text-cyan-200/80">AI BOT</div>
                          </div>
                          <div className="mt-4 grid grid-cols-[1.1fr_0.9fr] gap-3">
                            <div className="rounded-[18px] bg-[#121f38] p-3">
                              <div className="h-2 w-12 rounded-full bg-white/20" />
                              <div className="mt-3 space-y-2">
                                <div className="h-8 rounded-xl bg-white/6" />
                                <div className="h-8 rounded-xl bg-white/6" />
                                <div className="h-8 rounded-xl bg-white/6" />
                              </div>
                            </div>
                            <div className="rounded-[18px] bg-[#121f38] p-3">
                              <div className="h-2 w-14 rounded-full bg-white/20" />
                              <div className="mt-3 h-24 rounded-2xl bg-[linear-gradient(180deg,#1d4ed8_0%,#0f766e_100%)] opacity-80" />
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 rounded-[22px] border border-white/10 bg-[#0d172b] p-4">
                          <div className="flex items-center justify-between text-[10px] text-white/52">
                            <span>교적 관리</span>
                            <span>운영 자동화</span>
                            <span>교회 전용 AI</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="absolute left-7 top-8 h-40 w-32 rounded-[26px] border border-white/10 bg-[#f7f1e8] shadow-[0_16px_40px_rgba(15,23,42,0.24)]" />
                        <div className="absolute left-12 top-14 space-y-2 text-[10px] text-[#8c6a3d]">
                          <div className="h-2 w-12 rounded-full bg-[#dbc29a]" />
                          <div className="h-2 w-16 rounded-full bg-[#e6d3b6]" />
                          <div className="h-2 w-10 rounded-full bg-[#dbc29a]" />
                          <div className="mt-4 h-2 w-16 rounded-full bg-[#e6d3b6]" />
                          <div className="h-2 w-12 rounded-full bg-[#dbc29a]" />
                        </div>
                        <div className="absolute right-8 top-10 w-[42%] rounded-[22px] border border-white/10 bg-[#12182b] p-4 shadow-[0_20px_45px_rgba(2,6,23,0.32)]">
                          <div className="flex items-end gap-1.5">
                            <div className="h-8 w-2 rounded-full bg-indigo-300/80" />
                            <div className="h-12 w-2 rounded-full bg-pink-300/80" />
                            <div className="h-6 w-2 rounded-full bg-indigo-200/80" />
                            <div className="h-10 w-2 rounded-full bg-pink-200/80" />
                          </div>
                          <div className="mt-4 h-2 w-16 rounded-full bg-white/20" />
                          <div className="mt-2 h-2 w-10 rounded-full bg-white/12" />
                        </div>
                        <div className="absolute bottom-8 right-8 w-[44%] rounded-[24px] border border-white/10 bg-[#eef4ff] p-4 shadow-[0_18px_40px_rgba(15,23,42,0.2)]">
                          <div className="h-20 rounded-[18px] bg-[linear-gradient(135deg,#c7d2fe_0%,#fbcfe8_100%)]" />
                          <div className="mt-3 h-2 w-14 rounded-full bg-[#8ea1bf]" />
                          <div className="mt-2 h-2 w-10 rounded-full bg-[#c2cede]" />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-6 sm:p-7">
                    <p className="text-[11px] font-medium tracking-[0.18em] text-indigo-100/55">{item.label}</p>
                    <h3 className="mt-4 max-w-[15ch] text-[1.8rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-[2rem]">
                      {item.title}
                    </h3>
                    <p className="mt-5 max-w-[32ch] text-sm leading-6 text-white/62 sm:text-[15px] sm:leading-7">
                      {item.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="bg-[#f4f5f7] text-[#0a1020]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="font-display text-xs tracking-[0.2em] text-[#4d5a7a]">PROCESS</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                작게 맡기고,
                <br />
                필요하면 운영 구조까지 이어집니다.
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-[#44506d] sm:text-base">
                처음에는 행사 페이지나 설교 콘텐츠처럼
                작고 분명한 결과물부터 시작합니다.
                이후 교회 상황에 따라 신청 구조, 명단 관리,
                반복 제작 흐름까지 확장할 수 있습니다.
              </p>
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
              <p className="font-display text-xs tracking-[0.2em] text-white/45">CONTACT</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
                필요한 작업이 있다면
                <br />
                길게 설명하지 않아도 됩니다
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                행사인지, 설교 콘텐츠인지, 운영 정리인지
                필요한 작업과 일정만 남겨주세요.
                교회가 가장 가볍게 시작할 수 있는 방식으로 제안합니다.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.28)]">
                  작업 문의 남기기
                </Link>
                <a href="#outputs" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white">
                  대표 상품 먼저 보기
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
