import AsyncStorage from "@react-native-async-storage/async-storage";

import { getCurrentAccountKey, getCurrentChurchSlug } from "./auth-bridge";

const WORLD_NPC_LAYOUT_KEY = "soom.mobile.world.npc-layout.v1";

export type NpcAnchor = {
  nx: number;
  ny: number;
};

export type WorldNpcLayout = {
  jesus: NpcAnchor;
};

const DEFAULT_LAYOUT: WorldNpcLayout = {
  jesus: { nx: 0.5, ny: 0.64 },
};

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

async function scopedKey() {
  const churchSlug = (await getCurrentChurchSlug()) ?? "default";
  const accountKey = (await getCurrentAccountKey()) ?? "anon";
  return `${WORLD_NPC_LAYOUT_KEY}:${churchSlug}:${accountKey}`;
}

export async function getWorldNpcLayout(): Promise<WorldNpcLayout> {
  try {
    const raw = await AsyncStorage.getItem(await scopedKey());
    if (!raw) return DEFAULT_LAYOUT;

    const parsed = JSON.parse(raw) as Partial<WorldNpcLayout>;
    return {
      jesus: {
        nx: clamp01(Number(parsed.jesus?.nx ?? DEFAULT_LAYOUT.jesus.nx)),
        ny: clamp01(Number(parsed.jesus?.ny ?? DEFAULT_LAYOUT.jesus.ny)),
      },
    };
  } catch {
    return DEFAULT_LAYOUT;
  }
}

export async function setWorldNpcLayout(layout: WorldNpcLayout) {
  const next: WorldNpcLayout = {
    jesus: {
      nx: clamp01(layout.jesus.nx),
      ny: clamp01(layout.jesus.ny),
    },
  };

  await AsyncStorage.setItem(await scopedKey(), JSON.stringify(next));
}
