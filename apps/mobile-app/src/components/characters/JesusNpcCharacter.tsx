import type { ImageSourcePropType } from "react-native";

import { CharacterStage } from "./CharacterStage";
import { CHARACTER_ART_STANDARD } from "./characterArtGuide";

export type JesusNpcPose = "idle" | "bless" | "teach" | "guide" | "concern" | "joy";

type JesusNpcManifestAsset = {
  pose: string;
  mood: string;
  trigger: string;
  message: string;
};

type JesusNpcManifest = {
  defaultPose: string;
  stateMap: Record<JesusNpcPose, string>;
  assets: JesusNpcManifestAsset[];
};

const manifest = require("../../../assets/characters/jesus_npc/manifest.json") as JesusNpcManifest;

const JESUS_NPC_POSE_IMAGES: Record<string, ImageSourcePropType> = {
  idle_welcome: require("../../../assets/characters/standardized/jesus_npc/jesus_npc_01_idle_welcome_128.png"),
  bless_pray: require("../../../assets/characters/standardized/jesus_npc/jesus_npc_02_bless_pray_128.png"),
  teach_walk: require("../../../assets/characters/standardized/jesus_npc/jesus_npc_03_teach_walk_128.png"),
  guide_walk: require("../../../assets/characters/standardized/jesus_npc/jesus_npc_04_guide_walk_128.png"),
  concern_sit: require("../../../assets/characters/standardized/jesus_npc/jesus_npc_06_concern_sit_128.png"),
  joy_celebrate: require("../../../assets/characters/standardized/jesus_npc/jesus_npc_09_joy_celebrate_128.png"),
};

function resolvePose(pose: JesusNpcPose | undefined) {
  const statePose = pose ? manifest.stateMap[pose] : null;
  return statePose && JESUS_NPC_POSE_IMAGES[statePose] ? statePose : manifest.defaultPose;
}

export function getJesusNpcMessage(pose?: JesusNpcPose) {
  const resolvedPose = resolvePose(pose);
  return manifest.assets.find((asset) => asset.pose === resolvedPose)?.message ?? "오늘도 목장을 함께 돌보자.";
}

export function JesusNpcCharacter({
  pose = "idle",
  displaySize = CHARACTER_ART_STANDARD.canvas,
  message,
  label = "예수님",
}: {
  pose?: JesusNpcPose;
  displaySize?: number;
  message?: string;
  label?: string;
}) {
  const resolvedPose = resolvePose(pose);
  const source = JESUS_NPC_POSE_IMAGES[resolvedPose] ?? JESUS_NPC_POSE_IMAGES[manifest.defaultPose];

  return <CharacterStage source={source} label={label} displaySize={displaySize} message={message} />;
}
