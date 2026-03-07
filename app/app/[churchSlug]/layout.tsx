import Link from "next/link";
import { requireWorkspaceMembership } from "@/lib/church-context";

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
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="mx-auto w-full max-w-2xl rounded-xl border border-border bg-card p-5">
          <h1 className="text-xl font-semibold">이 워크스페이스에 접근할 권한이 없습니다</h1>
          <p className="mt-2 text-sm text-muted-foreground">다른 교회를 선택하거나 관리자에게 문의하세요.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link href="/app" className="rounded-md bg-primary px-3 py-2 text-white">워크스페이스 선택</Link>
            <Link href="/signup" className="rounded-md border border-border px-3 py-2">온보딩 안내</Link>
          </div>
        </div>
      </div>
    );
  }

  const church = membership.church;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-3 sm:px-6">
        <p className="text-xs text-muted-foreground">WORKSPACE</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-semibold">{church.name}</h1>
          <nav className="flex flex-wrap gap-2 text-xs sm:text-sm">
            <Link href={`/app/${church.slug}/dashboard`} className="text-primary hover:underline">대시보드</Link>
            <Link href={`/app/${church.slug}/members`} className="text-primary hover:underline">교인</Link>
            <Link href={`/app/${church.slug}/applications`} className="text-primary hover:underline">신청</Link>
            <Link href={`/app/${church.slug}/notices`} className="text-primary hover:underline">공지</Link>
          </nav>
        </div>
      </header>
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
