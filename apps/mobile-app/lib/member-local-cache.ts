import AsyncStorage from "@react-native-async-storage/async-storage";

const MEMBER_LOCAL_CACHE_KEY = "soom.mobile.members.local-cache.v1";

export type LocalMember = {
  id: string;
  name: string;
  household: string;
  state: string;
  nextAction: string;
};

export type MemberOverride = {
  name: string;
  household: string;
  state: string;
  nextAction: string;
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

function normalizeMember(member: Partial<LocalMember>): LocalMember | null {
  if (!member.id || !member.name) return null;
  return {
    id: String(member.id),
    name: String(member.name),
    household: String(member.household ?? "가정 미지정"),
    state: String(member.state ?? "등록"),
    nextAction: String(member.nextAction ?? "다음 액션 미정"),
  };
}

export async function getMemberLocalCache(): Promise<MemberLocalCache> {
  try {
    const raw = await AsyncStorage.getItem(MEMBER_LOCAL_CACHE_KEY);
    if (!raw) return EMPTY_CACHE;
    const parsed = JSON.parse(raw) as Partial<MemberLocalCache>;
    return {
      added: Array.isArray(parsed.added)
        ? parsed.added.map((item) => normalizeMember(item)).filter((item): item is LocalMember => Boolean(item))
        : [],
      removedNames: Array.isArray(parsed.removedNames) ? parsed.removedNames.map((name) => String(name)) : [],
      overrides: parsed.overrides && typeof parsed.overrides === "object" ? (parsed.overrides as Record<string, MemberOverride>) : {},
    };
  } catch {
    return EMPTY_CACHE;
  }
}

export async function setMemberLocalCache(cache: MemberLocalCache) {
  await AsyncStorage.setItem(MEMBER_LOCAL_CACHE_KEY, JSON.stringify(cache));
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
