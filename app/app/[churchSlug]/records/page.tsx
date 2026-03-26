import Link from "next/link";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { formatDate } from "@/lib/date";
import { getChurchBlogPosts } from "@/lib/blog-data";

export default async function ChurchBlogPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  const church = membership.church;
  const posts = await getChurchBlogPosts(church.id);
  const visitRecords = posts.filter((post) => post.title.includes("심방") || (post.excerpt ?? "").includes("심방"));
  const ministryRecords = posts.filter((post) => post.title.includes("사역") || (post.excerpt ?? "").includes("사역"));

  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <p className="text-[11px] tracking-[0.2em] text-white/46">RECORD HUB</p>
          <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white">심방기록과 사역기록을 남기는 공간</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">사람별 메모, 사역 진행 기록, 운영 중 남겨야 할 내용을 한곳에서 정리하는 기록 화면으로 먼저 사용한다.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4"><p className="text-[11px] tracking-[0.16em] text-white/48">전체 기록</p><p className="mt-2 text-2xl font-semibold">{posts.length}</p></div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4"><p className="text-[11px] tracking-[0.16em] text-white/48">심방기록</p><p className="mt-2 text-2xl font-semibold">{visitRecords.length}</p></div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4"><p className="text-[11px] tracking-[0.16em] text-white/48">사역기록</p><p className="mt-2 text-2xl font-semibold">{ministryRecords.length}</p></div>
          </div>
        </div>
        <section className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">ACTIONS</p>
          <h2 className="mt-2 text-xl font-semibold text-[#111111]">기록 원칙</h2>
          <div className="mt-4 grid gap-3">
            <div className="rounded-[18px] border border-[#ece6dc] bg-white p-4 text-sm text-[#111111]">사람 흐름과 연결되는 메모를 남긴다</div>
            <div className="rounded-[18px] border border-[#ece6dc] bg-white p-4 text-sm text-[#111111]">심방, 상담, 후속 연락 맥락을 복구 가능하게 적는다</div>
            <div className="rounded-[18px] border border-[#ece6dc] bg-white p-4 text-sm text-[#111111]">추후 전용 기록 엔티티로 분리할 예정이고 지금은 기록 허브로 사용한다</div>
          </div>
        </section>
      </section>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-3 border-b border-[#efe7da] pb-4">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">RECORD LIST</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">최근 기록</h2>
          </div>
          <span className="text-xs text-[#8C7A5B]">최신순 정렬</span>
        </div>
        <div className="mt-4 grid gap-3">
          {posts.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">아직 기록이 없어. 심방 메모나 사역 메모가 쌓이기 시작하면 여기에 보이게 하면 돼.</div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{post.title}</p>
                    <p className="mt-2 text-sm text-[#5f564b]">{post.excerpt ?? "기록 요약 없음"}</p>
                    <p className="mt-2 text-xs text-[#8C7A5B]">작성자 · {post.author.name}</p>
                  </div>
                  <div className="text-right text-xs text-[#8C7A5B]">
                    <p>{post.status}</p>
                    <p className="mt-1">{formatDate(post.publishedAt ?? post.updatedAt)}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/app/${church.slug}/records/${post.id}/edit`} className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-xs font-medium text-[#121212]">기록 수정</Link>
                  <Link href={`/app/${church.slug}/records/${post.id}/preview`} className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-xs font-medium text-[#121212]">내용 보기</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
