export type BetaShepherd = {
  id: string;
  name: string;
  status: string;
  note: string;
  accent: string;
  householdCount: number;
  updatedAt: string;
};

export const defaultBetaShepherds: BetaShepherd[] = [
  { id: "shepherd-01", name: "목자 01", status: "방문 가능", note: "최근 방문 기록 없음", accent: "#f6d48a", householdCount: 4, updatedAt: "방금" },
  { id: "shepherd-02", name: "목자 02", status: "방문 가능", note: "이번 주 확인 필요", accent: "#c4b5fd", householdCount: 3, updatedAt: "오늘" },
  { id: "shepherd-03", name: "목자 03", status: "대기", note: "아직 배정 전", accent: "#7dd3fc", householdCount: 0, updatedAt: "대기" },
  { id: "shepherd-04", name: "목자 04", status: "대기", note: "아직 배정 전", accent: "#f9d7a5", householdCount: 0, updatedAt: "대기" },
  { id: "shepherd-05", name: "목자 05", status: "대기", note: "아직 배정 전", accent: "#ffd59e", householdCount: 0, updatedAt: "대기" },
  { id: "shepherd-06", name: "목자 06", status: "대기", note: "아직 배정 전", accent: "#d6bcfa", householdCount: 0, updatedAt: "대기" },
];

const STORAGE_KEY = "soom-beta-shepherds";
const accents = ["#f6d48a", "#c4b5fd", "#7dd3fc", "#f9d7a5", "#ffd59e", "#d6bcfa", "#86efac", "#fca5a5"];

export function parseShepherdCommand(command: string) {
  const normalized = command.trim();

  if (!normalized.startsWith("목자 추가")) {
    return null;
  }

  const payload = normalized.replace(/^목자 추가\s*/, "").trim();
  if (!payload) {
    return { name: "", note: "", householdCount: 0 };
  }

  const parts = payload.split(",").map((part) => part.trim()).filter(Boolean);
  const name = parts[0] || payload;
  const note = parts.slice(1).join(" · ");

  return {
    name,
    note,
    householdCount: 0,
  };
}

export function readShepherdsFromStorage() {
  if (typeof window === "undefined") {
    return defaultBetaShepherds;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBetaShepherds));
    return defaultBetaShepherds;
  }

  try {
    return JSON.parse(raw) as BetaShepherd[];
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBetaShepherds));
    return defaultBetaShepherds;
  }
}

export function addShepherdToStorage(input: { name: string; note?: string; householdCount?: number }) {
  const shepherds = readShepherdsFromStorage();
  const name = input.name.trim();

  if (!name) {
    throw new Error("예: 목자 추가 김은혜, 새가족 2가정 확인");
  }

  const newShepherd: BetaShepherd = {
    id: `shepherd-${Date.now()}`,
    name,
    status: "방문 가능",
    note: input.note?.trim() || "chat에서 추가된 목자",
    accent: accents[shepherds.length % accents.length],
    householdCount: input.householdCount ?? 0,
    updatedAt: "방금",
  };

  const next = [newShepherd, ...shepherds];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return newShepherd;
}
