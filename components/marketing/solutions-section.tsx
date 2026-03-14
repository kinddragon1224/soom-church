const categories = [
  {
    title: "제작",
    subtitle: "Pages & Visuals",
    description:
      "행사 페이지, 설교 쇼츠, AI 영상처럼 교회가 바로 써야 하는 결과물을 가장 빠르게 정리해 제공합니다.",
    items: ["행사·부서 랜딩페이지", "설교 쇼츠 패키지", "행사용·설교용 AI 영상"],
  },
  {
    title: "운영",
    subtitle: "Operations",
    description:
      "신청, 명단, 워크스페이스처럼 현장 운영에 반복적으로 필요한 도구를 가볍고 단정하게 구축합니다.",
    items: ["신청 웹", "간편 명단 관리 웹", "교회별 워크스페이스"],
  },
  {
    title: "콘텐츠",
    subtitle: "Content Support",
    description:
      "설교 요약, 나눔지, 음성 콘텐츠처럼 메시지를 더 오래 전달할 수 있도록 콘텐츠 흐름을 함께 만듭니다.",
    items: ["설교 요약", "목장 나눔지", "TTS 음성 콘텐츠"],
  },
];

export function SolutionsSection() {
  return (
    <section id="solutions" className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(99,102,241,0.015))]">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-xs tracking-[0.2em] text-white/50">SOLUTIONS</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">
              숨은 교회를 위해
              <br />
              세 가지 방식으로 일합니다.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/65 sm:text-base">
            하나의 서비스만 파는 것이 아니라, 교회가 실제로 겪는 필요를 제작·운영·콘텐츠의 세 축으로 정리해 제안합니다.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.title}
              className="rounded-[28px] border border-white/10 bg-[#0b1327]/88 p-6 shadow-[0_18px_60px_rgba(2,6,23,0.34)] transition hover:border-indigo-300/20 hover:bg-[#101a35] sm:p-7"
            >
              <p className="font-display text-xs tracking-[0.18em] text-indigo-200/65">{category.subtitle}</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">{category.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/68 sm:text-base">{category.description}</p>

              <ul className="mt-6 space-y-3 text-sm text-white/78">
                {category.items.map((item) => (
                  <li key={item} className="rounded-2xl border border-white/8 bg-[#091122] px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
