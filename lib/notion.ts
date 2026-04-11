type NotionEnvKey = "NOTION_API_KEY" | "NOTION_BLOG_API_KEY" | "NOTION_OPS_API_KEY";

const NOTION_VERSION = "2025-09-03";

function getEnvKey(kind: "default" | "blog" | "ops" = "default"): NotionEnvKey {
  if (kind === "blog") return "NOTION_BLOG_API_KEY";
  if (kind === "ops") return "NOTION_OPS_API_KEY";
  return "NOTION_API_KEY";
}

export function getNotionToken(kind: "default" | "blog" | "ops" = "default") {
  const envKey = getEnvKey(kind);
  return process.env[envKey] || (kind !== "default" ? process.env.NOTION_API_KEY : undefined) || null;
}

export function isNotionConfigured(kind: "default" | "blog" | "ops" = "default") {
  return Boolean(getNotionToken(kind));
}

export async function notionFetch(path: string, init?: RequestInit, kind: "default" | "blog" | "ops" = "default") {
  const token = getNotionToken(kind);
  if (!token) throw new Error(`Missing Notion token for ${kind}`);

  return fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}

export async function queryNotionDataSource(dataSourceId: string, body: Record<string, unknown> = {}, kind: "default" | "blog" | "ops" = "default") {
  const res = await notionFetch(`/data_sources/${dataSourceId}/query`, {
    method: "POST",
    body: JSON.stringify(body),
  }, kind);

  if (!res.ok) {
    throw new Error(`Notion query failed: ${res.status}`);
  }

  return res.json();
}
