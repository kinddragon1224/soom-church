export const STATUS_FLOW = {
  등록대기: {
    label: "등록대기",
    stage: "초기 확인",
    nextAction: "기본 정보 확인",
    description: "등록 직후 기본 정보와 소속 배정을 확인합니다.",
  },
  새가족: {
    label: "새가족",
    stage: "첫 연결",
    nextAction: "첫 연락 진행",
    description: "첫 인사와 초기 안내를 연결합니다.",
  },
  정착중: {
    label: "정착중",
    stage: "정착 지원",
    nextAction: "정착 상태 점검",
    description: "예배, 소그룹, 관계 연결을 계속 점검합니다.",
  },
  목장배정완료: {
    label: "목장배정완료",
    stage: "배정 완료",
    nextAction: "목장 리더 연결",
    description: "배정 후 실제 참여가 이어지도록 연결합니다.",
  },
  봉사연결: {
    label: "봉사연결",
    stage: "사역 연결",
    nextAction: "봉사 시작 확인",
    description: "사역 배정 이후 실제 참여 여부를 확인합니다.",
  },
  휴면: {
    label: "휴면",
    stage: "재접촉 필요",
    nextAction: "재연결 시도",
    description: "최근 참여가 멈춘 상태를 다시 연결합니다.",
  },
  심방필요: {
    label: "심방필요",
    stage: "집중 돌봄",
    nextAction: "심방 일정 조율",
    description: "직접적인 접촉과 돌봄이 필요한 상태입니다.",
  },
} as const;

export type MemberStatusTag = keyof typeof STATUS_FLOW;

export function getStatusMeta(statusTag: string) {
  return STATUS_FLOW[statusTag as MemberStatusTag] ?? {
    label: statusTag,
    stage: "상태 확인",
    nextAction: "운영 상태 점검",
    description: "현재 상태를 확인합니다.",
  };
}
