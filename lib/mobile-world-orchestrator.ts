import { prisma } from "@/lib/prisma";
import { getStatusUpdatePatch } from "@/lib/member-status";

type ActionItem = {
  id: string;
  title: string;
  due: string;
  owner: string;
};

type OrchestrateInput = {
  churchSlug: string;
  text: string;
  accountKey?: string;
  model?: string;
};

type DbActionSummary = {
  applied: boolean;
  statusTag?: string;
  updatedMembers: string[];
  followUpRecords: number;
  note?: string;
};

type ChatDiagnostics = {
  mode: "openclaw" | "rule";
  provider: string;
  reason?: string;
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
  dbActions?: DbActionSummary;
  diagnostics?: ChatDiagnostics;
};

type StatusPatchPlan = {
  statusTag: string;
  requiresFollowUp: boolean;
  recordCategory: "VISIT" | "NOTE";
  reason: string;
};

type PlanResult = {
  reply?: string;
  intents?: string[];
  actions?: ActionItem[];
  autoBuild?: {
    workspace?: string;
    shepherdingQueue?: string[];
    memberOps?: string[];
  };
};

function normalizeAccountKey(value: unknown) {
  if (typeof value !== "string") return "anon";
  const next = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .slice(0, 80);
  return next || "anon";
}

function safeSlugPart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function normalizeChurchSlugInput(value: string | null | undefined) {
  const normalized = safeSlugPart(value ?? "");
  return normalized || "mobile";
}

function slugTitle(slug: string) {
  return `${slug.toUpperCase()} 목장`;
}

async function resolveOrCreateChurch(churchSlug: string, safeAccountKey: string) {
  const normalizedSlug = normalizeChurchSlugInput(churchSlug);
  const user = safeAccountKey !== "anon"
    ? await prisma.user.findUnique({ where: { id: safeAccountKey }, select: { id: true, name: true, isActive: true } })
    : null;

  const bySlug = await prisma.church.findFirst({
    where: { slug: normalizedSlug, isActive: true },
    select: { id: true, slug: true, name: true },
  });
  if (bySlug) {
    if (user?.id) {
      await prisma.churchMembership.upsert({
        where: { userId_churchId: { userId: user.id, churchId: bySlug.id } },
        create: { userId: user.id, churchId: bySlug.id, role: "OWNER", isActive: true },
        update: { isActive: true },
      });
    }
    return bySlug;
  }

  if (user?.id) {
    const membership = await prisma.churchMembership.findFirst({
      where: { userId: user.id, isActive: true, church: { isActive: true } },
      orderBy: { updatedAt: "desc" },
      select: { church: { select: { id: true, slug: true, name: true } } },
    });
    if (membership?.church) return membership.church;
  }

  const byAnySlug = await prisma.church.findFirst({
    where: { slug: normalizedSlug },
    select: { id: true, slug: true, name: true },
  });
  if (byAnySlug) {
    if (user?.id) {
      await prisma.churchMembership.upsert({
        where: { userId_churchId: { userId: user.id, churchId: byAnySlug.id } },
        create: { userId: user.id, churchId: byAnySlug.id, role: "OWNER", isActive: true },
        update: { isActive: true },
      });
    }
    return byAnySlug;
  }

  return prisma.church.create({
    data: {
      slug: normalizedSlug,
      name: user?.name ? `${user.name} 목장` : slugTitle(normalizedSlug),
      memberships: user?.id
        ? {
            create: {
              userId: user.id,
              role: "OWNER",
              isActive: true,
            },
          }
        : undefined,
    },
    select: { id: true, slug: true, name: true },
  });
}

function sanitizeJsonText(value: string) {
  const fenced = value.match(/```json\s*([\s\S]*?)```/i) || value.match(/```\s*([\s\S]*?)```/i);
  return (fenced?.[1] ?? value).trim();
}

function detectIntents(text: string) {
  const intents: string[] = [];

  if (/(목원\s*추가|추가해줘|등록해줘)/.test(text) && /(목원|멤버)/.test(text)) intents.push("MEMBER_ADD");

  if (text.includes("기도")) intents.push("PRAYER_MANAGEMENT");
  if (text.includes("후속") || text.includes("연락") || text.includes("심방")) intents.push("FOLLOWUP_MANAGEMENT");
  if (text.includes("가정") || text.includes("목장") || text.includes("목원")) intents.push("MEMBER_CARE_MANAGEMENT");
  if (text.includes("정리") || text.includes("자동") || text.includes("시스템")) intents.push("SYSTEM_AUTOBUILD");

  if (!intents.length) intents.push("GENERAL_SHEPHERDING");
  return intents;
}

