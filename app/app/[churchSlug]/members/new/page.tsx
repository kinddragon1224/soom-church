import { notFound } from "next/navigation";
import { WorkspaceMemberForm } from "@/components/members/workspace-member-form";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { prisma } from "@/lib/prisma";
import { createWorkspaceMember } from "../actions";

export default async function NewWorkspaceMemberPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) notFound();

  const churchId = membership.church.id;
  const [districts, groups, households] = await Promise.all([
    prisma.district.findMany({ where: { churchId }, orderBy: { name: "asc" } }),
    prisma.group.findMany({ where: { churchId }, orderBy: { name: "asc" } }),
    prisma.household.findMany({ where: { churchId }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-4 text-[#111111]">
      <div>
        <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">NEW MEMBER</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">상세 등록</h1>
        <p className="mt-2 text-sm text-[#5f564b]">간단 등록은 목원 관리 화면에서 바로 할 수 있어.</p>
      </div>
      <WorkspaceMemberForm
        action={createWorkspaceMember.bind(null, params.churchSlug)}
        districts={districts}
        groups={groups}
        households={households}
      />
    </div>
  );
}
