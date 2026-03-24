import { WorkspaceMemberForm } from "@/components/members/workspace-member-form";

export default function NewWorkspaceMemberPage({ params }: { params: { churchSlug: string } }) {
  return (
    <div className="space-y-4 text-[#111111]">
      <div>
        <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">NEW MEMBER</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">교인 등록</h1>
      </div>
      <WorkspaceMemberForm churchSlug={params.churchSlug} />
    </div>
  );
}
