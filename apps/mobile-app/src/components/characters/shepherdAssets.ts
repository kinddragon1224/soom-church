import type { ImageSourcePropType } from "react-native";

import type { HomePastoralState, ShepherdPose } from "./shepherdTypes";

export const SHEPHERD_POSE_IMAGES: Record<ShepherdPose, ImageSourcePropType> = {
  idle: require("../../../assets/characters/standardized/shepherd_lv1/shepherd_lv1_idle_greeting_128.png"),
  pray: require("../../../assets/characters/standardized/shepherd_lv1/shepherd_lv1_pray_128.png"),
  bless: require("../../../assets/characters/standardized/shepherd_lv1/shepherd_lv1_bless_128.png"),
  teach: require("../../../assets/characters/standardized/shepherd_lv1/shepherd_lv1_teach_128.png"),
  walk: require("../../../assets/characters/standardized/shepherd_lv1/shepherd_lv1_walk_128.png"),
  think: require("../../../assets/characters/standardized/shepherd_lv1/shepherd_lv1_think_128.png"),
  joy: require("../../../assets/characters/standardized/shepherd_lv1/shepherd_lv1_joy_128.png"),
  concern: require("../../../assets/characters/standardized/shepherd_lv1/shepherd_lv1_comfort_concern_128.png"),
  comfort: require("../../../assets/characters/standardized/shepherd_lv1/shepherd_lv1_comfort_concern_128.png"),
};

export const SHEPHERD_MESSAGES: Record<ShepherdPose, string> = {
  idle: "오늘의 목양을 함께 시작해볼까요?",
  pray: "새 기도제목이 있어요. 함께 기억해요.",
  bless: "좋은 돌봄이 기록되었어요.",
  teach: "오늘 목장에 필요한 안내를 준비했어요.",
  walk: "한 사람씩 천천히 살펴볼게요.",
  think: "목장 상황을 살펴보고 있어요.",
  joy: "오늘의 목양 기록이 잘 채워졌어요!",
  concern: "조용히 안부가 필요한 목원이 있어요.",
  comfort: "괜찮아요. 한 걸음씩 함께 가요.",
};

export function normalizeShepherdPose(pose: unknown): ShepherdPose {
  return typeof pose === "string" && pose in SHEPHERD_POSE_IMAGES ? (pose as ShepherdPose) : "idle";
}

export function getShepherdPose(state: HomePastoralState): ShepherdPose {
  if (state.isLoadingRecommendation) return "think";
  if (state.completedTodayQuest) return "joy";
  if (state.hasNewPrayerRequests) return "pray";
  if (state.hasUncheckedMembers) return "concern";
  return "idle";
}
