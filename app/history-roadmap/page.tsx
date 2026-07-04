import type { Metadata } from "next";
import Image from "next/image";
import { HistoryRoadmapForm } from "@/components/history-roadmap/history-roadmap-form";

export const metadata: Metadata = {
  title: "내 진로로 다시 읽는 한국사",
  description:
    "한국사 단원과 학생의 진로를 연결해 수행평가, 탐구보고서, 발표, 세특 주제를 설계하는 도구입니다.",
  alternates: { canonical: "/history-roadmap" },
};

const resultItems = [
  "탐구 주제 5개",
  "가장 좋은 주제 1개",
  "탐구 질문 3개",
  "보고서 목차 5단계",
  "4주 실행 플랜",
];

const sourceLinks = [
  {
    name: "국사편찬위원회 우리역사넷",
    href: "https://contents.history.go.kr/",
    desc: "사료, 한국사 연대기, 교과서 용어 해설 확인",
  },
  {
    name: "한국민족문화대백과",
    href: "https://encykorea.aks.ac.kr/",
    desc: "인물, 사건, 제도, 사상 개념 확인",
  },
  {
    name: "학교 수업 자료",
    href: "#history-roadmap-form",
    desc: "교과서 단원, 수행평가 조건, 선생님 안내문과 대조",
  },
];

export default function HistoryRoadmapPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#061326] text-white">
      <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-5 py-8 sm:min-h-screen sm:px-8">
        <div className="absolute inset-0 -z-30 bg-[#061326]">
          <video
            aria-hidden="true"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/history-roadmap/hero-history-roadmap-poster.jpg"
            className="h-full w-full object-cover object-center opacity-[0.82] brightness-[1.08] contrast-[1.1] saturate-[1.16] sm:opacity-[0.68] sm:brightness-[1.02] sm:contrast-[1.06] sm:saturate-[1.08]"
          >
            <source
              media="(max-width: 639px)"
              src="/history-roadmap/hero-history-roadmap-mobile.mp4"
              type="video/mp4"
            />
            <source src="/history-roadmap/hero-history-roadmap.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_18%,rgba(231,189,98,0.24),transparent_26%),radial-gradient(circle_at_80%_35%,rgba(249,115,22,0.12),transparent_25%),linear-gradient(180deg,rgba(6,19,38,0.50)_0%,rgba(6,19,38,0.24)_44%,rgba(6,19,38,0.74)_100%)] sm:bg-[radial-gradient(circle_at_50%_18%,rgba(231,189,98,0.28),transparent_24%),radial-gradient(circle_at_80%_35%,rgba(249,115,22,0.14),transparent_24%),linear-gradient(180deg,rgba(6,19,38,0.66)_0%,rgba(6,19,38,0.42)_42%,rgba(6,19,38,0.82)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,19,38,0.34)_0%,rgba(6,19,38,0.08)_28%,rgba(6,19,38,0.08)_72%,rgba(6,19,38,0.34)_100%)] sm:bg-[linear-gradient(90deg,rgba(6,19,38,0.74)_0%,rgba(6,19,38,0.14)_28%,rgba(6,19,38,0.14)_72%,rgba(6,19,38,0.74)_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:46px_46px] sm:opacity-[0.08]" />
        <div className="absolute left-1/2 top-1/2 -z-10 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e7bd62]/20" />
        <div className="absolute left-1/2 top-[42%] -z-10 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute inset-x-0 top-[18%] -z-10 hidden text-center text-[9rem] font-black leading-none tracking-[-0.12em] text-white/[0.035] sm:block lg:text-[12rem]">
          HISTORY
        </div>
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
          <p className="rounded-full border border-[#e7bd62]/30 bg-white/[0.06] px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#e7bd62] backdrop-blur">
            한국사 진로 세특 로드맵
          </p>

          <h1
            aria-label="내 진로로 다시 읽는 한국사"
            className="mt-7 max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.07em] drop-shadow-[0_8px_34px_rgba(0,0,0,0.36)] sm:text-7xl lg:text-8xl"
          >
            <span aria-hidden="true">내 진로로</span>
            <br />
            <span aria-hidden="true">다시 읽는 한국사</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-black leading-8 text-[#fff3cf] sm:text-2xl">
            한국사를 외우는 과목에서, 내 진로를 설명하는 탐구 과목으로.
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/66 sm:text-base">
            희망 진로를 한 줄로 넣으면 수행평가·탐구보고서·발표·세특으로 이어질 한국사 탐구 주제를 잡아줍니다.
          </p>

          <div className="mt-9 w-full">
            <HistoryRoadmapForm />
          </div>

          <div className="mt-4 flex w-full max-w-3xl items-center gap-3 rounded-2xl border border-white/10 bg-[#071426]/52 px-4 py-2.5 text-left text-white/78 backdrop-blur sm:px-5">
            <Image
              src="/history-roadmap/kim-sunyong.jpg"
              alt="한국사 진로 세특 로드맵을 설계한 김선용"
              width={80}
              height={80}
              className="h-9 w-9 shrink-0 rounded-xl border border-[#e7bd62]/20 bg-[#f3f4f6] object-cover object-top"
              sizes="36px"
            />
            <div className="min-w-0">
              <p className="text-xs font-black leading-5 text-[#fff3cf] sm:text-sm">
                직업상담사 2급 × 한국사능력검정시험 1급 기반 설계
              </p>
              <p className="text-[11px] font-bold leading-5 text-white/58 sm:text-xs">
                세특 문장보다 먼저, 탐구 질문과 자료 확인 순서를 잡습니다.
              </p>
            </div>
          </div>

          <p className="mt-7 max-w-3xl text-xs font-bold leading-6 text-white/52 sm:text-sm">
            세특 문장을 대신 써주는 생성기가 아닙니다. 사건·인물·제도·사상을 진로와 연결해
            스스로 탐구할 질문을 설계합니다.
          </p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0a1830] px-5 py-8 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#e7bd62]">Result</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-[-0.05em] sm:text-4xl">
              검색 한 번으로 결과 구조가 바로 잡힙니다.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-5">
            {resultItems.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 text-sm font-black text-white/82">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 lg:py-14">
        <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#e7bd62]">Accuracy Guard</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-[-0.05em] sm:text-4xl">
              좋은 결과는 자료 확인까지 이어져야 합니다.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/66">
              자동 추천 주제는 출발점입니다. 제출 전에는 공신력 있는 역사 자료와 교과서 단원 기준으로
              사실관계를 다시 확인해야 합니다.
            </p>
          </div>

          <div className="grid gap-3">
            {sourceLinks.map((source) => (
              <a
                key={source.name}
                href={source.href}
                target={source.href.startsWith("http") ? "_blank" : undefined}
                rel={source.href.startsWith("http") ? "noreferrer" : undefined}
                className="rounded-[1.5rem] border border-[#e7bd62]/20 bg-[#fffaf0] p-5 text-left text-[#172033] shadow-[0_18px_55px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-[#f97316]/40"
              >
                <p className="text-sm font-black text-[#9a6a16]">{source.name}</p>
                <p className="mt-2 text-sm leading-6 text-[#64748b]">{source.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
