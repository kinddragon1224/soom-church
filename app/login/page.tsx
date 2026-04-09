import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn, getPostLoginPath } from "@/auth";
import LoginForm from "@/components/auth/login-form";
import { getCurrentUserId, isLoggedIn } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string; error?: string };
}) {
  const next = searchParams?.next;
  const error = searchParams?.error;
  const defaultCallbackUrl = "/app";

  if (await isLoggedIn()) {
    const userId = await getCurrentUserId();
    if (userId) redirect(next || (await getPostLoginPath(userId)));
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbfaf7] text-[#171717]">
      <div className="absolute left-5 top-5 text-[1.05rem] font-medium tracking-[-0.04em] text-[#2a2a2a] sm:left-7 sm:top-6">
        soom workspace
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-16">
        <div className="w-full max-w-[360px]">
          <div className="mb-6 text-center">
            <h1 className="text-[1.8rem] font-semibold tracking-[-0.06em] text-[#1d1d1d]">Soom에 로그인</h1>
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[#8a8177]">
              <span className="rounded-full border border-[#ece4d7] bg-white px-2.5 py-1">chat-first beta</span>
              <span className="rounded-full border border-[#ece4d7] bg-white px-2.5 py-1">mokjang os</span>
            </div>
          </div>

          <section className="rounded-[28px] border border-[#ece4d7] bg-white px-6 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:px-7">
            <LoginForm next={next} defaultCallbackUrl={defaultCallbackUrl} compact />

            {error ? (
              <div className="mt-4 rounded-[14px] border border-[#f0d7d7] bg-[#fff7f7] px-3.5 py-3 text-center text-xs text-[#9a4a4a]">
                {error === "credentials" ? "아이디 또는 비밀번호가 맞지 않습니다." : "로그인에 실패했습니다. 다시 시도해 주세요."}
              </div>
            ) : null}

            <div className="my-5 flex items-center gap-3 text-[11px] text-[#a39a90]">
              <div className="h-px flex-1 bg-[#eee7dc]" />
              <span>또는</span>
              <div className="h-px flex-1 bg-[#eee7dc]" />
            </div>

            <div className="grid gap-2.5">
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: next?.startsWith("/") ? next : "/app" });
                }}
              >
                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-[14px] border border-[#e9e2d8] bg-white text-sm font-medium text-[#2a2a2a] transition hover:bg-[#faf7f2]"
                >
                  <span className="text-base">G</span>
                  <span>Google로 계속하기</span>
                </button>
              </form>

              <form
                action={async () => {
                  "use server";
                  await signIn("naver", { redirectTo: next?.startsWith("/") ? next : "/app" });
                }}
              >
                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-[14px] border border-[#e9e2d8] bg-white text-sm font-medium text-[#2a2a2a] transition hover:bg-[#faf7f2]"
                >
                  <span className="text-base">N</span>
                  <span>네이버로 계속하기</span>
                </button>
              </form>
            </div>

            <div className="mt-5 text-center text-[11px] text-[#8e867c]">
              <span>계정이 없으신가요? </span>
              <Link href="/contact" className="font-medium text-[#2a2a2a] underline underline-offset-4">
                문의하기
              </Link>
            </div>
          </section>
        </div>
      </div>

      <div className="absolute bottom-5 left-0 right-0 text-center text-[11px] text-[#9d948a]">
        <Link href="/terms" className="hover:text-[#2a2a2a]">
          서비스 약관
        </Link>
        <span className="mx-1.5">및</span>
        <Link href="/privacy" className="hover:text-[#2a2a2a]">
          개인정보처리방침
        </Link>
      </div>
    </main>
  );
}
