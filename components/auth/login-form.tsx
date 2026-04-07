"use client";

import { useEffect, useState } from "react";
import { getCsrfToken } from "next-auth/react";

type LoginFormProps = {
  next?: string;
  defaultCallbackUrl?: string;
};

export default function LoginForm({ next, defaultCallbackUrl = "/app" }: LoginFormProps) {
  const [csrfToken, setCsrfToken] = useState<string>("");

  useEffect(() => {
    getCsrfToken().then((token) => setCsrfToken(token ?? ""));
  }, []);

  const callbackUrl = next?.startsWith("/") ? next : defaultCallbackUrl;

  return (
    <form action="/api/auth/callback/credentials" className="grid gap-4" method="post">
      <input name="csrfToken" type="hidden" value={csrfToken} />
      <input name="callbackUrl" type="hidden" value={callbackUrl} />

      <label className="grid gap-2">
        <span className="text-sm font-medium text-[#171717]">이메일</span>
        <input
          autoComplete="email"
          className="h-12 rounded-[16px] border border-[#e8dece] bg-[#faf7f2] px-4 text-sm text-[#171717] outline-none transition placeholder:text-[#aa9b8a] focus:border-[#111827] focus:bg-white"
          name="email"
          placeholder="name@example.com"
          required
          type="email"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-[#171717]">비밀번호</span>
        <input
          autoComplete="current-password"
          className="h-12 rounded-[16px] border border-[#e8dece] bg-[#faf7f2] px-4 text-sm text-[#171717] outline-none transition placeholder:text-[#aa9b8a] focus:border-[#111827] focus:bg-white"
          name="password"
          placeholder="비밀번호 입력"
          required
          type="password"
        />
      </label>

      <button
        className="mt-2 inline-flex h-12 items-center justify-center rounded-[16px] bg-[#111827] px-5 text-sm font-semibold text-white transition hover:bg-[#0c1320]"
        type="submit"
      >
        로그인
      </button>
    </form>
  );
}
