import type { HistoryRoadmapInput, HistoryRoadmapResult } from "@/lib/history-roadmap";

type FieldProfile = {
  lens: string;
  connection: string;
  topicAngles: string[];
  questionFocus: string[];
};

type UnitProfile = {
  unit: HistoryRoadmapResult["summary"]["historyUnit"];
  concepts: string[];
  anchors: string[];
};

const fieldProfiles: Record<string, FieldProfile> = {
  인문사회: {
    lens: "사회 구조와 사람들의 생각이 어떻게 바뀌었는지 읽는 관점",
    connection: "인문사회 계열은 사건을 외우는 데서 멈추지 않고, 당시 사람들의 선택과 제도 변화가 사회에 어떤 의미를 남겼는지 해석하는 힘이 중요합니다.",
    topicAngles: ["사회 질서 변화", "사상과 가치관", "공동체 갈등", "문화 교류", "역사 서술 관점"],
    questionFocus: ["사람들은 왜 그렇게 판단했는가", "제도는 누구에게 유리했는가", "오늘의 사회 문제와 어떤 점이 이어지는가"],
  },
  교육: {
    lens: "배움, 제도, 세대 변화가 사람의 가능성을 어떻게 열거나 막았는지 보는 관점",
    connection: "교육 진로는 지식 전달보다 사람의 성장 환경을 설계하는 일과 연결됩니다. 한국사 속 교육 제도와 인재 선발 방식을 보면 교육의 역할을 구체적으로 탐구할 수 있습니다.",
    topicAngles: ["교육 제도", "인재 선발", "신분과 배움", "문해력과 기록", "학교와 시민 형성"],
    questionFocus: ["누가 배움의 기회를 얻었는가", "교육은 사회 이동을 도왔는가", "오늘날 교육과 비교하면 무엇이 달라졌는가"],
  },
  경영경제: {
    lens: "생산, 유통, 세금, 시장 변화가 사람들의 선택을 어떻게 바꿨는지 보는 관점",
    connection: "경영경제 계열은 자원 배분과 제도 변화가 개인과 조직의 행동을 어떻게 바꾸는지 읽는 힘이 필요합니다. 한국사의 경제 제도는 좋은 탐구 재료가 됩니다.",
    topicAngles: ["조세 제도", "상업 발달", "시장과 화폐", "노동과 생산", "국가 재정"],
    questionFocus: ["경제 제도는 누구의 행동을 바꾸었는가", "시장은 어떻게 성장했는가", "정책의 의도와 결과는 같았는가"],
  },
  법정치: {
    lens: "법, 권력, 권리, 국가 운영 원리가 어떻게 작동했는지 보는 관점",
    connection: "법정치 계열은 제도가 현실에서 어떻게 적용되고, 권리와 질서가 어떻게 충돌하는지 분석하는 힘이 중요합니다. 한국사 속 법과 정치 구조가 직접 연결됩니다.",
    topicAngles: ["통치 제도", "법과 형벌", "권리와 의무", "개혁 정치", "국가와 시민"],
    questionFocus: ["권력은 어떻게 견제되었는가", "법은 질서 유지와 권리 보호 중 어디에 가까웠는가", "개혁은 왜 성공하거나 실패했는가"],
  },
  보건의료: {
    lens: "질병, 위생, 돌봄, 생명 보호가 사회 제도와 어떻게 연결되는지 보는 관점",
    connection: "보건의료 진로는 개인의 치료뿐 아니라 사회 전체의 건강 환경을 이해해야 합니다. 한국사 속 위생, 의료, 구휼 제도는 진로와 자연스럽게 연결됩니다.",
    topicAngles: ["공중보건", "질병과 위생", "의료 제도", "구휼과 돌봄", "건강권"],
    questionFocus: ["건강 문제는 개인 문제였는가 사회 문제였는가", "의료 제도는 누구에게 열려 있었는가", "통제와 보호는 어떻게 구분되는가"],
  },
  공학기술: {
    lens: "기술, 건축, 도구, 교통이 사회 문제를 어떻게 해결했는지 보는 관점",
    connection: "공학기술 진로는 기술 자체보다 기술이 해결하려는 문제를 읽는 힘이 중요합니다. 한국사의 과학기술과 건축, 교통 변화는 좋은 탐구 출발점입니다.",
    topicAngles: ["과학기술", "건축과 도시", "교통과 통신", "도구와 생산성", "기술 수용"],
    questionFocus: ["기술은 어떤 문제를 해결했는가", "누가 기술의 혜택을 받았는가", "기술 변화는 사회 구조를 어떻게 바꾸었는가"],
  },
  자연과학: {
    lens: "관찰, 기록, 자연 이해가 국가 운영과 생활에 어떻게 쓰였는지 보는 관점",
    connection: "자연과학 계열은 자료를 관찰하고 근거로 설명하는 태도가 중요합니다. 한국사 속 천문, 농업, 의학, 지리 지식은 탐구 주제가 될 수 있습니다.",
    topicAngles: ["천문과 역법", "농업 기술", "지리와 환경", "의학 지식", "관찰과 기록"],
    questionFocus: ["자연 지식은 왜 필요했는가", "관찰 기록은 정책에 어떻게 쓰였는가", "과학 지식은 생활을 어떻게 바꾸었는가"],
  },
  문화예술: {
    lens: "이미지, 건축, 문학, 공연이 시대의 가치와 감정을 어떻게 드러내는지 보는 관점",
    connection: "문화예술 진로는 표현의 형식과 사회적 맥락을 함께 읽어야 합니다. 한국사 속 예술과 기록물은 진로를 설명하는 좋은 자료가 됩니다.",
    topicAngles: ["예술 표현", "건축미", "기록 문화", "대중문화", "시대 감정"],
    questionFocus: ["표현 방식은 시대의 무엇을 보여주는가", "예술은 권력과 어떻게 연결되었는가", "대중은 어떤 문화를 소비했는가"],
  },
  미디어콘텐츠: {
    lens: "기록, 전달, 여론, 이미지가 사람들의 인식에 어떤 영향을 줬는지 보는 관점",
    connection: "미디어콘텐츠 진로는 정보를 어떻게 구성하고 전달하는지 이해해야 합니다. 한국사 속 기록물, 신문, 선전, 여론 형성 과정과 연결할 수 있습니다.",
    topicAngles: ["기록과 전달", "신문과 여론", "선전과 검열", "이미지 정치", "콘텐츠 재해석"],
    questionFocus: ["누가 어떤 정보를 전달했는가", "매체는 여론을 어떻게 바꾸었는가", "이미지는 역사 인식을 어떻게 만들었는가"],
  },
  군사안보: {
    lens: "위기 대응, 질서 유지, 안보 판단이 국가와 공동체를 어떻게 움직였는지 보는 관점",
    connection: "군사안보 진로는 힘의 사용보다 위기 판단, 책임, 공동체 보호의 기준을 이해하는 것이 중요합니다. 한국사의 전쟁, 치안, 외교 위기가 직접 연결됩니다.",
    topicAngles: ["국방 체제", "전쟁과 외교", "치안과 질서", "위기 대응", "공동체 보호"],
    questionFocus: ["위기는 어떻게 인식되었는가", "국가는 어떤 방식으로 대응했는가", "안보와 권리는 어디서 충돌했는가"],
  },
  복지상담: {
    lens: "취약한 사람을 사회가 어떻게 바라보고 돌보았는지 보는 관점",
    connection: "복지상담 진로는 개인의 어려움을 사회적 조건과 함께 보는 힘이 필요합니다. 한국사 속 구휼, 공동체, 가족 제도는 진로와 잘 이어집니다.",
    topicAngles: ["구휼 제도", "공동체 돌봄", "가족과 신분", "사회적 약자", "회복과 지원"],
    questionFocus: ["누가 도움을 받을 수 있었는가", "돌봄은 개인 책임이었는가 공동체 책임이었는가", "제도 밖 사람들은 어떻게 살아갔는가"],
  },
  "아직 모름": {
    lens: "진로를 정하기 전에 역사 속 문제 해결 방식을 비교해 보는 관점",
    connection: "희망 진로가 아직 선명하지 않아도 괜찮습니다. 한국사 속 여러 문제를 비교하면 내가 관심을 느끼는 역할과 질문을 발견할 수 있습니다.",
    topicAngles: ["문제 해결 방식", "사람과 제도", "기술과 사회", "권리와 책임", "공동체 변화"],
    questionFocus: ["나는 어떤 문제에 관심이 가는가", "어떤 역할이 가장 중요해 보이는가", "오늘의 나와 연결되는 지점은 무엇인가"],
  },
};

