"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  audienceTracks,
  diagnosisQuestions,
  diagnosisResults,
  resultPriority,
  type AudienceTrackType,
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

function getRankedResultTypes(answers: Answers): DiagnosisResultType[] {
  const scores = resultPriority.reduce<Record<DiagnosisResultType, number>>((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {} as Record<DiagnosisResultType, number>);

  Object.values(answers).forEach((type) => {
    if (type) scores[type] += 1;
  });

  return [...resultPriority].sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    return resultPriority.indexOf(a) - resultPriority.indexOf(b);
  });
}

export function CareerDiagnosisFlow() {
  const [answers, setAnswers] = useState<Answers>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<AudienceTrackType>("student_parent");

  const answeredCount = Object.keys(answers).length;
  const totalCount = diagnosisQuestions.length;
  const progress = Math.round((answeredCount / totalCount) * 100);
  const canShowResult = answeredCount === totalCount;
  const resultType = useMemo(() => getResultType(answers), [answers]);
  const rankedResultTypes = useMemo(() => getRankedResultTypes(answers), [answers]);
  const result = diagnosisResults[resultType];
  const secondaryType = rankedResultTypes.find((type) => type !== resultType) ?? resultPriority[1];
  const secondaryResult = diagnosisResults[secondaryType];
  const track = audienceTracks.find((item) => item.type === selectedTrack) ?? audienceTracks[0];
  const reportHref = `/diagnosis/report-intake?source=diagnosis&type=${resultType}&track=${selectedTrack}`;
  const sessionHref = `/contact?source=diagnosis&type=${resultType}&offer=premium-direction-session`;

  function selectAnswer(questionId: number, type: DiagnosisResultType) {
    setAnswers((current) => ({ ...current, [questionId]: type }));
  }

  function resetDiagnosis() {
    setAnswers({});
    setShowResult(false);
  }

  if (showResult) {
    return (
      <section className="w-full max-w-[calc(100vw-40px)] min-w-0 overflow-hidden rounded-[34px] border border-white/10 bg-[#0d1117] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:max-w-full sm:p-8 lg:p-10">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff6b35]">Position Result</p>
            <h2 className="mt-3 break-words [word-break:keep-all] text-[2rem] font-black leading-[1] tracking-[-0.06em] text-white sm:text-[4rem]">
              {result.title}
            </h2>
            <p className="mt-3 text-sm font-black text-white/54">{result.plainName}</p>
          </div>
          <span className="w-fit rounded-full border border-[#73d6b6]/25 bg-[#73d6b6]/10 px-4 py-2 text-xs font-black text-[#bff4e4]">
            7문항 완료
          </span>
        </div>

        <p className="mt-7 max-w-3xl break-words [word-break:keep-all] text-base font-bold leading-8 text-white/78">
          현재 주 포지션은 <span className="text-white">{result.title}</span>입니다. 무료 체크는 여기서 끝내지 않고, 보조 가능성과 남는 면을 함께 봐야 다음 행동이 선명해집니다.
        </p>

        <div className="mt-6 rounded-[24px] border border-[#ff6b35]/25 bg-[#ff6b35]/10 px-5 py-4">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ffb199]">Selected Track</p>
          <p className="mt-2 text-base font-black text-white">{track.title}</p>
          <p className="mt-1 text-sm leading-6 text-white/70">{track.promise}</p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {[
            ["현재 주 포지션", result.summary],
            ["보조 포지션 가능성", `${secondaryResult.title}: ${secondaryResult.strength}`],
            ["넓은 대체면", result.broadAlternative],
            ["남는 잔존면", result.residualSurface],
            ["다음 7일 행동", result.sevenDayAction],
            ["리포트에서 더 볼 것", "무료 결과는 방향을 좁히는 미리보기입니다. 실제 상황, 불안, 피하고 싶은 미래를 넣으면 리포트에서 판단 기준을 더 구체화합니다."],
          ].map(([label, value]) => (
            <article key={label} className="min-w-0 rounded-[24px] border border-white/10 bg-white/[0.045] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff6b35]">{label}</p>
              <p className="mt-3 break-words text-sm font-bold leading-7 text-white/76">{value}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[26px] border border-white/10 bg-[#050507] p-5">
          <p className="text-sm leading-7 text-white/58">
              무료 체크로 가까운 포지션을 확인했습니다. 리포트는 상담 전에 상황을 정리하는 단계입니다. 아이의 실제 조건, 지금까지 해본 활동, 피하고 싶은 미래까지 반영하면 미니/상세 5포지션 리포트로 더 구체화할 수 있습니다.
          </p>
          <div className="mt-5 grid gap-3">
            <Link
              href={reportHref}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-center text-sm font-black text-[#080b12] transition hover:bg-[#ff6b35] hover:text-white"
            >
              내 상황 기준 5포지션 리포트 요청하기
            </Link>
            <div className="flex flex-col gap-2 text-center text-xs font-black text-white/46 sm:flex-row sm:justify-center sm:gap-5">
              <Link href={sessionHref} className="transition hover:text-white">
                리포트 이후에도 복잡하면 1:1 상담
              </Link>
              <button type="button" onClick={resetDiagnosis} className="transition hover:text-white">
                다시 진단하기
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[calc(100vw-40px)] min-w-0 overflow-hidden rounded-[34px] border border-white/10 bg-[#0d1117] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:max-w-full sm:p-8 lg:p-10">
      <div className="flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff5b2e]">Free position check</p>
          <h2 className="mt-3 break-words [word-break:keep-all] text-[1.72rem] font-black leading-[1.04] tracking-[-0.055em] text-white sm:text-[3.7rem] sm:leading-[1]">
            AI 시대 진로 포지션 체크
          </h2>
          <p className="mt-4 max-w-2xl break-words [word-break:keep-all] text-sm leading-7 text-white/58">
            무료 체크로 먼저 가까운 포지션을 확인하세요. 직업 이름을 찍기 전에, 내가 AI 시대에 어디에 서야 하는지 봅니다.
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

      <div className="mt-7 grid gap-2 sm:grid-cols-3">
        {audienceTracks.map((item) => {
          const active = selectedTrack === item.type;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => setSelectedTrack(item.type)}
              className={`rounded-[18px] border px-4 py-3 text-left transition ${
                active
                  ? "border-[#ff6b35]/70 bg-[#ff6b35]/14 text-white"
                  : "border-white/10 bg-white/[0.035] text-white/66 hover:border-[#ff6b35]/35 hover:bg-[#ff6b35]/8"
              }`}
            >
              <p className="text-xs font-black text-[#ffb199]">{item.label}</p>
              <p className="mt-1 text-sm font-black leading-5 text-white">{item.title}</p>
            </button>
          );
        })}
      </div>
      <p className="mt-3 rounded-[18px] border border-white/10 bg-white/[0.035] px-4 py-3 text-xs font-bold leading-6 text-white/58">
        {track.detail}
      </p>

      <div className="mt-7 grid gap-5">
        {diagnosisQuestions.map((question) => (
          <article key={question.id} className="min-w-0 overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
            <div className="flex gap-3">
              <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ff5b2e] text-xs font-black text-white">
                {question.id}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="break-words [word-break:keep-all] text-base font-black leading-7 text-white">{question.title}</h3>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {question.options.map((option) => {
                    const active = answers[question.id] === option.type;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => selectAnswer(question.id, option.type)}
                        className={`min-h-12 min-w-0 whitespace-normal break-words [word-break:keep-all] rounded-2xl border px-4 py-3 text-left text-sm font-bold leading-6 transition ${
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
        <p className="text-xs leading-6 text-white/48">개인정보 입력 없이 브라우저 안에서만 결과를 계산합니다. 무료 결과는 미리보기이고, 유료 전환은 5포지션 리포트 요청을 사용자가 선택할 때만 시작됩니다.</p>
        <button
          type="button"
          disabled={!canShowResult}
          onClick={() => setShowResult(true)}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[#080b12] transition hover:bg-[#ff6b35] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          포지션 결과 보기
        </button>
      </div>
    </section>
  );
}
