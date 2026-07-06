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
    concepts: ["농경", "계급 발생", "고조선", "삼국의 성장", "율령", "불교 수용", "골품제", "화랑도"],
    anchors: ["농경 사회의 형성", "국가와 신분 질서", "삼국의 통치 체제", "불교와 문화 교류", "화랑도와 공동체 수련"],
  },
  고려: {
    unit: "고려",
    concepts: ["문벌 사회", "과거제", "불교", "대외 교류", "무신 정권", "향리", "팔만대장경"],
    anchors: ["과거제와 인재 선발", "불교와 사회 통합", "대외 교류와 문화", "전쟁과 기록 문화"],
  },
  "조선 전기": {
    unit: "조선 전기",
    concepts: ["유교 통치", "경국대전", "의정부", "집현전", "훈민정음", "과학 기술", "향촌 질서", "측우기", "성균관"],
    anchors: ["유교 국가의 설계", "법전과 행정 체계", "훈민정음과 지식 확산", "과학기술과 국가 운영", "교육과 인재 양성"],
  },
  "조선 후기": {
    unit: "조선 후기",
    concepts: ["실학", "상업 발달", "대동법", "탕평책", "서민 문화", "향촌 질서", "신분제 동요", "천주교 수용"],
    anchors: ["상업과 시장의 성장", "수취 제도 개편", "실학의 문제의식", "서민 문화와 사회 변화"],
  },
  개항기: {
    unit: "개항기",
    concepts: ["개항", "갑신정변", "동학농민운동", "갑오개혁", "독립협회", "근대 문물", "주권 수호", "선교", "근대 교육", "신문", "교통·통신"],
    anchors: ["근대 국가 만들기", "개혁과 저항", "외세와 주권", "근대 문물의 수용", "선교와 교육·의료 활동", "신문과 근대적 여론"],
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
    concepts: ["산업화", "도시화", "새마을 운동", "노동 운동", "민주화 운동", "6월 민주 항쟁", "시민 사회", "대중문화", "정보화", "여가 문화"],
    anchors: ["경제 성장과 사회 변화", "노동과 도시 생활", "민주주의의 확대", "시민 참여와 권리", "대중문화와 정보화"],
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
  roleFocus: string;
  tensionFocus: string;
  socialQuestion: string;
  practiceFocus: string;
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
    roleFocus: "공적 책임",
    tensionFocus: "양심과 권력의 충돌",
    socialQuestion: "종교 공동체는 사람을 어떻게 돌보았는가",
    practiceFocus: "말·기록·공동체 리더십",
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
  {
    keywords: ["간호", "의사", "약사", "물리치료", "응급구조", "보건", "치위생", "치과", "수의사", "임상병리", "방사선사", "작업치료"],
    field: "보건의료",
    preferredUnit: "일제강점기",
    lens: "생명 보호, 질병 관리, 공중보건이 국가 제도와 사람들의 삶에 어떤 영향을 주었는지 보는 관점",
    connection:
      "보건의료 진로는 개인의 치료뿐 아니라 사회 전체의 건강 환경을 이해해야 합니다. 한국사에서는 위생 정책, 의료 접근성, 구휼 제도, 건강권 문제를 통해 진로와 단원을 자연스럽게 연결할 수 있습니다.",
    roleFocus: "생명 보호와 공중보건",
    tensionFocus: "보호와 통제의 경계",
    socialQuestion: "질병과 위생 문제는 개인 책임인가 사회 책임인가",
    practiceFocus: "자료 기반 건강 문제 해석",
    topicAngles: ["공중보건", "질병과 위생", "의료 접근성", "구휼과 돌봄", "건강권"],
    historyConcepts: ["위생 경찰", "공중보건", "의료 제도", "구휼", "건강권", "제중원", "식민지 위생 정책"],
    unitAnchors: {
      일제강점기: ["위생 경찰과 식민지 공중보건", "감염병 관리와 사회 통제", "의료 접근성과 민족 차별", "건강권의 역사"],
      개항기: ["근대 의료와 제중원", "선교 의료와 근대 문물", "개항 이후 질병 관리", "의료 제도의 변화"],
      "조선 후기": ["구휼 제도와 공동체 돌봄", "질병과 민간 치료", "향촌 사회의 돌봄 방식", "국가와 백성의 생명 보호"],
    },
    researchQuestions: [
      "공중보건 정책은 사람을 보호하는 장치였는가, 통제하는 장치였는가?",
      "의료 제도와 돌봄은 누구에게 열려 있었고 누구에게 닫혀 있었는가?",
      "오늘날 보건의료인은 역사 속 건강 문제에서 어떤 책임 기준을 배울 수 있는가?",
    ],
    sourceKeywords: ["위생 경찰", "일제강점기 공중보건", "제중원 근대 의료", "구휼 제도", "식민지 위생 정책"],
  },
  {
    keywords: ["변호", "판사", "검사", "법조", "경찰", "공무원", "행정", "정치", "외교", "국회의원", "변리사", "노무사"],
    field: "법정치",
    preferredUnit: "광복과 대한민국 정부 수립",
    lens: "법, 권력, 권리, 절차가 실제 사회에서 누구를 보호하고 무엇을 제한했는지 보는 관점",
    connection:
      "법·공공 진로는 규칙을 아는 것에서 멈추지 않고, 제도가 현실에서 어떻게 작동하는지 판단해야 합니다. 한국사의 개혁, 헌법, 독립운동, 국가 수립 과정은 권리와 질서를 함께 탐구하기 좋습니다.",
    roleFocus: "권리 보호와 공정한 절차",
    tensionFocus: "질서 유지와 권리 보호의 균형",
    socialQuestion: "법과 제도는 누구를 보호했는가",
    practiceFocus: "법·제도 해석과 근거 제시",
    topicAngles: ["법과 제도", "권리와 의무", "국가 운영", "개혁과 저항", "시민권"],
    historyConcepts: ["제헌 헌법", "대한민국 정부 수립", "독립협회", "갑오개혁", "치안", "민주주의", "시민권"],
    unitAnchors: {
      "광복과 대한민국 정부 수립": ["제헌 헌법과 시민의 권리", "대한민국 정부 수립과 국가 운영", "분단과 법 질서", "헌법이 약속한 시민권"],
      개항기: ["갑오개혁과 근대 법제", "독립협회와 시민 참여", "주권 수호와 외교 판단", "개혁 정치의 한계"],
      "산업화와 민주화": ["민주화 운동과 시민권 확대", "권위주의와 법의 역할", "노동 운동과 권리 문제", "시민 사회의 성장"],
    },
    researchQuestions: [
      "법과 제도는 질서를 지키는 장치인가, 권리를 보호하는 장치인가?",
      "개혁은 왜 필요한 순간에도 쉽게 성공하지 못했는가?",
      "오늘날 법·공공 진로는 역사 속 제도 변화에서 어떤 판단 기준을 배울 수 있는가?",
    ],
    sourceKeywords: ["제헌 헌법 시민권", "대한민국 정부 수립", "갑오개혁 법제", "독립협회 시민 참여", "민주화 운동 시민권"],
  },
  {
    keywords: ["교사", "선생", "교육", "교수", "유아", "초등", "중등", "사범", "강사", "특수교사"],
    field: "교육",
    preferredUnit: "조선 전기",
    lens: "배움의 기회, 문자, 인재 선발 제도가 사람의 가능성을 어떻게 열거나 막았는지 보는 관점",
    connection:
      "교육 진로는 지식을 전달하는 일만이 아니라 배움의 환경을 설계하는 일입니다. 한국사 속 훈민정음, 과거제, 성균관, 학교 제도는 교육의 공정성과 사회적 역할을 탐구하기 좋습니다.",
    roleFocus: "배움의 기회 설계",
    tensionFocus: "교육 기회의 확대와 제한",
    socialQuestion: "누가 배울 수 있었고 누가 배제되었는가",
    practiceFocus: "학습 환경 설계와 성장 기록",
    topicAngles: ["교육 제도", "문해력", "인재 선발", "신분과 배움", "성장 환경"],
    historyConcepts: ["훈민정음", "집현전", "성균관", "과거제", "서당", "교육 기회", "문해력"],
    unitAnchors: {
      "조선 전기": ["훈민정음과 지식 확산", "집현전과 인재 양성", "과거제와 관료 선발", "유교 국가의 교육 설계"],
      고려: ["과거제와 인재 선발", "문벌 사회와 교육 기회", "불교와 지식 전승", "대외 교류와 학문"],
      "산업화와 민주화": ["교육 확대와 사회 이동", "민주 시민 교육", "도시화와 학교 경험", "세대 변화와 교육"],
    },
    researchQuestions: [
      "교육 제도는 누구에게 기회를 주고 누구를 배제했는가?",
      "문자와 기록은 사람의 성장 가능성을 어떻게 바꾸었는가?",
      "오늘날 교육자는 역사 속 배움의 불평등에서 어떤 기준을 배울 수 있는가?",
    ],
    sourceKeywords: ["훈민정음 지식 확산", "집현전 인재 양성", "과거제 교육 기회", "성균관 조선 교육", "서당 교육"],
  },
  {
    keywords: ["개발", "프로그래머", "엔지니어", "건축", "로봇", "기계", "전기", "컴퓨터", "AI", "데이터", "토목", "도시", "소프트웨어", "앱", "게임개발"],
    field: "공학기술",
    preferredUnit: "조선 전기",
    lens: "기술, 구조, 도구, 시스템이 어떤 사회 문제를 해결하려 했는지 보는 관점",
    connection:
      "공학기술 진로는 기술 자체보다 기술이 해결하려는 문제를 읽는 힘이 중요합니다. 한국사의 과학기술, 건축, 문자, 교통·통신 변화는 문제 해결형 탐구 주제가 됩니다.",
    roleFocus: "문제 해결과 기술 설계",
    tensionFocus: "기술의 혜택과 접근 격차",
    socialQuestion: "기술은 누구의 문제를 해결했는가",
    practiceFocus: "도구·구조·시스템 분석",
    topicAngles: ["과학기술", "건축과 도시", "교통과 통신", "도구와 생산성", "기술 수용"],
    historyConcepts: ["과학 기술", "측우기", "자격루", "훈민정음", "성곽", "교통·통신", "기술 수용"],
    unitAnchors: {
      "조선 전기": ["과학기술과 국가 운영", "훈민정음과 정보 접근성", "측우기와 자료 기반 행정", "건축과 도시 질서"],
      고려: ["대외 교류와 기술 수용", "팔만대장경과 기록 기술", "전쟁과 방어 시설", "건축과 불교 문화"],
      개항기: ["근대 문물과 기술 수용", "교통·통신의 변화", "개항 이후 도시 변화", "기술 도입과 사회 갈등"],
    },
    researchQuestions: [
      "기술은 어떤 문제를 해결하기 위해 만들어졌는가?",
      "새로운 기술의 혜택은 누구에게 먼저 돌아갔는가?",
      "오늘날 공학기술 진로는 역사 속 기술 수용에서 어떤 책임 기준을 배울 수 있는가?",
    ],
    sourceKeywords: ["조선 과학기술", "측우기 자료 행정", "훈민정음 정보 접근성", "교통 통신 개항기", "팔만대장경 기록 기술"],
  },
  {
    keywords: ["경영", "경제", "회계", "창업", "금융", "무역", "세무", "마케터", "사업가", "CEO", "기획자", "MD", "유통", "부동산"],
    field: "경영경제",
    preferredUnit: "조선 후기",
    lens: "생산, 유통, 세금, 시장 변화가 사람들의 선택과 조직 운영을 어떻게 바꾸었는지 보는 관점",
    connection:
      "경영경제 진로는 돈의 흐름만 보는 것이 아니라 제도와 시장이 사람들의 행동을 어떻게 바꾸는지 해석하는 힘이 필요합니다. 조선 후기 상업 발달과 수취 제도 개편은 좋은 탐구 재료입니다.",
    roleFocus: "자원 배분과 시장 판단",
    tensionFocus: "정책 의도와 실제 결과의 차이",
    socialQuestion: "시장 변화는 사람들의 선택을 어떻게 바꾸었는가",
    practiceFocus: "제도·시장·소비 변화 분석",
    topicAngles: ["상업 발달", "조세 제도", "시장과 화폐", "생산과 유통", "조직 운영"],
    historyConcepts: ["대동법", "상업 발달", "화폐 유통", "공인", "보부상", "개항", "무역"],
    unitAnchors: {
      "조선 후기": ["대동법과 상품 화폐 경제", "상업 발달과 시장 확대", "공인과 유통 구조", "수취 제도 개편의 효과"],
      개항기: ["개항과 무역 구조 변화", "근대 문물과 소비 변화", "외세와 경제 주권", "상업 질서의 변화"],
      "산업화와 민주화": ["산업화와 기업 성장", "노동과 생산성", "도시화와 소비 변화", "경제 성장의 명암"],
    },
    researchQuestions: [
      "경제 제도는 사람들의 행동을 어떻게 바꾸었는가?",
      "정책의 의도와 실제 결과는 왜 달라질 수 있는가?",
      "오늘날 경영경제 진로는 역사 속 시장 변화에서 어떤 판단 기준을 배울 수 있는가?",
    ],
    sourceKeywords: ["대동법 상품 화폐 경제", "조선 후기 상업 발달", "공인 유통 구조", "개항 무역 변화", "산업화 기업 성장"],
  },
  {
    keywords: ["유튜브", "PD", "기자", "방송", "콘텐츠", "마케팅", "광고", "웹툰", "프로게이머", "e스포츠", "스트리머", "크리에이터", "게임", "시나리오"],
    field: "미디어콘텐츠",
    preferredUnit: "일제강점기",
    lens: "기록, 전달, 여론, 이미지가 사람들의 인식과 행동을 어떻게 바꾸었는지 보는 관점",
    connection:
      "미디어콘텐츠 진로는 재미있는 표현만이 아니라 정보를 어떻게 구성하고 전달하는지 이해해야 합니다. 한국사 속 신문, 검열, 선전, 대중문화는 콘텐츠 진로와 연결하기 좋습니다.",
    roleFocus: "정보 전달과 여론 형성",
    tensionFocus: "표현의 자유와 검열",
    socialQuestion: "매체는 사람들의 인식을 어떻게 바꾸었는가",
    practiceFocus: "기록·이미지·콘텐츠 구성",
    topicAngles: ["기록과 전달", "여론 형성", "검열과 선전", "이미지 정치", "콘텐츠 재해석"],
    historyConcepts: ["신문", "잡지", "검열", "문화 통치", "민족 운동", "대중문화", "정보화"],
    unitAnchors: {
      일제강점기: ["신문과 잡지를 통한 여론 형성", "문화 통치와 검열", "매체를 통한 민족운동", "기록과 이미지 정치"],
      개항기: ["신문과 근대적 여론", "독립협회와 대중 연설", "근대 문물의 전달", "새로운 정보 유통"],
      "산업화와 민주화": ["대중문화와 정보화", "방송과 시민 사회", "민주화 운동과 기록 매체", "여가 문화의 성장"],
    },
    researchQuestions: [
      "매체는 사건을 전달만 했는가, 사람들의 행동을 바꾸었는가?",
      "검열과 선전은 역사 인식을 어떻게 만들었는가?",
      "오늘날 콘텐츠 제작자는 역사 속 매체 활용에서 어떤 책임 기준을 배울 수 있는가?",
    ],
    sourceKeywords: ["일제강점기 신문 검열", "문화 통치 잡지", "독립신문 여론", "민주화 운동 기록 매체", "대중문화 정보화"],
  },
  {
    keywords: ["디자인", "음악", "미술", "배우", "영화", "연극", "패션", "미용", "헤어", "메이크업", "일러스트", "사진", "무용", "작곡"],
    field: "문화예술",
    preferredUnit: "조선 후기",
    lens: "이미지, 공연, 생활문화가 시대의 감정과 사람들의 욕망을 어떻게 드러냈는지 보는 관점",
    connection:
      "문화예술 진로는 표현 기술보다 표현이 나온 사회적 맥락을 읽는 힘이 중요합니다. 조선 후기 서민 문화, 풍속화, 판소리, 근대 문물은 표현과 시대 변화를 함께 탐구하기 좋습니다.",
    roleFocus: "표현 방식과 시대 감정 읽기",
    tensionFocus: "대중의 취향과 권력의 표현",
    socialQuestion: "예술과 생활문화는 누구의 목소리를 담았는가",
    practiceFocus: "이미지·공연·생활미감 분석",
    topicAngles: ["예술 표현", "생활 미감", "대중문화", "시대 감정", "이미지 해석"],
    historyConcepts: ["서민 문화", "풍속화", "판소리", "한글 소설", "근대 문물", "대중문화", "의복 문화"],
    unitAnchors: {
      "조선 후기": ["서민 문화와 대중의 성장", "풍속화와 생활 표현", "판소리와 한글 소설", "신분제 동요와 문화 변화"],
      개항기: ["근대 문물과 생활문화 변화", "새로운 이미지와 광고", "개항 이후 의복과 도시 문화", "문화 충돌과 수용"],
      "산업화와 민주화": ["대중문화와 여가의 성장", "도시화와 소비문화", "방송과 이미지 문화", "민주화 시대의 예술 표현"],
    },
    researchQuestions: [
      "예술 표현은 시대 사람들의 어떤 감정과 욕망을 보여주는가?",
      "대중문화는 사회 변화와 어떤 관계를 맺었는가?",
      "오늘날 문화예술 진로는 역사 속 표현 방식에서 어떤 관찰 기준을 배울 수 있는가?",
    ],
    sourceKeywords: ["조선 후기 서민 문화", "풍속화 생활 표현", "판소리 한글 소설", "개항기 생활문화", "대중문화 산업화"],
  },
  {
    keywords: ["연구원", "과학자", "생명공학", "화학", "물리", "지구과학", "수학", "천문", "환경", "기상", "농업", "식품공학"],
    field: "자연과학",
    preferredUnit: "조선 전기",
    lens: "관찰, 기록, 측정이 자연을 이해하고 국가와 생활 문제를 해결하는 데 어떻게 쓰였는지 보는 관점",
    connection:
      "자연과학 진로는 근거를 관찰하고 설명하는 태도가 중요합니다. 한국사 속 천문, 역법, 농업, 측우기, 의학 지식은 과학적 사고와 역사 단원을 연결해 줍니다.",
    roleFocus: "관찰과 기록을 통한 설명",
    tensionFocus: "자연 지식과 국가 운영의 관계",
    socialQuestion: "과학 지식은 사람들의 생활을 어떻게 바꾸었는가",
    practiceFocus: "자료 관찰과 근거 기반 설명",
    topicAngles: ["관찰과 기록", "천문과 역법", "농업 기술", "의학 지식", "환경 이해"],
    historyConcepts: ["천문", "역법", "측우기", "농사직설", "의학", "지도", "환경"],
    unitAnchors: {
      "조선 전기": ["천문과 역법의 국가 운영", "측우기와 농업 행정", "농사직설과 생활 지식", "과학기술과 백성의 삶"],
      "조선 후기": ["실학과 관찰 정신", "농업 기술과 생활 개선", "지리 지식과 지도 제작", "의학 지식의 확산"],
      "선사와 고대": ["농경 사회의 형성", "자연환경과 생활 방식", "도구 사용과 생산", "국가 형성과 자원 관리"],
    },
    researchQuestions: [
      "관찰과 기록은 정책과 생활을 어떻게 바꾸었는가?",
      "과학 지식은 누구의 필요를 해결하기 위해 쓰였는가?",
      "오늘날 자연과학 진로는 역사 속 자료 기록에서 어떤 탐구 태도를 배울 수 있는가?",
    ],
    sourceKeywords: ["조선 천문 역법", "측우기 농업 행정", "농사직설 생활 지식", "실학 관찰 정신", "조선 의학 지식"],
  },
  {
    keywords: ["군인", "장교", "부사관", "소방", "경호", "안보", "군무원", "해군", "공군", "육군", "정보보안", "재난"],
    field: "군사안보",
    preferredUnit: "개항기",
    lens: "위기 대응, 안보 판단, 공동체 보호가 국가와 시민의 삶을 어떻게 움직였는지 보는 관점",
    connection:
      "군사안보 진로는 힘의 사용보다 위기를 판단하고 공동체를 보호하는 기준이 중요합니다. 한국사의 전쟁, 의병, 치안, 주권 수호 사례는 안보와 책임을 함께 탐구하게 해 줍니다.",
    roleFocus: "위기 판단과 공동체 보호",
    tensionFocus: "안보와 권리의 균형",
    socialQuestion: "국가는 위기에 어떻게 대응했는가",
    practiceFocus: "위기 대응 체계 분석",
    topicAngles: ["위기 대응", "공동체 보호", "국방 체제", "치안과 질서", "주권 수호"],
    historyConcepts: ["주권 수호", "동학농민운동", "의병", "국방 체제", "전쟁", "치안", "재난 대응"],
    unitAnchors: {
      개항기: ["외세 침략과 주권 수호", "동학농민운동과 국가 대응", "의병 운동과 공동체 보호", "근대 국가의 위기 판단"],
      고려: ["전쟁과 방어 체제", "무신 정권과 군사 권력", "대외 교류와 충돌", "팔만대장경과 위기 극복"],
      "광복과 대한민국 정부 수립": ["분단과 한국 전쟁", "국가 재건과 안보", "정부 수립과 치안", "전쟁 이후 공동체 보호"],
    },
    researchQuestions: [
      "국가와 공동체는 위기를 어떻게 인식하고 대응했는가?",
      "안보를 위한 선택은 개인의 권리와 어디서 충돌했는가?",
      "오늘날 군사안보 진로는 역사 속 위기 대응에서 어떤 책임 기준을 배울 수 있는가?",
    ],
    sourceKeywords: ["개항기 주권 수호", "동학농민운동 국가 대응", "의병 운동", "고려 전쟁 방어 체제", "한국 전쟁 국가 재건"],
  },
  {
    keywords: ["심리상담", "상담사", "사회복지", "복지사", "청소년지도", "직업상담", "재활", "보육", "노인복지", "가족상담"],
    field: "복지상담",
    preferredUnit: "조선 후기",
    lens: "어려움에 놓인 사람을 사회가 어떻게 이해하고 돌보았는지 보는 관점",
    connection:
      "복지상담 진로는 개인의 어려움을 개인 탓으로만 보지 않고 사회적 조건과 함께 읽어야 합니다. 한국사 속 구휼, 공동체, 가족 제도, 노동 문제는 상담과 복지의 관점으로 탐구하기 좋습니다.",
    roleFocus: "취약한 사람을 돕는 제도 설계",
    tensionFocus: "개인 책임과 공동체 책임",
    socialQuestion: "사회는 어려운 사람을 어떻게 바라보았는가",
    practiceFocus: "돌봄 제도와 회복 과정 분석",
    topicAngles: ["구휼 제도", "공동체 돌봄", "사회적 약자", "회복과 지원", "가족과 신분"],
    historyConcepts: ["구휼 제도", "환곡", "향약", "가족 제도", "사회적 약자", "도시화", "노동"],
    unitAnchors: {
      "조선 후기": ["구휼 제도와 공동체 돌봄", "향약과 지역 공동체", "신분제 동요와 사회적 약자", "가족과 생계 문제"],
      "산업화와 민주화": ["도시화와 노동 문제", "산업화 속 가족 변화", "노동 운동과 권리", "시민 사회와 복지 의식"],
      "광복과 대한민국 정부 수립": ["전쟁 이후 구호와 회복", "국가 재건과 취약 계층", "분단과 가족 문제", "공동체 회복"],
    },
    researchQuestions: [
      "어려움에 놓인 사람을 사회는 개인 책임으로 보았는가, 공동체 책임으로 보았는가?",
      "돌봄 제도는 실제로 누구에게 도움이 되었고 어떤 한계가 있었는가?",
      "오늘날 복지상담 진로는 역사 속 돌봄 방식에서 어떤 태도를 배울 수 있는가?",
    ],
    sourceKeywords: ["조선 구휼 제도", "환곡 향약", "산업화 노동 문제", "전쟁 이후 구호", "도시화 가족 변화"],
  },
  {
    keywords: ["승무원", "항공", "관광", "여행", "호텔", "서비스", "가이드", "통역", "외식", "요리", "셰프", "조리", "바리스타", "푸드"],
    field: "경영경제",
    preferredUnit: "개항기",
    lens: "사람, 물자, 문화가 이동하면서 생활과 소비 경험이 어떻게 바뀌었는지 보는 관점",
    connection:
      "관광·서비스·식품 진로는 사람의 경험과 문화적 교류를 설계하는 일과 연결됩니다. 개항기 교류, 근대 문물, 조선 후기 시장과 생활문화는 이동과 서비스 경험을 탐구하기 좋은 단원입니다.",
    roleFocus: "이동·교류·서비스 경험 설계",
    tensionFocus: "교류 확대와 문화 충돌",
    socialQuestion: "사람과 물자의 이동은 생활을 어떻게 바꾸었는가",
    practiceFocus: "교류·소비·생활문화 분석",
    topicAngles: ["대외 교류", "생활문화", "소비 변화", "서비스 경험", "문화 수용"],
    historyConcepts: ["개항", "근대 문물", "교통·통신", "상업 발달", "생활 문화", "대외 교류", "무역"],
    unitAnchors: {
      개항기: ["개항과 사람·물자의 이동", "근대 문물과 생활 변화", "교통·통신의 변화", "문화 충돌과 수용"],
      "조선 후기": ["상업 발달과 시장 확대", "서민 문화와 소비 생활", "보부상과 유통", "생활문화의 변화"],
      고려: ["대외 교류와 문화 수용", "상업과 항구 도시", "외국과의 교류", "음식·문화의 이동"],
    },
    researchQuestions: [
      "사람과 물자의 이동은 생활문화와 소비 경험을 어떻게 바꾸었는가?",
      "새로운 문화가 들어올 때 수용과 충돌은 어떻게 동시에 나타났는가?",
      "오늘날 서비스·관광 진로는 역사 속 교류에서 어떤 관찰 기준을 배울 수 있는가?",
    ],
    sourceKeywords: ["개항 근대 문물", "개항기 교통 통신", "조선 후기 시장 발달", "보부상 유통", "고려 대외 교류"],
  },
  {
    keywords: ["운동선수", "체육", "스포츠", "트레이너", "코치", "태권도", "축구", "야구", "농구", "무도", "체대"],
    field: "군사안보",
    preferredUnit: "선사와 고대",
    lens: "신체 수련, 규율, 리더십이 공동체 보호와 성장에 어떤 의미를 가졌는지 보는 관점",
    connection:
      "체육·스포츠 진로는 개인의 기량뿐 아니라 훈련, 규율, 팀워크, 공동체 기여와 연결됩니다. 한국사 속 화랑도, 전쟁과 수련 문화, 시민 사회의 스포츠·여가 변화는 진로와 연결할 수 있습니다.",
    roleFocus: "훈련과 공동체 기여",
    tensionFocus: "개인의 능력과 공동체 규율",
    socialQuestion: "신체 수련은 공동체에서 어떤 의미를 가졌는가",
    practiceFocus: "훈련 문화와 리더십 분석",
    topicAngles: ["신체 수련", "규율과 팀워크", "공동체 보호", "리더십", "여가 문화"],
    historyConcepts: ["화랑도", "삼국의 성장", "국가와 신분 질서", "무예", "공동체 규율", "대중문화", "여가 문화"],
    unitAnchors: {
      "선사와 고대": ["화랑도와 공동체 수련", "삼국의 성장과 인재 양성", "국가와 신분 질서", "전쟁과 공동체 보호"],
      고려: ["무신 정권과 군사 문화", "전쟁과 방어 체제", "무예와 권력", "공동체 위기 대응"],
      "산업화와 민주화": ["대중문화와 여가의 성장", "도시화와 스포츠 문화", "국가 정체성과 스포츠", "시민 사회와 여가"],
    },
    researchQuestions: [
      "신체 수련은 개인 능력 향상만을 위한 것이었는가, 공동체 역할과도 연결되었는가?",
      "규율과 팀워크는 역사 속 공동체에서 어떤 의미를 가졌는가?",
      "오늘날 체육·스포츠 진로는 역사 속 수련 문화에서 어떤 태도를 배울 수 있는가?",
    ],
    sourceKeywords: ["화랑도 공동체 수련", "삼국 인재 양성", "무신 정권 군사 문화", "도시화 스포츠 문화", "여가 문화 산업화"],
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
      title: `${unit.unit} ${anchors[0]}: ${career}의 ${careerProfile.roleFocus} 탐구`,
      shortReason: `${career} 진로의 핵심인 ${careerProfile.roleFocus}을 역사 사례와 연결해 ${topicType} 주제로 쓰기 좋습니다.`,
    },
    {
      title: `${unit.unit} ${anchors[1]}: ${career} 진로로 본 ${careerProfile.tensionFocus}`,
      shortReason: `${careerProfile.tensionFocus} 문제를 한국사 사건 속에서 구체적으로 비교할 수 있습니다.`,
    },
    {
      title: `${unit.unit} ${anchors[2] ?? unit.anchors[0]}: ${careerProfile.socialQuestion}`,
      shortReason: `${career}가 맡는 역할을 역사 속 사회 문제와 연결해 설명할 수 있습니다.`,
    },
    {
      title: `${unit.unit} ${unit.concepts[0]}·${careerProfile.historyConcepts[0]}: ${career}의 판단 기준 분석`,
      shortReason: `교과 개념을 먼저 확인한 뒤 ${career} 진로의 판단 기준으로 해석할 수 있어 억지 연결을 줄입니다.`,
    },
    {
      title: `${unit.unit} 자료로 보는 ${career}의 ${careerProfile.practiceFocus}`,
      shortReason: `${careerProfile.practiceFocus}이 사람과 사회에 미친 영향을 탐구할 수 있습니다.`,
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
