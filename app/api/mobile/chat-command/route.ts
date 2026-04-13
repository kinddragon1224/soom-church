import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type Body = {
  churchSlug?: string;
  text?: string;
};

function buildFallbackReply(text: string) {
  return {
    reply: `좋아. "${text}" 기준으로 오늘은 1) 후속 연락 대상 먼저 확인, 2) 가정 상태 갱신, 3) 다음 행동 1개 확정 순서로 진행하면 돼.`,
  };
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
      "먼저 오늘 연락 1순위 3명부터 처리하고, 끝나면 상태태그를 바로 갱신하자.",
    ].join(" ");

    return NextResponse.json({ ok: true, reply });
  } catch {
    return NextResponse.json({ ok: true, ...buildFallbackReply(text) });
  }
}
