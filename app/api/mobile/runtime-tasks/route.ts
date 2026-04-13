import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type RuntimeTask = {
  id: string;
  title: string;
  due: string;
  owner: string;
  completed: boolean;
  createdAt: number;
};

type SyncBody = {
  churchSlug?: string;
  tasks?: RuntimeTask[];
};

function normalizeTasks(value: unknown): RuntimeTask[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const maybe = item as Partial<RuntimeTask>;
      if (!maybe.id || !maybe.title || !maybe.due || !maybe.owner) return null;

      return {
        id: String(maybe.id),
        title: String(maybe.title),
        due: String(maybe.due),
        owner: String(maybe.owner),
        completed: Boolean(maybe.completed),
        createdAt: typeof maybe.createdAt === "number" ? maybe.createdAt : Date.now(),
      };
    })
    .filter((task): task is RuntimeTask => Boolean(task));
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
    const churchId = await resolveChurchId(churchSlug);

    if (!churchId) {
      return NextResponse.json({ ok: true, tasks: [] as RuntimeTask[] });
    }

    const latest = await prisma.activityLog.findFirst({
      where: {
        churchId,
        action: "MOBILE_RUNTIME_TASKS_SYNC",
        targetType: "MOBILE_RUNTIME_TASKS",
      },
      orderBy: { createdAt: "desc" },
      select: { metadata: true },
    });

    if (!latest?.metadata) {
      return NextResponse.json({ ok: true, tasks: [] as RuntimeTask[] });
    }

    const parsed = JSON.parse(latest.metadata) as { tasks?: unknown };
    return NextResponse.json({ ok: true, tasks: normalizeTasks(parsed.tasks) });
  } catch {
    return NextResponse.json({ ok: true, tasks: [] as RuntimeTask[] });
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as SyncBody | null;
  const churchSlug = body?.churchSlug?.trim() || "gido";
  const tasks = normalizeTasks(body?.tasks);

  try {
    const churchId = await resolveChurchId(churchSlug);

    if (!churchId) {
      return NextResponse.json({ ok: true, saved: false });
    }

    await prisma.activityLog.create({
      data: {
        churchId,
        action: "MOBILE_RUNTIME_TASKS_SYNC",
        targetType: "MOBILE_RUNTIME_TASKS",
        metadata: JSON.stringify({ tasks }),
      },
    });

    return NextResponse.json({ ok: true, saved: true, count: tasks.length });
  } catch {
    return NextResponse.json({ ok: true, saved: false });
  }
}
