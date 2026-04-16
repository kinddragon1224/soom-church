import { NextRequest, NextResponse } from "next/server";

import { getRecentChurchByUserId } from "@/lib/church-context";
import { orchestrateMobileWorldChat } from "@/lib/mobile-world-orchestrator";
import { prisma } from "@/lib/prisma";

type Body = {
  churchSlug?: string;
  accountKey?: string;
  text?: string;
};

function normalizeModel(value: unknown) {
  if (typeof value !== "string") return null;
  const next = value.trim();
  if (!next) return null;
  if (!/^[a-zA-Z0-9._:/-]{2,120}$/.test(next)) return null;
  return next;
}

function normalizeAccountKey(value: unknown) {
  if (typeof value !== "string") return "anon";
  const next = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .slice(0, 80);
  return next || "anon";
}

async function resolveChurch(churchSlug: string, accountKey?: string | null) {
  const church = await prisma.church.findFirst({
    where: { slug: churchSlug, isActive: true },
    select: { id: true, slug: true },
  });

  if (church) return church;

  const key = normalizeAccountKey(accountKey);
  if (!key || key === "anon") return null;

  const recent = await getRecentChurchByUserId(key);
  if (!recent) return null;

  return {
    id: recent.id,
    slug: recent.slug,
  };
}

function safeSlugPart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 20);
}

async function ensureChurchForAccount(accountKey?: string | null) {
  const key = normalizeAccountKey(accountKey);
  if (!key || key === "anon") return null;

  const user = await prisma.user.findUnique({
    where: { id: key },
    select: { id: true, name: true, isActive: true },
  });

  if (!user || !user.isActive) return null;

  const basePart = safeSlugPart(user.name || key) || safeSlugPart(key) || "mobile";
  for (let i = 0; i < 20; i += 1) {
    const suffix = i === 0 ? "" : `-${i + 1}`;
    const slug = `acct-${basePart}${suffix}`;
    const existing = await prisma.church.findFirst({
      where: { slug },
      select: { id: true, slug: true },
    });
    if (existing) {
      await prisma.churchMembership.upsert({
        where: { userId_churchId: { userId: user.id, churchId: existing.id } },
        create: { userId: user.id, churchId: existing.id, role: "OWNER", isActive: true },
        update: { isActive: true, role: "OWNER" },
      });
      return existing;
    }

    const created = await prisma.church.create({
      data: {
        slug,
        name: `${user.name || "개인"} 목장`,
        memberships: {
          create: {
            userId: user.id,
            role: "OWNER",
            isActive: true,
          },
        },
      },
      select: { id: true, slug: true },
    });

    return created;
  }

  return null;
}

async function resolveOrEnsureChurch(churchSlug: string, accountKey?: string | null) {
  const resolved = await resolveChurch(churchSlug, accountKey);
  if (resolved) return resolved;
  return ensureChurchForAccount(accountKey);
}

async function resolveChurchId(churchSlug: string, accountKey?: string | null) {
  const church = await resolveOrEnsureChurch(churchSlug, accountKey);
  return church?.id ?? null;
}

async function readChatModelConfig(churchId: string) {
  const latest = await prisma.activityLog.findFirst({
    where: {
      churchId,
      action: "MOBILE_CHAT_MODEL_UPDATED",
      targetType: "MOBILE_CHAT_CONFIG",
      targetId: churchId,
    },
    orderBy: { createdAt: "desc" },
    select: { metadata: true },
  });

  if (!latest?.metadata) return null;

  try {
    const parsed = JSON.parse(latest.metadata) as { model?: unknown };
    return normalizeModel(parsed.model);
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const churchSlug = searchParams.get("churchSlug")?.trim() || "gido";
    const accountKey = normalizeAccountKey(searchParams.get("accountKey"));
    const limitRaw = Number(searchParams.get("limit") || 20);
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 20;

    const churchId = await resolveChurchId(churchSlug, accountKey);
    if (!churchId) {
      return NextResponse.json({ ok: true, backups: [] });
    }

    const logs = await prisma.activityLog.findMany({
      where: {
        churchId,
        action: "MOBILE_WORLD_CHAT_BACKUP",
        targetType: "MOBILE_CHAT_COMMAND",
        targetId: accountKey,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true, createdAt: true, metadata: true },
    });

    const backups = logs.map((log) => {
      try {
        const parsed = log.metadata ? JSON.parse(log.metadata) : null;
        return {
          id: log.id,
          createdAt: log.createdAt,
          data: parsed,
        };
      } catch {
        return {
          id: log.id,
          createdAt: log.createdAt,
          data: null,
        };
      }
    });

    return NextResponse.json({ ok: true, backups });
  } catch {
    return NextResponse.json({ ok: true, backups: [] });
  }
}

export async function POST(request: NextRequest) {
  const requestId = `chat-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const body = (await request.json().catch(() => null)) as Body | null;
  const text = body?.text?.trim();
  const churchSlug = body?.churchSlug?.trim() || "gido";
  const accountKey = normalizeAccountKey(body?.accountKey);

  if (!text) {
    return NextResponse.json({ ok: false, message: "메시지가 비어 있어." }, { status: 400 });
  }

  try {
    const resolvedChurch = await resolveOrEnsureChurch(churchSlug, accountKey);
    const churchId = resolvedChurch?.id ?? null;
    const model = churchId ? await readChatModelConfig(churchId) : null;

    const result = await orchestrateMobileWorldChat({
      churchSlug: resolvedChurch?.slug ?? churchSlug,
      accountKey,
      model: model || undefined,
      text,
    });

    return NextResponse.json({
      ...result,
      diagnostics: {
        ...result.diagnostics,
        reason: result.diagnostics?.reason,
        requestId,
      },
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown route error";
    console.error("[chat-command] request failed", { requestId, churchSlug, accountKey, reason });
    return NextResponse.json({
      ok: true,
      reply: `좋아. "${text}" 기준으로 기본 실행 루프를 만들었어. 우선 후속 연락 대상부터 정리하자.`,
      actions: [
        { id: "fallback-followup", title: "후속 연락 대상 정리", due: "오늘", owner: "목양 관리" },
        { id: "fallback-status", title: "상태태그 업데이트", due: "오늘", owner: "목양 관리" },
      ],
      intents: ["GENERAL_SHEPHERDING"],
      autoBuild: {
        workspace: "fallback-workspace",
        shepherdingQueue: ["후속 연락 대상 정리", "상태태그 업데이트"],
        memberOps: ["상태태그 점검"],
      },
      agentGrowth: {
        loopId: `loop-${Date.now()}`,
        title: "Fallback Mobile World Agent Loop",
        summary: "오케스트레이션 실패로 기본 루프 실행",
        suggestedGithubIssue: "[mobile-world] fallback loop recovery",
      },
      diagnostics: {
        mode: "rule",
        provider: "route-catch-fallback",
        reason: `${reason} (requestId:${requestId})`,
      },
    });
  }
}
