import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getChurchBlogPosts(churchId: string) {
  return unstable_cache(
    async () =>
      prisma.blogPost.findMany({
        where: { churchId },
        include: { author: { select: { name: true } } },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      }),
    [`church-blog-posts-${churchId}`],
    { revalidate: 20, tags: [`church:${churchId}:blog`] },
  )();
}

export async function getChurchBlogPost(churchId: string, postId: string) {
  return unstable_cache(
    async () =>
      prisma.blogPost.findFirst({
        where: { churchId, id: postId },
        include: { author: { select: { name: true } } },
      }),
    [`church-blog-post-${churchId}-${postId}`],
    { revalidate: 20, tags: [`church:${churchId}:blog:${postId}`] },
  )();
}
