import Link from "next/link";
import GidoUpdatesPage from "./gido-updates-page";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getGidoWorkspaceData } from "@/lib/gido-workspace-data";
import { getWorkspaceMembers } from "@/lib/workspace-data";

export default async function ChurchUpdatesPage({
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
      <GidoUpdatesPage
        churchSlug={church.slug}
        updates={data.updates}
        followUps={data.followUps}
        members={members}
        q={searchParams?.q}
        scope={searchParams?.scope}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">UPDATES</p>
        <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">근황 기록</h1>
        <p className="mt-2 text-sm text-[#5f564b]">교회별 근황 기록 전용 화면은 준비 중이야.</p>
      </section>

      <Link href={`/app/${church.slug}/records`} className="text-sm text-[#8C6A2E] underline underline-offset-4">
        지금은 기록 화면으로 이동
      </Link>
    </div>
  );
}
