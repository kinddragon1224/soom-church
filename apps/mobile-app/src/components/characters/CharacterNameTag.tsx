import { Text, View } from "react-native";

import { CHARACTER_ART_STANDARD } from "./characterArtGuide";

export function CharacterNameTag({ label }: { label: string }) {
  return (
    <View
      style={{
        minHeight: CHARACTER_ART_STANDARD.nameTag.height,
        borderRadius: CHARACTER_ART_STANDARD.nameTag.borderRadius,
        borderWidth: 1,
        borderColor: "rgba(255, 232, 184, 0.36)",
        backgroundColor: "rgba(28, 24, 21, 0.84)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 12,
      }}
    >
      <Text style={{ color: "#ffedc6", fontSize: CHARACTER_ART_STANDARD.nameTag.fontSize, fontWeight: "900" }}>{label}</Text>
    </View>
  );
}
