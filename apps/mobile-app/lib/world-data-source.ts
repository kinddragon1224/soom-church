import { getCurrentChurchSlug } from "./auth-bridge";
import { chatQuickActions, peopleRecords, taskRecords, worldObjects } from "./world-model";

const WEB_BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL ?? "https://soom.io.kr";
const DEFAULT_CHURCH_SLUG = process.env.EXPO_PUBLIC_CHURCH_SLUG ?? "gido";

type WorldObject = (typeof worldObjects)[number];
type PersonRecord = (typeof peopleRecords)[number];
type TaskRecord = (typeof taskRecords)[number];

type SnapshotPayload = {
  worldObjects: WorldObject[];
  peopleRecords: PersonRecord[];
  taskRecords: TaskRecord[];
  chatQuickActions: string[];
};

export type WorldSnapshot = SnapshotPayload;

function fallbackSnapshot(): WorldSnapshot {
  return {
    worldObjects,
    peopleRecords,
    taskRecords,
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

async function fetchRemoteSnapshot(churchSlug: string): Promise<WorldSnapshot> {
  const endpoint = `${WEB_BASE_URL}/api/mobile/world-snapshot?churchSlug=${encodeURIComponent(churchSlug)}`;

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

export async function getWorldSnapshot(): Promise<WorldSnapshot> {
  try {
    const savedSlug = await getCurrentChurchSlug();
    return await fetchRemoteSnapshot(resolveChurchSlug(savedSlug));
  } catch {
    return fallbackSnapshot();
  }
}
