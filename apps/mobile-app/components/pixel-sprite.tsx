import { View } from "react-native";

type SpriteKind = "house" | "person" | "hub";
type SpriteFrame = "normal" | "selected" | "alert" | "done";

const palettes: Record<SpriteKind, Record<string, string>> = {
  house: {
    0: "transparent",
    1: "#e8d3a5",
    2: "#9a6b43",
    3: "#5a3f2a",
  },
  person: {
    0: "transparent",
    1: "#f4d7b8",
    2: "#5f7fa8",
    3: "#2a3d58",
  },
  hub: {
    0: "transparent",
    1: "#f0d28b",
    2: "#7f5b31",
    3: "#384b63",
  },
};

const patterns: Record<SpriteKind, string[]> = {
  house: ["00022000", "00222200", "02211220", "22111122", "21133112", "21111112", "21111112", "22222222"],
  person: ["00011000", "00111100", "00122100", "00011000", "00133100", "01133110", "01100110", "01000010"],
  hub: ["00033000", "00333300", "03311330", "33111133", "31111113", "31133113", "31111113", "33333333"],
};

const frameTone: Record<SpriteFrame, { border: string; bg: string; badge: string }> = {
  normal: { border: "rgba(255,255,255,0.25)", bg: "rgba(9,14,24,0.45)", badge: "#9fb2c8" },
  selected: { border: "#f4d38e", bg: "rgba(75,52,18,0.42)", badge: "#f4d38e" },
  alert: { border: "#f2a8a8", bg: "rgba(74,29,29,0.5)", badge: "#f2a8a8" },
  done: { border: "#8fe0aa", bg: "rgba(22,54,37,0.5)", badge: "#8fe0aa" },
};

export default function PixelSprite({
  kind,
  pixel = 3,
  frame = "normal",
  showBadge = false,
}: {
  kind: SpriteKind;
  pixel?: number;
  frame?: SpriteFrame;
  showBadge?: boolean;
}) {
  const palette = palettes[kind];
  const pattern = patterns[kind];
  const tone = frameTone[frame];

  return (
    <View style={{ position: "relative" }}>
      <View style={{ borderRadius: 4, borderWidth: 1, borderColor: tone.border, backgroundColor: tone.bg, padding: 3 }}>
        {pattern.map((row, y) => (
          <View key={`${kind}-${y}`} style={{ flexDirection: "row" }}>
            {row.split("").map((cell, x) => (
              <View
                key={`${kind}-${y}-${x}`}
                style={{
                  width: pixel,
                  height: pixel,
                  backgroundColor: palette[cell] ?? "transparent",
                }}
              />
            ))}
          </View>
        ))}
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
