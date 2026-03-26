"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { BlogPostStatus } from "@prisma/client";
import { requireWorkspaceMembership } from "@/lib/church-context";
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

function buildContentJson(formData: FormData) {
  const hero = String(formData.get("hero") || "").trim();
  const sections = [1, 2, 3, 4]
    .map((index) => ({
      heading: String(formData.get(`heading_${index}`) || "").trim(),
      body: String(formData.get(`body_${index}`) || "").trim(),
      imageUrl: String(formData.get(`imageUrl_${index}`) || "").trim(),
      imageCaption: String(formData.get(`imageCaption_${index}`) || "").trim(),
    }))
    .filter((section) => section.heading || section.body || section.imageUrl || section.imageCaption);

  return JSON.stringify({ hero, sections });
}

async function refreshBlog(churchId: string, postId?: string) {
  revalidateTag(`church:${churchId}:blog`);
  if (postId) revalidateTag(`church:${churchId}:blog:${postId}`);
}

function getPostInput(formData: FormData) {
  return {
    title: String(formData.get("title") || "").trim(),
    excerpt: asOptionalString(formData.get("excerpt")),
    seoTitle: asOptionalString(formData.get("seoTitle")),
    seoDescription: asOptionalString(formData.get("seoDescription")),
    coverImageUrl: asOptionalString(formData.get("coverImageUrl")),
    contentJson: buildContentJson(formData),
    status: String(formData.get("status") || BlogPostStatus.DRAFT) as BlogPostStatus,
  };
}

export async function createBlogPost(churchSlug: string, formData: FormData) {
  const { membership, userId } = await requireWorkspaceMembership(churchSlug);
  if (!membership) return;

  const input = getPostInput(formData);
  if (!input.title) return;

  const slugBase = slugify(String(formData.get("slug") || "") || input.title) || `post-${Date.now()}`;
  let slug = slugBase;
  let suffix = 1;
  while (await prisma.blogPost.findFirst({ where: { churchId: membership.church.id, slug }, select: { id: true } })) {
    slug = `${slugBase}-${suffix++}`;
  }

  const post = await prisma.blogPost.create({
    data: {
      churchId: membership.church.id,
      authorId: userId,
      slug,
      ...input,
      publishedAt: input.status === BlogPostStatus.PUBLISHED ? new Date() : null,
    },
  });

  await refreshBlog(membership.church.id, post.id);
  redirect(`/app/${churchSlug}/records/${post.id}/edit`);
}

export async function updateBlogPost(churchSlug: string, postId: string, formData: FormData) {
  const { membership } = await requireWorkspaceMembership(churchSlug);
  if (!membership) return;

  const existing = await prisma.blogPost.findFirst({ where: { id: postId, churchId: membership.church.id } });
  if (!existing) return;

  const input = getPostInput(formData);
  if (!input.title) return;

  await prisma.blogPost.update({
    where: { id: existing.id },
    data: {
      ...input,
      publishedAt: input.status === BlogPostStatus.PUBLISHED ? existing.publishedAt ?? new Date() : null,
    },
  });

  await refreshBlog(membership.church.id, existing.id);
  redirect(`/app/${churchSlug}/records/${existing.id}/edit?saved=1`);
}
