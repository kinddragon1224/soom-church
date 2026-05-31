import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { CareerDiagnosisFlow } from "@/components/diagnosis/career-diagnosis-flow";

const resultStructure = [
  "현재 주 포지션",
  "보조 포지션 가능성",
  "AI가 대체할 면",
  "끝까지 남는 면",
  "다음 7일 행동",
];

const reportOffers = [
  ["미니 리포트", "29,000원", "한 줄 진단 + 막힌 지점 + 다음 행동 3개"],
  ["상세 리포트", "59,000원", "주/보조 포지션 + 대체면/잔존면 + 7/14일 실행안"],
  ["1:1 미래설계 상담", "300,000원", "리포트 이후에도 복잡한 선택이 남을 때만"],
];

export default function DiagnosisPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070a10] text-white">
      <section className="border-b border-white/10 bg-[#070a10]">
        <div className="mx-auto max-w-6xl px-5 py-5 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="diagnosis" ctaHref="#check" ctaLabel="바로 시작" />
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,91,46,0.2)_0%,rgba(255,91,46,0)_32%),radial-gradient(circle_at_82%_8%,rgba(79,123,255,0.16)_0%,rgba(79,123,255,0)_30%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-5 py-9 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-14">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff6b35]">3분 무료 체크</p>
            <h1 className="mt-4 text-[2.65rem] font-black leading-[0.98] tracking-[-0.07em] text-white sm:text-[4.8rem] sm:leading-[0.9]">
              직업 이름보다
              <br />
              포지션이 먼저.
            </h1>
            <p className="mt-5 max-w-md text-base font-bold leading-8 text-white/66">
              지금 필요한 건 직업 추천이 아니라, AI 시대에 내가 어떤 역할 위치에 가까운지 보는 일입니다.
            </p>
            <a href="#check" className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#ff5b2e] px-6 text-sm font-black text-white shadow-[0_22px_70px_rgba(255,91,46,0.28)] transition hover:bg-white hover:text-[#070a10] sm:w-auto">
              7문항 바로 시작
            </a>
            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-black text-white">무료 결과에서 바로 보이는 것</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {resultStructure.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-black/24 px-3 py-2 text-xs font-bold text-white/62">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div id="check" className="scroll-mt-24">
            <CareerDiagnosisFlow />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#090d14]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff6b35]">After Check</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">결과가 맞다면, 리포트로 깊게 봅니다.</h2>
              <p className="mt-4 text-sm font-bold leading-7 text-white/56">
                상담을 먼저 팔지 않습니다. 무료 체크로 위치를 보고, 리포트로 상황을 정리한 뒤 복잡한 선택만 1:1로 연결합니다.
              </p>
            </div>
            <div className="grid gap-3">
              {reportOffers.map(([title, price, body]) => (
                <Link key={title} href={title === "1:1 미래설계 상담" ? "/contact?offer=premium-direction-session" : "/diagnosis/report-intake?source=diagnosis-offer"} className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#ff6b35]/40 hover:bg-[#ff6b35]/10">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-lg font-black text-white">{title}</p>
                    <p className="shrink-0 text-sm font-black text-[#ffb199]">{price}</p>
                  </div>
                  <p className="mt-2 text-sm font-bold leading-6 text-white/58">{body}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
