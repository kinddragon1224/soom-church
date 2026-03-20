import Link from "next/link";
import SiteHeader from "@/components/site-header";

export default function GuideDetailPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#0c1220]">
      <section className="border-b border-[#e6dfd5] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader current="guides" />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <Link href="/ai-guides" className="text-sm text-[#7a6f67]">← AI 안내서 목록</Link>
          <div className="mt-8 rounded-[32px] border border-[#e6dfd5] bg-white p-8 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-10">
            <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">COMING SOON</p>
            <h1 className="mt-4 font-display text-[2rem] leading-[1.08] tracking-[-0.05em] sm:text-[3rem]">
              아직 공개된 안내서가 없습니다
            </h1>
            <p className="mt-5 text-sm leading-7 text-[#5d667d] sm:text-base">
              AI 안내서 게시 기능을 정리한 뒤 이 페이지에서 글을 읽을 수 있게 열릴 예정입니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/ai-guides" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-semibold text-white">
                안내서 목록으로
              </Link>
              <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ddd2c3] px-6 text-sm font-medium text-[#0c1220]">
                홈으로 가기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
