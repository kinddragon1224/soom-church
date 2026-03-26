"use client";

import { useEffect, useState } from "react";
import { getCsrfToken } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LoginForm({ next, defaultCallbackUrl }: { next?: string; defaultCallbackUrl: string }) {
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    getCsrfToken().then((token) => {
      if (token) setCsrfToken(token);
    });
  }, []);

  return (
    <form action="/api/auth/callback/credentials" method="post" className="mt-5 space-y-3">
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <input type="hidden" name="callbackUrl" value={next?.startsWith("/") ? next : defaultCallbackUrl} />
      <input name="email" type="email" required placeholder="admin@soom.church" className="w-full rounded-md border border-border px-3 py-2 text-sm" />
      <input name="password" type="password" required placeholder="••••" className="w-full rounded-md border border-border px-3 py-2 text-sm" />
      <Button className="w-full" type="submit">이메일로 로그인</Button>
    </form>
  );
}
