import Link from "next/link";

type HeroAction = {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export function MarketingHero({ action }: { action: HeroAction }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(106,76,255,0.25),transparent_38%),radial-gradient(circle_at_20%_80%,rgba(58,134,255,0.18),transparent_40%)]" />
      <div className="mx-auto grid min-h-[72vh] w-full max-w-6xl items-end px-4 pb-14 pt-20 sm:min-h-[78vh] sm:px-6 sm:pb-16">
        <div className="relative max-w-4xl">
          <p className="text-xs tracking-[0.22em] text-white/55">SOOM FOR CHURCHES</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[0.95] text-white sm:text-7xl md:text-8xl">
            교회에 필요한 디지털 작업,
            <br />
            숨에서 빠르게 만든다
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/70 sm:text-lg">
            설교 쇼츠, 행사 랜딩페이지, 신청 웹, 간편 명단 관리까지.
            당장 필요한 결과물을 먼저 빠르게 납품하고, 이후 교회별 운영 플랫폼으로 확장합니다.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={action.primaryHref} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90">
              {action.primaryLabel}
            </Link>
            <Link href={action.secondaryHref} className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white hover:border-white/55">
              {action.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
