import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const localLeadPath = path.join(process.cwd(), "ops", "diagnosis-report-requests", "requests.jsonl");
const asJson = process.argv.includes("--json");
const explicitSource = getArgValue("--source");

function getArgValue(name) {
  const inline = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (inline) return inline.split("=").slice(1).join("=");
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : "";
}

function loadDotEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [rawKey, ...rest] = trimmed.split("=");
    const key = rawKey.trim();
    if (!key || process.env[key]) continue;
    const value = rest.join("=").trim().replace(/^['"]|['"]$/g, "");
    process.env[key] = value;
  }
}

function loadLocalEnv() {
  loadDotEnvFile(path.join(process.cwd(), ".env.local"));
  loadDotEnvFile(path.join(process.cwd(), ".env"));
}

function getNotionConfig() {
  const apiKey = process.env.NOTION_DIAGNOSIS_API_KEY
    || process.env.NOTION_CONTACT_API_KEY
    || process.env.NOTION_API_KEY_SOOM_BLOG
    || process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DIAGNOSIS_REPORT_DATABASE_ID
    || process.env.NOTION_REPORT_INTAKE_DATABASE_ID
    || process.env.NOTION_CONTACT_DATABASE_ID
    || process.env.NOTION_CONSULTATION_DATABASE_ID
    || process.env.NOTION_INQUIRY_DATABASE_ID;

  return { apiKey, databaseId };
}

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

function buildSummary(records, source) {
  const summary = {
    source,
    total: records.length,
    track: countBy(records, "track"),
    sourceParam: countBy(records, "source"),
    diagnosisResultType: countBy(records, "diagnosisResultType"),
    latest: summarizeLatest(records),
  };
  return summary;
}

function printSummary(summary) {
  if (asJson) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  console.log("커리어 진단 리포트 요청 요약");
  console.log("");
  console.log(`저장소: ${summary.source}`);
  console.log(`총 요청: ${summary.total}`);
  console.log("");
  console.log("[Track]");
  console.log(formatCounts(summary.track));
  console.log("");
  console.log("[Source Param]");
  console.log(formatCounts(summary.sourceParam));
  console.log("");
  console.log("[Diagnosis Result Type]");
  console.log(formatCounts(summary.diagnosisResultType));
  console.log("");
  console.log("[Latest]");
  console.log(summary.latest.length ? summary.latest.join("\n") : "- 없음");
}

function plainText(property) {
  if (!property) return "";
  if (property.type === "title") return property.title?.map((item) => item.plain_text || "").join("") || "";
  if (property.type === "rich_text") return property.rich_text?.map((item) => item.plain_text || "").join("") || "";
  if (property.type === "select") return property.select?.name || "";
  if (property.type === "date") return property.date?.start || "";
  if (property.type === "email") return property.email || "";
  if (property.type === "phone_number") return property.phone_number || "";
  if (property.type === "url") return property.url || "";
  return "";
}

function pickProperty(properties, names) {
  for (const name of names) {
    const value = plainText(properties[name]);
    if (value) return value;
  }
  return "";
}

function notionPageToRecord(page) {
  const properties = page.properties || {};
  const titleName = Object.entries(properties).find(([, property]) => property.type === "title")?.[0];
  return {
    requestId: pickProperty(properties, ["Request ID", "requestId", "접수 번호"]) || page.id,
    createdAt: pickProperty(properties, ["Created At", "createdAt", "접수일"]) || page.created_time,
    name: titleName ? plainText(properties[titleName]).split(" - ")[0] : pickProperty(properties, ["Name", "이름"]),
    contact: pickProperty(properties, ["Contact", "연락처", "Email", "Phone"]),
    source: pickProperty(properties, ["Source", "source"]),
    track: pickProperty(properties, ["Track", "track", "트랙"]),
    diagnosisResultType: pickProperty(properties, ["Diagnosis Type", "diagnosisResultType", "결과 유형"]),
    currentSituation: pickProperty(properties, ["Current Situation", "Current Anxiety", "현재 상황", "현재 가장 불안한 것"]),
    wantedOutcome: pickProperty(properties, ["Wanted Outcome", "원하는 결과"]),
  };
}

async function fetchNotionRecords() {
  const { apiKey, databaseId } = getNotionConfig();
  if (!apiKey || !databaseId) {
    throw new Error("NOTION_* API key or database id is not configured.");
  }

  const records = [];
  let startCursor;

  do {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        page_size: 100,
        ...(startCursor ? { start_cursor: startCursor } : {}),
        sorts: [{ timestamp: "created_time", direction: "descending" }],
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Notion query failed: ${response.status} ${detail}`);
    }

    const data = await response.json();
    records.push(...(data.results || []).map(notionPageToRecord));
    startCursor = data.has_more ? data.next_cursor : undefined;
  } while (startCursor);

  return records;
}

async function readJsonlRecords() {
  let text = "";
  try {
    text = await readFile(localLeadPath, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch {
        return { requestId: `parse-error-line-${index + 1}`, parseError: true };
      }
    })
    .filter((record) => !record.parseError);
}

async function main() {
  loadLocalEnv();
  const shouldUseJsonl = explicitSource === "jsonl";
  const shouldUseNotion = explicitSource === "notion" || (!explicitSource && getNotionConfig().apiKey && getNotionConfig().databaseId);

  if (shouldUseNotion && !shouldUseJsonl) {
    try {
      printSummary(buildSummary(await fetchNotionRecords(), "notion"));
      return;
    } catch (error) {
      if (explicitSource === "notion") throw error;
      if (!asJson) {
        console.warn(`Notion 요약을 가져오지 못해 로컬 JSONL로 대체합니다: ${error.message}`);
        console.warn("");
      }
    }
  }

  const jsonlRecords = await readJsonlRecords();
  printSummary(buildSummary(jsonlRecords, "local-jsonl"));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
