export type DiagnosisResultType = "direction" | "rebuild" | "ai_tool" | "transition";

export type DiagnosisOption = {
  label: string;
  type: DiagnosisResultType;
};

export type DiagnosisQuestion = {
  id: number;
  title: string;
  options: DiagnosisOption[];
};

export type DiagnosisResult = {
  title: string;
  summary: string;
  strength: string;
  blocker: string;
  aiDirection: string;
  nextAction: string;
};

export const diagnosisQuestions: DiagnosisQuestion[] = [
  {
    id: 1,
    title: "지금 가장 고민되는 것은 무엇인가요?",
    options: [
      { label: "내가 뭘 좋아하고 잘하는지 모르겠다", type: "direction" },
      { label: "가진 경험은 있는데 어떻게 설명해야 할지 모르겠다", type: "rebuild" },
      { label: "AI를 써야 하는 건 아는데 어디에 써야 할지 모르겠다", type: "ai_tool" },
      { label: "지금 하던 일을 계속해도 될지 불안하다", type: "transition" },
    ],
  },
  {
    id: 2,
    title: "커리어를 생각할 때 가장 막히는 지점은?",
    options: [
      { label: "선택지가 너무 많아 고르기 어렵다", type: "direction" },
      { label: "내 강점이 평범해 보인다", type: "rebuild" },
      { label: "업무/공부에 AI를 붙이는 방법을 모르겠다", type: "ai_tool" },
      { label: "나이, 전공, 경력 때문에 늦은 것 같다", type: "transition" },
    ],
  },
  {
    id: 3,
    title: "현재 나에게 가장 필요한 것은?",
    options: [
      { label: "방향을 좁히는 기준", type: "direction" },
      { label: "내 경험을 다시 해석하는 문장", type: "rebuild" },
      { label: "바로 써볼 수 있는 AI 도구/활용법", type: "ai_tool" },
      { label: "다음 단계로 넘어가기 위한 현실적 계획", type: "transition" },
    ],
  },
  {
    id: 4,
    title: "내가 가진 강점에 가까운 것은?",
    options: [
      { label: "관심사가 다양하고 새로운 걸 잘 본다", type: "direction" },
      { label: "해본 일과 경험이 꽤 있다", type: "rebuild" },
      { label: "도구를 배우면 빠르게 적용하는 편이다", type: "ai_tool" },
      { label: "어려운 시기를 버티고 조정해온 경험이 있다", type: "transition" },
    ],
  },
  {
    id: 5,
    title: "AI 시대에 가장 불안한 부분은?",
    options: [
      { label: "어떤 직업을 선택해야 할지 모르겠다", type: "direction" },
      { label: "내 경험이 시장에서 쓸모 있을지 모르겠다", type: "rebuild" },
      { label: "AI를 못 쓰면 뒤처질 것 같다", type: "ai_tool" },
      { label: "지금까지 쌓은 경력이 흔들릴까 봐 불안하다", type: "transition" },
    ],
  },
  {
    id: 6,
    title: "지금 당장 해보고 싶은 행동은?",
    options: [
      { label: "나에게 맞는 방향 후보를 정리하고 싶다", type: "direction" },
      { label: "내 경험을 강점 문장으로 바꾸고 싶다", type: "rebuild" },
      { label: "내 일/공부에 맞는 AI 도구를 찾고 싶다", type: "ai_tool" },
      { label: "전환 가능한 선택지를 비교하고 싶다", type: "transition" },
    ],
  },
  {
    id: 7,
    title: "상담을 받는다면 가장 기대하는 결과는?",
    options: [
      { label: "진로/직업 방향 후보 2~3개", type: "direction" },
      { label: "나를 설명하는 핵심 문장", type: "rebuild" },
      { label: "바로 써볼 AI 활용 루틴", type: "ai_tool" },
      { label: "다음 30일 실행 계획", type: "transition" },
    ],
  },
];

export const resultPriority: DiagnosisResultType[] = ["direction", "rebuild", "ai_tool", "transition"];

export const diagnosisResults: Record<DiagnosisResultType, DiagnosisResult> = {
  direction: {
    title: "방향 탐색형",
    summary: "선택지가 많아서 멈춘 상태입니다. 지금 필요한 건 더 많은 정보가 아니라, 나에게 맞는 선택 기준입니다.",
    strength: "관심사가 넓고 새로운 가능성을 빠르게 감지합니다.",
    blocker: "기준 없이 정보를 모으다 보니 방향이 흐려질 수 있습니다.",
    aiDirection: "직업명 검색보다 관심사, 문제 유형, 일하는 방식 정리에 AI를 활용하는 것이 좋습니다.",
    nextAction: "관심 직업 3개가 아니라 “내가 풀고 싶은 문제 3개”를 먼저 적어보세요.",
  },
  rebuild: {
    title: "역량 재정렬형",
    summary: "경험은 있는데 시장에 전달되는 문장이 약한 상태입니다. 지금 필요한 건 경험을 다시 해석하는 작업입니다.",
    strength: "이미 쌓아온 경험과 사례가 있습니다.",
    blocker: "경험을 나열하지만, 어떤 문제를 해결했는지가 선명하지 않을 수 있습니다.",
    aiDirection: "이력서/소개서보다 먼저 경험을 문제 해결 구조로 정리하는 데 AI를 쓰면 좋습니다.",
    nextAction: "최근 경험 하나를 “상황-문제-내가 줄인 불편-결과”로 다시 써보세요.",
  },
  ai_tool: {
    title: "AI 도구 활용형",
    summary: "방향보다 먼저 내 일에 AI를 붙일 구체 지점이 필요한 상태입니다.",
    strength: "도구를 배우고 적용할 준비가 되어 있습니다.",
    blocker: "AI를 배워야 한다는 압박은 있지만, 어디에 붙일지가 불명확합니다.",
    aiDirection: "새로운 툴을 많이 배우기보다 반복 업무, 자료 정리, 글쓰기, 비교 판단 중 하나부터 시작하는 게 좋습니다.",
    nextAction: "이번 주 반복되는 일 하나를 고르고, 그 일을 AI로 30% 줄이는 실험을 해보세요.",
  },
  transition: {
    title: "전환 준비형",
    summary: "지금까지의 경력이나 선택을 버리는 게 아니라, 다음 단계에 맞게 재배치해야 하는 상태입니다.",
    strength: "버티고 조정해온 시간이 자산입니다.",
    blocker: "새로 시작해야 한다는 압박 때문에 기존 강점까지 낮게 평가할 수 있습니다.",
    aiDirection: "전직/전환 후보를 찾기보다, 기존 경험이 어디에 다시 쓰일 수 있는지 비교하는 데 AI를 활용하면 좋습니다.",
    nextAction: "계속 가져갈 경험 1개, 줄일 일 1개, 새로 실험할 일 1개를 적어보세요.",
  },
};
