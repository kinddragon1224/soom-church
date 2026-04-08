type GidoParsedJson = Record<string, unknown>;

type GidoMemberMeta = {
  birthLabel?: string;
  homePinned?: boolean;
  homePinnedAt?: string | null;
};

type GidoHouseholdMeta = {
  prayers?: string[];
  contacts?: string[];
  tags?: string[];
  followUps?: unknown[];
  updates?: unknown[];
  prayerOrder?: number;
};

const GIDO_PRAYER_ORDER_KEYWORDS = [
  "문일선",
  "심상욱",
  "오상준",
  "윤현석",
  "정기창",
  "조성진",
  "채석민",
  "김선용",
  "가정 C",
] as const;

function parseJson(value?: string | null): GidoParsedJson | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as GidoParsedJson;
  } catch {
    return null;
  }
}

export function parseGidoMemberMeta(notes?: string | null): GidoMemberMeta {
  const parsed = parseJson(notes);
  if (!parsed) return {};
  return {
    birthLabel: typeof parsed.birthLabel === "string" ? parsed.birthLabel : undefined,
    homePinned: parsed.homePinned === true,
    homePinnedAt: typeof parsed.homePinnedAt === "string" ? parsed.homePinnedAt : undefined,
  };
}

export function updateGidoMemberMeta(
  notes: string | null | undefined,
  updates: Partial<GidoMemberMeta>,
) {
  const parsed = parseJson(notes) ?? {};
  const next: GidoParsedJson = { ...parsed };

  if (updates.birthLabel !== undefined) next.birthLabel = updates.birthLabel;

  if (updates.homePinned === undefined) {
    // keep existing
  } else if (updates.homePinned) {
    next.homePinned = true;
  } else {
    delete next.homePinned;
  }

  if (updates.homePinnedAt === undefined) {
    // keep existing
  } else if (updates.homePinnedAt) {
    next.homePinnedAt = updates.homePinnedAt;
  } else {
    delete next.homePinnedAt;
  }

  return Object.keys(next).length > 0 ? JSON.stringify(next) : null;
}

export function parseGidoHouseholdMeta(notes?: string | null): GidoHouseholdMeta {
  const parsed = parseJson(notes);
  if (!parsed) return {};
  return {
    prayers: Array.isArray(parsed.prayers) ? parsed.prayers.filter((item): item is string => typeof item === "string") : undefined,
    contacts: Array.isArray(parsed.contacts) ? parsed.contacts.filter((item): item is string => typeof item === "string") : undefined,
    tags: Array.isArray(parsed.tags) ? parsed.tags.filter((item): item is string => typeof item === "string") : undefined,
    followUps: Array.isArray(parsed.followUps) ? parsed.followUps : undefined,
    updates: Array.isArray(parsed.updates) ? parsed.updates : undefined,
    prayerOrder: typeof parsed.prayerOrder === "number" ? parsed.prayerOrder : undefined,
  };
}

export function getGidoPrayerOrder(title: string, notes?: string | null) {
  const meta = parseGidoHouseholdMeta(notes);
  if (typeof meta.prayerOrder === "number") return meta.prayerOrder;

  const matchedIndex = GIDO_PRAYER_ORDER_KEYWORDS.findIndex((keyword) => title.includes(keyword));
  if (matchedIndex >= 0) return matchedIndex;

  return GIDO_PRAYER_ORDER_KEYWORDS.length + 100;
}
