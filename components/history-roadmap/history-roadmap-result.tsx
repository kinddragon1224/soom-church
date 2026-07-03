"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  formatHistoryRoadmapResult,
  historyRoadmapResultSchema,
  type HistoryRoadmapResult,
} from "@/lib/history-roadmap";

const storageKey = "history-roadmap:result";

function ResultCard({
  eyebrow,
  title,
  children,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[1.75rem] border border-[#d8c79b] bg-[#fffaf0] p-5 text-[#172033] shadow-[0_18px_55px_rgba(0,0,0,0.18)] ${className}`}>
      {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b9801e]">{eyebrow}</p> : null}
      <h2 className="mt-2 text-xl font-black tracking-[-0.04em] text-[#111827] sm:text-2xl">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-[#475569]">{children}</div>
    </section>
  );
}

export function HistoryRoadmapResultView() {
  const [result, setResult] = useState<HistoryRoadmapResult | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "done" | "manual">("idle");
  const [manualCopyText, setManualCopyText] = useState("");
  const manualCopyRef = useRef<HTMLTextAreaElement>(null);
  const consultingUrl = process.env.NEXT_PUBLIC_CONSULTING_URL || "#";

  useEffect(() => {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) {
      setIsReady(true);
      return;
    }

    try {
      const parsed = historyRoadmapResultSchema.safeParse(JSON.parse(raw));
      if (parsed.success) {
        setResult(parsed.data);
      }
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!manualCopyText) return;

    manualCopyRef.current?.focus();
    manualCopyRef.current?.select();
  }, [manualCopyText]);

  function fallbackCopyText(text: string) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  }

  async function copyAll() {
    if (!result) return;

    const resultText = formatHistoryRoadmapResult(result);

    try {
      const copiedWithSelection = fallbackCopyText(resultText);

      if (!copiedWithSelection) {
        if (!navigator.clipboard?.writeText) {
          throw new Error("Clipboard API is not available");
        }

        await navigator.clipboard.writeText(resultText);
      }

      setCopyState("done");
      setManualCopyText("");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      try {
        if (!fallbackCopyText(resultText)) {
          throw new Error("Clipboard fallback failed");
        }

        setCopyState("done");
        setManualCopyText("");
        window.setTimeout(() => setCopyState("idle"), 1800);
      } catch {
        setManualCopyText(resultText);
        setCopyState("manual");
      }
    }
  }

  if (!isReady) {
    return (
      <main className="min-h-screen bg-[#071426] px-5 py-12 text-white">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-6">
          결과를 불러오는 중입니다.
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-[#071426] px-5 py-12 text-white">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#e7bd62]">No Result</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.05em]">표시할 결과가 없습니다.</h1>
          <p className="mt-4 text-sm leading-7 text-white/70">
            먼저 입력폼에서 진로와 한국사 단원을 넣고 탐구 주제를 생성해 주세요.
          </p>
          <Link
            href="/history-roadmap"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#f97316] px-5 text-sm font-black text-white"
          >
            입력폼으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#071426] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(231,189,98,0.2),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.16),transparent_28%)]" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8 lg:py-12">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.24)] sm:p-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/history-roadmap" className="text-sm font-black text-[#e7bd62]">
              한국사 진로 세특 로드맵
            </Link>
            <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight tracking-[-0.055em] sm:text-5xl">
              {result.summary.career} 진로로 읽는 한국사 탐구 방향
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
              세특 완성문이 아니라, 수업 활동으로 발전시킬 탐구 주제와 질문의 초안입니다.
            </p>
          </div>
          <button
            type="button"
            onClick={copyAll}
            className="min-h-12 shrink-0 rounded-2xl bg-[#f97316] px-5 text-sm font-black text-white shadow-[0_18px_44px_rgba(249,115,22,0.32)] transition hover:bg-[#ea580c]"
          >
            {copyState === "done" ? "복사 완료" : copyState === "manual" ? "직접 복사 가능" : "전체 결과 복사"}
          </button>
        </header>

        {manualCopyText ? (
          <section className="rounded-[1.5rem] border border-[#f97316]/35 bg-[#fff7ed] p-4 text-[#7c2d12]">
            <p className="text-sm font-black">브라우저가 자동 복사를 막아 전체 결과를 아래에 준비했습니다.</p>
            <p className="mt-1 text-xs font-bold leading-5 text-[#9a3412]">
              내용이 선택되어 있으니 Ctrl+C 또는 Cmd+C로 복사하면 됩니다.
            </p>
            <textarea
              ref={manualCopyRef}
              readOnly
              value={manualCopyText}
              className="mt-3 h-36 w-full resize-none rounded-2xl border border-[#fed7aa] bg-white p-3 text-xs leading-5 text-[#172033] outline-none"
            />
          </section>
        ) : null}

        <ResultCard eyebrow="Input Summary" title="입력 요약">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["학년", result.summary.grade],
              ["희망 진로", result.summary.career],
              ["관심 계열", result.summary.field],
              ["단원", result.summary.historyUnit],
              ["유형", result.summary.assignmentType],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-[#f4ead1] px-4 py-3">
                <p className="text-xs font-black text-[#9a6a16]">{label}</p>
                <p className="mt-1 break-words font-black text-[#172033]">{value}</p>
              </div>
            ))}
          </div>
        </ResultCard>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <ResultCard eyebrow="Recommended Topics" title="추천 탐구 주제 5개">
            <div className="grid gap-3">
              {result.recommendedTopics.map((topic, index) => (
                <article key={`${topic.title}-${index}`} className="rounded-2xl border border-[#eadcaf] bg-white px-4 py-4">
                  <p className="text-xs font-black text-[#c07917]">0{index + 1}</p>
                  <h3 className="mt-1 break-words text-base font-black text-[#111827]">{topic.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#64748b]">{topic.shortReason}</p>
                </article>
              ))}
            </div>
          </ResultCard>

          <div className="grid gap-6">
            <ResultCard eyebrow="Best Topic" title="가장 추천하는 주제" className="bg-[#172033] text-white">
              <h3 className="break-words text-xl font-black leading-snug text-white">{result.bestTopic.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/74">{result.bestTopic.reason}</p>
            </ResultCard>

            <ResultCard eyebrow="Career Connection" title="진로 연결 이유">
              <p>{result.careerConnection}</p>
            </ResultCard>
          </div>
        </div>

        <ResultCard eyebrow="History Concepts" title="관련 한국사 개념 칩">
          <div className="flex flex-wrap gap-2">
            {result.historyConcepts.map((concept) => (
              <span key={concept} className="rounded-full border border-[#d8c79b] bg-[#f4ead1] px-3 py-2 text-xs font-black text-[#6b4a12]">
                {concept}
              </span>
            ))}
          </div>
        </ResultCard>

        <ResultCard eyebrow="Source Check" title="자료 확인 루트">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["우리역사넷", "https://contents.history.go.kr/", "사료, 연대기, 교과서 용어를 먼저 확인"],
              ["한국민족문화대백과", "https://encykorea.aks.ac.kr/", "인물·사건·제도 개념을 넓게 확인"],
              ["교과서/수업 안내문", "/history-roadmap", "제출 조건과 단원 범위를 마지막에 대조"],
            ].map(([name, href, desc]) => (
              <a
                key={name}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="rounded-2xl border border-[#eadcaf] bg-white px-4 py-4 transition hover:border-[#f97316]/40"
              >
                <p className="font-black text-[#172033]">{name}</p>
                <p className="mt-2 text-xs font-bold leading-5 text-[#64748b]">{desc}</p>
              </a>
            ))}
          </div>
        </ResultCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <ResultCard eyebrow="Research Questions" title="탐구 질문 3개">
            <ol className="grid gap-3">
              {result.researchQuestions.map((question, index) => (
                <li key={question} className="rounded-2xl bg-white px-4 py-3">
                  <span className="mr-2 font-black text-[#c07917]">{index + 1}.</span>
                  {question}
                </li>
              ))}
            </ol>
          </ResultCard>

          <ResultCard eyebrow="Report Outline" title="보고서 목차 5단계">
            <ol className="grid gap-3">
              {result.reportOutline.map((item, index) => (
                <li key={item} className="rounded-2xl bg-white px-4 py-3">
                  <span className="mr-2 font-black text-[#c07917]">{index + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
          </ResultCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <ResultCard eyebrow="Presentation" title="발표 제목">
            <p className="text-lg font-black leading-snug text-[#172033]">{result.presentationTitle}</p>
          </ResultCard>

          <ResultCard eyebrow="Seteuk Direction" title="세특 방향 예시">
            <p>{result.seteukDirection}</p>
          </ResultCard>
        </div>

        <ResultCard eyebrow="Next Steps" title="다음 활동 제안 3개">
          <div className="grid gap-3 sm:grid-cols-3">
            {result.nextSteps.map((step, index) => (
              <div key={step} className="rounded-2xl bg-white px-4 py-4">
                <p className="text-xs font-black text-[#c07917]">STEP {index + 1}</p>
                <p className="mt-2 text-sm font-bold leading-6 text-[#475569]">{step}</p>
              </div>
            ))}
          </div>
        </ResultCard>

        <section className="rounded-[2rem] border border-[#f97316]/35 bg-[#fff7ed] p-5 text-[#7c2d12] sm:p-7">
          <p className="text-sm font-bold leading-7">{result.caution}</p>
        </section>

        <section className="rounded-[2rem] border border-[#e7bd62]/35 bg-[#0d1d34] p-5 text-white shadow-[0_24px_90px_rgba(0,0,0,0.22)] sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#e7bd62]">Next Design</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
            이 주제로 실제 탐구보고서 구조까지 잡고 싶다면 진로 맞춤 탐구 설계를 받아보세요.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
            결과를 복사해 두고, 보고서 흐름·자료 조사 방향·발표 구조까지 이어서 정리할 수 있습니다.
          </p>
          <a
            href={consultingUrl}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#f97316] px-5 text-center text-sm font-black text-white transition hover:bg-[#ea580c] sm:w-auto"
          >
            탐구보고서 설계 문의하기
          </a>
        </section>
      </div>
    </main>
  );
}
