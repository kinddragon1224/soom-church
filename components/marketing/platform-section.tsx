export function PlatformSection() {
  const rows = [
    { title: "교회별 워크스페이스", desc: "교회 단위 데이터 분리와 역할별 접근 흐름" },
    { title: "연결된 운영 흐름", desc: "신청·명단·공지·후속관리를 하나의 질서로 연결" },
    { title: "제작에서 운영으로 확장", desc: "작은 결과물 납품에서 시작해 필요한 만큼 플랫폼으로 확장" },
  ];

  return (
    <section id="platform-structure" className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <p className="font-display text-xs tracking-[0.2em] text-white/50">PLATFORM STRUCTURE</p>
        <h2 className="mt-3 text-3xl font-semibold text-white sm:text-5xl">숨은 제작 이후의 운영까지 설계합니다</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">교회가 지금 당장 필요한 결과물을 빠르게 제공하는 데서 끝나지 않고, 이후 운영 흐름이 쌓이면 교회별 플랫폼 구조로 연결합니다.</p>
        <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {rows.map((row) => (
            <div key={row.title} className="grid gap-2 py-5 sm:grid-cols-[1fr_1.2fr] sm:gap-6">
              <h3 className="text-lg font-medium text-white">{row.title}</h3>
              <p className="text-sm text-white/65 sm:text-base">{row.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
