export const CHARACTER_ART_STANDARD = {
  canvas: 128,
  characterHeight: 104,
  defaultDisplayHeight: 104,
  view: "3/4-front",
  baseline: "shared",
  shadow: {
    widthRatio: 0.72,
    height: 12,
    opacity: 0.28,
  },
  nameTag: {
    height: 28,
    borderRadius: 14,
    fontSize: 13,
  },
} as const;

export const CHARACTER_EXPORT_SIZES = [96, 128, 256, 512] as const;
