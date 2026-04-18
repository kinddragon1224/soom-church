import AsyncStorage from "@react-native-async-storage/async-storage";

import { getCurrentAccountKey, getCurrentChurchSlug } from "./auth-bridge";

const WORLD_NPC_UNLOCK_KEY = "soom.mobile.world.npc.unlock.v1";

export type WorldNpcId = "jesus" | "maria" | "johnBaptist" | "peter" | "johnApostle";

export type WorldNpcUnlockState = {
  unlocked: WorldNpcId[];
};

const DEFAULT_UNLOCKED: WorldNpcId[] = ["jesus", "maria", "johnBaptist", "peter", "johnApostle"];

export const WORLD_NPC_UNLOCK_ORDER: WorldNpcId[] = ["johnBaptist", "peter", "johnApostle"];

async function scopedKey() {
  const churchSlug = (await getCurrentChurchSlug()) ?? "mobile";
  const accountKey = (await getCurrentAccountKey()) ?? "mobile-local";
  return `${WORLD_NPC_UNLOCK_KEY}:${churchSlug}:${accountKey}`;
}

function normalizeUnlockList(value: unknown): WorldNpcId[] {
  if (!Array.isArray(value)) return [...DEFAULT_UNLOCKED];

  const allowed = new Set<WorldNpcId>(["jesus", "maria", "johnBaptist", "peter", "johnApostle"]);
  const filtered = value.map((item) => String(item) as WorldNpcId).filter((item) => allowed.has(item));
  return Array.from(new Set([...DEFAULT_UNLOCKED, ...filtered]));
}

export async function getWorldNpcUnlockState(): Promise<WorldNpcUnlockState> {
  try {
    const raw = await AsyncStorage.getItem(await scopedKey());
    if (!raw) {
      return { unlocked: [...DEFAULT_UNLOCKED] };
    }

    const parsed = JSON.parse(raw) as { unlocked?: unknown };
    return {
      unlocked: normalizeUnlockList(parsed?.unlocked),
    };
  } catch {
    return { unlocked: [...DEFAULT_UNLOCKED] };
  }
}

export async function setWorldNpcUnlockState(state: WorldNpcUnlockState) {
  const normalized = { unlocked: normalizeUnlockList(state.unlocked) };
  await AsyncStorage.setItem(await scopedKey(), JSON.stringify(normalized));
}
