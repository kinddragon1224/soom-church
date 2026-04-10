import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn, getPostLoginPath } from "@/auth";
import { isLoggedIn } from "@/lib/auth";
import LoginForm from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string; next?: string };
}) {
  const loggedIn = await isLoggedIn();
  if (loggedIn) {
    const session = await auth();
    if (session?.user?.id) {
      redirect(await getPostLoginPath(session.user.id));
    }
    redirect("/app/beta");
  }

  async function loginWithGoogle() {
    "use server";
    await signIn("google", { redirectTo: searchParams?.next || "/app/beta" });
  }

  return (
    <main className="min-h-screen bg-[#F7F4EE] px-6 py-12 text-[#121212]">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
        <section className="rounded-[32px] border border-[#E6DFD5] bg-[#FCFBF8] p-8 shadow-[0_18px_48px_rgba(15,23,42,0.04)] lg:p-10">
          <p className="text-[11px] tracking-[0.18em] text-[#9A8B7A]">SOOM BETA</p>
          <h1 className="mt-3 text-[2.1rem] font-semibold tracking-[-0.05em] text-[#111111]">운영 개발 OS 로그인</h1>
          <p className="mt-4 text-sm leading-7 text-[#5F564B]">
            아이디와 비밀번호로 바로 들어가면 됩니다. 로그인 후 기본 진입은 새 beta 워크스페이스입니다.
          </p>

          <div className="mt-8">
            <LoginForm error={searchParams?.error} />
          </div>

          <div className="mt-4 text-sm text-[#5F564B]">
            아직 계정이 없으면 <Link href="/signup" className="font-medium text-[#111111] underline underline-offset-4">가입하기</Link>
          </div>
        </section>

        <section className="rounded-[32px] border border-[#E6DFD5] bg-white p-8 shadow-[0_18px_48px_rgba(15,23,42,0.06)] lg:p-10">
          <p className="text-sm font-semibold text-[#111111]">간단 로그인 기준</p>
          <div className="mt-5 grid gap-3 text-sm text-[#5F564B]">
            <div className="rounded-[18px] border border-[#EDE6D8] bg-[#FCFBF8] p-4">아이디 1개, 비밀번호 1개로 시작</div>
            <div className="rounded-[18px] border border-[#EDE6D8] bg-[#FCFBF8] p-4">로그인 후 바로 beta 운영 OS 진입</div>
            <div className="rounded-[18px] border border-[#EDE6D8] bg-[#FCFBF8] p-4">교회/워크스페이스 연결은 다음 단계에서 붙이기</div>
          </div>

          <form action={loginWithGoogle} className="mt-8">
            <button className="h-12 w-full rounded-[16px] border border-[#E7E0D4] bg-white text-sm font-semibold text-[#121212] transition hover:bg-[#FAF7F1]">
              Google로 로그인
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
