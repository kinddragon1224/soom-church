import { z } from "zod";

export const gradeOptions = ["중3", "고1", "고2", "고3"] as const;

export const fieldOptions = [
  "인문사회",
  "교육",
  "경영경제",
  "법정치",
  "보건의료",
  "공학기술",
  "자연과학",
  "문화예술",
  "미디어콘텐츠",
  "군사안보",
  "복지상담",
  "아직 모름",
] as const;

export const historyUnitOptions = [
  "전체 단원에서 추천",
  "선사와 고대",
  "고려",
  "조선 전기",
  "조선 후기",
  "개항기",
  "일제강점기",
  "광복과 대한민국 정부 수립",
  "산업화와 민주화",
] as const;

export const assignmentTypeOptions = [
  "탐구보고서",
  "발표",
  "토론",
  "카드뉴스",
  "독서 연계",
  "세특 아이디어",
  "아직 모름",
] as const;

export const historyRoadmapInputSchema = z.object({
  grade: z.enum(gradeOptions),
  career: z
    .string()
    .trim()
    .min(1, "희망 진로를 입력해 주세요.")
    .max(80, "희망 진로는 80자 이내로 입력해 주세요."),
  field: z.enum(fieldOptions),
  historyUnit: z.enum(historyUnitOptions),
  assignmentType: z.enum(assignmentTypeOptions),
});

export const historyRoadmapResultSchema = z.object({
  summary: z.object({
    grade: z.string().min(1),
    career: z.string().min(1),
    field: z.string().min(1),
    historyUnit: z.string().min(1),
    assignmentType: z.string().min(1),
  }),
  recommendedTopics: z
    .array(
      z.object({
        title: z.string().min(1),
        shortReason: z.string().min(1),
      }),
    )
    .length(5),
  bestTopic: z.object({
    title: z.string().min(1),
    reason: z.string().min(1),
  }),
  careerConnection: z.string().min(1),
  historyConcepts: z.array(z.string().min(1)).min(3).max(8),
  researchQuestions: z.array(z.string().min(1)).length(3),
  reportOutline: z.array(z.string().min(1)).length(5),
  presentationTitle: z.string().min(1),
  seteukDirection: z.string().min(1),
  nextSteps: z.array(z.string().min(1)).length(3),
  weeklyPlan: z
    .array(
      z.object({
        week: z.string().min(1),
        stage: z.string().min(1),
        focus: z.string().min(1),
        actions: z.array(z.string().min(1)).length(3),
        output: z.string().min(1),
      }),
    )
    .length(4)
    .optional(),
  sourceKeywords: z.array(z.string().min(1)).min(3).max(8).optional(),
  caution: z.string().min(1),
});

export type HistoryRoadmapInput = z.infer<typeof historyRoadmapInputSchema>;
export type HistoryRoadmapResult = z.infer<typeof historyRoadmapResultSchema>;

export const defaultHistoryRoadmapInput: HistoryRoadmapInput = {
  grade: "고1",
  career: "",
  field: "아직 모름",
  historyUnit: "전체 단원에서 추천",
  assignmentType: "탐구보고서",
};

export function formatHistoryRoadmapResult(result: HistoryRoadmapResult) {
  const topicLines = result.recommendedTopics
    .map((topic, index) => `${index + 1}. ${topic.title}\n   - ${topic.shortReason}`)
    .join("\n");

  return [
    "한국사 진로 세특 로드맵",
    "",
    "[입력 요약]",
    `학년: ${result.summary.grade}`,
    `희망 진로: ${result.summary.career}`,
    `관심 계열: ${result.summary.field}`,
    `한국사 시대/단원: ${result.summary.historyUnit}`,
    `수행평가 유형: ${result.summary.assignmentType}`,
    "",
    "[추천 탐구 주제 5개]",
    topicLines,
    "",
    "[가장 추천하는 주제]",
    result.bestTopic.title,
    result.bestTopic.reason,
    "",
    "[진로 연결 이유]",
    result.careerConnection,
    "",
    "[관련 한국사 개념]",
    result.historyConcepts.join(", "),
    "",
    "[탐구 질문 3개]",
    result.researchQuestions.map((question, index) => `${index + 1}. ${question}`).join("\n"),
    "",
    "[보고서 목차 5단계]",
    result.reportOutline.map((item, index) => `${index + 1}. ${item}`).join("\n"),
    "",
    "[발표 제목]",
    result.presentationTitle,
    "",
    "[세특 방향 예시]",
    result.seteukDirection,
    "",
    "[다음 활동 제안]",
    result.nextSteps.map((step, index) => `${index + 1}. ${step}`).join("\n"),
    ...(result.weeklyPlan
      ? [
          "",
          "[4주 탐구 로드맵]",
          result.weeklyPlan
            .map(
              (week) =>
                `${week.week}. ${week.stage}\n   초점: ${week.focus}\n   실행: ${week.actions.join(" / ")}\n   산출물: ${week.output}`,
            )
            .join("\n\n"),
        ]
      : []),
    ...(result.sourceKeywords
      ? ["", "[자료 검색 키워드]", result.sourceKeywords.map((keyword) => `- ${keyword}`).join("\n")]
      : []),
    "",
    "[주의사항]",
    result.caution,
  ].join("\n");
}
