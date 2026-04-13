import { View } from "react-native";

type SpriteKind = "house" | "person" | "hub";

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
  house: [
    "00022000",
    "00222200",
    "02211220",
    "22111122",
    "21133112",
    "21111112",
    "21111112",
    "22222222",
  ],
  person: [
    "00011000",
    "00111100",
    "00122100",
    "00011000",
    "00133100",
    "01133110",
    "01100110",
    "01000010",
  ],
  hub: [
    "00033000",
    "00333300",
    "03311330",
    "33111133",
    "31111113",
    "31133113",
    "31111113",
    "33333333",
  ],
};

export default function PixelSprite({ kind, pixel = 3 }: { kind: SpriteKind; pixel?: number }) {
  const palette = palettes[kind];
  const pattern = patterns[kind];

  return (
    <View style={{ borderRadius: 4, borderWidth: 1, borderColor: "rgba(255,255,255,0.25)", backgroundColor: "rgba(9,14,24,0.45)", padding: 3 }}>
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
  );
}
