import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getAccessibleChurchesByUserId } from "@/lib/church-context";
import { CreateWorkspaceForm } from "@/components/auth/create-workspace-form";

export default async function AppOnboardingPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login?next=/app/onboarding");
  }

  const churches = await getAccessibleChurchesByUserId(userId);
  if (churches.length > 0) {
    redirect(`/app/${churches[0].church.slug}/world`);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfaf7_0%,#f2eadf_100%)] px-4 py-10 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1160px] gap-8 lg:grid-cols-[minmax(0,1.05fr)_420px] lg:items-center">
        <section className="rounded-[36px] border border-[#e8ddcf] bg-[linear-gradient(135deg,#fffaf2_0%,#f7efe2_52%,#efe4d4_100%)] p-7 shadow-[0_24px_60px_rgba(66,38,12,0.08)] sm:p-9">
          <p className="text-[10px] tracking-[0.18em] text-[#9a8366]">MOKJANG WORLD / ONBOARDING</p>
          <h1 className="mt-4 text-[2.2rem] font-semibold tracking-[-0.05em] text-[#1f1a16] sm:text-[2.8rem]">
            목장월드 Lab 공간을 먼저 만듭니다.
          </h1>
          <p className="mt-4 max-w-[640px] text-sm leading-7 text-[#5f564b] sm:text-[15px]">
            이 화면은 SOOM 커리어 컨설팅 웹이 아니라, 목양 기록과 성장형 월드 루프를 검증하는 목장월드 Lab 전용 온보딩입니다.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-[#5b5147] sm:grid-cols-3">
            <div className="rounded-[22px] border border-white/60 bg-white/70 p-4">
              <p className="font-medium text-[#2f2416]">Lab 공간</p>
              <p className="mt-2 leading-6">공용 데모가 아니라 각 목장 이름을 가진 실험 공간으로 시작합니다.</p>
            </div>
            <div className="rounded-[22px] border border-white/60 bg-white/70 p-4">
              <p className="font-medium text-[#2f2416]">목양 운영</p>
              <p className="mt-2 leading-6">목원, 기도, 안부, 출석 기록을 한 흐름으로 쌓습니다.</p>
            </div>
            <div className="rounded-[22px] border border-white/60 bg-white/70 p-4">
              <p className="font-medium text-[#2f2416]">차분한 시작</p>
              <p className="mt-2 leading-6">복잡한 설정 없이 이름 하나로 시작하고, 나머지는 앱 안에서 채워갑니다.</p>
            </div>
          </div>
        </section>

        <aside className="rounded-[32px] border border-[#e8ddcf] bg-white p-6 shadow-[0_22px_44px_rgba(66,38,12,0.06)] sm:p-7">
          <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">CREATE MOKJANG WORLD</p>
          <h2 className="mt-3 text-[1.6rem] font-semibold tracking-[-0.04em] text-[#1c1713]">목장월드 만들기</h2>
          <p className="mt-3 text-sm leading-6 text-[#5f564b]">
            이름을 입력하면 목장월드 Lab 공간이 생성되고, 이후 월드 홈으로 이동합니다.
          </p>

          <div className="mt-6">
            <CreateWorkspaceForm />
          </div>
        </aside>
      </div>
    </main>
  );
}
