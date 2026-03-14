import Link from "next/link";

type FooterAction = {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export function FooterCta({ action }: { action: FooterAction }) {
  return (
    <section className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(99,102,241,0.025))]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-12 sm:px-6 sm:py-16 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] text-white/50">SOOM WORKSPACE</p>
          <h2 className="mt-3 text-2xl font-semibold text-white sm:text-4xl">교회별 워크스페이스로 시작하세요</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={action.primaryHref} className="flex min-h-12 items-center justify-center rounded-full bg-indigo-500/95 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.28)] transition hover:bg-indigo-400">{action.primaryLabel}</Link>
          <Link href={action.secondaryHref} className="flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.06]">{action.secondaryLabel}</Link>
        </div>
      </div>
    </section>
  );
}
