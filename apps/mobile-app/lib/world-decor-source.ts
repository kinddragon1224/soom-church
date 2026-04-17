import AsyncStorage from "@react-native-async-storage/async-storage";

import { getCurrentAccountKey, getCurrentChurchSlug } from "./auth-bridge";

const WORLD_DECOR_KEY = "soom.mobile.world.decor.v1";

export type WorldDecorItem = {
  id: string;
  type: string;
  icon: string;
  label: string;
  nx: number;
  ny: number;
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

async function scopedKey() {
  const churchSlug = (await getCurrentChurchSlug()) ?? "mobile";
  const accountKey = (await getCurrentAccountKey()) ?? "anon";
  return `${WORLD_DECOR_KEY}:${churchSlug}:${accountKey}`;
}

function normalizeItem(item: Partial<WorldDecorItem>): WorldDecorItem | null {
  if (!item.id || !item.type || !item.icon || !item.label) return null;
  return {
    id: String(item.id),
    type: String(item.type),
    icon: String(item.icon),
    label: String(item.label),
    nx: clamp01(Number(item.nx ?? 0.5)),
    ny: clamp01(Number(item.ny ?? 0.7)),
  };
}

export async function getWorldDecorItems(): Promise<WorldDecorItem[]> {
  try {
    const raw = await AsyncStorage.getItem(await scopedKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => normalizeItem((item ?? {}) as Partial<WorldDecorItem>)).filter((item): item is WorldDecorItem => Boolean(item));
  } catch {
    return [];
  }
}

export async function setWorldDecorItems(items: WorldDecorItem[]) {
  try {
    await AsyncStorage.setItem(await scopedKey(), JSON.stringify(items));
  } catch {
    // ignore persistence failure
  }
}
