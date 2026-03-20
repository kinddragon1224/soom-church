import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GuideDetailPage({ params }: { params: { slug: string } }) {
  const post = await prisma.guidePost.findFirst({
    where: { slug: params.slug, published: true },
    include: { author: true, images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!post) notFound();

  const paragraphs = post.content.split(/\n\n+/).map((item) => item.trim()).filter(Boolean);

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#0c1220]">
      <section className="border-b border-[#e6dfd5] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader current="guides" />
        </div>
      </section>

      <article>
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <Link href="/ai-guides" className="text-sm text-[#7a6f67]">← AI 안내서 목록</Link>
          <p className="mt-8 text-xs tracking-[0.24em] text-[#9a8b7a]">AI GUIDE</p>
          <h1 className="mt-5 font-display text-[2.5rem] leading-[1.08] tracking-[-0.06em] sm:text-[4rem]">{post.title}</h1>
          {post.excerpt ? <p className="mt-6 text-base leading-8 text-[#5d667d]">{post.excerpt}</p> : null}
          <p className="mt-6 text-sm text-[#8a7d72]">작성자 {post.author.name}</p>

          {post.coverImageUrl ? (
            <div className="mt-10 aspect-[16/9] overflow-hidden rounded-[28px] bg-[#ede7dc]">
              <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover" />
            </div>
          ) : null}

          <div className="mt-10 space-y-6 text-[1.02rem] leading-8 text-[#334155]">
            {paragraphs.map((paragraph, index) => (
              <p key={`${post.id}-${index}`}>{paragraph}</p>
            ))}
          </div>

          {post.images.length > 0 ? (
            <section className="mt-14">
              <h2 className="font-display text-[1.8rem] tracking-[-0.04em]">첨부 이미지</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {post.images.map((image) => (
                  <div key={image.id} className="aspect-[4/3] overflow-hidden rounded-[24px] bg-[#ede7dc]">
                    <img src={image.imageUrl} alt={image.alt || post.title} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </article>
    </main>
  );
}
