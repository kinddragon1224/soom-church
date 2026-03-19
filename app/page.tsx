import Link from "next/link";

type Plan = {
  name: string;
  badge?: string;
  price: string;
  note: string;
  desc: string;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Free",
    badge: "시장 진입",
    price: "무료",
    note: "가볍게 시작",
    desc: "처음 숨 워크스페이스를 경험해보고 싶은 교회를 위한 진입 플랜입니다.",
    features: ["무료 시작", "워크스페이스 체험", "소규모 테스트용"],
  },
  {
    name: "Standard",
    badge: "추천",
    price: "계정당 월 7,700원",
    note: "연간 결제 시 15% 할인",
    desc: "대부분의 교회가 기본으로 운영할 수 있는 숨의 메인 플랜입니다.",
    features: ["교적 관리", "심방 관리", "웹 + 모바일 반응형"],
  },
  {
    name: "Pro",
    badge: "확장",
    price: "문의하기",
    note: "운영 규모와 기능 범위에 따라 맞춤 제안",
    desc: "더 큰 운영 규모와 정교한 관리가 필요한 교회를 위한 확장 플랜입니다.",
    features: ["Standard의 기능 포함", "확장 운영 대응", "고급 기능 협의"],
  },
];

const workspaceBenefits = [
  "엑셀, 카톡, 메모에 흩어진 교인 정보를 한곳에서 정리할 수 있습니다.",
  "심방 기록과 상태를 팀 안에서 더 일관되게 관리할 수 있습니다.",
  "웹과 모바일에서 바로 사용할 수 있어 현장과 사무실의 흐름이 끊기지 않습니다.",
];

const subServices = [
  {
    title: "콘텐츠",
    desc: "설교 쇼츠, 카드뉴스, 안내 콘텐츠처럼 반복 전달이 필요한 작업을 만듭니다.",
  },
  {
    title: "웹",
    desc: "행사, 모집, 부서 소개, 사역 안내에 맞는 랜딩페이지와 안내형 웹을 제작합니다.",
  },
  {
    title: "디자인",
    desc: "설교 PPT, 유인물, 리플렛, 소개 자료처럼 전달력을 높이는 디자인을 정리합니다.",
  },
  {
    title: "영상",
    desc: "사역 소개, 행사 오프닝, 짧은 브랜드 영상까지 메시지를 더 선명하게 전달합니다.",
  },
];

