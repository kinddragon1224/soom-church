import { redirect } from "next/navigation";
import { getAccessibleChurchesByUserId, getChurchBySlug, getCurrentUserOrRedirect } from "@/lib/church-context";
import { isPlatformAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const preferredRegion = "icn1";

export default async function AppEntryPage() {
  const userId = await getCurrentUserOrRedirect();

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (isPlatformAdminEmail(user?.email)) {
      redirect("/platform-admin");
    }
  } catch {
    // Keep app entry alive even if user lookup fails in production.
  }

  const memberships = await getAccessibleChurchesByUserId(userId);
  if (memberships.length === 1) {
    redirect(`/app/${memberships[0].church.slug}/dashboard`);
  }

  const demoChurch = await getChurchBySlug("daehung-ieum-dubit");

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
        <p className="text-[11px] tracking-[0.2em] text-white/46">WORKSPACE ENTRY</p>
        <h1 className="mt-3 text-[2.2rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white">접속 가능한 워크스페이스를 선택합니다</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/66 sm:text-base">일반 사용자 계정은 여기서 교회 워크스페이스로 들어가고, 플랫폼 관리자 계정은 자동으로 관리자 콘솔로 이동합니다.</p>
      </section>

      <section className="mt-4 rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">WORKSPACES</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">선택 가능한 교회</h2>
          </div>
          <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">{memberships.length}곳</span>
        </div>
        <div className="mt-4 grid gap-3">
          {memberships.length > 0 ? (
            memberships.map((membership) => (
              <a key={membership.church.id} href={`/app/${membership.church.slug}/dashboard`} className="rounded-[18px] border border-[#e7dece] bg-[#fcfbf8] px-4 py-4 transition hover:border-[#d7c4a3] hover:bg-white">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{membership.church.name}</p>
                    <p className="mt-1 text-xs text-[#7b6f61]">/{membership.church.slug}</p>
                  </div>
                  <span className="rounded-full border border-[#eadfcd] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">열기</span>
                </div>
              </a>
            ))
          ) : (
            <div className="rounded-[18px] border border-dashed border-[#d9cfbe] bg-[#fcfbf8] px-4 py-6 text-sm text-[#7b6f61]">
              연결된 워크스페이스가 없습니다. 관리자에게 교회 멤버십 연결을 요청하세요.
            </div>
          )}
        </div>
        {demoChurch ? (
          <a href={`/app/${demoChurch.slug}/dashboard`} className="mt-4 inline-flex rounded-[14px] border border-[#e1d7c7] bg-[#fcfbf8] px-3 py-2 text-sm text-[#111111]">
            데모 워크스페이스 보기
          </a>
        ) : null}
      </section>
    </main>
  );
}
