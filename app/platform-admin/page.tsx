import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export default async function PlatformAdminPage() {
  const [churchCount, subscriptionCount, guideCount, publishedGuideCount] = await Promise.all([
    prisma.church.count({ where: { isActive: true } }),
    prisma.subscription.count(),
    prisma.guidePost.count(),
    prisma.guidePost.count({ where: { published: true } }),
  ]);

  const cards = [
    ["활성 교회", churchCount, "/platform-admin/churches"],
    ["구독 레코드", subscriptionCount, "/platform-admin/subscriptions"],
    ["워크스페이스 생성", "바로가기", "/platform-admin/provisioning"],
    ["AI 안내서", guideCount, "/guides"],
  ] as const;

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-xl font-semibold">플랫폼 운영 개요</h2>
        <p className="mt-2 text-sm text-muted-foreground">교회 워크스페이스, 구독, 공개 콘텐츠를 한 화면에서 관리합니다.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/guides" className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white">AI 안내서 관리</Link>
          <Link href="/ai-guides" className="rounded-md border border-border px-3 py-2 text-sm">공개 페이지 보기</Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-2 sm:grid-cols-4">
        {cards.map(([label, value, href]) => (
          <Link key={label} href={href} className="rounded-lg border border-border bg-card p-3 hover:bg-muted">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold leading-none">{value}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs text-muted-foreground">콘텐츠 상태</p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">전체 안내서</p>
            <p className="mt-1 text-2xl font-bold">{guideCount}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">공개 안내서</p>
            <p className="mt-1 text-2xl font-bold">{publishedGuideCount}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
