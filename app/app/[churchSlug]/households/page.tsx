import Link from "next/link";
import GidoHouseholdsPage from "./gido-households-page";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getAppliedRecordLog } from "@/lib/chat-apply-log";
import { getGidoWorkspaceData } from "@/lib/gido-workspace-data";
import { getWorkspaceMembers } from "@/lib/workspace-data";

export default async function ChurchHouseholdsPage({
  params,
  searchParams,
}: {
  params: { churchSlug: string };
  searchParams?: { focus?: string };
}) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  const church = membership.church;

  if (church.slug === "gido") {
    const [data, logs] = await Promise.all([
      getGidoWorkspaceData(church.id),
      getAppliedRecordLog(church.id, 80),
    ]);

    return <GidoHouseholdsPage churchSlug={church.slug} households={data.households} logs={logs} focusId={searchParams?.focus} />;
  }

  const members = await getWorkspaceMembers(church.id);
  const households = Array.from(
    new Map(
      members
        .filter((member) => member.household?.name)
        .map((member) => [member.household!.name, { name: member.household!.name, members: [] as string[] }]),
    ).values(),
  );

  members.forEach((member) => {
    if (!member.household?.name) return;
    const target = households.find((household) => household.name === member.household?.name);
    if (target) target.members.push(member.name);
  });

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">HOUSEHOLDS</p>
        <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">가정</h1>
        <p className="mt-2 text-sm text-[#5f564b]">등록된 가정과 구성원을 확인할 수 있어.</p>
      </section>

      <section className="grid gap-3">
        {households.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">등록된 가정이 아직 없어.</div>
        ) : (
          households.map((household) => (
            <div key={household.name} className="rounded-[18px] border border-[#ede6d8] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#111111]">{household.name}</p>
                <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">{household.members.length}명</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {household.members.map((member) => (
                  <span key={`${household.name}-${member}`} className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#5f564b]">
                    {member}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <Link href={`/app/${church.slug}/members`} className="text-sm text-[#8C6A2E] underline underline-offset-4">
        목원 보기로 돌아가기
      </Link>
    </div>
  );
}
