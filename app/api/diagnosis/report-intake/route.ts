import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  source: z.string().trim().max(80).optional().default("diagnosis-report-intake"),
  diagnosisResultType: z.string().trim().max(80).optional().default(""),
  track: z.string().trim().max(80).optional().default(""),
  name: z.string().trim().min(1).max(80),
  contact: z.string().trim().min(1).max(160),
  stage: z.string().trim().min(1).max(80),
  focus: z.string().trim().min(1).max(160),
  targetType: z.string().trim().max(40).optional().default(""),
  childGradeOrAge: z.string().trim().max(80).optional().default(""),
  currentAnxiety: z.string().trim().min(10).max(2000),
  avoidFuture: z.string().trim().min(10).max(2000),
  triedActivities: z.string().trim().min(10).max(2000),
  currentSituation: z.string().trim().min(20).max(4000),
  wantedOutcome: z.string().trim().min(10).max(2000),
  strengths: z.string().trim().min(10).max(2000),
  avoidPath: z.string().trim().max(2000).optional().default(""),
  referenceUrl: z.string().trim().max(500).optional().default(""),
  companyWebsite: z.string().trim().max(200).optional().default(""),
});

function createRequestId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `diag_${date}_${random}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "필수 항목을 확인해 주세요." }, { status: 400 });
  }

  if (parsed.data.companyWebsite) {
    return NextResponse.json({ message: "5포지션 리포트 요청이 접수되었습니다." });
  }

  const requestId = createRequestId();
  const record = {
    requestId,
    createdAt: new Date().toISOString(),
    ...parsed.data,
  };

  const directory = path.join(process.cwd(), "ops", "diagnosis-report-requests");
  await mkdir(directory, { recursive: true });
  await appendFile(path.join(directory, "requests.jsonl"), `${JSON.stringify(record)}\n`, "utf8");

  return NextResponse.json({
    requestId,
    message:
      "5포지션 리포트 요청이 접수되었습니다. 내용을 확인한 뒤 미니/상세 리포트 안내를 먼저 드리고, 복잡한 선택이 남는 경우에만 프리미엄 1:1 미래설계 상담 연결 가능 여부를 안내드릴게요.",
  });
}
