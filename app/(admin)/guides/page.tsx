import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { slugifyKorean } from "@/lib/slug";
import Link from "next/link";

export const dynamic = "force-dynamic";

function parseImageLines(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({ imageUrl: line, sortOrder: index }));
}

async function getFirstAdmin() {
  return prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
}

export default async function GuidesAdminPage() {
  const posts = await prisma.guidePost.findMany({
    orderBy: [{ published: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    include: { author: true, images: { orderBy: { sortOrder: "asc" } } },
  });

  async function createGuidePost(formData: FormData) {
    "use server";

    const title = String(formData.get("title") || "").trim();
    const excerpt = String(formData.get("excerpt") || "").trim();
    const content = String(formData.get("content") || "").trim();
    const coverImageUrl = String(formData.get("coverImageUrl") || "").trim();
    const imageUrls = String(formData.get("imageUrls") || "").trim();
    const published = formData.get("published") === "on";

    if (!title || !content) return;

    const author = await getFirstAdmin();
    if (!author) return;

    const baseSlug = slugifyKorean(title) || `guide-${Date.now()}`;
    let slug = baseSlug;
    let count = 1;

    while (await prisma.guidePost.findUnique({ where: { slug } })) {
      count += 1;
      slug = `${baseSlug}-${count}`;
    }

    await prisma.guidePost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImageUrl: coverImageUrl || null,
        published,
        publishedAt: published ? new Date() : null,
        authorId: author.id,
        images: {
          create: parseImageLines(imageUrls),
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        actorId: author.id,
        action: "GUIDE_POST_CREATED",
        targetType: "GuidePost",
        metadata: JSON.stringify({ title, published }),
      },
    });

    revalidatePath("/ai-guides");
  }

  async function togglePublished(formData: FormData) {
    "use server";

    const postId = String(formData.get("postId") || "");
    if (!postId) return;

    const post = await prisma.guidePost.findUnique({ where: { id: postId } });
    if (!post) return;

    await prisma.guidePost.update({
      where: { id: postId },
      data: {
        published: !post.published,
        publishedAt: !post.published ? new Date() : null,
      },
    });

    revalidatePath("/ai-guides");
    revalidatePath(`/ai-guides/${post.slug}`);
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-xl border border-border bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">AI 안내서 작성</h1>
            <p className="mt-1 text-sm text-muted-foreground">목회자와 사역자를 위한 AI 안내서를 블로그처럼 작성하고 발행해.</p>
          </div>
          <Link href="/ai-guides" className="text-sm font-medium text-primary">
            공개 페이지 보기
          </Link>
        </div>

        <form action={createGuidePost} className="mt-5 space-y-3">
          <input name="title" placeholder="제목" className="w-full rounded border border-border px-3 py-2 text-sm" required />
          <textarea name="excerpt" placeholder="짧은 소개글" className="min-h-24 w-full rounded border border-border px-3 py-2 text-sm" />
          <textarea name="content" placeholder="본문" className="min-h-[280px] w-full rounded border border-border px-3 py-2 text-sm" required />
          <input name="coverImageUrl" placeholder="대표 이미지 URL" className="w-full rounded border border-border px-3 py-2 text-sm" />
          <textarea
            name="imageUrls"
            placeholder={"첨부 이미지 URL\n한 줄에 하나씩 입력"}
            className="min-h-24 w-full rounded border border-border px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm"><input name="published" type="checkbox" /> 바로 발행</label>
          <button className="rounded bg-primary px-3 py-2 text-sm text-white">저장</button>
        </form>
      </section>

      <section className="rounded-xl border border-border bg-white p-4 sm:p-5">
        <h2 className="text-lg font-semibold">안내서 목록</h2>
        <ul className="mt-4 space-y-3">
          {posts.map((post) => (
            <li key={post.id} className="rounded-lg border border-border p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-medium text-slate-900">{post.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {post.published ? "발행됨" : "초안"} · 작성자 {post.author.name}
                  </p>
                  {post.excerpt ? <p className="mt-2 line-clamp-2 text-sm text-slate-600">{post.excerpt}</p> : null}
                  <p className="mt-2 text-xs text-muted-foreground">/ai-guides/{post.slug}</p>
                </div>
                <form action={togglePublished}>
                  <input type="hidden" name="postId" value={post.id} />
                  <button className="rounded border border-border px-3 py-1.5 text-xs">
                    {post.published ? "비공개" : "발행"}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
