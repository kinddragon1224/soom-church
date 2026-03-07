import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 sm:px-6">
      <h1 className="text-2xl font-bold">회원가입</h1>
      <p className="mt-2 text-sm text-muted-foreground">회원가입 후 교회 생성 또는 초대 수락 흐름으로 연결됩니다.</p>
      <div className="mt-4 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        온보딩 1차 울타리 단계: UI 자리만 준비됨
      </div>
      <Link href="/login" className="mt-4 text-sm text-primary hover:underline">이미 계정이 있으신가요? 로그인</Link>
    </main>
  );
}
