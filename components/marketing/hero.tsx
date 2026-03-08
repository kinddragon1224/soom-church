import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-panel sm:p-8">
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <div>
          <p className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            <Sparkles size={12} /> SOOM PLATFORM
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
            교회 운영을 위한 워크스페이스 SaaS, 숨
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            교적, 신청, 공지, 후속관리를 교회별 워크스페이스에서 운영하세요.
            교회 운영을 더 질서 있게, 더 가볍게, 더 연결되게 만듭니다.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Link href="/login" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
              숨 로그인 <ArrowRight size={14} className="ml-1" />
            </Link>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-muted">
              숨 시작하기
            </Link>
            <Link href="/features" className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted">
              기능 보기
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 self-stretch">
          <PreviewCard label="미처리 신청" value="12" sub="오늘 +3" />
          <PreviewCard label="후속관리" value="28" sub="우선 확인" />
          <PreviewCard label="이번 주 공지" value="6" sub="3개 상단고정" />
          <PreviewCard label="활성 모듈" value="3" sub="2개 준비 중" />
        </div>
      </div>
    </section>
  );
}

function PreviewCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <Card className="p-3 shadow-panel">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold leading-none">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </Card>
  );
}
