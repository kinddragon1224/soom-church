export type BetaMember = {
  id: string;
  name: string;
  status: string;
  note: string;
  accent: string;
  groupName: string;
  updatedAt: string;
};

export const defaultBetaMembers: BetaMember[] = [
  { id: "member-01", name: "김은혜", status: "새 방문", note: "이번 주 첫 연결", accent: "#f6d48a", groupName: "새가족", updatedAt: "방금" },
  { id: "member-02", name: "박요한", status: "돌봄 필요", note: "청년 목장 연결 필요", accent: "#c4b5fd", groupName: "청년", updatedAt: "오늘" },
  { id: "member-03", name: "이서윤", status: "기도", note: "기도 요청 확인", accent: "#7dd3fc", groupName: "사랑", updatedAt: "오늘" },
  { id: "member-04", name: "최민준", status: "후속", note: "재방문 일정 조율", accent: "#f9d7a5", groupName: "희망", updatedAt: "어제" },
  { id: "member-05", name: "정하늘", status: "안정", note: "꾸준히 참여 중", accent: "#ffd59e", groupName: "평안", updatedAt: "어제" },
  { id: "member-06", name: "한지우", status: "대기", note: "아직 메모 없음", accent: "#d6bcfa", groupName: "미정", updatedAt: "대기" },
];

const STORAGE_KEY = "soom-beta-members";
const LEGACY_STORAGE_KEY = "soom-beta-shepherds";
const accents = ["#f6d48a", "#c4b5fd", "#7dd3fc", "#f9d7a5", "#ffd59e", "#d6bcfa", "#86efac", "#fca5a5"];

export function parseMemberCommand(command: string) {
  const normalized = command.trim();

  if (!normalized.startsWith("목원 추가")) {
    return null;
  }

  const payload = normalized.replace(/^목원 추가\s*/, "").trim();
  if (!payload) {
    return { name: "", note: "", groupName: "미정" };
  }

  const parts = payload.split(",").map((part) => part.trim()).filter(Boolean);
  const name = parts[0] || payload;
  const note = parts.slice(1).join(" · ");

  return {
    name,
    note,
    groupName: "미정",
  };
}

function migrateLegacyShepherds(raw: string | null) {
  if (!raw) return null;

  try {
    const legacy = JSON.parse(raw) as Array<{ id: string; name: string; status: string; note: string; accent: string; updatedAt: string }>;
    return legacy.map((item, index) => ({
      id: item.id || `member-legacy-${index}`,
      name: item.name,
      status: item.status || "후속",
      note: item.note || "이전 목양 데이터에서 옮김",
      accent: item.accent || accents[index % accents.length],
      groupName: "미정",
      updatedAt: item.updatedAt || "이전",
    })) as BetaMember[];
  } catch {
    return null;
  }
}

export function readMembersFromStorage() {
  if (typeof window === "undefined") {
    return defaultBetaMembers;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as BetaMember[];
    } catch {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBetaMembers));
      return defaultBetaMembers;
    }
  }

  const migrated = migrateLegacyShepherds(window.localStorage.getItem(LEGACY_STORAGE_KEY));
  if (migrated) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBetaMembers));
  return defaultBetaMembers;
}

export function addMemberToStorage(input: { name: string; note?: string; groupName?: string }) {
  const members = readMembersFromStorage();
  const name = input.name.trim();

  if (!name) {
    throw new Error("예: 목원 추가 김은혜, 새가족 2가정 확인");
  }

  const newMember: BetaMember = {
    id: `member-${Date.now()}`,
    name,
    status: "새 방문",
    note: input.note?.trim() || "chat에서 추가된 목원",
    accent: accents[members.length % accents.length],
    groupName: input.groupName?.trim() || "미정",
    updatedAt: "방금",
  };

  const next = [newMember, ...members];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return newMember;
}
