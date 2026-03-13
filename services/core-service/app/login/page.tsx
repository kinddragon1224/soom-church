import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isLoggedIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string; error?: string };
}) {
  const next = searchParams?.next;
  const error = searchParams?.error;

  if (isLoggedIn()) redirect(next || "/app");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold">숨 로그인</h1>
        <p className="mt-1 text-sm text-muted-foreground">숨 플랫폼에 로그인하고 교회 워크스페이스로 진입하세요.</p>
        {error === "invalid" ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            이메일 또는 비밀번호를 다시 확인해줘.
          </div>
        ) : null}
        <form action="/api/login" method="post" className="mt-5 space-y-3">
          {next ? <input type="hidden" name="next" value={next} /> : null}
          <input name="email" type="email" required placeholder="admin@soom.church" className="w-full rounded-md border border-border px-3 py-2 text-sm" />
          <input name="password" type="password" required placeholder="••••••••" className="w-full rounded-md border border-border px-3 py-2 text-sm" />
          <Button className="w-full" type="submit">로그인</Button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">교회 워크스페이스 계정으로 로그인하세요.</p>
      </Card>
    </div>
  );
}
