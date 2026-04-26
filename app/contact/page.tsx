import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { ConsultationInquiryForm } from "@/components/contact/consultation-inquiry-form";

const processSteps = [
  {
    step: "01",
    title: "지금 생각나는 만큼만 남깁니다",
    desc: "정리된 문장이 아니어도 괜찮습니다. 막힌 지점, 불안한 이유, 바라는 변화를 있는 그대로 봅니다.",
  },
  {
    step: "02",
    title: "무리해서 권하지 않고 방향을 봅니다",
    desc: "상담이 적합한지, 어떤 방식으로 시작하는 것이 좋은지 먼저 짧게 안내드립니다.",
  },
  {
    step: "03",
    title: "필요한 만큼만 정합니다",
    desc: "범위가 맞으면 일정, 방식, 준비 자료를 함께 정하고 맞지 않으면 다른 시작점을 제안합니다.",
  },
];

const responseCards = [
  {
    title: "완벽하게 정리해서 보내야 하나요?",
    desc: "아니요. 오히려 정리가 안 된 상태를 같이 보는 게 상담의 시작일 수 있습니다.",
  },
  {
    title: "AI 사용법만 배우는 건가요?",
    desc: "아니요. 도구 사용법보다 내 일과 경험에 AI를 어떻게 붙일지 함께 봅니다.",
  },
  {
    title: "어떤 답변을 받게 되나요?",
    desc: "상담이 맞는지, 어디서 시작하면 좋은지, 준비하면 좋은 자료가 있는지 먼저 안내드립니다.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#15120d] text-white">
      <section className="border-b border-white/10 bg-[#15120d]">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="contact" ctaHref="/contact" ctaLabel="상담 문의" />
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_28%),radial-gradient(circle_at_88%_18%,rgba(218,151,74,0.22)_0%,rgba(218,151,74,0)_30%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.24em] text-[#d7a760]">CAREER CONSULTATION</p>
            <h1 className="mt-5 font-display text-[2.8rem] leading-[1.02] tracking-[-0.065em] sm:text-[4.8rem]">
              정리 안 된 고민도
              <br />
              여기서부터
              <br />
              시작해도 됩니다
            </h1>
            <p className="mt-7 max-w-3xl text-sm leading-8 text-white/66 sm:text-base">
              진로가 막힌 이유가 능력 부족인지, 방향의 문제인지, 시대 변화에 대한 불안인지 혼자 구분하기 어려울 때가 있습니다.
              상담은 그 복잡한 마음을 천천히 풀어보고, 지금 할 수 있는 다음 행동을 찾는 데 집중합니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5 text-xs text-white/70">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">직업상담사 관점</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">AI 활용 커리어 설계</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">포트폴리오/상품화 기획</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:pb-28">
          <div className="rounded-[36px] border border-white/10 bg-[#201b14]/88 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)] sm:p-8">
            <div className="mb-6 rounded-[26px] border border-[#d7a760]/18 bg-[#d7a760]/[0.07] px-4 py-4 text-sm text-white/72">
              <p className="font-semibold text-white">상담 신청은 이렇게 진행됩니다</p>
              <div className="mt-3 grid gap-3">
                {processSteps.map((item) => (
                  <div key={item.step} className="rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-4">
                    <p className="text-[11px] tracking-[0.18em] text-[#f3c987]/72">STEP {item.step}</p>
                    <p className="mt-2 font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/62">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <ConsultationInquiryForm />
          </div>

          <div className="grid gap-5 self-start">
            <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <p className="text-xs tracking-[0.24em] text-white/38">MORA NOTE</p>
              <h2 className="mt-5 font-display text-[2rem] leading-[1.08] tracking-[-0.05em] text-white sm:text-[2.6rem]">
                상담은
                <br />
                정답 맞히기가 아니라
                <br />
                다음 행동을 찾는 시간입니다
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/62 sm:text-base">
                모라는 생각을 흩어지지 않게 붙잡는 AI 파트너입니다. 말이 길어져도 괜찮습니다. 그 안에서 반복되는 걱정과 가능성을 같이 찾아냅니다.
              </p>
            </div>

            <div className="rounded-[34px] border border-white/10 bg-[#201b14]/88 p-6 sm:p-8">
              <p className="text-xs tracking-[0.24em] text-white/38">FAQ</p>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-white/70">
                {responseCards.map((item) => (
                  <div key={item.title} className="rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-4">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] border border-white/10 bg-[#201b14]/88 p-6 sm:p-8">
              <p className="text-xs tracking-[0.24em] text-white/38">QUICK LINKS</p>
              <div className="mt-5 grid gap-3">
                <Link href="/" className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white/78">
                  컨설팅 소개로 돌아가기
                </Link>
                <Link href="/app/mobile" className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white/78">
                  목장월드 Lab 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
