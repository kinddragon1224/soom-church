import fs from "node:fs";
import path from "node:path";

export type MokjangMember = {
  name: string;
  birthYear?: string;
};

export type MokjangHousehold = {
  id: string;
  title: string;
  members?: MokjangMember[];
  prayers: string[];
  contacts?: string[];
  tags?: string[];
};

export type MokjangUpdate = {
  title: string;
  body: string;
  note?: string;
  due?: string;
};

export type MokjangFollowUp = {
  title: string;
  note: string;
  due: string;
  priority: "높음" | "중간" | "낮음";
  owner?: string;
};

export type MokjangPilotData = {
  groupName: string;
  prayerTitle: string;
  meetingDate: string;
  households: MokjangHousehold[];
  updates: MokjangUpdate[];
  followUps: MokjangFollowUp[];
};

const fallbackData: MokjangPilotData = {
  groupName: "G.I.D.O 목장",
  prayerTitle: "이번 주 목장월드",
  meetingDate: "2026-04-07",
  households: [],
  updates: [],
  followUps: [
    {
      title: "첫 목원 등록 시작",
      note: "목원 등록 섹션부터 채우고, 이어서 후속 관리와 가정별 중보를 연결합니다.",
      due: "오늘",
      priority: "중간",
      owner: "목장",
    },
  ],
};

function privateDataPath() {
  return path.join(process.cwd(), "data", "private", "mokjang-pilot.json");
}

export function loadMokjangPilotData(): MokjangPilotData {
  try {
    const raw = fs.readFileSync(privateDataPath(), "utf8");
    const parsed = JSON.parse(raw) as MokjangPilotData;
    if (!parsed.households?.length) {
      return fallbackData;
    }
    return parsed;
  } catch {
    return fallbackData;
  }
}

export function getMokjangStats(data: MokjangPilotData) {
  const memberCount = data.households.reduce((sum, household) => sum + (household.members?.length ?? 0), 0);
  const prayerCount = data.households.reduce((sum, household) => sum + household.prayers.length, 0);
  const contactCount = data.households.reduce((sum, household) => sum + (household.contacts?.length ?? 0), 0);

  return [
    { label: "가정 수", value: String(data.households.length), delta: "이번 주 기준" },
    { label: "목장 멤버", value: String(memberCount), delta: "부부 기준" },
    { label: "중보 요청", value: String(prayerCount), delta: "가정별 기도제목" },
    { label: "함께 품는 이름", value: String(contactCount), delta: "가족·전도 대상" },
  ] as const;
}
