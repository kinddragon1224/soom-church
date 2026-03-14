import Link from "next/link";
import { HeroScene } from "@/components/marketing/hero-scene";

type HeroAction = {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

const quickStats = [
  { label: "핵심 구조", value: "제작 · 운영 · 콘텐츠" },
  { label: "대표 상품", value: "랜딩페이지 · 설교 쇼츠 · AI 영상" },
  { label: "확장 방향", value: "작은 납품에서 워크스페이스까지" },
];

export function MarketingHero({ action }: { action: HeroAction }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(180deg,#060b17_0%,#0a1329_100%)]">
      <HeroScene />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(99,102,241,0.18),transparent_34%),radial-gradient(circle_at_18%_78%,rgba(236,72,153,0.05),transparent_18%),radial-gradient(circle_at_20%_80%,rgba(58,134,255,0.08),transparent_36%)]" />
      <div className="mx-auto grid min-h-[72vh] w-full max-w-6xl items-end px-4 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20 lg:min-h-[82vh]">
        <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.16)]">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <p className="font-display text-xs tracking-[0.22em] text-white/55">SOOM FOR CHURCHES</p>
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.02] text-white sm:text-6xl md:text-7xl xl:text-[5.6rem]">
              교회가 지금 필요한 디지털 작업을,
              <br />
              하나의 흐름으로 정리하다
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-lg sm:leading-8">
              숨은 교회를 위한 디지털 제작 스튜디오이자 운영 플랫폼입니다.
              행사 페이지, 설교 콘텐츠, 신청 웹, 운영 도구를 빠르게 제공하고 필요한 만큼 더 깊게 연결합니다.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={action.primaryHref}
                className="flex min-h-12 items-center justify-center rounded-full bg-indigo-500/95 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.28)] transition hover:bg-indigo-400"
              >
                {action.primaryLabel}
              </Link>
              <Link
                href={action.secondaryHref}
                className="flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                {action.secondaryLabel}
              </Link>
            </div>
          </div>

          <div className="lg:pb-2">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0b1327]/90 shadow-[0_24px_80px_rgba(2,6,23,0.42)] backdrop-blur-sm">
              <div className="border-b border-white/10 px-5 py-4 sm:px-6">
                <p className="font-display text-xs tracking-[0.2em] text-white/48">CHURCH DIGITAL SYSTEM</p>
                <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">작은 결과물에서 시작해 구조로 확장합니다</h2>
              </div>
              <div className="grid gap-3 px-5 py-5 sm:px-6 sm:py-6">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/8 bg-[#091122] px-4 py-4">
                    <p className="text-xs tracking-[0.16em] text-white/42">{stat.label}</p>
                    <p className="mt-2 text-sm leading-6 text-white/82 sm:text-base">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-px border-t border-white/10 bg-white/10">
                <div className="bg-[#0b1327] px-4 py-4 text-center">
                  <p className="text-xs tracking-[0.16em] text-white/42">SOLUTIONS</p>
                  <p className="mt-2 text-lg font-semibold text-white">3</p>
                </div>
                <div className="bg-[#0b1327] px-4 py-4 text-center">
                  <p className="text-xs tracking-[0.16em] text-white/42">OFFERS</p>
                  <p className="mt-2 text-lg font-semibold text-white">4</p>
                </div>
                <div className="bg-[#0b1327] px-4 py-4 text-center">
                  <p className="text-xs tracking-[0.16em] text-white/42">FLOW</p>
                  <p className="mt-2 text-lg font-semibold text-white">END-TO-END</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
