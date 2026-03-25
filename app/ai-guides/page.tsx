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
  const latest = posts.slice(1);
  const topics = ["목회", "운영", "AI 활용", "콘텐츠", "전달 구조"];

  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <section className="border-b border-white/10 bg-[#05070b]">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="guides" loggedIn={loggedIn} />
        </div>
      </section>

      <section className="overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,#161f33_0%,#0b1018_40%,#05070b_100%)]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
          <div className="grid items-center gap-4 lg:grid-cols-[0.78fr_1.22fr] lg:gap-0">
            <div className="relative min-h-[420px] sm:min-h-[560px] lg:min-h-[700px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgba(137,168,255,0.12),transparent_34%),radial-gradient(circle_at_72%_68%,rgba(214,169,255,0.08),transparent_28%)]" />
              <div className="absolute inset-y-0 left-[-8%] right-[8%] bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_100%)] blur-3xl" />
              <img src="/blog-hero-person.png" alt="Soom blog hero person" className="absolute bottom-0 left-0 h-full w-auto max-w-none object-contain object-bottom" />
            </div>

            <div className="relative z-10 lg:-ml-10 xl:-ml-16">
              <p className="text-[11px] tracking-[0.28em] text-white/42">SOOM BLOG</p>
              <h1 className="mt-6 text-[2.8rem] font-semibold leading-[1.06] tracking-[-0.08em] text-white sm:mt-7 sm:text-[4.8rem] xl:text-[5.6rem]">
                교회와 사역을 위한
                <br />
                인사이트 아카이브
              </h1>
              <div className="mt-8 flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <span key={topic} className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-xs text-white/78 backdrop-blur-sm">
                    {topic}
                  </span>
                ))}
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
            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
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

              <div className="rounded-[30px] border border-white/10 bg-[#0b1018] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.34)]">
                <p className="text-[11px] tracking-[0.24em] text-white/40">LATEST</p>
                <div className="mt-5 grid gap-4">
                  {latest.slice(0, 4).map((post) => (
                    <Link key={post.id} href={`/ai-guides/${post.slug}`} className="group rounded-[22px] border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/18 hover:bg-white/[0.05]">
                      <div className="flex items-center justify-between gap-3 text-[11px] text-white/42">
                        <span>ARTICLE</span>
                        {formatDate(post.publishedAt) ? <span>{formatDate(post.publishedAt)}</span> : null}
                      </div>
                      <h3 className="mt-3 text-[1.18rem] font-semibold leading-[1.12] tracking-[-0.03em] text-white">{post.title}</h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/58">{post.excerpt ?? "노션에서 작성한 본문이 연결된 글입니다."}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
