import { NextRequest, NextResponse } from "next/server";

import { getRecentChurchByUserId } from "@/lib/church-context";
import { prisma } from "@/lib/prisma";

const FALLBACK_WORLD_OBJECTS = [
  { id: "hub", name: "목양 관리", kind: "hub", state: "핵심 진입", note: "사람/기도/후속 흐름으로 들어간다.", x: 148, y: 60, icon: "⛪" },
] as const;

const FALLBACK_PEOPLE_RECORDS: { id: string; name: string; household: string; state: string; nextAction: string }[] = [];

const FALLBACK_TASK_RECORDS: { id: string; title: string; due: string; owner: string }[] = [];

const FALLBACK_CHAT_QUICK_ACTIONS = [
  "이번 주 심방 필요한 사람 보여줘",
  "기도 요청 새로 들어온 것 정리해줘",
  "오늘 해야 할 후속 3개만 뽑아줘",
] as const;

const HOUSE_POSITIONS = [
  { x: 28, y: 180 },
  { x: 246, y: 190 },
  { x: 64, y: 368 },
  { x: 232, y: 382 },
  { x: 42, y: 500 },
  { x: 250, y: 520 },
];

const PERSON_POSITIONS = [
  { x: 132, y: 266 },
  { x: 212, y: 292 },
  { x: 162, y: 448 },
  { x: 110, y: 538 },
  { x: 198, y: 566 },
  { x: 80, y: 610 },
];

function withFallback<T>(value: T | null | undefined, fallback: T) {
  return value ?? fallback;
}

function safeStateTag(statusTag: string, requiresFollowUp: boolean) {
  if (requiresFollowUp) return "💧 돌봄";
  if (statusTag.includes("등록")) return "✉️ 후속";
  if (statusTag.includes("정착") || statusTag.includes("배정")) return "✨ 기도";
  return "안정";
}

function buildFallbackResponse() {
  return {
    worldObjects: [...FALLBACK_WORLD_OBJECTS],
    peopleRecords: [...FALLBACK_PEOPLE_RECORDS],
    taskRecords: [...FALLBACK_TASK_RECORDS],
    chatQuickActions: [...FALLBACK_CHAT_QUICK_ACTIONS],
  };
}

function normalizeAccountKey(value: string | null | undefined) {
  if (!value) return "anon";
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
    .slice(0, 20);
}

function normalizeChurchSlugInput(value: string | null | undefined) {
  const normalized = safeSlugPart(value ?? "");
  return normalized || "mobile";
}

function slugTitle(slug: string) {
  return `${slug.toUpperCase()} 목장`;
}

async function ensureChurchForAccount(accountKey: string) {
  if (!accountKey || accountKey === "anon") return null;

  const user = await prisma.user.findUnique({
    where: { id: accountKey },
    select: { id: true, name: true, isActive: true },
  });

  if (!user || !user.isActive) return null;

  const basePart = safeSlugPart(user.name || accountKey) || safeSlugPart(accountKey) || "mobile";
  for (let i = 0; i < 20; i += 1) {
    const suffix = i === 0 ? "" : `-${i + 1}`;
    const slug = `acct-${basePart}${suffix}`;
    const existing = await prisma.church.findFirst({
      where: { slug },
      select: { id: true, name: true },
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
      select: { id: true, name: true },
    });

    return created;
  }

  return null;
}

