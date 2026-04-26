import { CharacterStage } from "./CharacterStage";
import { CHARACTER_ART_STANDARD } from "./characterArtGuide";
import { SHEPHERD_POSE_IMAGES, normalizeShepherdPose } from "./shepherdAssets";
import type { ShepherdCharacterProps, ShepherdCharacterSize } from "./shepherdTypes";

const SIZE_PX: Record<ShepherdCharacterSize, number> = {
  sm: 96,
  md: 128,
  lg: 256,
};

export function ShepherdCharacter({
  pose = "idle",
  size = "md",
  label = "초보 목자",
  message,
  displaySize,
}: ShepherdCharacterProps) {
  const resolvedPose = normalizeShepherdPose(pose);
  const stageSize = displaySize ?? SIZE_PX[size] ?? CHARACTER_ART_STANDARD.canvas;

  return <CharacterStage source={SHEPHERD_POSE_IMAGES[resolvedPose]} label={label} displaySize={stageSize} message={message} />;
}
