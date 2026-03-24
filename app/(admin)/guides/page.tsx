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
    <div className="grid grid-cols-1 gap-4 text-[#111111]">
      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-[#111111]">AI 안내서</h1>
            <p className="mt-2 text-sm text-[#5f564b]">공개 `/ai-guides` 탭과 직접 연결된 관리자 화면.</p>
          </div>
          <Link href="/ai-guides" className="rounded-[12px] border border-[#d9d2c7] bg-[#fcfbf8] px-3 py-2 text-sm font-medium text-[#111111]">공개 페이지 보기</Link>
        </div>
      </section>

      <GuidePostForm action={editing ? updateGuidePost.bind(null, editing.id) : createGuidePost} value={editing ?? undefined} />

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-5">
        <p className="text-xs uppercase tracking-wide text-[#8C7A5B]">POSTS</p>
        <div className="mt-4 grid gap-3">
          {posts.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-[#dccfb9] p-4 text-sm text-[#5f564b]">작성된 안내서가 아직 없습니다.</div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="rounded-[18px] border border-[#ece6dc] bg-[#fcfbf8] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-[#111111]">{post.title}</p>
                    <p className="mt-1 text-sm text-[#5f564b]">{post.excerpt ?? "요약문 없음"}</p>
                    <p className="mt-1 text-xs text-[#8C7A5B]">{post.slug} · {post.author.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/guides?updated=${post.id}`} className="rounded-[12px] border border-[#d9d2c7] bg-white px-3 py-2 text-sm font-medium text-[#111111]">수정</Link>
                    <Link href={`/ai-guides/${post.slug}`} className="rounded-[12px] border border-[#d9d2c7] bg-white px-3 py-2 text-sm font-medium text-[#111111]">열기</Link>
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
