import { cache } from "react";

type NotionRichText = { plain_text?: string };
type NotionBlock = { id: string; type: string; has_children?: boolean; [key: string]: any };

type NotionPage = {
  id: string;
  created_time?: string;
  last_edited_time?: string;
  properties?: Record<string, any>;
  cover?: { type?: string; file?: { url?: string }; external?: { url?: string } } | null;
};

export type NotionBlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
};

export type NotionBlogContentBlock =
  | { type: "paragraph"; content: string }
  | { type: "heading"; level: 1 | 2 | 3; content: string }
  | { type: "quote"; content: string }
  | { type: "image"; url: string; caption?: string };

export type NotionBlogPostDetail = NotionBlogPostSummary & {
  blocks: NotionBlogContentBlock[];
};

function buildPostSlug(title: string, id: string) {
  const base = normalizeSlug(title);
  const shortId = id.replaceAll("-", "").slice(0, 8);
  return base ? `${base}-${shortId}` : shortId;
}

const NOTION_VERSION = "2026-03-11";
const ROOT_PAGE_ID = process.env.NOTION_BLOG_ROOT_PAGE_ID;
const TOKEN = process.env.NOTION_API_KEY;
const DATA_SOURCE_ID = process.env.NOTION_BLOG_DATA_SOURCE_ID || "d1206093-2bd9-8201-99cb-07656bb1979d";

function isConfigured() {
  return Boolean(TOKEN && ROOT_PAGE_ID);
}

async function notion(path: string, init?: RequestInit) {
  if (!isConfigured()) throw new Error("Notion blog env is not configured.");

  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    next: { revalidate: 20 },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Notion request failed (${response.status}): ${text}`);
  }

  return response.json();
}

function richTextToPlainText(richText: NotionRichText[] = []) {
  return richText.map((item) => item.plain_text ?? "").join("").trim();
}

function normalizeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getTitleFromProperties(properties?: Record<string, any>) {
  if (!properties) return "제목 없음";
  const titleKey = Object.keys(properties).find((key) => properties[key]?.type === "title");
  if (!titleKey) return "제목 없음";
  return richTextToPlainText(properties[titleKey]?.title ?? []) || "제목 없음";
}

function getExcerptFromProperties(properties?: Record<string, any>) {
  const value = properties?.excerpt?.rich_text;
  if (!Array.isArray(value)) return null;
  const excerpt = richTextToPlainText(value);
  return excerpt || null;
}

function getPageCoverUrl(page?: NotionPage | null) {
  return page?.cover?.file?.url ?? page?.cover?.external?.url ?? null;
}

function getPublishedAt(properties?: Record<string, any>, fallback?: string | null) {
  const value = properties?.Published?.date?.start;
  return value ?? fallback ?? null;
}

function isPublished(properties?: Record<string, any>) {
  const status = properties?.status?.status?.name;
  if (!status) return true;
  return status === "진행 중" || status === "완료" || status.toLowerCase() === "published";
}

async function queryDataSource() {
  const result = await notion(`/data_sources/${DATA_SOURCE_ID}/query`, {
    method: "POST",
    body: JSON.stringify({
      page_size: 100,
      sorts: [{ property: "Published", direction: "descending" }],
    }),
  });
  return result.results as NotionPage[];
}

async function getPage(pageId: string) {
  return notion(`/pages/${pageId}`);
}

async function getBlockChildren(blockId: string) {
  const result = await notion(`/blocks/${blockId}/children?page_size=100`);
  return result.results as NotionBlock[];
}

function getBlockImageUrl(block: NotionBlock) {
  if (block.type !== "image") return null;
  return block.image?.file?.url ?? block.image?.external?.url ?? null;
}

function blockToContent(block: NotionBlock): NotionBlogContentBlock | null {
  if (block.type === "paragraph") {
    const content = richTextToPlainText(block.paragraph?.rich_text ?? block.paragraph?.text ?? []);
    if (!content) return null;
    return { type: "paragraph", content };
  }

  if (block.type === "heading_1" || block.type === "heading_2" || block.type === "heading_3") {
    const key = block.type;
    const content = richTextToPlainText(block[key]?.rich_text ?? block[key]?.text ?? []);
    if (!content) return null;
    return { type: "heading", level: key === "heading_1" ? 1 : key === "heading_2" ? 2 : 3, content };
  }

  if (block.type === "quote") {
    const content = richTextToPlainText(block.quote?.rich_text ?? block.quote?.text ?? []);
    if (!content) return null;
    return { type: "quote", content };
  }

  if (block.type === "image") {
    const source = block.image?.file?.url ?? block.image?.external?.url ?? null;
    if (!source) return null;
    const caption = richTextToPlainText(block.image?.caption ?? []);
    return { type: "image", url: source, caption: caption || undefined };
  }

  return null;
}

export const listNotionBlogPosts = cache(async (): Promise<NotionBlogPostSummary[]> => {
  if (!isConfigured()) return [];

  const rows = await queryDataSource();
  const publishedRows = rows.filter((row) => isPublished(row.properties));

  const summaries = await Promise.all(
    publishedRows.map(async (row) => {
      const title = getTitleFromProperties(row.properties);
      const blocks = await getBlockChildren(row.id).catch(() => [] as NotionBlock[]);
      const firstImage = blocks.map(getBlockImageUrl).find(Boolean) ?? null;

      return {
        id: row.id,
        slug: buildPostSlug(title, row.id),
        title,
        excerpt: getExcerptFromProperties(row.properties),
        coverImageUrl: getPageCoverUrl(row) ?? firstImage,
        publishedAt: getPublishedAt(row.properties, row.last_edited_time ?? row.created_time ?? null),
      };
    }),
  );

  return summaries.filter((row) => row.title !== "제목 없음");
});

export const getNotionBlogPostBySlug = cache(async (slug: string): Promise<NotionBlogPostDetail | null> => {
  if (!isConfigured()) return null;

  const posts = await listNotionBlogPosts();
  const slugTail = slug.split("-").pop() ?? "";
  const matched = posts.find((post) => post.slug === slug || post.id.replaceAll("-", "").startsWith(slugTail));
  if (!matched) return null;

  const [page, blocks] = await Promise.all([getPage(matched.id), getBlockChildren(matched.id)]);
  const contentBlocks = blocks.map(blockToContent).filter(Boolean) as NotionBlogContentBlock[];
  const firstImage = blocks.map(getBlockImageUrl).find(Boolean) ?? null;

  return {
    ...matched,
    title: getTitleFromProperties(page.properties) || matched.title,
    coverImageUrl: getPageCoverUrl(page) ?? firstImage,
    blocks: contentBlocks,
  };
});
