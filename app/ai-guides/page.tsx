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
  const secondary = posts.slice(1, 3);
  const latest = posts.slice(3);
  const topics = ["목회", "운영", "AI 활용", "콘텐츠", "전달 구조"];

  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <section className="border-b border-white/10 bg-[#05070b]">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="guides" loggedIn={loggedIn} />
        </div>
      </section>

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,#1f2a44_0%,#0b1018_42%,#05070b_100%)]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-[11px] tracking-[0.28em] text-white/42">SOOM BLOG</p>
              <h1 className="mt-5 text-[2.8rem] font-semibold leading-[0.94] tracking-[-0.08em] text-white sm:text-[4.8rem]">
                교회와 사역을 위한
                <br />
                인사이트 아카이브
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/66 sm:text-base">
                목회, 운영, AI 활용, 콘텐츠 제작까지. 현장에서 바로 참고할 수 있는 글을 브랜드형 블로그로 쌓아간다.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <span key={topic} className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs text-white/78">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_80px_rgba(2,6,23,0.32)]">
                <p className="text-[11px] tracking-[0.18em] text-white/40">POSTS</p>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">{posts.length}</p>
                <p className="mt-2 text-sm text-white/58">노션에서 연결된 공개 글</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_80px_rgba(2,6,23,0.32)]">
                <p className="text-[11px] tracking-[0.18em] text-white/40">FORMAT</p>
                <p className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">Brand Blog</p>
                <p className="mt-2 text-sm text-white/58">게시판보다 신뢰 자산에 가까운 구성</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_80px_rgba(2,6,23,0.32)]">
                <p className="text-[11px] tracking-[0.18em] text-white/40">SOURCE</p>
                <p className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">Notion CMS</p>
                <p className="mt-2 text-sm text-white/58">작성은 노션, 공개는 soom</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#05070b]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
          {posts.length === 0 ? (
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_80px_rgba(2,6,23,0.32)] sm:p-10">
              <p className="text-xs tracking-[0.24em] text-white/42">EMPTY</p>
              <h2 className="mt-4 text-[2rem] font-semibold leading-[1.04] tracking-[-0.05em] text-white sm:text-[3rem]">아직 노출할 글이 없습니다</h2>
              <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base">노션에서 글을 발행하면 이 공간이 브랜드형 아카이브로 채워집니다.</p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
              {featured ? (
                <Link href={`/ai-guides/${featured.slug}`} className="group overflow-hidden rounded-[34px] border border-white/10 bg-[#0b1018] shadow-[0_28px_90px_rgba(2,6,23,0.45)] transition hover:-translate-y-1">
                  <div className="relative h-[360px] overflow-hidden sm:h-[460px]">
                    {featured.coverImageUrl ? (
                      <img src={featured.coverImageUrl} alt={featured.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                    ) : (
                      <div className="h-full w-full bg-[linear-gradient(135deg,#17233d_0%,#243252_50%,#3b4f74_100%)]" />
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,12,0.04)_0%,rgba(6,8,12,0.3)_36%,rgba(6,8,12,0.92)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/70">
                        <span className="rounded-full border border-white/12 bg-white/10 px-2.5 py-1">FEATURED</span>
                        {formatDate(featured.publishedAt) ? <span>{formatDate(featured.publishedAt)}</span> : null}
                      </div>
                      <h2 className="mt-4 max-w-3xl text-[2rem] font-semibold leading-[1.02] tracking-[-0.06em] text-white sm:text-[3.6rem]">{featured.title}</h2>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
                        {featured.excerpt ?? "대표 글로 먼저 읽어볼 수 있는 인사이트입니다."}
                      </p>
                    </div>
                  </div>
                </Link>
              ) : null}

              <div className="grid gap-5">
                {secondary.map((post) => (
                  <Link key={post.id} href={`/ai-guides/${post.slug}`} className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#0b1018] shadow-[0_24px_80px_rgba(2,6,23,0.34)] transition hover:-translate-y-1">
                    <div className="relative h-56 overflow-hidden">
                      {post.coverImageUrl ? (
                        <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                      ) : (
                        <div className="h-full w-full bg-[linear-gradient(135deg,#10192d_0%,#243252_100%)]" />
                      )}
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,12,0.02)_0%,rgba(6,8,12,0.2)_34%,rgba(6,8,12,0.9)_100%)]" />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        {formatDate(post.publishedAt) ? <p className="text-[11px] tracking-[0.18em] text-white/54">{formatDate(post.publishedAt)}</p> : null}
                        <h3 className="mt-2 text-[1.45rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white">{post.title}</h3>
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/68">{post.excerpt ?? "노션에서 연결된 글입니다."}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {latest.length > 0 ? (
        <section className="border-t border-white/8 bg-[#0a0d13]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] tracking-[0.24em] text-white/40">LATEST</p>
                <h2 className="mt-3 text-[2rem] font-semibold tracking-[-0.05em] text-white">최신 글</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-white/56">게시판처럼 나열하지 않고, 대표 글 이후에 이어 읽을 수 있는 카드형 흐름으로 정리했다.</p>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {latest.map((post) => (
                <Link key={post.id} href={`/ai-guides/${post.slug}`} className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#0d121b] shadow-[0_18px_50px_rgba(2,6,23,0.26)] transition hover:-translate-y-1">
                  <div className="h-52 overflow-hidden">
                    {post.coverImageUrl ? (
                      <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                    ) : (
                      <div className="h-full w-full bg-[linear-gradient(135deg,#17233d_0%,#2f4367_100%)]" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3 text-[11px] text-white/42">
                      <span>ARTICLE</span>
                      {formatDate(post.publishedAt) ? <span>{formatDate(post.publishedAt)}</span> : null}
                    </div>
                    <h3 className="mt-3 text-[1.45rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white">{post.title}</h3>
                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/62">{post.excerpt ?? "노션에서 작성한 본문이 연결된 글입니다."}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
