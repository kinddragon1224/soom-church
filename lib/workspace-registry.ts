export const workspaceNavSections = [
  {
    title: "workspace",
    items: [
      { href: "/workspace", label: "홈", hint: "운영 요약" },
      { href: "/workspace/people", label: "사람", hint: "후속관리" },
      { href: "/workspace/mokjang", label: "목장", hint: "목장 운영" },
      { href: "/workspace/notices", label: "커뮤니케이션", hint: "공지 흐름" },
      { href: "/workspace/tasks", label: "작업 흐름", hint: "팀 마감" },
      { href: "/workspace/content", label: "콘텐츠 스튜디오", hint: "제작 파이프라인" },
    ],
  },
  {
    title: "system",
    items: [{ href: "/workspace/settings", label: "설정", hint: "도입 구조" }],
  },
] as const;

export const workspaceUtilityLinks = [
  { href: "/pricing", label: "상품 구조" },
  { href: "/contact", label: "도입 문의" },
  { href: "/blog", label: "블로그" },
] as const;

export const workspacePulseItems = [
  { label: "오늘 후속 연락", value: "3건", tone: "gold" },
  { label: "예약 공지", value: "4건", tone: "slate" },
  { label: "콘텐츠 검토", value: "2건", tone: "slate" },
] as const;

export const workspaceRouteMeta = {
  "/workspace": { title: "운영 홈", desc: "지금 처리해야 할 흐름을 한 화면에서 정리합니다." },
  "/workspace/people": { title: "사람 흐름", desc: "새가족부터 정착과 봉사 연결까지 상태를 관리합니다." },
  "/workspace/mokjang": { title: "목장 운영", desc: "우리 목장부터 참석, 돌봄, 후속 연락 흐름을 끊기지 않게 봅니다." },
  "/workspace/notices": { title: "커뮤니케이션", desc: "대상별 공지와 예약 발송 흐름을 맞춥니다." },
  "/workspace/tasks": { title: "작업 흐름", desc: "사역팀이 마감까지 놓치지 않도록 보드를 공유합니다." },
  "/workspace/content": { title: "콘텐츠 스튜디오", desc: "설교·행사 요청을 결과물까지 한 파이프라인으로 연결합니다." },
  "/workspace/settings": { title: "워크스페이스 설정", desc: "도입 상태와 팀 기본값을 정리합니다." },
} as const;

export const workspaceModuleCards = [
  { href: "/workspace/people", label: "사람", value: "후속관리 9건", note: "48시간 안에 연락이 필요한 흐름", tone: "slate" },
  { href: "/workspace/mokjang", label: "목장", value: "이번 주 확인 4건", note: "참석, 결석, 돌봄 메모를 한 화면에서", tone: "gold" },
  { href: "/workspace/notices", label: "공지", value: "예약 4건", note: "수요일·주말 발송 점검 필요", tone: "gold" },
  { href: "/workspace/tasks", label: "작업", value: "오늘 마감 2건", note: "체크리스트와 검토가 연결된 상태", tone: "slate" },
  { href: "/workspace/content", label: "콘텐츠", value: "검토 1건", note: "썸네일 승인 후 바로 배포 가능", tone: "slate" },
] as const;

export const workspaceControlStats = [
  { label: "team response", value: "2h 10m", note: "첫 연락 평균 응답 시간" },
  { label: "handoff health", value: "3 / 4", note: "사람→공지→콘텐츠 연결 상태" },
  { label: "active owners", value: "4명", note: "지금 흐름을 맡은 담당자" },
] as const;

export const workspaceAutomationRail = [
  { label: "ready", title: "48시간 미응답 감지", note: "첫 연락이 늦어지면 담당자에게 다시 알려줍니다." },
  { label: "draft", title: "예약 공지 재확인", note: "발송 24시간 전에 링크·일정 변경 여부를 점검합니다." },
  { label: "review", title: "콘텐츠 승인 handoff", note: "검토 완료 시 공지 흐름으로 바로 넘길 준비 상태입니다." },
] as const;

export const workspaceTeamRhythm = [
  { role: "사무국", focus: "새가족 배정 정리", state: "오늘" },
  { role: "청년부 리더", focus: "수련회 안내 문구 확인", state: "수요일 전" },
  { role: "콘텐츠팀", focus: "부활절 영상 썸네일 확정", state: "승인 대기" },
] as const;

