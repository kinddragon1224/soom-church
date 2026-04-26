import { randomUUID } from "crypto";
import { mkdir, appendFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FIELD_LENGTH = 4000;

function asText(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, MAX_FIELD_LENGTH) : "";
}

function jsonError(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return jsonError("상담 신청 내용을 읽지 못했습니다.");
  }

  const honeypot = asText((body as Record<string, unknown>).companyWebsite);
  if (honeypot) {
    return NextResponse.json({ ok: true, message: "상담 신청이 접수되었습니다." });
  }

  const name = asText((body as Record<string, unknown>).name);
  const contact = asText((body as Record<string, unknown>).contact);
  const concernType = asText((body as Record<string, unknown>).concernType);
  const stage = asText((body as Record<string, unknown>).stage);
  const consultationType = asText((body as Record<string, unknown>).consultationType);
  const message = asText((body as Record<string, unknown>).message);
  const referenceUrl = asText((body as Record<string, unknown>).referenceUrl);
  const preferredSchedule = asText((body as Record<string, unknown>).preferredSchedule);

  if (!name) return jsonError("이름을 입력해 주세요.");
  if (!contact) return jsonError("연락처를 입력해 주세요.");
  if (!message || message.length < 10) return jsonError("진로 고민을 10자 이상 적어 주세요.");

  const now = new Date();
  const inquiryId = `career-${now.toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().slice(0, 8)}`;
  const inquiry = {
    inquiryId,
    receivedAt: now.toISOString(),
    source: "soom-career-consultation",
    name,
    contact,
    concernType,
    stage,
    consultationType,
    message,
    referenceUrl,
    preferredSchedule,
    userAgent: request.headers.get("user-agent") ?? null,
  };

  const outputDir = path.join(process.cwd(), "ops", "contact-inquiries");
  const outputPath = path.join(outputDir, `${now.toISOString().slice(0, 7)}.jsonl`);

  await mkdir(outputDir, { recursive: true });
  await appendFile(outputPath, `${JSON.stringify(inquiry)}\n`, "utf8");

  return NextResponse.json({
    ok: true,
    inquiryId,
    message: "상담 신청이 접수되었습니다. 남겨주신 연락처로 1차 방향을 안내드리겠습니다.",
  });
}
