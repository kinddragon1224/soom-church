export type DiagnosisResultType = "direction" | "rebuild" | "ai_tool" | "transition";
export type DiagnosisAudienceType = "student" | "young_career" | "worker" | "second_career";

export type DiagnosisOption = {
  label: string;
  type: DiagnosisResultType;
};

export type DiagnosisAudience = {
  type: DiagnosisAudienceType;
  title: string;
  description: string;
  aiQuestion: string;
  reportFocus: string;
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
  aiRoutine: string;
  consultationFocus: string;
  preparation: string[];
};

export const diagnosisAudiences: DiagnosisAudience[] = [
  {
    type: "student",
    title: "학생/학부모",
    description: "과목, 전공, 진로 후보가 너무 넓어서 기준이 필요한 상태",
    aiQuestion: "AI에게 직업명을 묻기보다 관심사와 문제 유형을 정리하게 합니다.",
    reportFocus: "전공·직무 후보를 좁히는 기준",
  },
  {
    type: "young_career",
    title: "취준·20대 커리어",
    description: "경험은 있는데 자기소개, 이력서, 직무 방향으로 연결이 약한 상태",
    aiQuestion: "AI를 경험 해석, 강점 문장, 면접 답변 초안에 붙입니다.",
    reportFocus: "경험을 시장 언어로 바꾸는 문장",
  },
  {
    type: "worker",
    title: "직장인",
    description: "내 업무에 AI를 어떻게 붙일지 모르거나 커리어 확장이 막힌 상태",
    aiQuestion: "반복 업무, 자료 정리, 글쓰기, 비교 판단 중 하나부터 줄입니다.",
    reportFocus: "업무 속 AI 적용 지점",
  },
  {
    type: "second_career",
    title: "전환·재취업",
    description: "쌓아온 경력을 버리지 않고 다음 선택으로 재배치해야 하는 상태",
    aiQuestion: "AI를 전직 후보 탐색보다 기존 경험의 재사용 가능성 비교에 씁니다.",
    reportFocus: "다음 30일 전환 계획",
  },
];

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
    aiRoutine: "AI에게 “내가 관심 있는 활동 10개를 문제 유형으로 묶고, 비슷한 직무군을 3개만 추천해줘”라고 요청해보세요.",
    consultationFocus: "상담에서는 흩어진 관심사를 선택 기준 3개로 압축하고, 현실적으로 실험 가능한 후보를 정리합니다.",
    preparation: ["최근 끌렸던 활동 5개", "싫어하거나 피하고 싶은 일 3개", "궁금한 직업/전공/업무 후보 3개"],
  },
  rebuild: {
    title: "역량 재정렬형",
    summary: "경험은 있는데 시장에 전달되는 문장이 약한 상태입니다. 지금 필요한 건 경험을 다시 해석하는 작업입니다.",
    strength: "이미 쌓아온 경험과 사례가 있습니다.",
    blocker: "경험을 나열하지만, 어떤 문제를 해결했는지가 선명하지 않을 수 있습니다.",
    aiDirection: "이력서/소개서보다 먼저 경험을 문제 해결 구조로 정리하는 데 AI를 쓰면 좋습니다.",
    nextAction: "최근 경험 하나를 “상황-문제-내가 줄인 불편-결과”로 다시 써보세요.",
    aiRoutine: "AI에게 “이 경험을 상황-문제-행동-결과-강점 문장으로 바꿔줘”라고 시키고, 어색한 표현은 직접 고쳐보세요.",
    consultationFocus: "상담에서는 흩어진 경험을 강점 문장, 직무 연결 문장, 면접 답변 구조로 재정렬합니다.",
    preparation: ["최근 1년 경험 3개", "성과가 작아 보여도 맡았던 역할", "지원하거나 고민 중인 직무/분야"],
  },
  ai_tool: {
    title: "AI 도구 활용형",
    summary: "방향보다 먼저 내 일에 AI를 붙일 구체 지점이 필요한 상태입니다.",
    strength: "도구를 배우고 적용할 준비가 되어 있습니다.",
    blocker: "AI를 배워야 한다는 압박은 있지만, 어디에 붙일지가 불명확합니다.",
    aiDirection: "새로운 툴을 많이 배우기보다 반복 업무, 자료 정리, 글쓰기, 비교 판단 중 하나부터 시작하는 게 좋습니다.",
    nextAction: "이번 주 반복되는 일 하나를 고르고, 그 일을 AI로 30% 줄이는 실험을 해보세요.",
    aiRoutine: "반복되는 작업 하나를 고른 뒤 AI에게 “이 일을 30분 줄이기 위한 입력 양식, 초안, 체크리스트를 만들어줘”라고 요청하세요.",
    consultationFocus: "상담에서는 현재 업무/공부 흐름을 쪼개고, 바로 적용할 AI 루틴 1개를 설계합니다.",
    preparation: ["매주 반복되는 일 3개", "시간이 오래 걸리는 문서/정리 작업", "써봤지만 어려웠던 AI 도구"],
  },
  transition: {
    title: "전환 준비형",
    summary: "지금까지의 경력이나 선택을 버리는 게 아니라, 다음 단계에 맞게 재배치해야 하는 상태입니다.",
    strength: "버티고 조정해온 시간이 자산입니다.",
    blocker: "새로 시작해야 한다는 압박 때문에 기존 강점까지 낮게 평가할 수 있습니다.",
    aiDirection: "전직/전환 후보를 찾기보다, 기존 경험이 어디에 다시 쓰일 수 있는지 비교하는 데 AI를 활용하면 좋습니다.",
    nextAction: "계속 가져갈 경험 1개, 줄일 일 1개, 새로 실험할 일 1개를 적어보세요.",
    aiRoutine: "AI에게 “내 기존 경험을 유지/전환/새로 배울 것 세 칸으로 나누고, 가능한 전환 후보를 비교해줘”라고 요청하세요.",
    consultationFocus: "상담에서는 지금까지의 경력을 버리는 대신 재사용 가능한 자산과 30일 실험 계획으로 나눕니다.",
    preparation: ["지금까지 오래 해온 일 3개", "더 이상 반복하고 싶지 않은 일", "현실적으로 가능한 시간/예산/학습 조건"],
  },
};
