const offers = [
  {
    title: '설교 쇼츠 패키지',
    badge: '월 4개 · 5만 원',
    description:
      '주일 예배 말씀 중 1분 이내 핵심 구간을 쇼츠로 제작합니다. 원하는 부분 지정 가능, 교회 채널 업로드용으로 바로 납품합니다.',
    bullets: ['기본 컷 편집', '기본 자막 포함', '원하는 구간 요청 가능', '자막/편집 스타일 커스텀은 추가요금'],
  },
  {
    title: '행사·부서 랜딩페이지',
    badge: '기본 6.9만 원부터',
    description:
      '부흥회, 수련회, 세미나, 교구 행사 등 단일 목적 페이지를 빠르게 제작합니다. 안내와 신청 흐름을 한 페이지에 정리합니다.',
    bullets: ['소개 / 일정 / 장소 / 신청 버튼', '모바일 중심 1페이지 구성', '수정 1회', '확장형은 7만 원대 후반~9만 원대'],
  },
  {
    title: '교구·부속교회 간편 명단 관리 웹',
    badge: 'MVP 15만 원',
    description:
      '작은 조직이 바로 쓸 수 있는 원클릭형 명단 관리 웹을 MVP로 제공합니다. 복잡한 구축보다 빠른 사용과 현장 적용에 초점을 둡니다.',
    bullets: ['소규모 조직용 MVP', '핵심 기능 중심 고정 범위', '초기 셋업형 1회 납품', '유지보수·기능 확장은 별도'],
  },
];

const principles = [
  '교회와 사역 현장에 바로 쓰이는 결과물',
  '짧은 납기와 명확한 범위',
  '납품 후 운영·유지보수는 별도',
  '초기 진입을 위한 낮은 가격 설계',
];

export function ServiceOffersSection() {
  return (
    <section className="border-t border-white/10 bg-white/[0.02]">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs tracking-[0.2em] text-white/50">SERVICE OFFERS</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">
              숨은 플랫폼이면서,
              <br />
              교회 현장을 위한
              <br />
              디지털 납품도 바로 시작한다.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              대흥침례교회에서 실제로 진행 중인 흐름을 바탕으로, 먼저 필요한 결과물을 빠르게 납품합니다.
              플랫폼 구축과 별개로, 교회가 바로 체감할 수 있는 작은 실행 단위부터 시작합니다.
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm font-medium text-white">운영 원칙</p>
              <ul className="mt-4 space-y-3 text-sm text-white/65">
                {principles.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/60" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4">
            {offers.map((offer) => (
              <article key={offer.title} className="rounded-3xl border border-white/10 bg-black/20 p-6 sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{offer.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">{offer.description}</p>
                  </div>
                  <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.12em] text-white/75">
                    {offer.badge}
                  </div>
                </div>

                <ul className="mt-6 grid gap-3 text-sm text-white/70 sm:grid-cols-2">
                  {offer.bullets.map((bullet) => (
                    <li key={bullet} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
