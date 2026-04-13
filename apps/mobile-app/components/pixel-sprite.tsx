import { Image, View } from "react-native";

type SpriteKind = "house" | "person" | "hub";
type SpriteFrame = "normal" | "selected" | "alert" | "done";

const spriteSource = {
  house: require("../assets/sprites/house.jpg"),
  person: require("../assets/sprites/person.png"),
  hub: require("../assets/sprites/hub.jpg"),
} as const;

const frameTone: Record<SpriteFrame, { border: string; bg: string; badge: string }> = {
  normal: { border: "rgba(255,255,255,0.25)", bg: "rgba(9,14,24,0.45)", badge: "#9fb2c8" },
  selected: { border: "#f4d38e", bg: "rgba(75,52,18,0.42)", badge: "#f4d38e" },
  alert: { border: "#f2a8a8", bg: "rgba(74,29,29,0.5)", badge: "#f2a8a8" },
  done: { border: "#8fe0aa", bg: "rgba(22,54,37,0.5)", badge: "#8fe0aa" },
};

function spriteSize(kind: SpriteKind) {
  if (kind === "person") return { width: 28, height: 36 };
  if (kind === "hub") return { width: 40, height: 32 };
  return { width: 40, height: 30 };
}

export default function PixelSprite({
  kind,
  frame = "normal",
  showBadge = false,
}: {
  kind: SpriteKind;
  pixel?: number;
  frame?: SpriteFrame;
  showBadge?: boolean;
}) {
  const tone = frameTone[frame];
  const size = spriteSize(kind);

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
          source={spriteSource[kind]}
          style={{ width: size.width, height: size.height, borderRadius: 4 }}
          resizeMode={kind === "person" ? "contain" : "cover"}
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
