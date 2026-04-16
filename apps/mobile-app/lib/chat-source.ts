import { getCurrentAccountKey, getCurrentChurchSlug } from "./auth-bridge";

const WEB_BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL ?? "https://soom.io.kr";
const DEFAULT_CHURCH_SLUG = process.env.EXPO_PUBLIC_CHURCH_SLUG ?? "gido";

export type ChatCommandAction = {
  id: string;
  title: string;
  due: string;
  owner: string;
};

export type ChatCommandResult = {
  reply: string;
  actions: ChatCommandAction[];
  intents?: string[];
  diagnostics?: {
    mode?: "openclaw" | "llm" | "rule";
    provider?: string;
    reason?: string;
  };
  autoBuild?: {
    workspace?: string;
    shepherdingQueue?: string[];
    memberOps?: string[];
  };
  agentGrowth?: {
    loopId?: string;
    title?: string;
    summary?: string;
    suggestedGithubIssue?: string;
  };
};

type ChatBackupResponse = {
  backups?: Array<{
    id?: string;
    createdAt?: string;
    data?: {
      output?: {
        actions?: ChatCommandAction[];
      };
    } | null;
  }>;
};

function resolveChurchSlug(savedSlug: string | null) {
  return savedSlug ?? DEFAULT_CHURCH_SLUG;
}

function fallbackResult(reason: string): ChatCommandResult {
  return {
    reply: "지금은 네트워크가 불안정해서 임시 응답으로 진행할게. 오늘 후속 3개부터 바로 처리해보자.",
    actions: [
      { id: "fallback-1", title: "후속 연락 대상 3명 확정", due: "오늘", owner: "목양 관리" },
      { id: "fallback-2", title: "연락 후 상태태그 갱신", due: "오늘", owner: "목양 관리" },
    ],
    intents: ["GENERAL_SHEPHERDING"],
    diagnostics: {
      mode: "rule",
      provider: "mobile-fetch-fallback",
      reason,
    },
  };
}

export async function sendChatCommand(text: string): Promise<ChatCommandResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new Error(`timeout:${WEB_BASE_URL}`)), 45000);

  try {
    const savedSlug = await getCurrentChurchSlug();
    const accountKey = (await getCurrentAccountKey()) ?? "anon";
    const response = await fetch(`${WEB_BASE_URL}/api/mobile/chat-command`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        churchSlug: resolveChurchSlug(savedSlug),
        accountKey,
        text,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`chat command failed: ${response.status}`);
    }

    const data = (await response.json()) as Partial<ChatCommandResult>;

    if (!data.reply) {
      throw new Error("chat reply missing");
    }

    return {
      reply: data.reply,
      actions: Array.isArray(data.actions) ? data.actions : [],
      intents: Array.isArray(data.intents) ? data.intents : [],
      diagnostics: data.diagnostics,
      autoBuild: data.autoBuild,
      agentGrowth: data.agentGrowth,
    };
  } catch (error) {
    let reason = "unknown fetch error";
    if (error instanceof Error) {
      reason = error.message;
    }
    return fallbackResult(reason);
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchLatestChatBackupActions(limit = 20): Promise<ChatCommandAction[]> {
  try {
    const savedSlug = await getCurrentChurchSlug();
    const churchSlug = resolveChurchSlug(savedSlug);
    const accountKey = (await getCurrentAccountKey()) ?? "anon";

    const response = await fetch(
      `${WEB_BASE_URL}/api/mobile/chat-command?churchSlug=${encodeURIComponent(churchSlug)}&accountKey=${encodeURIComponent(accountKey)}&limit=${encodeURIComponent(String(limit))}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`chat backup fetch failed: ${response.status}`);
    }

    const data = (await response.json()) as ChatBackupResponse;
    if (!Array.isArray(data.backups)) return [];

    const dedupe = new Set<string>();
    const actions: ChatCommandAction[] = [];

    for (const backup of data.backups) {
      const items = backup?.data?.output?.actions;
      if (!Array.isArray(items)) continue;

      for (const action of items) {
        if (!action?.title) continue;
        const key = `${action.title}|${action.due ?? ""}|${action.owner ?? ""}`;
        if (dedupe.has(key)) continue;
        dedupe.add(key);

        actions.push({
          id: action.id || `backup-${actions.length + 1}`,
          title: action.title,
          due: action.due || "오늘",
          owner: action.owner || "모라",
        });
      }
    }

    return actions;
  } catch {
    return [];
  }
}
