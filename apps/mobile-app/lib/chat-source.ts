import { getCurrentChurchSlug } from "./auth-bridge";

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
};

function resolveChurchSlug(savedSlug: string | null) {
  return savedSlug ?? DEFAULT_CHURCH_SLUG;
}

function fallbackResult(): ChatCommandResult {
  return {
    reply: "지금은 네트워크가 불안정해서 임시 응답으로 진행할게. 오늘 후속 3개부터 바로 처리해보자.",
    actions: [
      { id: "fallback-1", title: "후속 연락 대상 3명 확정", due: "오늘", owner: "목양 관리" },
      { id: "fallback-2", title: "연락 후 상태태그 갱신", due: "오늘", owner: "목양 관리" },
    ],
  };
}

export async function sendChatCommand(text: string): Promise<ChatCommandResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const savedSlug = await getCurrentChurchSlug();
    const response = await fetch(`${WEB_BASE_URL}/api/mobile/chat-command`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        churchSlug: resolveChurchSlug(savedSlug),
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
    };
  } catch {
    return fallbackResult();
  } finally {
    clearTimeout(timeout);
  }
}
