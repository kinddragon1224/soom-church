import type { GidoWorkspaceData } from "@/lib/gido-workspace-data";

export type GidoReviewCandidate = {
  id: string;
  kind: "follow_up" | "care_record" | "relationship" | "status_change";
  title: string;
  summary: string;
  targetLabel: string;
  reason: string;
  suggestedAction: string;
  confidence: "높음" | "중간" | "낮음";
  sourceLabel: string;
};

export type GidoChatMessage = {
  id: string;
  role: "pastor" | "assistant";
  body: string;
  meta: string;
};

export type GidoTimelineEvent = {
  id: string;
  kind: "follow_up" | "update" | "household";
  title: string;
  body: string;
  meta: string;
};

function trimText(value: string, max = 96) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

export function buildGidoReviewCandidates(data: GidoWorkspaceData): GidoReviewCandidate[] {
  const followUpItems = data.followUps.slice(0, 4).map((item, index) => ({
    id: `follow-up-${index}`,
    kind: "follow_up" as const,
    title: item.title,
    summary: trimText(item.note || "후속 메모 정리가 필요해."),
    targetLabel: item.owner || "대상 확인 필요",
    reason: "missing_required_field",
    suggestedAction: "follow-up 항목으로 승인하거나 보류",
    confidence: item.priority === "높음" ? ("높음" as const) : ("중간" as const),
    sourceLabel: item.due || "일정 미정",
  }));

  const updateItems = data.updates.slice(0, 4).map((item, index) => ({
    id: `update-${index}`,
    kind: "care_record" as const,
    title: item.title,
    summary: trimText(item.body || item.note || "근황 원문 정리가 필요해."),
    targetLabel: item.note || "근황 정리",
    reason: "low_confidence",
    suggestedAction: "기도, 심방, 상태변화 중 하나로 확정",
    confidence: item.due ? ("중간" as const) : ("낮음" as const),
    sourceLabel: item.due || "최근 대화",
  }));

  const householdItems = data.households
    .filter((household) => household.members.length > 1 && household.relationships.length === 0)
    .slice(0, 3)
    .map((household, index) => ({
      id: `household-${index}`,
      kind: "relationship" as const,
      title: `${household.title} 관계 확인`,
      summary: trimText(`${household.members.map((member) => member.name).join(", ")} 관계선이 아직 비어 있어.`),
      targetLabel: household.title,
      reason: "relationship_uncertain",
      suggestedAction: "배우자, 자녀, 보호자 관계를 먼저 확정",
      confidence: "중간" as const,
      sourceLabel: `가정 ${household.members.length}명`,
    }));

  const memberItems = data.members
    .filter((member) => member.requiresFollowUp)
    .slice(0, 3)
    .map((member, index) => ({
      id: `member-${index}`,
      kind: "status_change" as const,
      title: `${member.name} 상태 확인`,
      summary: trimText(`${member.householdName} · 현재 ${member.statusTag} 상태라 오늘 처리 후보로 올려둘 수 있어.`),
      targetLabel: member.name,
      reason: "conflicting_existing_data",
      suggestedAction: "오늘 연락 대상에 올릴지 검토",
      confidence: "높음" as const,
      sourceLabel: member.statusTag,
    }));

  return [...memberItems, ...followUpItems, ...updateItems, ...householdItems];
}

export function buildGidoChatMessages(data: GidoWorkspaceData): GidoChatMessage[] {
  const messages: GidoChatMessage[] = [];

  data.updates.slice(0, 3).forEach((item, index) => {
    messages.push({
      id: `chat-update-pastor-${index}`,
      role: "pastor",
      body: trimText(item.body || item.note || item.title, 220),
      meta: item.due || "방금 보낸 내용",
    });
    messages.push({
      id: `chat-update-assistant-${index}`,
      role: "assistant",
      body: trimText(`${item.title}로 읽었어. 근황, 기도, 후속 중 어디에 반영할지 Review에서 바로 확인할 수 있게 둘게.`, 220),
      meta: "모라",
    });
  });

  data.followUps.slice(0, 2).forEach((item, index) => {
    messages.push({
      id: `chat-followup-pastor-${index}`,
      role: "pastor",
      body: trimText(item.note || item.title, 220),
      meta: item.due || "후속 메모",
    });
    messages.push({
      id: `chat-followup-assistant-${index}`,
      role: "assistant",
      body: trimText(`${item.title}로 후속 카드 후보를 만들었어. 사람 연결과 일정 확정만 보면 돼.`, 220),
      meta: "모라",
    });
  });

  if (messages.length === 0) {
    messages.push(
      {
        id: "chat-empty-pastor",
        role: "pastor",
        body: "이번 주 목장 근황과 챙겨야 할 사람들을 정리하고 싶어.",
        meta: "예시 입력",
      },
      {
        id: "chat-empty-assistant",
        role: "assistant",
        body: "좋아. 그냥 말하듯 적어줘. 사람, 가정, 기도제목, 심방, 결석, 후속조치 후보로 나눠서 다른 탭에 정리해둘게.",
        meta: "모라",
      },
    );
  }

  return messages;
}

export function buildGidoTimelineEvents(data: GidoWorkspaceData): GidoTimelineEvent[] {
  const followUps = data.followUps.slice(0, 5).map((item, index) => ({
    id: `timeline-follow-up-${index}`,
    kind: "follow_up" as const,
    title: item.title,
    body: trimText(item.note || "후속 메모 없음"),
    meta: item.due ? `후속 · ${item.due}` : "후속",
  }));

  const updates = data.updates.slice(0, 5).map((item, index) => ({
    id: `timeline-update-${index}`,
    kind: "update" as const,
    title: item.title,
    body: trimText(item.body || item.note || "근황 메모 없음"),
    meta: item.due ? `근황 · ${item.due}` : "근황",
  }));

  const households = data.households
    .filter((household) => household.prayers.length > 0 || household.contacts.length > 0)
    .slice(0, 4)
    .map((household, index) => ({
      id: `timeline-household-${index}`,
      kind: "household" as const,
      title: household.title,
      body: trimText(household.prayers[0] || household.contacts[0] || "가정 메모 없음"),
      meta: `가정 · 연락 ${household.contacts.length} · 중보 ${household.prayers.length}`,
    }));

  return [...followUps, ...updates, ...households];
}

export function buildGidoRecoveryQueries(data: GidoWorkspaceData) {
  const followUpMembers = data.members.filter((member) => member.requiresFollowUp).slice(0, 4).map((member) => member.name);
  const unlinkedHouseholds = data.households.filter((household) => household.members.length > 1 && household.relationships.length === 0).slice(0, 4).map((household) => household.title);

  return [
    {
      label: "오늘 바로 연락할 사람",
      query: followUpMembers.length > 0 ? `${followUpMembers.join(", ")} 최근 상태 복구` : "후속 필요한 사람 복구",
    },
    {
      label: "관계 확인 필요한 가정",
      query: unlinkedHouseholds.length > 0 ? `${unlinkedHouseholds.join(", ")} 배우자 자녀 관계 확인` : "관계 비어 있는 가정 찾기",
    },
    {
      label: "최근 근황 복구",
      query: data.updates.length > 0 ? "최근 근황 5건 다시 보기" : "최근 근황 복구",
    },
  ];
}
