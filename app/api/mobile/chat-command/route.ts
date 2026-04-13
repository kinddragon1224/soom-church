import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type Body = {
  churchSlug?: string;
  text?: string;
};

type ActionItem = {
  id: string;
  title: string;
  due: string;
  owner: string;
};

function buildFallbackReply(text: string) {
  return {
    reply: `좋아. "${text}" 기준으로 오늘은 1) 후속 연락 대상 먼저 확인, 2) 가정 상태 갱신, 3) 다음 행동 1개 확정 순서로 진행하면 돼.`,
    actions: [
      { id: "fallback-a1", title: "후속 연락 대상 우선순위 정하기", due: "오늘", owner: "목양 관리" },
      { id: "fallback-a2", title: "상태태그 업데이트", due: "오늘", owner: "목양 관리" },
    ] satisfies ActionItem[],
  };
}

function buildActionItems(text: string, followupCount: number): ActionItem[] {
  const items: ActionItem[] = [];

  if (followupCount > 0) {
    items.push({
      id: "action-followup",
      title: `후속 연락 ${Math.min(followupCount, 3)}명 처리`,
      due: "오늘",
      owner: "목양 관리",
    });
  }

  if (text.includes("기도")) {
    items.push({
      id: "action-prayer",
      title: "기도 요청 목록 업데이트",
      due: "오늘",
      owner: "기도 담당",
    });
  }

  if (text.includes("가정") || text.includes("목장")) {
    items.push({
      id: "action-household",
      title: "가정별 상태 점검",
      due: "이번 주",
      owner: "가정 담당",
    });
  }

  if (!items.length) {
    items.push({
      id: "action-default",
      title: "오늘 후속 3개 행동 확정",
      due: "오늘",
      owner: "목양 관리",
    });
  }

  return items;
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Body | null;
  const text = body?.text?.trim();
  const churchSlug = body?.churchSlug?.trim() || "gido";

  if (!text) {
    return NextResponse.json({ ok: false, message: "메시지가 비어 있어." }, { status: 400 });
  }

  try {
    const church = await prisma.church.findFirst({
      where: { slug: churchSlug, isActive: true },
      select: { id: true, name: true },
    });

    if (!church) {
      return NextResponse.json({ ok: true, ...buildFallbackReply(text) });
    }

    const [followupCount, householdCount] = await Promise.all([
      prisma.member.count({
        where: { churchId: church.id, isDeleted: false, requiresFollowUp: true },
      }),
      prisma.household.count({
        where: { churchId: church.id },
      }),
    ]);

    const reply = [
      `${church.name} 기준으로 정리할게.`,
      `현재 후속 연락 필요 인원은 ${followupCount}명, 등록된 가정은 ${householdCount}개야.`,
      `요청한 내용: "${text}"`,
      "먼저 오늘 연락 1순위부터 처리하고, 끝나면 상태태그를 바로 갱신하자.",
    ].join(" ");

    return NextResponse.json({
      ok: true,
      reply,
      actions: buildActionItems(text, followupCount),
    });
  } catch {
    return NextResponse.json({ ok: true, ...buildFallbackReply(text) });
  }
}
