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
          <p className="mt-2 text-sm text-muted-foreground">다른 워크스페이스를 선택하거나 관리자에게 문의하세요.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link href="/app" className="rounded-md bg-primary px-3 py-2 text-primary-foreground">워크스페이스 선택</Link>
            <Link href="/signup" className="rounded-md border border-border px-3 py-2">온보딩 안내</Link>
          </div>
        </div>
      </div>
    );
  }

  const church = membership.church;
  const base = `/app/${church.slug}`;

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-border bg-card p-4 lg:block">
        <WorkspaceSidebar base={base} churchName={church.name} />
      </aside>

      <div className="min-w-0">
        <header className="border-b border-border bg-card px-4 py-3 sm:px-6">
          <p className="text-xs text-muted-foreground">SOOM PLATFORM</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <h1 className="text-lg font-semibold">{church.name}</h1>
            <div className="flex items-center gap-3 text-xs">
              <Link href="/" className="text-primary hover:underline">홈</Link>
              <Link href="/app" className="text-primary hover:underline">워크스페이스 변경</Link>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">숨 / {church.name} 워크스페이스</p>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 text-xs lg:hidden">
            <MobileTab href={`${base}/dashboard`} label="운영 현황" />
            <MobileTab href={`${base}/members`} label="교인" />
            <MobileTab href={`${base}/applications`} label="신청" />
            <MobileTab href={`${base}/notices`} label="공지" />
            <MobileTab href={`${base}/settings`} label="설정" />
          </nav>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

function WorkspaceSidebar({ base, churchName }: { base: string; churchName: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">SOOM PLATFORM</p>
      <h2 className="mt-1 text-lg font-semibold">{churchName}</h2>
      <p className="text-xs text-muted-foreground">교회 워크스페이스</p>

      <div className="mt-5 space-y-4 text-sm">
        <SidebarGroup title="대시보드" items={[{ href: `${base}/dashboard`, label: "운영 현황" }]} />
        <SidebarGroup title="교회 관리" items={[{ href: `${base}/members`, label: "교인" }, { href: `${base}/members`, label: "교구/목장" }]} />
        <SidebarGroup title="운영" items={[{ href: `${base}/applications`, label: "신청" }, { href: `${base}/notices`, label: "공지" }, { href: `${base}/dashboard`, label: "활동 로그" }]} />
        <SidebarGroup title="확장 서비스" items={[{ label: "숨 기록", disabled: true, badge: "준비 중" }, { label: "숨 모임", disabled: true, badge: "곧 연결" }]} />
        <SidebarGroup title="설정" items={[{ href: `${base}/settings`, label: "워크스페이스 설정" }, { label: "구독/플랜", disabled: true, badge: "준비 중" }]} />
      </div>
    </div>
  );
}

function SidebarGroup({
  title,
  items,
}: {
  title: string;
  items: { href?: string; label: string; disabled?: boolean; badge?: string }[];
}) {
  return (
    <section>
      <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="space-y-1">
        {items.map((item) =>
          item.href && !item.disabled ? (
            <Link key={item.label} href={item.href} className="block rounded-md px-3 py-2 hover:bg-muted">
              {item.label}
            </Link>
          ) : (
            <div key={item.label} className="flex items-center justify-between rounded-md px-3 py-2 text-muted-foreground">
              <span>{item.label}</span>
              {item.badge ? <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{item.badge}</span> : null}
            </div>
          ),
        )}
      </div>
    </section>
  );
}

function MobileTab({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="whitespace-nowrap rounded-full border border-border px-2.5 py-1.5 text-muted-foreground hover:bg-muted">
      {label}
    </Link>
  );
}
