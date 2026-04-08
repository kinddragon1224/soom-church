import { getGidoLeadershipProfile } from "@/lib/gido-leadership";

export type GidoMembersFilter = "all" | "priority" | "leaders" | "rotation" | "followup" | "unassigned";
export type GidoPriorityTone = "alert" | "dark" | "warm" | "neutral";

export type GidoPriorityReason = {
  title: string;
  body: string;
  tone: GidoPriorityTone;
};

export type GidoMemberActionPlan = {
  title: string;
  body: string;
  shortLabel: string;
  section: "today-check" | "care-log" | "family-links" | "attendance-log" | "household-prayer";
  queueFilter: GidoMembersFilter;
  laneLabel: string;
};

export type GidoMemberViewInput = {
  id: string;
  name: string;
  phone: string | null;
  email?: string | null;
  statusTag: string;
  requiresFollowUp: boolean;
  household?: {
    name: string | null;
  } | null;
};

export type DecoratedGidoMember<T extends GidoMemberViewInput> = T & {
  leadership: ReturnType<typeof getGidoLeadershipProfile>;
  priorityScore: number;
  priorityReason: GidoPriorityReason;
  actionPlan: GidoMemberActionPlan;
};

export function buildGidoMembersView<T extends GidoMemberViewInput>(
  members: T[],
  options: { filter?: string; q?: string } = {},
) {
  const filter = normalizeFilter(options.filter);
  const query = options.q?.trim().toLowerCase() ?? "";

  const decoratedMembers = members.map((member) => decorateGidoMember(member));

  const rankedMembers = [...decoratedMembers].sort((a, b) => {
    const scoreDiff = b.priorityScore - a.priorityScore;
    if (scoreDiff !== 0) return scoreDiff;
    if (a.requiresFollowUp !== b.requiresFollowUp) return a.requiresFollowUp ? -1 : 1;
    if (a.leadership.isActiveLeader !== b.leadership.isActiveLeader) return a.leadership.isActiveLeader ? -1 : 1;
    if (a.leadership.isRotationHousehold !== b.leadership.isRotationHousehold) return a.leadership.isRotationHousehold ? -1 : 1;
    return a.name.localeCompare(b.name, "ko-KR");
  });

  const priorityMembers = rankedMembers.filter((member) => member.priorityScore > 0);
  const unassignedMembers = rankedMembers.filter((member) => !member.household?.name);

  const counts = {
    all: decoratedMembers.length,
    priority: priorityMembers.length,
    leaders: decoratedMembers.filter((member) => member.leadership.isActiveLeader).length,
    rotation: decoratedMembers.filter((member) => member.leadership.isRotationHousehold).length,
    followup: decoratedMembers.filter((member) => member.requiresFollowUp).length,
    unassigned: unassignedMembers.length,
  };

  const filteredMembers = rankedMembers.filter((member) => {
    const matchesQuery =
      !query ||
      [member.name, member.phone, member.email ?? "", member.household?.name ?? "", member.statusTag]
        .join(" ")
        .toLowerCase()
        .includes(query);

    const matchesFilter =
      filter === "priority"
        ? member.priorityScore > 0
        : filter === "leaders"
          ? member.leadership.isActiveLeader
          : filter === "rotation"
            ? member.leadership.isRotationHousehold
            : filter === "followup"
              ? member.requiresFollowUp
              : filter === "unassigned"
                ? !member.household?.name
                : true;

    return matchesQuery && matchesFilter;
  });

  return {
    filter,
    query,
    decoratedMembers,
    rankedMembers,
    priorityMembers,
    unassignedMembers,
    counts,
    filteredMembers,
  };
}

export function decorateGidoMember<T extends GidoMemberViewInput>(member: T): DecoratedGidoMember<T> {
  const leadership = getGidoLeadershipProfile(member.name, member.household?.name);
  const priorityScore = getGidoPriorityScore(member.requiresFollowUp, leadership.isActiveLeader, leadership.isRotationHousehold, Boolean(member.household?.name));
  const priorityReason = getGidoPriorityReason({
    requiresFollowUp: member.requiresFollowUp,
    isActiveLeader: leadership.isActiveLeader,
    isRotationHousehold: leadership.isRotationHousehold,
  });
  const actionPlan = getGidoMemberActionPlan({
    requiresFollowUp: member.requiresFollowUp,
    hasHousehold: Boolean(member.household?.name),
    isActiveLeader: leadership.isActiveLeader,
    isRotationHousehold: leadership.isRotationHousehold,
  });

  return {
    ...member,
    leadership,
    priorityScore,
    priorityReason,
    actionPlan,
  };
}

