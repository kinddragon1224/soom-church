import { getCurrentChurchSlug, getRequiredAccountKey } from "./auth-bridge";

const WEB_BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL ?? "https://soom.io.kr";
const WEB_BASE_URL_FALLBACK = process.env.EXPO_PUBLIC_WEB_BASE_URL_FALLBACK ?? "https://soom.io.kr";
const DEFAULT_CHURCH_SLUG = process.env.EXPO_PUBLIC_CHURCH_SLUG ?? "mobile";

type MemberInput = {
  id?: string;
  name: string;
  household: string;
  state: string;
  nextAction: string;
};

async function resolveChurchSlug() {
  const saved = await getCurrentChurchSlug();
  return saved ?? DEFAULT_CHURCH_SLUG;
}

async function resolveAccountKey() {
  return getRequiredAccountKey();
}

function resolveBaseUrls() {
  return [WEB_BASE_URL, WEB_BASE_URL_FALLBACK]
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value, index, arr) => arr.indexOf(value) === index);
}

async function requestJson(path: string, method: "POST" | "PATCH" | "DELETE", body: Record<string, unknown>) {
  const errors: string[] = [];

  for (const base of resolveBaseUrls()) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await Promise.race([
        fetch(`${base}${path}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        }),
        new Promise<Response>((_, reject) => setTimeout(() => reject(new Error("request-timeout")), 12500)),
      ]);

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        errors.push(`${base}:http-${response.status}:${payload?.error ?? "request-failed"}`);
        continue;
      }

      return response.json();
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

  throw new Error(errors.join(" | ") || "member request failed");
}

export async function createMember(input: MemberInput) {
  const churchSlug = await resolveChurchSlug();
  const accountKey = await resolveAccountKey();
  return requestJson("/api/mobile/member-upsert", "POST", {
    churchSlug,
    accountKey,
    name: input.name,
    household: input.household,
    state: input.state,
    nextAction: input.nextAction,
  });
}

export async function updateMember(input: MemberInput & { id: string }) {
  const churchSlug = await resolveChurchSlug();
  const accountKey = await resolveAccountKey();
  return requestJson("/api/mobile/member-upsert", "PATCH", {
    churchSlug,
    accountKey,
    id: input.id,
    name: input.name,
    household: input.household,
    state: input.state,
    nextAction: input.nextAction,
  });
}

export async function deleteMember(input: { id?: string; name?: string }) {
  const churchSlug = await resolveChurchSlug();
  const accountKey = await resolveAccountKey();
  return requestJson("/api/mobile/member-upsert", "DELETE", {
    churchSlug,
    accountKey,
    id: input.id,
    name: input.name,
  });
}
