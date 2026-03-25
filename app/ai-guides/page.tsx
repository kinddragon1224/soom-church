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
  const latest = posts.slice(1, 5);
  const archive = posts.slice(5);
  const topics = ["목회", "운영", "AI 활용", "콘텐츠", "전달 구조"];

  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <section className="border-b border-white/10 bg-[#05070b]">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="guides" loggedIn={loggedIn} />
        </div>
      </section>

      <section className="overflow-hidden border-b border-white/10 bg-[linear-gradient(135deg,#050b16_0%,#0a1222_48%,#121a2c_100%)]">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
          <div className="relative min-h-[520px] overflow-hidden rounded-[36px] border border-white/8 bg-[#030508] sm:min-h-[640px] lg:min-h-[760px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_30%,rgba(77,96,137,0.14),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.3)_100%)]" />
            <div className="absolute inset-y-0 left-0 w-[58%] bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.62)_48%,rgba(0,0,0,0.08)_100%)]" />
            <div className="absolute inset-y-0 right-0 w-[44%] bg-[linear-gradient(270deg,rgba(0,0,0,0.36)_0%,rgba(0,0,0,0.02)_100%)]" />

            <img src="/blog-hero-portrait-dark.jpg" alt="Soom blog hero portrait" className="absolute bottom-0 right-[-2%] h-full w-auto max-w-none object-contain object-bottom opacity-92" />

            <div className="relative z-10 flex min-h-[520px] flex-col justify-between p-6 sm:min-h-[640px] sm:p-8 lg:min-h-[760px] lg:p-10">
              <div>
                <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] tracking-[0.28em] text-white/42 backdrop-blur-sm">SOOM BLOG</div>
              </div>

              <div className="max-w-[980px]">
                <h1 className="text-[3.3rem] font-light leading-[0.92] tracking-[-0.08em] text-white sm:text-[5.4rem] lg:text-[7.8rem] xl:text-[8.8rem]">
                  교회와 사역을 위한
                  <br />
                  인사이트 아카이브
                </h1>
                <div className="mt-8 flex flex-wrap gap-3">
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
              <p className="mt-5 text-sm leading-7 text-[#5f564b] sm:text-base">노션에서 글을 발행하면 이 공간이 브랜드형 아카이브로 채워집니다.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
                {featured ? (
                  <Link href={`/ai-guides/${featured.slug}`} className="group overflow-hidden rounded-[34px] border border-[#e4dacc] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] transition hover:-translate-y-1">
                    <div className="relative h-[360px] overflow-hidden sm:h-[460px]">
                      {featured.coverImageUrl ? (
                        <img src={featured.coverImageUrl} alt={featured.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                      ) : (
                        <div className="h-full w-full bg-[linear-gradient(135deg,#e8e0d4_0%,#f7f4ee_100%)]" />
                      )}
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.02)_0%,rgba(17,17,17,0.18)_36%,rgba(17,17,17,0.78)_100%)]" />
                      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/82">
                          <span className="rounded-full border border-[#d9b765]/50 bg-[#c9a34b]/22 px-2.5 py-1 text-[#f5e6b5]">FEATURED</span>
                          {formatDate(featured.publishedAt) ? <span>{formatDate(featured.publishedAt)}</span> : null}
                        </div>
                        <h2 className="mt-4 max-w-3xl text-[2rem] font-semibold leading-[1.02] tracking-[-0.06em] text-white sm:text-[3.4rem]">{featured.title}</h2>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
                          {featured.excerpt ?? "대표 글로 먼저 읽어볼 수 있는 인사이트입니다."}
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : null}

                <div className="rounded-[30px] border border-[#e4dacc] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                  <p className="text-[11px] tracking-[0.24em] text-[#9a8b7a]">LATEST</p>
                  <div className="mt-5 grid gap-4">
                    {latest.map((post) => (
                      <Link key={post.id} href={`/ai-guides/${post.slug}`} className="group rounded-[22px] border border-[#ece3d7] bg-[#fcfbf8] p-4 transition hover:border-[#d5b36a] hover:bg-white">
                        <div className="flex items-center justify-between gap-3 text-[11px] text-[#8c7a5b]">
                          <span>ARTICLE</span>
                          {formatDate(post.publishedAt) ? <span>{formatDate(post.publishedAt)}</span> : null}
                        </div>
                        <h3 className="mt-3 text-[1.18rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[#111111]">{post.title}</h3>
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#5f564b]">{post.excerpt ?? "노션에서 작성한 본문이 연결된 글입니다."}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {archive.length > 0 ? (
                <div className="mt-14 border-t border-[#e8dece] pt-12">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[11px] tracking-[0.24em] text-[#9a8b7a]">ARCHIVE</p>
                      <h2 className="mt-3 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">이전 글</h2>
                    </div>
                    <p className="max-w-xl text-sm leading-7 text-[#6d6254]">위쪽은 공지형 최신 섹션으로 두고, 아래는 이전 버전처럼 계속 쌓이는 아카이브 흐름으로 분리한다.</p>
                  </div>

                  <div className="mt-8 grid gap-4">
                    {archive.map((post, index) => (
                      <Link key={post.id} href={`/ai-guides/${post.slug}`} className="group rounded-[24px] border border-[#e7ddd0] bg-white px-5 py-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-[#d5b36a]">
                        <div className="grid gap-4 md:grid-cols-[90px_minmax(0,1fr)_120px] md:items-start">
                          <div>
                            <p className="text-[11px] tracking-[0.18em] text-[#b09a72]">NO.</p>
                            <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#8C6A2E]">{String(index + 1).padStart(2, "0")}</p>
                          </div>
                          <div>
                            <p className="text-[11px] tracking-[0.18em] text-[#b09a72]">ARTICLE</p>
                            <h3 className="mt-3 text-[1.35rem] font-semibold leading-[1.14] tracking-[-0.04em] text-[#111111]">{post.title}</h3>
                            <p className="mt-3 line-clamp-2 text-sm leading-7 text-[#5f564b]">{post.excerpt ?? "노션에서 작성한 본문이 연결된 글입니다."}</p>
                          </div>
                          <div className="md:text-right">
                            {formatDate(post.publishedAt) ? <p className="text-[11px] tracking-[0.18em] text-[#8c7a5b]">{formatDate(post.publishedAt)}</p> : null}
                            <p className="mt-3 text-sm text-[#8C6A2E]">읽으러 가기</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
