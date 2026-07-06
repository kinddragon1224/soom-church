"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  assignmentTypeOptions,
  defaultHistoryRoadmapInput,
  fieldOptions,
  gradeOptions,
  historyRoadmapInputSchema,
  historyRoadmapResultSchema,
  historyUnitOptions,
  type HistoryRoadmapInput,
} from "@/lib/history-roadmap";

const storageKey = "history-roadmap:result";

const exampleQueries = [
  "고1 간호사 일제강점기 탐구보고서",
  "고2 경찰 조선 후기 토론",
  "고1 건축가 고려 발표",
  "고3 심리상담사 산업화와 민주화 세특",
];

const careerFieldHints: Array<{ field: HistoryRoadmapInput["field"]; keywords: string[] }> = [
  { field: "보건의료", keywords: ["간호", "의사", "약사", "물리치료", "응급", "보건", "치위생"] },
  { field: "법정치", keywords: ["변호", "검사", "판사", "법", "정치", "외교", "행정", "공무원"] },
  { field: "교육", keywords: ["교사", "선생", "교육", "교수", "유아", "초등", "중등"] },
  { field: "공학기술", keywords: ["개발", "프로그래머", "엔지니어", "건축", "로봇", "기계", "전기", "컴퓨터"] },
  { field: "문화예술", keywords: ["웹툰", "작가", "디자인", "음악", "미술", "배우", "영화"] },
  { field: "미디어콘텐츠", keywords: ["유튜브", "PD", "기자", "방송", "콘텐츠", "마케팅", "광고"] },
  { field: "경영경제", keywords: ["경영", "경제", "회계", "창업", "금융", "무역", "세무"] },
  { field: "군사안보", keywords: ["군인", "경찰", "소방", "안보", "장교", "부사관"] },
  { field: "복지상담", keywords: ["상담", "심리", "사회복지", "복지", "청소년", "목사", "전도사", "신학", "교회", "선교", "사역", "종교"] },
  { field: "자연과학", keywords: ["생명", "화학", "물리", "지구", "수학", "연구원"] },
  { field: "인문사회", keywords: ["역사", "철학", "사회", "인류", "문헌", "문화재"] },
];

type SelectField = "grade" | "field" | "historyUnit" | "assignmentType";

function inferInputFromQuery(query: string, current: HistoryRoadmapInput): HistoryRoadmapInput {
  const compactQuery = query.replace(/\s+/g, " ").trim();
  const lowerQuery = compactQuery.toLowerCase();
  const inferred: HistoryRoadmapInput = { ...current };
  const removedTokens: string[] = [];

  for (const grade of gradeOptions) {
    if (compactQuery.includes(grade)) {
      inferred.grade = grade;
      removedTokens.push(grade);
      break;
    }
  }

  for (const unit of [...historyUnitOptions].sort((a, b) => b.length - a.length)) {
    if (unit !== "전체 단원에서 추천" && compactQuery.includes(unit)) {
      inferred.historyUnit = unit;
      removedTokens.push(unit);
      break;
    }
  }

  for (const assignmentType of assignmentTypeOptions) {
    if (assignmentType !== "아직 모름" && compactQuery.includes(assignmentType)) {
      inferred.assignmentType = assignmentType;
      removedTokens.push(assignmentType);
      break;
    }
  }

  const hintedField = careerFieldHints.find(({ keywords }) =>
    keywords.some((keyword) => lowerQuery.includes(keyword.toLowerCase())),
  );
  if (hintedField) {
    inferred.field = hintedField.field;
  }

  let career = compactQuery;
  for (const token of removedTokens) {
    career = career.replaceAll(token, " ");
  }
  career = career
    .replace(/한국사|탐구|주제|추천|세특|수행평가|보고서|발표|토론|카드뉴스|독서|연계/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  inferred.career = career || compactQuery;
  return inferred;
}

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-black uppercase tracking-[0.16em] text-[#b9801e]">
      {children}
    </label>
  );
}