export const workspaceNextActionMap = {
  "/workspace": [
    { label: "목장", title: "이번 주 결석자 확인", note: "우리 목장 파일럿에서 먼저 후속 연락 흐름을 정리합니다." },
    { label: "사람", title: "새가족 첫 연락 배정", note: "오늘 안에 담당자와 첫 연락 시점을 붙여야 합니다." },
    { label: "공지", title: "수련회 안내 예약 점검", note: "발송 채널과 문구를 마지막으로 확인합니다." },
  ],
  "/workspace/people": [
    { label: "오늘", title: "김은혜 첫 연락", note: "주일 첫 방문 이후 48시간 안에 연락을 시작해야 합니다." },
    { label: "정착", title: "정하늘 소그룹 연결", note: "첫 안내 이후 다음 관계 연결이 끊기지 않게 이어줍니다." },
    { label: "배정", title: "교구 미배정 2명 검토", note: "리더 회의 전에 담당 교구와 연결 여부를 확인합니다." },
  ],
  "/workspace/mokjang": [
    { label: "이번 주", title: "2주 연속 결석자 확인", note: "오래 안 보인 사람부터 먼저 챙겨야 목장 흐름이 끊기지 않습니다." },
    { label: "기록", title: "지난 모임 메모 정리", note: "기도제목과 후속 연락 대상을 모임 기록에 남깁니다." },
    { label: "연락", title: "오늘 연락할 사람 2명", note: "애매한 상태는 미루지 말고 이번 주 안에 확인합니다." },
  ],
  "/workspace/notices": [
    { label: "예약", title: "수련회 안내 수요일 발송", note: "신청 링크와 마감일이 최신 버전인지 다시 확인합니다." },
    { label: "리마인드", title: "봉사자 안내 오늘 발송", note: "예배 시간 변경이 반영됐는지 검토가 필요합니다." },
    { label: "초안", title: "청년부 모임 공지 문구 조정", note: "푸시 제목 길이와 톤을 채널에 맞게 압축합니다." },
  ],
  "/workspace/tasks": [
    { label: "마감", title: "새가족 후속 연락 완료", note: "오늘 처리 기준 작업부터 먼저 닫아야 합니다." },
    { label: "검토", title: "수련회 페이지 검수", note: "신청 버튼 문구와 마감 시점을 마지막으로 확인합니다." },
    { label: "현장", title: "부활절 체크리스트 정리", note: "역할 배정 누락 없이 오늘 마감선까지 끌어옵니다." },
  ],
  "/workspace/content": [
    { label: "쇼츠", title: "설교 클립 3건 편집", note: "자막 톤과 컷 길이를 같은 결로 맞춥니다." },
    { label: "랜딩", title: "수련회 페이지 시안 정리", note: "안내 문구와 신청 흐름을 한 화면으로 압축합니다." },
    { label: "배포", title: "부활절 영상 검토 완료", note: "썸네일 승인 후 공지 흐름과 같이 배포합니다." },
  ],
  "/workspace/settings": [
    { label: "기본값", title: "워크스페이스 이름·구조 점검", note: "교회명, 부서, 담당자 구조가 실제 운영과 맞는지 봅니다." },
    { label: "도입", title: "사람 상태 체계 정리", note: "새가족, 정착, 봉사연결 같은 기본 상태를 먼저 잡습니다." },
    { label: "확장", title: "공지·콘텐츠 연결 준비", note: "운영 루틴이 잡히면 다음 확장 포인트를 열 수 있습니다." },
  ],
} as const;

export const workspaceHomeQuickLinks = [
  { href: "/workspace/mokjang", label: "목장" },
  { href: "/workspace/people", label: "사람" },
  { href: "/workspace/notices", label: "공지" },
  { href: "/workspace/content", label: "콘텐츠" },
] as const;

export const workspaceHomeTodayBoard = [
  { lane: "지금", title: "목장 결석자 2명 확인", desc: "우리 목장 파일럿에서 후속 연락 흐름부터 먼저 맞춥니다.", cta: "목장 보기", href: "/workspace/mokjang" },
  { lane: "다음", title: "후속 연락 3건 확인", desc: "48시간 안에 응답이 필요한 사람 흐름입니다.", cta: "사람 보기", href: "/workspace/people" },
  { lane: "검토", title: "예약 공지 4건 점검", desc: "수요일·주말 발송 전 마지막 확인이 필요합니다.", cta: "공지 보기", href: "/workspace/notices" },
] as const;

export type WorkspaceRouteKey = keyof typeof workspaceRouteMeta;

export function getWorkspaceRouteMeta(pathname: string) {
  return workspaceRouteMeta[(pathname in workspaceRouteMeta ? pathname : "/workspace") as WorkspaceRouteKey];
}

export function getWorkspaceNextActions(pathname: string) {
  return workspaceNextActionMap[(pathname in workspaceNextActionMap ? pathname : "/workspace") as keyof typeof workspaceNextActionMap];
}
