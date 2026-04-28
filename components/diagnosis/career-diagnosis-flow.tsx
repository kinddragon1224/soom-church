"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  diagnosisQuestions,
  diagnosisResults,
  resultPriority,
  type DiagnosisResultType,
} from "@/components/diagnosis/diagnosis-data";

type Answers = Partial<Record<number, DiagnosisResultType>>;

function getResultType(answers: Answers): DiagnosisResultType {
  const scores = resultPriority.reduce<Record<DiagnosisResultType, number>>((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {} as Record<DiagnosisResultType, number>);

  Object.values(answers).forEach((type) => {
    if (type) scores[type] += 1;
  });

  return resultPriority.reduce((winner, type) => {
    return scores[type] > scores[winner] ? type : winner;
  }, resultPriority[0]);
}

export function CareerDiagnosisFlow() {
  const [answers, setAnswers] = useState<Answers>({});
  const [showResult, setShowResult] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const totalCount = diagnosisQuestions.length;
  const progress = Math.round((answeredCount / totalCount) * 100);
  const canShowResult = answeredCount === totalCount;
  const resultType = useMemo(() => getResultType(answers), [answers]);
  const result = diagnosisResults[resultType];
  const contactHref = `/contact?source=diagnosis&type=${resultType}`;

  function selectAnswer(questionId: number, type: DiagnosisResultType) {
    setAnswers((current) => ({ ...current, [questionId]: type }));
  }

  function resetDiagnosis() {
    setAnswers({});
    setShowResult(false);
  }

  if (showResult) {
    return (
      <section className="w-full max-w-[calc(100vw-40px)] min-w-0 overflow-hidden rounded-[34px] sm:max-w-full border border-white/10 bg-[#0d1117] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff6b35]">Diagnosis Result</p>
            <h2 className="mt-3 break-words [overflow-wrap:anywhere] text-[2rem] font-black leading-[1] tracking-[-0.06em] text-white sm:text-[4rem]">
              {result.title}
            </h2>
          </div>
          <span className="w-fit rounded-full border border-[#73d6b6]/25 bg-[#73d6b6]/10 px-4 py-2 text-xs font-black text-[#bff4e4]">
            7문항 완료
          </span>
        </div>

        <p className="mt-7 max-w-3xl break-words text-base font-bold leading-8 text-white/78">
          {result.summary}
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {[
            ["현재 강점", result.strength],
            ["막힌 지점", result.blocker],
            ["AI 시대 도구 방향", result.aiDirection],
            ["다음 행동 1개", result.nextAction],
          ].map(([label, value]) => (
            <article key={label} className="min-w-0 rounded-[24px] border border-white/10 bg-white/[0.045] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff6b35]">{label}</p>
              <p className="mt-3 break-words text-sm font-bold leading-7 text-white/76">{value}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[26px] border border-white/10 bg-[#050507] p-5">
          <p className="text-sm leading-7 text-white/58">
            이 진단은 상담 전 방향을 좁히기 위한 간단한 self-check입니다. 결과는 저장되거나 서버로 전송되지 않습니다.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href={contactHref}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[#080b12] transition hover:bg-[#ff6b35] hover:text-white"
            >
              내 결과 기반으로 방향 상담 받기
            </Link>
            <button
              type="button"
              onClick={resetDiagnosis}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-6 text-sm font-black text-white transition hover:border-white/30 hover:bg-white/10"
            >
              다시 진단하기
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[calc(100vw-40px)] min-w-0 overflow-hidden rounded-[34px] sm:max-w-full border border-white/10 bg-[#0d1117] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:p-8 lg:p-10">
      <div className="flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff6b35]">3-minute self-check</p>
          <h2 className="mt-3 break-all break-words [overflow-wrap:anywhere] text-[1.72rem] font-black leading-[1.04] tracking-[-0.055em] text-white sm:text-[3.7rem] sm:leading-[1]">
            AI 시대 커리어 방향 진단
          </h2>
          <p style={{ overflowWrap: "anywhere", wordBreak: "break-all" }} className="mt-4 max-w-2xl break-words break-all [overflow-wrap:anywhere] text-sm leading-7 text-white/58">
            7개 질문에 답하면 현재 막힌 지점과 다음 행동 1개를 확인할 수 있습니다.
          </p>
        </div>
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-4 text-xs font-black text-white/58">
            <span>{answeredCount} / {totalCount}</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10 lg:w-64">
            <div className="h-full rounded-full bg-[#ff5b2e] transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-5">
        {diagnosisQuestions.map((question) => (
          <article key={question.id} className="min-w-0 overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
            <div className="flex gap-3">
              <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ff5b2e] text-xs font-black text-white">
                {question.id}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="break-words break-all [overflow-wrap:anywhere] text-base font-black leading-7 text-white">{question.title}</h3>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const active = answers[question.id] === option.type;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => selectAnswer(question.id, option.type)}
                        style={{ overflowWrap: "anywhere", whiteSpace: "normal", wordBreak: "break-all" }}
                        className={`min-h-12 min-w-0 whitespace-normal break-all break-words [overflow-wrap:anywhere] rounded-2xl border px-4 py-3 text-left text-sm font-bold leading-6 transition ${
                          active
                            ? "border-[#ff6b35]/75 bg-[#ff6b35]/16 text-white shadow-[0_12px_32px_rgba(255,107,53,0.1)]"
                            : "border-white/10 bg-[#050507]/45 text-white/70 hover:border-[#ff6b35]/40 hover:bg-[#ff6b35]/10"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-6 text-white/48">개인정보 입력 없이 브라우저 안에서만 결과를 계산합니다.</p>
        <button
          type="button"
          disabled={!canShowResult}
          onClick={() => setShowResult(true)}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[#080b12] transition hover:bg-[#ff6b35] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          결과 보기
        </button>
      </div>
    </section>
  );
}






