import { getCurrentChurchSlug } from "./auth-bridge";

const WEB_BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL ?? "https://soom.io.kr";
const DEFAULT_CHURCH_SLUG = process.env.EXPO_PUBLIC_CHURCH_SLUG ?? "gido";

export type AgentGrowthLoop = {
  id: string;
  createdAt: string;
  text: string | null;
  intents: string[];
  actions: unknown[];
  agentGrowth: {
    loopId?: string;
    title?: string;
    summary?: string;
    suggestedGithubIssue?: string;
  } | null;
};

function resolveChurchSlug(savedSlug: string | null) {
  return savedSlug ?? DEFAULT_CHURCH_SLUG;
}

export async function fetchAgentGrowthLoops(): Promise<AgentGrowthLoop[]> {
  try {
    const savedSlug = await getCurrentChurchSlug();
    const churchSlug = resolveChurchSlug(savedSlug);

    const response = await fetch(`${WEB_BASE_URL}/api/mobile/agent-growth?churchSlug=${encodeURIComponent(churchSlug)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`agent growth fetch failed: ${response.status}`);
    }

    const data = (await response.json()) as { loops?: AgentGrowthLoop[] };
    return Array.isArray(data.loops) ? data.loops : [];
  } catch {
    return [];
  }
}
