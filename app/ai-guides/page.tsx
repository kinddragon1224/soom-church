import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { isLoggedIn } from "@/lib/auth";
import { listNotionBlogPosts } from "@/lib/notion-blog";

export const revalidate = 20;

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function GuidesPage() {
  const loggedIn = await isLoggedIn();
  const posts = await listNotionBlogPosts();
  const featured = posts[0] ?? null;
  const sidePosts = posts.slice(1, 3);
  const gridPosts = posts.slice(3);
  const topics = ["목회", "운영", "AI 활용", "콘텐츠", "전달 구조"];

  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <section className="border-b border-white/10 bg-[#05070b]">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="guides" loggedIn={loggedIn} />
        </div>
      </section>

      <section className="overflow-hidden border-b border-white/10 bg-[linear-gradient(135deg,#050b16_0%,#0a1222_48%,#121a2c_100%)]">
        <div className="mx-auto w-full max-w-[1600px] px-0 py-0">
          <div className="relative min-h-[560px] overflow-hidden bg-[#030508] sm:min-h-[680px] lg:min-h-[860px]">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.2)_34%,rgba(0,0,0,0.84)_68%,rgba(0,0,0,0.96)_100%)]" />
            <div className="absolute inset-y-0 left-0 w-[56%] bg-[radial-gradient(circle_at_32%_30%,rgba(88,105,142,0.16),transparent_40%)]" />
            <img src="/blog-hero-portrait-dark.jpg" alt="Soom blog hero portrait" className="absolute bottom-0 left-[4%] h-full w-auto max-w-none object-contain object-bottom opacity-92" />

            <div className="relative z-10 flex min-h-[560px] flex-col justify-between px-6 py-8 sm:min-h-[680px] sm:px-8 sm:py-10 lg:min-h-[860px] lg:px-12 lg:py-12 xl:px-16">
              <div>
                <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] tracking-[0.28em] text-white/42 backdrop-blur-sm">SOOM BLOG</div>
              </div>

              <div className="mx-auto max-w-[980px] text-center lg:max-w-[920px] xl:max-w-[980px]">
                <h1 className="text-[3.15rem] font-light leading-[1.02] tracking-[-0.065em] text-white sm:text-[5.1rem] lg:text-[7rem] xl:text-[7.8rem]">
                  교회와 사역을 위한
                  <br />
                  인사이트 아카이브
                </h1>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {topics.map((topic) => (
                    <span key={topic} className="rounded-full border border-white/14 bg-black/12 px-4 py-2 text-sm text-white/82 backdrop-blur-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f4ee] text-[#111111]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
          {posts.length === 0 ? (
            <div className="rounded-[32px] border border-[#e6dfd5] bg-white p-8 shadow-[0_24px_80px_rgba(2,6,23,0.08)] sm:p-10">
              <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">EMPTY</p>
              <h2 className="mt-4 text-[2rem] font-semibold leading-[1.04] tracking-[-0.05em] text-[#111111] sm:text-[3rem]">아직 노출할 글이 없습니다</h2>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              {featured ? (
                <Link href={`/ai-guides/${featured.slug}`} className="group overflow-hidden rounded-[34px] bg-[#111111] shadow-[0_24px_70px_rgba(15,23,42,0.12)] transition hover:-translate-y-1">
                  <div className="relative h-[420px] overflow-hidden sm:h-[520px]">
                    {featured.coverImageUrl ? (
                      <img src={featured.coverImageUrl} alt={featured.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                    ) : (
                      <div className="h-full w-full bg-[linear-gradient(135deg,#2a2a2a_0%,#111111_100%)]" />
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.04)_0%,rgba(17,17,17,0.2)_36%,rgba(17,17,17,0.88)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                      <div className="flex items-center justify-between gap-3 text-[11px] text-white/62">
                        <span>FEATURED</span>
                        {formatDate(featured.publishedAt) ? <span>{formatDate(featured.publishedAt)}</span> : null}
                      </div>
                      <h2 className="mt-3 max-w-3xl text-[2rem] font-semibold leading-[1.06] tracking-[-0.05em] text-white sm:text-[3.3rem]">{featured.title}</h2>
                    </div>
                  </div>
                </Link>
              ) : null}

              <div className="grid gap-5">
                {sidePosts.map((post) => (
                  <Link key={post.id} href={`/ai-guides/${post.slug}`} className="group overflow-hidden rounded-[30px] bg-[#111111] shadow-[0_18px_50px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5">
                    <div className="relative h-[248px] overflow-hidden">
                      {post.coverImageUrl ? (
                        <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                      ) : (
                        <div className="h-full w-full bg-[linear-gradient(135deg,#2a2a2a_0%,#111111_100%)]" />
                      )}
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.03)_0%,rgba(17,17,17,0.18)_34%,rgba(17,17,17,0.88)_100%)]" />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <div className="flex items-center justify-between gap-3 text-[11px] text-white/58">
                          <span>ARTICLE</span>
                          {formatDate(post.publishedAt) ? <span>{formatDate(post.publishedAt)}</span> : null}
                        </div>
                        <h3 className="mt-3 text-[1.45rem] font-semibold leading-[1.1] tracking-[-0.04em] text-white">{post.title}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {gridPosts.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {gridPosts.map((post) => (
                <Link key={post.id} href={`/ai-guides/${post.slug}`} className="group overflow-hidden rounded-[26px] bg-[#111111] shadow-[0_18px_46px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5">
                  <div className="relative h-72 overflow-hidden">
                    {post.coverImageUrl ? (
                      <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                    ) : (
                      <div className="h-full w-full bg-[linear-gradient(135deg,#2a2a2a_0%,#111111_100%)]" />
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.04)_0%,rgba(17,17,17,0.18)_35%,rgba(17,17,17,0.9)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="flex items-center justify-between gap-3 text-[11px] text-white/62">
                        <span>ARTICLE</span>
                        {formatDate(post.publishedAt) ? <span>{formatDate(post.publishedAt)}</span> : null}
                      </div>
                      <h3 className="mt-3 text-[1.55rem] font-semibold leading-[1.12] tracking-[-0.04em] text-white">{post.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
