import type { ImageResizeMode, ImageSourcePropType } from "react-native";

import type { WorldObjectKind } from "./world-model";

export type WorldAssetSlot = "world" | "house" | "person" | "hub";
export type SpriteFrame = "normal" | "selected" | "alert" | "done";

type WorldAssetTone = { border: string; bg: string; badge: string };
type WorldAssetSize = { width: number; height: number };

export type WorldAssetSpec = {
  slot: WorldAssetSlot;
  key: string;
  fallbackFile: string;
  source: ImageSourcePropType;
  size: WorldAssetSize;
  resizeMode: ImageResizeMode;
};

export const WORLD_ASSET_BASE_PATH = "apps/mobile-app/assets/sprites";

export const worldAssetSlotByKind: Record<WorldObjectKind, WorldAssetSlot> = {
  house: "house",
  person: "person",
  hub: "hub",
};

const worldAssetToneByFrame: Record<SpriteFrame, WorldAssetTone> = {
  normal: { border: "rgba(255,255,255,0.25)", bg: "rgba(9,14,24,0.45)", badge: "#9fb2c8" },
  selected: { border: "#f4d38e", bg: "rgba(75,52,18,0.42)", badge: "#f4d38e" },
  alert: { border: "#f2a8a8", bg: "rgba(74,29,29,0.5)", badge: "#f2a8a8" },
  done: { border: "#8fe0aa", bg: "rgba(22,54,37,0.5)", badge: "#8fe0aa" },
};

const worldAssetRegistry: Record<WorldAssetSlot, WorldAssetSpec> = {
  world: {
    slot: "world",
    key: "world.default",
    fallbackFile: "hub.jpg",
    source: require("../assets/sprites/hub.jpg"),
    size: { width: 52, height: 38 },
    resizeMode: "cover",
  },
  house: {
    slot: "house",
    key: "house.default",
    fallbackFile: "house.jpg",
    source: require("../assets/sprites/house.jpg"),
    size: { width: 40, height: 32 },
    resizeMode: "cover",
  },
  person: {
    slot: "person",
    key: "person.default",
    fallbackFile: "person.png",
    source: require("../assets/sprites/person.png"),
    size: { width: 28, height: 36 },
    resizeMode: "contain",
  },
  hub: {
    slot: "hub",
    key: "hub.default",
    fallbackFile: "hub.jpg",
    source: require("../assets/sprites/hub.jpg"),
    size: { width: 40, height: 32 },
    resizeMode: "cover",
  },
};

export const worldAssetFallbackSources: Record<WorldAssetSlot, ImageSourcePropType> = Object.fromEntries(
  Object.entries(worldAssetRegistry).map(([slot, spec]) => [slot, spec.source]),
) as Record<WorldAssetSlot, ImageSourcePropType>;

export const worldAssetFrameTone: Record<SpriteFrame, WorldAssetTone> = worldAssetToneByFrame;

export function getWorldAssetSpec(slot: WorldAssetSlot) {
  return worldAssetRegistry[slot];
}

export function worldAssetSize(slot: WorldAssetSlot) {
  return getWorldAssetSpec(slot).size;
}

export function worldAssetResizeMode(slot: WorldAssetSlot) {
  return getWorldAssetSpec(slot).resizeMode;
}

export function worldAssetFallbackPath(slot: WorldAssetSlot) {
  return `${WORLD_ASSET_BASE_PATH}/${getWorldAssetSpec(slot).fallbackFile}`;
}

export function worldAssetVariantKey(slot: WorldAssetSlot, frame: SpriteFrame = "normal") {
  return `${slot}.${frame}`;
}
