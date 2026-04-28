export type DiagnosisResultType = "direction" | "rebuild" | "ai_tool" | "transition";
export type DiagnosisAudienceType = "student" | "young_career" | "worker" | "second_career";
export type AiToolCategoryType =
  | "thinking"
  | "research"
  | "writing"
  | "portfolio"
  | "automation"
  | "data"
  | "building"
  | "practice";
export type WorkFieldType =
  | "care_help"
  | "information"
  | "problem_solving"
  | "making"
  | "technology"
  | "persuasion"
  | "field_operation"
  | "learning_growth";

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
  resultLens: string;
  consultationCta: string;
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
  toolCategories: AiToolCategoryType[];
  workFields: WorkFieldType[];
  segmentReports: Record<DiagnosisAudienceType, {
    summary: string;
    consultationFocus: string;
    nextAction: string;
  }>;
};

export type AiToolCategory = {
  type: AiToolCategoryType;
  title: string;
  tools: string[];
  beginnerUse: string;
  weeklyExperiment: string;
  sessionSetup: string;
};

export type WorkField = {
  type: WorkFieldType;
  title: string;
  plainDescription: string;
  ncsHint: string;
  aiFirstMove: string;
  examplePaths: string[];
};

export const diagnosisAudiences: DiagnosisAudience[] = [
  {
    type: "student",
    title: "학생/학부모",
    description: "과목, 전공, 진로 후보가 너무 넓어서 기준이 필요한 상태",
    aiQuestion: "AI에게 직업명을 묻기보다 관심사와 문제 유형을 정리하게 합니다.",
    reportFocus: "전공·직무 후보를 좁히는 기준",
    resultLens: "과목·전공·직업 선택 기준",
    consultationCta: "아이 선택 기준 같이 정리하기",
  },
  {
    type: "young_career",
    title: "취준·20대 커리어",
    description: "경험은 있는데 자기소개, 이력서, 직무 방향으로 연결이 약한 상태",
    aiQuestion: "AI를 경험 해석, 강점 문장, 면접 답변 초안에 붙입니다.",
    reportFocus: "경험을 시장 언어로 바꾸는 문장",
    resultLens: "경험을 직무 언어로 바꾸는 기준",
    consultationCta: "내 경험의 강점 문장 점검받기",
  },
  {
    type: "worker",
    title: "직장인",
    description: "내 업무에 AI를 어떻게 붙일지 모르거나 커리어 확장이 막힌 상태",
    aiQuestion: "반복 업무, 자료 정리, 글쓰기, 비교 판단 중 하나부터 줄입니다.",
    reportFocus: "업무 속 AI 적용 지점",
    resultLens: "현재 업무에 AI를 붙일 지점",
    consultationCta: "내 일에 맞는 AI 루틴 점검받기",
  },
  {
    type: "second_career",
    title: "전환·재취업",
    description: "쌓아온 경력을 버리지 않고 다음 선택으로 재배치해야 하는 상태",
    aiQuestion: "AI를 전직 후보 탐색보다 기존 경험의 재사용 가능성 비교에 씁니다.",
    reportFocus: "다음 30일 전환 계획",
    resultLens: "경력 재사용·전환 가능성·다음 30일 행동",
    consultationCta: "내 경력의 다음 쓰임 확인하기",
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

export const aiToolCategories: Record<AiToolCategoryType, AiToolCategory> = {
  thinking: {
    type: "thinking",
    title: "생각 정리형",
    tools: ["ChatGPT", "Claude", "Gemini"],
    beginnerUse: "막연한 고민을 질문 목록, 선택 기준, 비교표로 바꾸는 데 씁니다.",
    weeklyExperiment: "내가 고민하는 선택지를 3개 적고, AI에게 장단점과 빠진 기준을 물어보세요.",
    sessionSetup: "상담에서는 질문을 더 구체화하고, 본인에게 맞는 프롬프트 틀을 만듭니다.",
  },
  research: {
    type: "research",
    title: "자료 조사형",
    tools: ["Perplexity", "Gemini", "ChatGPT Search"],
    beginnerUse: "직업, 전공, 산업, 기업 정보를 빠르게 모으고 출처를 확인하는 데 씁니다.",
    weeklyExperiment: "관심 직무 2개를 검색하고 필요한 역량, 실제 하는 일, 진입 경로를 비교하세요.",
    sessionSetup: "상담에서는 신뢰할 자료와 버려도 되는 정보를 구분하는 조사 기준을 잡습니다.",
  },
  writing: {
    type: "writing",
    title: "문장 정리형",
    tools: ["Claude", "ChatGPT", "Notion AI"],
    beginnerUse: "경험을 자기소개, 이력서, 면접 답변, 상담 메모 문장으로 바꾸는 데 씁니다.",
    weeklyExperiment: "경험 하나를 넣고 ‘상황-문제-행동-결과-강점’ 구조로 다시 써보세요.",
    sessionSetup: "상담에서는 AI 초안을 사람 냄새 나는 자기 언어로 다듬는 기준을 만듭니다.",
  },
  portfolio: {
    type: "portfolio",
    title: "결과물 제작형",
    tools: ["Canva", "Gamma", "Notion"],
    beginnerUse: "진로 방향, 포트폴리오, 발표 자료, 경력 소개서를 보기 좋게 정리하는 데 씁니다.",
    weeklyExperiment: "내 방향을 한 장짜리 소개 카드나 5장 발표자료로 만들어보세요.",
    sessionSetup: "상담에서는 보여줄 내용과 빼야 할 내용을 나누고 첫 결과물 구조를 잡습니다.",
  },
  automation: {
    type: "automation",
    title: "반복 업무 자동화형",
    tools: ["Zapier", "Make", "Notion", "Google Apps Script"],
    beginnerUse: "반복 입력, 알림, 정리, 전달 같은 작은 업무를 줄이는 데 씁니다.",
    weeklyExperiment: "매주 반복하는 일 하나를 고르고, 입력-처리-출력 3단계로 쪼개보세요.",
    sessionSetup: "상담에서는 자동화보다 먼저 업무 흐름을 정리하고, 실패 위험이 낮은 1개만 설계합니다.",
  },
  data: {
    type: "data",
    title: "데이터 정리형",
    tools: ["ChatGPT Advanced Data Analysis", "Gemini", "Excel Copilot"],
    beginnerUse: "표, 설문, 매출, 일정, 비교 자료를 요약하고 패턴을 찾는 데 씁니다.",
    weeklyExperiment: "엑셀이나 표 하나를 넣고 ‘무엇을 먼저 봐야 하는지’ 요약을 받아보세요.",
    sessionSetup: "상담에서는 데이터에서 의사결정에 필요한 질문을 뽑는 법을 잡습니다.",
  },
  building: {
    type: "building",
    title: "아이디어 구현형",
    tools: ["Cursor", "v0", "Replit", "Lovable", "Bolt"],
    beginnerUse: "아이디어를 간단한 웹페이지, 앱 화면, 자동화 도구의 초안으로 만드는 데 씁니다.",
    weeklyExperiment: "만들고 싶은 서비스나 페이지를 5문장으로 설명하고 첫 화면 초안을 생성해보세요.",
    sessionSetup: "상담에서는 만들기 전에 고객, 기능, 화면 흐름을 작게 줄이는 작업을 합니다.",
  },
  practice: {
    type: "practice",
    title: "연습 코치형",
    tools: ["ChatGPT Voice", "Claude", "Gemini Live"],
    beginnerUse: "면접, 발표, 상담 대화, 진로 설명을 말로 연습하는 데 씁니다.",
    weeklyExperiment: "AI에게 면접관 역할을 맡기고 5분 동안 내 경험을 말로 설명해보세요.",
    sessionSetup: "상담에서는 어색한 답변을 줄이고, 본인 말투에 맞는 대화 스크립트를 만듭니다.",
  },
};

export const workFields: Record<WorkFieldType, WorkField> = {
  care_help: {
    type: "care_help",
    title: "사람을 돕는 일",
    plainDescription: "사람의 문제를 듣고, 정리하고, 회복이나 선택을 돕는 일입니다.",
    ncsHint: "상담, 교육, 사회복지, 보건, 인사/조직 지원 영역과 연결됩니다.",
    aiFirstMove: "상담 사례나 고민 내용을 익명화해 AI에게 ‘핵심 욕구와 다음 질문’을 뽑아보게 하세요.",
    examplePaths: ["진로상담", "교육기획", "HRD", "코칭", "사회서비스"],
  },
  information: {
    type: "information",
    title: "정보를 정리하는 일",
    plainDescription: "흩어진 자료를 모으고, 비교하고, 사람들이 이해할 수 있게 구조화하는 일입니다.",
    ncsHint: "경영지원, 사무, 리서치, 데이터 관리, 문서 기획 영역과 연결됩니다.",
    aiFirstMove: "관심 자료 5개를 넣고 AI에게 ‘공통점, 차이점, 결정 기준’을 표로 정리하게 하세요.",
    examplePaths: ["사무기획", "리서치", "자료관리", "운영지원", "정책/시장 조사"],
  },
  problem_solving: {
    type: "problem_solving",
    title: "문제를 해결하는 일",
    plainDescription: "불편한 흐름을 찾아 원인을 나누고, 더 나은 방식으로 바꾸는 일입니다.",
    ncsHint: "경영기획, 프로젝트 관리, 품질관리, 서비스 운영, 컨설팅 영역과 연결됩니다.",
    aiFirstMove: "반복되는 문제 하나를 ‘원인-영향-해결 후보-실험’ 네 칸으로 나눠보세요.",
    examplePaths: ["서비스기획", "PM", "운영개선", "품질관리", "컨설팅"],
  },
  making: {
    type: "making",
    title: "무언가를 만드는 일",
    plainDescription: "아이디어를 콘텐츠, 디자인, 제품, 수업, 서비스 같은 결과물로 만드는 일입니다.",
    ncsHint: "디자인, 문화콘텐츠, 제품기획, 출판, 영상, 교육콘텐츠 영역과 연결됩니다.",
    aiFirstMove: "만들고 싶은 결과물을 한 문장으로 쓰고, AI에게 첫 목차나 화면 구성을 만들어달라고 하세요.",
    examplePaths: ["콘텐츠기획", "디자인", "영상/숏폼", "제품기획", "교육자료 제작"],
  },
  technology: {
    type: "technology",
    title: "기술을 다루는 일",
    plainDescription: "도구, 시스템, 데이터, 자동화를 사용해 일을 더 빠르고 정확하게 만드는 일입니다.",
    ncsHint: "정보기술, 데이터, AI 활용, 자동화, 디지털 전환 영역과 연결됩니다.",
    aiFirstMove: "내가 반복하는 디지털 작업을 적고, AI에게 자동화 가능성과 필요한 도구를 물어보세요.",
    examplePaths: ["AI 활용 코디네이터", "데이터 분석", "업무자동화", "웹/앱 제작", "IT 운영"],
  },
  persuasion: {
    type: "persuasion",
    title: "말과 콘텐츠로 설득하는 일",
    plainDescription: "사람들이 이해하고 움직이도록 메시지, 브랜드, 제안, 판매 흐름을 만드는 일입니다.",
    ncsHint: "마케팅, 홍보, 영업, 고객관리, 브랜드 커뮤니케이션 영역과 연결됩니다.",
    aiFirstMove: "내가 전하고 싶은 메시지를 넣고 AI에게 ‘고객 언어, 한 줄 카피, CTA’를 나눠보게 하세요.",
    examplePaths: ["마케팅", "브랜딩", "세일즈", "홍보", "콘텐츠 운영"],
  },
  field_operation: {
    type: "field_operation",
    title: "현장을 움직이는 일",
    plainDescription: "사람, 물건, 공간, 일정이 실제로 잘 돌아가게 조율하는 일입니다.",
    ncsHint: "서비스, 물류, 생산, 안전, 시설, 현장 운영 영역과 연결됩니다.",
    aiFirstMove: "하루 업무 흐름을 적고 AI에게 병목, 체크리스트, 실수 방지 항목을 뽑아보게 하세요.",
    examplePaths: ["서비스운영", "물류관리", "생산관리", "안전관리", "공간운영"],
  },
  learning_growth: {
    type: "learning_growth",
    title: "배우고 성장시키는 일",
    plainDescription: "사람이 더 잘 배우고 적응하도록 커리큘럼, 피드백, 성장 환경을 설계하는 일입니다.",
    ncsHint: "교육, 직업훈련, 교수설계, 멘토링, 조직문화 영역과 연결됩니다.",
    aiFirstMove: "배우고 싶은 주제를 넣고 AI에게 7일 학습 계획과 점검 질문을 만들어달라고 하세요.",
    examplePaths: ["교육기획", "강사", "학습코칭", "직업훈련", "조직문화"],
  },
};

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
    toolCategories: ["thinking", "research", "portfolio"],
    workFields: ["care_help", "information", "learning_growth"],
    segmentReports: {
      student: {
        summary: "학생/학부모에게는 ‘좋아 보이는 직업’을 많이 찾는 것보다 과목, 활동, 전공 후보를 고르는 기준을 먼저 세우는 것이 중요합니다.",
        consultationFocus: "아이의 관심 활동을 과목·전공·직업 후보로 무리하게 확정하지 않고, 선택 기준 3개로 좁힙니다.",
        nextAction: "이번 주에는 관심 직업보다 ‘아이가 반복해서 궁금해하는 문제’ 3개를 먼저 적어보세요.",
      },
      young_career: {
        summary: "20대 커리어에서는 선택지가 많을수록 더 흔들릴 수 있습니다. 직무명보다 내가 해결하고 싶은 문제와 일하는 방식을 먼저 봐야 합니다.",
        consultationFocus: "관심 직무를 나열하기보다 지원 가능성과 본인 기준을 함께 놓고 현실적인 후보를 압축합니다.",
        nextAction: "관심 직무 3개를 적고, 각 직무에서 실제로 반복하는 일을 AI에게 비교시켜 보세요.",
      },
      worker: {
        summary: "직장인에게는 새로운 직업을 찾기 전에 현재 업무에서 흥미, 강점, 피로가 갈리는 지점을 읽는 것이 먼저입니다.",
        consultationFocus: "현재 업무를 유지할 것, 줄일 것, AI로 보완할 것으로 나누어 다음 선택 기준을 만듭니다.",
        nextAction: "이번 주 업무 중 에너지가 덜 빠지는 일과 가장 소모되는 일을 각각 2개씩 적어보세요.",
      },
      second_career: {
        summary: "중장년 전환에서는 완전히 새로 시작하기보다, 기존 경험이 다시 쓰일 수 있는 방향을 찾는 것이 안정적입니다.",
        consultationFocus: "쌓아온 경력을 버리지 않고 재사용 가능한 자산, 전환 후보, 다음 30일 행동으로 나눕니다.",
        nextAction: "계속 가져갈 경험 1개, 줄이고 싶은 일 1개, 작게 실험할 일 1개를 적어보세요.",
      },
    },
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
    toolCategories: ["writing", "portfolio", "practice"],
    workFields: ["information", "persuasion", "problem_solving"],
    segmentReports: {
      student: {
        summary: "학생/학부모에게는 활동 기록이 많아도 ‘무엇을 잘하는 아이인지’ 한 문장으로 정리되지 않으면 진로 선택이 흐려질 수 있습니다.",
        consultationFocus: "교과·비교과 활동을 나열하지 않고 강점, 관심 문제, 전공 후보로 다시 정리합니다.",
        nextAction: "최근 활동 하나를 ‘무엇을 궁금해했고, 어떤 방식으로 해결했는지’로 다시 써보세요.",
      },
      young_career: {
        summary: "20대 커리어에서는 경험이 부족한 것이 아니라, 경험을 시장이 이해하는 문장으로 바꾸는 작업이 부족한 경우가 많습니다.",
        consultationFocus: "경험을 직무 강점, 자기소개 문장, 면접 답변 구조로 재정렬합니다.",
        nextAction: "최근 경험 하나를 상황-문제-행동-결과-강점 문장으로 바꿔보세요.",
      },
      worker: {
        summary: "직장인에게는 이미 해온 일이 많지만, 그것이 어떤 문제 해결 능력인지 정리되지 않으면 다음 기회로 연결되기 어렵습니다.",
        consultationFocus: "현재 업무 경험을 이직, 내부 이동, AI 활용 가능 역량으로 다시 해석합니다.",
        nextAction: "자주 맡는 일을 ‘내가 줄인 불편’ 중심으로 3개만 적어보세요.",
      },
      second_career: {
        summary: "중장년 전환에서는 경력이 오래됐다는 사실보다 그 경력이 어디에 다시 쓰일 수 있는지 번역하는 일이 중요합니다.",
        consultationFocus: "기존 경력을 재취업·전직·상담형 일·교육형 일 등으로 재배치합니다.",
        nextAction: "오래 해온 일 3개를 ‘사람, 정보, 현장, 문제 해결’ 중 어디에 가까운지 나눠보세요.",
      },
    },
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
    toolCategories: ["thinking", "automation", "data"],
    workFields: ["technology", "problem_solving", "information"],
    segmentReports: {
      student: {
        summary: "학생/학부모에게 AI는 정답을 대신 찾는 도구보다, 관심사와 학습 방향을 정리하는 연습 도구로 쓰는 것이 안전합니다.",
        consultationFocus: "과제 대체가 아니라 탐구 질문 만들기, 전공 조사, 발표 구조화처럼 학습을 돕는 AI 사용법을 잡습니다.",
        nextAction: "관심 주제 하나를 고르고 AI에게 탐구 질문 5개와 조사 키워드를 만들어달라고 해보세요.",
      },
      young_career: {
        summary: "20대 커리어에서는 AI 도구를 많이 아는 것보다 자기소개, 직무 조사, 면접 연습 중 하나에 먼저 붙이는 것이 좋습니다.",
        consultationFocus: "지원 준비 흐름에서 AI가 줄일 수 있는 반복 작업 1개를 정하고 루틴화합니다.",
        nextAction: "관심 기업 하나를 고르고 AI에게 직무 요구역량과 내 경험 연결 질문을 뽑아보게 하세요.",
      },
      worker: {
        summary: "직장인에게 AI는 커리어 전환 이전에 현재 업무 시간을 줄이고 판단 품질을 높이는 도구가 될 수 있습니다.",
        consultationFocus: "반복 업무, 자료 정리, 글쓰기, 비교 판단 중 가장 효과가 큰 AI 적용 지점을 찾습니다.",
        nextAction: "이번 주 반복되는 업무 하나를 입력-처리-출력으로 쪼개고 AI에게 줄일 방법을 물어보세요.",
      },
      second_career: {
        summary: "중장년 전환에서는 AI를 새 기술 경쟁으로 보기보다, 기존 경험을 정리하고 새로운 선택지를 비교하는 보조 도구로 보는 편이 좋습니다.",
        consultationFocus: "기존 경력을 AI로 정리하고, 전환 후보별 장단점과 학습 부담을 현실적으로 비교합니다.",
        nextAction: "기존 경력 3개를 넣고 AI에게 ‘다시 쓰일 수 있는 분야’를 비교표로 만들어달라고 해보세요.",
      },
    },
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
    toolCategories: ["thinking", "research", "portfolio"],
    workFields: ["care_help", "field_operation", "persuasion"],
    segmentReports: {
      student: {
        summary: "학생/학부모에게 전환 불안은 ‘늦었다’보다 ‘지금 선택이 나중에 막힐까 봐’ 생기는 경우가 많습니다.",
        consultationFocus: "현재 선택이 닫힌 길이 아니라 여러 가능성으로 이어지도록 과목·활동·전공 후보를 연결합니다.",
        nextAction: "지금 선택한 과목이나 활동이 연결될 수 있는 전공/직무 후보를 AI에게 5개만 물어보세요.",
      },
      young_career: {
        summary: "20대 커리어 전환은 모든 것을 다시 시작하는 문제가 아니라, 이미 가진 경험을 다른 맥락으로 옮기는 문제일 수 있습니다.",
        consultationFocus: "지금까지의 경험에서 유지할 강점과 새로 보완할 역량을 나누고 30일 실험을 잡습니다.",
        nextAction: "옮기고 싶은 분야 하나를 고르고, 현재 경험 중 그대로 가져갈 수 있는 것을 3개 적어보세요.",
      },
      worker: {
        summary: "직장인 전환은 퇴사 여부보다 현재 경력의 다음 쓰임을 확인하는 일이 먼저입니다.",
        consultationFocus: "내부 이동, 이직, 사이드 프로젝트, AI 활용 확장 중 가장 부담이 낮은 선택지를 비교합니다.",
        nextAction: "지금 일을 계속할 때 얻는 것과 잃는 것을 각각 3개씩 적고 AI에게 비교 기준을 뽑아보게 하세요.",
      },
      second_career: {
        summary: "중장년 전환에서는 나이 때문에 늦었다고 보기보다, 경력의 재사용 가능성과 현실적 조건을 함께 봐야 합니다.",
        consultationFocus: "경력 재사용 가능성, 전환 후보, 학습 부담, 다음 30일 행동을 현실적으로 정리합니다.",
        nextAction: "계속 가져갈 경험 1개, 줄일 일 1개, 새로 실험할 일 1개를 적어보세요.",
      },
    },
  },
};
