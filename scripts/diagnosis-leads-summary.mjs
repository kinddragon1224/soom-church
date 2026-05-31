import { readFile } from "node:fs/promises";
import path from "node:path";

const leadPath = path.join(process.cwd(), "ops", "diagnosis-report-requests", "requests.jsonl");
const asJson = process.argv.includes("--json");

function safeDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function countBy(records, key) {
  return records.reduce((acc, record) => {
    const value = record[key] || "unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function formatCounts(counts) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return "- 없음";
  return entries.map(([key, value]) => `- ${key}: ${value}`).join("\n");
}

function summarizeLatest(records) {
  return records
    .slice()
    .sort((a, b) => {
      const left = safeDate(a.createdAt)?.getTime() ?? 0;
      const right = safeDate(b.createdAt)?.getTime() ?? 0;
      return right - left;
    })
    .slice(0, 5)
    .map((record) => {
      const createdAt = record.createdAt || "unknown";
      const track = record.track || "unknown";
      const name = record.name || "no-name";
      const contact = record.contact || "no-contact";
      const wanted = String(record.wantedOutcome || record.currentSituation || "").replace(/\s+/g, " ").slice(0, 90);
      return `- ${createdAt} | ${record.requestId || "no-id"} | ${track} | ${name} / ${contact}${wanted ? ` | ${wanted}` : ""}`;
    });
}

async function main() {
  let text = "";
  try {
    text = await readFile(leadPath, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      const empty = { total: 0, track: {}, source: {}, diagnosisResultType: {}, latest: [] };
      if (asJson) {
        console.log(JSON.stringify(empty, null, 2));
      } else {
        console.log("아직 저장된 진단 리포트 요청이 없습니다.");
      }
      return;
    }
    throw error;
  }

  const records = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch {
        return { parseError: true, line: index + 1 };
      }
    });

  const validRecords = records.filter((record) => !record.parseError);
  const summary = {
    total: validRecords.length,
    parseErrors: records.length - validRecords.length,
    track: countBy(validRecords, "track"),
    source: countBy(validRecords, "source"),
    diagnosisResultType: countBy(validRecords, "diagnosisResultType"),
    latest: summarizeLatest(validRecords),
  };

  if (asJson) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  console.log("커리어 진단 리포트 요청 요약");
  console.log("");
  console.log(`총 요청: ${summary.total}`);
  if (summary.parseErrors) console.log(`파싱 실패 라인: ${summary.parseErrors}`);
  console.log("");
  console.log("[Track]");
  console.log(formatCounts(summary.track));
  console.log("");
  console.log("[Source]");
  console.log(formatCounts(summary.source));
  console.log("");
  console.log("[Diagnosis Result Type]");
  console.log(formatCounts(summary.diagnosisResultType));
  console.log("");
  console.log("[Latest]");
  console.log(summary.latest.length ? summary.latest.join("\n") : "- 없음");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
