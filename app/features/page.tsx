import Link from "next/link";
import SiteHeader from "@/components/site-header";

const features = [
  {
    title: "진로 고민 구조화",
    desc: "불안, 현실 조건, 하고 싶은 마음, 할 수 있는 일을 나눠서 봅니다. 그래야 막연한 걱정이 상담 가능한 질문이 됩니다.",
  },
  {
    title: "AI 시대 역할 재설계",
    desc: "유망 직업 이름을 맞히기보다, 내가 이미 해온 일을 AI와 조합하면 어떤 역할이 되는지 같이 봅니다.",
  },
  {
    title: "포트폴리오와 상품화",
    desc: "상담에서 나온 말을 그냥 메모로 두지 않고, 노션, 웹, 콘텐츠, 제안서처럼 남에게 보여줄 형태로 옮깁니다.",
  },
  {
    title: "작은 실행 계획",
    desc: "인생 계획 전체를 다시 쓰기보다, 이번 주와 다음 주에 해볼 수 있는 행동부터 정합니다.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#f5efe5] text-[#15120d]">
      <section className="border-b border-[#dfd0bd] bg-[#fffaf2]">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader ctaHref="/contact" ctaLabel="상담 문의" />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.24em] text-[#9a6b32]">HOW SOOM HELPS</p>
            <h1 className="mt-5 text-[2.8rem] font-semibold leading-[1.02] tracking-[-0.065em] sm:text-[4.8rem]">
              숨은 고민을 듣고
              <br />
              손에 잡히는 일로 바꿉니다
            </h1>
            <p className="mt-7 max-w-3xl text-sm leading-8 text-[#6b5d4f] sm:text-base">
              기능 목록을 늘어놓기보다, 상담이 실제 행동으로 이어지기 위해 꼭 필요한 네 가지 흐름만 남겼습니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-[32px] border border-[#dfd0bd] bg-white p-7 shadow-[0_18px_44px_rgba(72,50,24,0.07)]">
                <h2 className="text-[1.65rem] font-semibold tracking-[-0.04em]">{feature.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[#6b5d4f]">{feature.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#15120d] px-6 text-sm font-semibold text-white">
              상담 문의하기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
