import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentAccountKey, getCurrentChurchSlug } from "./auth-bridge";

const MEMBER_LOCAL_CACHE_KEY = "soom.mobile.members.local-cache.v2";
const SAMPLE_NAMES = new Set(["김요한", "박마리아", "김요", "박마"]);

export type PastoralRecordCategory = "STATUS" | "PRAYER" | "CARE" | "FOLLOW_UP" | "ATTENDANCE";

export type PastoralRecord = {
  id: string;
  memberId: string;
  category: PastoralRecordCategory;
  title: string;
  body: string;
  state?: string;
  createdAt: string;
};

export type LocalMember = {
  id: string;
  name: string;
  household: string;
  state: string;
  nextAction: string;
  avatarUrl?: string;
  prayerRequest?: string;
  careMemo?: string;
  followUpMemo?: string;
};

export type MemberOverride = {
  name: string;
  household: string;
  state: string;
  nextAction: string;
  avatarUrl?: string;
  prayerRequest?: string;
  careMemo?: string;
  followUpMemo?: string;
};

export type MemberLocalCache = {
  added: LocalMember[];
  removedNames: string[];
  overrides: Record<string, MemberOverride>;
  meetingRecords: MokjangMeetingRecord[];
  pastoralRecords: Record<string, PastoralRecord[]>;
};

export type AttendanceStatus = "PRESENT" | "ABSENT" | "ONLINE" | "UNKNOWN";

export type MokjangMeetingAttendance = {
  memberId: string;
  memberName: string;
  status: AttendanceStatus;
  absenceReason?: string;
  needsFollowUp?: boolean;
};

export type MokjangMeetingRecord = {
  id: string;
  meetingDate: string;
  title: string;
  attendances: MokjangMeetingAttendance[];
  createdAt: string;
  updatedAt: string;
};

const EMPTY_CACHE: MemberLocalCache = {
  added: [],
  removedNames: [],
  overrides: {},
  meetingRecords: [],
  pastoralRecords: {},
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
    prayerRequest: typeof member.prayerRequest === "string" ? member.prayerRequest : undefined,
    careMemo: typeof member.careMemo === "string" ? member.careMemo : undefined,
    followUpMemo: typeof member.followUpMemo === "string" ? member.followUpMemo : undefined,
  };
}

