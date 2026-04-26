import type { GrowthReward } from "./world-growth-store";

export type WorldQuestRoute = "/(tabs)/people" | "/(tabs)/attendance" | "/(tabs)/tasks";

export type DailyQuest = {
  id: string;
  title: string;
  reward: string;
  rewardValue: GrowthReward;
  route: WorldQuestRoute;
  actionLabel: string;
  flowHint: string;
};

export type ShepherdLevel = {
  level: number;
  title: string;
  gear: string;
};

export const dailyQuestPool: DailyQuest[] = [
  {
    id: "pray-one-member",
    title: "목원 한 명을 위해 기도하기",
    reward: "XP 10 · 씨앗 1",
    rewardValue: { xp: 10, seeds: 1, gardenPoints: 1 },
    route: "/(tabs)/people",
    actionLabel: "기도 기록하기",
    flowHint: "목원을 선택하면 기도제목 칸에 바로 이어서 기록할 수 있어요.",
  },
  {
    id: "record-check-in",
    title: "목원 안부 연락 기록하기",
    reward: "XP 12 · 양 친밀도",
    rewardValue: { xp: 12, sheepAffinity: 12 },
    route: "/(tabs)/people",
    actionLabel: "안부 기록하기",
    flowHint: "목원을 선택하면 돌봄 메모와 후속 연락 칸에 바로 기록할 수 있어요.",
  },
  {
    id: "mark-attendance",
    title: "지난 모임 출석 체크하기",
    reward: "XP 15 · 등불 1",
    rewardValue: { xp: 15, lamps: 1, gardenPoints: 1 },
    route: "/(tabs)/attendance",
    actionLabel: "출석 체크하기",
    flowHint: "출석 화면에서 참석/결석을 저장하면 결석자 후속 연락까지 이어져요.",
  },
];

export const shepherdLevels: ShepherdLevel[] = [
  { level: 1, title: "초보 목자", gear: "작은 지팡이 · 기본 가방" },
  { level: 2, title: "돌봄 목자", gear: "기도수첩" },
  { level: 3, title: "기도 목자", gear: "등불 장식" },
  { level: 4, title: "말씀 목자", gear: "두루마리" },
  { level: 5, title: "신실한 목자", gear: "목장 망토 · 빛나는 배지" },
];
