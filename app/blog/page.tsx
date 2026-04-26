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
  const topics = ["AI 시대 진로", "커리어 전환", "포트폴리오", "기획", "자기 상품화"];

  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <section className="border-b border-white/10 bg-[#05070b]">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="guides" loggedIn={loggedIn} />
        </div>
      </section>

      <section className="overflow-hidden border-b border-white/10 bg-[#05070b]">
        <div className="mx-auto w-full max-w-[1600px] px-0 py-0">
          <div className="relative min-[320px]:min-h-[620px] overflow-hidden bg-[#05070b] sm:min-h-[700px] lg:min-h-[860px]">
            <div className="absolute inset-0 bg-[#05070b]" />
            <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(5,7,11,0.34)_0%,rgba(5,7,11,0.16)_18%,rgba(5,7,11,0.08)_34%,rgba(5,7,11,0.08)_66%,rgba(5,7,11,0.16)_82%,rgba(5,7,11,0.34)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(5,7,11,0)_0%,rgba(5,7,11,0.22)_50%,rgba(5,7,11,0.68)_100%)] sm:h-44" />
            <img src="/blog-hero-person.png" alt="Soom blog hero portrait" className="absolute left-[29%] top-[88px] h-[calc(100%-88px)] w-auto max-w-none -translate-x-1/2 object-contain object-top opacity-100 sm:left-[-1%] sm:top-[108px] sm:h-[calc(100%-108px)] sm:translate-x-0 lg:left-[-2%] lg:top-[118px] lg:h-[calc(100%-118px)]" />

            <div className="relative z-10 flex min-h-[620px] flex-col justify-between px-5 py-6 sm:min-h-[700px] sm:px-8 sm:py-10 lg:min-h-[860px] lg:px-12 lg:py-12 xl:px-16">
              <div />

              <div className="mx-auto flex w-full max-w-[360px] translate-x-0 flex-col items-center justify-end pb-3 text-center select-none cursor-default sm:max-w-[1240px] sm:translate-x-6 sm:items-center sm:pb-0 sm:text-center lg:max-w-[1320px] lg:translate-x-8 xl:max-w-[1380px] xl:translate-x-10">
                <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] tracking-[0.28em] text-white/42 backdrop-blur-sm sm:mb-5">SOOM INSIGHT</div>
                <h1 className="text-[2rem] font-light leading-[1.06] tracking-[-0.058em] text-white sm:text-[4.6rem] lg:text-[6.1rem] xl:text-[6.85rem] drop-shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
                  AI 시대의 진로와
                  <br />
                  일을 다시 설계하는 글
                </h1>
                <div className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-8 sm:gap-3">
                  {topics.map((topic) => (
                    <span key={topic} className="rounded-full border border-white/14 bg-black/12 px-3 py-1.5 text-[12px] text-white/82 backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
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
              <h2 className="mt-4 text-[2rem] font-semibold leading-[1.04] tracking-[-0.05em] text-[#111111] sm:text-[3rem]">아직 노출할 인사이트가 없습니다</h2>
              <p className="mt-4 text-sm leading-7 text-[#5d667d]">AI 시대 진로 설계, 커리어 전환, 포트폴리오 기획에 대한 글을 준비 중입니다.</p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              {featured ? (
                <Link href={`/blog/${featured.slug}`} className="group overflow-hidden rounded-[34px] bg-[#111111] shadow-[0_24px_70px_rgba(15,23,42,0.12)] transition hover:-translate-y-1">
                  <div className="relative h-[420px] overflow-hidden sm:h-[540px]">
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
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-[30px] bg-[#111111] shadow-[0_18px_50px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5">
                    <div className="relative h-[260px] overflow-hidden">
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
                <Link key={post.id} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-[26px] bg-[#111111] shadow-[0_18px_46px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5">
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
