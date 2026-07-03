import { NextResponse } from "next/server";
import { generateHistoryRoadmap } from "@/lib/history-roadmap-generator";
import { historyRoadmapInputSchema, historyRoadmapResultSchema } from "@/lib/history-roadmap";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsedInput = historyRoadmapInputSchema.safeParse(body);

  if (!parsedInput.success) {
    return NextResponse.json(
      { error: "입력값을 확인해 주세요.", fields: parsedInput.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const result = historyRoadmapResultSchema.parse(generateHistoryRoadmap(parsedInput.data));
    return NextResponse.json({ result });
  } catch (error) {
    console.error("history-roadmap local generator error", error);
    return NextResponse.json(
      { error: "탐구 로드맵을 만드는 중 문제가 생겼습니다. 입력값을 조금 바꿔 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
