import Link from "next/link";

type Plan = {
  name: string;
  badge?: string;
  price: string;
  note: string;
  desc: string;
  features: string[];
  cta: string;
};

type ServiceItem = {
  title: string;
  price: string;
  desc: string;
  note?: string;
};

type ServiceGroup = {
  category: string;
  items: ServiceItem[];
};

const plans: Plan[] = [
  {
    name: "Free",
    badge: "진입",
    price: "무료",
    note: "가볍게 시작",
    desc: "처음 숨 워크스페이스를 경험해보고 싶은 교회를 위한 무료 플랜입니다.",
    features: ["무료 시작", "워크스페이스 체험", "소규모 교회 / 테스트용"],
    cta: "무료로 시작하기",
  },
  {
    name: "Standard",
    badge: "추천",
    price: "계정당 월 7,700원",
    note: "연간 결제 시 15% 할인",
    desc: "대부분의 교회가 실제 운영에 사용할 수 있는 숨의 메인 플랜입니다.",
    features: ["교적 관리", "심방 관리", "웹 + 모바일 반응형"],
    cta: "Standard 문의하기",
  },
  {
    name: "Pro",
    badge: "확장",
    price: "문의하기",
    note: "고급 운영 플랜",
    desc: "운영 규모가 크거나 더 정교한 관리가 필요한 교회를 위한 상위 플랜입니다.",
    features: ["Standard 포함", "확장 운영 대응", "고급 기능 협의"],
    cta: "Pro 문의하기",
  },
];

const compareRows = [
  { label: "가격", values: ["무료", "계정당 월 7,700원", "문의"] },
  { label: "교적 관리", values: ["체험", "포함", "포함"] },
  { label: "심방 관리", values: ["체험", "포함", "포함"] },
  { label: "웹 + 모바일 반응형", values: ["포함", "포함", "포함"] },
  { label: "추천 대상", values: ["테스트 / 진입", "대부분의 교회", "확장 운영 교회"] },
];

const subServiceGroups: ServiceGroup[] = [
  {
    category: "콘텐츠",
    items: [
      {
        title: "설교 쇼츠 패키지",
        price: "월 4개 19만 원부터",
        desc: "설교 핵심 구간을 짧게 재가공해 교회 채널과 SNS에 반복 업로드할 수 있도록 제작합니다.",
      },
      {
        title: "사역 콘텐츠 제작",
        price: "별도 협의",
        desc: "사역 소개, 카드뉴스, 반복 안내 콘텐츠처럼 계속 전달되어야 하는 작업을 정리합니다.",
      },
    ],
  },
  {
    category: "웹",
    items: [
      {
        title: "랜딩페이지",
        price: "30만 원부터",
        desc: "행사, 부서, 집회, 모집, 사역 소개를 한 페이지에 명확하게 정리하는 서비스입니다.",
        note: "반응형 기본 제작 / 신청·설문·DB 기능은 별도 견적",
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
        note: "15초 / 30초 / 1분 단위 제작 가능 · 촬영은 별도 협의",
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
          <p className="text-xs tracking-[0.24em] text-[#7a6f67]">PLANS</p>
          <h1 className="mt-5 font-display text-[2.6rem] leading-[1.05] tracking-[-0.06em] sm:text-[4.4rem]">
            Free, Standard, Pro로
            <br />
            단계별로 시작하는 숨 워크스페이스
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-[#5d667d] sm:text-base">
            무료 진입부터 실제 운영용 메인 플랜, 더 큰 규모를 위한 확장 플랜까지 교회 상황에 맞게 시작할 수 있습니다.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-[34px] border p-7 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-8 ${
                  plan.name === "Standard"
                    ? "border-[#111827] bg-[#111827] text-white"
                    : "border-[#e6dfd5] bg-white text-[#0c1220]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-[2rem] tracking-[-0.04em]">{plan.name}</h2>
                  {plan.badge && (
                    <span className={`rounded-full px-3 py-1 text-xs ${plan.name === "Standard" ? "bg-white/12 text-white" : "bg-[#f3ede3] text-[#7a6f67]"}`}>
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p className="mt-5 text-[2rem] font-semibold tracking-[-0.04em]">{plan.price}</p>
                <p className={`mt-2 text-sm ${plan.name === "Standard" ? "text-white/56" : "text-[#7a6f67]"}`}>{plan.note}</p>
                <p className={`mt-5 text-sm leading-7 ${plan.name === "Standard" ? "text-white/72" : "text-[#475069]"}`}>{plan.desc}</p>
                <ul className={`mt-6 grid gap-2 text-sm leading-7 ${plan.name === "Standard" ? "text-white/84" : "text-[#334155]"}`}>
                  {plan.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href="/contact"
                    className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold ${
                      plan.name === "Standard"
                        ? "bg-white text-[#111827]"
                        : "bg-[#111827] text-white"
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

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
          <div className="overflow-hidden rounded-[34px] border border-[#e6dfd5] bg-white shadow-[0_16px_40px_rgba(16,24,40,0.05)]">
            <div className="border-b border-[#eee7dd] px-6 py-6 sm:px-8">
              <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">COMPARE</p>
              <h2 className="mt-3 font-display text-[2rem] tracking-[-0.04em]">플랜 비교</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-[#7a6f67]">항목</th>
                    <th className="px-6 py-4 text-left text-[#7a6f67]">Free</th>
                    <th className="px-6 py-4 text-left text-[#7a6f67]">Standard</th>
                    <th className="px-6 py-4 text-left text-[#7a6f67]">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr key={row.label} className="border-t border-[#eee7dd]">
                      <td className="px-6 py-4 font-medium text-[#0c1220]">{row.label}</td>
                      {row.values.map((value, index) => (
                        <td key={`${row.label}-${index}`} className="px-6 py-4 text-[#475069]">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
          <div className="rounded-[34px] border border-[#e6dfd5] bg-[#111827] px-6 py-10 text-white sm:px-10">
            <p className="text-xs tracking-[0.24em] text-white/40">SUB SERVICES</p>
            <h2 className="mt-5 font-display text-[2rem] leading-[1.1] tracking-[-0.05em] sm:text-[3rem]">
              워크스페이스 위에 필요한 제작 서비스를 더합니다
            </h2>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-white/62 sm:text-base">
              숨의 중심은 워크스페이스입니다. 그리고 필요한 경우 콘텐츠, 웹, 디자인, 영상 서비스를 연결해 전달과 운영을 함께 정리합니다.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
          <div className="grid gap-8">
            {subServiceGroups.map((group) => (
              <section key={group.category} className="rounded-[34px] border border-[#e6dfd5] bg-white p-6 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-8">
                <div className="mb-6 border-b border-[#eee7dd] pb-6">
                  <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">CATEGORY</p>
                  <h2 className="mt-3 font-display text-[2rem] tracking-[-0.04em]">{group.category}</h2>
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                  {group.items.map((item) => (
                    <article key={item.title} className="rounded-[28px] border border-[#eee7dd] bg-[#fcfbf8] p-6">
                      <p className="text-xs tracking-[0.22em] text-[#9a8b7a]">STARTING AT</p>
                      <p className="mt-3 text-[1.6rem] font-semibold tracking-[-0.03em] text-[#0c1220]">{item.price}</p>
                      <h3 className="mt-5 text-[1.5rem] font-semibold tracking-[-0.03em] text-[#0c1220]">{item.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-[#475069]">{item.desc}</p>
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
    </main>
  );
}
