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
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07090f]/80 backdrop-blur">
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
          <Link href={action.secondaryHref} className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/90 hover:border-white/40">
            {action.secondaryLabel}
          </Link>
          <Link href={action.primaryHref} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black hover:opacity-90">
            {action.primaryLabel}
          </Link>
          {action.loggedIn ? (
            <form action="/api/logout" method="post">
              <button
                type="submit"
                className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/70 hover:border-white/40 hover:text-white"
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
