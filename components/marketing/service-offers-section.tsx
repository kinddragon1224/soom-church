const offers = [
  {
    title: '행사·부서 랜딩페이지',
    badge: '기본 6.9만 원부터',
    description:
      '부흥회, 수련회, 세미나, 교구 행사 등 단일 목적 페이지를 빠르게 제작합니다. 안내와 신청 흐름을 한 페이지에 정리합니다.',
    bullets: ['소개 / 일정 / 장소 / 신청 버튼', '모바일 중심 1페이지 구성', '수정 1회', '확장형은 7만 원대 후반~9만 원대'],
  },
  {
    title: '행사용·설교용 AI 영상 제작',
    badge: '15초 5만 원부터',
    description:
      '행사 홍보, 설교 하이라이트, 사역 소개에 맞는 고퀄리티 AI 영상을 제작합니다. 짧고 강한 메시지를 모바일 중심 영상으로 빠르게 납품합니다.',
    bullets: ['15초 5만 원 / 30초 10만 원 / 1분 15만 원', '기본 기획 협의 포함', '수정 1회', '고난도 합성·실사 인물합성·TTS는 별도 협의'],
  },
  {
    title: '설교 쇼츠 패키지',
    badge: '월 4개 · 5만 원',
    description:
      '주일 예배 말씀 중 1분 이내 핵심 구간을 쇼츠로 제작합니다. 원하는 부분 지정 가능, 교회 채널 업로드용으로 바로 납품합니다.',
    bullets: ['기본 컷 편집', '기본 자막 포함', '원하는 구간 요청 가능', '자막/편집 스타일 커스텀은 추가요금'],
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
  '영상·웹·운영도구를 상황에 맞게 묶어서 제안 가능',
];

export function ServiceOffersSection() {
  return (
    <section id="service-offers" className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.01),rgba(99,102,241,0.025))]">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="font-display text-xs tracking-[0.2em] text-white/50">SERVICE OFFERS</p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-5xl">
              지금 바로 설명되고,
              <br />
              바로 납품되는 대표 상품입니다.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              솔루션 구조를 이해한 뒤에는, 교회가 가장 빠르게 결정할 수 있도록 대표 상품을 명확한 가격과 범위로 제안합니다.
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-[#0b1327]/88 p-5 shadow-[0_16px_50px_rgba(2,6,23,0.32)] backdrop-blur-sm">
              <p className="text-sm font-medium text-white">운영 원칙</p>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                {principles.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400/90" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4">
            {offers.map((offer) => (
              <article key={offer.title} className="rounded-3xl border border-white/10 bg-[#0b1327]/88 p-6 shadow-[0_18px_60px_rgba(2,6,23,0.34)] backdrop-blur-sm transition hover:border-indigo-300/20 hover:bg-[#101a35] sm:p-7">
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{offer.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">{offer.description}</p>
                  </div>
                  <div className="inline-flex w-fit rounded-full border border-indigo-300/18 bg-indigo-400/10 px-3 py-1 text-xs font-medium tracking-[0.12em] text-indigo-100 shadow-[0_8px_20px_rgba(79,70,229,0.14)]">
                    {offer.badge}
                  </div>
                </div>

                <ul className="mt-6 grid gap-3 text-sm text-white/70 sm:grid-cols-2">
                  {offer.bullets.map((bullet) => (
                    <li key={bullet} className="rounded-2xl border border-white/8 bg-[#091122] px-4 py-3 text-white/78">
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
