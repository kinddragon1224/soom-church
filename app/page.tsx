import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { getCurrentUserId, isLoggedIn } from "@/lib/auth";
import { isPlatformAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const workspaceFeatures = [
  {
    title: "운영을 한곳에",
    desc: "사람, 공지, 작업, 기록을 흩어지지 않게 정리합니다.",
  },
  {
    title: "부담 없이 시작",
    desc: "큰 결정보다 실제 사용 경험을 먼저 확인합니다.",
  },
  {
    title: "필요할 때 실행 연결",
    desc: "콘텐츠 제작과 운영 확장은 필요한 순간에만 이어집니다.",
  },
];

const blogHighlights = ["운영 인사이트", "AI 가이드", "실행형 콘텐츠"];

export default async function HomePage() {
  const loggedIn = await isLoggedIn();
  const currentUserId = loggedIn ? await getCurrentUserId() : null;
  const currentUser = currentUserId ? await prisma.user.findUnique({ where: { id: currentUserId }, select: { email: true } }) : null;
  const adminMode = isPlatformAdminEmail(currentUser?.email);

  return (
    <main className="min-h-screen cursor-default select-none bg-[#050b16] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#050b16]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-church-main.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,22,0.34)_0%,rgba(5,11,22,0.4)_28%,rgba(5,11,22,0.92)_100%)] sm:bg-[linear-gradient(180deg,rgba(5,11,22,0.24)_0%,rgba(5,11,22,0.34)_28%,rgba(5,11,22,0.88)_100%)]" />

        <div className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col px-5 pb-6 pt-3 sm:min-h-screen sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="home" ctaHref="/signup" ctaLabel="회원가입" loggedIn={loggedIn} adminMode={adminMode} />

          <div className="flex flex-1 items-center justify-center py-14 sm:py-20 lg:py-24">
            <div className="max-w-5xl text-center">
              <p className="text-[10px] tracking-[0.22em] text-white/52 sm:text-xs sm:tracking-[0.28em]">SOOM WORKSPACE FOR CHURCHES</p>
              <h1 className="mt-3 text-[2.8rem] font-light leading-[0.98] tracking-[-0.075em] text-white sm:text-[5.6rem] lg:text-[7.2rem]">
                교회를 위한
                <br />
                워크스페이스
              </h1>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#09111f]">
                  무료로 시작하기
                </Link>
                <Link href="/workspace" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-medium text-white">
                  워크스페이스 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#08111f]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-18">
          <div className="grid gap-4 lg:grid-cols-3">
            {workspaceFeatures.map((item) => (
              <article key={item.title} className="rounded-[28px] border border-white/12 bg-white/[0.02] p-6 shadow-[0_10px_24px_rgba(2,6,23,0.12)] backdrop-blur-sm">
                <h2 className="text-[1.45rem] font-semibold tracking-[-0.04em] text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/62">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f2eee7] text-[#111111]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <h2 className="text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.055em] text-[#111111] sm:text-[3.35rem] lg:max-w-[520px]">
                교회와 사역을 위한 인사이트 아카이브
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {blogHighlights.map((item) => (
                  <span key={item} className="rounded-full border border-[#ddd3c5] bg-white/78 px-2.5 py-1 text-[11px] text-[#8C6A2E] backdrop-blur-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/ai-guides" className="group overflow-hidden rounded-[32px] bg-[#111111] shadow-[0_18px_46px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5">
                <div className="relative h-[420px] overflow-hidden sm:h-[460px]">
                  <img src="/blog-hero-portrait-dark.jpg" alt="Soom blog" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.04)_0%,rgba(17,17,17,0.18)_35%,rgba(17,17,17,0.9)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="mt-3 text-[1.7rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white">인사이트 아카이브</p>
                  </div>
                </div>
              </Link>
              <div className="grid gap-4">
                <Link href="/workspace" className="group overflow-hidden rounded-[32px] bg-[#111111] shadow-[0_18px_46px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5">
                  <div className="relative h-[202px] overflow-hidden">
                    <img src="/home-workspace-card.jpg" alt="Soom workspace" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.04)_0%,rgba(17,17,17,0.18)_35%,rgba(17,17,17,0.9)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="mt-2 text-[1.18rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white">워크스페이스 체험</p>
                    </div>
                  </div>
                </Link>
                <Link href="/pricing" className="group overflow-hidden rounded-[32px] bg-[#111111] shadow-[0_18px_46px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5">
                  <div className="relative h-[202px] overflow-hidden">
                    <img src="/home-studio-card.jpg" alt="Soom studio" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.04)_0%,rgba(17,17,17,0.18)_35%,rgba(17,17,17,0.9)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="mt-2 text-[1.18rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white">스튜디오 연결</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
