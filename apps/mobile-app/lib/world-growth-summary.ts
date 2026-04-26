import type { WorldAttendanceRewardState } from "./world-attendance-reward";
import { dailyQuestPool, shepherdLevels } from "./world-growth-config";
import type { WorldGrowthState } from "./world-growth-store";

export function buildWorldGrowthSummary({
  growthState,
  peopleCount,
  attendanceReward,
}: {
  growthState: WorldGrowthState | null;
  peopleCount: number;
  attendanceReward: WorldAttendanceRewardState | null;
}) {
  const completedQuestIds = growthState?.completedQuestIds ?? [];
  const completedDailyQuests = dailyQuestPool.filter((quest) => completedQuestIds.includes(quest.id)).length;
  const shepherdXp = (growthState?.xp ?? 0) + peopleCount * 5 + (attendanceReward?.streakCount ?? 0) * 4;
  const shepherdLevelIndex = Math.min(shepherdLevels.length - 1, Math.floor(shepherdXp / 45));
  const shepherdLevel = shepherdLevels[shepherdLevelIndex];
  const gardenLevel = Math.max(1, Math.min(5, 1 + Math.floor(((growthState?.gardenPoints ?? 0) + peopleCount) / 4)));
  const sheepAffinity = Math.min(100, (growthState?.sheepAffinity ?? 0) + (attendanceReward?.streakCount ?? 0) * 6);

  return {
    completedQuestIds,
    completedDailyQuests,
    dailyQuestCount: dailyQuestPool.length,
    shepherdXp,
    shepherdLevel,
    gardenLevel,
    sheepAffinity,
    seeds: growthState?.seeds ?? 0,
    lamps: growthState?.lamps ?? 0,
    badges: growthState?.badges ?? 0,
  };
}
