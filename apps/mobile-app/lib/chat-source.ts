import { getCurrentAccountKey, getCurrentChurchSlug } from "./auth-bridge";

const WEB_BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL ?? "https://soom.io.kr";
const WEB_BASE_URL_FALLBACK = process.env.EXPO_PUBLIC_WEB_BASE_URL_FALLBACK ?? "https://soom.io.kr";
const DEFAULT_CHURCH_SLUG = process.env.EXPO_PUBLIC_CHURCH_SLUG ?? "mobile";

export type ChatCommandAction = {
  id: string;
  title: string;
  due: string;
  owner: string;
};

export type ChatCommandResult = {
  reply: string;
  actions: ChatCommandAction[];
  dbActions?: {
    applied?: boolean;
    updatedMembers?: string[];
    followUpRecords?: number;
    note?: string;
  };
  intents?: string[];
  diagnostics?: {
    mode?: "openclaw" | "llm" | "rule";
    provider?: string;
    reason?: string;
    requestId?: string;
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
  try {
    const savedSlug = await getCurrentChurchSlug();
    const accountKey = (await getCurrentAccountKey()) ?? "anon";
    const bases = [WEB_BASE_URL, WEB_BASE_URL_FALLBACK]
      .map((value) => value.trim())
      .filter(Boolean)
      .filter((value, index, arr) => arr.indexOf(value) === index);

    const errors: string[] = [];

    for (let index = 0; index < bases.length; index += 1) {
      const base = bases[index];
      const controller = new AbortController();
      const timeoutMs = index === 0 ? 12000 : 8000;
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(`${base}/api/mobile/chat-command`, {
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
          errors.push(`${base}:http-${response.status}`);
          continue;
        }

        const data = (await response.json()) as Partial<ChatCommandResult>;

        if (!data.reply) {
          errors.push(`${base}:reply-missing`);
          continue;
        }

        return {
          reply: data.reply,
          actions: Array.isArray(data.actions) ? data.actions : [],
          dbActions: data.dbActions,
          intents: Array.isArray(data.intents) ? data.intents : [],
          diagnostics: data.diagnostics,
          autoBuild: data.autoBuild,
          agentGrowth: data.agentGrowth,
        };
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          errors.push(`${base}:timeout`);
        } else if (error instanceof Error) {
          errors.push(`${base}:${error.message}`);
        } else {
          errors.push(`${base}:unknown-error`);
        }
      } finally {
        clearTimeout(timeout);
      }
    }

    return fallbackResult(errors.join(" | ") || "all-endpoints-failed");
  } catch (error) {
    let reason = "unknown fetch error";
    if (error instanceof Error) {
      reason = error.message;
    }
    return fallbackResult(reason);
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
