import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { NextRequest, NextResponse } from "next/server";

const execFileAsync = promisify(execFile);

type BridgeBody = {
  model?: string;
  messages?: Array<{
    role?: string;
    content?: unknown;
  }>;
};

function sanitizeJsonText(value: string) {
  const fenced = value.match(/```json\s*([\s\S]*?)```/i) || value.match(/```\s*([\s\S]*?)```/i);
  return (fenced?.[1] ?? value).trim();
}

function asText(value: unknown) {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function fallbackPayload(reply: string) {
  return {
    reply,
    intents: ["GENERAL_SHEPHERDING"],
    actions: [],
    autoBuild: {
      workspace: "openclaw-bridge-fallback",
      shepherdingQueue: [],
      memberOps: [],
    },
  };
}

export async function POST(request: NextRequest) {
  const configuredToken = process.env.OPENCLAW_BRIDGE_TOKEN?.trim();
  if (configuredToken) {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token || token !== configuredToken) {
      return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
    }
  }

  const body = (await request.json().catch(() => null)) as BridgeBody | null;
  const messages = Array.isArray(body?.messages) ? body!.messages! : [];
  const model = typeof body?.model === "string" && body.model.trim() ? body.model.trim() : "default";

  const prompt = [
    "너는 모라다.",
    `모델: ${model}`,
    "아래 대화를 보고 JSON만 반환해.",
    '키: reply(string), intents(string[]), actions([{id,title,due,owner}]), autoBuild({workspace,shepherdingQueue,memberOps})',
    "---",
    ...messages.map((message) => `[${message.role ?? "user"}] ${asText(message.content)}`),
  ].join("\n");

  const openclawBin = process.env.OPENCLAW_BIN || "openclaw";
  const sessionId = process.env.OPENCLAW_AGENT_SESSION_ID || "soom-mobile-chat";

  try {
    const { stdout } = await execFileAsync(
      openclawBin,
      ["agent", "--session-id", sessionId, "--message", prompt, "--json", "--timeout", "90"],
      { timeout: 95_000, maxBuffer: 4 * 1024 * 1024 }
    );

    const wrapper = JSON.parse(stdout);
    const payloadText = wrapper?.result?.payloads?.[0]?.text;

    if (typeof payloadText !== "string" || !payloadText.trim()) {
      return NextResponse.json(fallbackPayload("브릿지 응답이 비어 있어 기본 응답으로 처리했어."));
    }

    try {
      const parsed = JSON.parse(sanitizeJsonText(payloadText));
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json(fallbackPayload(payloadText.trim()));
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : "openclaw bridge failed";
    return NextResponse.json({ ok: false, message: reason }, { status: 502 });
  }
}

export async function GET() {
  const configuredToken = process.env.OPENCLAW_BRIDGE_TOKEN?.trim();

  return NextResponse.json({
    ok: true,
    bridge: "openclaw-local-cli",
    hasToken: Boolean(configuredToken),
  });
}
