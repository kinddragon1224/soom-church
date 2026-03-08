import Link from "next/link";

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(106,76,255,0.25),transparent_38%),radial-gradient(circle_at_20%_80%,rgba(58,134,255,0.18),transparent_40%)]" />
      <div className="mx-auto grid min-h-[72vh] w-full max-w-6xl items-end px-4 pb-14 pt-20 sm:min-h-[78vh] sm:px-6 sm:pb-16">
        <div className="relative max-w-4xl">
          <p className="text-xs tracking-[0.22em] text-white/55">SOOM PLATFORM</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[0.95] text-white sm:text-7xl md:text-8xl">
            교회 AX의
            <br />
            새로운 기준, 숨
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/70 sm:text-lg">
            섬기는 이들을 위한 운영 플랫폼.
            교적, 신청, 공지, 후속관리 흐름을 교회별 워크스페이스로 정리합니다.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90">
              숨 시작하기
            </Link>
            <Link href="/login" className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white hover:border-white/55">
              숨 로그인
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
