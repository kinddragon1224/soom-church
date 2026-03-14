export function PlatformSection() {
  const rows = [
    { title: "교회별 워크스페이스", desc: "교회 단위 데이터 분리와 접근 제어" },
    { title: "연결된 운영 흐름", desc: "교적·신청·공지·후속관리 통합" },
    { title: "모듈형 확장", desc: "기록·모임·구독 영역으로 확장 가능" },
  ];

  return (
    <section id="platform-structure" className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <p className="text-xs tracking-[0.2em] text-white/50">PLATFORM STRUCTURE</p>
        <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
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
