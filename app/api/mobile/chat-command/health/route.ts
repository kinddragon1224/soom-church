import { NextResponse } from "next/server";

export async function GET() {
  const bridgeUrl = process.env.OPENCLAW_BRIDGE_URL?.trim() || null;
  const hasToken = Boolean(process.env.OPENCLAW_BRIDGE_TOKEN?.trim());

  if (!bridgeUrl) {
    return NextResponse.json({
      ok: false,
      bridgeConfigured: false,
      bridgeReachable: false,
      reason: "OPENCLAW_BRIDGE_URL missing",
    });
  }

  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(bridgeUrl, {
      method: "GET",
      headers: {
        ...(hasToken ? { Authorization: `Bearer ${process.env.OPENCLAW_BRIDGE_TOKEN}` } : {}),
      },
      signal: controller.signal,
    });

    return NextResponse.json({
      ok: response.ok,
      bridgeConfigured: true,
      bridgeReachable: response.ok,
      status: response.status,
      latencyMs: Date.now() - startedAt,
      hasToken,
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "bridge request failed";

    return NextResponse.json({
      ok: false,
      bridgeConfigured: true,
      bridgeReachable: false,
      hasToken,
      reason,
    });
  } finally {
    clearTimeout(timeout);
  }
}
