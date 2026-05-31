import Link from "next/link";
import { Suspense } from "react";
import SiteHeader from "@/components/site-header";
import { ConsultationInquiryForm } from "@/components/contact/consultation-inquiry-form";

const processSteps = [
  { step: "01", title: "먼저 무료 포지션 체크로 봅니다", desc: "직업 이름을 고르기 전에 도구 운용자, 결과 제작자, 맥락 해석자, 문제 발견자, 관계 조율자 중 어디에 가까운지 확인합니다." },
  { step: "02", title: "5포지션 리포트로 상황을 정리합니다", desc: "개인 조건, 경험, 피해야 할 선택, 다음 7일 행동까지 비동기 리포트로 먼저 정리합니다." },
  { step: "03", title: "복잡한 선택만 1:1로 봅니다", desc: "부모와 아이의 기준 충돌, 퇴사·전환처럼 직접 판단이 필요한 경우에만 제한적으로 연결합니다." },
];

const responseCards = [
  { title: "처음이면 어디서 시작하나요?", desc: "바로 상담을 신청하기보다 /diagnosis 무료 포지션 체크를 먼저 권합니다. 결과를 기준으로 리포트 요청이 더 정확해집니다." },
  { title: "상담이 주력 상품인가요?", desc: "아닙니다. 기본 경로는 5포지션 리포트입니다. 1:1은 선용의 직접 시간이 필요한 복잡한 선택에만 열어둡니다." },
  { title: "리포트와 1:1의 차이는?", desc: "리포트는 내 상황을 비동기로 해석해 방향과 행동을 정리합니다. 1:1은 그 뒤에도 남는 선택을 함께 좁히는 프리미엄 옵션입니다." },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080b12] text-white">
      <section className="border-b border-white/10 bg-[#080b12]">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="contact" ctaHref="/diagnosis" ctaLabel="무료 포지션 체크" />
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_28%),radial-gradient(circle_at_88%_14%,rgba(255,91,46,0.24)_0%,rgba(255,91,46,0)_30%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="w-full max-w-[22rem] min-w-0 sm:max-w-5xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff6b35]">Premium Direction Session</p>
            <h1 className="mt-5 max-w-full break-keep text-[2.25rem] font-black leading-[1.06] tracking-[-0.04em] sm:text-[5.5rem] sm:leading-[0.95] sm:tracking-[-0.085em]">
              복잡한 선택만
              <br />
              직접 봅니다.
            </h1>
            <p className="mt-7 w-full max-w-[22rem] break-keep text-base leading-8 text-white/66 sm:max-w-3xl">
              더루멘의 기본 경로는 무료 포지션 체크와 5포지션 리포트입니다. 다만 아이의 선택 기준, 퇴사·전환, 재취업처럼 직접 판단이 필요한 경우에는 제한적으로 1:1 미래설계 상담을 연결합니다.
            </p>
            <div className="mt-8 flex w-full max-w-[28rem] flex-col gap-3 sm:flex-row">
              <Link href="/diagnosis" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[#080b12] transition hover:bg-[#ff6b35] hover:text-white">
                무료 포지션 체크 먼저 하기
              </Link>
              <Link href="/diagnosis/report-intake?source=contact-hero&track=early_career" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-black text-white/86 transition hover:border-white/35 hover:bg-white/[0.06]">
                상세 리포트 요청
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-8 px-5 pb-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-28">
          <div className="w-full min-w-0 max-w-full rounded-[28px] border border-white/10 bg-[#0d1117] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.24)] sm:p-8">
            <Suspense fallback={<div className="min-h-[420px] rounded-[24px] border border-white/10 bg-white/[0.035] p-5 text-sm font-bold leading-7 text-white/62">방향 진단 신청 폼을 준비하고 있습니다.</div>}>
              <ConsultationInquiryForm />
            </Suspense>
          </div>
          <div className="grid min-w-0 gap-5 self-start">
            <div className="w-full min-w-0 max-w-full rounded-[28px] border border-white/10 bg-white/[0.045] p-5 sm:rounded-[34px] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff6b35]/80">Flow</p>
              <div className="mt-5 grid gap-3">
                {processSteps.map((item) => (
                  <div key={item.step} className="rounded-[22px] border border-white/10 bg-white/[0.045] px-4 py-4">
                    <p className="text-[11px] font-black tracking-[0.18em] text-[#ff6b35]/72">STEP {item.step}</p>
                    <p className="mt-2 font-bold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/62">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full min-w-0 max-w-full rounded-[28px] border border-white/10 bg-[#0d1117] p-5 sm:rounded-[34px] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff6b35]/80">FAQ</p>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-white/70">
                {responseCards.map((item) => (
                  <div key={item.title} className="rounded-[20px] border border-white/10 bg-white/[0.045] px-4 py-4">
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="mt-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/diagnosis/report-intake?source=contact-side-card&track=early_career" className="rounded-[28px] border border-white/10 bg-white px-5 py-5 text-sm font-black text-[#080b12]">
              처음이면 상세 리포트 요청부터 남기기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
