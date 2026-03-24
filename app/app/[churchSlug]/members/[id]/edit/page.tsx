import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { WorkspaceMemberForm } from "@/components/members/workspace-member-form";
import { updateWorkspaceMember } from "../../actions";

export default async function EditWorkspaceMemberPage({ params }: { params: { churchSlug: string; id: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) notFound();

  const churchId = membership.church.id;
  const [member, districts, groups, households] = await Promise.all([
    prisma.member.findFirst({ where: { id: params.id, churchId } }),
    prisma.district.findMany({ where: { churchId }, orderBy: { name: "asc" } }),
    prisma.group.findMany({ where: { churchId }, orderBy: { name: "asc" } }),
    prisma.household.findMany({ where: { churchId }, orderBy: { name: "asc" } }),
  ]);
  if (!member) notFound();

  return (
    <div className="space-y-4 text-[#111111]">
      <div>
        <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">EDIT MEMBER</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">교인 수정</h1>
      </div>
      <WorkspaceMemberForm
        member={member}
        action={updateWorkspaceMember.bind(null, params.churchSlug, member.id)}
        districts={districts}
        groups={groups}
        households={households}
      />
    </div>
  );
}
