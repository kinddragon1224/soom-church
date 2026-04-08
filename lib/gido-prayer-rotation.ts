export type GidoPrayerRotationMember = {
  name: string;
  householdName: string;
};

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
