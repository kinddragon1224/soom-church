import { NextRequest, NextResponse } from "next/server";

import { getRecentChurchByUserId } from "@/lib/church-context";
import { prisma } from "@/lib/prisma";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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

async function ensureChurchBySlug(churchSlug: string, accountKey: string) {
  const slug = normalizeChurchSlugInput(churchSlug);
  const user = accountKey !== "anon"
    ? await prisma.user.findUnique({ where: { id: accountKey }, select: { id: true, name: true, isActive: true } })
    : null;

  const existing = await prisma.church.findFirst({
    where: { slug },
    select: { id: true },
  });

  if (existing) {
    if (user?.id && user.isActive) {
      await prisma.churchMembership.upsert({
        where: { userId_churchId: { userId: user.id, churchId: existing.id } },
        create: { userId: user.id, churchId: existing.id, role: "OWNER", isActive: true },
        update: { isActive: true },
      });
    }
    return existing;
  }

  return prisma.church.create({
    data: {
      slug,
      name: user?.name ? `${user.name} 목장` : slugTitle(slug),
      memberships: user?.id && user.isActive
        ? {
            create: {
              userId: user.id,
              role: "OWNER",
              isActive: true,
            },
          }
        : undefined,
    },
    select: { id: true },
  });
}

async function resolveChurch(churchSlug: string, accountKey: string) {
  if (accountKey === "anon") return null;

  if (accountKey !== "anon") {
    const recent = await getRecentChurchByUserId(accountKey);
    if (recent?.id) {
      return { id: recent.id };
    }
  }

  return ensureChurchBySlug(`acct-${accountKey}`, accountKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const churchSlug = normalizeText(body.churchSlug);
    const accountKey = normalizeAccountKey(body.accountKey);
    if (accountKey === "anon") {
      return NextResponse.json({ error: "account login required" }, { status: 401 });
    }
    const name = normalizeText(body.name);
    const household = normalizeText(body.household);
    const state = normalizeText(body.state);
    const nextAction = normalizeText(body.nextAction);

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const church = await resolveChurch(churchSlug, accountKey);

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
    const accountKey = normalizeAccountKey(body.accountKey);
    if (accountKey === "anon") {
      return NextResponse.json({ error: "account login required" }, { status: 401 });
    }
    const idRaw = normalizeText(body.id);
    const name = normalizeText(body.name);
    const household = normalizeText(body.household);
    const state = normalizeText(body.state);
    const nextAction = normalizeText(body.nextAction);

    if (!idRaw) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const memberId = idRaw.startsWith("p-") ? idRaw.slice(2) : idRaw;

    const exists = await prisma.member.findFirst({
      where: { id: memberId, isDeleted: false },
      select: { id: true, churchId: true },
    });

    const resolvedChurch = await resolveChurch(churchSlug, accountKey);
    let finalMemberId = memberId;
    let churchId: string | null = exists?.churchId ?? resolvedChurch?.id ?? null;
    let created = false;

    if (!exists) {
      if (!churchId || !name) {
        return NextResponse.json({ error: "member not found" }, { status: 404 });
      }

      const byName = await prisma.member.findFirst({
        where: { churchId, name, isDeleted: false },
        select: { id: true, churchId: true },
      });

      if (byName) {
        finalMemberId = byName.id;
        churchId = byName.churchId;
      } else {
        const createdMember = await prisma.member.create({
          data: {
            churchId,
            name,
            gender: "OTHER",
            birthDate: new Date("2000-01-01T00:00:00.000Z"),
            phone: `pending-${Date.now()}`,
            statusTag: "등록",
            requiresFollowUp: false,
          },
          select: { id: true, churchId: true },
        });
        finalMemberId = createdMember.id;
        churchId = createdMember.churchId;
        created = true;
      }
    }

    if (!churchId) {
      return NextResponse.json({ error: "member church not linked" }, { status: 400 });
    }

    const householdId = await findOrCreateHousehold(churchId, household);
    const status = memberStatus(state);

    await prisma.member.update({
      where: { id: finalMemberId },
      data: {
        name: name || undefined,
        householdId: householdId ?? undefined,
        statusTag: status.statusTag,
        requiresFollowUp: status.requiresFollowUp,
        notes: nextAction || null,
      },
    });

    return NextResponse.json({ ok: true, id: finalMemberId, created });
  } catch {
    return NextResponse.json({ error: "failed to update member" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const churchSlug = normalizeText(body.churchSlug);
    const accountKey = normalizeAccountKey(body.accountKey);
    if (accountKey === "anon") {
      return NextResponse.json({ error: "account login required" }, { status: 401 });
    }
    const idRaw = normalizeText(body.id);
    const name = normalizeText(body.name);

    const memberId = idRaw.startsWith("p-") ? idRaw.slice(2) : idRaw;

    let target = memberId
      ? await prisma.member.findFirst({
          where: { id: memberId, isDeleted: false },
          select: { id: true, churchId: true, name: true },
        })
      : null;

    if (!target && name) {
      const church = await resolveChurch(churchSlug, accountKey);
      if (church) {
        target = await prisma.member.findFirst({
          where: { churchId: church.id, name, isDeleted: false },
          orderBy: { updatedAt: "desc" },
          select: { id: true, churchId: true, name: true },
        });
      }
    }

    if (!target) {
      return NextResponse.json({ error: "member not found" }, { status: 404 });
    }

    await prisma.member.update({
      where: { id: target.id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ ok: true, id: target.id, name: target.name });
  } catch {
    return NextResponse.json({ error: "failed to delete member" }, { status: 500 });
  }
}
