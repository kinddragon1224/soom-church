import { Image, Text, View, type ImageSourcePropType } from "react-native";

import { CharacterNameTag } from "./CharacterNameTag";
import { CharacterShadow } from "./CharacterShadow";
import { CHARACTER_ART_STANDARD } from "./characterArtGuide";

type CharacterStageProps = {
  source: ImageSourcePropType;
  label: string;
  displaySize?: number;
  message?: string;
};

export function CharacterStage({
  source,
  label,
  displaySize = CHARACTER_ART_STANDARD.canvas,
  message,
}: CharacterStageProps) {
  return (
    <View style={{ width: displaySize, alignItems: "center" }}>
      <View style={{ width: displaySize, height: displaySize, alignItems: "center", justifyContent: "center" }}>
        <CharacterShadow displaySize={displaySize} />
        <Image source={source} style={{ width: displaySize, height: displaySize }} resizeMode="contain" />
      </View>

      <View style={{ marginTop: -8 }}>
        <CharacterNameTag label={label} />
      </View>

      {message ? (
        <View
          style={{
            marginTop: 6,
            maxWidth: displaySize + 42,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "rgba(255, 232, 184, 0.22)",
            backgroundColor: "rgba(12, 17, 26, 0.86)",
            paddingHorizontal: 10,
            paddingVertical: 7,
          }}
        >
          <Text style={{ color: "rgba(246, 249, 255, 0.86)", fontSize: 10, lineHeight: 14, textAlign: "center" }}>{message}</Text>
        </View>
      ) : null}
    </View>
  );
}
