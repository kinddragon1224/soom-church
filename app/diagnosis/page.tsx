import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { CareerDiagnosisFlow } from "@/components/diagnosis/career-diagnosis-flow";
import { audienceTracks, type AudienceTrackType } from "@/components/diagnosis/diagnosis-data";
import { sampleReportPreviews } from "@/components/diagnosis/sample-report-data";

const trackLaunchCopy: Record<AudienceTrackType, string> = {
  student_parent: "아이에게 맞는 5포지션과 다음 활동을 보고 싶은 경우",
  early_career: "전공, 경험, 프로젝트가 어떤 역할 위치로 보이는지 막힌 경우",
  transition: "기존 경력을 버리지 않고 AI 시대 역할 위치로 다시 정리하고 싶은 경우",
};

const trustPoints = [
  "직업상담사 2급 기반의 진로·커리어 상담 관점",
  "기획자로서 자료와 시장 변화를 읽는 방식",
  "두 아이 아빠로서 학생·부모의 불안을 함께 보는 시선",
  "AI 시대의 선택을 직업명보다 5포지션·대체면·잔존면으로 번역",
];

const offerSteps = [
  {
    label: "0원",
    title: "AI 시대 진로 포지션 체크",
    body: "개인정보 없이 5포지션 중 현재 가까운 역할 위치를 확인합니다.",
  },
  {
    label: "29,000원 베타",
    title: "5포지션 미니 리포트",
    body: "현재 포지션, 대체면·잔존면, 다음 활동 3개를 짧게 정리하는 첫 구매용 리포트입니다.",
  },
  {
    label: "59,000원 베타",
    title: "5포지션 상세 리포트",
    body: "개인 조건과 경험을 받아 주 포지션, 보조 포지션, 대체 위험, 7/14일 실행안을 정리합니다.",
  },
  {
    label: "300,000원 제한 옵션",
    title: "1:1 미래설계 상담",
    body: "선용의 직접 시간이 들어가는 제한 슬롯입니다. 리포트 이후에도 복잡한 선택이 남을 때만 연결합니다.",
  },
];

const sampleCards = [
  {
    label: "현재 포지션",
    body: "아이는 도구 운용보다 맥락 해석과 문제 발견 쪽에서 힘이 먼저 보입니다.",
  },
  {
    label: "피해야 할 착각",
    body: "직업명을 빨리 정하면 불안이 줄어든다고 생각하지만, 역할 위치가 없으면 금방 다시 흔들립니다.",
  },
  {
    label: "다음 7일 행동",
    body: "관심 직업 3개가 아니라, 아이가 반복해서 맡는 역할 3개를 먼저 적습니다.",
  },
];

