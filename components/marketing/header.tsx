import Link from "next/link";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07090f]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-[0.18em] text-white">
          SOOM
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <Link href="/features" className="hover:text-white">Platform</Link>
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/90 hover:border-white/40">
            로그인
          </Link>
          <Link href="/signup" className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black hover:opacity-90">
            숨 시작하기
          </Link>
        </div>
      </div>
    </header>
  );
}
