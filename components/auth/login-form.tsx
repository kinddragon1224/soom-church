"use client";

import { useEffect, useState } from "react";
import { getCsrfToken } from "next-auth/react";

type LoginFormProps = {
  next?: string;
  defaultCallbackUrl?: string;
  compact?: boolean;
};

export default function LoginForm({ next, defaultCallbackUrl = "/app", compact = false }: LoginFormProps) {
  const [csrfToken, setCsrfToken] = useState<string>("");

  useEffect(() => {
    getCsrfToken().then((token) => setCsrfToken(token ?? ""));
  }, []);

  const callbackUrl = next?.startsWith("/") ? next : defaultCallbackUrl;
  const fieldClass = compact
    ? "h-11 rounded-[14px] border border-[#e8dfd2] bg-white px-4 text-sm text-[#171717] outline-none transition placeholder:text-[#b0a79b] focus:border-[#2a2a2a]"
    : "h-12 rounded-[16px] border border-[#e8dece] bg-[#faf7f2] px-4 text-sm text-[#171717] outline-none transition placeholder:text-[#aa9b8a] focus:border-[#111827] focus:bg-white";

  return (
    <form action="/api/auth/callback/credentials" className="grid gap-4" method="post">
      <input name="csrfToken" type="hidden" value={csrfToken} />
      <input name="callbackUrl" type="hidden" value={callbackUrl} />

      <label className="grid gap-2">
        <span className="text-[12px] font-medium text-[#6d6359]">아이디</span>
        <input autoComplete="username" className={fieldClass} name="identifier" placeholder="아이디를 입력해 주세요" required type="text" />
      </label>

      <label className="grid gap-2">
        <span className="text-[12px] font-medium text-[#6d6359]">비밀번호</span>
        <input autoComplete="current-password" className={fieldClass} name="password" placeholder="비밀번호를 입력해 주세요" required type="password" />
      </label>

      <button
        className="mt-1 inline-flex h-11 items-center justify-center rounded-[14px] bg-[#222222] px-5 text-sm font-semibold text-white transition hover:bg-black"
        type="submit"
      >
        계속
      </button>
    </form>
  );
}
