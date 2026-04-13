import { prisma } from "@/lib/prisma";

type ActionItem = {
  id: string;
  title: string;
  due: string;
  owner: string;
};

type OrchestrateInput = {
  churchSlug: string;
  text: string;
};

type OrchestrateOutput = {
  ok: boolean;
  reply: string;
  actions: ActionItem[];
  intents: string[];
  autoBuild: {
    workspace: string;
    shepherdingQueue: string[];
    memberOps: string[];
  };
  agentGrowth: {
    loopId: string;
    title: string;
    summary: string;
    suggestedGithubIssue: string;
  };
};

function detectIntents(text: string) {
  const intents: string[] = [];

  if (text.includes("기도")) intents.push("PRAYER_MANAGEMENT");
  if (text.includes("후속") || text.includes("연락") || text.includes("심방")) intents.push("FOLLOWUP_MANAGEMENT");
  if (text.includes("가정") || text.includes("목장") || text.includes("목원")) intents.push("MEMBER_CARE_MANAGEMENT");
  if (text.includes("정리") || text.includes("자동") || text.includes("시스템")) intents.push("SYSTEM_AUTOBUILD");

  if (!intents.length) intents.push("GENERAL_SHEPHERDING");
  return intents;
}

function buildActions(intents: string[], followupCount: number) {
  const actions: ActionItem[] = [];

  if (intents.includes("FOLLOWUP_MANAGEMENT")) {
    actions.push({
      id: "followup-priority",
      title: `후속 연락 우선순위 ${Math.min(followupCount || 3, 3)}명 확정`,
      due: "오늘",
      owner: "목양 관리",
    });
  }

  if (intents.includes("PRAYER_MANAGEMENT")) {
    actions.push({
      id: "prayer-refresh",
      title: "기도 요청/응답 상태 갱신",
      due: "오늘",
      owner: "기도 담당",
    });
  }

  if (intents.includes("MEMBER_CARE_MANAGEMENT")) {
    actions.push({
      id: "member-care-board",
      title: "목원 상태태그 점검 및 보드 반영",
      due: "이번 주",
      owner: "목양 관리",
    });
  }

  if (!actions.length) {
    actions.push({
      id: "general-ops",
      title: "오늘 실행할 목양 액션 3개 확정",
      due: "오늘",
      owner: "목양 관리",
    });
  }

  return actions;
}

export async function orchestrateMobileWorldChat({ churchSlug, text }: OrchestrateInput): Promise<OrchestrateOutput> {
  const trimmedText = text.trim();

  const church = await prisma.church.findFirst({
    where: { slug: churchSlug, isActive: true },
    select: { id: true, slug: true, name: true },
  });

  if (!church) {
    const intents = detectIntents(trimmedText);
    const actions = buildActions(intents, 0);

    return {
      ok: true,
      reply: `교회 정보를 아직 찾지 못했어. 그래도 "${trimmedText}" 기준으로 바로 실행 가능한 기본 목양 플로우를 만들었어.`,
      actions,
      intents,
      autoBuild: {
        workspace: "fallback-workspace",
        shepherdingQueue: actions.map((item) => item.title),
        memberOps: ["상태태그 점검", "후속 연락 큐 정렬"],
      },
      agentGrowth: {
        loopId: `loop-${Date.now()}`,
        title: "Fallback Mobile World Loop",
        summary: "교회 식별 실패 상태에서 기본 루프를 생성함",
        suggestedGithubIssue: "[mobile-world] fallback orchestration and church binding",
      },
    };
  }

  const [followupCount, householdCount, recentMembers] = await Promise.all([
    prisma.member.count({ where: { churchId: church.id, isDeleted: false, requiresFollowUp: true } }),
    prisma.household.count({ where: { churchId: church.id } }),
    prisma.member.findMany({
      where: { churchId: church.id, isDeleted: false },
      orderBy: [{ requiresFollowUp: "desc" }, { updatedAt: "desc" }],
      take: 3,
      select: { name: true, statusTag: true, requiresFollowUp: true },
    }),
  ]);

  const intents = detectIntents(trimmedText);
  const actions = buildActions(intents, followupCount);

  const memberOps = recentMembers.map((member) => `${member.name}: ${member.requiresFollowUp ? "후속 필요" : member.statusTag}`);
  const queue = actions.map((item) => item.title);

  const autoBuild = {
    workspace: `${church.slug}-mobile-world-ops`,
    shepherdingQueue: queue,
    memberOps,
  };

  const loopId = `loop-${church.slug}-${Date.now()}`;
  const agentGrowth = {
    loopId,
    title: `${church.name} Mobile World Agent Loop`,
    summary: `후속 ${followupCount}명, 가정 ${householdCount}개 기준으로 월드 채팅 운영 루프 생성`,
    suggestedGithubIssue: `[mobile-world] ${church.slug} auto-build loop: ${intents.join(", ")}`,
  };

  const reply = [
    `${church.name} 기준으로 월드 운영 시스템을 자동 구축했어.`,
    `핵심 의도: ${intents.join(", ")}`,
    `현재 후속 필요 ${followupCount}명, 가정 ${householdCount}개를 기준으로 실행 큐를 만들었어.`,
    `요청 반영: "${trimmedText}"`,
  ].join(" ");

  await prisma.activityLog.create({
    data: {
      churchId: church.id,
      action: "MOBILE_WORLD_CHAT_ORCHESTRATED",
      targetType: "MOBILE_WORLD_CHAT",
      metadata: JSON.stringify({
        text: trimmedText,
        intents,
        actions,
        autoBuild,
        agentGrowth,
      }),
    },
  });

  return {
    ok: true,
    reply,
    actions,
    intents,
    autoBuild,
    agentGrowth,
  };
}
