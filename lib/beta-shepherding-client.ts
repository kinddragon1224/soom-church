export type BetaMember = {
  id: string;
  name: string;
  gender: string;
  age: string;
  phone: string;
  address: string;
  job: string;
  role: string;
  district: string;
  ministry: string;
  relationship: string;
  baptized: boolean;
  status: string;
  note: string;
  accent: string;
  groupName: string;
  updatedAt: string;
};

export const defaultBetaMembers: BetaMember[] = [
  {
    id: "member-01",
    name: "김은혜",
    gender: "여",
    age: "34",
    phone: "010-1234-5678",
    address: "수원 영통구",
    job: "간호사",
    role: "없음",
    district: "1교구",
    ministry: "없음",
    relationship: "새가족",
    baptized: false,
    status: "새 방문",
    note: "이번 주 첫 연결",
    accent: "#f6d48a",
    groupName: "새가족",
    updatedAt: "방금",
  },
  {
    id: "member-02",
    name: "박요한",
    gender: "남",
    age: "29",
    phone: "010-2222-3333",
    address: "성남 분당구",
    job: "개발자",
    role: "없음",
    district: "청년",
    ministry: "찬양",
    relationship: "기존 연결",
    baptized: true,
    status: "돌봄 필요",
    note: "청년 목장 연결 필요",
    accent: "#c4b5fd",
    groupName: "청년",
    updatedAt: "오늘",
  },
  {
    id: "member-03",
    name: "이서윤",
    gender: "여",
    age: "42",
    phone: "010-4444-5555",
    address: "용인 수지구",
    job: "교사",
    role: "집사",
    district: "2교구",
    ministry: "교육",
    relationship: "기존 목원",
    baptized: true,
    status: "기도",
    note: "기도 요청 확인",
    accent: "#7dd3fc",
    groupName: "사랑",
    updatedAt: "오늘",
  },
  {
    id: "member-04",
    name: "최민준",
    gender: "남",
    age: "38",
    phone: "010-6666-7777",
    address: "화성 동탄",
    job: "자영업",
    role: "없음",
    district: "3교구",
    ministry: "없음",
    relationship: "후속 대상",
    baptized: false,
    status: "후속",
    note: "재방문 일정 조율",
    accent: "#f9d7a5",
    groupName: "희망",
    updatedAt: "어제",
  },
  {
    id: "member-05",
    name: "정하늘",
    gender: "여",
    age: "31",
    phone: "010-8888-9999",
    address: "서울 강동구",
    job: "디자이너",
    role: "없음",
    district: "청년",
    ministry: "미디어",
    relationship: "기존 목원",
    baptized: true,
    status: "안정",
    note: "꾸준히 참여 중",
    accent: "#ffd59e",
    groupName: "평안",
    updatedAt: "어제",
  },
  {
    id: "member-06",
    name: "한지우",
    gender: "미정",
    age: "미상",
    phone: "미입력",
    address: "미입력",
    job: "미입력",
    role: "없음",
    district: "미정",
    ministry: "없음",
    relationship: "미정",
    baptized: false,
    status: "대기",
    note: "아직 메모 없음",
    accent: "#d6bcfa",
    groupName: "미정",
    updatedAt: "대기",
  },
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
    return {
      name: "",
      gender: "미정",
      age: "미상",
      phone: "미입력",
      relationship: "미정",
      note: "",
      address: "미입력",
      job: "미입력",
      role: "없음",
      district: "미정",
      ministry: "없음",
      baptized: false,
      groupName: "미정",
    };
  }

  const parts = payload.split(",").map((part) => part.trim()).filter(Boolean);
  const [name = "", gender = "미정", age = "미상", phone = "미입력", relationship = "미정", note = ""] = parts;

  return {
    name,
    gender,
    age,
    phone,
    relationship,
    note,
    address: "미입력",
    job: "미입력",
    role: "없음",
    district: "미정",
    ministry: "없음",
    baptized: false,
    groupName: relationship || "미정",
  };
}

function normalizeMember(partial: Partial<BetaMember>, index: number): BetaMember {
  return {
    id: partial.id || `member-${index}`,
    name: partial.name || `목원 ${index + 1}`,
    gender: partial.gender || "미정",
    age: partial.age || "미상",
    phone: partial.phone || "미입력",
    address: partial.address || "미입력",
    job: partial.job || "미입력",
    role: partial.role || "없음",
    district: partial.district || "미정",
    ministry: partial.ministry || "없음",
    relationship: partial.relationship || partial.groupName || "미정",
    baptized: Boolean(partial.baptized),
    status: partial.status || "대기",
    note: partial.note || "메모 없음",
    accent: partial.accent || accents[index % accents.length],
    groupName: partial.groupName || partial.relationship || "미정",
    updatedAt: partial.updatedAt || "방금",
  };
}

function migrateLegacyShepherds(raw: string | null) {
  if (!raw) return null;

  try {
    const legacy = JSON.parse(raw) as Array<{ id: string; name: string; status: string; note: string; accent: string; updatedAt: string }>;
    return legacy.map((item, index) =>
      normalizeMember(
        {
          id: item.id,
          name: item.name,
          status: item.status || "후속",
          note: item.note || "이전 목양 데이터에서 옮김",
          accent: item.accent,
          updatedAt: item.updatedAt || "이전",
        },
        index,
      ),
    );
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
      const parsed = JSON.parse(raw) as Partial<BetaMember>[];
      const normalized = parsed.map((item, index) => normalizeMember(item, index));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
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

export function addMemberToStorage(input: {
  name: string;
  gender?: string;
  age?: string;
  phone?: string;
  relationship?: string;
  note?: string;
  address?: string;
  job?: string;
  role?: string;
  district?: string;
  ministry?: string;
  baptized?: boolean;
  groupName?: string;
}) {
  const members = readMembersFromStorage();
  const name = input.name.trim();

  if (!name) {
    throw new Error("예: 목원 추가 김은혜, 여, 34, 010-1234-5678, 새가족, 이번 주 첫 방문");
  }

  const newMember: BetaMember = {
    id: `member-${Date.now()}`,
    name,
    gender: input.gender?.trim() || "미정",
    age: input.age?.trim() || "미상",
    phone: input.phone?.trim() || "미입력",
    address: input.address?.trim() || "미입력",
    job: input.job?.trim() || "미입력",
    role: input.role?.trim() || "없음",
    district: input.district?.trim() || "미정",
    ministry: input.ministry?.trim() || "없음",
    relationship: input.relationship?.trim() || "미정",
    baptized: Boolean(input.baptized),
    status: "새 방문",
    note: input.note?.trim() || "chat에서 추가된 목원",
    accent: accents[members.length % accents.length],
    groupName: input.groupName?.trim() || input.relationship?.trim() || "미정",
    updatedAt: "방금",
  };

  const next = [newMember, ...members];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return newMember;
}
