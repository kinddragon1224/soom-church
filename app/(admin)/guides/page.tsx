import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GuidePostForm } from "@/components/guides/guide-post-form";
import { createGuidePost, updateGuidePost } from "./actions";

export default async function GuidesAdminPage({ searchParams }: { searchParams?: { created?: string; updated?: string } }) {
  const posts = await prisma.guidePost.findMany({
    include: { author: { select: { name: true } } },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });
  const editing = searchParams?.updated ? await prisma.guidePost.findUnique({ where: { id: searchParams.updated } }) : null;

  return (
    <div className="grid grid-cols-1 gap-4">
      <section className="rounded-xl border border-border bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">AI 안내서</h1>
            <p className="mt-2 text-sm text-muted-foreground">공개 `/ai-guides` 탭과 직접 연결된 관리자 화면.</p>
          </div>
          <Link href="/ai-guides" className="rounded-md border border-border px-3 py-2 text-sm">공개 페이지 보기</Link>
        </div>
      </section>

      <GuidePostForm action={editing ? updateGuidePost.bind(null, editing.id) : createGuidePost} value={editing ?? undefined} />

      <section className="rounded-xl border border-border bg-white p-4 sm:p-5">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">POSTS</p>
        <div className="mt-4 grid gap-3">
          {posts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">작성된 안내서가 아직 없어.</div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{post.excerpt ?? "요약문 없음"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{post.slug} · {post.author.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/guides?updated=${post.id}`} className="rounded-md border border-border px-3 py-2 text-sm">수정</Link>
                    <Link href={`/ai-guides/${post.slug}`} className="rounded-md border border-border px-3 py-2 text-sm">열기</Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