const unitProfiles: Record<string, UnitProfile> = {
  "선사와 고대": {
    unit: "선사와 고대",
    concepts: ["농경", "계급 발생", "고조선", "삼국의 성장", "율령", "불교 수용", "골품제"],
    anchors: ["농경 사회의 형성", "국가와 신분 질서", "삼국의 통치 체제", "불교와 문화 교류"],
  },
  고려: {
    unit: "고려",
    concepts: ["문벌 사회", "과거제", "불교", "대외 교류", "무신 정권", "향리", "팔만대장경"],
    anchors: ["과거제와 인재 선발", "불교와 사회 통합", "대외 교류와 문화", "전쟁과 기록 문화"],
  },
  "조선 전기": {
    unit: "조선 전기",
    concepts: ["유교 통치", "경국대전", "의정부", "집현전", "훈민정음", "과학 기술", "향촌 질서"],
    anchors: ["유교 국가의 설계", "법전과 행정 체계", "훈민정음과 지식 확산", "과학기술과 국가 운영"],
  },
  "조선 후기": {
    unit: "조선 후기",
    concepts: ["실학", "상업 발달", "대동법", "탕평책", "서민 문화", "향촌 질서", "신분제 동요", "천주교 수용"],
    anchors: ["상업과 시장의 성장", "수취 제도 개편", "실학의 문제의식", "서민 문화와 사회 변화"],
  },
  개항기: {
    unit: "개항기",
    concepts: ["개항", "갑신정변", "동학농민운동", "갑오개혁", "독립협회", "근대 문물", "주권 수호", "선교", "근대 교육"],
    anchors: ["근대 국가 만들기", "개혁과 저항", "외세와 주권", "근대 문물의 수용", "선교와 교육·의료 활동"],
  },
  일제강점기: {
    unit: "일제강점기",
    concepts: ["식민지 지배", "무단 통치", "문화 통치", "민족 운동", "수탈", "위생 경찰", "강제 동원", "3·1운동", "신사참배"],
    anchors: ["식민지 지배 정책", "독립운동과 사회 변화", "수탈과 통제", "근대 제도의 양면성", "종교계의 민족운동"],
  },
  "광복과 대한민국 정부 수립": {
    unit: "광복과 대한민국 정부 수립",
    concepts: ["광복", "좌우 합작", "대한민국 정부 수립", "제헌 헌법", "분단", "한국 전쟁", "국가 재건"],
    anchors: ["해방 이후 국가 건설", "헌법과 시민", "분단과 전쟁", "정부 수립 과정"],
  },
  "산업화와 민주화": {
    unit: "산업화와 민주화",
    concepts: ["산업화", "도시화", "새마을 운동", "노동 운동", "민주화 운동", "6월 민주 항쟁", "시민 사회"],
    anchors: ["경제 성장과 사회 변화", "노동과 도시 생활", "민주주의의 확대", "시민 참여와 권리"],
  },
};

