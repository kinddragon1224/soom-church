import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isLoggedIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string; error?: string };
}) {
  const next = searchParams?.next;
  const error = searchParams?.error;

  if (await isLoggedIn()) redirect(next || "/app");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold">숨 로그인</h1>
        <p className="mt-1 text-sm text-muted-foreground">숨 플랫폼에 로그인하고 교회 워크스페이스로 진입하세요.</p>
        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            로그인에 실패했어. 계정 상태나 연동 설정을 확인해줘.
          </div>
        ) : null}
        <form action="/api/login" method="post" className="mt-5 space-y-3">
          {next ? <input type="hidden" name="next" value={next} /> : null}
          <input name="email" type="email" required placeholder="admin@soom.church" className="w-full rounded-md border border-border px-3 py-2 text-sm" />
          <input name="password" type="password" required placeholder="••••••••" className="w-full rounded-md border border-border px-3 py-2 text-sm" />
          <Button className="w-full" type="submit">이메일로 로그인</Button>
        </form>

        <div className="mt-6 space-y-2">
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: next?.startsWith("/") ? next : "/app" });
            }}
          >
            <Button className="w-full" type="submit" variant="outline">Google로 계속하기</Button>
          </form>
          <form
            action={async () => {
              "use server";
              await signIn("naver", { redirectTo: next?.startsWith("/") ? next : "/app" });
            }}
          >
            <Button className="w-full" type="submit" variant="outline">네이버로 계속하기</Button>
          </form>
          <form
            action={async () => {
              "use server";
              await signIn("kakao", { redirectTo: next?.startsWith("/") ? next : "/app" });
            }}
          >
            <Button className="w-full" type="submit" variant="outline">카카오로 계속하기</Button>
          </form>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">소셜 로그인은 앱 키 설정 후 사용할 수 있어. 기존 계정 이메일과 같으면 같은 사용자로 연결돼.</p>
      </Card>
    </div>
  );
}
