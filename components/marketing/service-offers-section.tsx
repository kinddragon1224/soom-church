const primaryOffer = {
  title: "행사·부서 랜딩페이지",
  badge: "6.9만 원부터",
  description:
    "교회가 가장 빠르게 결정할 수 있는 대표 상품입니다. 행사 소개, 일정, 장소, 신청 버튼까지 한 페이지로 정리해 바로 사용할 수 있게 제공합니다.",
  points: ["모바일 중심 1페이지 구성", "수정 1회", "짧은 납기", "교회 행사에 바로 적용 가능"],
};

const secondaryOffers = [
  {
    title: "행사용·설교용 AI 영상",
    price: "15초 5만 원부터",
    description: "홍보, 설교 하이라이트, 사역 소개를 짧고 강한 영상으로 정리합니다.",
  },
  {
    title: "설교 쇼츠 패키지",
    price: "월 4개 · 5만 원",
    description: "주일 설교 핵심 구간을 반복 납품형으로 제공합니다.",
  },
  {
    title: "간편 명단 관리 웹",
    price: "MVP 15만 원",
    description: "작은 조직이 바로 쓸 수 있는 운영용 도구를 가볍게 구축합니다.",
  },
];

const principles = [
  "짧은 납기와 명확한 범위",
  "납품 후 운영·유지보수는 별도",
  "초기 진입을 위한 낮은 가격 설계",
  "필요에 따라 영상·웹·운영도구를 함께 제안",
];

export function ServiceOffersSection() {
  return (
    <section id="service-offers" className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.01),rgba(99,102,241,0.02))]">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-xs tracking-[0.2em] text-white/50">PRIMARY OFFERS</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">
              설명이 쉬운 대표 상품부터
              <br />
              가볍게 시작합니다.
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-7 text-white/62 sm:text-base">
            솔루션 구조를 이해한 뒤에는, 교회가 가장 빠르게 결정할 수 있도록 대표 상품을 짧고 명확하게 제안합니다.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <article className="overflow-hidden rounded-[34px] border border-white/10 bg-[#0b1327]/92 shadow-[0_22px_80px_rgba(2,6,23,0.4)]">
            <div className="border-b border-white/10 px-6 py-5 sm:px-8">
              <p className="font-display text-xs tracking-[0.2em] text-indigo-100/58">FEATURED OFFER</p>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-3xl font-semibold text-white sm:text-4xl">{primaryOffer.title}</h3>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">{primaryOffer.description}</p>
                </div>
                <div className="inline-flex w-fit rounded-full border border-indigo-300/18 bg-indigo-400/10 px-3 py-1 text-xs font-medium tracking-[0.12em] text-indigo-100">
                  {primaryOffer.badge}
                </div>
              </div>
            </div>
            <div className="grid gap-3 px-6 py-6 sm:grid-cols-2 sm:px-8 sm:py-8">
              {primaryOffer.points.map((point) => (
                <div key={point} className="rounded-2xl border border-white/8 bg-[#091122] px-4 py-4 text-sm text-white/80">
                  {point}
                </div>
              ))}
            </div>
          </article>

          <div className="grid gap-4">
            {secondaryOffers.map((offer) => (
              <article key={offer.title} className="rounded-[28px] border border-white/10 bg-[#0b1327]/88 p-6 shadow-[0_18px_60px_rgba(2,6,23,0.34)] sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{offer.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/66">{offer.description}</p>
                  </div>
                  <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium tracking-[0.12em] text-white/60">
                    {offer.price}
                  </div>
                </div>
              </article>
            ))}

            <div className="rounded-[28px] border border-white/10 bg-[#0b1327]/78 p-6 sm:p-7">
              <p className="font-display text-xs tracking-[0.2em] text-white/44">PRINCIPLES</p>
              <ul className="mt-4 space-y-3 text-sm text-white/72">
                {principles.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400/90" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
