import type { Metadata } from "next";

const kakaoOpenChatUrl = "https://open.kakao.com/o/saOuK6pi";

export const metadata: Metadata = {
  title: "KOF AFK 64섭 KOREA 클럽",
  description: "KOF AFK 64서버 KOREA 클럽 1:1 가입문의 페이지입니다.",
  openGraph: {
    title: "KOF AFK 64섭 KOREA 클럽",
    description: "매너겜지향 · 친절한 클럽원들 · 참여도 우선 KOREA 클럽",
    url: "/kof-afk-64-korea",
    siteName: "KOREA Club",
    images: [
      {
        url: "/kof-afk-baekmatan-og-v2.png",
        width: 1200,
        height: 630,
        alt: "KOF AFK 64섭 KOREA 클럽장 백마탄 초대장",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KOF AFK 64섭 KOREA 클럽",
    description: "매너겜지향 · 친절한 클럽원들 · 참여도 우선 KOREA 클럽",
    images: ["/kof-afk-baekmatan-og-v2.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

const clubTraits = [
  "매너겜지향",
  "친절한 클럽원들",
  "앞서버 고인물 부캐 스승 존재",
  "투력 줄세우기보단 참여도 우선순위",
];

const highlights = [
  { label: "SERVER", value: "64" },
  { label: "CLUB", value: "KOREA" },
  { label: "INQUIRY", value: "1:1" },
];

export default function KofAfkKoreaClubPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050507] text-white">
      <section className="relative min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,59,32,0.42)_0%,rgba(255,59,32,0)_30%),radial-gradient(circle_at_86%_10%,rgba(84,77,255,0.42)_0%,rgba(84,77,255,0)_32%),radial-gradient(circle_at_50%_92%,rgba(255,190,64,0.38)_0%,rgba(255,190,64,0)_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_18px)] opacity-[0.08]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,rgba(5,5,7,0)_0%,#050507_72%)]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between gap-4">
            <p className="text-sm font-black tracking-[0.32em] text-white/70">KOF AFK</p>
            <p className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white/86 backdrop-blur">
              1:1 가입문의
            </p>
          </header>

          <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
            <section className="min-w-0">
              <div className="inline-flex rounded-full border border-[#ffbd40]/25 bg-[#ffbd40]/10 px-4 py-2 text-xs font-black tracking-[0.22em] text-[#ffd98a]">
                SERVER 64 · KOREA CLUB
              </div>
              <h1 className="mt-6 max-w-4xl text-[4.1rem] font-black leading-[0.82] tracking-[-0.09em] text-white sm:text-[7.4rem] lg:text-[8.6rem]">
                KOREA
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-white/72 sm:text-xl sm:leading-9">
                KOF AFK 64섭 KOREA는 빠른 줄세우기보다 매너와 참여도를 먼저 보는 클럽입니다.
                편하게 오래 같이 갈 분이라면 1:1로 문의 주세요.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {clubTraits.map((trait) => (
                  <div
                    key={trait}
                    className="rounded-[24px] border border-[#ffe45c]/20 bg-[#ffe45c]/10 px-5 py-4 text-base font-black leading-6 text-white shadow-[0_0_34px_rgba(255,228,92,0.08)]"
                  >
                    {trait}
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href={kakaoOpenChatUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-7 text-sm font-black text-[#07070b] transition hover:bg-[#ff3b20] hover:text-white"
                >
                  1:1 가입문의 하기
                </a>
                <a
                  href="#info"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 text-sm font-black text-white transition hover:border-white/35 hover:bg-white/10"
                >
                  클럽 성향 보기
                </a>
              </div>
            </section>

            <section className="relative min-h-[430px] overflow-hidden rounded-[42px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_34px_120px_rgba(0,0,0,0.48)] backdrop-blur">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_30%,rgba(255,59,32,0.55)_0%,rgba(255,59,32,0)_28%),radial-gradient(circle_at_78%_32%,rgba(86,91,255,0.55)_0%,rgba(86,91,255,0)_32%),radial-gradient(circle_at_50%_94%,rgba(255,221,92,0.45)_0%,rgba(255,221,92,0)_34%)]" />
              <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 shadow-[0_0_80px_rgba(255,255,255,0.12)_inset]" />
              <div className="absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[42px] border border-white/20 bg-[#080812]/80 shadow-[0_0_60px_rgba(255,59,32,0.2)]" />
              <div className="relative z-10 flex h-full min-h-[390px] flex-col justify-between">
                <div className="flex justify-between gap-3">
                  {highlights.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur">
                      <p className="text-[10px] font-black tracking-[0.22em] text-white/40">{item.label}</p>
                      <p className="mt-1 text-sm font-black text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mx-auto w-full max-w-sm text-center">
                  <img
                    src="/kof-afk-baekmatan-v2.png"
                    alt="KOF AFK 64섭 KOREA 클럽장 백마탄"
                    className="mx-auto aspect-square max-w-[330px] rounded-full object-cover shadow-[0_0_90px_rgba(145,71,255,0.48)]"
                  />
                  <p className="mt-5 text-3xl font-black tracking-[0.2em] text-white">KOREA</p>
                  <p className="mt-3 text-sm font-bold text-white/58">64 SERVER CLUB</p>
                </div>
                <div className="rounded-[28px] border border-[#ffe45c]/20 bg-black/30 p-4 text-center text-sm font-bold leading-6 text-white/72 backdrop-blur">
                  매너겜지향 · 참여도 우선 · 1:1 가입문의
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section id="info" className="border-t border-white/10 bg-[#050507]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-16 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ffbd40]">Join Inquiry</p>
            <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.06em] text-white sm:text-5xl">
              가입은 1:1로 편하게 문의 주세요.
            </h2>
            <p className="mt-5 text-sm font-bold leading-7 text-white/58">
              클럽 분위기와 접속 패턴이 맞는지 먼저 가볍게 이야기하고 합류하면 됩니다.
              투력보다 같이 오래 갈 매너와 참여도를 더 봅니다.
            </p>
          </div>

          <div className="rounded-[34px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_28px_100px_rgba(0,0,0,0.35)]">
            <div className="grid gap-3 sm:grid-cols-2">
              {clubTraits.map((trait) => (
                <div
                  key={trait}
                  className="rounded-[22px] border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold leading-6 text-white/70"
                >
                  {trait}
                </div>
              ))}
            </div>
            <a
              href={kakaoOpenChatUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#ffe45c] px-7 text-sm font-black text-[#161006] transition hover:bg-white"
            >
              1:1 가입문의 열기
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
