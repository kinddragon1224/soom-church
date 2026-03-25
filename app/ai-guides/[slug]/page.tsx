import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/site-header";
import { isLoggedIn } from "@/lib/auth";
import { getNotionBlogPostBySlug } from "@/lib/notion-blog";

export const revalidate = 20;

export default async function GuideDetailPage({ params }: { params: { slug: string } }) {
  const loggedIn = await isLoggedIn();
  const post = await getNotionBlogPostBySlug(params.slug);
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
          <Link href="/ai-guides" className="text-sm text-[#7a6f67]">← 블로그 목록</Link>
          <article className="mt-8 rounded-[32px] border border-[#e6dfd5] bg-white p-8 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-10">
            <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">NOTION POST</p>
            <h1 className="mt-4 font-display text-[2rem] leading-[1.08] tracking-[-0.05em] sm:text-[3rem]">{post.title}</h1>
            <div className="mt-8 grid gap-6">
              {post.blocks.length === 0 ? (
                <p className="text-base leading-8 text-[#1f2937]">본문 블록이 아직 없습니다.</p>
              ) : (
                post.blocks.map((block, index) => {
                  if (block.type === "heading") {
                    const HeadingTag = block.level === 1 ? "h2" : block.level === 2 ? "h3" : "h4";
                    return <HeadingTag key={index} className="text-2xl font-semibold tracking-[-0.04em] text-[#111111]">{block.content}</HeadingTag>;
                  }
                  if (block.type === "quote") {
                    return <blockquote key={index} className="rounded-[20px] border-l-4 border-[#c7a874] bg-[#fcfbf8] px-5 py-4 text-lg leading-8 text-[#5a4630]">{block.content}</blockquote>;
                  }
                  if (block.type === "image") {
                    return (
                      <figure key={index} className="grid gap-3">
                        <img src={block.url} alt={block.caption ?? post.title} className="w-full rounded-[24px] object-cover" />
                        {block.caption ? <figcaption className="text-sm text-[#7a6f67]">{block.caption}</figcaption> : null}
                      </figure>
                    );
                  }
                  return <p key={index} className="whitespace-pre-wrap text-base leading-8 text-[#1f2937]">{block.content}</p>;
                })
              )}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
