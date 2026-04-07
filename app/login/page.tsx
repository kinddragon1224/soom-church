import Link from "next/link";
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
  const defaultCallbackUrl = "/app";

  if (await isLoggedIn()) {
    const userId = await getCurrentUserId();
    if (userId) redirect(next || (await getPostLoginPath(userId)));
  }

  return (
    <main className="min-h-screen bg-[#f5f1ea] px-4 py-6 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1280px] flex-col gap-4 lg:flex-row">
        <section className="flex flex-1 overflow-hidden rounded-[32px] border border-[#e8dece] bg-[linear-gradient(180deg,#fffdf9_0%,#f6f0e7_100%)] shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <div className="flex w-full flex-col justify-between p-8 sm:p-10 lg:p-12">
            <div>
              <div className="flex items-center justify-between gap-4">
                <Link href="/" className="text-[2rem] font-semibold tracking-[-0.08em] text-[#111111]">
                  soom
                </Link>
                <Link href="/" className="text-sm text-[#7a6d5c] hover:text-[#111111]">
                  홈으로
                </Link>
              </div>

              <div className="mt-16 max-w-[560px]">
                <p className="text-[11px] tracking-[0.22em] text-[#9a8b7a]">WORKSPACE LOGIN</p>
                <h1 className="mt-4 text-[2.5rem] font-semibold leading-[0.96] tracking-[-0.08em] text-[#111111] sm:text-[3.4rem]">
                  목장과 교회 운영을
                  <br />
                  더 단순하게
                </h1>
                <p className="mt-5 max-w-[460px] text-base leading-7 text-[#5f564b]">
                  목원 관리, 중보, 후속 연락을 한 흐름으로 보는 Soom 워크스페이스 로그인 화면이야.
                </p>
              </div>
            </div>

            <div className="grid gap-3 pt-10 sm:grid-cols-3">
              <div className="rounded-[22px] border border-[#ebe2d5] bg-white/90 p-4">
                <p className="text-sm font-semibold text-[#111111]">목원 관리</p>
                <p className="mt-2 text-sm leading-6 text-[#6f6256]">새 목원을 등록하고 가정 단위로 바로 묶어.</p>
              </div>
              <div className="rounded-[22px] border border-[#ebe2d5] bg-white/90 p-4">
                <p className="text-sm font-semibold text-[#111111]">중보 정리</p>
                <p className="mt-2 text-sm leading-6 text-[#6f6256]">가정별 기도제목과 함께 품는 이름을 한눈에 봐.</p>
              </div>
              <div className="rounded-[22px] border border-[#ebe2d5] bg-white/90 p-4">
                <p className="text-sm font-semibold text-[#111111]">후속 연락</p>
                <p className="mt-2 text-sm leading-6 text-[#6f6256]">이번 주 바로 챙겨야 할 사람만 따로 모아봐.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full lg:max-w-[440px]">
          <div className="flex h-full flex-col rounded-[32px] border border-[#e8dece] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-8">
            <div>
              <p className="text-[11px] tracking-[0.22em] text-[#9a8b7a]">SIGN IN</p>
              <h2 className="mt-3 text-[1.8rem] font-semibold tracking-[-0.06em] text-[#111111]">워크스페이스 로그인</h2>
              <p className="mt-2 text-sm leading-6 text-[#6f6256]">계정으로 로그인하고 바로 워크스페이스로 들어가.</p>
            </div>

            {error ? (
              <div className="mt-5 rounded-[18px] border border-[#efd4d4] bg-[#fff7f7] px-4 py-3 text-sm text-[#9b4a4a]">
                {error === "credentials" ? "이메일이나 비밀번호가 맞지 않아. 다시 확인해줘." : "로그인에 실패했어. 계정 상태를 다시 확인해줘."}
              </div>
            ) : null}

            <div className="mt-6">
              <LoginForm next={next} defaultCallbackUrl={defaultCallbackUrl} />
            </div>

            <div className="mt-6 border-t border-[#f0e8dc] pt-6">
              <p className="text-xs tracking-[0.16em] text-[#9a8b7a]">다른 로그인 방법</p>
              <div className="mt-3 grid gap-2">
                <form
                  action={async () => {
                    "use server";
                    await signIn("google", { redirectTo: next?.startsWith("/") ? next : "/app" });
                  }}
                >
                  <Button className="h-11 w-full rounded-[14px] border-[#e7dece] bg-white text-[#171717] hover:bg-[#faf7f2]" type="submit" variant="outline">
                    Google로 로그인
                  </Button>
                </form>
                <div className="grid grid-cols-2 gap-2">
                  <form
                    action={async () => {
                      "use server";
                      await signIn("naver", { redirectTo: next?.startsWith("/") ? next : "/app" });
                    }}
                  >
                    <Button className="h-11 w-full rounded-[14px] border-[#e7dece] bg-white text-[#171717] hover:bg-[#faf7f2]" type="submit" variant="outline">
                      네이버
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await signIn("kakao", { redirectTo: next?.startsWith("/") ? next : "/app" });
                    }}
                  >
                    <Button className="h-11 w-full rounded-[14px] border-[#e7dece] bg-white text-[#171717] hover:bg-[#faf7f2]" type="submit" variant="outline">
                      카카오
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
