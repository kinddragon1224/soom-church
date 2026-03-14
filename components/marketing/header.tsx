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
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#060b17]/86 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="inline-flex items-center self-start md:self-auto">
          <Image src="/soom-logo-main.svg" alt="SOOM" width={220} height={60} className="h-9 w-auto sm:h-10" priority />
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <Link href="/features" className="hover:text-white">Platform</Link>
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </nav>

        <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md.items-center">
          <Link
            href={action.secondaryHref}
            className="flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-white/88 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            {action.secondaryLabel}
          </Link>
          <Link
            href={action.primaryHref}
            className="flex min-h-11 items-center justify-center rounded-full bg-indigo-500/95 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.26)] transition hover:bg-indigo-400"
          >
            {action.primaryLabel}
          </Link>
          {action.loggedIn ? (
            <form action="/api/logout" method="post">
              <button
                type="submit"
                className="col-span-2 flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-2 text-xs font-medium text-white/72 transition hover:border-white/18 hover:bg-white/[0.05] hover:text-white md:col-auto"
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
