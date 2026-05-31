export type DiagnosisResultType =
  | "tool_operator"
  | "result_maker"
  | "context_interpreter"
  | "problem_finder"
  | "relationship_coordinator";

export type AudienceTrackType = "student_parent" | "early_career" | "transition";

export type AudienceTrack = {
  type: AudienceTrackType;
  label: string;
  title: string;
  promise: string;
  detail: string;
};

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
  plainName: string;
  summary: string;
  strength: string;
  blocker: string;
  aiDirection: string;
  nextAction: string;
  broadAlternative: string;
  residualSurface: string;
  sevenDayAction: string;
};

export const audienceTracks: AudienceTrack[] = [
  {
    type: "student_parent",
    label: "학생/부모",
    title: "우리 아이 포지션 체크",
    promise: "직업명보다 아이가 AI 시대에 맡을 역할 위치를 먼저 봅니다.",
    detail: "성향, 과목, 활동, 부모의 불안을 함께 읽어 아이가 가까운 5포지션을 확인합니다.",
  },
  {
    type: "early_career",
    label: "20대/첫 커리어",
    title: "첫 커리어 포지션 체크",
    promise: "전공·경험·AI 활용을 어떤 역할 위치로 보여줄지 정리합니다.",
    detail: "스펙 추가보다 지금 가진 경험이 도구 운용, 결과 제작, 맥락 해석 중 어디에 가까운지 봅니다.",
  },
  {
    type: "transition",
    label: "40~50대/전환",
    title: "경력 포지션 재설계",
    promise: "기존 경력을 버리지 않고 AI 시대의 역할 위치로 다시 읽습니다.",
    detail: "오래 맡아온 역할, 반복해서 해결한 문제, 사람 관계 자산을 5포지션 언어로 재분류합니다.",
  },
];

export const diagnosisQuestions: DiagnosisQuestion[] = [
  {
    id: 1,
    title: "AI 시대를 생각할 때 제일 먼저 드는 생각은?",
    options: [
      { label: "AI를 잘 써서 공부나 일을 빠르게 하고 싶다", type: "tool_operator" },
      { label: "영상, 글, 디자인, 앱 같은 결과물을 만들고 싶다", type: "result_maker" },
      { label: "복잡한 자료를 읽고 사람에게 설명하는 쪽이 맞다", type: "context_interpreter" },
      { label: "사람들이 불편해하는 문제를 먼저 찾는 편이다", type: "problem_finder" },
      { label: "사람 사이를 보고 조율하는 일이 더 익숙하다", type: "relationship_coordinator" },
    ],
  },
  {
    id: 2,
    title: "아이 또는 내가 오래 붙잡고 있을 수 있는 일은?",
    options: [
      { label: "새 도구를 배우고 내 방식으로 써보는 일", type: "tool_operator" },
      { label: "완성된 결과물을 만들고 보여주는 일", type: "result_maker" },
      { label: "자료를 비교하고 말이 되게 정리하는 일", type: "context_interpreter" },
      { label: "왜 안 되는지, 뭐가 문제인지 파고드는 일", type: "problem_finder" },
      { label: "사람을 설득하고 분위기를 맞추는 일", type: "relationship_coordinator" },
    ],
  },
  {
    id: 3,
    title: "학교나 일에서 자주 맡게 되는 역할은?",
    options: [
      { label: "툴을 찾아보고 효율을 높이는 역할", type: "tool_operator" },
      { label: "자료, 콘텐츠, 산출물을 끝까지 만드는 역할", type: "result_maker" },
      { label: "여러 의견과 정보를 정리해 설명하는 역할", type: "context_interpreter" },
      { label: "처음 질문을 던지고 방향을 잡는 역할", type: "problem_finder" },
      { label: "사람 사이에서 조율하고 연결하는 역할", type: "relationship_coordinator" },
    ],
  },
  {
    id: 4,
    title: "AI가 퍼질수록 더 키워야 한다고 느끼는 힘은?",
    options: [
      { label: "도구를 고르고 제대로 쓰는 힘", type: "tool_operator" },
      { label: "아이디어를 실제 결과로 만드는 힘", type: "result_maker" },
      { label: "AI가 낸 답을 내 상황에 맞게 해석하는 힘", type: "context_interpreter" },
      { label: "AI에게 물어볼 문제를 찾는 힘", type: "problem_finder" },
      { label: "신뢰, 감정, 갈등을 다루는 힘", type: "relationship_coordinator" },
    ],
  },
  {
    id: 5,
    title: "가장 불안한 지점은?",
    options: [
      { label: "AI 도구를 못 쓰면 뒤처질 것 같다", type: "tool_operator" },
      { label: "만든 결과물이 없어서 증명하기 어렵다", type: "result_maker" },
      { label: "내 생각을 남이 알아듣게 설명하기 어렵다", type: "context_interpreter" },
      { label: "무엇을 문제로 삼아야 할지 모르겠다", type: "problem_finder" },
      { label: "기술보다 사람 관계에서 자주 막힌다", type: "relationship_coordinator" },
    ],
  },
  {
    id: 6,
    title: "앞으로 해보고 싶은 활동에 가까운 것은?",
    options: [
      { label: "AI로 공부·업무 루틴을 바꿔보기", type: "tool_operator" },
      { label: "영상, 글, 굿즈, 웹, 포트폴리오 만들기", type: "result_maker" },
      { label: "자료 조사, 발표, 리포트, 해설 콘텐츠 만들기", type: "context_interpreter" },
      { label: "동네 문제, 학교 문제, 고객 불편 조사하기", type: "problem_finder" },
      { label: "팀 활동, 운영, 교육, 상담, 서비스 경험 쌓기", type: "relationship_coordinator" },
    ],
  },
  {
    id: 7,
    title: "리포트에서 가장 알고 싶은 것은?",
    options: [
      { label: "AI 도구를 어디부터 붙이면 좋을지", type: "tool_operator" },
      { label: "어떤 결과물을 만들어야 포지션이 보일지", type: "result_maker" },
      { label: "내 해석 능력을 어떻게 진로 언어로 바꿀지", type: "context_interpreter" },
      { label: "내가 발견할 수 있는 문제 영역이 무엇인지", type: "problem_finder" },
      { label: "사람을 다루는 힘을 어떤 일로 연결할지", type: "relationship_coordinator" },
    ],
  },
];

