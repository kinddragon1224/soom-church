import Link from "next/link";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getWorkspaceDashboardData } from "@/lib/workspace-data";
import { WorkspaceShell } from "./workspace-shell";

export const dynamic = "force-dynamic";
export const preferredRegion = "sin1";

export default async function ChurchWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { churchSlug: string };
}) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);

  if (!membership) {
    return (
      <div className="min-h-screen bg-[#EDE6D8] p-4 sm:p-6">
        <div className="mx-auto w-full max-w-2xl rounded-[28px] border border-[#DDD1BE] bg-[#FBF9F4] p-6 text-[#121212] shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <h1 className="text-xl font-semibold">이 워크스페이스에 접근할 권한이 없어</h1>
          <p className="mt-2 text-sm text-[#5F564B]">다른 워크스페이스를 선택하거나 관리자에게 문의해줘.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link href="/app" className="rounded-[12px] bg-[#0F172A] px-4 py-2 text-white">워크스페이스 선택</Link>
            <Link href="/signup" className="rounded-[12px] border border-[#DDD1BE] px-4 py-2 text-[#121212]">회원가입</Link>
          </div>
        </div>
      </div>
    );
  }

  const summary = await getWorkspaceDashboardData(membership.church.id);

  return (
    <WorkspaceShell
      church={membership.church}
      role={membership.role}
      summary={{
        followUpMembers: summary.followUpMembers,
        pendingApplications: summary.pendingApplications,
        unassignedMembers: summary.unassignedMembers,
      }}
    >
      {children}
    </WorkspaceShell>
  );
}
