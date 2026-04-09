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
      title: "가정 연결",
      body: "가정 연결 확인",
      shortLabel: "가정 연결",
      section: "family-links",
      queueFilter: "unassigned",
      laneLabel: "가정 연결",
    };
  }

  if (requiresFollowUp) {
    return {
      title: "오늘 연락 남기기",
      body: "돌봄 기록 필요",
      shortLabel: "돌봄",
      section: "care-log",
      queueFilter: "followup",
      laneLabel: "돌봄",
    };
  }

  if (isActiveLeader) {
    return {
      title: "리더 점검",
      body: "운영 리더 우선 확인",
      shortLabel: "중보 보기",
      section: "household-prayer",
      queueFilter: "leaders",
      laneLabel: "리더",
    };
  }

  if (isRotationHousehold) {
    return {
      title: "순환 진행 체크",
      body: "순환 진행 가정 확인",
      shortLabel: "진행 점검",
      section: "household-prayer",
      queueFilter: "rotation",
      laneLabel: "순환 진행",
    };
  }

  return {
    title: "최근 기록 확인",
    body: "최근 기록 확인",
    shortLabel: "출석 확인",
    section: "attendance-log",
    queueFilter: "all",
    laneLabel: "최근 기록",
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
      title: "돌봄 + 리더",
      body: "돌봄 기록과 리더 확인 필요",
      tone: "alert",
    };
  }

  if (requiresFollowUp) {
    return {
      title: "오늘 돌봄",
      body: "돌봄 기록 필요",
      tone: "alert",
    };
  }

  if (isActiveLeader) {
    return {
      title: "현 목자",
      body: "운영 리더 우선 확인",
      tone: "dark",
    };
  }

  if (isRotationHousehold) {
    return {
      title: "순환 진행",
      body: "순환 진행 가정 확인",
      tone: "warm",
    };
  }

  return {
    title: "가정 연결",
    body: "가정 연결 확인",
    tone: "neutral",
  };
}
