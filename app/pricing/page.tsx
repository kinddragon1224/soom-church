import Link from "next/link";
import SiteHeader from "@/components/site-header";

type Program = {
  title: string;
  badge: string;
  summary: string;
  price: string;
  note: string;
  points: string[];
  cta: string;
};

const programs: Program[] = [
  {
    title: "AI 진로 진단 상담",
    badge: "1회 집중",
    summary: "일단 한 번 제대로 꺼내놓고 싶은 분을 위한 상담입니다. 지금의 불안과 경험을 정리해 다음 선택지를 좁힙니다.",
    price: "1회 상담",
    note: "정확한 금액과 방식은 상담 가능 여부 확인 후 안내합니다.",
    points: ["지금 막힌 지점 정리", "강점과 불안 요소 분리", "다음 2주 실행안"],
    cta: "진단 상담 문의",
  },
  {
    title: "커리어 리디자인",
    badge: "4주 설계",
    summary: "지금까지 해온 일을 버리지 않고 다시 조합하고 싶은 분을 위한 과정입니다. 강점과 시장성을 연결해 실행 로드맵을 만듭니다.",
    price: "4주 프로그램",
    note: "개인 상황과 목표에 따라 회차와 산출물 범위가 조정됩니다.",
    points: ["경험과 역량 재해석", "현실적인 진로 후보 비교", "포트폴리오/상품 방향"],
    cta: "리디자인 문의",
  },
  {
    title: "AI 포트폴리오 기획",
    badge: "실행 산출물",
    summary: "AI를 배웠다는 말보다 보여줄 결과물이 필요한 분을 위한 과정입니다. 나만의 작업물과 브랜딩 흐름을 기획합니다.",
    price: "프로젝트형",
    note: "결과물 범위에 따라 기간과 비용이 달라집니다.",
    points: ["포트폴리오 주제 선정", "AI 작업 흐름 설계", "노션/웹/콘텐츠 구조"],
    cta: "포트폴리오 문의",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f5efe5] text-[#15120d]">
      <section className="border-b border-[#dfd0bd] bg-[#fffaf2]">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader current="pricing" ctaHref="/contact" ctaLabel="상담 문의" />
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#15120d] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_28%),radial-gradient(circle_at_82%_18%,rgba(218,151,74,0.22)_0%,rgba(218,151,74,0)_30%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.24em] text-[#d7a760]">CONSULTING PROGRAMS</p>
            <h1 className="mt-5 text-[2.8rem] font-semibold leading-[1.02] tracking-[-0.065em] sm:text-[4.8rem]">
              필요한 만큼만
              <br />
              같이 정리해도 됩니다
            </h1>
            <p className="mt-7 max-w-3xl text-sm leading-8 text-white/66 sm:text-base">
              처음부터 큰 프로그램을 고르지 않아도 됩니다. 지금 상황을 먼저 듣고, 진단 상담이면 충분한지, 조금 더 긴 설계가 필요한지 함께 정합니다.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-5 lg:grid-cols-3">
            {programs.map((program) => (
              <article key={program.title} className="flex h-full flex-col rounded-[34px] border border-[#dfd0bd] bg-white p-7 shadow-[0_18px_44px_rgba(72,50,24,0.07)] sm:p-8">
                <div className="inline-flex w-fit rounded-full bg-[#f4eadc] px-3 py-1 text-xs text-[#8a5c27]">{program.badge}</div>
                <h2 className="mt-5 text-[1.9rem] font-semibold tracking-[-0.05em] text-[#15120d]">{program.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[#6b5d4f]">{program.summary}</p>
                <p className="mt-7 text-[1.7rem] font-semibold tracking-[-0.04em] text-[#15120d]">{program.price}</p>
                <p className="mt-2 text-xs leading-6 text-[#8d7b68]">{program.note}</p>
                <ul className="mt-7 grid gap-2 text-sm leading-7 text-[#4c4035]">
                  {program.points.map((point) => (
                  <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <Link href="/contact" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#15120d] px-6 text-sm font-semibold text-white">
                    {program.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
          <div className="rounded-[36px] border border-[#dfd0bd] bg-[#fffaf2] p-7 shadow-[0_18px_44px_rgba(72,50,24,0.08)] sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs tracking-[0.24em] text-[#9a6b32]">NEXT STEP</p>
                <h2 className="mt-4 text-[2rem] font-semibold leading-[1.08] tracking-[-0.05em] text-[#15120d] sm:text-[3rem]">
                  어떤 걸 신청해야 할지 몰라도 괜찮습니다.
                </h2>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-[#6b5d4f] sm:text-base">
                  지금 필요한 것이 진단 상담인지, 리디자인인지, 포트폴리오 기획인지 함께 구분한 뒤 가장 작은 시작점부터 제안합니다.
                </p>
              </div>
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#15120d] px-6 text-sm font-semibold text-white">
                상담 문의하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
