import AsyncStorage from "@react-native-async-storage/async-storage";

import { getCurrentAccountKey, getCurrentChurchSlug } from "./auth-bridge";

const WORLD_GROWTH_KEY = "soom.mobile.world.growth.v1";

export type GrowthReward = {
  xp?: number;
  seeds?: number;
  lamps?: number;
  badges?: number;
  sheepAffinity?: number;
  gardenPoints?: number;
};

export type WorldGrowthState = {
  xp: number;
  seeds: number;
  lamps: number;
  badges: number;
  sheepAffinity: number;
  gardenPoints: number;
  completedQuestIds: string[];
  lastRewardText: string | null;
  updatedAt: number;
};

const EMPTY_STATE: WorldGrowthState = {
  xp: 0,
  seeds: 0,
  lamps: 0,
  badges: 0,
  sheepAffinity: 0,
  gardenPoints: 0,
  completedQuestIds: [],
  lastRewardText: null,
  updatedAt: 0,
};

async function scopedKey() {
  const churchSlug = (await getCurrentChurchSlug()) ?? "default";
  const accountKey = (await getCurrentAccountKey()) ?? "anon";
  return `${WORLD_GROWTH_KEY}:${churchSlug}:${accountKey}`;
}

function safeNumber(value: unknown) {
  return Number.isFinite(value) ? Math.max(0, Number(value)) : 0;
}

function normalizeState(value: unknown): WorldGrowthState {
  if (!value || typeof value !== "object") return EMPTY_STATE;
  const parsed = value as Partial<WorldGrowthState>;

  return {
    xp: safeNumber(parsed.xp),
    seeds: safeNumber(parsed.seeds),
    lamps: safeNumber(parsed.lamps),
    badges: safeNumber(parsed.badges),
    sheepAffinity: Math.min(100, safeNumber(parsed.sheepAffinity)),
    gardenPoints: safeNumber(parsed.gardenPoints),
    completedQuestIds: Array.isArray(parsed.completedQuestIds) ? parsed.completedQuestIds.map(String) : [],
    lastRewardText: typeof parsed.lastRewardText === "string" ? parsed.lastRewardText : null,
    updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : 0,
  };
}

function rewardText(reward: GrowthReward) {
  const parts = [
    reward.xp ? `XP ${reward.xp}` : null,
    reward.seeds ? `씨앗 ${reward.seeds}` : null,
    reward.lamps ? `등불 ${reward.lamps}` : null,
    reward.badges ? `배지 ${reward.badges}` : null,
    reward.sheepAffinity ? `양 친밀도 +${reward.sheepAffinity}` : null,
    reward.gardenPoints ? `정원 +${reward.gardenPoints}` : null,
  ].filter(Boolean);

  return parts.length ? parts.join(" · ") : "보상 없음";
}

export async function getWorldGrowthState(): Promise<WorldGrowthState> {
  try {
    const raw = await AsyncStorage.getItem(await scopedKey());
    return normalizeState(raw ? JSON.parse(raw) : null);
  } catch {
    return EMPTY_STATE;
  }
}

export async function completeWorldQuest(questId: string, reward: GrowthReward): Promise<WorldGrowthState> {
  const key = await scopedKey();
  const current = await getWorldGrowthState();

  if (current.completedQuestIds.includes(questId)) {
    return current;
  }

  const next: WorldGrowthState = {
    xp: current.xp + (reward.xp ?? 0),
    seeds: current.seeds + (reward.seeds ?? 0),
    lamps: current.lamps + (reward.lamps ?? 0),
    badges: current.badges + (reward.badges ?? 0),
    sheepAffinity: Math.min(100, current.sheepAffinity + (reward.sheepAffinity ?? 0)),
    gardenPoints: current.gardenPoints + (reward.gardenPoints ?? 0),
    completedQuestIds: [...current.completedQuestIds, questId],
    lastRewardText: rewardText(reward),
    updatedAt: Date.now(),
  };

  await AsyncStorage.setItem(key, JSON.stringify(next));
  return next;
}
