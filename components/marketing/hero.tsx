import Link from "next/link";

type HeroAction = {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export function MarketingHero({ action }: { action: HeroAction }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(180deg,#081226_0%,#0b1530_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(99,102,241,0.3),transparent_38%),radial-gradient(circle_at_18%_78%,rgba(236,72,153,0.16),transparent_24%),radial-gradient(circle_at_20%_80%,rgba(58,134,255,0.16),transparent_40%)]" />
      <div className="mx-auto grid min-h-[66vh] w-full max-w-6xl items-end px-4 pb-12 pt-16 sm:min-h-[72vh] sm:px-6 sm:pb-16 sm:pt-20">
        <div className="relative max-w-4xl">
          <p className="text-xs tracking-[0.22em] text-white/55">SOOM FOR CHURCHES</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.02] text-white sm:text-6xl md:text-8xl">
            교회에 필요한 디지털 작업,
            <br />
            숨에서 빠르게 만든다
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:mt-6 sm:text-lg sm:leading-8">
            설교 쇼츠, 행사 랜딩페이지, 신청 웹, 간편 명단 관리까지.
            당장 필요한 결과물을 먼저 빠르게 납품하고, 이후 교회별 운영 플랫폼으로 확장합니다.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={action.primaryHref}
              className="flex min-h-12 items-center justify-center rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(99,102,241,0.35)] transition hover:bg-indigo-400"
            >
              {action.primaryLabel}
            </Link>
            <Link
              href={action.secondaryHref}
              className="flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-pink-300/40 hover:bg-pink-400/10"
            >
              {action.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
