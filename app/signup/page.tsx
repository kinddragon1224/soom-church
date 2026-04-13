import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signIn, getPostLoginPath } from "@/auth";

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#EA4335" d="M9 7.36v3.48h4.84c-.21 1.12-.84 2.06-1.79 2.69l2.9 2.25c1.69-1.56 2.66-3.85 2.66-6.58 0-.63-.06-1.24-.16-1.84H9Z" />
      <path fill="#4285F4" d="M9 18c2.43 0 4.47-.81 5.95-2.22l-2.9-2.25c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.69H.96v2.32A8.99 8.99 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.96 10.7A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.16.28-1.7V4.98H.96A8.99 8.99 0 0 0 0 9c0 1.45.35 2.82.96 4.02l3-2.32Z" />
      <path fill="#34A853" d="M9 3.58c1.32 0 2.5.45 3.43 1.34l2.57-2.57C13.46.91 11.43 0 9 0A8.99 8.99 0 0 0 .96 4.98l3 2.32C4.67 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  );
}

export default async function SignupPage() {
  const session = await auth();
  if (session?.user?.id) {
    redirect(await getPostLoginPath(session.user.id));
  }

  const googleConfigured = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfaf7_0%,#f2eadf_100%)] px-4 py-8 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1180px] gap-8 lg:grid-cols-[minmax(0,1.05fr)_440px] lg:items-center">
        <section className="rounded-[36px] border border-[#e8ddcf] bg-[linear-gradient(135deg,#fffaf2_0%,#f7efe2_52%,#efe4d4_100%)] p-7 shadow-[0_24px_60px_rgba(66,38,12,0.08)] sm:p-9">
          <p className="text-[10px] tracking-[0.18em] text-[#9a8366]">SOOM / SIGN UP</p>
          <h1 className="mt-4 text-[2.2rem] font-semibold tracking-[-0.05em] text-[#1f1a16] sm:text-[2.8rem]">
            우리 공동체만의 app를 바로 시작하자.
          </h1>
          <p className="mt-4 max-w-[640px] text-sm leading-7 text-[#5f564b] sm:text-[15px]">
            회원가입 후에는 공용 베타 화면으로 가지 않고, 너만의 교회와 목장을 담는 고유 워크스페이스를 먼저 만들게 돼. 그 뒤 월드와 목양 공간을 바로 열 수 있어.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-[#5b5147] sm:grid-cols-3">
            <div className="rounded-[22px] border border-white/60 bg-white/70 p-4">
              <p className="font-medium text-[#2f2416]">고유 app</p>
              <p className="mt-2 leading-6">가입한 공동체마다 자기 이름과 slug를 가진 공간이 만들어진다.</p>
            </div>
            <div className="rounded-[22px] border border-white/60 bg-white/70 p-4">
              <p className="font-medium text-[#2f2416]">월드 중심</p>
              <p className="mt-2 leading-6">설명 페이지보다 바로 월드와 운영 흐름을 먼저 본다.</p>
            </div>
            <div className="rounded-[22px] border border-white/60 bg-white/70 p-4">
              <p className="font-medium text-[#2f2416]">구글 연동</p>
              <p className="mt-2 leading-6">지금은 구글 로그인 하나만으로 시작하게 단순화한다.</p>
            </div>
          </div>
        </section>

        <aside className="rounded-[32px] border border-[#e8ddcf] bg-white p-6 shadow-[0_22px_44px_rgba(66,38,12,0.06)] sm:p-7">
          <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">CREATE WITH GOOGLE</p>
          <h2 className="mt-3 text-[1.7rem] font-semibold tracking-[-0.04em] text-[#1c1713]">회원가입</h2>
          <p className="mt-3 text-sm leading-6 text-[#5f564b]">
            구글로 시작하면 바로 계정을 만들고, 다음 단계에서 네 공동체용 워크스페이스를 생성하게 돼.
          </p>

          {googleConfigured ? (
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/app/onboarding" });
              }}
              className="mt-6"
            >
              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-[16px] border border-[#e5dacd] bg-[#fffaf4] px-5 text-sm font-medium text-[#2f2416] transition hover:bg-[#f7efe3]"
              >
                <GoogleMark />
                Google로 시작하기
              </button>
            </form>
          ) : (
            <div className="mt-6 rounded-[16px] border border-[#f1d4ca] bg-[#fff6f2] p-4 text-sm leading-6 text-[#8f4c3f]">
              구글 로그인 설정이 아직 비어 있어. AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_URL을 넣어야 실제 연동돼.
            </div>
          )}

          <p className="mt-6 text-sm text-[#7a7064]">
            이미 계정이 있다면 <Link href="/login" className="font-medium text-[#3f372d] underline-offset-4 hover:underline">로그인</Link>
          </p>
        </aside>
      </div>
    </main>
  );
}
