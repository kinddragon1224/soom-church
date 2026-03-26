import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import { isLoggedIn } from "@/lib/auth";
import { getNotionBlogPostBySlug } from "@/lib/notion-blog";

export const revalidate = 20;

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function GuideDetailPage({ params }: { params: { slug: string } }) {
  const loggedIn = await isLoggedIn();
  const post = await getNotionBlogPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <section className="border-b border-white/10 bg-[#05070b]">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="guides" loggedIn={loggedIn} />
        </div>
      </section>

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,#1b2438_0%,#0b1018_42%,#05070b_100%)]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <Link href="/blog" className="text-sm text-white/54">← 블로그 목록</Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-[11px] tracking-[0.28em] text-white/42">SOOM ARTICLE</p>
              <h1 className="mt-4 text-[2.3rem] font-semibold leading-[0.96] tracking-[-0.07em] text-white sm:text-[4.2rem]">{post.title}</h1>
              <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/58">
                <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5">Notion CMS</span>
                {formatDate(post.publishedAt) ? <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5">{formatDate(post.publishedAt)}</span> : null}
              </div>
              {post.excerpt ? <p className="mt-6 max-w-xl text-sm leading-7 text-white/66 sm:text-base">{post.excerpt}</p> : null}
            </div>
            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0b1018] shadow-[0_28px_90px_rgba(2,6,23,0.45)]">
              {post.coverImageUrl ? (
                <img src={post.coverImageUrl} alt={post.title} className="h-[280px] w-full object-cover sm:h-[420px]" />
              ) : (
                <div className="h-[280px] w-full bg-[linear-gradient(135deg,#17233d_0%,#243252_50%,#3b4f74_100%)] sm:h-[420px]" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#05070b]">
        <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
          <article className="rounded-[32px] border border-white/10 bg-[#0b1018] p-7 shadow-[0_24px_80px_rgba(2,6,23,0.34)] sm:p-10">
            <div className="grid gap-7">
              {post.blocks.length === 0 ? (
                <p className="text-base leading-8 text-white/72">본문 블록이 아직 없습니다.</p>
              ) : (
                post.blocks.map((block, index) => {
                  if (block.type === "heading") {
                    const HeadingTag = block.level === 1 ? "h2" : block.level === 2 ? "h3" : "h4";
                    return <HeadingTag key={index} className="text-[1.8rem] font-semibold leading-[1.14] tracking-[-0.04em] text-white">{block.content}</HeadingTag>;
                  }
                  if (block.type === "quote") {
                    return <blockquote key={index} className="rounded-[24px] border border-white/10 bg-white/[0.04] px-6 py-5 text-lg leading-8 text-white/86">{block.content}</blockquote>;
                  }
                  if (block.type === "image") {
                    return (
                      <figure key={index} className="grid gap-3 overflow-hidden rounded-[26px] border border-white/10 bg-[#111827] p-3">
                        <img src={block.url} alt={block.caption ?? post.title} className="w-full rounded-[20px] object-cover" />
                        {block.caption ? <figcaption className="px-1 text-sm text-white/52">{block.caption}</figcaption> : null}
                      </figure>
                    );
                  }
                  return <p key={index} className="whitespace-pre-wrap text-[1.02rem] leading-8 text-white/74">{block.content}</p>;
                })
              )}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
