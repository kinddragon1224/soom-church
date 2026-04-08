export type GidoPrayerRotationMember = {
  name: string;
  householdName: string;
};

export type GidoPrayerRotationHousehold = {
  title: string;
  prayerOrder?: number | null;
};

const GIDO_PRAYER_ROTATION_ANCHOR = "2026-04-02";

export function getDailyPrayerTargets<T extends GidoPrayerRotationMember>(members: T[], count: number) {
  if (members.length === 0) return [] as T[];

  const sortedMembers = [...members].sort((a, b) => {
    const householdCompare = a.householdName.localeCompare(b.householdName, "ko-KR");
    if (householdCompare !== 0) return householdCompare;
    return a.name.localeCompare(b.name, "ko-KR");
  });

  const dateKey = getSeoulDateKey();
  const seed = Number(dateKey.replace(/-/g, ""));
  const startIndex = seed % sortedMembers.length;

  return Array.from({ length: Math.min(count, sortedMembers.length) }, (_, index) => sortedMembers[(startIndex + index) % sortedMembers.length]);
}

export function getDailyPrayerHouseholds<T extends GidoPrayerRotationHousehold>(households: T[], count: number) {
  if (households.length === 0) return [] as T[];

  const sortedHouseholds = [...households].sort((a, b) => {
    const orderDiff = (a.prayerOrder ?? Number.MAX_SAFE_INTEGER) - (b.prayerOrder ?? Number.MAX_SAFE_INTEGER);
    if (orderDiff !== 0) return orderDiff;
    return a.title.localeCompare(b.title, "ko-KR");
  });
  const startIndex = mod(getSeoulDayDiffFromAnchor(), sortedHouseholds.length);

  return Array.from({ length: Math.min(count, sortedHouseholds.length) }, (_, index) => sortedHouseholds[(startIndex + index) % sortedHouseholds.length]);
}

function getSeoulDayDiffFromAnchor(date = new Date()) {
  const current = getSeoulDateKey(date);
  const currentUtc = Date.parse(`${current}T00:00:00Z`);
  const anchorUtc = Date.parse(`${GIDO_PRAYER_ROTATION_ANCHOR}T00:00:00Z`);
  return Math.floor((currentUtc - anchorUtc) / 86400000);
}

function mod(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

export function getSeoulDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const get = (type: "year" | "month" | "day") => parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}`;
}
