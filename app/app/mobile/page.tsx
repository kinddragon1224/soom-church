import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUserId } from "@/lib/auth";
import { getAccessibleChurchesByUserId } from "@/lib/church-context";

export default async function MobileAppEntryPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login?next=/app/mobile");
  }

  const churches = await getAccessibleChurchesByUserId(userId);
  const firstChurch = churches[0]?.church;
  const worldHref = firstChurch ? `/app/${firstChurch.slug}/world` : "/app/onboarding";
  const workspaceLabel = firstChurch?.name ?? "내 공동체";

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-5 text-white sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[430px] flex-col overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,#11203a_0%,#0f1b2e_38%,#13253c_100%)] shadow-[0_24px_80px_rgba(2,6,23,0.42)]">
        <section className="relative overflow-hidden px-5 pb-6 pt-5">
          <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.26),rgba(7,17,31,0))]" />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.22em] text-white/46">SOOM MOBILE WORLD</p>
              <h1 className="mt-2 text-[1.9rem] font-semibold tracking-[-0.06em] text-white">월드 접속하기</h1>
            </div>
            <Link href="/" className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] text-white/72">
              홈
            </Link>
          </div>

          <p className="relative mt-4 text-sm leading-6 text-white/68">
            홈페이지 밖으로 나가지 않고, 모바일 앱 기준의 세로형 월드 진입 구조로 바로 들어간다.
          </p>

          <div className="relative mt-6 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#22314d_0%,#1a2540_34%,#1b2f25_35%,#223924_100%)] p-4 shadow-[0_16px_36px_rgba(15,23,42,0.22)]">
            <div className="mb-3 flex items-center justify-between text-[11px] text-white/56">
              <span>{workspaceLabel}</span>
              <span>세로 전용</span>
            </div>

            <div className="relative h-[430px] overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#29405f_0%,#1d2942_30%,#1c3527_31%,#2f4d2f_100%)]">
              <div className="absolute left-[10%] top-[13%] h-16 w-16 rounded-full bg-[#c4b5fd22] blur-2xl" />
              <div className="absolute right-[12%] top-[18%] h-16 w-16 rounded-full bg-[#38bdf822] blur-2xl" />
              <div className="absolute left-[44%] top-[12%] flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#fbbf24]/35 bg-[#f59e0b22] text-sm font-semibold text-[#fde68a] shadow-[0_0_24px_rgba(245,158,11,0.18)]">
                목자
              </div>
              <div className="absolute left-[39%] top-[24%] flex h-[92px] w-[110px] items-center justify-center rounded-[24px] border border-white/10 bg-[#f8f3ea14] text-center shadow-[0_12px_24px_rgba(15,23,42,0.14)]">
                <div>
                  <div className="text-2xl">⛪</div>
                  <div className="mt-1 text-[11px] text-white/68">모임 공간</div>
                </div>
              </div>

              <MapHouse className="left-[7%] top-[22%]" title="은혜 가정" meta="기도 2 · 돌봄 1" />
              <MapHouse className="right-[8%] top-[24%]" title="소망 가정" meta="관계 안정" />
              <MapHouse className="left-[14%] bottom-[16%]" title="기쁨 가정" meta="새가족 1" />
              <MapHouse className="right-[12%] bottom-[14%]" title="평안 가정" meta="심방 필요" />

              <MapPerson className="left-[25%] top-[42%]" name="요한" state="✨ 기도" />
              <MapPerson className="left-[58%] top-[48%]" name="마리아" state="💧 돌봄" />
              <MapPerson className="left-[38%] bottom-[18%]" name="다니엘" state="✉️ 후속" />
              <MapPerson className="left-[64%] bottom-[22%]" name="하은" state="• 안정" />
            </div>
          </div>
        </section>

        <section className="grid gap-3 border-t border-white/8 bg-[#0b1525] px-5 py-5">
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-white/72">
            <InfoChip label="맵" value="스크롤형" />
            <InfoChip label="입력" value="채팅형" />
            <InfoChip label="구조" value="세로 전용" />
          </div>

          <Link
            href={worldHref}
            className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-[#0b1525]"
          >
            {firstChurch ? `${workspaceLabel} 월드 열기` : "내 월드 만들기"}
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Link href={firstChurch ? `${worldHref}?panel=chat` : "/app/onboarding"} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/86">
              채팅으로 열기
            </Link>
            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/86">
              도입 문의
            </Link>
          </div>

          <Link href="/app/mobile/return" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#7dd3fc]/35 bg-[#38bdf81a] px-5 text-sm font-semibold text-[#dff4ff]">
            앱 복귀 페이지 열기
          </Link>
        </section>
      </div>
    </main>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-3 py-3">
      <p className="text-white/46">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function MapHouse({ className, title, meta }: { className: string; title: string; meta: string }) {
  return (
    <div className={`absolute w-[118px] rounded-[20px] border border-white/10 bg-[#fbf6ed12] p-3 backdrop-blur-sm ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xl">🏠</span>
        <span className="rounded-full border border-white/10 bg-black/10 px-2 py-0.5 text-[10px] text-white/60">가정</span>
      </div>
      <p className="mt-2 text-[12px] font-semibold text-white">{title}</p>
      <p className="mt-1 text-[10px] text-white/56">{meta}</p>
    </div>
  );
}

function MapPerson({ className, name, state }: { className: string; name: string; state: string }) {
  return (
    <div className={`absolute flex w-[76px] flex-col items-center text-center ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/14 bg-white/[0.08] text-sm font-semibold text-white shadow-[0_8px_18px_rgba(15,23,42,0.18)]">
        {name.slice(0, 1)}
      </div>
      <p className="mt-1.5 text-[11px] font-medium text-white">{name}</p>
      <span className="mt-1 rounded-full border border-white/10 bg-black/10 px-2 py-0.5 text-[10px] text-white/68">{state}</span>
    </div>
  );
}
