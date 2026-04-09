import Link from "next/link";
import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { buildGidoRecoveryQueries } from "@/lib/gido-chat-first";
import { getGidoWorkspaceData } from "@/lib/gido-workspace-data";

export default async function ChurchSearchPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  if (membership.church.slug !== "gido") {
    redirect(`/app/${membership.church.slug}/dashboard`);
  }

  const base = `/app/${membership.church.slug}`;
  const data = await getGidoWorkspaceData(membership.church.id);
  const queries = buildGidoRecoveryQueries(data);
  const followUpMembers = data.members.filter((member) => member.requiresFollowUp).slice(0, 6);
  const relationshipGaps = data.households.filter((household) => household.members.length > 1 && household.relationships.length === 0).slice(0, 6);

  return (
    <div className="flex flex-col gap-5 text-[#171717]">
      <header className="rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">SEARCH / RECOVER</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">빠른 복구</h1>
            <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#5f564b]">
              나중에는 자연어 검색으로 바로 복구하게 만들 거고, 지금은 자주 찾을 질문과 복구 포인트부터 모아둔다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={`${base}/chat`} className="rounded-[12px] border border-[#e7dfd3] bg-[#faf7f2] px-3 py-2 text-sm text-[#3f372d]">Chat</Link>
            <Link href={`${base}/people`} className="rounded-[12px] border border-[#111827] bg-[#111827] px-3 py-2 text-sm text-white">People</Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
          <p className="text-[10px] tracking-[0.16em] text-[#95897b]">QUERY STARTERS</p>
          <h2 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-[#111111]">바로 물을 질문</h2>
          <div className="mt-5 grid gap-3">
            {queries.map((item) => (
              <div key={item.label} className="rounded-[20px] border border-[#efe7da] bg-[#fcfbf8] p-4">
                <p className="text-sm font-semibold text-[#111111]">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.query}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[26px] border border-[#ece4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:p-6">
          <p className="text-[10px] tracking-[0.16em] text-[#95897b]">RECOVER TARGETS</p>
          <h2 className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-[#111111]">지금 비어 있는 곳</h2>

          <div className="mt-5 grid gap-4">
            <div>
              <p className="text-sm font-semibold text-[#111111]">후속 필요한 사람</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {followUpMembers.length === 0 ? (
                  <span className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-3 py-1.5 text-[12px] text-[#6f6256]">현재 없음</span>
                ) : (
                  followUpMembers.map((member) => (
                    <Link key={member.id} href={`${base}/members/${member.id}`} className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-3 py-1.5 text-[12px] text-[#3f372d]">
                      {member.name}
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#111111]">관계 확인 필요한 가정</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {relationshipGaps.length === 0 ? (
                  <span className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-3 py-1.5 text-[12px] text-[#6f6256]">현재 없음</span>
                ) : (
                  relationshipGaps.map((household) => (
                    <Link key={household.id} href={`${base}/households?focus=${household.id}`} className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-3 py-1.5 text-[12px] text-[#3f372d]">
                      {household.title}
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
