import { getCurrentChurchSlug } from "./auth-bridge";

const WEB_BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL ?? "https://soom.io.kr";
const DEFAULT_CHURCH_SLUG = process.env.EXPO_PUBLIC_CHURCH_SLUG ?? "gido";

function resolveChurchSlug(savedSlug: string | null) {
  return savedSlug ?? DEFAULT_CHURCH_SLUG;
}

export async function sendChatCommand(text: string) {
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

    const data = (await response.json()) as { reply?: string };

    if (!data.reply) {
      throw new Error("chat reply missing");
    }

    return data.reply;
  } catch {
    return "지금은 네트워크가 불안정해서 임시 응답으로 진행할게. 오늘 후속 3개부터 바로 처리해보자.";
  } finally {
    clearTimeout(timeout);
  }
}