function SelectInput({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: SelectField;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (field: SelectField, value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(id, event.target.value)}
        className="min-h-11 w-full rounded-2xl border border-[#eadcaf] bg-white px-3 text-sm font-black text-[#172033] outline-none transition focus:border-[#c7962d] focus:ring-4 focus:ring-[#f2b544]/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function HistoryRoadmapForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [input, setInput] = useState<HistoryRoadmapInput>(defaultHistoryRoadmapInput);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function updateQuery(value: string) {
    setQuery(value);
    setInput((current) => inferInputFromQuery(value, current));
  }

  function updateSelect(field: SelectField, value: string) {
    setInput((current) => ({ ...current, [field]: value }));
  }

  function applyExample(value: string) {
    updateQuery(value);
    setError("");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const inferredInput = query.trim() ? inferInputFromQuery(query, input) : input;
    const parsed = historyRoadmapInputSchema.safeParse(inferredInput);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "희망 진로를 먼저 입력해 주세요.");
      return;
    }

    setInput(parsed.data);
    setIsLoading(true);

    try {
      const response = await fetch("/api/history-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const payload = (await response.json().catch(() => null)) as unknown;

      if (!response.ok) {
        const message =
          payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
            ? payload.error
            : "결과 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.";
        throw new Error(message);
      }

      const resultPayload =
        payload && typeof payload === "object" && "result" in payload ? payload.result : payload;
      const result = historyRoadmapResultSchema.parse(resultPayload);

      sessionStorage.setItem(storageKey, JSON.stringify(result));
      router.push("/history-roadmap/result");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "결과 생성 중 문제가 생겼습니다. 입력을 확인한 뒤 다시 시도해 주세요.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form id="history-roadmap-form" onSubmit={onSubmit} className="mx-auto w-full max-w-4xl">
      <fieldset disabled={isLoading} className="grid gap-4 disabled:opacity-75">
        <div className="rounded-[1.6rem] border border-[#e7bd62]/35 bg-[#fffaf0]/85 p-2.5 text-[#172033] shadow-[0_30px_120px_rgba(0,0,0,0.34)] backdrop-blur-md sm:rounded-[2.5rem] sm:bg-[#fffaf0] sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex min-h-[3.25rem] flex-1 items-center gap-2 rounded-[1.2rem] bg-white/90 px-3.5 ring-1 ring-[#eadcaf] sm:min-h-16 sm:gap-3 sm:rounded-[1.45rem] sm:bg-white sm:px-5">
              <span className="hidden text-2xl sm:block" aria-hidden="true">
                ⌕
              </span>
              <input
                id="career"
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder="예: 고2 간호사 일제강점기 탐구보고서"
                className="min-w-0 flex-1 bg-transparent text-[15px] font-black text-[#111827] outline-none placeholder:text-[#9a917c] sm:text-xl"
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="min-h-[3.25rem] rounded-[1.2rem] bg-[#f97316] px-5 text-[15px] font-black text-white shadow-[0_18px_44px_rgba(249,115,22,0.32)] transition hover:bg-[#ea580c] focus:outline-none focus:ring-4 focus:ring-[#f97316]/30 disabled:cursor-not-allowed sm:min-h-16 sm:rounded-[1.45rem] sm:px-8 sm:text-base"
            >
              {isLoading ? "찾는 중..." : "탐구 주제 만들기"}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-1.5 px-0.5 sm:gap-2 sm:px-1">
            {exampleQueries.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => applyExample(example)}
                className="max-w-full rounded-full border border-[#e7bd62]/35 bg-[#f7edd7]/85 px-2.5 py-1.5 text-[11px] font-black leading-5 text-[#7b5315] transition hover:border-[#f97316]/45 hover:bg-[#fff2df] sm:bg-[#f7edd7] sm:px-3 sm:py-2 sm:text-xs"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <details className="group rounded-[1.45rem] border border-white/12 bg-white/[0.07] p-3.5 text-left backdrop-blur sm:rounded-[1.75rem] sm:p-4">
          <summary className="cursor-pointer list-none text-sm font-black text-[#fff3cf] outline-none">
            세부 조건 보기
            <span className="ml-2 text-white/45 group-open:hidden">+</span>
            <span className="ml-2 hidden text-white/45 group-open:inline">-</span>
          </summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SelectInput id="grade" label="학년" value={input.grade} options={gradeOptions} onChange={updateSelect} />
            <SelectInput id="field" label="계열" value={input.field} options={fieldOptions} onChange={updateSelect} />
            <SelectInput
              id="historyUnit"
              label="단원"
              value={input.historyUnit}
              options={historyUnitOptions}
              onChange={updateSelect}
            />
            <SelectInput
              id="assignmentType"
              label="유형"
              value={input.assignmentType}
              options={assignmentTypeOptions}
              onChange={updateSelect}
            />
          </div>
        </details>

        {error ? (
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#f97316]/35 bg-[#fff7ed] px-4 py-3 text-sm font-bold leading-6 text-[#9a3412]">
            {error}
          </div>
        ) : null}
      </fieldset>
    </form>
  );
}
