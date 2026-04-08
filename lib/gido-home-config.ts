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
  prayerOrder?: number | null;
};

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

export function updateGidoHouseholdMeta(
  notes: string | null | undefined,
  updates: Partial<Pick<GidoHouseholdMeta, "prayers" | "contacts" | "tags" | "prayerOrder">>,
) {
  const parsed = parseJson(notes) ?? {};
  const next: GidoParsedJson = { ...parsed };

  if (updates.prayers !== undefined) {
    if (updates.prayers.length > 0) next.prayers = updates.prayers;
    else delete next.prayers;
  }

  if (updates.contacts !== undefined) {
    if (updates.contacts.length > 0) next.contacts = updates.contacts;
    else delete next.contacts;
  }

  if (updates.tags !== undefined) {
    if (updates.tags.length > 0) next.tags = updates.tags;
    else delete next.tags;
  }

  if (updates.prayerOrder !== undefined) {
    if (typeof updates.prayerOrder === "number" && Number.isFinite(updates.prayerOrder)) next.prayerOrder = updates.prayerOrder;
    else delete next.prayerOrder;
  }

  return Object.keys(next).length > 0 ? JSON.stringify(next) : null;
}

export function getGidoPrayerOrder(_title: string, notes?: string | null) {
  const meta = parseGidoHouseholdMeta(notes);
  return typeof meta.prayerOrder === "number" ? meta.prayerOrder : null;
}
