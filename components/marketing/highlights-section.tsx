const highlights = [
  {
    title: "대표 결과물",
    headline: "교회가 듣자마자 이해되는 상품 구조",
    description:
      "랜딩페이지, 설교 쇼츠, AI 영상, 간편 운영 도구처럼 지금 바로 설명되고 바로 납품되는 결과물 중심으로 구성합니다.",
  },
  {
    title: "현장 기준",
    headline: "대흥침례교회에서 검증한 흐름을 바탕으로",
    description:
      "설교 콘텐츠, 신청 웹, 명단 관리, 성경필사 프로젝트처럼 실제 교회 현장에서 반복되는 문제를 기준으로 설계합니다.",
  },
  {
    title: "확장 방향",
    headline: "필요하면 제작에서 플랫폼으로 확장합니다",
    description:
      "처음엔 작은 결과물로 시작하고, 필요가 쌓이면 워크스페이스와 운영 모듈로 연결되는 구조를 준비합니다.",
  },
];

export function HighlightsSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid gap-4 lg:grid-cols-3">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="rounded-[28px] border border-white/10 bg-[#0b1327]/80 p-6 shadow-[0_18px_60px_rgba(2,6,23,0.22)] sm:p-7"
          >
            <p className="font-display text-xs tracking-[0.2em] text-white/45">{item.title}</p>
            <h3 className="mt-4 text-2xl font-semibold leading-tight text-white">{item.headline}</h3>
            <p className="mt-4 text-sm leading-7 text-white/68 sm:text-base">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