function getGidoMemberActionPlan({
  requiresFollowUp,
  hasHousehold,
  isActiveLeader,
  isRotationHousehold,
}: {
  requiresFollowUp: boolean;
  hasHousehold: boolean;
  isActiveLeader: boolean;
  isRotationHousehold: boolean;
}): GidoMemberActionPlan {
  if (!hasHousehold) {
    return {
      title: "가정 연결 먼저",
      body: "가정 연결부터 잡아야 중보와 후속 흐름이 덜 꼬여. 가족/가정 관계를 먼저 정리해.",
      shortLabel: "가정 연결",
      section: "family-links",
      queueFilter: "unassigned",
      laneLabel: "가정 연결",
    };
  }

  if (requiresFollowUp) {
    return {
      title: "오늘 연락 남기기",
      body: "후속 기록에 오늘 연락이나 체크인 한 줄만 남겨도 다음 흐름이 이어져.",
      shortLabel: "후속 정리",
      section: "care-log",
      queueFilter: "followup",
      laneLabel: "후속",
    };
  }

  if (isActiveLeader) {
    return {
      title: "리더 흐름 점검",
      body: "현 목자라 가정 중보와 진행 흐름을 먼저 확인하는 편이 좋아.",
      shortLabel: "중보 보기",
      section: "household-prayer",
      queueFilter: "leaders",
      laneLabel: "리더",
    };
  }

  if (isRotationHousehold) {
    return {
      title: "순환 진행 체크",
      body: "올해 순환 진행 가정이라 가정 메모와 중보 흐름을 같이 보는 게 좋아.",
      shortLabel: "진행 점검",
      section: "household-prayer",
      queueFilter: "rotation",
      laneLabel: "순환 진행",
    };
  }

  return {
    title: "최근 흐름 확인",
    body: "최근 접점이나 출석 흐름을 한 번 보고 필요한 메모를 남기면 돼.",
    shortLabel: "출석 확인",
    section: "attendance-log",
    queueFilter: "all",
    laneLabel: "흐름 확인",
  };
}

function normalizeFilter(filter?: string): GidoMembersFilter {
  if (filter === "priority" || filter === "leaders" || filter === "rotation" || filter === "followup" || filter === "unassigned") {
    return filter;
  }

  return "all";
}

function getGidoPriorityScore(
  requiresFollowUp: boolean,
  isActiveLeader: boolean,
  isRotationHousehold: boolean,
  hasHousehold: boolean,
) {
  let score = 0;
  if (requiresFollowUp) score += 100;
  if (isActiveLeader) score += 40;
  if (isRotationHousehold) score += 20;
  if (!hasHousehold) score += 10;
  return score;
}

function getGidoPriorityReason({
  requiresFollowUp,
  isActiveLeader,
  isRotationHousehold,
}: {
  requiresFollowUp: boolean;
  isActiveLeader: boolean;
  isRotationHousehold: boolean;
}): GidoPriorityReason {
  if (requiresFollowUp && isActiveLeader) {
    return {
      title: "후속 + 리더",
      body: "지금 목장 흐름을 맡고 있으면서 후속도 필요한 상태야. 오늘 제일 먼저 확인하는 게 좋아.",
      tone: "alert",
    };
  }

  if (requiresFollowUp) {
    return {
      title: "오늘 후속",
      body: "연락이나 체크인을 바로 남겨야 흐름이 이어져. 상세 화면에서 다음 액션까지 바로 정리하면 돼.",
      tone: "alert",
    };
  }

  if (isActiveLeader) {
    return {
      title: "현 목자",
      body: "지금 목장을 직접 맡고 있는 사람이라 전체 운영 흐름을 볼 때 먼저 체크하는 편이 좋아.",
      tone: "dark",
    };
  }

  if (isRotationHousehold) {
    return {
      title: "순환 진행",
      body: "올해 모임 진행 흐름 안에 들어가 있는 가정이야. 가정 메모와 상태를 같이 보는 게 좋아.",
      tone: "warm",
    };
  }

  return {
    title: "가정 연결",
    body: "가정 연결부터 잡아두면 뒤에서 후속과 중보 흐름이 덜 꼬여.",
    tone: "neutral",
  };
}