export default function DiagnosisPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080b12] text-white">
      <section className="border-b border-white/10 bg-[#080b12]">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="diagnosis" ctaHref="#free-diagnosis" ctaLabel="포지션 체크 시작" />
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(255,91,46,0.24)_0%,rgba(255,91,46,0)_30%),radial-gradient(circle_at_86%_4%,rgba(79,123,255,0.2)_0%,rgba(79,123,255,0)_28%)]" />
        <div className="relative mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 gap-10 overflow-hidden px-5 py-12 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-10 lg:py-20">
          <div className="min-w-0 max-w-[calc(100vw-40px)] sm:max-w-none">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff6b35]">THE LUMEN Position Report</p>
            <h1 className="mt-5 max-w-4xl break-words [word-break:keep-all] text-[2.35rem] font-black leading-[1.02] tracking-[-0.055em] text-white sm:text-[5.2rem] sm:leading-[0.95] sm:tracking-[-0.085em]">
              직업 이름보다
              <br />
              포지션이 먼저입니다.
            </h1>
            <p className="mt-6 max-w-xl break-words [word-break:keep-all] text-base font-bold leading-8 text-white/70">
              AI 시대 진로는 적성 찾기가 아니라 위치 찾기입니다. 무료 체크로 먼저 가까운 포지션을 확인하세요.
            </p>
            <Link href="#free-diagnosis" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[#080b12] transition hover:bg-[#ff6b35] hover:text-white">
              무료 포지션 체크 시작
            </Link>
            <div className="mt-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {["7문항 무료 체크", "리포트는 상담 전 정리 단계", "상담은 리포트 이후 선택지"].map((item) => (
                <div key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white/72">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[26px] border border-[#ff6b35]/20 bg-[#ff6b35]/10 p-5 text-sm font-bold leading-7 text-white/72">
              <p className="font-black text-white">더루멘은 직업 이름을 골라주는 곳이 아닙니다.</p>
              <p className="mt-2">AI 시대에 내가 어디에 서야 하는지 보고, 필요하면 5포지션 리포트로 상황을 정리합니다.</p>
            </div>
          </div>

          <div id="free-diagnosis" className="min-w-0 max-w-[calc(100vw-40px)] scroll-mt-24 sm:max-w-full">
            <CareerDiagnosisFlow />
          </div>
        </div>
      </section>


      <section className="border-y border-white/10 bg-[#0b0f16]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff6b35]">Choose Your Track</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">누구의 포지션을 볼까요?</h2>
            <p className="mt-4 text-sm font-bold leading-7 text-white/62">
              무료 체크로 먼저 역할 위치를 보고, 필요하면 같은 트랙으로 5포지션 리포트 요청을 남길 수 있습니다.
            </p>
          </div>
          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {audienceTracks.map((track) => (
              <Link
                key={track.type}
                href={`/diagnosis/report-intake?source=diagnosis-track-card&track=${track.type}`}
                className="group rounded-[28px] border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#ff6b35]/45 hover:bg-[#ff6b35]/10 sm:p-6"
              >
                <p className="text-xs font-black text-[#ffb199]">{track.label}</p>
                <h3 className="mt-3 text-xl font-black tracking-[-0.03em] text-white">{track.title}</h3>
                <p className="mt-3 text-sm font-bold leading-7 text-white/68">{trackLaunchCopy[track.type]}</p>
                <p className="mt-5 text-xs font-black text-white/42 transition group-hover:text-[#ffb199]">이 트랙으로 포지션 리포트 요청하기 →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b0f16]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-14 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-20">
          <div className="rounded-[34px] border border-white/10 bg-white/[0.035] p-5 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[30px] border border-white/10 bg-white/5">
                <Image src="/sunyong-profile.jpg" alt="김선용 프로필" fill className="object-cover" sizes="112px" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff6b35]">Trust Anchor</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">AI보다 먼저, 선용의 기준을 세웁니다.</h2>
                <p className="mt-4 text-sm font-bold leading-7 text-white/64">
                  이 체크는 사람을 겁주는 검사가 아닙니다. 선용이 쌓아온 상담·기획·부모의 관점 위에 모라의 해석 시스템을 얹어, 직업명보다 먼저 아이의 역할 위치를 보는 입구입니다.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {trustPoints.map((point) => (
              <div key={point} className="rounded-[22px] border border-white/10 bg-white/[0.035] px-5 py-4 text-sm font-bold leading-7 text-white/72">
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#080b12]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff6b35]">How it converts</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">무료 체크에서, 5포지션 리포트로 넘어갑니다.</h2>
            <p className="mt-5 text-sm font-bold leading-7 text-white/62">
              직접 상담은 제한적으로만 받습니다. 대신 더 많은 분들이 김선용의 판단 기준을 경험할 수 있도록 AI 시대 진로 포지션 리포트로 먼저 제공합니다. 리포트는 상담 전에 상황을 정리하는 단계입니다.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {offerSteps.map((step) => (
              <article key={step.title} className="rounded-[28px] border border-white/10 bg-[#0d1117] p-5 sm:p-6">
                <p className="w-fit rounded-full border border-[#ff6b35]/25 bg-[#ff6b35]/10 px-3 py-1 text-xs font-black text-[#ffb199]">{step.label}</p>
                <h3 className="mt-5 text-xl font-black tracking-[-0.03em] text-white">{step.title}</h3>
                <p className="mt-3 text-sm font-bold leading-7 text-white/62">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0b0f16]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff6b35]">Report Preview</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">5포지션 리포트는 이런 문장을 남깁니다.</h2>
            <p className="mt-5 text-sm font-bold leading-7 text-white/62">
              직업명을 던지는 대신, 아이가 어떤 역할 위치에 가까운지와 대체면·잔존면, 다음 7일 또는 14일 행동을 남깁니다. 상담은 이 정리 뒤에도 복잡한 선택이 남을 때만 이어지는 프리미엄 옵션입니다.
            </p>
            <Link href="/diagnosis/report-intake" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[#080b12] transition hover:bg-[#ff6b35] hover:text-white">
              5포지션 리포트 베타 요청하기
            </Link>
          </div>

          <div className="grid gap-4">
            {sampleCards.map((card) => (
              <article key={card.label} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ffb199]">{card.label}</p>
                <p className="mt-3 text-base font-bold leading-8 text-white/76">{card.body}</p>
              </article>
            ))}
            <div className="rounded-[28px] border border-[#73d6b6]/20 bg-[#73d6b6]/10 p-5 text-sm font-bold leading-7 text-[#dffdf3]">
              개인정보 없이 무료 결과를 먼저 볼 수 있고, 5포지션 리포트 요청은 사용자가 직접 선택할 때만 접수됩니다.
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#080b12]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff6b35]">Sample Reports</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">실제로 이런 결과물을 받게 됩니다.</h2>
            <p className="mt-5 text-sm font-bold leading-7 text-white/62">
              아래는 가상 입력을 바탕으로 만든 샘플입니다. 실제 리포트는 사용자가 남긴 조건, 경험, 피하고 싶은 방향을 기준으로 다시 작성합니다.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {sampleReportPreviews.map((sample) => (
              <article key={sample.track} className="rounded-[30px] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                <p className="text-xs font-black text-[#ffb199]">{sample.label}</p>
                <h3 className="mt-3 text-xl font-black leading-7 tracking-[-0.03em] text-white">{sample.title}</h3>
                <p className="mt-4 text-xs font-bold leading-6 text-white/46">가상 입력: {sample.fictionalInput}</p>
                <div className="mt-5 rounded-[22px] border border-[#ff6b35]/20 bg-[#ff6b35]/10 p-4">
                  <p className="text-xs font-black text-[#ffb199]">한 줄 진단</p>
                  <p className="mt-2 text-sm font-black leading-7 text-white">{sample.oneLineDiagnosis}</p>
                </div>
                <div className="mt-4 grid gap-3 text-sm font-bold leading-7 text-white/68">
                  <p><span className="text-white">막힌 지점:</span> {sample.blocker}</p>
                  <p><span className="text-white">다음 행동:</span> {sample.actions[0]}</p>
                </div>
                <Link
                  href={`/diagnosis/report-intake?source=sample-report-preview&track=${sample.track}`}
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-black text-[#080b12] transition hover:bg-[#ff6b35] hover:text-white"
                >
                  이 트랙으로 리포트 요청하기
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
