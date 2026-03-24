"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

function asOptionalString(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text || null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function refreshGuides(slug?: string) {
  revalidateTag("public:guides");
  if (slug) revalidateTag(`public:guides:${slug}`);
}

function getGuideInput(formData: FormData) {
  return {
    title: String(formData.get("title") || "").trim(),
    excerpt: asOptionalString(formData.get("excerpt")),
    seoTitle: asOptionalString(formData.get("seoTitle")),
    seoDescription: asOptionalString(formData.get("seoDescription")),
    content: String(formData.get("content") || "").trim(),
    coverImageUrl: asOptionalString(formData.get("coverImageUrl")),
  };
}

export async function createGuidePost(formData: FormData) {
  const input = getGuideInput(formData);
  const authorEmail = String(formData.get("authorEmail") || "dev@soom.church").trim();
  if (!input.title) return;

  const author = await prisma.user.findUnique({ where: { email: authorEmail } });
  if (!author) return;

  const slugBase = slugify(String(formData.get("slug") || "") || input.title) || `guide-${Date.now()}`;
  let slug = slugBase;
  let suffix = 1;
  while (await prisma.guidePost.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${suffix++}`;
  }

  const published = formData.get("published") === "on";
  const post = await prisma.guidePost.create({
    data: {
      ...input,
      slug,
      published,
      publishedAt: published ? new Date() : null,
      authorId: author.id,
    },
  });

  await refreshGuides(post.slug);
  redirect(`/guides?created=${post.id}`);
}

export async function updateGuidePost(postId: string, formData: FormData) {
  const existing = await prisma.guidePost.findUnique({ where: { id: postId } });
  if (!existing) return;

  const input = getGuideInput(formData);
  const published = formData.get("published") === "on";
  await prisma.guidePost.update({
    where: { id: existing.id },
    data: {
      ...input,
      published,
      publishedAt: published ? existing.publishedAt ?? new Date() : null,
    },
  });

  await refreshGuides(existing.slug);
  redirect(`/guides?updated=${existing.id}`);
}
