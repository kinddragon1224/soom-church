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
  diagnosisAudienceType: z.string().trim().max(80).optional().default(""),
  companyWebsite: z.string().trim().max(200).optional().default(""),
});

function createInquiryId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SOOM-${date}-${random}`;
}

type InquiryRecord = {
  inquiryId: string;
  createdAt: string;
  source: string;
  diagnosisResultType: string | null;
  diagnosisAudienceType: string | null;
  name: string;
  contact: string;
  concernType: string;
  stage: string;
  consultationType: string;
  message: string;
  referenceUrl: string;
  preferredSchedule: string;
};

function getNotionConfig() {
  const apiKey = process.env.NOTION_CONTACT_API_KEY
    || process.env.NOTION_API_KEY_SOOM_BLOG
    || process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_CONTACT_DATABASE_ID
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

function buildNotionProperties(schema: Record<string, NotionPropertySchema>, record: InquiryRecord) {
  const titleName = Object.entries(schema).find(([, property]) => property.type === "title")?.[0];
  if (!titleName) return null;

  const properties: Record<string, unknown> = {
    [titleName]: titleProperty(`${record.name} - ${record.consultationType}`),
  };

  applyNotionProperty(properties, schema, "Inquiry ID", record.inquiryId);
  applyNotionProperty(properties, schema, "Contact", record.contact);
  applyNotionProperty(properties, schema, "Source", record.source);
  applyNotionProperty(properties, schema, "Diagnosis Type", record.diagnosisResultType ?? "");
  applyNotionProperty(properties, schema, "Diagnosis Audience", record.diagnosisAudienceType ?? "");
  applyNotionProperty(properties, schema, "Concern", record.concernType);
  applyNotionProperty(properties, schema, "Stage", record.stage);
  applyNotionProperty(properties, schema, "Consultation Type", record.consultationType);
  applyNotionProperty(properties, schema, "Message", record.message);
  applyNotionProperty(properties, schema, "Reference URL", record.referenceUrl);
  applyNotionProperty(properties, schema, "Preferred Schedule", record.preferredSchedule);
  applyNotionProperty(properties, schema, "Created At", record.createdAt);

  return properties;
}

async function saveInquiryToNotion(record: InquiryRecord) {
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
    console.error("Failed to save contact inquiry to Notion", response.status, detail);
    return false;
  }

  return true;
}

async function saveInquiryToLocalFallback(record: InquiryRecord) {
  const directory = process.env.VERCEL
    ? path.join("/tmp", "soom-contact-inquiries")
    : path.join(process.cwd(), "ops", "contact-inquiries");
  await mkdir(directory, { recursive: true });
  await appendFile(path.join(directory, "consultation.jsonl"), `${JSON.stringify(record)}\n`, "utf8");
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
  const record: InquiryRecord = {
    inquiryId,
    createdAt: new Date().toISOString(),
    source: parsed.data.diagnosisSource || "contact",
    diagnosisResultType: parsed.data.diagnosisResultType || null,
    diagnosisAudienceType: parsed.data.diagnosisAudienceType || null,
    name: parsed.data.name,
    contact: parsed.data.contact,
    concernType: parsed.data.concernType,
    stage: parsed.data.stage,
    consultationType: parsed.data.consultationType,
    message: parsed.data.message,
    referenceUrl: parsed.data.referenceUrl,
    preferredSchedule: parsed.data.preferredSchedule,
  };

  const savedToNotion = await saveInquiryToNotion(record);
  if (!savedToNotion) {
    await saveInquiryToLocalFallback(record);
  }

  return NextResponse.json({
    inquiryId,
    message: "30분 방향 진단 신청이 접수되었습니다. 남겨주신 상황을 기준으로 먼저 방향을 정리해 보겠습니다.",
  });
}
