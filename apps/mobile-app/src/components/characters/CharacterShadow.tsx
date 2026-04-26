import { View } from "react-native";

import { CHARACTER_ART_STANDARD } from "./characterArtGuide";

export function CharacterShadow({ displaySize = CHARACTER_ART_STANDARD.canvas }: { displaySize?: number }) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: Math.round(displaySize * 0.1),
        width: Math.round(displaySize * CHARACTER_ART_STANDARD.shadow.widthRatio),
        height: CHARACTER_ART_STANDARD.shadow.height,
        borderRadius: 999,
        backgroundColor: `rgba(62, 45, 28, ${CHARACTER_ART_STANDARD.shadow.opacity})`,
        borderWidth: 1,
        borderColor: "rgba(255, 232, 184, 0.24)",
      }}
    />
  );
}
