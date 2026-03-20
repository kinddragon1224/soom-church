import Link from "next/link";
import SiteHeader from "@/components/site-header";

const serviceCards = [
  {
    title: "쇼츠 · 홍보영상",
    desc: "설교 쇼츠, 행사 홍보영상, 짧은 소개 영상을 빠르게 제작해 바로 활용할 수 있게 정리합니다.",
    points: ["설교 쇼츠", "행사 홍보영상", "짧은 소개 영상"],
  },
  {
    title: "유튜브 운영 세팅",
    desc: "채널이 실제로 굴러가도록 제목, 썸네일, 플레이리스트, 업로드 흐름까지 함께 정리합니다.",
    points: ["채널 구조 정리", "썸네일·제목 가이드", "업로드 운영 세팅"],
  },
  {
    title: "행사 랜딩 · 안내 제작",
    desc: "집회, 수련회, 등록, 신청, 안내 흐름을 한 페이지와 한 세트의 홍보물로 정리합니다.",
    points: ["행사 랜딩페이지", "신청·안내 흐름", "리플렛·홍보물 연계"],
  },
];

const audiencePoints = [
  "목회자에게는 메시지가 더 잘 전달되도록 돕습니다.",
  "사무국장에게는 반복되는 운영 공백을 빠르게 메워줍니다.",
  "담당자에게는 바로 실행할 수 있는 구조와 결과물을 제공합니다.",
];

