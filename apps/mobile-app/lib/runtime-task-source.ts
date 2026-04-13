import { getCurrentChurchSlug } from "./auth-bridge";

const WEB_BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL ?? "https://soom.io.kr";
const DEFAULT_CHURCH_SLUG = process.env.EXPO_PUBLIC_CHURCH_SLUG ?? "gido";

export type RuntimeTask = {
  id: string;
  title: string;
  due: string;
  owner: string;
  completed: boolean;
  createdAt: number;
};

function resolveChurchSlug(savedSlug: string | null) {
  return savedSlug ?? DEFAULT_CHURCH_SLUG;
}

function normalizeTasks(value: unknown): RuntimeTask[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const maybe = item as Partial<RuntimeTask>;
      if (!maybe.id || !maybe.title || !maybe.due || !maybe.owner) return null;

      return {
        id: String(maybe.id),
        title: String(maybe.title),
        due: String(maybe.due),
        owner: String(maybe.owner),
        completed: Boolean(maybe.completed),
        createdAt: typeof maybe.createdAt === "number" ? maybe.createdAt : Date.now(),
      };
    })
    .filter((task): task is RuntimeTask => Boolean(task));
}

export async function fetchRuntimeTasks(): Promise<RuntimeTask[]> {
  try {
    const savedSlug = await getCurrentChurchSlug();
    const churchSlug = resolveChurchSlug(savedSlug);

    const response = await fetch(`${WEB_BASE_URL}/api/mobile/runtime-tasks?churchSlug=${encodeURIComponent(churchSlug)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`runtime task fetch failed: ${response.status}`);
    }

    const data = (await response.json()) as { tasks?: unknown };
    return normalizeTasks(data.tasks);
  } catch {
    return [];
  }
}

export async function syncRuntimeTasks(tasks: RuntimeTask[]): Promise<void> {
  try {
    const savedSlug = await getCurrentChurchSlug();
    const churchSlug = resolveChurchSlug(savedSlug);

    await fetch(`${WEB_BASE_URL}/api/mobile/runtime-tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ churchSlug, tasks }),
    });
  } catch {
    // ignore sync failure
  }
}