type FieldKey = keyof typeof fieldProfiles;
type UnitKey = keyof typeof unitProfiles;

type CareerProfile = {
  keywords: string[];
  field: FieldKey;
  preferredUnit: UnitKey;
  lens: string;
  connection: string;
  topicAngles: string[];
  historyConcepts: string[];
  unitAnchors: Partial<Record<UnitKey, string[]>>;
  researchQuestions: string[];
  sourceKeywords: string[];
};

const careerProfiles: CareerProfile[] = [
  {
    keywords: ["목사", "목회", "목회자", "전도사", "신학", "교회", "선교", "사역", "종교", "종교지도자"],
    field: "복지상담",
    preferredUnit: "일제강점기",
    lens: "종교 지도자가 공동체의 불안, 양심, 돌봄, 공적 책임을 어떻게 감당했는지 보는 관점",
    connection:
      "목회·신학 진로는 단순한 종교 지식보다 공동체를 돌보고, 갈등 상황에서 말과 행동의 책임을 세우는 힘이 중요합니다. 한국사에서는 종교계의 민족운동, 교육·구호 활동, 양심의 자유 문제를 통해 이 진로를 자연스럽게 탐구할 수 있습니다.",
    topicAngles: ["공동체 돌봄", "양심과 신앙", "종교계 민족운동", "교육·구호 활동", "공적 책임"],
    historyConcepts: ["3·1운동", "민족대표 33인", "종교계 민족운동", "신사참배", "양심의 자유", "선교", "근대 교육"],
    unitAnchors: {
      일제강점기: ["3·1운동과 종교계의 참여", "신사참배 강요와 양심의 자유", "종교 공동체의 교육·구호 활동", "식민지 통제와 신앙 공동체"],
      개항기: ["선교와 근대 교육·의료 활동", "근대 문물 수용과 종교 공동체", "개항 이후 새로운 사상의 확산", "공동체 돌봄 방식의 변화"],
      "조선 후기": ["천주교 수용과 박해", "새로운 사상의 확산", "향촌 질서와 신앙 공동체", "신분 질서 속 양심의 문제"],
      "광복과 대한민국 정부 수립": ["해방 이후 종교계의 사회 참여", "국가 건설과 시민 윤리", "분단과 공동체 회복", "전쟁 이후 구호와 돌봄"],
      "산업화와 민주화": ["민주화 운동과 종교계의 역할", "도시화 속 공동체 돌봄", "노동·인권 문제와 종교 윤리", "시민 사회와 공적 책임"],
    },
    researchQuestions: [
      "종교 지도자는 공동체가 위기에 놓였을 때 어디까지 공적 책임을 져야 하는가?",
      "국가 권력과 개인의 양심이 충돌할 때 종교 공동체는 어떤 선택을 했는가?",
      "오늘날 목회·신학 진로는 역사 속 종교계의 선택에서 어떤 책임 기준을 배울 수 있는가?",
    ],
    sourceKeywords: ["3·1운동 종교계", "민족대표 33인 종교", "신사참배 강요", "개항기 선교 근대 교육", "종교계 민족운동"],
  },
];

