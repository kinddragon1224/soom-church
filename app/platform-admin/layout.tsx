import Image from "next/image";
import Link from "next/link";
import { requirePlatformAdmin } from "@/lib/platform-admin";

export default async function PlatformAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePlatformAdmin();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="inline-flex items-center">
          <Image src="/soom-logo-main.png" alt="SOOM" width={110} height={30} className="h-6 w-auto" />
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-semibold">숨 플랫폼 운영 콘솔</h1>
          <span className="text-xs text-muted-foreground">{user.name}</span>
        </div>
        <nav className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm">
          <Link href="/" className="rounded-md border border-border px-2.5 py-1.5 hover:bg-muted">홈</Link>
          <Link href="/app" className="rounded-md border border-border px-2.5 py-1.5 hover:bg-muted">워크스페이스</Link>
          <Link href="/platform-admin" className="rounded-md border border-border px-2.5 py-1.5 hover:bg-muted">개요</Link>
          <Link href="/platform-admin/churches" className="rounded-md border border-border px-2.5 py-1.5 hover:bg-muted">교회 목록</Link>
          <Link href="/platform-admin/users" className="rounded-md border border-border px-2.5 py-1.5 hover:bg-muted">사용자</Link>
          <Link href="/platform-admin/subscriptions" className="rounded-md border border-border px-2.5 py-1.5 hover:bg-muted">구독</Link>
          <Link href="/platform-admin/provisioning" className="rounded-md border border-border px-2.5 py-1.5 hover:bg-muted">워크스페이스 생성</Link>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
