import Link from "next/link";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { formatDate } from "@/lib/date";
import { getChurchBlogPosts } from "@/lib/blog-data";

export default async function ChurchBlogPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  const church = membership.church;
  const posts = await getChurchBlogPosts(church.id);

  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <p className="text-[11px] tracking-[0.2em] text-white/46">BLOG STUDIO</p>
          <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white">블로그 글을 작성하고 발행합니다</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">워크스페이스 안에서 초안, 발행, 보관 상태를 관리하는 블로그 작성 1차 화면입니다.</p>
        </div>
        <section className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">ACTIONS</p>
          <h2 className="mt-2 text-xl font-semibold text-[#111111]">바로 작업</h2>
          <div className="mt-4 grid gap-3">
            <Link href={`/app/${church.slug}/blog/new`} className="rounded-[14px] bg-[#0F172A] px-4 py-3 text-sm font-semibold text-white">새 글 작성</Link>
            <div className="rounded-[18px] border border-[#ece6dc] bg-white p-4 text-sm text-[#111111]">전체 글 {posts.length}개</div>
          </div>
        </section>
      </section>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-3 border-b border-[#efe7da] pb-4">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">POST LIST</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">글 목록</h2>
          </div>
          <span className="text-xs text-[#8C7A5B]">draft / published / archived</span>
        </div>
        <div className="mt-4 grid gap-3">
          {posts.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">아직 작성된 글이 없습니다. 첫 글을 작성해보세요.</div>
          ) : (
            posts.map((post) => (
              <Link key={post.id} href={`/app/${church.slug}/blog/${post.id}/edit`} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 transition hover:bg-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{post.title}</p>
                    <p className="mt-2 text-sm text-[#5f564b]">{post.excerpt ?? "요약문 없음"}</p>
                  </div>
                  <div className="text-right text-xs text-[#8C7A5B]">
                    <p>{post.status}</p>
                    <p className="mt-1">{formatDate(post.publishedAt ?? post.updatedAt)}</p>
                    <p className="mt-1">{post.author.name}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
