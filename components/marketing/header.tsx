import Image from "next/image";
import Link from "next/link";

export type HeaderAction = {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  loggedIn?: boolean;
};

export function MarketingHeader({ action }: { action: HeaderAction }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050914]/90 shadow-[0_10px_40px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="inline-flex items-center self-start md:self-auto">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.22)]">
            <Image src="/soom-logo-main.svg" alt="SOOM" width={220} height={60} className="h-8 w-auto sm:h-9" priority />
            <div className="hidden border-l border-white/10 pl-3 sm:block">
              <p className="font-display text-[10px] uppercase tracking-[0.22em] text-white/45">Church Digital Suite</p>
              <p className="text-xs text-white/78">교회를 위한 제작·운영 플랫폼</p>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2 py-2 text-sm text-white/70 shadow-[0_8px_30px_rgba(0,0,0,0.14)] md:flex">
          <Link href="/features" className="rounded-full px-4 py-2 transition hover:bg-white/[0.06] hover:text-white">Platform</Link>
          <Link href="#service-offers" className="rounded-full px-4 py-2 transition hover:bg-white/[0.06] hover:text-white">Services</Link>
          <Link href="/contact" className="rounded-full px-4 py-2 transition hover:bg-white/[0.06] hover:text-white">Contact</Link>
        </nav>

        <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md.items-center md:rounded-full md:border md:border-white/10 md:bg-white/[0.02] md:p-1.5 md:shadow-[0_8px_30px_rgba(0,0,0,0.14)]">
          <Link
            href={action.secondaryHref}
            className="flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-white/88 transition hover:border-white/20 hover:bg-white/[0.06] md:min-h-10"
          >
            {action.secondaryLabel}
          </Link>
          <Link
            href={action.primaryHref}
            className="flex min-h-11 items-center justify-center rounded-full bg-indigo-500/95 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.26)] transition hover:bg-indigo-400 md:min-h-10"
          >
            {action.primaryLabel}
          </Link>
          {action.loggedIn ? (
            <form action="/api/logout" method="post">
              <button
                type="submit"
                className="col-span-2 flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-2 text-xs font-medium text-white/72 transition hover:border-white/18 hover:bg-white/[0.05] hover:text-white md:col-auto md:min-h-10"
              >
                로그아웃
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </header>
  );
}
