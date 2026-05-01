import type { Metadata } from "next";

const kakaoOpenChatUrl = "https://open.kakao.com/o/gsCQYWoi";
const entryCode = "7223";

export const metadata: Metadata = {
  title: "KOF AFK 64섭 KOREA 클럽",
  description: "KOF AFK 64서버 KOREA 클럽 오픈채팅 초대 페이지입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

const rules = [
  "64섭에서 오래 같이 갈 분",
  "접속과 성장 루틴을 꾸준히 이어갈 분",
  "클럽 콘텐츠와 보상 타이밍을 함께 챙길 분",
  "서로 정보 공유하고 편하게 소통할 분",
];

const highlights = [
  { label: "SERVER", value: "64" },
  { label: "CLUB", value: "KOREA" },
  { label: "CODE", value: entryCode },
];

const joinSteps = [
  { title: "오픈채팅 검색", desc: "카카오톡 오픈채팅 검색창을 엽니다." },
  { title: "킹오파 KOREA 입력", desc: "검색어는 그대로 ‘킹오파 KOREA’입니다." },
  { title: "참여코드 입력", desc: `참여코드 ${entryCode}을 입력하고 입장합니다.` },
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
              참여코드 {entryCode}
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
                KOF AFK 64섭에서 같이 성장할 클럽원을 찾습니다.
                클마 백마탄과 함께 보상, 정보, 콘텐츠 타이밍을 챙기고 편하게 오래 갈 분이면 환영합니다.
              </p>
              <div className="mt-7 rounded-[28px] border border-[#ffe45c]/25 bg-[#ffe45c]/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffe45c]">Invite Code</p>
                <p className="mt-3 text-2xl font-black leading-tight text-white">
                  오픈톡은 검색창에 <span className="text-[#ffe45c]">킹오파 KOREA</span> 검색
                </p>
                <p className="mt-3 text-base font-black text-white/70">
                  참여코드 <span className="rounded-xl bg-white px-3 py-1 text-[#09070b]">{entryCode}</span>
                </p>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href={kakaoOpenChatUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-7 text-sm font-black text-[#07070b] transition hover:bg-[#ff3b20] hover:text-white"
                >
                  오픈채팅 바로가기
                </a>
                <a
                  href="#info"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 text-sm font-black text-white transition hover:border-white/35 hover:bg-white/10"
                >
                  검색 입장 방법 보기
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
                  <div className="relative mx-auto flex aspect-square max-w-[310px] items-center justify-center overflow-hidden rounded-full border border-[#c987ff]/45 bg-[radial-gradient(circle_at_50%_24%,rgba(202,135,255,0.88)_0%,rgba(111,55,255,0.42)_34%,rgba(4,4,12,0.92)_72%)] shadow-[0_0_80px_rgba(145,71,255,0.38)]">
                    <div className="absolute inset-3 rounded-full border border-white/15" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_26%,rgba(255,255,255,0.32)_0%,rgba(255,255,255,0)_18%),linear-gradient(135deg,rgba(255,255,255,0.1)_0_1px,transparent_1px_15px)] opacity-70" />
                    <div className="relative">
                      <p className="text-[11px] font-black tracking-[0.28em] text-[#f5d6ff]">CLUB MASTER</p>
                      <p className="mt-3 text-5xl font-black tracking-[-0.12em] text-white drop-shadow-[0_10px_24px_rgba(0,0,0,0.5)]">
                        백마탄
                      </p>
                      <p className="mt-3 text-sm font-black tracking-[0.22em] text-[#d9b7ff]">KOF AFK</p>
                    </div>
                  </div>
                  <p className="mt-5 text-3xl font-black tracking-[0.2em] text-white">KOREA</p>
                  <p className="mt-3 text-sm font-bold text-white/58">64 SERVER CLUB</p>
                </div>
                <div className="rounded-[28px] border border-[#ffe45c]/20 bg-black/30 p-4 text-center text-sm font-bold leading-6 text-white/72 backdrop-blur">
                  오픈톡 검색어: 킹오파 KOREA · 참여코드 {entryCode}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section id="info" className="border-t border-white/10 bg-[#050507]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ffbd40]">Join Guide</p>
            <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.06em] text-white sm:text-5xl">
              초대장 받으신 분은 이렇게 들어오시면 됩니다.
            </h2>
            <p className="mt-5 text-sm font-bold leading-7 text-white/58">
              링크가 안 열리면 카카오톡 오픈채팅 검색으로 들어오시면 됩니다. 검색어와 참여코드만 기억하시면 됩니다.
            </p>
          </div>

          <div className="grid gap-3">
            {joinSteps.map((step, index) => (
              <article key={step.title} className="flex items-center gap-4 rounded-[26px] border border-white/10 bg-white/[0.045] p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff3b20] text-sm font-black text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="font-black text-white">{step.title}</p>
                  <p className="mt-1 text-sm font-bold leading-6 text-white/62">{step.desc}</p>
                </div>
              </article>
            ))}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {rules.map((rule) => (
                <div key={rule} className="rounded-[22px] border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-bold leading-6 text-white/62">
                  {rule}
                </div>
              ))}
            </div>
            <a
              href={kakaoOpenChatUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex min-h-14 items-center justify-center rounded-full bg-[#ffe45c] px-7 text-sm font-black text-[#161006] transition hover:bg-white"
            >
              오픈카톡에서 합류 문의하기
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
