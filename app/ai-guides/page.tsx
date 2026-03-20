import Link from "next/link";
import SiteHeader from "@/components/site-header";

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#0c1220]">
      <section className="border-b border-[#e6dfd5] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader current="guides" />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <p className="text-xs tracking-[0.24em] text-[#7a6f67]">AI GUIDE</p>
          <h1 className="mt-5 font-display text-[2.6rem] leading-[1.05] tracking-[-0.06em] sm:text-[4.4rem]">
            목회자와 사역자를 위한
            <br />
            AI 안내서
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-[#5d667d] sm:text-base">
            설교 준비, 행정, 공지, 콘텐츠, 반복 업무 정리에 바로 적용할 수 있는 실전형 AI 가이드를 정리하는 공간입니다.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
          <div className="rounded-[32px] border border-[#e6dfd5] bg-white p-8 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-10">
            <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">COMING SOON</p>
            <h2 className="mt-4 font-display text-[2rem] leading-[1.08] tracking-[-0.05em] sm:text-[3rem]">
              AI 안내서가 곧 열립니다
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#5d667d] sm:text-base">
              지금은 글쓰기와 게시 기능을 정리하는 중입니다. 준비가 끝나면 목회자와 사역자를 위한 실전형 안내서를 이곳에서 바로 읽을 수 있게 열어둘게요.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-semibold text-white">
                홈으로 가기
              </Link>
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ddd2c3] px-6 text-sm font-medium text-[#0c1220]">
                문의하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