const unitRecommendationByField: Record<string, keyof typeof unitProfiles> = {
  보건의료: "일제강점기",
  법정치: "광복과 대한민국 정부 수립",
  교육: "조선 전기",
  경영경제: "조선 후기",
  공학기술: "조선 전기",
  자연과학: "조선 전기",
  문화예술: "조선 후기",
  미디어콘텐츠: "일제강점기",
  군사안보: "개항기",
  복지상담: "조선 후기",
  인문사회: "조선 후기",
  "아직 모름": "조선 후기",
};

function resolveCareerProfile(career: string) {
  const normalizedCareer = career.toLowerCase();

  return careerProfiles.find(({ keywords }) =>
    keywords.some((keyword) => normalizedCareer.includes(keyword.toLowerCase())),
  );
}

function resolveEffectiveField(input: HistoryRoadmapInput, careerProfile?: CareerProfile) {
  if (input.field === "아직 모름" && careerProfile) {
    return careerProfile.field;
  }

  return input.field;
}

function resolveUnit(input: HistoryRoadmapInput, fieldKey: string, careerProfile?: CareerProfile) {
  if (input.historyUnit !== "전체 단원에서 추천") {
    return unitProfiles[input.historyUnit];
  }

  if (careerProfile) {
    return unitProfiles[careerProfile.preferredUnit];
  }

  return unitProfiles[unitRecommendationByField[fieldKey] ?? "조선 후기"];
}

function compactCareer(career: string) {
  return career.trim().replace(/\s+/g, " ");
}

function getCareerAnchors(unit: UnitProfile, careerProfile?: CareerProfile) {
  return careerProfile?.unitAnchors[unit.unit] ?? unit.anchors;
}

