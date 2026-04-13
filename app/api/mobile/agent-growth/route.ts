import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type PublishBody = {
  churchSlug?: string;
  loopId?: string;
};

type LoopMetadata = {
  text?: string;
  intents?: unknown;
  actions?: unknown;
  agentGrowth?: {
    loopId?: string;
    title?: string;
    summary?: string;
    suggestedGithubIssue?: string;
  } | null;
  dbActions?: unknown;
};

function parseJsonMetadata(raw: string | null) {
  if (!raw) return {} as LoopMetadata;
  try {
    return JSON.parse(raw) as LoopMetadata;
  } catch {
    return {} as LoopMetadata;
  }
}

async function resolveChurch(churchSlug: string) {
  return prisma.church.findFirst({
    where: { slug: churchSlug, isActive: true },
    select: { id: true, slug: true, name: true },
  });
}

async function publishToGithub({ title, body }: {
  title: string;
  body: string;
}) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;

  if (!token || !repo || !repo.includes("/")) {
    return { published: false as const, reason: "GITHUB_TOKEN/GITHUB_REPO 미설정" };
  }

  const [owner, repoName] = repo.split("/");
  if (!owner || !repoName) {
    return { published: false as const, reason: "GITHUB_REPO 형식 오류(owner/repo 필요)" };
  }

  const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/issues`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "soom-church-mobile-world",
    },
    body: JSON.stringify({
      title,
      body,
      labels: ["mobile-world", "agent-growth"],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    return {
      published: false as const,
      reason: `GitHub API 실패(${response.status})${errorText ? `: ${errorText.slice(0, 160)}` : ""}`,
    };
  }

  const data = (await response.json()) as { html_url?: string; number?: number };
  return {
    published: true as const,
    issueUrl: data.html_url ?? null,
    issueNumber: data.number ?? null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const churchSlug = searchParams.get("churchSlug")?.trim() || "gido";

    const church = await resolveChurch(churchSlug);

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
      const parsed = parseJsonMetadata(log.metadata);

      return {
        id: log.id,
        createdAt: log.createdAt,
        text: parsed.text ?? null,
        intents: parsed.intents ?? [],
        actions: parsed.actions ?? [],
        agentGrowth: parsed.agentGrowth ?? null,
        dbActions: parsed.dbActions ?? null,
      };
    });

    return NextResponse.json({ ok: true, loops });
  } catch {
    return NextResponse.json({ ok: true, loops: [] });
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as PublishBody | null;
  const churchSlug = body?.churchSlug?.trim() || "gido";
  const loopId = body?.loopId?.trim();

  if (!loopId) {
    return NextResponse.json({ ok: false, message: "loopId가 비어 있어." }, { status: 400 });
  }

  try {
    const church = await resolveChurch(churchSlug);
    if (!church) {
      return NextResponse.json({ ok: false, message: "교회를 찾지 못했어." }, { status: 404 });
    }

    const log = await prisma.activityLog.findFirst({
      where: {
        churchId: church.id,
        action: "MOBILE_WORLD_CHAT_ORCHESTRATED",
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, metadata: true, createdAt: true },
    });

    if (!log) {
      return NextResponse.json({ ok: false, message: "발행할 성장 로그가 없어." }, { status: 404 });
    }

    const parsed = parseJsonMetadata(log.metadata);
    const growth = parsed.agentGrowth;

    if (!growth?.loopId || growth.loopId !== loopId) {
      const loopMatchedLog = await prisma.activityLog.findFirst({
        where: {
          churchId: church.id,
          action: "MOBILE_WORLD_CHAT_ORCHESTRATED",
          metadata: { contains: loopId },
        },
        orderBy: { createdAt: "desc" },
        select: { id: true, metadata: true, createdAt: true },
      });

      if (!loopMatchedLog) {
        return NextResponse.json({ ok: false, message: "요청한 loopId를 찾지 못했어." }, { status: 404 });
      }

      const matched = parseJsonMetadata(loopMatchedLog.metadata);
      const matchedGrowth = matched.agentGrowth;

      const issueTitle = matchedGrowth?.suggestedGithubIssue || `[mobile-world] ${church.slug} agent growth loop`;
      const issueBody = [
        `- Church: ${church.name} (${church.slug})`,
        `- LoopId: ${matchedGrowth?.loopId ?? loopId}`,
        `- CreatedAt: ${loopMatchedLog.createdAt.toISOString()}`,
        matchedGrowth?.summary ? `- Summary: ${matchedGrowth.summary}` : null,
        matched.text ? `- Source Text: ${matched.text}` : null,
        "",
        "## Intents",
        Array.isArray(matched.intents) ? JSON.stringify(matched.intents, null, 2) : "[]",
        "",
        "## Actions",
        Array.isArray(matched.actions) ? JSON.stringify(matched.actions, null, 2) : "[]",
      ]
        .filter(Boolean)
        .join("\n");

      const github = await publishToGithub({ title: issueTitle, body: issueBody });

      await prisma.activityLog.create({
        data: {
          churchId: church.id,
          action: "MOBILE_AGENT_GROWTH_PUBLISHED",
          targetType: "MOBILE_AGENT_GROWTH_QUEUE",
          metadata: JSON.stringify({
            loopLogId: loopMatchedLog.id,
            loopId: matchedGrowth?.loopId ?? loopId,
            issueTitle,
            github,
            fallbackQueueOnly: !github.published,
          }),
        },
      });

      return NextResponse.json({
        ok: true,
        published: github.published,
        queueSaved: true,
        issueUrl: github.published ? github.issueUrl ?? null : null,
        reason: github.published ? null : github.reason,
      });
    }

    const issueTitle = growth.suggestedGithubIssue || `[mobile-world] ${church.slug} agent growth loop`;
    const issueBody = [
      `- Church: ${church.name} (${church.slug})`,
      `- LoopId: ${growth.loopId}`,
      `- CreatedAt: ${log.createdAt.toISOString()}`,
      growth.summary ? `- Summary: ${growth.summary}` : null,
      parsed.text ? `- Source Text: ${parsed.text}` : null,
      "",
      "## Intents",
      Array.isArray(parsed.intents) ? JSON.stringify(parsed.intents, null, 2) : "[]",
      "",
      "## Actions",
      Array.isArray(parsed.actions) ? JSON.stringify(parsed.actions, null, 2) : "[]",
    ]
      .filter(Boolean)
      .join("\n");

    const github = await publishToGithub({ title: issueTitle, body: issueBody });

    await prisma.activityLog.create({
      data: {
        churchId: church.id,
        action: "MOBILE_AGENT_GROWTH_PUBLISHED",
        targetType: "MOBILE_AGENT_GROWTH_QUEUE",
        metadata: JSON.stringify({
          loopLogId: log.id,
          loopId: growth.loopId,
          issueTitle,
          github,
          fallbackQueueOnly: !github.published,
        }),
      },
    });

    return NextResponse.json({
      ok: true,
      published: github.published,
      queueSaved: true,
      issueUrl: github.published ? github.issueUrl ?? null : null,
      reason: github.published ? null : github.reason,
    });
  } catch {
    return NextResponse.json({ ok: false, message: "발행 중 오류가 났어." }, { status: 500 });
  }
}
