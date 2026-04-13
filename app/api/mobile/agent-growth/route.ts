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

type PublishMetadata = {
  loopLogId?: string;
  loopId?: string;
  issueTitle?: string;
  github?: {
    published?: boolean;
    issueUrl?: string | null;
    reason?: string;
  };
  fallbackQueueOnly?: boolean;
};

function parseJson<T>(raw: string | null, fallback: T) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function resolveChurch(churchSlug: string) {
  return prisma.church.findFirst({
    where: { slug: churchSlug, isActive: true },
    select: { id: true, slug: true, name: true },
  });
}

async function publishToGithub({ title, body }: { title: string; body: string }) {
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

function buildIssuePayload(params: {
  church: { name: string; slug: string };
  loopCreatedAt: Date;
  loopId: string;
  metadata: LoopMetadata;
}) {
  const { church, loopCreatedAt, loopId, metadata } = params;
  const growth = metadata.agentGrowth;
  const issueTitle = growth?.suggestedGithubIssue || `[mobile-world] ${church.slug} agent growth loop`;
  const issueBody = [
    `- Church: ${church.name} (${church.slug})`,
    `- LoopId: ${loopId}`,
    `- CreatedAt: ${loopCreatedAt.toISOString()}`,
    growth?.summary ? `- Summary: ${growth.summary}` : null,
    metadata.text ? `- Source Text: ${metadata.text}` : null,
    "",
    "## Intents",
    Array.isArray(metadata.intents) ? JSON.stringify(metadata.intents, null, 2) : "[]",
    "",
    "## Actions",
    Array.isArray(metadata.actions) ? JSON.stringify(metadata.actions, null, 2) : "[]",
  ]
    .filter(Boolean)
    .join("\n");

  return { issueTitle, issueBody };
}

async function findLoopLog(churchId: string, loopId: string) {
  const candidates = await prisma.activityLog.findMany({
    where: {
      churchId,
      action: "MOBILE_WORLD_CHAT_ORCHESTRATED",
      metadata: { contains: loopId },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { id: true, createdAt: true, metadata: true },
  });

  for (const candidate of candidates) {
    const parsed = parseJson<LoopMetadata>(candidate.metadata, {} as LoopMetadata);
    const candidateLoopId = parsed.agentGrowth?.loopId;
    if (candidateLoopId === loopId) {
      return {
        id: candidate.id,
        createdAt: candidate.createdAt,
        metadata: parsed,
      };
    }
  }

  return null;
}

async function findExistingPublish(churchId: string, loopId: string) {
  const logs = await prisma.activityLog.findMany({
    where: {
      churchId,
      action: "MOBILE_AGENT_GROWTH_PUBLISHED",
      metadata: { contains: loopId },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { id: true, createdAt: true, metadata: true },
  });

  for (const log of logs) {
    const parsed = parseJson<PublishMetadata>(log.metadata, {} as PublishMetadata);
    if (parsed.loopId === loopId) {
      return {
        id: log.id,
        createdAt: log.createdAt,
        metadata: parsed,
      };
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const churchSlug = searchParams.get("churchSlug")?.trim() || "gido";

    const church = await resolveChurch(churchSlug);
    if (!church) {
      return NextResponse.json({ ok: true, loops: [] });
    }

    const [loopLogs, publishLogs] = await Promise.all([
      prisma.activityLog.findMany({
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
      }),
      prisma.activityLog.findMany({
        where: {
          churchId: church.id,
          action: "MOBILE_AGENT_GROWTH_PUBLISHED",
        },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          createdAt: true,
          metadata: true,
        },
      }),
    ]);

    const publishMap = new Map<
      string,
      { createdAt: Date; published: boolean; issueUrl: string | null; reason: string | null }
    >();

    for (const publishLog of publishLogs) {
      const parsed = parseJson<PublishMetadata>(publishLog.metadata, {} as PublishMetadata);
      const loopId = parsed.loopId;
      if (!loopId || publishMap.has(loopId)) continue;
      publishMap.set(loopId, {
        createdAt: publishLog.createdAt,
        published: Boolean(parsed.github?.published),
        issueUrl: parsed.github?.issueUrl ?? null,
        reason: parsed.github?.reason ?? null,
      });
    }

    const loops = loopLogs.map((log) => {
      const parsed = parseJson<LoopMetadata>(log.metadata, {} as LoopMetadata);
      const loopId = parsed.agentGrowth?.loopId ?? null;
      const publish = loopId ? publishMap.get(loopId) : null;

      return {
        id: log.id,
        createdAt: log.createdAt,
        text: parsed.text ?? null,
        intents: parsed.intents ?? [],
        actions: parsed.actions ?? [],
        agentGrowth: parsed.agentGrowth ?? null,
        dbActions: parsed.dbActions ?? null,
        publish: publish
          ? {
              publishedAt: publish.createdAt,
              published: publish.published,
              issueUrl: publish.issueUrl,
              reason: publish.reason,
            }
          : null,
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

    const existing = await findExistingPublish(church.id, loopId);
    if (existing) {
      return NextResponse.json({
        ok: true,
        alreadyPublished: true,
        published: Boolean(existing.metadata.github?.published),
        queueSaved: true,
        issueUrl: existing.metadata.github?.issueUrl ?? null,
        reason: existing.metadata.github?.reason ?? null,
      });
    }

    const loopLog = await findLoopLog(church.id, loopId);
    if (!loopLog) {
      return NextResponse.json({ ok: false, message: "요청한 loopId를 찾지 못했어." }, { status: 404 });
    }

    const { issueTitle, issueBody } = buildIssuePayload({
      church: { name: church.name, slug: church.slug },
      loopCreatedAt: loopLog.createdAt,
      loopId,
      metadata: loopLog.metadata,
    });

    const github = await publishToGithub({ title: issueTitle, body: issueBody });

    await prisma.activityLog.create({
      data: {
        churchId: church.id,
        action: "MOBILE_AGENT_GROWTH_PUBLISHED",
        targetType: "MOBILE_AGENT_GROWTH_QUEUE",
        metadata: JSON.stringify({
          loopLogId: loopLog.id,
          loopId,
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
