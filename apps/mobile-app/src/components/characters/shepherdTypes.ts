export type ShepherdPose =
  | "idle"
  | "pray"
  | "bless"
  | "teach"
  | "walk"
  | "think"
  | "joy"
  | "concern"
  | "comfort";

export type ShepherdCharacterSize = "sm" | "md" | "lg";

export type ShepherdCharacterProps = {
  pose?: ShepherdPose;
  size?: ShepherdCharacterSize;
  showAura?: boolean;
  label?: string;
  message?: string;
  displaySize?: number;
};

export type HomePastoralState = {
  hasNewPrayerRequests: boolean;
  hasUncheckedMembers: boolean;
  completedTodayQuest: boolean;
  isLoadingRecommendation: boolean;
};
