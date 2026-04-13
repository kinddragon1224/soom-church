import type { ImageSourcePropType } from "react-native";

import type { WorldObjectKind } from "./world-model";

export type WorldAssetSlot = "world" | "house" | "person" | "hub";
export type SpriteFrame = "normal" | "selected" | "alert" | "done";

export const worldAssetSlotByKind: Record<WorldObjectKind, WorldAssetSlot> = {
  house: "house",
  person: "person",
  hub: "hub",
};

export const worldAssetFallbackSources: Record<WorldAssetSlot, ImageSourcePropType> = {
  world: require("../assets/sprites/hub.jpg"),
  house: require("../assets/sprites/house.jpg"),
  person: require("../assets/sprites/person.png"),
  hub: require("../assets/sprites/hub.jpg"),
};

export const worldAssetFrameTone: Record<SpriteFrame, { border: string; bg: string; badge: string }> = {
  normal: { border: "rgba(255,255,255,0.25)", bg: "rgba(9,14,24,0.45)", badge: "#9fb2c8" },
  selected: { border: "#f4d38e", bg: "rgba(75,52,18,0.42)", badge: "#f4d38e" },
  alert: { border: "#f2a8a8", bg: "rgba(74,29,29,0.5)", badge: "#f2a8a8" },
  done: { border: "#8fe0aa", bg: "rgba(22,54,37,0.5)", badge: "#8fe0aa" },
};

export function worldAssetSize(slot: WorldAssetSlot) {
  if (slot === "person") return { width: 28, height: 36 };
  if (slot === "world") return { width: 52, height: 38 };
  return { width: 40, height: 32 };
}

export function worldAssetResizeMode(slot: WorldAssetSlot) {
  return slot === "person" ? "contain" : "cover";
}
