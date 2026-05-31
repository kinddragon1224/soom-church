import type { AudienceTrackType } from "@/components/diagnosis/diagnosis-data";

export type SampleReportPreview = {
  track: AudienceTrackType;
  label: string;
  title: string;
  fictionalInput: string;
  oneLineDiagnosis: string;
  blocker: string;
  avoid: string[];
  directions: string[];
  actions: string[];
  proofNote: string;
};

export const sampleReportPreviews: SampleReportPreview[] = [
  {
    track: "student_parent",
    label: "학생/부모 샘플",
    title: "고1 아이의 과목 선택과 활동 방향 정리",
    fictionalInput: "수학은 버겁지만 생명/환경 이슈에는 오래 몰입하는 고1. 부모는 의대/공대가 아니면 불안하다고 느끼는 상황.",
    oneLineDiagnosis: "아이는 직업명보다 오래 붙잡을 문제 주제를 먼저 잡아야 하는 단계입니다.",
    blocker: "부모의 불안이 과목 선택을 빠르게 압박하면서, 아이가 버틸 환경과 탐색 순서가 분리되어 있습니다.",
    avoid: ["성적이 조금 나오는 과목만으로 진로를 고정하기", "부모가 원하는 직업명을 먼저 정하고 활동을 끼워 맞추기"],
    directions: ["생명·환경·지역 문제를 연결한 탐구 활동", "데이터를 얹은 과학 글쓰기/발표", "보건·환경·교육을 비교하는 진로 탐색"],
    actions: ["이번 주 아이가 오래 이야기하는 문제 3개 적기", "관련 기사 2개를 읽고 질문 5개 만들기", "부모가 금지할 말 2개와 물어볼 질문 2개 정하기"],
    proofNote: "부모 상담으로 바로 밀지 않고, 아이가 오래 버틸 조건과 부모 개입 기준을 먼저 정리합니다.",
  },
  {
    track: "early_career",
    label: "20대/첫 커리어 샘플",
    title: "흩어진 프로젝트 경험을 직무 언어로 바꾸기",
    fictionalInput: "전공은 애매하고, 공모전·동아리·아르바이트 경험은 있지만 이력서에서 어떤 직무로 보여야 할지 막힌 26세.",
    oneLineDiagnosis: "경험이 부족한 것이 아니라 경험을 시장 언어로 번역하는 기준이 부족한 상태입니다.",
    blocker: "활동을 많이 나열하지만 어떤 문제를 줄였고 어떤 결과를 만들었는지 증거 문장이 약합니다.",
    avoid: ["관심 직무를 매주 바꾸며 자소서만 다시 쓰기", "AI 활용을 툴 이름 나열로만 설명하기"],
    directions: ["운영/마케팅 보조 직무에서 자료 정리 역량 증명", "콘텐츠 기획 직무에서 사용자 반응 분석 증명", "AI를 활용한 반복 업무 개선 포트폴리오"],
    actions: ["경험 3개를 상황-문제-행동-결과로 다시 쓰기", "반복 업무 하나를 AI로 30% 줄인 실험 기록하기", "2주 안에 지원 직무 2개만 남기기"],
    proofNote: "막연한 위로가 아니라 이력서/포트폴리오에 들어갈 언어로 바꾸는 데 초점을 둡니다.",
  },
  {
    track: "transition",
    label: "40~50대/전환 샘플",
    title: "기존 경력을 버리지 않고 다음 쓰임으로 재호명",
    fictionalInput: "한 분야에서 18년 일했지만 산업 변화로 불안해진 48세. 새 자격증을 따야 할지, 기존 경력을 살려야 할지 판단이 안 서는 상황.",
    oneLineDiagnosis: "새로 시작해야 하는 문제가 아니라, 이미 해온 일을 다른 시장의 언어로 다시 부르는 문제입니다.",
    blocker: "전환을 ‘처음부터 다시’로 이해하면서 기존 경력의 반복 역할과 문제 해결 자산까지 낮게 평가하고 있습니다.",
    avoid: ["불안해서 무작정 자격증부터 결제하기", "과거 직함을 그대로 들고 다른 시장에 들어가기"],
    directions: ["현장 경험을 교육/코칭형 서비스로 전환", "운영 경험을 소규모 조직 관리 언어로 번역", "AI 도구를 붙여 문서화/매뉴얼화 자산 만들기"],
    actions: ["반복해서 해결한 문제 5개 적기", "계속 가져갈 일/줄일 일/실험할 일 1개씩 고르기", "재교육 후보를 결제 전 2주 실험으로 검증하기"],
    proofNote: "전환이 큰 경우에도 먼저 리포트로 선택지를 좁히고, 복잡한 의사결정만 1:1로 연결합니다.",
  },
];

export const sampleReportPreviewMap = Object.fromEntries(
  sampleReportPreviews.map((sample) => [sample.track, sample]),
) as Record<AudienceTrackType, SampleReportPreview>;
