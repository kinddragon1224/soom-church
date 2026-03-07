import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isLoggedIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function LoginPage() {
  if (isLoggedIn()) redirect("/app");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold">숨 관리자 로그인</h1>
        <p className="mt-1 text-sm text-muted-foreground">교회 교적/행정 운영 허브</p>
        <form action="/api/login" method="post" className="mt-5 space-y-3">
          <input name="email" type="email" required placeholder="admin@soom.church" className="w-full rounded-md border border-border px-3 py-2 text-sm" />
          <input name="password" type="password" required placeholder="••••••••" className="w-full rounded-md border border-border px-3 py-2 text-sm" />
          <Button className="w-full" type="submit">로그인</Button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">데모 계정: admin@soom.church / demo-admin</p>
      </Card>
    </div>
  );
}
