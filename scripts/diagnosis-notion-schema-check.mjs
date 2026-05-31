import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const REQUIRED_PROPERTIES = [
  { name: "Contact", acceptedTypes: ["rich_text", "email", "phone_number"], importance: "required" },
  { name: "Track", acceptedTypes: ["select", "rich_text"], importance: "required" },
  { name: "Source", acceptedTypes: ["select", "rich_text"], importance: "required" },
  { name: "Created At", acceptedTypes: ["date", "rich_text"], importance: "required" },
];

const RECOMMENDED_PROPERTIES = [
  { name: "Request ID", acceptedTypes: ["rich_text"], importance: "recommended" },
  { name: "Diagnosis Type", acceptedTypes: ["select", "rich_text"], importance: "recommended" },
  { name: "Target Type", acceptedTypes: ["select", "rich_text"], importance: "recommended" },
  { name: "Stage", acceptedTypes: ["select", "rich_text"], importance: "recommended" },
  { name: "Focus", acceptedTypes: ["rich_text"], importance: "recommended" },
  { name: "Child Grade Or Age", acceptedTypes: ["rich_text"], importance: "recommended" },
  { name: "Current Anxiety", acceptedTypes: ["rich_text"], importance: "recommended" },
  { name: "Avoid Future", acceptedTypes: ["rich_text"], importance: "recommended" },
  { name: "Tried Activities", acceptedTypes: ["rich_text"], importance: "recommended" },
  { name: "Current Situation", acceptedTypes: ["rich_text"], importance: "recommended" },
  { name: "Wanted Outcome", acceptedTypes: ["rich_text"], importance: "recommended" },
  { name: "Strengths", acceptedTypes: ["rich_text"], importance: "recommended" },
  { name: "Avoid Path", acceptedTypes: ["rich_text"], importance: "recommended" },
  { name: "Reference URL", acceptedTypes: ["url", "rich_text"], importance: "recommended" },
];

const asJson = process.argv.includes("--json");

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

async function fetchDatabaseSchema(apiKey, databaseId) {
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": "2022-06-28",
    },
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Notion database fetch failed: ${response.status} ${detail}`);
  }

  return response.json();
}

function evaluateProperty(schema, expectation) {
  const actual = schema.properties?.[expectation.name];
  if (!actual) {
    return {
      ...expectation,
      status: "missing",
      actualType: null,
    };
  }

  const accepted = expectation.acceptedTypes.includes(actual.type);
  return {
    ...expectation,
    status: accepted ? "ok" : "type-mismatch",
    actualType: actual.type,
  };
}

function printHuman(result) {
  console.log("5포지션 리포트 Notion DB 스키마 점검");
  console.log("");
  console.log(`Database: ${result.databaseId}`);
  console.log(`Title property: ${result.titleProperty || "없음"}`);
  console.log("");

  for (const section of [
    ["필수 속성", result.required],
    ["권장 속성", result.recommended],
  ]) {
    const [title, items] = section;
    console.log(`[${title}]`);
    for (const item of items) {
      const expected = item.acceptedTypes.join(" | ");
      if (item.status === "ok") {
        console.log(`- OK ${item.name}: ${item.actualType}`);
      } else if (item.status === "missing") {
        console.log(`- MISSING ${item.name}: expected ${expected}`);
      } else {
        console.log(`- TYPE ${item.name}: actual ${item.actualType}, expected ${expected}`);
      }
    }
    console.log("");
  }

  if (result.blockingIssues.length) {
    console.log("[런칭 전 수정 필요]");
    for (const item of result.blockingIssues) {
      console.log(`- ${item.name}: ${item.status}`);
    }
    return;
  }

  if (result.warnings.length) {
    console.log("[운영 전 보강 권장]");
    for (const item of result.warnings) {
      console.log(`- ${item.name}: ${item.status}`);
    }
    return;
  }

  console.log("Notion DB 스키마가 리포트 요청 저장에 충분합니다.");
}

async function main() {
  loadLocalEnv();
  const { apiKey, databaseId } = getNotionConfig();
  if (!apiKey || !databaseId) {
    throw new Error("Notion API key or database id is missing. Set NOTION_DIAGNOSIS_API_KEY and NOTION_DIAGNOSIS_REPORT_DATABASE_ID.");
  }

  const database = await fetchDatabaseSchema(apiKey, databaseId);
  const properties = database.properties || {};
  const titleProperty = Object.entries(properties).find(([, property]) => property.type === "title")?.[0] || "";
  const required = REQUIRED_PROPERTIES.map((expectation) => evaluateProperty(database, expectation));
  const recommended = RECOMMENDED_PROPERTIES.map((expectation) => evaluateProperty(database, expectation));
  const blockingIssues = required.filter((item) => item.status !== "ok");
  const warnings = recommended.filter((item) => item.status !== "ok");
  const result = {
    databaseId,
    titleProperty,
    required,
    recommended,
    blockingIssues,
    warnings,
  };

  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  printHuman(result);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
