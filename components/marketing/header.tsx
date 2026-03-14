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
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#081226]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="inline-flex items-center">
          <Image src="/soom-logo-main.svg" alt="SOOM" width={220} height={60} className="h-10 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <Link href="/features" className="hover:text-white">Platform</Link>
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={action.secondaryHref}
            className="rounded-full border border-indigo-300/25 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/90 transition hover:border-indigo-300/45 hover:bg-white/10"
          >
            {action.secondaryLabel}
          </Link>
          <Link
            href={action.primaryHref}
            className="rounded-full bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(99,102,241,0.35)] transition hover:bg-indigo-400"
          >
            {action.primaryLabel}
          </Link>
          {action.loggedIn ? (
            <form action="/api/logout" method="post">
              <button
                type="submit"
                className="rounded-full border border-pink-300/20 bg-pink-400/5 px-3.5 py-2 text-xs font-medium text-white/75 transition hover:border-pink-300/40 hover:bg-pink-400/10 hover:text-white"
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
