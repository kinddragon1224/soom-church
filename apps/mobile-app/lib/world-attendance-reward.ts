import AsyncStorage from "@react-native-async-storage/async-storage";

import { getCurrentAccountKey, getCurrentChurchSlug } from "./auth-bridge";

const WORLD_ATTENDANCE_KEY = "soom.mobile.world.attendance.v1";
const REWARD_TARGET_DAYS = 7;

// 선용 계정(현재 운영 계정) 즉시 지급 오버라이드
const PREUNLOCK_ACCOUNT_KEYS = new Set([
  "cmnocwsvb0001sv2912ncfy4m", // gido.mokja1@soom.church
]);

export type WorldAttendanceRewardState = {
  lastAttendanceDate: string | null;
  streakCount: number;
  mariaUnlocked: boolean;
  mariaUnlockedAt: string | null;
  rewardTargetDays: number;
};

const EMPTY_STATE: WorldAttendanceRewardState = {
  lastAttendanceDate: null,
  streakCount: 0,
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

function isYesterday(prev: string, next: string) {
  const a = Date.parse(`${prev}T00:00:00.000Z`);
  const b = Date.parse(`${next}T00:00:00.000Z`);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  return b - a === 24 * 60 * 60 * 1000;
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
    streakCount: Number.isFinite(parsed.streakCount) ? Math.max(0, Number(parsed.streakCount)) : 0,
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
    if (next.lastAttendanceDate && isYesterday(next.lastAttendanceDate, today)) {
      next.streakCount += 1;
    } else {
      next.streakCount = Math.max(next.streakCount, 1);
    }

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
