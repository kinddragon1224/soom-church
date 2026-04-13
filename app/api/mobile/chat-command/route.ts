import { NextRequest, NextResponse } from "next/server";

import { orchestrateMobileWorldChat } from "@/lib/mobile-world-orchestrator";

type Body = {
  churchSlug?: string;
  text?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Body | null;
  const text = body?.text?.trim();
  const churchSlug = body?.churchSlug?.trim() || "gido";

  if (!text) {
    return NextResponse.json({ ok: false, message: "메시지가 비어 있어." }, { status: 400 });
  }

  try {
    const result = await orchestrateMobileWorldChat({
      churchSlug,
      text,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({
      ok: true,
      reply: `좋아. "${text}" 기준으로 기본 실행 루프를 만들었어. 우선 후속 연락 대상부터 정리하자.`,
      actions: [
        { id: "fallback-followup", title: "후속 연락 대상 정리", due: "오늘", owner: "목양 관리" },
        { id: "fallback-status", title: "상태태그 업데이트", due: "오늘", owner: "목양 관리" },
      ],
      intents: ["GENERAL_SHEPHERDING"],
      autoBuild: {
        workspace: "fallback-workspace",
        shepherdingQueue: ["후속 연락 대상 정리", "상태태그 업데이트"],
        memberOps: ["상태태그 점검"],
      },
      agentGrowth: {
        loopId: `loop-${Date.now()}`,
        title: "Fallback Mobile World Agent Loop",
        summary: "오케스트레이션 실패로 기본 루프 실행",
        suggestedGithubIssue: "[mobile-world] fallback loop recovery",
      },
    });
  }
}
