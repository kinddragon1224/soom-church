import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const churchSlug = searchParams.get("churchSlug")?.trim() || "gido";

    const church = await prisma.church.findFirst({
      where: { slug: churchSlug, isActive: true },
      select: { id: true },
    });

    if (!church) {
      return NextResponse.json({ ok: true, loops: [] });
    }

    const logs = await prisma.activityLog.findMany({
      where: {
        churchId: church.id,
        action: "MOBILE_WORLD_CHAT_ORCHESTRATED",
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        createdAt: true,
        metadata: true,
      },
    });

    const loops = logs.map((log) => {
      let parsed: Record<string, unknown> = {};
      try {
        parsed = log.metadata ? (JSON.parse(log.metadata) as Record<string, unknown>) : {};
      } catch {
        parsed = {};
      }

      return {
        id: log.id,
        createdAt: log.createdAt,
        text: parsed.text ?? null,
        intents: parsed.intents ?? [],
        actions: parsed.actions ?? [],
        agentGrowth: parsed.agentGrowth ?? null,
      };
    });

    return NextResponse.json({ ok: true, loops });
  } catch {
    return NextResponse.json({ ok: true, loops: [] });
  }
}