function normalizePastoralRecord(memberId: string, record: Partial<PastoralRecord>): PastoralRecord | null {
  const title = typeof record.title === "string" ? record.title.trim() : "";
  const body = typeof record.body === "string" ? record.body.trim() : "";
  const category = typeof record.category === "string" ? record.category : "CARE";
  if (!title || !body) return null;
  if (!["STATUS", "PRAYER", "CARE", "FOLLOW_UP", "ATTENDANCE"].includes(category)) return null;

  return {
    id: typeof record.id === "string" && record.id ? record.id : `local-record-${Date.now()}`,
    memberId,
    category: category as PastoralRecordCategory,
    title,
    body,
    state: typeof record.state === "string" && record.state.trim() ? record.state.trim() : undefined,
    createdAt: typeof record.createdAt === "string" && record.createdAt ? record.createdAt : new Date().toISOString(),
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

    const pastoralRecords = parsed.pastoralRecords && typeof parsed.pastoralRecords === "object"
      ? Object.entries(parsed.pastoralRecords).reduce<Record<string, PastoralRecord[]>>((acc, [memberId, records]) => {
          if (!Array.isArray(records)) return acc;
          const normalized = records
            .map((record) => normalizePastoralRecord(memberId, record as Partial<PastoralRecord>))
            .filter((record): record is PastoralRecord => Boolean(record))
            .slice(0, 50);
          acc[memberId] = normalized;
          return acc;
        }, {})
      : {};

    const normalized: MemberLocalCache = {
      added: cleanedAdded,
      removedNames: cleanedRemovedNames,
      overrides: parsed.overrides && typeof parsed.overrides === "object" ? (parsed.overrides as Record<string, MemberOverride>) : {},
      meetingRecords: Array.isArray(parsed.meetingRecords)
        ? parsed.meetingRecords
            .map((item) => {
              if (!item || typeof item !== "object") return null;
              const typed = item as Partial<MokjangMeetingRecord>;
              return {
                id: String(typed.id ?? ""),
                meetingDate: String(typed.meetingDate ?? ""),
                title: String(typed.title ?? "이번 주 목장 모임"),
                attendances: Array.isArray(typed.attendances)
                  ? typed.attendances
                      .map((attendance) => {
                        if (!attendance || typeof attendance !== "object") return null;
                        const a = attendance as Partial<MokjangMeetingAttendance>;
                        const rawStatus = String(a.status ?? "UNKNOWN");
                        const status: AttendanceStatus = rawStatus === "PRESENT" || rawStatus === "ABSENT" || rawStatus === "ONLINE" ? rawStatus : "UNKNOWN";
                        return {
                          memberId: String(a.memberId ?? ""),
                          memberName: String(a.memberName ?? ""),
                          status,
                          absenceReason: typeof a.absenceReason === "string" ? a.absenceReason : undefined,
                          needsFollowUp: typeof a.needsFollowUp === "boolean" ? a.needsFollowUp : undefined,
                        };
                      })
                      .filter((attendance) => Boolean(attendance && attendance.memberId && attendance.memberName)) as MokjangMeetingAttendance[]
                  : [],
                createdAt: String(typed.createdAt ?? new Date().toISOString()),
                updatedAt: String(typed.updatedAt ?? new Date().toISOString()),
              } as MokjangMeetingRecord;
            })
            .filter((record): record is MokjangMeetingRecord => Boolean(record && record.id))
        : [],
      pastoralRecords,
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

export function appendPastoralRecords(
  cache: MemberLocalCache,
  memberId: string,
  records: Omit<PastoralRecord, "id" | "memberId" | "createdAt">[]
): MemberLocalCache {
  const existing = cache.pastoralRecords[memberId] ?? [];
  const now = Date.now();
  const freshRecords = records
    .map((record, index) => {
      const body = record.body?.trim() ?? "";
      const title = record.title?.trim() ?? "";
      if (!body || !title) return null;
      return {
        id: `local-record-${now}-${index}`,
        memberId,
        category: record.category,
        title,
        body,
        state: record.state?.trim() || undefined,
        createdAt: new Date().toISOString(),
      } as PastoralRecord;
    })
    .filter((record): record is PastoralRecord => Boolean(record));

  const dedupedFresh = freshRecords.filter((record, index, arr) => {
    if (index === 0) return true;
    const prev = arr[index - 1];
    return !(prev.category === record.category && prev.title === record.title && prev.body === record.body && prev.state === record.state);
  });

  let next = existing;
  for (const record of dedupedFresh.reverse()) {
    const prev = next[0];
    if (prev && prev.category === record.category && prev.title === record.title && prev.body === record.body && prev.state === record.state) {
      continue;
    }
    next = [record, ...next].slice(0, 50);
  }

  return {
    ...cache,
    pastoralRecords: {
      ...cache.pastoralRecords,
      [memberId]: next,
    },
  };
}

export function getMemberPastoralRecords(cache: MemberLocalCache, memberId: string): PastoralRecord[] {
  return cache.pastoralRecords[memberId] ?? [];
}

export function getTodayMeetingId(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `meeting-${yyyy}-${mm}-${dd}`;
}

export function upsertMokjangMeetingRecord(cache: MemberLocalCache, record: MokjangMeetingRecord): MemberLocalCache {
  const deduped = cache.meetingRecords.filter((item) => item.id !== record.id);
  return {
    ...cache,
    meetingRecords: [record, ...deduped].slice(0, 30),
  };
}
