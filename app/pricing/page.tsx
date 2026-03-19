import Link from "next/link";

const serviceGroups = [
  {
    category: "웹",
    items: [
      {
        title: "랜딩페이지",
        price: "30만 원부터",
        desc: "행사, 부서, 집회, 모집, 사역 소개를 한 페이지에 명확하게 정리하는 서비스입니다.",
        details: [
          "반응형 기본 제작",
          "정보 구조 정리",
          "핵심 섹션 구성",
          "기본 안내형 페이지",
        ],
        note: "신청 기능 / 설문 기능 / DB 저장 / 관리자 기능은 별도 견적",
      },
    ],
  },
  {
    category: "디자인",
    items: [
      {
        title: "PPT 기획·제작",
        price: "장당 3만 원부터",
        desc: "설교, 강의, 세미나, 행사 발표 자료를 더 잘 읽히고 더 잘 전달되게 정리합니다.",
      },
      {
        title: "유인물 디자인",
        price: "15만 원부터",
        desc: "행사 안내, 프로그램 소개, 배포용 안내자료 등 현장에서 바로 쓰는 디자인 작업입니다.",
      },
      {
        title: "3단 리플렛",
        price: "30만 원부터",
        desc: "교회 소개, 부서 안내, 사역 소개를 짧고 명확하게 정리한 접지형 인쇄물입니다.",
      },
    ],
  },
  {
    category: "영상",
    items: [
      {
        title: "고퀄리티 AI 영상",
        price: "15초 50만 원부터",
        desc: "브랜드 소개, 행사 오프닝, 메시지 예고편처럼 짧은 시간 안에 인상을 남기는 영상을 제작합니다.",
        details: ["15초 — 50만 원부터", "30초 — 70만 원", "1분 — 100만 원"],
        note: "촬영이 필요한 경우 별도 협의",
      },
      {
        title: "설교 쇼츠 패키지",
        price: "월 4개 19만 원부터",
        desc: "설교 핵심 구간을 짧게 재가공해 교회 채널과 SNS에 반복 업로드할 수 있도록 제작합니다.",
      },
    ],
  },
  {
    category: "운영 도구",
    items: [
      {
        title: "간편 명단 관리 웹",
        price: "MVP 49만 원부터",
        desc: "작은 조직이나 부서가 명단, 상태, 담당, 신청 정보를 헷갈리지 않게 정리하고 공유할 수 있는 운영용 웹입니다.",
      },
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f3f1ec] text-[#0c1220]">
      <section className="border-b border-[#e6dfd5] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between gap-4">
            <Link href="/" className="font-display text-[1.85rem] font-semibold tracking-[-0.08em] text-[#0c1220] sm:text-[2.3rem]">
              soom
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-[#43506b] md:flex">
              <Link href="/">홈</Link>
              <Link href="/pricing" className="text-[#0c1220]">상품</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">문의</Link>
            </nav>
            <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#111827] px-5 text-sm font-semibold text-white">
              문의하기
            </Link>
          </header>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <p className="text-xs tracking-[0.24em] text-[#7a6f67]">SERVICES</p>
          <h1 className="mt-5 font-display text-[2.6rem] leading-[1.05] tracking-[-0.06em] sm:text-[4.4rem]">
            교회와 사역을 위한
            <br />
            숨의 서비스
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[#5d667d] sm:text-base">
            홈페이지, 디자인, 영상, 운영용 웹까지 필요한 작업을 목적에 맞게 선택할 수 있습니다.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7b8498] sm:text-base">
            정확한 금액은 범위에 따라 달라질 수 있지만, 아래 시작가를 기준으로 빠르게 판단하실 수 있습니다.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
          <div className="grid gap-8">
            {serviceGroups.map((group) => (
              <section key={group.category} className="rounded-[34px] border border-[#e6dfd5] bg-white p-6 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-8">
                <div className="mb-6 flex flex-col gap-2 border-b border-[#eee7dd] pb-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">CATEGORY</p>
                    <h2 className="mt-3 font-display text-[2rem] tracking-[-0.04em]">{group.category}</h2>
                  </div>
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                  {group.items.map((item) => (
                    <article key={item.title} className="rounded-[28px] border border-[#eee7dd] bg-[#fcfbf8] p-6">
                      <p className="text-xs tracking-[0.22em] text-[#9a8b7a]">STARTING AT</p>
                      <p className="mt-3 text-[1.6rem] font-semibold tracking-[-0.03em] text-[#0c1220]">{item.price}</p>
                      <h3 className="mt-5 text-[1.5rem] font-semibold tracking-[-0.03em] text-[#0c1220]">{item.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-[#475069]">{item.desc}</p>
                      {item.details && (
                        <ul className="mt-5 grid gap-2 text-sm leading-7 text-[#334155]">
                          {item.details.map((detail) => (
                            <li key={detail}>• {detail}</li>
                          ))}
                        </ul>
                      )}
                      {item.note && <p className="mt-5 text-sm leading-6 text-[#7b8498]">{item.note}</p>}
                      <div className="mt-6">
                        <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#111827] px-5 text-sm font-semibold text-white">
                          문의하기
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
          <div className="rounded-[34px] border border-[#e6dfd5] bg-[#111827] px-6 py-10 text-white sm:px-10">
            <p className="text-xs tracking-[0.24em] text-white/40">GUIDE</p>
            <h2 className="mt-5 font-display text-[2rem] leading-[1.1] tracking-[-0.05em] sm:text-[3rem]">
              정확한 상품명이 없어도 괜찮습니다
            </h2>
            <div className="mt-6 grid gap-2 text-sm leading-7 text-white/72 sm:text-base">
              <p>“행사 페이지가 필요해요”</p>
              <p>“소개 자료가 정리 안 돼 있어요”</p>
              <p>“설교 콘텐츠를 계속 올리고 싶어요”</p>
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              이 정도만 알려주셔도 숨이 맞는 방식으로 제안해드립니다.
            </p>
            <div className="mt-8">
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#111827]">
                문의하러 가기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
