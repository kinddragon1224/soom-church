import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col justify-center px-4 py-10 sm:px-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <h1 className="text-2xl font-bold">숨 시작하기 · 온보딩</h1>
        <p className="mt-2 text-sm text-muted-foreground">숨 플랫폼에 가입한 뒤, 교회 워크스페이스를 생성하거나 초대를 수락해 시작합니다. (현재 데모 모드)</p>

        <form className="mt-4 grid gap-2 sm:grid-cols-2">
          <input placeholder="이름" className="rounded-md border border-border px-3 py-2 text-sm" />
          <input type="email" placeholder="이메일" className="rounded-md border border-border px-3 py-2 text-sm" />
          <input type="password" placeholder="비밀번호" className="rounded-md border border-border px-3 py-2 text-sm sm:col-span-2" />
          <button type="button" className="rounded-md bg-muted px-3 py-2 text-sm text-left sm:col-span-2" disabled aria-disabled>
            가입 기능 준비 중 · 현재는 데모 로그인 사용
          </button>
        </form>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button type="button" className="rounded-md border border-border bg-muted px-3 py-2 text-left" disabled aria-disabled>
            <p className="text-sm font-medium">새 교회 워크스페이스 만들기</p>
            <p className="text-xs text-muted-foreground">온보딩 2차에서 연결 예정</p>
          </button>
          <button type="button" className="rounded-md border border-border bg-muted px-3 py-2 text-left" disabled aria-disabled>
            <p className="text-sm font-medium">초대받은 교회에 참여하기</p>
            <p className="text-xs text-muted-foreground">초대 코드 기반 참여 기능 준비 중</p>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link href="/login" className="rounded-md bg-primary px-3 py-2 text-white">숨 로그인으로 이동</Link>
          <Link href="/app" className="rounded-md border border-border px-3 py-2">워크스페이스 진입</Link>
        </div>
      </div>
    </main>
  );
}
