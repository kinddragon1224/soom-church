import AsyncStorage from "@react-native-async-storage/async-storage";

import { getCurrentAccountKey, getCurrentChurchSlug } from "./auth-bridge";

const WORLD_NPC_LAYOUT_KEY = "soom.mobile.world.npc-layout.v3";

type NpcAnchor = {
  nx: number;
  ny: number;
};

export type WorldNpcLayout = {
  jesus: NpcAnchor;
  maria: NpcAnchor;
  johnBaptist: NpcAnchor;
  peter: NpcAnchor;
  johnApostle: NpcAnchor;
};

const DEFAULT_LAYOUT: WorldNpcLayout = {
  jesus: { nx: 0.24, ny: 0.58 },
  maria: { nx: 0.57, ny: 0.58 },
  johnBaptist: { nx: 0.28, ny: 0.66 },
  peter: { nx: 0.78, ny: 0.62 },
  johnApostle: { nx: 0.82, ny: 0.68 },
};

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

async function scopedKey() {
  const churchSlug = (await getCurrentChurchSlug()) ?? "default";
  const accountKey = (await getCurrentAccountKey()) ?? "anon";
  return `${WORLD_NPC_LAYOUT_KEY}:${churchSlug}:${accountKey}`;
}

export async function getWorldNpcLayout(): Promise<WorldNpcLayout> {
  try {
    const raw = await AsyncStorage.getItem(await scopedKey());
    if (!raw) return DEFAULT_LAYOUT;

    const parsed = JSON.parse(raw) as Partial<WorldNpcLayout>;
    return {
      jesus: {
        nx: clamp01(Number(parsed.jesus?.nx ?? DEFAULT_LAYOUT.jesus.nx)),
        ny: clamp01(Number(parsed.jesus?.ny ?? DEFAULT_LAYOUT.jesus.ny)),
      },
      maria: {
        nx: clamp01(Number(parsed.maria?.nx ?? DEFAULT_LAYOUT.maria.nx)),
        ny: clamp01(Number(parsed.maria?.ny ?? DEFAULT_LAYOUT.maria.ny)),
      },
      johnBaptist: {
        nx: clamp01(Number(parsed.johnBaptist?.nx ?? DEFAULT_LAYOUT.johnBaptist.nx)),
        ny: clamp01(Number(parsed.johnBaptist?.ny ?? DEFAULT_LAYOUT.johnBaptist.ny)),
      },
      peter: {
        nx: clamp01(Number(parsed.peter?.nx ?? DEFAULT_LAYOUT.peter.nx)),
        ny: clamp01(Number(parsed.peter?.ny ?? DEFAULT_LAYOUT.peter.ny)),
      },
      johnApostle: {
        nx: clamp01(Number(parsed.johnApostle?.nx ?? DEFAULT_LAYOUT.johnApostle.nx)),
        ny: clamp01(Number(parsed.johnApostle?.ny ?? DEFAULT_LAYOUT.johnApostle.ny)),
      },
    };
  } catch {
    return DEFAULT_LAYOUT;
  }
}

export async function setWorldNpcLayout(layout: WorldNpcLayout) {
  const next: WorldNpcLayout = {
    jesus: {
      nx: clamp01(layout.jesus.nx),
      ny: clamp01(layout.jesus.ny),
    },
    maria: {
      nx: clamp01(layout.maria.nx),
      ny: clamp01(layout.maria.ny),
    },
    johnBaptist: {
      nx: clamp01(layout.johnBaptist.nx),
      ny: clamp01(layout.johnBaptist.ny),
    },
    peter: {
      nx: clamp01(layout.peter.nx),
      ny: clamp01(layout.peter.ny),
    },
    johnApostle: {
      nx: clamp01(layout.johnApostle.nx),
      ny: clamp01(layout.johnApostle.ny),
    },
  };

  await AsyncStorage.setItem(await scopedKey(), JSON.stringify(next));
}
