import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentAccountKey, getCurrentChurchSlug } from "./auth-bridge";

const MEMBER_LOCAL_CACHE_KEY = "soom.mobile.members.local-cache.v2";
const SAMPLE_NAMES = new Set(["김요한", "박마리아", "김요", "박마"]);

export type LocalMember = {
  id: string;
  name: string;
  household: string;
  state: string;
  nextAction: string;
  avatarUrl?: string;
};

export type MemberOverride = {
  name: string;
  household: string;
  state: string;
  nextAction: string;
  avatarUrl?: string;
};

export type MemberLocalCache = {
  added: LocalMember[];
  removedNames: string[];
  overrides: Record<string, MemberOverride>;
};

const EMPTY_CACHE: MemberLocalCache = {
  added: [],
  removedNames: [],
  overrides: {},
};

async function scopedKeys() {
  const slug = (await getCurrentChurchSlug()) ?? "default";
  const accountKey = (await getCurrentAccountKey()) ?? "anon";
  return {
    current: `${MEMBER_LOCAL_CACHE_KEY}:${slug}:${accountKey}`,
    backup: `${MEMBER_LOCAL_CACHE_KEY}:${slug}:${accountKey}:backup`,
    legacy: `${MEMBER_LOCAL_CACHE_KEY}:${slug}`,
  };
}

function normalizeMember(member: Partial<LocalMember>): LocalMember | null {
  if (!member.id || !member.name) return null;
  return {
    id: String(member.id),
    name: String(member.name),
    household: String(member.household ?? "가정 미지정"),
    state: String(member.state ?? "등록"),
    nextAction: String(member.nextAction ?? "다음 액션 미정"),
    avatarUrl: typeof member.avatarUrl === "string" ? member.avatarUrl : undefined,
  };
}

export async function getMemberLocalCache(): Promise<MemberLocalCache> {
  try {
    const keys = await scopedKeys();
    const raw = await AsyncStorage.getItem(keys.current);
    const backupRaw = raw ? null : await AsyncStorage.getItem(keys.backup);
    const legacyRaw = raw || backupRaw ? null : await AsyncStorage.getItem(keys.legacy);
    const source = raw ?? backupRaw ?? legacyRaw;

    if (!source) return EMPTY_CACHE;
    const parsed = JSON.parse(source) as Partial<MemberLocalCache>;

    const added = Array.isArray(parsed.added)
      ? parsed.added.map((item) => normalizeMember(item)).filter((item): item is LocalMember => Boolean(item))
      : [];

    const cleanedAdded = added.filter((member) => !SAMPLE_NAMES.has(member.name));
    const cleanedRemovedNames = Array.isArray(parsed.removedNames)
      ? parsed.removedNames.map((name) => String(name)).filter((name) => !SAMPLE_NAMES.has(name))
      : [];

    const normalized: MemberLocalCache = {
      added: cleanedAdded,
      removedNames: cleanedRemovedNames,
      overrides: parsed.overrides && typeof parsed.overrides === "object" ? (parsed.overrides as Record<string, MemberOverride>) : {},
    };

    if (!raw) {
      await AsyncStorage.setItem(keys.current, JSON.stringify(normalized));
    }

    if (!backupRaw || backupRaw !== JSON.stringify(normalized)) {
      await AsyncStorage.setItem(keys.backup, JSON.stringify(normalized));
    }

    return normalized;
  } catch {
    return EMPTY_CACHE;
  }
}

export async function setMemberLocalCache(cache: MemberLocalCache) {
  const keys = await scopedKeys();
  const serialized = JSON.stringify(cache);
  await AsyncStorage.multiSet([
    [keys.current, serialized],
    [keys.backup, serialized],
  ]);
}

export function applyMemberLocalCache(remote: LocalMember[], cache: MemberLocalCache): LocalMember[] {
  const mergedRemote = remote
    .filter((member) => !cache.removedNames.includes(member.name))
    .map((member) => {
      const override = cache.overrides[member.id];
      return override ? { ...member, ...override } : member;
    });

  const merged = [...cache.added, ...mergedRemote]
    .filter((member) => !cache.removedNames.includes(member.name))
    .filter((member, index, arr) => arr.findIndex((x) => x.id === member.id) === index);

  return merged;
}

export function withAddedMember(cache: MemberLocalCache, member: LocalMember): MemberLocalCache {
  return {
    ...cache,
    added: [member, ...cache.added.filter((item) => item.id !== member.id)],
    removedNames: cache.removedNames.filter((name) => name !== member.name),
  };
}

export function withRemovedMember(cache: MemberLocalCache, member: { id?: string; name: string }): MemberLocalCache {
  return {
    ...cache,
    added: cache.added.filter((item) => item.id !== member.id && item.name !== member.name),
    removedNames: [...new Set([...cache.removedNames, member.name])],
  };
}

export function withMemberOverride(cache: MemberLocalCache, memberId: string, override: MemberOverride): MemberLocalCache {
  return {
    ...cache,
    overrides: {
      ...cache.overrides,
      [memberId]: override,
    },
    added: cache.added.map((item) => (item.id === memberId ? { ...item, ...override } : item)),
  };
}
