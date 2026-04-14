import { getCurrentChurchSlug } from "./auth-bridge";

const WEB_BASE_URL = process.env.EXPO_PUBLIC_WEB_BASE_URL ?? "https://soom.io.kr";
const DEFAULT_CHURCH_SLUG = process.env.EXPO_PUBLIC_CHURCH_SLUG ?? "gido";

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

async function requestJson(path: string, method: "POST" | "PATCH", body: Record<string, unknown>) {
  const response = await fetch(`${WEB_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? `member request failed: ${response.status}`);
  }

  return response.json();
}

export async function createMember(input: MemberInput) {
  const churchSlug = await resolveChurchSlug();
  return requestJson("/api/mobile/member-upsert", "POST", {
    churchSlug,
    name: input.name,
    household: input.household,
    state: input.state,
    nextAction: input.nextAction,
  });
}

export async function updateMember(input: MemberInput & { id: string }) {
  const churchSlug = await resolveChurchSlug();
  return requestJson("/api/mobile/member-upsert", "PATCH", {
    churchSlug,
    id: input.id,
    name: input.name,
    household: input.household,
    state: input.state,
    nextAction: input.nextAction,
  });
}

export async function deleteMember(input: { id?: string; name?: string }) {
  const churchSlug = await resolveChurchSlug();

  const response = await fetch(`${WEB_BASE_URL}/api/mobile/member-upsert`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      churchSlug,
      id: input.id,
      name: input.name,
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? `member delete failed: ${response.status}`);
  }

  return response.json();
}
