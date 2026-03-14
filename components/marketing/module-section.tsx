const modules = [
  { title: "숨 교적", desc: "작은 조직부터 시작할 수 있는 교회 맞춤 명단·관리 흐름" },
  { title: "숨 신청", desc: "행사와 접수 흐름을 모바일 중심으로 단순하게 정리" },
  { title: "숨 알림", desc: "공지와 후속 커뮤니케이션을 한 흐름으로 연결" },
  { title: "숨 콘텐츠", desc: "설교 요약, 나눔지, 음성 콘텐츠까지 메시지 전달 지원" },
];

export function ModuleSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="font-display text-xs tracking-[0.2em] text-white/50">MODULES</p>
      <h2 className="mt-3 text-3xl font-semibold text-white sm:text-5xl">핵심 모듈은 작게 시작하고 자연스럽게 확장됩니다</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
        지금 필요한 것은 제작으로 해결하고, 반복되는 운영 문제는 모듈로 연결하는 구조를 준비합니다.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => (
          <article key={module.title} className="rounded-[24px] border border-white/10 bg-[#0b1327]/80 p-5 shadow-[0_18px_60px_rgba(2,6,23,0.18)]">
            <h3 className="text-lg font-semibold text-white">{module.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/68">{module.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
