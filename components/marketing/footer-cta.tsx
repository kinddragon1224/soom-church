import Link from "next/link";

export function FooterCta() {
  return (
    <section className="border-t border-white/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-14 sm:px-6 sm:py-16 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] text-white/50">SOOM WORKSPACE</p>
          <h2 className="mt-3 text-2xl font-semibold text-white sm:text-4xl">교회별 워크스페이스로 시작하세요</h2>
        </div>
        <div className="flex gap-3">
          <Link href="/signup" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black">숨 시작하기</Link>
          <Link href="/login" className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white">로그인</Link>
        </div>
      </div>
    </section>
  );
}
