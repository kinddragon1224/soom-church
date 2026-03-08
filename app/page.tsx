import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6">
      <section className="rounded-xl border border-border bg-card p-6">
        <p className="text-xs text-muted-foreground">SOOM PLATFORM</p>
        <h1 className="mt-1 text-2xl font-bold">교회 운영을 위한 워크스페이스 SaaS, 숨</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          교적, 신청, 공지, 후속관리를 교회별 워크스페이스에서 운영하는 교회 AX SaaS 플랫폼입니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link href="/login" className="rounded-md bg-primary px-3 py-2 text-primary-foreground">로그인</Link>
          <Link href="/signup" className="rounded-md border border-border px-3 py-2">회원가입</Link>
          <Link href="/app/demo-soom/dashboard" className="rounded-md border border-border px-3 py-2">데모 보기</Link>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoCard title="공식 홈페이지" desc="소개, 기능, 요금, 문의, 로그인/회원가입을 제공합니다." />
        <InfoCard title="앱 워크스페이스" desc="/app/[churchSlug] 아래에서 교회별 운영 데이터를 분리해 관리합니다." />
      </div>
    </main>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}
