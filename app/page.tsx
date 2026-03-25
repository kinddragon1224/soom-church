import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { getCurrentUserId, isLoggedIn } from "@/lib/auth";
import { isPlatformAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const workspaceFeatures = [
  {
    title: "교회 운영 흐름을 한곳에서",
    desc: "사람, 공지, 작업, 기록을 흩어지지 않게 정리합니다.",
  },
  {
    title: "무료로 먼저 시작",
    desc: "큰 결정보다 실제 사용 경험을 먼저 확인합니다.",
  },
  {
    title: "필요할 때만 실행 연결",
    desc: "콘텐츠 제작과 운영 확장은 필요한 순간에만 이어집니다.",
  },
];

const workspaceMetrics = [
  { label: "정리되는 운영 축", value: "공지 · 사람 · 작업" },
  { label: "시작 방식", value: "무료 워크스페이스" },
  { label: "확장 방식", value: "필요 시 실행 연결" },
];

const blogHighlights = ["목회와 운영 인사이트", "AI 활용 가이드", "실행형 콘텐츠 아카이브"];

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
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,22,0.4)_0%,rgba(5,11,22,0.44)_24%,rgba(5,11,22,0.72)_56%,rgba(5,11,22,0.96)_100%)] sm:bg-[linear-gradient(180deg,rgba(5,11,22,0.26)_0%,rgba(5,11,22,0.34)_24%,rgba(5,11,22,0.68)_58%,rgba(5,11,22,0.94)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle_at_bottom,rgba(125,211,252,0.18),rgba(5,11,22,0)_72%)] sm:h-56" />

        <div className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col px-5 pb-6 pt-3 sm:min-h-screen sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="home" ctaHref="/signup" ctaLabel="회원가입" loggedIn={loggedIn} adminMode={adminMode} />

          <div className="flex flex-1 items-center py-16 sm:py-24 lg:py-28">
            <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.1fr)_360px] lg:items-end lg:gap-12">
              <div className="max-w-4xl text-center lg:text-left">
                <p className="text-[10px] tracking-[0.22em] text-white/52 sm:text-xs sm:tracking-[0.28em]">SOOM WORKSPACE FOR CHURCHES</p>
                <h1 className="mt-5 text-[3.15rem] font-light leading-[0.9] tracking-[-0.08em] text-white sm:text-[6.2rem] lg:text-[7.4rem] xl:text-[8.2rem]">
                  교회를 돕다
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/76 sm:text-base sm:leading-8 lg:max-w-3xl">
                  교회 운영은 워크스페이스로 정리하고,
                  콘텐츠와 전달은 필요한 순간에 실행으로 연결합니다.
                </p>
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Link href="/signup" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#09111f]">
                    무료로 시작하기
                  </Link>
                  <Link href="/workspace" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-medium text-white backdrop-blur-sm">
                    워크스페이스 보기
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 rounded-[30px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-md sm:p-5 lg:self-end">
                {workspaceMetrics.map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-white/8 bg-black/10 px-4 py-4">
                    <p className="text-[11px] tracking-[0.2em] text-white/42">{item.label}</p>
                    <p className="mt-2 text-sm font-medium leading-6 text-white/88">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#08111f]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-18">
          <div className="grid gap-4 lg:grid-cols-3">
            {workspaceFeatures.map((item) => (
              <article key={item.title} className="rounded-[28px] border border-white/8 bg-white/[0.03] p-6 shadow-[0_18px_50px_rgba(2,6,23,0.24)]">
                <h2 className="text-[1.45rem] font-semibold tracking-[-0.04em] text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/62">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f4ee] text-[#111111]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-[11px] tracking-[0.24em] text-[#9a8b7a]">BLOG</p>
              <h2 className="mt-4 text-[2.35rem] font-semibold leading-[1.02] tracking-[-0.06em] text-[#111111] sm:text-[3.9rem]">
                블로그와 콘텐츠를
                <br />
                신뢰 자산으로 쌓습니다
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#5f5a52] sm:text-base sm:leading-8">
                글을 쌓는 데서 끝나지 않고, 교회가 실제로 참고하고 공유할 수 있는 인사이트 구조로 정리합니다.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {blogHighlights.map((item) => (
                  <span key={item} className="rounded-full border border-[#e2d6c7] bg-white px-3 py-1.5 text-xs text-[#8C6A2E]">
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/ai-guides" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-semibold text-white">
                  블로그 보기
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/ai-guides" className="group overflow-hidden rounded-[32px] bg-[#111111] shadow-[0_18px_46px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5">
                <div className="relative h-[420px] overflow-hidden sm:h-[460px]">
                  <img src="/blog-hero-person.png" alt="Soom blog" className="h-full w-full object-cover object-[center_22%] transition duration-500 group-hover:scale-[1.01]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,11,0.04)_0%,rgba(5,7,11,0.14)_34%,rgba(5,7,11,0.86)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[11px] tracking-[0.18em] text-white/56">SOOM BLOG</p>
                    <p className="mt-3 text-[1.7rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white">목회와 운영 인사이트</p>
                  </div>
                </div>
              </Link>
              <div className="grid gap-4">
                <Link href="/workspace" className="group overflow-hidden rounded-[32px] bg-[#111111] shadow-[0_18px_46px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5">
                  <div className="relative h-[202px] overflow-hidden">
                    <img src="/hero-church-main.png" alt="Soom workspace" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.04)_0%,rgba(17,17,17,0.18)_35%,rgba(17,17,17,0.9)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-[11px] tracking-[0.18em] text-white/56">WORKSPACE</p>
                      <p className="mt-2 text-[1.25rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white">무료로 시작하는 교회 워크스페이스</p>
                    </div>
                  </div>
                </Link>
                <Link href="/pricing" className="group overflow-hidden rounded-[32px] bg-[#111111] shadow-[0_18px_46px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5">
                  <div className="relative h-[202px] overflow-hidden">
                    <img src="/hero-church-main.png" alt="Soom studio" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.04)_0%,rgba(17,17,17,0.18)_35%,rgba(17,17,17,0.9)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-[11px] tracking-[0.18em] text-white/56">STUDIO</p>
                      <p className="mt-2 text-[1.25rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white">필요할 때 연결되는 콘텐츠 스튜디오</p>
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
