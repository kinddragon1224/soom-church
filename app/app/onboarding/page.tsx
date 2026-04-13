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
          <p className="text-[10px] tracking-[0.18em] text-[#9a8366]">SOOM / ONBOARDING</p>
          <h1 className="mt-4 text-[2.2rem] font-semibold tracking-[-0.05em] text-[#1f1a16] sm:text-[2.8rem]">
            우리 공동체만의 공간을 먼저 만들자.
          </h1>
          <p className="mt-4 max-w-[640px] text-sm leading-7 text-[#5f564b] sm:text-[15px]">
            숨은 공용 베타 화면으로 시작하지 않고, 가입한 사람마다 자기 목장과 교회를 담는 고유 워크스페이스를 만든 뒤 그 안에서 월드와 목양 공간을 열어야 해.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-[#5b5147] sm:grid-cols-3">
            <div className="rounded-[22px] border border-white/60 bg-white/70 p-4">
              <p className="font-medium text-[#2f2416]">고유 월드</p>
              <p className="mt-2 leading-6">공용 화면이 아니라 각 공동체의 이름과 흐름을 가진 월드를 연다.</p>
            </div>
            <div className="rounded-[22px] border border-white/60 bg-white/70 p-4">
              <p className="font-medium text-[#2f2416]">목양 운영</p>
              <p className="mt-2 leading-6">사람, 가정, 기도, 심방 흐름이 자기 공간 안에 쌓인다.</p>
            </div>
            <div className="rounded-[22px] border border-white/60 bg-white/70 p-4">
              <p className="font-medium text-[#2f2416]">차분한 시작</p>
              <p className="mt-2 leading-6">복잡한 설정 없이 이름 하나로 시작하고 나머지는 안에서 채워간다.</p>
            </div>
          </div>
        </section>

        <aside className="rounded-[32px] border border-[#e8ddcf] bg-white p-6 shadow-[0_22px_44px_rgba(66,38,12,0.06)] sm:p-7">
          <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">CREATE WORKSPACE</p>
          <h2 className="mt-3 text-[1.6rem] font-semibold tracking-[-0.04em] text-[#1c1713]">첫 공간 만들기</h2>
          <p className="mt-3 text-sm leading-6 text-[#5f564b]">
            이름을 입력하면 바로 고유 app가 생성되고, 이후 월드로 들어가게 된다.
          </p>

          <div className="mt-6">
            <CreateWorkspaceForm />
          </div>
        </aside>
      </div>
    </main>
  );
}
