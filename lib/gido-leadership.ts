export type GidoRotationTrack = {
  key: string;
  label: string;
  memberNames: string[];
  householdKeywords: string[];
};

export const GIDO_ACTIVE_LEADER_NAMES = ["조성진", "이명진"] as const;

export const GIDO_ROTATION_TRACKS: GidoRotationTrack[] = [
  {
    key: "current-leaders-family",
    label: "조성진 · 이명진 가정",
    memberNames: ["조성진", "이명진"],
    householdKeywords: ["조성진", "이명진"],
  },
  {
    key: "sim-sanguk-family",
    label: "심상욱 가정",
    memberNames: ["심상욱"],
    householdKeywords: ["심상욱"],
  },
  {
    key: "jung-gichang-family",
    label: "정기창 가족",
    memberNames: ["정기창"],
    householdKeywords: ["정기창"],
  },
];

function normalize(value?: string | null) {
  return (value ?? "").replace(/\s+/g, "").trim();
}

export function getGidoLeadershipProfile(name: string, householdName?: string | null) {
  const normalizedName = normalize(name);
  const normalizedHousehold = normalize(householdName);

  const isActiveLeader = GIDO_ACTIVE_LEADER_NAMES.some((leader) => normalize(leader) === normalizedName);

  const rotationTrack = GIDO_ROTATION_TRACKS.find((track) => {
    const byName = track.memberNames.some((memberName) => normalize(memberName) === normalizedName);
    const byHousehold = track.householdKeywords.some((keyword) => normalizedHousehold.includes(normalize(keyword)));
    return byName || byHousehold;
  });

  const tags = [
    ...(isActiveLeader ? ["현 목자"] : []),
    ...(rotationTrack ? ["올해 순환 진행"] : []),
  ];

  return {
    isActiveLeader,
    isRotationHousehold: Boolean(rotationTrack),
    rotationTrack,
    tags,
    primaryRole: tags[0] ?? "목원",
  };
}
