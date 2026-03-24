import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import { isLoggedIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const revalidate = 20;

export default async function GuideDetailPage({ params }: { params: { slug: string } }) {
  const loggedIn = await isLoggedIn();
  const post = await prisma.guidePost.findFirst({
    where: { slug: params.slug, published: true },
    select: {
      title: true,
      excerpt: true,
      seoTitle: true,
      seoDescription: true,
      content: true,
      coverImageUrl: true,
      publishedAt: true,
    },
  });
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#0c1220]">
      <section className="border-b border-[#e6dfd5] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader current="guides" loggedIn={loggedIn} />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <Link href="/ai-guides" className="text-sm text-[#7a6f67]">← AI 안내서 목록</Link>
          <article className="mt-8 rounded-[32px] border border-[#e6dfd5] bg-white p-8 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-10">
            <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">AI GUIDE</p>
            <h1 className="mt-4 font-display text-[2rem] leading-[1.08] tracking-[-0.05em] sm:text-[3rem]">{post.title}</h1>
            {post.excerpt ? <p className="mt-5 text-sm leading-7 text-[#5d667d] sm:text-base">{post.excerpt}</p> : null}
            {post.seoTitle || post.seoDescription ? (
              <div className="mt-6 rounded-[20px] border border-[#ece6dc] bg-[#fcfbf8] p-4">
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">SEO</p>
                {post.seoTitle ? <p className="mt-2 text-sm font-semibold text-[#111111]">{post.seoTitle}</p> : null}
                {post.seoDescription ? <p className="mt-2 text-sm leading-6 text-[#5d667d]">{post.seoDescription}</p> : null}
              </div>
            ) : null}
            {post.coverImageUrl ? <img src={post.coverImageUrl} alt={post.title} className="mt-8 w-full rounded-[24px] object-cover" /> : null}
            <div className="prose prose-slate mt-8 max-w-none whitespace-pre-wrap text-base leading-8 text-[#1f2937]">{post.content}</div>
          </article>
        </div>
      </section>
    </main>
  );
}