function makeCareerSpecificTopics(
  career: string,
  careerProfile: CareerProfile,
  unit: UnitProfile,
  assignmentType: string,
) {
  const anchors = getCareerAnchors(unit, careerProfile);
  const topicType = assignmentType === "아직 모름" ? "탐구" : assignmentType;

  return [
    {
      title: `${unit.unit} ${anchors[0]}: ${career}의 공적 책임 탐구`,
      shortReason: `${career} 진로의 핵심인 ${careerProfile.topicAngles[4]}을 역사 사례와 연결해 ${topicType} 주제로 쓰기 좋습니다.`,
    },
    {
      title: `${unit.unit} ${anchors[1]}: ${career} 진로로 본 양심과 권력의 충돌`,
      shortReason: `${careerProfile.topicAngles[1]} 문제를 한국사 사건 속에서 구체적으로 비교할 수 있습니다.`,
    },
    {
      title: `${unit.unit} ${anchors[2] ?? unit.anchors[0]}: 종교 공동체는 사람을 어떻게 돌보았는가`,
      shortReason: `${career}가 맡는 돌봄과 상담 역할을 역사 속 공동체 활동으로 설명할 수 있습니다.`,
    },
    {
      title: `${unit.unit} ${unit.concepts[0]}·${careerProfile.historyConcepts[0]}: 신앙 공동체의 선택 분석`,
      shortReason: `교과 개념을 먼저 확인한 뒤 ${career} 진로의 판단 기준으로 해석할 수 있어 억지 연결을 줄입니다.`,
    },
    {
      title: `${unit.unit} 자료로 보는 ${career}의 말·기록·공동체 리더십`,
      shortReason: `설교, 기록, 교육, 구호처럼 말과 실천이 공동체에 미친 영향을 탐구할 수 있습니다.`,
    },
  ];
}

function makeTopics(
  career: string,
  field: FieldProfile,
  unit: UnitProfile,
  assignmentType: string,
  careerProfile?: CareerProfile,
) {
  if (careerProfile) {
    return makeCareerSpecificTopics(career, careerProfile, unit, assignmentType);
  }

  const anchors = unit.anchors;
  const angles = field.topicAngles;
  const topicType = assignmentType === "아직 모름" ? "탐구" : assignmentType;

  return [
    {
      title: `${unit.unit} ${anchors[0]}: ${career} 진로의 문제의식`,
      shortReason: `${topicType}에서 단원 핵심 개념과 ${career} 진로를 가장 자연스럽게 연결할 수 있습니다.`,
    },
    {
      title: `${unit.unit} ${anchors[1]}: ${angles[0]} 관점으로 읽기`,
      shortReason: `${career} 진로가 다루는 판단 기준을 역사 속 제도와 비교해 볼 수 있습니다.`,
    },
    {
      title: `${unit.unit} 핵심 개념 ${unit.concepts[0]}·${unit.concepts[1]}: ${angles[1]} 탐구`,
      shortReason: `교과서 개념을 중심으로 자료를 찾기 쉬워 수행평가 주제로 안정적입니다.`,
    },
    {
      title: `${unit.unit} ${anchors[2]}: 오늘의 ${career}에게 주는 질문`,
      shortReason: `과거 사실을 오늘의 진로 윤리와 역할 질문으로 확장할 수 있습니다.`,
    },
    {
      title: `${unit.unit} 자료로 설계하는 ${career} 진로 탐구`,
      shortReason: `역사 개념, 진로 연결, 개인적 느낀 점을 함께 정리하기 좋습니다.`,
    },
  ];
}

function makeQuestions(career: string, field: FieldProfile, unit: UnitProfile, careerProfile?: CareerProfile) {
  if (careerProfile) {
    return careerProfile.researchQuestions;
  }

  return [
    `${unit.anchors[0]}은 당시 사람들의 삶과 선택을 어떻게 바꾸었는가?`,
    `"${field.questionFocus[1]}"라는 질문을 ${unit.unit} 사례로 설명할 수 있는가?`,
    `${career} 진로 관점에서 ${unit.concepts[0]}·${unit.concepts[1]} 개념은 오늘날 어떤 의미로 다시 읽을 수 있는가?`,
  ];
}