async function ensureChurchBySlug(churchSlug: string, accountKey: string) {
  const slug = normalizeChurchSlugInput(churchSlug);
  const user = accountKey && accountKey !== "anon"
    ? await prisma.user.findUnique({ where: { id: accountKey }, select: { id: true } })
    : null;

  const existing = await prisma.church.findFirst({
    where: { slug },
    select: { id: true, name: true },
  });

  if (existing) {
    if (user?.id) {
      await prisma.churchMembership.upsert({
        where: { userId_churchId: { userId: user.id, churchId: existing.id } },
        create: { userId: user.id, churchId: existing.id, role: "OWNER", isActive: true },
        update: { isActive: true },
      });
    }
    return existing;
  }

  if (user?.id) {
    return prisma.church.create({
      data: {
        slug,
        name: slugTitle(slug),
        memberships: {
          create: {
            userId: user.id,
            role: "OWNER",
            isActive: true,
          },
        },
      },
      select: { id: true, name: true },
    });
  }

  return prisma.church.create({
    data: {
      slug,
      name: slugTitle(slug),
    },
    select: { id: true, name: true },
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const churchSlug = searchParams.get("churchSlug")?.trim() || "gido";
    const accountKey = normalizeAccountKey(searchParams.get("accountKey"));

    let church = await prisma.church.findFirst({
      where: { slug: churchSlug, isActive: true },
      select: { id: true, name: true },
    });

    if (!church && accountKey !== "anon") {
      const recent = await getRecentChurchByUserId(accountKey);
      if (recent) {
        church = {
          id: recent.id,
          name: recent.name,
        };
      }
    }

    if (!church) {
      church = await ensureChurchForAccount(accountKey);
    }

    if (!church) {
      church = await ensureChurchBySlug(churchSlug, accountKey);
    }

    if (!church) {
      return NextResponse.json(buildFallbackResponse());
    }

    const [households, members] = await Promise.all([
      prisma.household.findMany({
        where: { churchId: church.id },
        orderBy: { updatedAt: "desc" },
        take: HOUSE_POSITIONS.length,
        select: {
          id: true,
          name: true,
          members: {
            where: { isDeleted: false },
            select: { id: true },
          },
        },
      }),
      prisma.member.findMany({
        where: { churchId: church.id, isDeleted: false },
        orderBy: [{ requiresFollowUp: "desc" }, { updatedAt: "desc" }],
        take: PERSON_POSITIONS.length,
        select: {
          id: true,
          name: true,
          statusTag: true,
          requiresFollowUp: true,
          group: { select: { name: true } },
          household: { select: { name: true } },
        },
      }),
    ]);

    if (!households.length && !members.length) {
      return NextResponse.json({
        worldObjects: [...FALLBACK_WORLD_OBJECTS],
        peopleRecords: [],
        taskRecords: [],
        chatQuickActions: [...FALLBACK_CHAT_QUICK_ACTIONS],
      });
    }

    const worldObjects = [
      {
        id: "hub",
        name: `${church.name} 목양 관리`,
        kind: "hub" as const,
        state: "핵심 진입",
        note: "사람/기도/후속 흐름으로 들어간다.",
        x: 148,
        y: 60,
        icon: "⛪",
      },
      ...households.map((household, index) => {
        const pos = withFallback(HOUSE_POSITIONS[index], HOUSE_POSITIONS[0]);
        const memberCount = household.members.length;

        return {
          id: `h-${household.id}`,
          name: household.name,
          kind: "house" as const,
          state: memberCount > 0 ? `가정원 ${memberCount}` : "가정원 미등록",
          note: memberCount > 0 ? `${memberCount}명이 연결된 가정.` : "가정원 등록이 필요함.",
          x: pos.x,
          y: pos.y,
          icon: "🏠",
        };
      }),
      ...members.map((member, index) => {
        const pos = withFallback(PERSON_POSITIONS[index], PERSON_POSITIONS[0]);
        const state = safeStateTag(member.statusTag, member.requiresFollowUp);

        return {
          id: `p-${member.id}`,
          name: member.name,
          kind: "person" as const,
          state,
          note: member.requiresFollowUp
            ? "돌봄 연락이 필요한 상태."
            : member.group?.name
              ? `${member.group.name} 흐름으로 연결됨.`
              : "그룹 연결 정리가 필요함.",
          x: pos.x,
          y: pos.y,
          icon: "🙂",
        };
      }),
    ];

    const peopleRecords = members.map((member) => ({
      id: `p-${member.id}`,
      name: member.name,
      household: member.household?.name ?? "가정 미지정",
      state: safeStateTag(member.statusTag, member.requiresFollowUp),
      nextAction: member.requiresFollowUp
        ? "오늘 안부 연락"
        : member.group?.name
          ? `${member.group.name} 소그룹 체크`
          : "소그룹 배정 확인",
    }));

    const taskRecords = [
      ...members
        .filter((member) => member.requiresFollowUp)
        .slice(0, 3)
        .map((member, index) => ({
          id: `t-followup-${index}`,
          title: `${member.name} 후속 연락`,
          due: "오늘",
          owner: "목양 관리",
        })),
      ...households
        .filter((household) => household.members.length === 0)
        .slice(0, 2)
        .map((household, index) => ({
          id: `t-household-${index}`,
          title: `${household.name} 가정원 등록`,
          due: "이번 주",
          owner: "가정 담당",
        })),
    ];

    const chatQuickActions = [
      "돌봄 연락 필요한 사람만 보여줘",
      "가정원 미등록 가정 정리해줘",
      "오늘 후속할 3개 행동만 뽑아줘",
    ];

    return NextResponse.json({
      worldObjects,
      peopleRecords,
      taskRecords,
      chatQuickActions,
    });
  } catch {
    return NextResponse.json(buildFallbackResponse());
  }
}
