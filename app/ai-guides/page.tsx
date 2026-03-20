import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GuidesPage() {
  const posts = await prisma.guidePost.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: { author: true, images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#0c1220]">
      <section className="border-b border-[#e6dfd5] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader current="guides" />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <p className="text-xs tracking-[0.24em] text-[#7a6f67]">AI GUIDE</p>
          <h1 className="mt-5 font-display text-[2.6rem] leading-[1.05] tracking-[-0.06em] sm:text-[4.4rem]">
            목회자와 사역자를 위한
            <br />
            AI 안내서
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-[#5d667d] sm:text-base">
            설교 준비, 행정, 공지, 콘텐츠, 반복 업무 정리에 바로 적용할 수 있는 실전형 AI 가이드를 정리합니다.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => {
              const imageUrl = post.coverImageUrl || post.images[0]?.imageUrl || null;

              return (
                <article key={post.id} className="overflow-hidden rounded-[28px] border border-[#e6dfd5] bg-white shadow-[0_16px_40px_rgba(16,24,40,0.05)]">
                  <Link href={`/ai-guides/${post.slug}`}>
                    <div className="relative aspect-[16/10] bg-[#ede7dc]">
                      {imageUrl ? (
                        <img src={imageUrl} alt={post.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[#8a7d72]">NO IMAGE</div>
                      )}
                    </div>
                  </Link>
                  <div className="p-6">
                    <p className="text-xs tracking-[0.18em] text-[#9a8b7a]">AI GUIDE</p>
                    <Link href={`/ai-guides/${post.slug}`} className="mt-3 block text-[1.45rem] font-semibold leading-[1.25] tracking-[-0.03em] text-[#0c1220]">
                      {post.title}
                    </Link>
                    {post.excerpt ? <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#5d667d]">{post.excerpt}</p> : null}
                    <p className="mt-4 text-xs text-[#8a7d72]">{post.author.name}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
