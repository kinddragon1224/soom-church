import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-xs text-muted-foreground">SOOM PLATFORM</p>
        <h1 className="mt-1 text-2xl font-bold">숨 · 교회 운영 SaaS</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          숨은 교회별 워크스페이스 기반으로 교적, 신청, 공지, 후속관리를 운영하는 관리자 플랫폼입니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link href="/login" className="rounded-md bg-primary px-3 py-2 text-white">로그인</Link>
          <Link href="/signup" className="rounded-md border border-border px-3 py-2">회원가입</Link>
          <Link href="/features" className="rounded-md border border-border px-3 py-2">기능 보기</Link>
          <Link href="/pricing" className="rounded-md border border-border px-3 py-2">요금 안내</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoCard title="공식 홈페이지 영역" desc="/, /features, /pricing, /contact, /login, /signup" />
        <InfoCard title="앱 영역" desc="/app/[churchSlug]/dashboard 이하 라우트로 교회 워크스페이스 분리" />
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
