import AsyncStorage from "@react-native-async-storage/async-storage";

import { getCurrentAccountKey, getCurrentChurchSlug } from "./auth-bridge";
import { chatQuickActions, type PersonRecord, type TaskRecord, type WorldObject, worldObjects } from "./world-model";

const WEB_BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL ?? "https://soom.io.kr";
const DEFAULT_CHURCH_SLUG = process.env.EXPO_PUBLIC_CHURCH_SLUG ?? "mobile";

type SnapshotPayload = {
  worldObjects: WorldObject[];
  peopleRecords: PersonRecord[];
  taskRecords: TaskRecord[];
  chatQuickActions: string[];
};

export type WorldSnapshot = SnapshotPayload;

const SNAPSHOT_CACHE_KEY = "soom.mobile.world.snapshot.v1";

function fallbackSnapshot(): WorldSnapshot {
  return {
    worldObjects,
    peopleRecords: [],
    taskRecords: [],
    chatQuickActions,
  };
}

function isSnapshotPayload(value: unknown): value is SnapshotPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybe = value as Record<string, unknown>;
  return (
    Array.isArray(maybe.worldObjects) &&
    Array.isArray(maybe.peopleRecords) &&
    Array.isArray(maybe.taskRecords) &&
    Array.isArray(maybe.chatQuickActions)
  );
}

async function fetchRemoteSnapshot(churchSlug: string, accountKey: string | null): Promise<WorldSnapshot> {
  const endpoint = `${WEB_BASE_URL}/api/mobile/world-snapshot?churchSlug=${encodeURIComponent(churchSlug)}&accountKey=${encodeURIComponent(accountKey ?? "anon")}`;

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("snapshot timeout")), 4500);
  });

  const requestPromise = (async () => {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`snapshot fetch failed: ${response.status}`);
    }

    const data = (await response.json()) as unknown;

    if (!isSnapshotPayload(data)) {
      throw new Error("snapshot payload invalid");
    }

    return data;
  })();

  return Promise.race([requestPromise, timeoutPromise]);
}

function resolveChurchSlug(savedSlug: string | null) {
  return savedSlug ?? DEFAULT_CHURCH_SLUG;
}

async function snapshotScopedKey(churchSlug: string, accountKey: string | null) {
  return `${SNAPSHOT_CACHE_KEY}:${churchSlug}:${accountKey ?? "anon"}`;
}

async function readCachedSnapshot(churchSlug: string, accountKey: string | null): Promise<WorldSnapshot | null> {
  try {
    const raw = await AsyncStorage.getItem(await snapshotScopedKey(churchSlug, accountKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isSnapshotPayload(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function writeCachedSnapshot(churchSlug: string, accountKey: string | null, snapshot: WorldSnapshot) {
  try {
    await AsyncStorage.setItem(await snapshotScopedKey(churchSlug, accountKey), JSON.stringify(snapshot));
  } catch {
    // ignore cache write failure
  }
}

export async function getWorldSnapshot(): Promise<WorldSnapshot> {
  const savedSlug = await getCurrentChurchSlug();
  const churchSlug = resolveChurchSlug(savedSlug);
  const accountKey = (await getCurrentAccountKey()) ?? "mobile-local";

  try {
    const remote = await fetchRemoteSnapshot(churchSlug, accountKey);
    await writeCachedSnapshot(churchSlug, accountKey, remote);
    return remote;
  } catch {
    const cached = await readCachedSnapshot(churchSlug, accountKey);
    return cached ?? fallbackSnapshot();
  }
}
