import { Image, View } from "react-native";

import {
  type SpriteFrame,
  type WorldAssetSlot,
  worldAssetFallbackSources,
  worldAssetFrameTone,
  worldAssetResizeMode,
  worldAssetSize,
  worldAssetSlotByKind,
} from "../lib/world-asset-slots";
import type { WorldObjectKind } from "../lib/world-model";

export default function PixelSprite({
  kind,
  slot,
  frame = "normal",
  showBadge = false,
}: {
  kind: WorldObjectKind;
  slot?: WorldAssetSlot;
  frame?: SpriteFrame;
  showBadge?: boolean;
}) {
  const resolvedSlot = slot ?? worldAssetSlotByKind[kind];
  const tone = worldAssetFrameTone[frame];
  const size = worldAssetSize(resolvedSlot);

  return (
    <View style={{ position: "relative" }}>
      <View
        style={{
          borderRadius: 6,
          borderWidth: 1,
          borderColor: tone.border,
          backgroundColor: tone.bg,
          paddingHorizontal: 4,
          paddingVertical: 3,
        }}
      >
        <Image
          source={worldAssetFallbackSources[resolvedSlot]}
          style={{ width: size.width, height: size.height, borderRadius: 4 }}
          resizeMode={worldAssetResizeMode(resolvedSlot)}
        />
      </View>
      {showBadge ? (
        <View
          style={{
            position: "absolute",
            right: -3,
            top: -3,
            width: 7,
            height: 7,
            borderRadius: 2,
            borderWidth: 1,
            borderColor: "rgba(9,14,24,0.8)",
            backgroundColor: tone.badge,
          }}
        />
      ) : null}
    </View>
  );
}
