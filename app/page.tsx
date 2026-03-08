import Link from "next/link";
import { FeatureCards } from "@/components/marketing/feature-cards";
import { MarketingHero } from "@/components/marketing/hero";
import { ModuleHub } from "@/components/marketing/module-hub";
import { TrustStrip } from "@/components/marketing/trust-strip";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 sm:py-10">
      <MarketingHero />
      <TrustStrip />
      <FeatureCards />
      <ModuleHub />

      <section className="rounded-xl border border-border bg-card p-4 shadow-panel sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-muted-foreground">SOOM WORKSPACE SaaS</p>
            <h2 className="text-lg font-semibold">교회별 워크스페이스로 운영을 시작하세요</h2>
            <p className="mt-1 text-sm text-muted-foreground">숨에 로그인하면 각 교회 워크스페이스에서 운영 데이터가 분리되어 관리됩니다.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/login" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">숨 로그인</Link>
            <Link href="/signup" className="rounded-lg border border-border px-4 py-2 text-sm font-semibold">숨 시작하기</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
