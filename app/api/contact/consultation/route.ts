import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(80),
  contact: z.string().trim().min(1).max(160),
  concernType: z.string().trim().min(1).max(160),
  stage: z.string().trim().min(1).max(80),
  consultationType: z.string().trim().min(1).max(80),
  message: z.string().trim().min(10).max(4000),
  referenceUrl: z.string().trim().max(500).optional().default(""),
  preferredSchedule: z.string().trim().max(200).optional().default(""),
  diagnosisSource: z.string().trim().max(80).optional().default(""),
  diagnosisResultType: z.string().trim().max(80).optional().default(""),
  companyWebsite: z.string().trim().max(200).optional().default(""),
});

function createInquiryId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SOOM-${date}-${random}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "필수 항목을 확인해 주세요." }, { status: 400 });
  }

  if (parsed.data.companyWebsite) {
    return NextResponse.json({ message: "30분 방향 진단 신청이 접수되었습니다." });
  }

  const inquiryId = createInquiryId();
  const record = {
    inquiryId,
    createdAt: new Date().toISOString(),
    source: parsed.data.diagnosisSource || "contact",
    diagnosisResultType: parsed.data.diagnosisResultType || null,
    name: parsed.data.name,
    contact: parsed.data.contact,
    concernType: parsed.data.concernType,
    stage: parsed.data.stage,
    consultationType: parsed.data.consultationType,
    message: parsed.data.message,
    referenceUrl: parsed.data.referenceUrl,
    preferredSchedule: parsed.data.preferredSchedule,
  };

  const directory = process.env.VERCEL
    ? path.join("/tmp", "soom-contact-inquiries")
    : path.join(process.cwd(), "ops", "contact-inquiries");
  await mkdir(directory, { recursive: true });
  await appendFile(path.join(directory, "consultation.jsonl"), `${JSON.stringify(record)}\n`, "utf8");

  return NextResponse.json({
    inquiryId,
    message: "30분 방향 진단 신청이 접수되었습니다. 남겨주신 상황을 기준으로 먼저 방향을 정리해 보겠습니다.",
  });
}
