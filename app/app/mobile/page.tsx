import Link from "next/link";

import SiteHeader from "@/components/site-header";
import { getCurrentUserId } from "@/lib/auth";
import { getAccessibleChurchesByUserId } from "@/lib/church-context";

const labPrinciples = [
  {
    title: "SOOM과 분리된 실험",
    desc: "목장월드는 진로 컨설팅 웹의 핵심 상품이 아니라, 별도 모바일 제품으로 천천히 검증합니다.",
  },
  {
    title: "목양 기록을 게임 루프로",
    desc: "기도, 안부, 출석, 후속 기록이 XP, 씨앗, 등불, 정원 성장으로 이어지는 구조를 실험합니다.",
  },
  {
    title: "AI 없이도 작동하는 MVP",
    desc: "모라를 캐릭터/가이드로 두되, 초기 버전은 AI 병목 없이 실제 목양 기록 흐름부터 안정화합니다.",
  },
];

const worldLoop = ["앱 접속", "오늘의 목양 퀘스트", "목원 기록", "보상 획득", "정원 성장", "다음 돌봄"];

export default async function MobileAppEntryPage() {
  const userId = await getCurrentUserId();
  const churches = userId ? await getAccessibleChurchesByUserId(userId) : [];
  const firstChurch = churches[0]?.church;
  const worldHref = firstChurch ? `/app/${firstChurch.slug}/world` : "/app/onboarding";
  const primaryHref = userId ? worldHref : "/login?next=/app/mobile";
  const primaryLabel = userId ? (firstChurch ? `${firstChurch.name} 월드 열기` : "내 목장월드 만들기") : "로그인 후 Lab 열기";

  return (
    <main className="min-h-screen bg-[#0b111b] text-white">
      <section className="border-b border-white/10 bg-[#0b111b]">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="workspace" ctaHref="/" ctaLabel="SOOM으로 돌아가기" loggedIn={Boolean(userId)} />
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(125,211,252,0.16)_0%,rgba(125,211,252,0)_28%),radial-gradient(circle_at_82%_18%,rgba(251,191,36,0.18)_0%,rgba(251,191,36,0)_30%),linear-gradient(180deg,#0b111b_0%,#111827_56%,#0d1b16_100%)]" />
        <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_0.92fr] lg:px-10 lg:py-24">
          <div>
            <p className="text-xs font-semibold tracking-[0.26em] text-[#9bdcff]">MOKJANG WORLD LAB</p>
            <h1 className="mt-5 text-[3rem] font-semibold leading-[0.98] tracking-[-0.07em] sm:text-[5.1rem]">
              목양을
              <br />
              다시 열고 싶은
              <br />
              작은 월드로
            </h1>
            <p className="mt-7 max-w-2xl text-sm leading-8 text-white/66 sm:text-base">
              목장월드는 SOOM 웹과 분리해 개발하는 모바일 실험 제품입니다. 문서 기록으로 끝나는 목양을, 목자가 다시 접속하고 싶어지는 작은 성장형 월드로 바꾸는 것을 목표로 합니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={primaryHref} className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#0b111b]">
                {primaryLabel}
              </Link>
              <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/[0.04] px-6 text-sm font-semibold text-white/86">
                SOOM 진로 컨설팅 보기
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[430px] rounded-[38px] border border-white/10 bg-[#101a2b] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
            <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,#233a5c_0%,#1b2c44_34%,#1d3d2b_35%,#2f4d2f_100%)] p-4">
              <div className="flex items-center justify-between text-[11px] text-white/56">
                <span>Prototype MVP</span>
                <span>Mobile-first</span>
              </div>
              <div className="relative mt-4 h-[430px] overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,#29405f_0%,#1d2942_30%,#1c3527_31%,#2f4d2f_100%)]">
                <div className="absolute left-[10%] top-[12%] h-20 w-20 rounded-full bg-[#fef3c722] blur-2xl" />
                <div className="absolute right-[8%] top-[18%] h-20 w-20 rounded-full bg-[#7dd3fc22] blur-2xl" />
                <div className="absolute left-[34%] top-[13%] flex h-[92px] w-[132px] items-center justify-center rounded-[26px] border border-white/10 bg-white/[0.08] text-center shadow-[0_18px_36px_rgba(15,23,42,0.18)]">
                  <div>
                    <div className="text-2xl">⛪</div>
                    <div className="mt-1 text-[11px] text-white/70">목장 홈</div>
                  </div>
                </div>
                <MapHouse className="left-[7%] top-[28%]" title="기도" meta="씨앗 +1" />
                <MapHouse className="right-[8%] top-[31%]" title="안부" meta="친밀도 +12" />
                <MapHouse className="left-[13%] bottom-[13%]" title="출석" meta="등불 +1" />
                <MapHouse className="right-[11%] bottom-[15%]" title="정원" meta="Lv. 성장" />
                <MapPerson className="left-[38%] top-[44%]" name="목자" state="Lv.1" />
                <MapPerson className="left-[56%] top-[51%]" name="양" state="반응" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5efe5] text-[#15120d]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-5 lg:grid-cols-3">
            {labPrinciples.map((item) => (
              <article key={item.title} className="rounded-[32px] border border-[#dfd0bd] bg-white p-7 shadow-[0_18px_44px_rgba(72,50,24,0.07)]">
                <h2 className="text-[1.55rem] font-semibold tracking-[-0.04em]">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[#6b5d4f]">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111827] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.24em] text-white/40">CORE LOOP</p>
            <h2 className="mt-5 text-[2.3rem] font-semibold leading-[1.06] tracking-[-0.06em] sm:text-[3.6rem]">
              MVP는 하나의 반복 행동을
              <br />
              먼저 제대로 만듭니다
            </h2>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {worldLoop.map((item, index) => (
              <div key={item} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-[11px] tracking-[0.18em] text-[#9bdcff]/70">STEP {String(index + 1).padStart(2, "0")}</p>
                <p className="mt-3 text-sm font-semibold text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function MapHouse({ className, title, meta }: { className: string; title: string; meta: string }) {
  return (
    <div className={`absolute w-[112px] rounded-[20px] border border-white/10 bg-[#fbf6ed14] p-3 backdrop-blur-sm ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xl">🏠</span>
        <span className="rounded-full border border-white/10 bg-black/10 px-2 py-0.5 text-[10px] text-white/60">퀘스트</span>
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
