import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { WorkspaceMemberForm } from "@/components/members/workspace-member-form";

export default async function EditWorkspaceMemberPage({ params }: { params: { churchSlug: string; id: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) notFound();

  const member = await prisma.member.findFirst({ where: { id: params.id, churchId: membership.church.id } });
  if (!member) notFound();

  return (
    <div className="space-y-4 text-[#111111]">
      <div>
        <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">EDIT MEMBER</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">교인 수정</h1>
      </div>
      <WorkspaceMemberForm churchSlug={params.churchSlug} member={member} />
    </div>
  );
}
