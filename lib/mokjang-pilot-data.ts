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
  groupName: "우리 목장",
  prayerTitle: "이번 주 중보",
  meetingDate: "2026-04-07",
  households: [
    {
      id: "sample-1",
      title: "샘플 가정",
      members: [
        { name: "샘플 형제", birthYear: "86" },
        { name: "샘플 자매", birthYear: "89" },
      ],
      prayers: ["예배와 일상의 균형이 회복되도록", "가정 안에 평안과 건강이 있도록"],
      contacts: ["가족 중보"],
      tags: ["샘플"],
    },
  ],
  updates: [
    {
      title: "근황 메모를 아직 넣지 않았습니다",
      body: "data/private/mokjang-pilot.json 파일을 두면 실제 목장 데이터가 여기에 반영됩니다.",
      note: "개인 중보 내용은 로컬 전용 파일로 관리합니다.",
    },
  ],
  followUps: [
    {
      title: "실제 목장 데이터 연결",
      note: "개인 중보 내용을 로컬 파일로 넣으면 후속 연락 큐도 같이 살아납니다.",
      due: "오늘",
      priority: "중간",
      owner: "리더",
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
