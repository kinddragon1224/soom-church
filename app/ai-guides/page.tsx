import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { isLoggedIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const revalidate = 20;

export default async function GuidesPage() {
  const loggedIn = await isLoggedIn();
  const posts = await prisma.guidePost.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: { id: true, title: true, slug: true, excerpt: true, coverImageUrl: true, publishedAt: true },
  });

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#0c1220]">
      <section className="border-b border-[#e6dfd5] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader current="guides" loggedIn={loggedIn} />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <p className="text-xs tracking-[0.24em] text-[#7a6f67]">BLOG</p>
          <h1 className="mt-5 font-display text-[2.6rem] leading-[1.05] tracking-[-0.06em] sm:text-[4.4rem]">
            목회자와 사역자를 위한
            <br />
            블로그
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-[#5d667d] sm:text-base">
            설교 준비, 행정, 공지, 콘텐츠, 반복 업무 정리에 바로 적용할 수 있는 실전형 글을 정리하는 공간입니다.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
          {posts.length === 0 ? (
            <div className="rounded-[32px] border border-[#e6dfd5] bg-white p-8 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-10">
              <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">EMPTY</p>
              <h2 className="mt-4 font-display text-[2rem] leading-[1.08] tracking-[-0.05em] sm:text-[3rem]">아직 공개된 블로그 글이 없습니다</h2>
              <p className="mt-5 text-sm leading-7 text-[#5d667d] sm:text-base">관리자 화면에서 글을 발행하면 이곳에 바로 노출됩니다.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/ai-guides/${post.slug}`} className="overflow-hidden rounded-[28px] border border-[#e6dfd5] bg-white shadow-[0_16px_40px_rgba(16,24,40,0.05)] transition hover:-translate-y-0.5">
                  {post.coverImageUrl ? <img src={post.coverImageUrl} alt={post.title} className="h-52 w-full object-cover" /> : <div className="h-52 bg-[linear-gradient(135deg,#10192d_0%,#243252_100%)]" />}
                  <div className="p-6">
                    <p className="text-xs tracking-[0.2em] text-[#9a8b7a]">BLOG POST</p>
                    <h2 className="mt-3 text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.04em] text-[#111111]">{post.title}</h2>
                    <p className="mt-4 text-sm leading-7 text-[#5d667d]">{post.excerpt ?? "요약문이 없습니다."}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
