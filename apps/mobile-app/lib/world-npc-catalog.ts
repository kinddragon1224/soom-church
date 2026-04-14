export type WorldNpcTier = "core" | "disciple" | "support" | "future";

export type WorldNpc = {
  id: string;
  name: string;
  tier: WorldNpcTier;
  role: string;
  visualNote: string;
  worldPlacement: "foreground" | "midground" | "background" | "hidden";
  unlockPhase: number;
};

export const worldNpcCatalog: WorldNpc[] = [
  {
    id: "npc-jesus",
    name: "예수님",
    tier: "core",
    role: "월드 중심 안내/핵심 메시지",
    visualNote: "중앙 허브에 상징적 존재로 배치",
    worldPlacement: "midground",
    unlockPhase: 1,
  },
  ...[
    "베드로",
    "안드레",
    "야고보(세베대의 아들)",
    "요한",
    "빌립",
    "바돌로매",
    "도마",
    "마태",
    "야고보(알패오의 아들)",
    "다대오",
    "시몬(열심당원)",
    "가룟 유다",
  ].map((name, index) => ({
    id: `npc-disciple-${index + 1}`,
    name,
    tier: "disciple" as const,
    role: name === "가룟 유다" ? "배경 서사 요소" : "훈련/파송/돌봄 상징 요소",
    visualNote: name === "가룟 유다" ? "멀리 배경 나무 근처의 작은 실루엣" : "가정/길목 주변 조연 배치",
    worldPlacement: name === "가룟 유다" ? ("hidden" as const) : ("background" as const),
    unlockPhase: 1,
  })),
  ...[
    "막달라 마리아",
    "마르다",
    "마리아(베다니)",
    "요안나",
    "수산나",
  ].map((name, index) => ({
    id: `npc-support-woman-${index + 1}`,
    name,
    tier: "support" as const,
    role: "돌봄/섬김/증언 축의 상징 요소",
    visualNote: "기도/돌봄 지점 인근 조연 배치",
    worldPlacement: "background" as const,
    unlockPhase: 1,
  })),
  {
    id: "npc-future-ot-pack",
    name: "구약 인물 팩",
    tier: "future",
    role: "추후 시즌 확장",
    visualNote: "모세/다윗/에스더 등 테마 확장 가능",
    worldPlacement: "background",
    unlockPhase: 2,
  },
  {
    id: "npc-future-original-pack",
    name: "창작 캐릭터 팩",
    tier: "future",
    role: "교회/목장 맞춤 세계관 확장",
    visualNote: "지역/세대/사역 특성 반영",
    worldPlacement: "background",
    unlockPhase: 3,
  },
];
