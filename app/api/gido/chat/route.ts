import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { submitStructuredChatMessage } from "@/lib/chat-submit";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ ok: false, message: "로그인이 필요해." }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as { churchSlug?: string; message?: string } | null;
  const churchSlug = body?.churchSlug?.trim();
  const message = body?.message?.trim();

  if (!churchSlug || !message) {
    return NextResponse.json({ ok: false, message: "입력 내용이 부족해." }, { status: 400 });
  }

  const membership = await prisma.churchMembership.findFirst({
    where: {
      userId,
      isActive: true,
      church: { slug: churchSlug },
    },
    select: {
      churchId: true,
      church: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!membership?.church) {
    return NextResponse.json({ ok: false, message: "이 워크스페이스에 접근할 수 없어." }, { status: 403 });
  }

  const result = await submitStructuredChatMessage({
    churchId: membership.church.id,
    churchName: membership.church.name,
    userId,
    rawText: message,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