function makeOutline(input: HistoryRoadmapInput, unit: UnitProfile, career: string, careerProfile?: CareerProfile) {
  const assignment = input.assignmentType === "아직 모름" ? "탐구 활동" : input.assignmentType;
  const anchors = getCareerAnchors(unit, careerProfile);

  if (careerProfile) {
    return [
      `${assignment} 주제 선정 이유와 ${career} 진로 관심 소개`,
      `${unit.unit} 단원의 역사적 배경과 ${anchors[0]} 사실 확인`,
      `주요 사례 분석: ${anchors[0]}, ${anchors[1]}`,
      `${career} 진로와 연결되는 책임 기준 정리: ${careerProfile.topicAngles[0]}, ${careerProfile.topicAngles[1]}`,
      "오늘날 진로 관점에서 배울 점, 한계, 다음 탐구 질문 작성",
    ];
  }

  return [
    `${assignment} 주제 선정 이유와 진로 관심 소개`,
    `${unit.unit} 단원의 역사적 배경과 핵심 개념 정리`,
    `주요 사례 분석: ${unit.anchors[0]}, ${unit.anchors[1]}`,
    `${input.career} 진로와 연결되는 판단 기준 정리`,
    "자료 조사 후 결론, 한계, 다음 탐구 질문 작성",
  ];
}

function makeSourceKeywords(career: string, unit: UnitProfile, field: FieldProfile, careerProfile?: CareerProfile) {
  if (careerProfile) {
    return Array.from(
      new Set([
        ...careerProfile.sourceKeywords,
        `${unit.unit} ${careerProfile.historyConcepts[0]}`,
        `${career} ${careerProfile.topicAngles[0]} 한국사`,
      ]),
    ).slice(0, 8);
  }

  return [
    `${unit.unit} ${unit.concepts[0]}`,
    `${unit.unit} ${unit.anchors[0]}`,
    `${unit.concepts[1]} ${field.topicAngles[0]}`,
    `${career} ${field.topicAngles[0]} 역사 탐구`,
    `${unit.unit} ${unit.concepts[2] ?? unit.concepts[0]} 자료`,
  ];
}

function makeWeeklyPlan(career: string, unit: UnitProfile, field: FieldProfile, careerProfile?: CareerProfile) {
  const sourceKeywords = makeSourceKeywords(career, unit, field, careerProfile);
  const anchors = getCareerAnchors(unit, careerProfile);
  const questionFocus = careerProfile?.researchQuestions[0] ?? field.questionFocus[1];
  const conceptA = careerProfile?.historyConcepts[0] ?? unit.concepts[0];
  const conceptB = careerProfile?.historyConcepts[1] ?? unit.concepts[1];

  return [
    {
      week: "1주차",
      stage: "자료 수집",
      focus: "주제를 바로 쓰기 전에 단원 개념과 사실관계를 먼저 고정합니다.",
      actions: [
        `우리역사넷에서 "${sourceKeywords[0]}" 검색하기`,
        `한국민족문화대백과에서 "${unit.concepts[1]}" 개념 확인하기`,
        "교과서 또는 수업 안내문에서 제출 조건과 단원 범위 표시하기",
      ],
      output: "핵심 자료 3개와 각 자료에서 확인한 사실 1문장씩",
    },
    {
      week: "2주차",
      stage: "탐구 질문 심화",
      focus: "좋아 보이는 주제를 질문으로 쪼개서 억지 진로 연결을 줄입니다.",
      actions: [
        `"${anchors[0]}"의 원인과 결과를 각각 한 줄로 정리하기`,
        `"${questionFocus}" 질문에 답할 사례 2개 찾기`,
        `${career} 진로와 연결되는 판단 기준을 3개 단어로 뽑기`,
      ],
      output: "상위 질문 1개와 하위 질문 3개",
    },
    {
      week: "3주차",
      stage: "보고서 작성",
      focus: "역사 사실, 진로 연결, 내 생각이 섞이지 않도록 목차별로 분리합니다.",
      actions: [
        "주제 선정 이유를 진로 관심과 연결해 5문장으로 쓰기",
        `${conceptA}·${conceptB} 개념을 본문에 각각 1번 이상 사용하기`,
        "마지막 문단에 오늘의 진로 관점에서 배운 점 쓰기",
      ],
      output: "5단계 목차를 채운 보고서 초안",
    },
    {
      week: "4주차",
      stage: "발표·제출",
      focus: "발표는 정보를 많이 넣기보다, 왜 이 주제가 내 진로와 이어지는지를 설득합니다.",
      actions: [
        "발표 첫 문장을 문제 제기형으로 바꾸기",
        "예상 질문 3개와 답변 키워드 준비하기",
        "세특 방향 예시가 실제 활동 기록과 맞는지 점검하기",
      ],
      output: "발표 제목, 1분 발표 뼈대, 예상 질문 3개",
    },
  ];
}

