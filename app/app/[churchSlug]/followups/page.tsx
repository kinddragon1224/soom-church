import Link from "next/link";
import GidoFollowupsPage from "./gido-followups-page";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getGidoWorkspaceData } from "@/lib/gido-workspace-data";
import { getWorkspaceMembers } from "@/lib/workspace-data";

export default async function ChurchFollowupsPage({
  params,
  searchParams,
}: {
  params: { churchSlug: string };
  searchParams?: { q?: string; scope?: string };
}) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  const church = membership.church;

  if (church.slug === "gido") {
    const [members, data] = await Promise.all([
      getWorkspaceMembers(church.id),
      getGidoWorkspaceData(church.id),
    ]);

    return (
      <GidoFollowupsPage
        churchSlug={church.slug}
        members={members}
        followUps={data.followUps}
        updates={data.updates}
        q={searchParams?.q}
        scope={searchParams?.scope}
      />
    );
  }

  const members = await getWorkspaceMembers(church.id, { followUpOnly: true });

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">FOLLOW-UP</p>
        <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">후속 관리</h1>
        <p className="mt-2 text-sm text-[#5f564b]">후속이 필요한 사람을 모아서 보고 상세 화면으로 들어가.</p>
      </section>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="border-b border-[#efe7da] px-5 py-4">
          <p className="text-sm font-semibold text-[#111111]">후속 필요 인원</p>
          <p className="mt-1 text-xs text-[#8C7A5B]">{members.length}명</p>
        </div>

        {members.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-base font-semibold text-[#111111]">후속이 필요한 사람이 없어</p>
          </div>
        ) : (
          <div className="grid gap-3 p-5">
            {members.map((member) => (
              <Link key={member.id} href={`/app/${church.slug}/members/${member.id}`} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{member.name}</p>
                    <p className="mt-1 text-xs text-[#8c7a5b]">{member.group?.name ?? "미정"}</p>
                  </div>
                  <span className="rounded-full bg-[#fff4df] px-2.5 py-1 text-[11px] text-[#8C6A2E]">후속 필요</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
