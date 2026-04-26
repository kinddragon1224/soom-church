import Link from "next/link";
import SiteHeader from "@/components/site-header";

const strengths = [
  {
    title: "직업상담사 관점",
    desc: "“뭘 하고 싶으세요?”라고만 묻지 않습니다. 살아온 흐름, 버틸 수 있는 조건, 다시 시작할 힘까지 같이 봅니다.",
  },
  {
    title: "기획자의 구조화",
    desc: "머릿속에만 있던 말을 포트폴리오, 콘텐츠, 서비스 제안, 다음 실행 순서로 옮겨봅니다.",
  },
  {
    title: "AI 실전 활용 경험",
    desc: "AI를 멋진 말로만 설명하지 않습니다. 비개발자로 부딪히며 제품을 만들어본 경험으로 현실적인 사용법을 봅니다.",
  },
];

const principles = [
  "불안을 겁주거나 팔지 않습니다. 대신 지금 선택할 수 있는 길을 같이 봅니다.",
  "유행하는 직업명보다 이미 가진 경험, 관계, 성향, 체력을 먼저 봅니다.",
  "AI 사용법보다 AI와 함께 일하는 방식을 내 일에 맞게 설계합니다.",
  "상담이 끝났을 때 ‘그래서 오늘 뭘 하지?’에 답할 수 있게 남깁니다.",
];

const moraRoles = [
  {
    title: "생각 정리",
    desc: "말이 길어져도 괜찮습니다. 반복해서 나오는 걱정과 진짜 질문을 찾아냅니다.",
  },
  {
    title: "기획 보조",
    desc: "강점, 경험, 관심사를 남에게 보여줄 수 있는 형태로 바꿔봅니다.",
  },
  {
    title: "실행 동반",
    desc: "상담 뒤에도 너무 큰 숙제가 남지 않도록 다음 행동을 작게 쪼갭니다.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f5efe5] text-[#15120d]">
      <section className="border-b border-[#dfd0bd] bg-[#fffaf2]">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader current="about" ctaHref="/contact" ctaLabel="상담 문의" />
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0)_28%),radial-gradient(circle_at_82%_8%,rgba(212,143,62,0.24)_0%,rgba(212,143,62,0)_28%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-5xl">
            <p className="text-xs tracking-[0.24em] text-[#9a6b32]">ABOUT SOOM</p>
            <h1 className="mt-5 text-[2.8rem] font-semibold leading-[1.02] tracking-[-0.065em] text-[#15120d] sm:text-[4.8rem]">
              숨은 불안을
              <br />
              일의 언어로 바꾸는 곳입니다
            </h1>
            <div className="mt-8 max-w-3xl space-y-5 text-sm leading-8 text-[#5c5146] sm:text-base">
              <p>
                요즘은 진로 고민이 예전처럼 단순하지 않습니다. “어떤 직업이 좋을까?”보다 “내가 해온 일이 앞으로도 의미가 있을까?”라는 질문이 먼저 올라옵니다.
              </p>
              <p>
                숨은 그 질문을 급하게 정답으로 덮지 않습니다. 자격, 경험, 관심사, 불안을 하나씩 꺼내보고 지금 현실에서 시작할 수 있는 선택지로 바꿉니다.
              </p>
              <p>
                이곳에서 모라는 단순한 챗봇 이름이 아닙니다. 생각이 흩어질 때 옆에서 붙잡아주고, 기획과 실행 사이를 이어주는 파트너의 이름입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
          <div className="rounded-[40px] border border-[#dfd0bd] bg-white p-7 shadow-[0_24px_70px_rgba(72,50,24,0.08)] sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <p className="text-xs tracking-[0.24em] text-[#9a6b32]">WHY SOOM</p>
                <h2 className="mt-5 text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.055em] text-[#15120d] sm:text-[3.2rem]">
                  진로 고민은
                  <br />
                  직업 추천만으로 풀리지 않습니다
                </h2>
              </div>
              <div className="space-y-5 text-sm leading-8 text-[#5c5146] sm:text-base">
                <p>
                  많은 사람이 AI 때문에 무엇이 사라질지 걱정합니다. 그 걱정은 가볍지 않습니다. 다만 거기서 멈추면 아무것도 정리되지 않습니다.
                </p>
                <p>
                  숨은 직업상담의 언어와 기획의 언어를 함께 씁니다. 마음의 불안을 무시하지 않되, 상담이 위로만 남기고 끝나지 않도록 구조를 만듭니다.
                </p>
                <p>
                  그래서 상담의 결과는 “힘내세요” 한마디가 아니라, 포트폴리오 주제, 콘텐츠 방향, 학습 순서, 상품 후보, 다음 2~4주의 행동 계획이어야 합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#15120d] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.24em] text-white/42">CORE STRENGTH</p>
            <h2 className="mt-5 text-[2.3rem] font-semibold leading-[1.06] tracking-[-0.06em] sm:text-[3.8rem]">
              이야기를 듣고,
              <br />
              구조를 만들고,
              <br />
              실행으로 보냅니다
            </h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {strengths.map((item) => (
              <article key={item.title} className="rounded-[32px] border border-white/10 bg-white/[0.04] p-7">
                <h3 className="text-[1.55rem] font-semibold tracking-[-0.04em]">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/64">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#efe4d5]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-24">
          <div>
            <p className="text-xs tracking-[0.24em] text-[#9a6b32]">PRINCIPLES</p>
            <h2 className="mt-5 text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.055em] text-[#15120d] sm:text-[3.2rem]">
              숨이 지키는
              <br />
              상담 기준
            </h2>
            <p className="mt-6 text-sm leading-7 text-[#6b5d4f]">
              AI 시대라는 말이 누군가를 더 불안하게 만들지 않도록, 상담은 현실성과 실행 가능성을 기준으로 진행합니다.
            </p>
          </div>
          <div className="grid gap-3">
            {principles.map((item) => (
              <div key={item} className="rounded-[24px] border border-[#d9c7af] bg-white/76 px-5 py-5 text-sm font-medium leading-7 text-[#30261b] shadow-[0_14px_34px_rgba(72,50,24,0.06)]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf2]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="rounded-[40px] border border-[#dfd0bd] bg-[#f8f0e4] p-7 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs tracking-[0.24em] text-[#9a6b32]">MORA</p>
                <h2 className="mt-5 text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.055em] text-[#15120d] sm:text-[3.2rem]">
                  모라는 생각과 실행 사이에 있습니다
                </h2>
                <p className="mt-6 text-sm leading-7 text-[#6b5d4f]">
                  모라는 사용자의 말과 기록을 정리하고, 진로와 상품화의 다음 단계를 함께 설계하는 AI 파트너입니다. 혼자 정리하다 지치는 지점을 같이 넘기기 위해 있습니다.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {moraRoles.map((item) => (
                  <article key={item.title} className="rounded-[26px] border border-[#dfd0bd] bg-white p-5">
                    <h3 className="text-xl font-semibold tracking-[-0.04em] text-[#15120d]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#6b5d4f]">{item.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#15120d] text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:px-10">
          <div>
            <p className="text-xs tracking-[0.24em] text-white/38">NEXT</p>
            <h2 className="mt-4 text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.05em] sm:text-[3rem]">
              지금 고민을 말이 되는 질문으로 바꿔보세요.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">
              현재 상황을 남겨주시면 상담 적합도와 추천 시작점을 먼저 안내드립니다.
            </p>
          </div>
          <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#15120d]">
            상담 문의하기
          </Link>
        </div>
      </section>
    </main>
  );
}