function sanitizeActions(value: unknown): ActionItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const maybe = item as Partial<ActionItem>;
      const title = typeof maybe.title === "string" ? maybe.title.trim() : "";
      if (!title) return null;

      return {
        id: typeof maybe.id === "string" && maybe.id.trim() ? maybe.id.trim() : `action-${index + 1}`,
        title,
        due: typeof maybe.due === "string" && maybe.due.trim() ? maybe.due.trim() : "오늘",
        owner: typeof maybe.owner === "string" && maybe.owner.trim() ? maybe.owner.trim() : "모라",
      };
    })
    .filter((item): item is ActionItem => Boolean(item))
    .slice(0, 8);
}

function sanitizeIntents(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim().toUpperCase() : ""))
    .filter(Boolean)
    .slice(0, 8);
}

function sanitizeTextValue(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function isMokjangWorldCommand(text: string) {
  const normalized = text.toLowerCase();
  return /목장|목원|심방|후속|기도|돌봄|출석|브리프|명령|월드|gido|가정|등록|추가|상태태그|목자/.test(normalized);
}

function buildActions(intents: string[], followupCount: number) {
  const actions: ActionItem[] = [];

  if (intents.includes("MEMBER_ADD")) {
    actions.push({
      id: "member-add",
      title: "신규 목원 등록 및 기본 상태 반영",
      due: "지금",
      owner: "목양 관리",
    });
  }

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

function extractRequestedMemberName(text: string) {
  const normalized = text
    .replace(/^\s*(모라|mora|assistant)[,\s]*/i, "")
    .replace(/\s+/g, " ")
    .trim();
  const nameToken = "([가-힣A-Za-z]{1,20}(?:\s?[가-힣A-Za-z]{1,20})?)";
  const ignored = new Set(["모라", "mora", "assistant", "에이전트"]);

  const patterns = [
    new RegExp(`${nameToken}\\s*목원\\s*추가`, "i"),
    new RegExp(`목원\\s*추가\\s*${nameToken}`, "i"),
    new RegExp(`목원\\s*${nameToken}\\s*추가`, "i"),
    new RegExp(`${nameToken}\\s*멤버\\s*추가`, "i"),
    new RegExp(`멤버\\s*추가\\s*${nameToken}`, "i"),
    new RegExp(`멤버\\s*${nameToken}\\s*추가`, "i"),
    new RegExp(`${nameToken}\\s*(등록|추가)해줘`, "i"),
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match?.[1]) {
      const candidate = match[1].trim();
      if (ignored.has(candidate.toLowerCase())) continue;
      return candidate;
    }
  }

  return null;
}

function planStatusPatch(text: string): StatusPatchPlan | null {
  if (/(심방|입원|수술|건강|회복|상담)/.test(text)) {
    return {
      statusTag: "심방필요",
      requiresFollowUp: true,
      recordCategory: "VISIT",
      reason: "심방/돌봄 키워드 감지",
    };
  }

  if (/(휴면|재연결|오랜만)/.test(text)) {
    return {
      statusTag: "휴면",
      requiresFollowUp: true,
      recordCategory: "NOTE",
      reason: "휴면/재연결 키워드 감지",
    };
  }

  if (/(새가족|등록)/.test(text)) {
    return {
      statusTag: "새가족",
      requiresFollowUp: true,
      recordCategory: "NOTE",
      reason: "등록/새가족 키워드 감지",
    };
  }

  if (/(정착|배정)/.test(text)) {
    return {
      statusTag: "정착중",
      requiresFollowUp: true,
      recordCategory: "NOTE",
      reason: "정착/배정 키워드 감지",
    };
  }

  if (/(봉사|사역)/.test(text)) {
    return {
      statusTag: "봉사연결",
      requiresFollowUp: false,
      recordCategory: "NOTE",
      reason: "봉사/사역 키워드 감지",
    };
  }

  return null;
}

function parseProviderPlan(data: any): PlanResult | null {
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content === "string" && content.trim()) {
    return JSON.parse(sanitizeJsonText(content)) as PlanResult;
  }

  if (typeof data?.reply === "string") {
    return {
      reply: data.reply,
      intents: Array.isArray(data?.intents) ? data.intents : [],
      actions: Array.isArray(data?.actions) ? data.actions : [],
      autoBuild: data?.autoBuild,
    };
  }

  return null;
}

