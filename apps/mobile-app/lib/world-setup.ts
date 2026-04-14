import AsyncStorage from "@react-native-async-storage/async-storage";

const WORLD_SETUP_KEY = "soom.mobile.world.setup.v1";

export type MemberSource = "manual" | "csv" | "chat";

export type WorldSetupState = {
  completed: boolean;
  churchName: string;
  region: string;
  mokjangName: string;
  memberSource: MemberSource;
  memberTargetCount: number; // 0 means "미정"
  createdAt: number;
};

function normalizeText(value: string) {
  return value.trim();
}

function normalizeCount(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1000, Math.floor(value)));
}

export async function getWorldSetupState(): Promise<WorldSetupState | null> {
  try {
    const raw = await AsyncStorage.getItem(WORLD_SETUP_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<WorldSetupState>;
    if (!parsed || typeof parsed !== "object") return null;

    if (!parsed.completed) return null;

    return {
      completed: true,
      churchName: normalizeText(String(parsed.churchName ?? "")),
      region: normalizeText(String(parsed.region ?? "")),
      mokjangName: normalizeText(String(parsed.mokjangName ?? "")),
      memberSource: parsed.memberSource === "csv" || parsed.memberSource === "chat" ? parsed.memberSource : "manual",
      memberTargetCount: normalizeCount(Number(parsed.memberTargetCount ?? 0)),
      createdAt: typeof parsed.createdAt === "number" ? parsed.createdAt : Date.now(),
    };
  } catch {
    return null;
  }
}

export async function saveWorldSetupState(input: {
  churchName: string;
  region: string;
  mokjangName: string;
  memberSource: MemberSource;
  memberTargetCount: number;
}) {
  const next: WorldSetupState = {
    completed: true,
    churchName: normalizeText(input.churchName),
    region: normalizeText(input.region),
    mokjangName: normalizeText(input.mokjangName),
    memberSource: input.memberSource,
    memberTargetCount: normalizeCount(input.memberTargetCount),
    createdAt: Date.now(),
  };

  await AsyncStorage.setItem(WORLD_SETUP_KEY, JSON.stringify(next));
}
