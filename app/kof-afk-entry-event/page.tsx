import Image from "next/image";
import type { Metadata } from "next";

const posterImagePath = "/kof-afk-entry-event-0502.png";
const previewImagePath = "/kof-afk-entry-event-og.png";
const clubPageUrl = "/kof-afk-64-korea";

export const metadata: Metadata = {
  title: "KOF AFK 참전 이벤트 타임라인 | KOREA 클럽 공유용",
  description: "KOF AFK 참전 이벤트 일정을 모바일에서 보기 쉽게 정리한 KOREA 클럽 공유용 페이지입니다.",
  openGraph: {
    title: "KOF AFK 참전 이벤트 타임라인",
    description: "KOREA 클럽 공유용 참전 이벤트 일정표",
    url: "/kof-afk-entry-event",
    siteName: "KOREA Club",
    images: [
      {
        url: previewImagePath,
        width: 1200,
        height: 630,
        alt: "KOF AFK 참전 이벤트 타임라인 미리보기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KOF AFK 참전 이벤트 타임라인",
    description: "KOREA 클럽 공유용 참전 이벤트 일정표",
    images: [previewImagePath],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function KofAfkEntryEventPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080c16] text-white">
      <section className="relative">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,198,33,0.2)_0%,rgba(255,198,33,0)_30%),radial-gradient(circle_at_12%_20%,rgba(47,136,255,0.18)_0%,rgba(47,136,255,0)_35%),linear-gradient(145deg,#080c16_0%,#111529_48%,#060913_100%)]" />
        <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0_1px,transparent_1px_18px)] opacity-[0.07]" />

        <div className="relative mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          <header className="mb-4 flex flex-col gap-3 rounded-[28px] border border-white/10 bg-white/[0.055] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.36)] backdrop-blur sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0">
              <p className="text-xs font-black tracking-[0.28em] text-[#ffcc32]">KOREA CLUB SHARE</p>
              <h1 className="mt-2 text-2xl font-black tracking-[-0.05em] text-white sm:text-4xl">
                KOF AFK 참전 이벤트
              </h1>
              <p className="mt-2 text-sm font-bold leading-6 text-white/62">
                모바일에서 확대해서 보기 좋은 KOREA 클럽 공유용 일정표입니다.
              </p>
            </div>

            <a
              href={clubPageUrl}
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#ffcc32] px-5 text-sm font-black text-[#11100a] transition hover:bg-white"
            >
              KOREA 클럽 보기
            </a>
          </header>

          <figure className="overflow-hidden rounded-[26px] border border-white/10 bg-[#0c1324] shadow-[0_30px_120px_rgba(0,0,0,0.46)] sm:rounded-[36px]">
            <Image
              src={posterImagePath}
              alt="KOF AFK 참전 이벤트 타임라인"
              width={1800}
              height={3210}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 1040px"
              className="h-auto w-full select-none"
            />
          </figure>

          <div className="mt-4 rounded-[24px] border border-white/10 bg-white/[0.055] px-4 py-4 text-center text-xs font-bold leading-6 text-white/56 backdrop-blur sm:mt-6 sm:text-sm">
            이미지가 작게 보이면 브라우저 확대 또는 손가락 핀치 줌으로 확인하면 됩니다.
          </div>
        </div>
      </section>
    </main>
  );
}
