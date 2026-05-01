import type { Metadata } from "next";

const blogUrl =
  "https://blog.naver.com/PostView.naver?blogId=chosoislegend&logNo=224264310677&categoryNo=0&parentCategoryNo=0&viewDate=&currentPage=2&postListTopCurrentPage=&from=section&userTopListOpen=true&userTopListCount=5&userTopListManageOpen=false&userTopListCurrentPage=2";
const kakaoInquiryUrl = "https://open.kakao.com/o/saOuK6pi";

export const metadata: Metadata = {
  title: "KOF AFK 초보자 공략 가이드 | 선비사의 3번째 부캐",
  description: "쿠사나기 덕후 감성으로 쉽게 정리한 KOF AFK 64섭 초보자 공략 허브입니다.",
  openGraph: {
    title: "KOF AFK 초보자 공략 가이드",
    description: "선비사의 3번째 부캐가 알려주는 초반 성장 루트와 실수 방지 노트",
    url: "/kof-afk-bisa-guide",
    siteName: "KOREA Club",
    images: [
      {
        url: "/kof-afk-sunbisa-kusanagi-main.webp",
        width: 1200,
        height: 630,
        alt: "선비사의 쿠사나기 메인 캐릭터 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KOF AFK 초보자 공략 가이드",
    description: "선비사의 3번째 부캐가 알려주는 초반 성장 루트와 실수 방지 노트",
    images: ["/kof-afk-sunbisa-kusanagi-main.webp"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

const guideCards = [
  {
    label: "START 01",
    title: "초반 성장 루트",
    desc: "처음 며칠은 멋있는 캐릭터보다 막히지 않는 성장 순서가 먼저입니다. 재화, 스테이지, 콘텐츠 개방 순서를 잃지 않게 잡아줍니다.",
  },
  {
    label: "START 02",
    title: "매일 해야 할 것",
    desc: "출석, 일일 보상, 이벤트 체크처럼 놓치면 손해 보는 루틴을 짧게 정리합니다. 바쁜 날에도 이것만 하면 되는 기준을 세웁니다.",
  },
  {
    label: "START 03",
    title: "덱과 캐릭터 우선순위",
    desc: "좋아하는 캐릭터와 실제 진행 효율 사이에서 덜 헤매도록, 초보자가 먼저 키울 축과 기다릴 축을 나눠봅니다.",
  },
  {
    label: "START 04",
    title: "실수 방지 노트",
    desc: "초반 재화 낭비, 무리한 투력 비교, 애매한 강화처럼 되돌리기 아까운 선택을 줄이는 체크리스트입니다.",
  },
];

const teacherNotes = [
  "쿠사나기 좋아함. 불꽃 주인공 감성 못 참음.",
  "근데 초보자한테는 어려운 말보다 쉽게 풀어주는 쪽.",
  "앞서버 고인물 부캐 관점으로 길을 짧게 알려줌.",
  "투력으로 겁주기보다 참여도와 루틴을 먼저 봄.",
];

const beginnerRules = [
  "모르면 물어보기",
  "재화는 급하게 태우지 않기",
  "매일 루틴 먼저 챙기기",
  "좋아하는 캐릭터도 살리고 효율도 챙기기",
];

export default function KofAfkBisaGuidePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050309] text-white">
      <section className="relative min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,50,24,0.54)_0%,rgba(255,50,24,0)_31%),radial-gradient(circle_at_86%_24%,rgba(119,49,255,0.56)_0%,rgba(119,49,255,0)_34%),radial-gradient(circle_at_48%_95%,rgba(255,173,47,0.42)_0%,rgba(255,173,47,0)_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_20px)] opacity-[0.08]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,rgba(5,3,9,0)_0%,#050309_76%)]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between gap-4">
            <p className="text-sm font-black tracking-[0.32em] text-white/70">KOF AFK GUIDE</p>
            <p className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white/86 backdrop-blur">
              64섭 KOREA
            </p>
          </header>

          <div className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.03fr_0.97fr] lg:py-20">
            <section className="min-w-0">
              <div className="inline-flex rounded-full border border-[#ff4328]/30 bg-[#ff4328]/12 px-4 py-2 text-xs font-black tracking-[0.22em] text-[#ffb19d]">
                BEGINNER ROUTE · FIRE NOTE
              </div>
              <h1 className="mt-6 max-w-5xl text-[3.2rem] font-black leading-[0.88] tracking-[-0.08em] text-white sm:text-[5.8rem] lg:text-[7.2rem]">
                초보자 공략,
                <br />
                쉽게 갑니다.
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-white/72 sm:text-xl sm:leading-9">
                KOF AFK 처음 시작한 분들을 위해 선비사의 3번째 부캐가 초반 루트, 매일 루틴, 덱 방향을 덕후 감성으로 쉽게 정리합니다.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {beginnerRules.map((rule) => (
                  <div
                    key={rule}
                    className="rounded-[24px] border border-[#ffcc52]/18 bg-[#ffcc52]/10 px-5 py-4 text-base font-black leading-6 text-white shadow-[0_0_36px_rgba(255,67,40,0.12)]"
                  >
                    {rule}
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href={blogUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-7 text-sm font-black text-[#08050b] transition hover:bg-[#ff4328] hover:text-white"
                >
                  블로그 공략 보기
                </a>
                <a
                  href={kakaoInquiryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 text-sm font-black text-white transition hover:border-white/35 hover:bg-white/10"
                >
                  막히면 1:1로 물어보기
                </a>
              </div>
            </section>

            <section className="relative min-h-[460px] overflow-hidden rounded-[44px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_34px_120px_rgba(0,0,0,0.54)] backdrop-blur">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_26%,rgba(255,60,25,0.62)_0%,rgba(255,60,25,0)_30%),radial-gradient(circle_at_76%_28%,rgba(104,66,255,0.58)_0%,rgba(104,66,255,0)_34%),radial-gradient(circle_at_50%_96%,rgba(255,202,82,0.45)_0%,rgba(255,202,82,0)_35%)]" />
              <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/24 shadow-[0_0_80px_rgba(255,255,255,0.10)_inset]" />
              <div className="absolute left-[12%] top-[16%] h-24 w-24 rounded-full bg-[#ff4328]/40 blur-3xl" />
              <div className="absolute bottom-[12%] right-[10%] h-28 w-28 rounded-full bg-[#8f4dff]/40 blur-3xl" />

              <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-between">
                <div className="flex flex-wrap justify-between gap-3">
                  {["KUSANAGI MOOD", "BEGINNER", "FIRE TEACHER"].map((label) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur">
                      <p className="text-[10px] font-black tracking-[0.2em] text-white/42">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mx-auto w-full max-w-sm text-center">
                  <div className="relative mx-auto flex aspect-square max-w-[330px] items-center justify-center overflow-hidden rounded-full border border-white/15 bg-[#0b0611] shadow-[0_0_100px_rgba(255,67,40,0.42)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,214,88,0.32)_0%,rgba(255,67,40,0.34)_28%,rgba(101,38,255,0.22)_55%,rgba(0,0,0,0)_72%)]" />
                    <div className="absolute h-[88%] w-[88%] rounded-full border border-[#ffcc52]/30" />
                    <div className="absolute h-[66%] w-[66%] rotate-45 rounded-[34px] border border-white/14 bg-black/28" />
                    <img
                      src="/kof-afk-sunbisa-kusanagi-main.webp"
                      alt="선비사가 좋아하는 쿠사나기풍 메인 캐릭터"
                      className="relative h-full w-full scale-110 object-cover object-center mix-blend-screen"
                    />
                  </div>
                  <p className="mt-6 text-3xl font-black tracking-[-0.04em] text-white">선비사의 3번째 부캐</p>
                  <p className="mt-3 text-sm font-bold text-white/58">초보자 공략 · 불꽃 덕후 · 쉬운 설명</p>
                </div>

                <div className="rounded-[28px] border border-[#ffcc52]/20 bg-black/30 p-4 text-center text-sm font-bold leading-6 text-white/72 backdrop-blur">
                  어렵게 말하지 않고, 처음 하는 사람이 따라올 수 있게.
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#050309]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ffcc52]">Beginner Guide</p>
            <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.06em] text-white sm:text-5xl">
              초보자가 먼저 보면 좋은 것들.
            </h2>
            <p className="mt-5 text-sm font-bold leading-7 text-white/58">
              KOF AFK는 초반에 정보가 너무 많아서 오히려 방향을 잃기 쉽습니다.
              이 페이지는 블로그 공략으로 넘어가기 전, 무엇부터 봐야 하는지 정리한 입구입니다.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {guideCards.map((card) => (
              <article key={card.title} className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5">
                <p className="text-[11px] font-black tracking-[0.22em] text-[#ffcc52]">{card.label}</p>
                <h3 className="mt-4 text-2xl font-black tracking-[-0.04em] text-white">{card.title}</h3>
                <p className="mt-3 text-sm font-bold leading-7 text-white/60">{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#08050b]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-20">
          <div className="overflow-hidden rounded-[38px] border border-white/10 bg-white/[0.045] p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff8f74]">Teacher Profile</p>
            <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.06em] text-white sm:text-5xl">
              쿠사나기 좋아하는 씹덕후,
              <br />
              설명은 친절하게.
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-[0.72fr_1fr]">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/24">
                <img
                  src="/kof-afk-sunbisa-kusanagi-stand.png"
                  alt="불꽃을 든 쿠사나기풍 전신 캐릭터"
                  className="h-full max-h-[360px] w-full object-cover object-top"
                />
              </div>
              <div className="grid gap-3">
                {teacherNotes.map((note) => (
                  <div key={note} className="rounded-[22px] border border-white/10 bg-black/24 px-4 py-3 text-sm font-bold leading-6 text-white/68">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[38px] border border-[#ffcc52]/20 bg-[#ffcc52]/10 p-6 sm:p-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ffcc52]">Next Action</p>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.05em] text-white">
                공략 보고도 막히면, 질문하면 됩니다.
              </h2>
              <p className="mt-4 text-sm font-bold leading-7 text-white/62">
                블로그 글로 큰 방향을 보고, 내 계정 상황에 맞는 부분은 1:1 문의로 물어보세요.
                초보자 질문 환영입니다.
              </p>
            </div>
            <div className="mt-8 grid gap-3">
              <a
                href={blogUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-7 text-sm font-black text-[#08050b] transition hover:bg-[#ff4328] hover:text-white"
              >
                네이버 블로그 공략 보기
              </a>
              <a
                href={kakaoInquiryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/15 bg-black/24 px-7 text-sm font-black text-white transition hover:bg-black/40"
              >
                KOREA 1:1 가입문의
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
