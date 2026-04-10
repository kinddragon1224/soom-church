import Link from "next/link";
import { redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { SignupForm } from "@/components/auth/signup-form";

export default async function SignupPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const loggedIn = await isLoggedIn();
  if (loggedIn) {
    redirect("/app/beta");
  }

  return (
    <main className="min-h-screen bg-[#F7F4EE] px-6 py-12 text-[#121212]">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="rounded-[32px] border border-[#E6DFD5] bg-white p-8 shadow-[0_18px_48px_rgba(15,23,42,0.06)] lg:p-10">
          <p className="text-[11px] tracking-[0.18em] text-[#9A8B7A]">SOOM BETA</p>
          <h1 className="mt-3 text-[2.1rem] font-semibold tracking-[-0.05em] text-[#111111]">운영 개발 OS에 바로 들어가기</h1>
          <p className="mt-4 text-sm leading-7 text-[#5F564B]">
            복잡한 교회 생성 없이, 아이디와 비밀번호만 만들고 바로 새 beta 워크스페이스로 들어갑니다.
          </p>

          <div className="mt-8">
            <SignupForm error={searchParams?.error} />
          </div>
        </section>

        <section className="rounded-[32px] border border-[#E6DFD5] bg-[#FCFBF8] p-8 shadow-[0_18px_48px_rgba(15,23,42,0.04)] lg:p-10">
          <p className="text-sm font-semibold text-[#111111]">이번 단계 원칙</p>
          <div className="mt-5 grid gap-3 text-sm text-[#5F564B]">
            <div className="rounded-[18px] border border-[#EDE6D8] bg-white p-4">1. 회원가입하면 바로 beta 운영 OS로 진입</div>
            <div className="rounded-[18px] border border-[#EDE6D8] bg-white p-4">2. 교회/목장 세팅은 나중에 붙이고, 지금은 핵심 워크스페이스부터 검증</div>
            <div className="rounded-[18px] border border-[#EDE6D8] bg-white p-4">3. 단계별로만 확장</div>
          </div>

          <div className="mt-8 text-sm text-[#5F564B]">
            이미 계정이 있으면 <Link href="/login" className="font-medium text-[#111111] underline underline-offset-4">로그인</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
