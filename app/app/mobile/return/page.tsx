import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUserId } from "@/lib/auth";

export default async function MobileAppReturnPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login?next=/app/mobile/return");
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-6 text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[430px] flex-col justify-between rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,#11203a_0%,#0f1b2e_38%,#13253c_100%)] p-6 shadow-[0_22px_80px_rgba(2,6,23,0.42)]">
        <div>
          <p className="text-[11px] tracking-[0.2em] text-white/46">SOOM LOGIN RETURN</p>
          <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.05em] text-white">로그인 완료</h1>
          <p className="mt-4 text-sm leading-6 text-white/70">
            로그인 연결이 끝났어. 아래 버튼으로 앱을 다시 열면 모바일 앱에서 바로 월드로 들어간다.
          </p>
        </div>

        <div className="grid gap-3">
          <a
            href="soom://auth-complete"
            className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-[#0b1525]"
          >
            앱으로 돌아가기
          </a>
          <Link
            href="/app/mobile"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-white/86"
          >
            웹에서 계속 보기
          </Link>
        </div>
      </div>
    </main>
  );
}