async function runOpenClawBridgePlan(params: {
  churchName: string;
  churchSlug: string;
  text: string;
  followupCount: number;
  householdCount: number;
  memberOps: string[];
  model?: string;
}) {
  const bridgeUrl = process.env.OPENCLAW_BRIDGE_URL?.trim();
  const bridgeToken = process.env.OPENCLAW_BRIDGE_TOKEN?.trim();
  const bridgeModel = params.model || process.env.OPENCLAW_BRIDGE_MODEL || "default";

  if (!bridgeUrl) {
    return { plan: null, reason: "OPENCLAW_BRIDGE_URL 없음" } as const;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(bridgeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(bridgeToken ? { Authorization: `Bearer ${bridgeToken}` } : {}),
      },
      body: JSON.stringify({
        model: bridgeModel,
        messages: [
          {
            role: "system",
            content:
              "너는 목장월드 실행 비서 모라다. 목장월드 관련 작업만 수행한다. 한국어로 짧고 실행형으로 답한다. JSON만 반환: reply, intents, actions[{id,title,due,owner}], autoBuild{workspace,shepherdingQueue,memberOps}. markdown 금지.",
          },
          {
            role: "user",
            content: JSON.stringify({
              churchName: params.churchName,
              churchSlug: params.churchSlug,
              text: params.text,
              context: {
                followupCount: params.followupCount,
                householdCount: params.householdCount,
                memberOps: params.memberOps,
              },
            }),
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return { plan: null, reason: `bridge HTTP ${response.status}` } as const;
    }

    const data = await response.json();
    const parsed = parseProviderPlan(data);
    if (!parsed) {
      return { plan: null, reason: "bridge 응답 파싱 실패" } as const;
    }

    return { plan: parsed, reason: "ok" } as const;
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    return { plan: null, reason: `bridge 호출 예외: ${message}` } as const;
  } finally {
    clearTimeout(timeout);
  }
}

async function chooseCommandPlan(params: {
  churchName: string;
  churchSlug: string;
  text: string;
  followupCount: number;
  householdCount: number;
  memberOps: string[];
  model?: string;
}) {
  const bridge = await runOpenClawBridgePlan(params);
  if (bridge.plan) {
    return {
      plan: bridge.plan,
      diagnostics: {
        mode: "openclaw",
        provider: "openclaw-bridge",
      } as ChatDiagnostics,
    } as const;
  }

  return {
    plan: null,
    diagnostics: {
      mode: "rule",
      provider: "rule-fallback",
      reason: `openclaw-bridge=${bridge.reason}`,
    } as ChatDiagnostics,
  } as const;
}

async function applyDbActions(params: {
  churchId: string;
  text: string;
  statusPlan: StatusPatchPlan | null;
  intents: string[];
}) {
  const { churchId, text, statusPlan, intents } = params;

  const requestedName = intents.includes("MEMBER_ADD") ? extractRequestedMemberName(text) : null;

  if (intents.includes("MEMBER_ADD") && !requestedName) {
    return {
      applied: false,
      updatedMembers: [],
      followUpRecords: 0,
      note: "목원 이름이 없어 추가를 실행하지 않음",
    };
  }

  if (requestedName) {
    const existing = await prisma.member.findFirst({
      where: { churchId, isDeleted: false, name: requestedName },
      select: { id: true, name: true },
    });

    if (!existing) {
      await prisma.member.create({
        data: {
          churchId,
          name: requestedName,
          gender: "OTHER",
          birthDate: new Date("2000-01-01T00:00:00.000Z"),
          phone: "",
          statusTag: "등록",
          requiresFollowUp: false,
          notes: "모바일 월드 명령으로 등록됨",
        },
      });

      await prisma.activityLog.create({
        data: {
          churchId,
          action: "MOBILE_WORLD_MEMBER_ADDED",
          targetType: "MEMBER",
          metadata: JSON.stringify({ requestedName, text, source: "chat-command" }),
        },
      });

      return {
        applied: true,
        updatedMembers: [requestedName],
        followUpRecords: 0,
        note: `신규 목원 ${requestedName} 등록 완료`,
      };
    }

    return {
      applied: false,
      updatedMembers: [requestedName],
      followUpRecords: 0,
      note: `${requestedName} 목원은 이미 존재함`,
    };
  }

  if (!statusPlan) {
    return {
      applied: false,
      updatedMembers: [] as string[],
      followUpRecords: 0,
      note: "상태태그 변경 조건 없음",
    };
  }

  const candidates = await prisma.member.findMany({
    where: { churchId, isDeleted: false },
    orderBy: [{ requiresFollowUp: "desc" }, { updatedAt: "desc" }],
    take: 12,
    select: { id: true, name: true },
  });

  const namedTargets = candidates.filter((member) => text.includes(member.name));
  const fallbackTargets = candidates.slice(0, intents.includes("FOLLOWUP_MANAGEMENT") ? 2 : 1);
  const targets = (namedTargets.length ? namedTargets : fallbackTargets).slice(0, 3);

  if (!targets.length) {
    return {
      applied: false,
      updatedMembers: [] as string[],
      followUpRecords: 0,
      note: "적용 대상 목원을 찾지 못함",
    };
  }

  const now = new Date();

  await prisma.$transaction(async (tx) => {
    for (const member of targets) {
      await tx.member.update({
        where: { id: member.id },
        data: getStatusUpdatePatch(statusPlan.statusTag, statusPlan.requiresFollowUp),
      });

      await tx.memberCareRecord.create({
        data: {
          churchId,
          memberId: member.id,
          category: statusPlan.recordCategory,
          title: `[모바일 월드] ${statusPlan.statusTag} 후속 기록`,
          summary: text,
          details: `자동 적용 사유: ${statusPlan.reason}`,
          happenedAt: now,
          recordedBy: "mobile-world-orchestrator",
        },
      });
    }

    await tx.activityLog.create({
      data: {
        churchId,
        action: "MOBILE_WORLD_DB_ACTION_APPLIED",
        targetType: "MEMBER_STATUS_AND_FOLLOWUP",
        metadata: JSON.stringify({
          text,
          statusTag: statusPlan.statusTag,
          requiresFollowUp: statusPlan.requiresFollowUp,
          targetMemberIds: targets.map((member) => member.id),
          targetMemberNames: targets.map((member) => member.name),
          reason: statusPlan.reason,
        }),
      },
    });
  });

  return {
    applied: true,
    statusTag: statusPlan.statusTag,
    updatedMembers: targets.map((member) => member.name),
    followUpRecords: targets.length,
    note: statusPlan.reason,
  };
}

export async function orchestrateMobileWorldChat({ churchSlug, text, accountKey, model }: OrchestrateInput): Promise<OrchestrateOutput> {
  const trimmedText = text.trim();
  const safeAccountKey = normalizeAccountKey(accountKey);

  if (!isMokjangWorldCommand(trimmedText)) {
    return {
      ok: true,
      reply: "목장월드 관련 명령만 처리할 수 있어. 예: 강은미 목원 추가, 후속 3명 정리, 오늘 기도 브리프 생성",
      actions: [
        { id: "scope-guard", title: "목장월드 명령으로 다시 요청", due: "지금", owner: "목자" },
      ],
      intents: ["MOKJANG_WORLD_ONLY"],
      autoBuild: {
        workspace: "mokjang-world",
        shepherdingQueue: ["목장월드 명령 재입력"],
        memberOps: ["명령 스코프 점검"],
      },
      agentGrowth: {
        loopId: `loop-scope-${Date.now()}`,
        title: "Mokjang World Scope Guard",
        summary: "목장월드 외 명령 차단",
        suggestedGithubIssue: "[mobile-world] command scope guard",
      },
      diagnostics: {
        mode: "rule",
        provider: "scope-guard",
        reason: "out-of-scope-command",
      },
    };
  }

  let church = await resolveOrCreateChurch(churchSlug, safeAccountKey);

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

  const memberOps = recentMembers.map((member) => `${member.name}: ${member.requiresFollowUp ? "후속 필요" : member.statusTag}`);

  const planned = await chooseCommandPlan({
    churchName: church.name,
    churchSlug: church.slug,
    text: trimmedText,
    followupCount,
    householdCount,
    memberOps,
    model,
  });

  const detectedIntents = detectIntents(trimmedText);
  const plannedIntents = sanitizeIntents(planned.plan?.intents);
  const finalIntents = Array.from(new Set([...(plannedIntents.length ? plannedIntents : []), ...detectedIntents]));

  const planActions = sanitizeActions(planned.plan?.actions);
  const actions = planActions.length ? planActions : buildActions(finalIntents, followupCount);

  const autoBuild = {
    workspace: sanitizeTextValue(planned.plan?.autoBuild?.workspace) || `${church.slug}-mobile-world-ops`,
    shepherdingQueue: Array.isArray(planned.plan?.autoBuild?.shepherdingQueue) && planned.plan.autoBuild.shepherdingQueue.length
      ? planned.plan.autoBuild.shepherdingQueue.map((item) => String(item).trim()).filter(Boolean)
      : actions.map((item) => item.title),
    memberOps: Array.isArray(planned.plan?.autoBuild?.memberOps) && planned.plan.autoBuild.memberOps.length
      ? planned.plan.autoBuild.memberOps.map((item) => String(item).trim()).filter(Boolean)
      : memberOps,
  };

  const loopId = `loop-${church.slug}-${Date.now()}`;
  const agentGrowth = {
    loopId,
    title: `${church.name} Mobile World Agent Loop`,
    summary: `후속 ${followupCount}명, 가정 ${householdCount}개 기준으로 월드 채팅 운영 루프 생성`,
    suggestedGithubIssue: `[mobile-world] ${church.slug} auto-build loop: ${finalIntents.join(", ")}`,
  };

  const dbActions = await applyDbActions({
    churchId: church.id,
    text: trimmedText,
    statusPlan: planStatusPatch(trimmedText),
    intents: finalIntents,
  });

  const dbActionLine = dbActions.applied
    ? dbActions.statusTag
      ? ` DB 반영: ${dbActions.updatedMembers.join(", ")} → ${dbActions.statusTag}, 후속기록 ${dbActions.followUpRecords}건.`
      : ` DB 반영: ${dbActions.note ?? dbActions.updatedMembers.join(", ")}.`
    : dbActions.note
      ? ` (${dbActions.note})`
      : "";

  const fallbackReply = [
    `${church.name} 기준으로 월드 운영 시스템을 자동 구축했어.`,
    `핵심 의도: ${finalIntents.join(", ")}`,
    `현재 후속 필요 ${followupCount}명, 가정 ${householdCount}개를 기준으로 실행 큐를 만들었어.`,
    `요청 반영: "${trimmedText}"${dbActionLine}`,
  ].join(" ");

  const reply = typeof planned.plan?.reply === "string" && planned.plan.reply.trim() ? `${planned.plan.reply.trim()}${dbActionLine}` : fallbackReply;

  const output: OrchestrateOutput = {
    ok: true,
    reply,
    actions,
    intents: finalIntents,
    autoBuild,
    agentGrowth,
    dbActions,
    diagnostics: planned.diagnostics,
  };

  await prisma.activityLog.create({
    data: {
      churchId: church.id,
      action: "MOBILE_WORLD_CHAT_ORCHESTRATED",
      targetType: "MOBILE_WORLD_CHAT",
      metadata: JSON.stringify({
        source: planned.diagnostics.mode,
        diagnostics: planned.diagnostics,
        text: trimmedText,
        intents: finalIntents,
        actions,
        autoBuild,
        agentGrowth,
        dbActions,
      }),
    },
  });

  await prisma.activityLog.create({
    data: {
      churchId: church.id,
      action: "MOBILE_WORLD_CHAT_BACKUP",
      targetType: "MOBILE_CHAT_COMMAND",
      targetId: safeAccountKey,
      metadata: JSON.stringify({
        accountKey: safeAccountKey,
        churchSlug: church.slug,
        input: { text: trimmedText },
        output,
        savedAt: new Date().toISOString(),
      }),
    },
  });

  return output;
}
