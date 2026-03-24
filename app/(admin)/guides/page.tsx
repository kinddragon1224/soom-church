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
      <section className="rounded-[24px] border border-[#e6dfd5] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-5 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-white/46">BLOG STUDIO</p>
            <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.06em] text-white">네이버 블로그 스타일 1차 에디터</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/66">제목 영역, 본문 캔버스, 우측 설정 패널 구조로 재구성한 블로그 관리자 화면.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/ai-guides" className="rounded-[14px] border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white">공개 블로그 보기</Link>
          </div>
        </div>
      </section>

      <GuidePostForm action={editing ? updateGuidePost.bind(null, editing.id) : createGuidePost} value={editing ?? undefined} />

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">POST LIST</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">작성된 블로그 글</h2>
          </div>
          <span className="text-xs text-[#8C7A5B]">총 {posts.length}개</span>
        </div>
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
                    <p className="mt-1 text-xs text-[#8C7A5B]">{post.slug} · {post.author.name} · {post.published ? "발행" : "초안"}</p>
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
