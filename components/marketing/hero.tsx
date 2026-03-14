import Link from "next/link";
import { HeroScene } from "@/components/marketing/hero-scene";

type HeroAction = {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

const quickStats = [
  { label: "Solutions", value: "제작 · 운영 · 콘텐츠" },
  { label: "Primary offers", value: "랜딩페이지 · AI 영상" },
  { label: "Expansion", value: "작은 납품에서 플랫폼까지" },
];

export function MarketingHero({ action }: { action: HeroAction }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(180deg,#060b17_0%,#0a1329_100%)]">
      <HeroScene />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(99,102,241,0.18),transparent_34%),radial-gradient(circle_at_18%_78%,rgba(236,72,153,0.05),transparent_18%),radial-gradient(circle_at_20%_80%,rgba(58,134,255,0.08),transparent_36%)]" />
      <div className="mx-auto flex min-h-[76vh] w-full max-w-6xl items-center px-4 py-14 sm:px-6 sm:py-18 lg:min-h-[84vh] lg:py-24">
        <div className="relative grid w-full gap-10 lg:grid-cols-[minmax(0,1.1fr)_380px] lg:items-center lg:gap-14">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.16)]">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <p className="font-display text-xs tracking-[0.22em] text-white/55">SOOM FOR CHURCHES</p>
            </div>
            <h1 className="mt-6 max-w-5xl text-[2.9rem] font-semibold leading-[0.92] text-white sm:text-6xl md:text-[4.75rem] xl:text-[5.6rem]">
              교회 운영과 사역을,
              <br className="hidden sm:block" />
              하나의 흐름으로 이어갑니다
            </h1>
            <div className="mt-7 max-w-2xl space-y-3 text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
              <p>행사, 설교, 신청, 운영에 필요한 디지털 작업을 교회에 맞는 구조로 정리하고 제작합니다.</p>
              <p>흩어진 일을 줄일수록, 준비가 단순해질수록, 교회는 더 본질에 집중할 수 있습니다.</p>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={action.primaryHref}
                className="flex min-h-12 items-center justify-center rounded-full bg-indigo-500/95 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.28)] transition hover:bg-indigo-400"
              >
                {action.primaryLabel}
              </Link>
              <Link
                href={action.secondaryHref}
                className="flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                {action.secondaryLabel}
              </Link>
            </div>
          </div>

          <div className="lg:justify-self-end">
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0b1327]/88 shadow-[0_24px_80px_rgba(2,6,23,0.42)] backdrop-blur-sm">
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
