import Link from "next/link";
import { getChurchBySlug } from "@/lib/church-context";

export default async function ChurchWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { churchSlug: string };
}) {
  const church = await getChurchBySlug(params.churchSlug);

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