const guideTopics = [
  "목회자는 AI를 어디까지 사용해도 될까",
  "설교 준비에 AI를 어떻게 보조 도구로 쓸 수 있을까",
  "주보, 공지, 안내 문구를 AI로 더 빠르게 정리하는 법",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050b16] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#050b16]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-church-main.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,22,0.9)_0%,rgba(5,11,22,0.6)_44%,rgba(5,11,22,0.38)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,22,0.2)_0%,rgba(5,11,22,0.18)_30%,rgba(5,11,22,0.82)_100%)]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-10 pt-5 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="home" ctaHref="/contact" ctaLabel="문의하기" />

          <div className="flex flex-1 items-end py-16 sm:py-24 lg:py-28">
            <div className="max-w-5xl">
              <p className="text-xs tracking-[0.24em] text-white/52">EXECUTION SERVICES FOR CHURCHES</p>
              <h1 className="mt-5 font-display text-[2.8rem] font-semibold leading-[1.02] tracking-[-0.06em] text-white sm:text-[4.5rem] lg:text-[5.9rem]">
                교회의 실행 공백을
                <br />
                빠르게 메우는 팀
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-white/82 sm:text-lg sm:leading-8">
                쇼츠, 유튜브 운영, 행사 랜딩과 안내 제작까지.
                숨은 교회가 지금 바로 필요한 실행형 작업을 정리해주는 팀입니다.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/pricing" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#09111f] transition hover:bg-white/90">
                  핵심 상품 보기
                </Link>
                <Link href="/ai-guides" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 bg-white/5 px-6 text-sm font-medium text-white transition hover:bg-white/10">
                  AI 안내서 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f1ec] text-[#0c1220]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.24em] text-[#7a6f67]">CORE SERVICES</p>
            <h2 className="mt-5 font-display text-[2.2rem] leading-[1.08] tracking-[-0.05em] sm:text-[3.5rem]">
              지금 교회가 바로 필요로 하는
              <br />
              핵심 상품만 남겼습니다
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#5d667d] sm:text-base">
              숨은 플랫폼 설명보다 먼저, 교회가 당장 맡기고 싶은 실행형 서비스를 분명하게 제공합니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {serviceCards.map((item) => (
              <article key={item.title} className="rounded-[30px] border border-[#e6dfd5] bg-white p-7 shadow-[0_16px_40px_rgba(16,24,40,0.06)]">
                <h3 className="text-[1.55rem] font-semibold tracking-[-0.03em] text-[#0c1220]">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#475069]">{item.desc}</p>
                <ul className="mt-6 grid gap-2 text-sm leading-7 text-[#334155]">
                  {item.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#070d18]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.24em] text-white/38">WHY SOOM</p>
            <h2 className="mt-5 font-display text-[2.2rem] leading-[1.08] tracking-[-0.05em] text-white sm:text-[3.5rem]">
              우리는 도구보다
              <br />
              결과물과 실행을 다룹니다
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/60 sm:text-base">
              목회와 사역 현장에는 늘 해야 할 일이 많습니다. 숨은 교회가 지금 바로 겪는 운영 공백을 줄이고,
              내부 인력이 없어도 실제 결과물이 나오게 돕는 팀이 되려 합니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {audiencePoints.map((item) => (
              <article key={item} className="rounded-[30px] border border-white/10 bg-white/[0.03] p-7 shadow-[0_24px_80px_rgba(2,6,23,0.28)]">
                <p className="text-sm leading-8 text-white/72">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f4ee] text-[#0c1220]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="text-xs tracking-[0.24em] text-[#7a6f67]">AI GUIDE</p>
              <h2 className="mt-5 font-display text-[2.2rem] leading-[1.08] tracking-[-0.05em] sm:text-[3.4rem]">
                AI 안내서는
                <br />
                매출보다 신뢰를 위한 공간입니다
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#5d667d] sm:text-base">
                목회와 AI를 집중적으로 다루는 콘텐츠 허브를 만들고 있습니다. 이곳에서 목회자와 사역자가
                실제로 적용할 수 있는 글과 사례를 꾸준히 쌓아갈 예정입니다.
              </p>
              <div className="mt-8">
                <Link href="/ai-guides" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-semibold text-white">
                  AI 안내서 보기
                </Link>
              </div>
            </div>
            <div className="grid gap-3">
              {guideTopics.map((topic, index) => (
                <article key={topic} className="rounded-[24px] border border-[#e6dfd5] bg-white px-5 py-5 shadow-[0_16px_40px_rgba(20,30,60,0.06)]">
                  <p className="text-xs tracking-[0.16em] text-[#9a8b7a]">0{index + 1}</p>
                  <p className="mt-3 text-base leading-7 text-[#334155]">{topic}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#050b16]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-8 rounded-[36px] border border-white/10 bg-[#0b1327]/92 p-7 shadow-[0_24px_80px_rgba(2,6,23,0.42)] lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
            <div>
              <p className="text-xs tracking-[0.24em] text-white/38">CONTACT</p>
              <h2 className="mt-5 font-display text-[2.2rem] leading-[1.08] tracking-[-0.05em] text-white sm:text-[3.2rem]">
                지금 필요한 실행부터
                <br />
                함께 정리해보자
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
                쇼츠가 필요한지, 유튜브 운영이 먼저인지, 행사 랜딩이 급한지 아직 정리되지 않아도 괜찮아.
                지금 상황을 기준으로 가장 현실적인 시작점을 함께 잡아줄게.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#09111f]">
                  문의하기
                </Link>
                <Link href="/pricing" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 text-sm font-medium text-white">
                  상품 보기
                </Link>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="rounded-[24px] border border-white/8 bg-[#091122] px-5 py-5">
                <p className="text-xs tracking-[0.16em] text-white/38">01</p>
                <p className="mt-2 text-sm leading-7 text-white/82">교회 상황과 가장 급한 실행 과제를 먼저 정리합니다.</p>
              </div>
              <div className="rounded-[24px] border border-white/8 bg-[#091122] px-5 py-5">
                <p className="text-xs tracking-[0.16em] text-white/38">02</p>
                <p className="mt-2 text-sm leading-7 text-white/82">핵심 상품 3개 안에서 가장 현실적인 시작 상품을 제안합니다.</p>
              </div>
              <div className="rounded-[24px] border border-white/8 bg-[#091122] px-5 py-5">
                <p className="text-xs tracking-[0.16em] text-white/38">03</p>
                <p className="mt-2 text-sm leading-7 text-white/82">필요하면 이후에 운영형 계약이나 콘텐츠 자산화로 이어갑니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
