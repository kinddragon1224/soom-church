import Link from "next/link";
import SiteHeader from "@/components/site-header";

const reportPlans = [
  {
    label: "Free",
    title: "무료 포지션 체크",
    price: "0원",
    role: "유입 / 분류",
    promise: "직업 이름을 고르기 전에 현재 가까운 5포지션과 다음 행동 1개를 확인합니다.",
    points: ["개인정보 없이 즉시 결과", "학생/20대/전환 트랙 선택", "리포트 요청으로 연결"],
    cta: "무료 포지션 체크",
    href: "/diagnosis",
    featured: false,
  },
  {
    label: "Beta Hypothesis",
    title: "5포지션 미니 리포트",
    price: "29,000원",
    role: "첫 구매 / 저마찰 검증",
    promise: "주 포지션, 보조 가능성, 대체면·잔존면, 다음 행동 3개를 짧게 정리합니다.",
    points: ["가볍게 내 상황 점검", "짧은 텍스트 리포트", "상세 리포트 전 단계"],
    cta: "미니 리포트 요청",
    href: "/diagnosis/report-intake?source=pricing-mini&track=early_career",
    featured: false,
  },
  {
    label: "Main Beta",
    title: "5포지션 상세 리포트",
    price: "59,000원",
    role: "주력 상품",
    promise: "개인 조건 기반 주 포지션, 보조 포지션, 피해야 할 착각, 7/14일 실행안을 정리합니다.",
    points: ["현재 상태 한 줄 진단", "주/보조 포지션", "피해야 할 선택", "7/14일 실행안"],
    cta: "상세 리포트 요청",
    href: "/diagnosis/report-intake?source=pricing-detail&track=early_career",
    featured: true,
  },
  {
    label: "Premium Anchor",
    title: "1:1 미래설계 상담",
    price: "300,000원",
    role: "희소 프리미엄 옵션",
    promise: "리포트 이후에도 복잡한 선택이 남을 때 선용이 직접 봅니다.",
    points: ["제한 슬롯", "직접 판단 시간", "복잡한 의사결정용"],
    cta: "상담 가능 여부 문의",
    href: "/contact?offer=premium-direction-session",
    featured: false,
  },
];

const trackOffers = [
  {
    title: "학생/부모",
    desc: "아이에게 맞는 진로 환경, 부모가 피해야 할 개입, 다음 탐색 순서를 정리합니다.",
    href: "/diagnosis/report-intake?source=pricing-track&track=student_parent",
  },
  {
    title: "20대/첫 커리어",
    desc: "전공·프로젝트·경험을 이력서와 직무 언어로 번역합니다.",
    href: "/diagnosis/report-intake?source=pricing-track&track=early_career",
  },
  {
    title: "40~50대/전환",
    desc: "기존 경력을 버리지 않고 다음 시장에서 다시 불릴 이름으로 정리합니다.",
    href: "/diagnosis/report-intake?source=pricing-track&track=transition",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080b12] text-white">
      <section className="border-b border-white/10 bg-[#080b12]">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="pricing" ctaHref="/diagnosis" ctaLabel="무료 포지션 체크" />
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(255,91,46,0.25)_0%,rgba(255,91,46,0)_32%),radial-gradient(circle_at_86%_6%,rgba(79,123,255,0.22)_0%,rgba(79,123,255,0)_30%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff6b35]">Career Report Pricing</p>
          <h1 className="mt-5 max-w-5xl text-[2.5rem] font-black leading-[1.02] tracking-[-0.06em] text-white sm:text-[5.6rem] sm:leading-[0.94] sm:tracking-[-0.09em]">
            직업 이름보다 먼저,
            <br />
            포지션을 봅니다.
          </h1>
          <p className="mt-6 max-w-2xl text-base font-bold leading-8 text-white/68 sm:text-lg">
            더루멘의 중심 상품은 5포지션 리포트입니다. 무료 체크로 가까운 위치를 보고, 리포트로 상담 전 상황을 정리한 뒤, 복잡한 선택만 1:1로 연결합니다.
          </p>
          <p className="mt-5 max-w-2xl text-sm font-bold leading-7 text-white/48">
            아래 금액은 런칭 전 베타 가격입니다. 결제는 아직 붙이지 않고, 리포트 요청을 남긴 분께 안내합니다.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-4 lg:grid-cols-4">
            {reportPlans.map((plan) => (
              <article
                key={plan.title}
                className={`flex h-full flex-col rounded-[30px] border p-5 sm:p-6 ${
                  plan.featured
                    ? "border-[#ff6b35]/45 bg-[#ff6b35]/12 shadow-[0_28px_90px_rgba(255,107,53,0.12)]"
                    : "border-white/10 bg-white/[0.035]"
                }`}
              >
                <p className="w-fit rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-black text-[#ffb199]">{plan.label}</p>
                <h2 className="mt-5 text-2xl font-black tracking-[-0.04em] text-white">{plan.title}</h2>
                <p className="mt-3 text-3xl font-black tracking-[-0.05em] text-white">{plan.price}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-white/42">{plan.role}</p>
                <p className="mt-5 text-sm font-bold leading-7 text-white/68">{plan.promise}</p>
                <ul className="mt-6 grid gap-2 text-sm font-bold leading-6 text-white/58">
                  {plan.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
                <div className="mt-auto pt-7">
                  <Link
                    href={plan.href}
                    className={`inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 text-sm font-black transition ${
                      plan.featured ? "bg-white text-[#080b12] hover:bg-[#ff6b35] hover:text-white" : "border border-white/12 bg-white/[0.04] text-white hover:border-white/30 hover:bg-white/10"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b0f16]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff6b35]">Choose Track</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">누구의 포지션을 볼까요?</h2>
            <p className="mt-5 text-sm font-bold leading-7 text-white/62">
              처음이면 무료 포지션 체크부터 시작하면 됩니다. 이미 상황이 명확하다면 바로 트랙별 리포트 요청을 남겨도 됩니다.
            </p>
          </div>
          <div className="grid gap-4">
            {trackOffers.map((track) => (
              <Link key={track.title} href={track.href} className="rounded-[26px] border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#ff6b35]/40 hover:bg-[#ff6b35]/10">
                <h3 className="text-xl font-black tracking-[-0.03em] text-white">{track.title}</h3>
                <p className="mt-3 text-sm font-bold leading-7 text-white/64">{track.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="rounded-[34px] border border-[#73d6b6]/20 bg-[#73d6b6]/10 p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#bff4e4]">Launch Note</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">지금은 결제 전 베타 요청 단계입니다.</h2>
            <p className="mt-5 max-w-3xl text-sm font-bold leading-7 text-[#dffdf3]">
              자동 결제보다 중요한 것은 실제 고민이 들어오는지, 리포트가 돈을 낼 만큼 구체적인지 확인하는 것입니다. 요청을 남기면 입력 내용을 확인한 뒤 미니/상세 리포트 베타 안내를 드립니다.
            </p>
            <Link href="/diagnosis" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[#080b12] transition hover:bg-[#ff6b35] hover:text-white">
              무료 포지션 체크부터 시작하기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
