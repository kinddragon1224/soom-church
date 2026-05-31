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
  currentSituation: z.string().trim().min(10).max(4000),
  wantedOutcome: z.string().trim().min(10).max(2000),
  strengths: z.string().trim().min(10).max(2000),
  avoidPath: z.string().trim().max(2000).optional().default(""),
  referenceUrl: z.string().trim().max(500).optional().default(""),
  companyWebsite: z.string().trim().max(200).optional().default(""),
});

type ReportRequestRecord = z.infer<typeof schema> & {
  requestId: string;
  createdAt: string;
};

function createRequestId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `diag_${date}_${random}`;
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

function textProperty(content: string) {
  return {
    rich_text: [
      {
        text: {
          content: content.slice(0, 2000),
        },
      },
    ],
  };
}

function titleProperty(content: string) {
  return {
    title: [
      {
        text: {
          content: content.slice(0, 2000),
        },
      },
    ],
  };
}

type NotionPropertySchema = {
  type: string;
};

type NotionDatabaseSchema = {
  properties?: Record<string, NotionPropertySchema>;
};

async function getNotionDatabaseSchema(apiKey: string, databaseId: string) {
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": "2022-06-28",
    },
  });

  if (!response.ok) return null;
  return response.json() as Promise<NotionDatabaseSchema>;
}

function applyNotionProperty(
  properties: Record<string, unknown>,
  schema: Record<string, NotionPropertySchema>,
  name: string,
  value: string,
) {
  const property = schema[name];
  if (!property || !value) return;

  if (property.type === "rich_text") {
    properties[name] = textProperty(value);
    return;
  }

  if (property.type === "select") {
    properties[name] = { select: { name: value.slice(0, 100) } };
    return;
  }

  if (property.type === "date") {
    properties[name] = { date: { start: value } };
  }
}

function buildNotionProperties(schema: Record<string, NotionPropertySchema>, record: ReportRequestRecord) {
  const titleName = Object.entries(schema).find(([, property]) => property.type === "title")?.[0];
  if (!titleName) return null;

  const properties: Record<string, unknown> = {
    [titleName]: titleProperty(`${record.name} - ${record.track || "5포지션 리포트"}`),
  };

  applyNotionProperty(properties, schema, "Request ID", record.requestId);
  applyNotionProperty(properties, schema, "Contact", record.contact);
  applyNotionProperty(properties, schema, "Source", record.source);
  applyNotionProperty(properties, schema, "Track", record.track);
  applyNotionProperty(properties, schema, "Diagnosis Type", record.diagnosisResultType);
  applyNotionProperty(properties, schema, "Target Type", record.targetType);
  applyNotionProperty(properties, schema, "Stage", record.stage);
  applyNotionProperty(properties, schema, "Focus", record.focus);
  applyNotionProperty(properties, schema, "Child Grade Or Age", record.childGradeOrAge);
  applyNotionProperty(properties, schema, "Current Anxiety", record.currentAnxiety);
  applyNotionProperty(properties, schema, "Avoid Future", record.avoidFuture);
  applyNotionProperty(properties, schema, "Tried Activities", record.triedActivities);
  applyNotionProperty(properties, schema, "Current Situation", record.currentSituation);
  applyNotionProperty(properties, schema, "Wanted Outcome", record.wantedOutcome);
  applyNotionProperty(properties, schema, "Strengths", record.strengths);
  applyNotionProperty(properties, schema, "Avoid Path", record.avoidPath);
  applyNotionProperty(properties, schema, "Reference URL", record.referenceUrl);
  applyNotionProperty(properties, schema, "Created At", record.createdAt);

  return properties;
}

async function saveReportRequestToNotion(record: ReportRequestRecord) {
  const { apiKey, databaseId } = getNotionConfig();
  if (!apiKey || !databaseId) return false;

  const database = await getNotionDatabaseSchema(apiKey, databaseId);
  const properties = database?.properties ? buildNotionProperties(database.properties, record) : null;
  if (!properties) return false;

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("Failed to save diagnosis report request to Notion", response.status, detail);
    return false;
  }

  return true;
}

async function saveReportRequestToJsonl(record: ReportRequestRecord) {
  const directory = process.env.VERCEL
    ? path.join("/tmp", "diagnosis-report-requests")
    : path.join(process.cwd(), "ops", "diagnosis-report-requests");
  await mkdir(directory, { recursive: true });
  await appendFile(path.join(directory, "requests.jsonl"), `${JSON.stringify(record)}\n`, "utf8");
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

  const savedToNotion = await saveReportRequestToNotion(record);
  if (!savedToNotion) {
    await saveReportRequestToJsonl(record);
  }

  return NextResponse.json({
    requestId,
    message:
      "5포지션 리포트 요청이 접수되었습니다. 내용을 확인한 뒤 미니/상세 리포트 안내를 먼저 드리고, 복잡한 선택이 남는 경우에만 프리미엄 1:1 미래설계 상담 연결 가능 여부를 안내드릴게요.",
  });
}
