import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isLoggedIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignupPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  if (await isLoggedIn()) redirect("/app");

  const error = searchParams?.error;

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col justify-center px-4 py-10 sm:px-6">
      <Card className="p-5">
        <h1 className="text-2xl font-bold">무료로 워크스페이스 시작하기</h1>
        <p className="mt-2 text-sm text-muted-foreground">기본 계정을 만들고 로그인한 뒤, 교회와 사역팀을 위한 워크스페이스를 무료로 시작하세요.</p>

        {error === "required" ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            이름, 이메일, 비밀번호를 모두 입력해 주세요.
          </div>
        ) : null}
        {error === "exists" ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            이미 가입된 이메일입니다. 로그인하거나 다른 이메일을 사용해 주세요.
          </div>
        ) : null}
        {error === "weak_password" ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            비밀번호는 8자 이상으로 입력해 주세요.
          </div>
        ) : null}

        <form action="/api/signup" method="post" className="mt-5 grid gap-3 sm:grid-cols-2">
          <input name="name" required placeholder="이름" className="rounded-md border border-border px-3 py-2 text-sm" />
          <input name="email" type="email" required placeholder="이메일" className="rounded-md border border-border px-3 py-2 text-sm" />
          <input name="password" type="password" required placeholder="비밀번호" className="rounded-md border border-border px-3 py-2 text-sm sm:col-span-2" />
          <Button type="submit" className="sm:col-span-2">회원가입하고 시작하기</Button>
        </form>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button type="button" className="rounded-md border border-border bg-muted px-3 py-2 text-left" disabled aria-disabled>
            <p className="text-sm font-medium">새 워크스페이스 만들기</p>
            <p className="text-xs text-muted-foreground">무료 시작 흐름과 함께 연결 예정</p>
          </button>
          <button type="button" className="rounded-md border border-border bg-muted px-3 py-2 text-left" disabled aria-disabled>
            <p className="text-sm font-medium">초대받은 워크스페이스 참여</p>
            <p className="text-xs text-muted-foreground">초대 코드 기반 참여 기능 준비 중</p>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link href="/login" className="rounded-md border border-border px-3 py-2">이미 계정이 있다면 로그인</Link>
          <Link href="/app/soom-dev/dashboard" className="rounded-md border border-border px-3 py-2">개발용 워크스페이스 보기</Link>
        </div>
      </Card>
    </main>
  );
}
