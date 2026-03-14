import Link from "next/link";
import { HeroScene } from "@/components/marketing/hero-scene";

type HeroAction = {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export function MarketingHero({ action }: { action: HeroAction }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(180deg,#060b17_0%,#0a1329_100%)]">
      <HeroScene />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(99,102,241,0.18),transparent_34%),radial-gradient(circle_at_18%_78%,rgba(236,72,153,0.05),transparent_18%),radial-gradient(circle_at_20%_80%,rgba(58,134,255,0.08),transparent_36%)]" />
      <div className="mx-auto grid min-h-[66vh] w-full max-w-6xl items-end px-4 pb-12 pt-16 sm:min-h-[72vh] sm:px-6 sm:pb-16 sm:pt-20">
        <div className="relative max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.16)]">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            <p className="font-display text-xs tracking-[0.22em] text-white/55">SOOM FOR CHURCHES</p>
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.02] text-white sm:text-6xl md:text-8xl">
            교회를 위한 디지털 사역,
            <br />
            더 단정하고 더 선명하게
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:mt-6 sm:text-lg sm:leading-8">
            설교 영상, 행사 페이지, 신청 웹, 운영 도구까지.
            교회 현장에 바로 필요한 결과물을 품위 있게 설계하고 빠르게 제작합니다.
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
      </div>
    </section>
  );
}
