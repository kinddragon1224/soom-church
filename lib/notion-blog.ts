import { cache } from "react";

type NotionRichText = { plain_text?: string };

type NotionBlock = {
  id: string;
  type: string;
  has_children?: boolean;
  [key: string]: any;
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

const NOTION_VERSION = "2026-03-11";
const ROOT_PAGE_ID = process.env.NOTION_BLOG_ROOT_PAGE_ID;
const TOKEN = process.env.NOTION_API_KEY;

function isConfigured() {
  return Boolean(TOKEN && ROOT_PAGE_ID);
}

async function notion(path: string, init?: RequestInit) {
  if (!isConfigured()) {
    throw new Error("Notion blog env is not configured.");
  }
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

function pageTitle(page: any) {
  const title = page.properties?.title?.title;
  if (Array.isArray(title)) return richTextToPlainText(title);
  return page.child_page?.title ?? "제목 없음";
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

async function getRootChildren() {
  const result = await notion(`/blocks/${ROOT_PAGE_ID}/children?page_size=100`);
  return result.results as NotionBlock[];
}

const getBlogChildPages = cache(async () => {
  const children = await getRootChildren();
  return children.filter((block) => block.type === "child_page");
});

async function getPage(pageId: string) {
  return notion(`/pages/${pageId}`);
}

async function getBlockChildren(blockId: string) {
  const result = await notion(`/blocks/${blockId}/children?page_size=100`);
  return result.results as NotionBlock[];
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
    return {
      type: "heading",
      level: key === "heading_1" ? 1 : key === "heading_2" ? 2 : 3,
      content,
    };
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

  const pages = await getBlogChildPages();

  return pages.map((page) => {
    const title = page.child_page?.title ?? "제목 없음";
    return {
      id: page.id,
      slug: normalizeSlug(title) || page.id.replaceAll("-", ""),
      title,
      excerpt: null,
      coverImageUrl: null,
      publishedAt: page.last_edited_time ?? page.created_time ?? null,
    };
  });
});

export const getNotionBlogPostBySlug = cache(async (slug: string): Promise<NotionBlogPostDetail | null> => {
  if (!isConfigured()) return null;

  const pages = await listNotionBlogPosts();
  const matched = pages.find((page) => page.slug === slug);
  if (!matched) return null;

  const [page, blocks] = await Promise.all([getPage(matched.id), getBlockChildren(matched.id)]);
  const contentBlocks = blocks.map(blockToContent).filter(Boolean) as NotionBlogContentBlock[];

  return {
    id: matched.id,
    slug: matched.slug,
    title: pageTitle(page) || matched.title,
    excerpt: null,
    coverImageUrl: null,
    publishedAt: matched.publishedAt,
    blocks: contentBlocks,
  };
});
