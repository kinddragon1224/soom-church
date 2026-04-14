import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function memberStatus(state: string) {
  const normalized = state.trim();
  if (!normalized) return { statusTag: "등록", requiresFollowUp: false };
  return {
    statusTag: normalized,
    requiresFollowUp: normalized.includes("돌봄") || normalized.includes("후속"),
  };
}

async function findOrCreateHousehold(churchId: string, householdName: string) {
  const name = householdName.trim();
  if (!name) return null;

  const existing = await prisma.household.findFirst({
    where: { churchId, name },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await prisma.household.create({
    data: {
      churchId,
      name,
    },
    select: { id: true },
  });

  return created.id;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const churchSlug = normalizeText(body.churchSlug);
    const name = normalizeText(body.name);
    const household = normalizeText(body.household);
    const state = normalizeText(body.state);
    const nextAction = normalizeText(body.nextAction);

    if (!churchSlug || !name) {
      return NextResponse.json({ error: "churchSlug and name are required" }, { status: 400 });
    }

    const church = await prisma.church.findFirst({
      where: { slug: churchSlug, isActive: true },
      select: { id: true },
    });

    if (!church) {
      return NextResponse.json({ error: "church not found" }, { status: 404 });
    }

    const householdId = await findOrCreateHousehold(church.id, household);
    const status = memberStatus(state);

    const created = await prisma.member.create({
      data: {
        churchId: church.id,
        name,
        gender: "OTHER",
        birthDate: new Date("2000-01-01T00:00:00.000Z"),
        phone: `pending-${Date.now()}`,
        householdId,
        statusTag: status.statusTag,
        requiresFollowUp: status.requiresFollowUp,
        notes: nextAction || null,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch {
    return NextResponse.json({ error: "failed to create member" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const churchSlug = normalizeText(body.churchSlug);
    const idRaw = normalizeText(body.id);
    const name = normalizeText(body.name);
    const household = normalizeText(body.household);
    const state = normalizeText(body.state);
    const nextAction = normalizeText(body.nextAction);

    if (!churchSlug || !idRaw) {
      return NextResponse.json({ error: "churchSlug and id are required" }, { status: 400 });
    }

    const memberId = idRaw.startsWith("p-") ? idRaw.slice(2) : idRaw;

    const church = await prisma.church.findFirst({
      where: { slug: churchSlug, isActive: true },
      select: { id: true },
    });

    if (!church) {
      return NextResponse.json({ error: "church not found" }, { status: 404 });
    }

    const exists = await prisma.member.findFirst({
      where: { id: memberId, churchId: church.id, isDeleted: false },
      select: { id: true },
    });

    if (!exists) {
      return NextResponse.json({ error: "member not found" }, { status: 404 });
    }

    const householdId = await findOrCreateHousehold(church.id, household);
    const status = memberStatus(state);

    await prisma.member.update({
      where: { id: memberId },
      data: {
        name: name || undefined,
        householdId: householdId ?? undefined,
        statusTag: status.statusTag,
        requiresFollowUp: status.requiresFollowUp,
        notes: nextAction || null,
      },
    });

    return NextResponse.json({ ok: true, id: memberId });
  } catch {
    return NextResponse.json({ error: "failed to update member" }, { status: 500 });
  }
}
