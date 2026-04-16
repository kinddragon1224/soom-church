#!/usr/bin/env node

const bases = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["http://127.0.0.1:3000", "https://soom.io.kr"];

async function check(base) {
  const result = { base };

  try {
    const healthRes = await fetch(`${base}/api/mobile/chat-command/health`, { method: "GET" });
    result.healthStatus = healthRes.status;
    result.health = await healthRes.json().catch(() => null);
  } catch (error) {
    result.healthError = error instanceof Error ? error.message : "health request failed";
  }

  try {
    const startedAt = Date.now();
    const chatRes = await fetch(`${base}/api/mobile/chat-command`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        churchSlug: "gido",
        accountKey: "doctor-check",
        text: "브릿지 점검 요청",
      }),
    });

    result.chatStatus = chatRes.status;
    result.chatLatencyMs = Date.now() - startedAt;
    result.chat = await chatRes.json().catch(() => null);
  } catch (error) {
    result.chatError = error instanceof Error ? error.message : "chat request failed";
  }

  return result;
}

const rows = [];
for (const base of bases) {
  rows.push(await check(base));
}

for (const row of rows) {
  console.log(`\n=== ${row.base} ===`);
  if (row.healthError) {
    console.log(`health: ERROR ${row.healthError}`);
  } else {
    console.log(`health: ${row.healthStatus} ${JSON.stringify(row.health)}`);
  }

  if (row.chatError) {
    console.log(`chat: ERROR ${row.chatError}`);
  } else {
    const diagnostics = row.chat?.diagnostics || {};
    console.log(`chat: ${row.chatStatus} ${row.chatLatencyMs}ms mode=${diagnostics.mode ?? "unknown"} provider=${diagnostics.provider ?? "unknown"}`);
    if (diagnostics.reason) {
      console.log(`chat.reason: ${diagnostics.reason}`);
    }
  }
}
