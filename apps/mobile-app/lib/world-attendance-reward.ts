import AsyncStorage from "@react-native-async-storage/async-storage";

import { getCurrentAccountKey, getCurrentChurchSlug } from "./auth-bridge";

const WORLD_ATTENDANCE_KEY = "soom.mobile.world.attendance.v1";
const REWARD_TARGET_DAYS = 7;

// 선용 계정(현재 운영 계정) 즉시 지급 오버라이드
const PREUNLOCK_ACCOUNT_KEYS = new Set([
  "cmnocwsvb0001sv2912ncfy4m", // gido.mokja1@soom.church
  "cmn2z946b0005svizfauahe9a", // dev@soom.church
  "cmn2z94hd0008svizx28ms8py", // platform-admin@soom.church
  "anon", // fallback: accountKey 미동기화 기기
  "default",
  "manual-local",
]);

export type WorldAttendanceRewardState = {
  lastAttendanceDate: string | null;
  totalAttendanceDays: number;
  streakCount: number;
  lastCheckWasConsecutive: boolean;
  mariaUnlocked: boolean;
  mariaUnlockedAt: string | null;
  rewardTargetDays: number;
};

const EMPTY_STATE: WorldAttendanceRewardState = {
  lastAttendanceDate: null,
  totalAttendanceDays: 0,
  streakCount: 0,
  lastCheckWasConsecutive: false,
  mariaUnlocked: false,
  mariaUnlockedAt: null,
  rewardTargetDays: REWARD_TARGET_DAYS,
};

function toKstDateToken(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const y = parts.find((part) => part.type === "year")?.value ?? "0000";
  const m = parts.find((part) => part.type === "month")?.value ?? "01";
  const d = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${y}-${m}-${d}`;
}

function isValidDateToken(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function previousDateToken(dateToken: string) {
  if (!isValidDateToken(dateToken)) return null;
  const [y, m, d] = dateToken.split("-").map(Number);
  if (!y || !m || !d) return null;
  const utc = new Date(Date.UTC(y, m - 1, d) - 24 * 60 * 60 * 1000);
  const py = utc.getUTCFullYear();
  const pm = `${utc.getUTCMonth() + 1}`.padStart(2, "0");
  const pd = `${utc.getUTCDate()}`.padStart(2, "0");
  return `${py}-${pm}-${pd}`;
}

async function scopedKey() {
  const churchSlug = (await getCurrentChurchSlug()) ?? "default";
  const accountKey = (await getCurrentAccountKey()) ?? "anon";
  return `${WORLD_ATTENDANCE_KEY}:${churchSlug}:${accountKey}`;
}

function normalizeState(value: unknown): WorldAttendanceRewardState {
  if (!value || typeof value !== "object") return EMPTY_STATE;
  const parsed = value as Partial<WorldAttendanceRewardState>;
  return {
    lastAttendanceDate: typeof parsed.lastAttendanceDate === "string" ? parsed.lastAttendanceDate : null,
    totalAttendanceDays: Number.isFinite(parsed.totalAttendanceDays) ? Math.max(0, Number(parsed.totalAttendanceDays)) : 0,
    streakCount: Number.isFinite(parsed.streakCount) ? Math.max(0, Number(parsed.streakCount)) : 0,
    lastCheckWasConsecutive: Boolean(parsed.lastCheckWasConsecutive),
    mariaUnlocked: Boolean(parsed.mariaUnlocked),
    mariaUnlockedAt: typeof parsed.mariaUnlockedAt === "string" ? parsed.mariaUnlockedAt : null,
    rewardTargetDays: REWARD_TARGET_DAYS,
  };
}

export async function registerWorldAttendanceToday(): Promise<WorldAttendanceRewardState> {
  const key = await scopedKey();
  const raw = await AsyncStorage.getItem(key);
  const state = normalizeState(raw ? JSON.parse(raw) : null);
  const today = toKstDateToken();
  const accountKey = (await getCurrentAccountKey()) ?? "anon";

  let next = { ...state };

  if (PREUNLOCK_ACCOUNT_KEYS.has(accountKey) && !next.mariaUnlocked) {
    next.mariaUnlocked = true;
    next.mariaUnlockedAt = today;
    next.streakCount = Math.max(next.streakCount, REWARD_TARGET_DAYS);
  }

  if (next.lastAttendanceDate !== today) {
    const yesterday = previousDateToken(today);
    const wasConsecutive = Boolean(next.lastAttendanceDate && yesterday && next.lastAttendanceDate === yesterday);

    if (wasConsecutive) {
      next.streakCount += 1;
      next.lastCheckWasConsecutive = true;
    } else {
      next.streakCount = 1;
      next.lastCheckWasConsecutive = false;
    }

    next.totalAttendanceDays += 1;
    next.lastAttendanceDate = today;

    if (next.streakCount >= REWARD_TARGET_DAYS && !next.mariaUnlocked) {
      next.mariaUnlocked = true;
      next.mariaUnlockedAt = today;
    }
  }

  await AsyncStorage.setItem(key, JSON.stringify(next));
  return next;
}

export async function getWorldAttendanceRewardState(): Promise<WorldAttendanceRewardState> {
  const key = await scopedKey();
  const raw = await AsyncStorage.getItem(key);
  return normalizeState(raw ? JSON.parse(raw) : null);
}
