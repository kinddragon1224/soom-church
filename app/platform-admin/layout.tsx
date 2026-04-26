import Image from "next/image";
import Link from "next/link";
import { requirePlatformAdmin } from "@/lib/platform-admin";

export const dynamic = "force-dynamic";

export default async function PlatformAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePlatformAdmin();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center">
              <Image src="/soom-logo-main.svg" alt="SOOM" width={220} height={60} className="h-8 w-auto" />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="text-lg font-semibold">목장월드 Lab 운영 콘솔</h1>
              <span className="text-xs text-muted-foreground">{user.name}</span>
              <span className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">lab admin only</span>
            </div>
          </div>
          <form action="/api/logout" method="post">
            <button type="submit" className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">로그아웃</button>
          </form>
        </div>
        <nav className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm">
          <Link href="/platform-admin" className="rounded-md border border-border px-2.5 py-1.5 hover:bg-muted">개요</Link>
          <Link href="/platform-admin/churches" className="rounded-md border border-border px-2.5 py-1.5 hover:bg-muted">목장월드</Link>
          <Link href="/platform-admin/users" className="rounded-md border border-border px-2.5 py-1.5 hover:bg-muted">사용자</Link>
          <Link href="/platform-admin/inquiries" className="rounded-md border border-border px-2.5 py-1.5 hover:bg-muted">상담 신청</Link>
          <Link href="/platform-admin/subscriptions" className="rounded-md border border-border px-2.5 py-1.5 hover:bg-muted">플랜</Link>
          <Link href="/platform-admin/provisioning" className="rounded-md border border-border px-2.5 py-1.5 hover:bg-muted">생성</Link>
          <Link href="/blog" className="rounded-md border border-border px-2.5 py-1.5 hover:bg-muted">블로그</Link>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
