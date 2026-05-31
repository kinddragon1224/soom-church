import { Suspense } from "react";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { ReportIntakeForm } from "@/components/diagnosis/report-intake-form";
import { sampleReportPreviewMap } from "@/components/diagnosis/sample-report-data";

const reportTracks = {
  student_parent: {
    label: "학생/부모",
    title: "우리 아이 5포지션 상세 리포트",
    focus: ["가까운 주 포지션", "대체면과 잔존면", "다음 활동 설계"],
    description: "과목·전공·직업명보다 아이가 AI 시대에 어떤 역할 위치에 가까운지 먼저 정리합니다.",
  },
  early_career: {
    label: "20대/첫 커리어",
    title: "첫 커리어 5포지션 상세 리포트",
    focus: ["경험의 역할 위치 번역", "보여줄 결과물", "2주 실행 과제"],
    description: "스펙을 더 쌓기 전에, 이미 가진 경험이 어떤 포지션과 증거가 되는지 번역합니다.",
  },
  transition: {
    label: "40~50대/전환",
    title: "경력 포지션 재설계 상세 리포트",
    focus: ["기존 경력의 잔존면", "역할 이동성", "피해야 할 전환 착각"],
    description: "지나온 경력을 버리는 방식이 아니라, AI 시대에도 남는 역할 위치로 다시 정리합니다.",
  },
} as const;

type ReportTrackKey = keyof typeof reportTracks;

type ReportIntakePageProps = {
  searchParams?: {
    track?: string;
  };
};

export default function ReportIntakePage({ searchParams }: ReportIntakePageProps) {
  const rawTrack = searchParams?.track ?? "";
  const trackKey: ReportTrackKey = rawTrack in reportTracks ? (rawTrack as ReportTrackKey) : "early_career";
  const selectedTrack = reportTracks[trackKey];
  const sampleReport = sampleReportPreviewMap[trackKey];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080b12] text-white">
      <section className="border-b border-white/10 bg-[#080b12]">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="diagnosis" ctaHref="/diagnosis" ctaLabel="포지션 체크 다시 보기" />
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(255,91,46,0.24)_0%,rgba(255,91,46,0)_30%),radial-gradient(circle_at_86%_4%,rgba(79,123,255,0.2)_0%,rgba(79,123,255,0)_28%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff6b35]">Position Report Request</p>
            <h1 className="mt-5 text-[2.25rem] font-black leading-[1.02] tracking-[-0.05em] text-white sm:text-[5.1rem] sm:leading-[0.95] sm:tracking-[-0.085em]">
              상담 전에 먼저,
              <br />
              포지션을 봅니다.
            </h1>
            <p className="mt-6 max-w-2xl text-base font-bold leading-8 text-white/70 sm:text-lg">
              무료 7문항 결과는 5포지션을 여는 미리보기입니다. 상세 리포트는 지금 조건, 경험, 불안, 피하고 싶은 선택까지 받아 선용의 판단 기준을 비동기 리포트로 전달하는 주력 경로입니다.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-24">
          <div className="rounded-[28px] border border-white/10 bg-[#0d1117] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.24)] sm:p-8">
            <Suspense fallback={<div className="min-h-[420px] rounded-[24px] border border-white/10 bg-white/[0.035] p-5 text-sm font-bold leading-7 text-white/62">상세 리포트 입력 폼을 준비하고 있습니다.</div>}>
              <ReportIntakeForm />
            </Suspense>
          </div>

          <div className="grid gap-5 self-start">
            <div className="rounded-[28px] border border-[#ff6b35]/25 bg-[#ff6b35]/10 p-5 sm:rounded-[34px] sm:p-8">
              <div className="flex flex-col gap-4 border-b border-[#ff6b35]/20 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffb199]">Main Beta Product</p>
                  <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white">{selectedTrack.title}</h2>
                  <p className="mt-3 text-sm font-bold leading-7 text-white/70">{selectedTrack.description}</p>
                </div>
                <div className="shrink-0 rounded-[22px] border border-white/12 bg-black/20 px-4 py-3 text-right">
                  <p className="text-xs font-black text-white/48">상세 가격 가설</p>
                  <p className="mt-1 text-2xl font-black text-white">59,000원</p>
                  <p className="mt-1 text-xs font-bold text-white/52">결제 전 베타 요청</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm leading-7 text-white/72">
                <div className="rounded-[22px] border border-white/10 bg-black/18 px-4 py-4">
                  <p className="font-black text-white">무료 결과와 다른 점</p>
                  <p className="mt-2">무료 체크는 가까운 포지션과 다음 행동 1개를 보는 미리보기입니다. 상세 리포트는 개인 조건, 경험, 대체면·잔존면, 7/14일 실행안까지 반영해 다시 씁니다.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-white/10 bg-black/18 px-4 py-4">
                    <p className="font-black text-white">미니 리포트 가설</p>
                    <p className="mt-2">29,000원. 주 포지션, 대체면·잔존면, 다음 행동 3개를 짧게 정리합니다.</p>
                  </div>
                  <div className="rounded-[22px] border border-[#ff6b35]/25 bg-[#ff6b35]/10 px-4 py-4">
                    <p className="font-black text-white">상세 리포트 가설</p>
                    <p className="mt-2">59,000원. 내 조건 기반 주 포지션과 보조 포지션, 피해야 할 착각, 실행안을 정리합니다.</p>
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-black/18 px-4 py-4">
                  <p className="font-black text-white">포함될 항목</p>
                  <ul className="mt-3 grid gap-2">
                    <li>현재 가까운 5포지션</li>
                    <li>대체면과 잔존면</li>
                    <li>피해야 할 착각 2개</li>
                    <li>다음 7일/14일 실행 과제</li>
                  </ul>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-black/18 px-4 py-4">
                  <p className="font-black text-white">{selectedTrack.label} 리포트 초점</p>
                  <ul className="mt-3 grid gap-2">
                    {selectedTrack.focus.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[22px] border border-[#73d6b6]/20 bg-[#73d6b6]/10 px-4 py-4">
                  <p className="font-black text-white">샘플 한 줄 진단</p>
                  <p className="mt-2">{sampleReport.oneLineDiagnosis}</p>
                  <p className="mt-3 text-xs leading-6 text-white/52">실제 리포트는 입력한 상황과 제약을 기준으로 다시 작성합니다.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0d1117] p-5 sm:rounded-[34px] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff6b35]/80">After Request</p>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-white/70">
                <p>지금은 결제 전 베타 요청 접수 단계입니다. 접수 내용을 확인한 뒤 미니/상세 5포지션 리포트 베타 안내를 먼저 드립니다. 직접 상담은 선용의 시간이 들어가는 제한 슬롯이라, 리포트 이후에도 복잡한 선택이 남을 때만 제안합니다.</p>
                <Link href="/contact?offer=premium-direction-session" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-6 text-sm font-black text-white transition hover:border-white/30 hover:bg-white/10">
                  복잡한 선택이면 1:1 미래설계 상담
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
