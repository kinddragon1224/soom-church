import Link from "next/link";
import { redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import SignupForm from "@/components/auth/signup-form";

export default async function SignupPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  if (await isLoggedIn()) redirect("/app");

  const error = searchParams?.error;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbfaf7] text-[#171717]">
      <div className="absolute left-5 top-5 text-[1.05rem] font-medium tracking-[-0.04em] text-[#2a2a2a] sm:left-7 sm:top-6">
        soom workspace
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-16">
        <div className="w-full max-w-[440px]">
          <div className="mb-6 text-center">
            <h1 className="text-[1.8rem] font-semibold tracking-[-0.06em] text-[#1d1d1d]">워크스페이스 시작하기</h1>
            <p className="mt-2 text-sm leading-6 text-[#857b71]">기본 계정을 만들고 바로 목장과 교회 운영 화면으로 들어가.</p>
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[#8a8177]">
              <span className="rounded-full border border-[#ece4d7] bg-white px-2.5 py-1">무료 시작</span>
              <span className="rounded-full border border-[#ece4d7] bg-white px-2.5 py-1">바로 워크스페이스 생성</span>
            </div>
          </div>

          <section className="rounded-[28px] border border-[#ece4d7] bg-white px-6 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:px-7">
            <SignupForm error={error} />

            <div className="mt-4 rounded-[16px] border border-[#ebe3d8] bg-[#faf7f2] px-4 py-3 text-sm leading-6 text-[#6f6458]">
              가입하면 첫 워크스페이스가 바로 만들어지고, 로그인 없이 바로 들어가게 연결할게.
            </div>

            <div className="mt-5 text-center text-[11px] text-[#8e867c]">
              <span>이미 계정이 있다면 </span>
              <Link href="/login" className="font-medium text-[#2a2a2a] underline underline-offset-4">
                로그인
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