const processSteps = [
  "현재 운영 방식과 필요한 기능을 함께 정리합니다",
  "Free / Standard / Pro 중 맞는 시작점을 제안합니다",
  "도입 범위와 계정 수를 기준으로 시작합니다",
  "필요하면 콘텐츠·웹·디자인까지 이어서 확장합니다",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050b16] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#050b16]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-church-main.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,22,0.88)_0%,rgba(5,11,22,0.58)_42%,rgba(5,11,22,0.36)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,22,0.24)_0%,rgba(5,11,22,0.2)_30%,rgba(5,11,22,0.82)_100%)]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-10 pt-5 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between gap-4">
            <Link href="/" className="font-display text-[1.85rem] font-semibold tracking-[-0.08em] text-white sm:text-[2.3rem]">
              soom
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-white/80 md:flex">
              <Link href="/">홈</Link>
              <Link href="/pricing">상품</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">문의</Link>
            </nav>
            <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/45 bg-white/5 px-5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10">
              문의하기
            </Link>
          </header>

          <div className="flex flex-1 items-end py-16 sm:py-24 lg:py-28">
            <div className="max-w-5xl">
              <p className="text-xs tracking-[0.24em] text-white/54">CHURCH WORKSPACE · WEB · CONTENT · DESIGN</p>
              <h1 className="mt-5 font-display text-[2.8rem] font-semibold leading-[1.02] tracking-[-0.06em] text-white sm:text-[4.5rem] lg:text-[5.9rem]">
                교회를 위한
                <br />
                운영 워크스페이스
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-white/82 sm:text-lg sm:leading-8">
                교적과 심방, 그리고 반복되는 운영 흐름을
                숨(soom) 워크스페이스로 정리하세요.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/pricing" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#09111f] transition hover:bg-white/90">
                  워크스페이스 보기
                </Link>
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/35 bg-white/5 px-6 text-sm font-medium text-white transition hover:bg-white/10">
                  도입 문의하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f1ec] text-[#0c1220]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="flex flex-col gap-4">
            <p className="text-xs tracking-[0.24em] text-[#7a6f67]">PLANS</p>
            <h2 className="font-display text-[2.2rem] leading-[1.08] tracking-[-0.05em] sm:text-[3.5rem]">
              Free로 진입하고,
              <br />
              Standard로 운영하고, Pro로 확장합니다
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-[#5d667d] sm:text-base">
              숨의 워크스페이스는 무료 진입부터 실제 운영용 메인 플랜, 더 큰 규모를 위한 확장 플랜까지 단계별로 시작할 수 있습니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-[30px] border p-7 shadow-[0_16px_40px_rgba(16,24,40,0.06)] ${
                  plan.name === "Standard"
                    ? "border-[#111827] bg-[#111827] text-white"
                    : "border-[#e3ddd4] bg-white text-[#0c1220]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[1.7rem] font-semibold tracking-[-0.03em]">{plan.name}</h3>
                  {plan.badge && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        plan.name === "Standard"
                          ? "bg-white/12 text-white"
                          : "bg-[#f3ede3] text-[#7a6f67]"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p className={`mt-5 text-[1.8rem] font-semibold tracking-[-0.03em] ${plan.name === "Standard" ? "text-white" : "text-[#0c1220]"}`}>
                  {plan.price}
                </p>
                <p className={`mt-2 text-sm ${plan.name === "Standard" ? "text-white/58" : "text-[#7a6f67]"}`}>{plan.note}</p>
                <p className={`mt-5 text-sm leading-7 ${plan.name === "Standard" ? "text-white/72" : "text-[#475069]"}`}>{plan.desc}</p>
                <ul className={`mt-6 grid gap-2 text-sm leading-7 ${plan.name === "Standard" ? "text-white/84" : "text-[#334155]"}`}>
                  {plan.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#070d18]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.24em] text-white/38">WHY SOOM WORKSPACE</p>
            <h2 className="mt-5 font-display text-[2.2rem] leading-[1.08] tracking-[-0.05em] text-white sm:text-[3.5rem]">
              교적과 심방을
              <br />
              더 쉽게 운영하는 방법
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
              운영은 복잡할수록 지치고, 정보는 흩어질수록 놓치게 됩니다. 숨은 교회 안에서 반복되는 운영 흐름을 더 단순하게 만들기 위해 설계되었습니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {workspaceBenefits.map((item) => (
              <article key={item} className="rounded-[30px] border border-white/10 bg-white/[0.03] p-7 shadow-[0_24px_80px_rgba(2,6,23,0.28)]">
                <p className="text-sm leading-8 text-white/68">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f4ee] text-[#0c1220]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs tracking-[0.24em] text-[#7a6f67]">SUB SERVICES</p>
              <h2 className="mt-5 font-display text-[2.2rem] leading-[1.08] tracking-[-0.05em] sm:text-[3.4rem]">
                필요에 따라
                <br />
                이렇게 확장할 수 있습니다
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#5d667d] sm:text-base">
                숨의 중심은 워크스페이스이고, 그 위에 콘텐츠·웹·디자인·영상 서비스를 연결해 더 선명한 운영과 전달을 돕습니다.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {subServices.map((item) => (
                <article key={item.title} className="rounded-[24px] border border-[#e6dfd5] bg-white px-5 py-5 shadow-[0_16px_40px_rgba(20,30,60,0.06)]">
                  <h3 className="text-[1.15rem] font-semibold text-[#0c1220]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#475069]">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#050b16]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-8 rounded-[36px] border border-white/10 bg-[#0b1327]/92 p-7 shadow-[0_24px_80px_rgba(2,6,23,0.42)] lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
            <div>
              <p className="text-xs tracking-[0.24em] text-white/38">PROCESS</p>
              <h2 className="mt-5 font-display text-[2.2rem] leading-[1.08] tracking-[-0.05em] text-white sm:text-[3.2rem]">
                복잡하게 시작하지 않아도 됩니다
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
                정리가 안 된 상태로 문의해도 괜찮습니다. 워크스페이스 도입이 맞는지, 어떤 플랜으로 시작할지부터 함께 정리해드립니다.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#09111f]">
                  문의하기
                </Link>
                <Link href="/pricing" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 text-sm font-medium text-white">
                  플랜 보기
                </Link>
              </div>
            </div>
            <div className="grid gap-3">
              {processSteps.map((step, index) => (
                <div key={step} className="rounded-[24px] border border-white/8 bg-[#091122] px-5 py-5">
                  <p className="text-xs tracking-[0.16em] text-white/38">0{index + 1}</p>
                  <p className="mt-2 text-sm leading-7 text-white/82">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
