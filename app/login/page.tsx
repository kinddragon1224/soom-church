import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isLoggedIn, getCurrentUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import { signIn, getPostLoginPath } from "@/auth";
import LoginForm from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string; error?: string; legacy?: string };
}) {
  const next = searchParams?.next;
  const error = searchParams?.error;
  const legacy = searchParams?.legacy;
  const defaultCallbackUrl = "/app";

  if (await isLoggedIn()) {
    const userId = await getCurrentUserId();
    if (userId) redirect(next || (await getPostLoginPath(userId)));
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center justify-between gap-3 px-1">
          <Link href="/" className="font-display text-2xl font-semibold tracking-[-0.06em] text-white">
            soom
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-white">
            홈으로 돌아가기
          </Link>
        </div>

        <Card className="w-full p-6">
        <h1 className="text-2xl font-bold">숨 워크스페이스 로그인</h1>
        <p className="mt-1 text-sm text-muted-foreground">로그인하고 교회와 사역팀을 위한 워크스페이스로 들어가세요. 무료로 시작한 뒤 필요할 때 확장할 수 있습니다.</p>
        {legacy ? (
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            이전 로그인 경로는 정리되었어. 이 화면에서 다시 로그인하면 돼.
          </div>
        ) : null}
        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error === "credentials"
              ? "이메일이나 비밀번호가 맞지 않습니다. 다시 확인해 주세요."
              : "로그인에 실패했습니다. 계정 상태나 연동 설정을 확인해 주세요."}
          </div>
        ) : null}
        <LoginForm next={next} defaultCallbackUrl={defaultCallbackUrl} />

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

        <p className="mt-4 text-xs text-muted-foreground">소셜 로그인은 앱 키 설정 후 사용할 수 있습니다. 기존 계정 이메일과 같으면 같은 사용자로 연결됩니다.</p>
        </Card>
      </div>
    </div>
  );
}
