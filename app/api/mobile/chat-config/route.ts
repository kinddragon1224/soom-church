import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type Body = {
  churchSlug?: string;
  accountKey?: string;
  model?: string;
};

const ADMIN_EMAILS = (process.env.MOBILE_CHAT_ADMIN_EMAILS || "sunyong1224@gmail.com")
  .split(",")
  .map((item) => item.trim().toLowerCase())
  .filter(Boolean);

function normalizeAccountKey(value: unknown) {
  if (typeof value !== "string") return "anon";
  const next = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .slice(0, 80);
  return next || "anon";
}

function normalizeModel(value: unknown) {
  if (typeof value !== "string") return null;
  const next = value.trim();
  if (!next) return null;
  if (!/^[a-zA-Z0-9._:/-]{2,120}$/.test(next)) return null;
  return next;
}

async function resolveChurch(churchSlug: string) {
  return prisma.church.findFirst({
    where: { slug: churchSlug, isActive: true },
    select: { id: true, slug: true, name: true },
  });
}

async function resolveAccountUserEmail(accountKey: string) {
  const user = await prisma.user.findUnique({
    where: { id: accountKey },
    select: { email: true },
  });
  return user?.email?.toLowerCase() ?? null;
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
    select: { metadata: true, createdAt: true },
  });

  if (!latest?.metadata) return null;

  try {
    const parsed = JSON.parse(latest.metadata) as { model?: unknown; updatedBy?: string; updatedEmail?: string };
    const model = normalizeModel(parsed.model);
    if (!model) return null;
    return {
      model,
      updatedAt: latest.createdAt,
      updatedBy: typeof parsed.updatedBy === "string" ? parsed.updatedBy : null,
      updatedEmail: typeof parsed.updatedEmail === "string" ? parsed.updatedEmail : null,
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const churchSlug = searchParams.get("churchSlug")?.trim() || "gido";
  const church = await resolveChurch(churchSlug);

  if (!church) {
    return NextResponse.json({ ok: false, message: "church not found" }, { status: 404 });
  }

  const config = await readChatModelConfig(church.id);

  return NextResponse.json({
    ok: true,
    churchSlug: church.slug,
    model: config?.model || process.env.OPENCLAW_BRIDGE_MODEL || "default",
    source: config ? "church-config" : "env-default",
    updatedAt: config?.updatedAt || null,
    updatedBy: config?.updatedBy || null,
    updatedEmail: config?.updatedEmail || null,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Body | null;
  const churchSlug = body?.churchSlug?.trim() || "gido";
  const accountKey = normalizeAccountKey(body?.accountKey);
  const model = normalizeModel(body?.model);

  if (!model) {
    return NextResponse.json({ ok: false, message: "invalid model" }, { status: 400 });
  }

  const church = await resolveChurch(churchSlug);
  if (!church) {
    return NextResponse.json({ ok: false, message: "church not found" }, { status: 404 });
  }

  const email = await resolveAccountUserEmail(accountKey);
  const isAdmin = Boolean(email && ADMIN_EMAILS.includes(email));
  if (!isAdmin) {
    return NextResponse.json({ ok: false, message: "forbidden" }, { status: 403 });
  }

  await prisma.activityLog.create({
    data: {
      churchId: church.id,
      action: "MOBILE_CHAT_MODEL_UPDATED",
      targetType: "MOBILE_CHAT_CONFIG",
      targetId: church.id,
      metadata: JSON.stringify({
        model,
        updatedBy: accountKey,
        updatedEmail: email,
        updatedAt: new Date().toISOString(),
      }),
    },
  });

  return NextResponse.json({
    ok: true,
    churchSlug: church.slug,
    model,
    updatedBy: accountKey,
    updatedEmail: email,
  });
}

