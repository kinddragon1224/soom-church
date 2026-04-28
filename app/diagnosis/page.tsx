import SiteHeader from "@/components/site-header";
import { CareerDiagnosisFlow } from "@/components/diagnosis/career-diagnosis-flow";

export default function DiagnosisPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080b12] text-white">
      <section className="border-b border-white/10 bg-[#080b12]">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="diagnosis" ctaHref="/contact" ctaLabel="30분 방향 진단 신청" />
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(255,91,46,0.24)_0%,rgba(255,91,46,0)_30%),radial-gradient(circle_at_86%_4%,rgba(79,123,255,0.2)_0%,rgba(79,123,255,0)_28%)]" />
        <div className="relative mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 gap-10 overflow-hidden px-5 py-16 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:px-10 lg:py-24">
          <div className="min-w-0 max-w-[calc(100vw-40px)] sm:max-w-none">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff6b35]">AI Career Direction Check</p>
            <h1 className="mt-5 max-w-4xl break-words break-all [overflow-wrap:anywhere] text-[2.3rem] font-black leading-[1.02] tracking-[-0.055em] text-white sm:text-[5.4rem] sm:leading-[0.95] sm:tracking-[-0.085em]">
              AI 시대
              <br />
              커리어 방향 진단
            </h1>
            <p style={{ overflowWrap: "anywhere", wordBreak: "break-all" }} className="mt-6 max-w-xl break-words break-all [overflow-wrap:anywhere] text-base font-bold leading-8 text-white/70">
              내 일에 AI를 붙일 수 있는 지점과 지금 막힌 선택을 3분 안에 좁혀봅니다.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {["3분 진단", "7개 질문", "강점·약점·다음 행동 리포트"].map((item) => (
                <div key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white/72">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 max-w-[calc(100vw-40px)] sm:max-w-full">
            <CareerDiagnosisFlow />
          </div>
        </div>
      </section>
    </main>
  );
}





