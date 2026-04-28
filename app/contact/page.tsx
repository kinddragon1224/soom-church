import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { ConsultationInquiryForm } from "@/components/contact/consultation-inquiry-form";

const processSteps = [
  { step: "01", title: "막힌 선택을 하나 적습니다", desc: "과목, 학과, 이력서, 퇴사, 재취업, AI 활용처럼 지금 멈춘 지점을 그대로 남깁니다." },
  { step: "02", title: "흐름과 기준을 봅니다", desc: "학생 진로, 20대 커리어, 후반전 커리어 중 어디에 가까운지 보고 선택 기준을 좁힙니다." },
  { step: "03", title: "다음 7일 행동으로 접습니다", desc: "정답을 장담하지 않고, 지금 바로 확인할 수 있는 행동 3개로 정리합니다." },
];

const responseCards = [
  { title: "무엇을 가져오면 되나요?", desc: "정리된 자료가 아니어도 됩니다. 지금 막힌 선택 하나와 현재 상황만 있으면 시작할 수 있습니다." },
  { title: "AI 강의인가요?", desc: "아닙니다. AI 시대의 직업 변화 속에서 내 진로·직업·커리어 선택을 어떻게 볼지 정리하는 방향 진단입니다." },
  { title: "30분 뒤 무엇이 남나요?", desc: "막힌 이유 1개, 선택 기준, 다음 7일에 해볼 행동 3개를 남기는 것을 목표로 합니다." },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080b12] text-white">
      <section className="border-b border-white/10 bg-[#080b12]">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="contact" ctaHref="/contact" ctaLabel="30분 방향 진단 신청" />
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_28%),radial-gradient(circle_at_88%_14%,rgba(255,91,46,0.24)_0%,rgba(255,91,46,0)_30%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="w-full max-w-[22rem] min-w-0 sm:max-w-5xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff6b35]">30-Minute Direction Session</p>
            <h1 className="mt-5 max-w-full break-all sm:break-normal text-[2.25rem] font-black leading-[1.06] tracking-[-0.04em] break-all sm:text-[5.5rem] sm:leading-[0.95] sm:tracking-[-0.085em] sm:break-normal">
              지금 막힌 선택을
              <br />
              하나만 가져오세요.
            </h1>
            <p className="mt-7 w-full max-w-[22rem] break-all sm:max-w-3xl sm:break-normal text-base leading-8 text-white/66 break-all sm:break-normal">
              과목, 학과, 이력서, 면접, 퇴사, 재취업, AI 활용. 문제를 크게 들고 와도 괜찮습니다. 먼저 한 문장으로 접고, 다음 행동 하나부터 정리합니다.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-8 px-5 pb-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-28">
          <div className="w-full min-w-0 max-w-full rounded-[28px] border border-white/10 bg-[#0d1117] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.24)] sm:p-8">
            <ConsultationInquiryForm />
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
            <Link href="/" className="rounded-[28px] border border-white/10 bg-white px-5 py-5 text-sm font-black text-[#080b12]">
              AI 커리어 인텔리전스 보기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
