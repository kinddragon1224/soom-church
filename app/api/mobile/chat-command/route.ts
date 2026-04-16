import { NextRequest, NextResponse } from "next/server";

import { orchestrateMobileWorldChat } from "@/lib/mobile-world-orchestrator";
import { prisma } from "@/lib/prisma";

type Body = {
  churchSlug?: string;
  accountKey?: string;
  text?: string;
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

async function resolveChurchId(churchSlug: string) {
  const church = await prisma.church.findFirst({
    where: { slug: churchSlug, isActive: true },
    select: { id: true },
  });

  return church?.id ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const churchSlug = searchParams.get("churchSlug")?.trim() || "gido";
    const accountKey = normalizeAccountKey(searchParams.get("accountKey"));
    const limitRaw = Number(searchParams.get("limit") || 20);
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 20;

    const churchId = await resolveChurchId(churchSlug);
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
  const body = (await request.json().catch(() => null)) as Body | null;
  const text = body?.text?.trim();
  const churchSlug = body?.churchSlug?.trim() || "gido";
  const accountKey = normalizeAccountKey(body?.accountKey);

  if (!text) {
    return NextResponse.json({ ok: false, message: "메시지가 비어 있어." }, { status: 400 });
  }

  try {
    const result = await orchestrateMobileWorldChat({
      churchSlug,
      accountKey,
      text,
    });

    return NextResponse.json(result);
  } catch {
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
    });
  }
}