export function generateHistoryRoadmap(input: HistoryRoadmapInput): HistoryRoadmapResult {
  const career = compactCareer(input.career);
  const careerProfile = resolveCareerProfile(career);
  const fieldKey = resolveEffectiveField(input, careerProfile);
  const field = fieldProfiles[fieldKey] ?? fieldProfiles["아직 모름"];
  const unit = resolveUnit(input, fieldKey, careerProfile);
  const recommendedTopics = makeTopics(career, field, unit, input.assignmentType, careerProfile);
  const bestTopic = recommendedTopics[0];
  const concepts = Array.from(
    new Set([
      ...(careerProfile?.historyConcepts ?? []),
      ...unit.concepts.slice(0, 5),
      ...(careerProfile?.topicAngles ?? field.topicAngles).slice(0, 2),
    ]),
  ).slice(0, 7);
  const sourceKeywords = makeSourceKeywords(career, unit, field, careerProfile);
  const lens = careerProfile?.lens ?? field.lens;
  const connection = careerProfile?.connection ?? field.connection;

  return {
    summary: {
      grade: input.grade,
      career,
      field: fieldKey,
      historyUnit: unit.unit,
      assignmentType: input.assignmentType,
    },
    recommendedTopics,
    bestTopic: {
      title: bestTopic.title,
      reason: `${career} 진로의 핵심 관심을 ${unit.unit} 단원의 "${getCareerAnchors(unit, careerProfile)[0]}" 흐름과 연결할 수 있습니다. 역사적 사실을 먼저 확인한 뒤, ${lens}으로 해석하면 억지 연결을 피하면서도 수행평가에 바로 쓸 수 있는 탐구 구조가 만들어집니다.`,
    },
    careerConnection: connection,
    historyConcepts: concepts,
    researchQuestions: makeQuestions(career, field, unit, careerProfile),
    reportOutline: makeOutline(input, unit, career, careerProfile),
    presentationTitle: `${unit.unit} ${getCareerAnchors(unit, careerProfile)[0]}: ${career}의 역할 다시 읽기`,
    seteukDirection: `${unit.unit} 단원의 ${concepts[0]}, ${concepts[1]} 관련 자료를 조사하고, 이를 ${career} 진로의 관점에서 해석하는 방향으로 활동을 정리할 수 있습니다. 완성된 세특 문장을 대신 쓰기보다, 자료 확인-질문 설정-진로 연결-느낀 점의 흐름을 남기는 것이 좋습니다.`,
    nextSteps: [
      `우리역사넷에서 "${sourceKeywords[0]}" 또는 "${getCareerAnchors(unit, careerProfile)[0]}" 키워드로 자료 2개 찾기`,
      `한국민족문화대백과에서 "${concepts[1]}" 개념을 확인하고 한 문장으로 정리하기`,
      `${career} 진로와 연결되는 판단 기준을 "당시 상황-오늘의 의미-내 생각" 3칸 표로 작성하기`,
    ],
    weeklyPlan: makeWeeklyPlan(career, unit, field, careerProfile),
    sourceKeywords,
    caution:
      "이 결과는 자동 탐구 설계 초안입니다. 실제 제출 전에는 교과서, 수업 안내문, 공신력 있는 역사 자료로 사실관계를 확인해야 하며, 세특 문장은 실제 수업 활동과 교사의 판단에 따라 달라질 수 있습니다.",
  };
}