export const resultPriority: DiagnosisResultType[] = [
  "problem_finder",
  "context_interpreter",
  "result_maker",
  "tool_operator",
  "relationship_coordinator",
];

export const diagnosisResults: Record<DiagnosisResultType, DiagnosisResult> = {
  tool_operator: {
    title: "도구 운용자",
    plainName: "AI를 잘 쓰는 아이",
    summary: "AI 도구를 배우는 데서 끝나지 않고, 도구로 자기 판단과 작업 속도를 키울 가능성이 큽니다.",
    strength: "새 도구를 빨리 받아들이고, 공부나 일을 더 효율적으로 바꾸려는 감각이 있습니다.",
    blocker: "툴 이름을 많이 아는 것과 자기 판단이 선명한 것은 다릅니다. 도구 사용이 목적이 되면 금방 흔들립니다.",
    aiDirection: "반복되는 공부·업무 하나를 골라 AI로 줄이고, 결과가 실제로 나아졌는지 비교하는 경험이 먼저입니다.",
    nextAction: "이번 주에 반복되는 일 하나를 정하고, AI를 쓰기 전/후 결과를 짧게 기록해보세요.",
    broadAlternative: "결과 제작자 쪽으로 넓히면 도구 사용이 포트폴리오와 산출물로 남습니다.",
    residualSurface: "도구를 고르는 기준, 결과를 비교하는 눈, 반복 업무를 줄이는 습관은 남는 면입니다.",
    sevenDayAction: "매일 반복되는 공부·업무 1개를 정하고, AI 사용 전/후 시간과 결과를 7일 동안 기록하세요.",
  },
  result_maker: {
    title: "결과 제작자",
    plainName: "AI로 결과물을 만드는 아이",
    summary: "아이디어를 말로만 두지 않고 글, 영상, 디자인, 제품, 코드 같은 결과물로 꺼낼 때 강점이 보입니다.",
    strength: "완성물을 만들고 보여주는 과정에서 자기 실력이 드러납니다.",
    blocker: "좋아하는 것이 많아도 결과물이 남지 않으면 포지션이 흐려질 수 있습니다.",
    aiDirection: "AI를 아이디어 보조로 쓰되, 최종 결과물의 기준과 선택은 직접 남겨야 합니다.",
    nextAction: "작은 결과물 하나를 정해 7일 안에 공개 가능한 형태로 만들어보세요.",
    broadAlternative: "맥락 해석자 쪽으로 넓히면 결과물을 왜 만들었는지 설명하는 힘이 붙습니다.",
    residualSurface: "완성 경험, 공개 가능한 산출물, 피드백을 받아 고친 흔적은 오래 남는 증거입니다.",
    sevenDayAction: "작은 결과물 1개를 정하고 기획, 초안, 완성, 공개까지 7일 안에 한 번 끝내보세요.",
  },
  context_interpreter: {
    title: "맥락 해석자",
    plainName: "AI 결과를 사람 말로 바꾸는 아이",
    summary: "AI가 낸 답, 자료, 사람의 말을 그대로 옮기기보다 상황에 맞게 다시 설명하는 힘이 중요합니다.",
    strength: "정보를 비교하고, 사람에게 납득되는 말로 바꾸는 힘이 있습니다.",
    blocker: "단순 요약에 머물면 AI와 차이가 약해집니다. 맥락과 판단이 들어가야 포지션이 생깁니다.",
    aiDirection: "AI에게 요약을 맡긴 뒤, 왜 이 답이 지금 상황에 맞거나 맞지 않는지 직접 고치는 연습이 필요합니다.",
    nextAction: "관심 있는 기사나 자료 하나를 골라 ‘그래서 내 선택에는 무슨 뜻인가’로 다시 써보세요.",
    broadAlternative: "문제 발견자 쪽으로 넓히면 해석을 넘어 어떤 질문을 던질지까지 보이기 시작합니다.",
    residualSurface: "자료를 비교하는 힘, 사람에게 맞게 번역하는 힘, 판단 근거를 남기는 습관은 남습니다.",
    sevenDayAction: "관심 자료 3개를 고르고 각각을 ‘내 선택에 주는 의미’ 한 문장으로 다시 써보세요.",
  },
  problem_finder: {
    title: "문제 발견자",
    plainName: "AI가 풀 문제를 찾는 아이",
    summary: "정답을 빨리 맞히는 것보다, 무엇이 아직 풀리지 않았는지 먼저 보는 힘이 강점이 될 수 있습니다.",
    strength: "남들이 그냥 넘기는 불편과 빈틈을 질문으로 꺼낼 가능성이 있습니다.",
    blocker: "질문이 많아도 기록과 검증이 없으면 불평처럼 보일 수 있습니다.",
    aiDirection: "AI는 답을 내는 데 강합니다. 그래서 먼저 좋은 질문과 관찰 기록을 쌓는 쪽이 중요합니다.",
    nextAction: "학교, 동네, 집에서 반복되는 불편 3개를 적고 왜 아직 해결되지 않았는지 물어보세요.",
    broadAlternative: "결과 제작자 쪽으로 넓히면 발견한 문제를 작은 실험이나 결과물로 검증할 수 있습니다.",
    residualSurface: "불편을 관찰하는 눈, 질문을 만드는 힘, 해결 전 가설을 세우는 습관은 남는 면입니다.",
    sevenDayAction: "주변의 반복 불편 3개를 적고, 하나를 골라 원인 가설과 작은 실험 1개를 만들어보세요.",
  },
  relationship_coordinator: {
    title: "관계 조율자",
    plainName: "사람 사이를 다루는 아이",
    summary: "AI가 대체하기 어려운 신뢰, 설득, 돌봄, 갈등 조율에서 포지션이 생길 수 있습니다.",
    strength: "사람의 감정과 분위기를 읽고, 관계 속에서 일이 굴러가게 만드는 힘이 있습니다.",
    blocker: "기술을 못 하는 아이로 오해하면 강점이 묻힙니다. 이 힘은 서비스, 교육, 상담, 운영에서 중요해집니다.",
    aiDirection: "AI를 사람을 대신하는 도구보다 대화 준비, 기록 정리, 선택지 비교를 돕는 보조 도구로 쓰는 편이 맞습니다.",
    nextAction: "최근 사람 사이에서 풀었던 문제 하나를 적고, 내가 한 조율이 무엇이었는지 정리해보세요.",
    broadAlternative: "맥락 해석자 쪽으로 넓히면 사람 사이에서 생긴 장면을 설명 가능한 기준으로 바꿀 수 있습니다.",
    residualSurface: "신뢰를 만드는 말, 갈등을 낮추는 선택, 사람의 맥락을 읽는 힘은 AI 이후에도 남습니다.",
    sevenDayAction: "최근 조율했던 장면 1개를 골라 상황, 사람의 감정, 내가 한 조율, 결과를 적어보세요.",
  },
};
