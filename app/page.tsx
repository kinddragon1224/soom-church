import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { getCurrentUserId, isLoggedIn } from "@/lib/auth";
import { isPlatformAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const painPoints = [
  "메시지는 있는데 전달이 약할 때",
  "채널은 있는데 운영이 멈춰 있을 때",
  "행사는 준비하는데 안내가 자꾸 엉킬 때",
];

const workspaceFeatures = [
  {
    title: "사역과 운영을 한곳에서",
    desc: "대시보드, 사람 관리, 공지, 작업 흐름을 한 워크스페이스 안에서 정리합니다.",
  },
  {
    title: "무료로 먼저 시작",
    desc: "처음부터 큰 결제를 요구하지 않습니다. 가볍게 써보고 필요한 만큼 확장할 수 있게 준비합니다.",
  },
  {
    title: "교회 흐름에 맞는 구조",
    desc: "교회와 사역팀이 실제로 쓰는 언어와 흐름을 기준으로, 복잡하지 않게 시작할 수 있게 만듭니다.",
  },
];

const principles = [
  {
    title: "분별",
    desc: "지금 가장 급한 일이 무엇인지 먼저 가려냅니다. 많이 만드는 것보다 먼저 해야 할 일을 정리합니다.",
  },
  {
    title: "구별",
    desc: "교회와 사역의 메시지가 섞이지 않도록 결을 세웁니다. 비슷한 문구 대신, 이 공동체다운 방향을 찾습니다.",
  },
  {
    title: "차이",
    desc: "결과물이 실제 전달의 차이로 이어지게 돕습니다. 보기 좋기만 한 것이 아니라 더 잘 이해되고 더 오래 남게 만듭니다.",
  },
];

const serviceCards = [
  {
    label: "서브 서비스",
    title: "쇼츠 · 홍보영상",
    price: "from 30만 원",
    desc: "설교와 행사를 짧고 선명한 영상으로 만듭니다.",
    points: ["설교 쇼츠", "행사 홍보영상", "소개 영상"],
  },
  {
    label: "서브 서비스",
    title: "유튜브 운영 세팅",
    price: "from 80만 원",
    desc: "채널이 꾸준히 운영될 수 있게 기본 흐름을 잡아드립니다.",
    points: ["채널 구조", "썸네일·제목", "업로드 흐름"],
  },
  {
    label: "서브 서비스",
    title: "행사 랜딩 · 안내 제작",
    price: "from 120만 원",
    desc: "행사 소개부터 신청과 안내까지 한 번에 정리합니다.",
    points: ["행사 랜딩", "신청 안내", "홍보물"],
  },
];

const trustPoints = [
  "목회자는 메시지에 더 집중할 수 있습니다.",
  "사역자는 반복되는 운영 부담을 줄일 수 있습니다.",
  "공동체는 더 선명한 전달 구조를 갖게 됩니다.",
];

const guideTopics = [
  "목회자는 AI를 어디까지 써도 괜찮을까",
  "설교 준비에 AI를 어떻게 보조 도구로 쓸 수 있을까",
  "주보와 공지 문구를 AI로 더 빠르게 정리하는 법",
];

export default async function HomePage() {
  const loggedIn = await isLoggedIn();
  const currentUserId = loggedIn ? await getCurrentUserId() : null;
  const currentUser = currentUserId ? await prisma.user.findUnique({ where: { id: currentUserId }, select: { email: true } }) : null;
  const adminMode = isPlatformAdminEmail(currentUser?.email);

  return (
    <main className="min-h-screen bg-[#050b16] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#050b16]">
        <div
          className="absolute inset-0 bg-cover bg-[position:72%_22%] sm:bg-center"
          style={{ backgroundImage: "url('/hero-church-main.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,22,0.94)_0%,rgba(5,11,22,0.7)_46%,rgba(5,11,22,0.42)_100%)] sm:bg-[linear-gradient(90deg,rgba(5,11,22,0.9)_0%,rgba(5,11,22,0.6)_44%,rgba(5,11,22,0.38)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,22,0.18)_0%,rgba(5,11,22,0.12)_24%,rgba(5,11,22,0.88)_100%)] sm:bg-[linear-gradient(180deg,rgba(5,11,22,0.2)_0%,rgba(5,11,22,0.18)_30%,rgba(5,11,22,0.82)_100%)]" />

        <div className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col px-5 pb-4 pt-3 sm:min-h-screen sm:px-8 sm:pb-10 lg:px-10">
          <SiteHeader theme="dark" current="home" ctaHref="/signup" ctaLabel="무료로 시작하기" loggedIn={loggedIn} adminMode={adminMode} />

          <div className="flex flex-1 items-start pt-8 pb-5 sm:items-end sm:py-24 lg:py-28">
            <div className="max-w-5xl">
              <p className="text-[10px] tracking-[0.15em] text-white/48 sm:text-xs sm:tracking-[0.24em]">SOOM WORKSPACE FOR CHURCHES</p>
              <h1 className="mt-2 font-display text-[2.06rem] font-semibold leading-[0.88] tracking-[-0.09em] text-white sm:mt-5 sm:text-[4.5rem] lg:text-[5.9rem]">
                교회를 돕다
              </h1>
              <p className="mt-2 max-w-[17rem] text-[0.86rem] leading-[1.34] text-white/80 sm:mt-6 sm:max-w-3xl sm:text-lg sm:leading-8">
                쇼츠, 유튜브 운영,
                <br className="sm:hidden" /> 행사 안내 제작까지
              </p>
              <p className="mt-2 max-w-[19rem] text-[0.82rem] leading-[1.42] text-white/62 sm:mt-4 sm:max-w-3xl sm:text-base sm:leading-7">
                교회와 사역을 위한 워크스페이스를 만들고,
                <br className="sm:hidden" /> 필요하면 실행까지 함께합니다.
              </p>

              <div className="mt-4 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
                <Link href="/signup" className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-[13px] font-semibold text-[#09111f] transition hover:bg-white/90 sm:min-h-12 sm:px-6 sm:text-sm">
                  무료로 시작하기
                </Link>
                <Link href="/workspace" className="inline-flex h-10 items-center justify-center rounded-full border border-white/30 bg-white/5 px-5 text-[13px] font-medium text-white transition hover:bg-white/10 sm:min-h-12 sm:px-6 sm:text-sm">
                  워크스페이스 보기
                </Link>
              </div>

              <div className="mt-5 grid max-w-[20rem] gap-2 text-[11px] text-white/70 sm:mt-6 sm:max-w-none sm:flex sm:flex-wrap sm:gap-2.5 sm:text-xs">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">무료로 먼저 시작</span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">필요할 때 실행 서비스 연결</span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">교회 운영 흐름 기준</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f4ee] text-[#0c1220]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.24em] text-[#7a6f67]">DISCERNMENT</p>
            <h2 className="mt-5 font-display text-[2.05rem] leading-[1.06] tracking-[-0.05em] sm:text-[3.5rem]">
              먼저 봅니다
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#5d667d] sm:text-base">
              해야 할 일은 많은데 우선순위는 흐려질 수 있습니다. 숨은 먼저 해야 할 일부터 정리하고 바로 움직일 시작점을 함께 찾습니다.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-3">
            {painPoints.map((item) => (
              <article key={item} className="rounded-[26px] border border-[#e6dfd5] bg-white p-6 shadow-[0_16px_40px_rgba(16,24,40,0.06)] sm:rounded-[30px] sm:p-7">
                <p className="text-[1.2rem] font-semibold leading-8 tracking-[-0.03em] text-[#0c1220]">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#070d18]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.24em] text-white/38">WORKSPACE</p>
            <h2 className="mt-5 font-display text-[2.05rem] leading-[1.06] tracking-[-0.05em] text-white sm:text-[3.5rem]">
              교회와 사역을 위한 워크스페이스를
              <br />
              무료로 먼저 시작하세요
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/60 sm:text-base">
              숨의 주력 상품은 워크스페이스입니다. 교회와 사역팀이 실제로 쓰는 흐름을 기준으로, 운영과 전달을 한곳에서 정리할 수 있게 돕습니다.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-3">
            {workspaceFeatures.map((item) => (
              <article key={item.title} className="rounded-[26px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.28)] sm:rounded-[30px] sm:p-7">
                <h3 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/68">{item.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/app/soom-dev/dashboard" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#09111f]">
              워크스페이스 보기
            </Link>
            <Link href="/signup" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 text-sm font-medium text-white">
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f1ec] text-[#0c1220]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.24em] text-[#7a6f67]">PRINCIPLES</p>
            <h2 className="mt-5 font-display text-[2.05rem] leading-[1.06] tracking-[-0.05em] sm:text-[3.5rem]">
              우리는 먼저 분별하고,
              <br />
              분명하게 구별하고,
              <br />
              결국 차이를 만듭니다
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-3">
            {principles.map((item) => (
              <article key={item.title} className="rounded-[26px] border border-[#e6dfd5] bg-white p-6 shadow-[0_16px_40px_rgba(16,24,40,0.06)] sm:rounded-[30px] sm:p-7">
                <p className="text-xs tracking-[0.2em] text-[#9a8b7a]">{item.title}</p>
                <h3 className="mt-3 text-[1.5rem] font-semibold tracking-[-0.03em] text-[#0c1220]">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#475069]">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050b16]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.24em] text-white/38">SUB SERVICES</p>
            <h2 className="mt-5 font-display text-[2.05rem] leading-[1.06] tracking-[-0.05em] text-white sm:text-[3.5rem]">
              필요할 때,
              <br />
              실행 서비스로 이어집니다
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/60 sm:text-base">
              워크스페이스를 쓰다가 필요한 시점에 쇼츠 제작, 유튜브 운영 세팅, 행사 랜딩 제작까지 연결할 수 있습니다.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-3">
            {serviceCards.map((item) => (
              <article key={item.title} className="rounded-[26px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.28)] sm:rounded-[30px] sm:p-7">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs tracking-[0.18em] text-white/38">{item.label}</p>
                  <span className="rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-1 text-[11px] font-medium text-[#f2deb3]">{item.price}</span>
                </div>
                <h3 className="mt-3 text-[1.55rem] font-semibold tracking-[-0.03em] text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/68">{item.desc}</p>
                <ul className="mt-6 grid gap-2 text-sm leading-7 text-white/72">
                  {item.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f4ee] text-[#0c1220]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.24em] text-[#7a6f67]">WHY SOOM</p>
            <h2 className="mt-5 font-display text-[2.05rem] leading-[1.06] tracking-[-0.05em] sm:text-[3.5rem]">
              왜 숨이어야 할까요
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#5d667d] sm:text-base">
              숨은 보기 좋은 결과보다 먼저 전달 구조를 봅니다.
              교회와 사역의 메시지가 실제 움직임으로 이어지게 함께 정리합니다.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-3">
            {trustPoints.map((item) => (
              <article key={item} className="rounded-[26px] border border-[#e6dfd5] bg-white p-6 shadow-[0_16px_40px_rgba(16,24,40,0.06)] sm:rounded-[30px] sm:p-7">
                <p className="text-sm leading-7 text-[#334155]">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white text-[#0c1220]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="text-xs tracking-[0.24em] text-[#7a6f67]">BLOG</p>
              <h2 className="mt-5 font-display text-[2.2rem] leading-[1.08] tracking-[-0.05em] sm:text-[3.4rem]">
                블로그는
                <br />
                매출보다 신뢰를 위한 공간입니다
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#5d667d] sm:text-base">
                목회와 AI를 함께 다루는 글을 차근차근 쌓고 있습니다. 목회자와 사역자가 실제로 참고할 수 있는 내용부터 먼저 정리합니다.
              </p>
              <div className="mt-8">
                <Link href="/ai-guides" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-semibold text-white">
                  블로그 보기
                </Link>
              </div>
            </div>
            <div className="grid gap-3">
              {guideTopics.map((topic, index) => (
                <article key={topic} className="rounded-[24px] border border-[#e6dfd5] bg-[#f7f4ee] px-5 py-5 shadow-[0_16px_40px_rgba(20,30,60,0.06)]">
                  <p className="text-xs tracking-[0.16em] text-[#9a8b7a]">0{index + 1}</p>
                  <p className="mt-3 text-base leading-7 text-[#334155]">{topic}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#050b16]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-8 rounded-[36px] border border-white/10 bg-[#0b1327]/92 p-7 shadow-[0_24px_80px_rgba(2,6,23,0.42)] lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
            <div>
              <p className="text-xs tracking-[0.24em] text-white/38">START FREE</p>
              <h2 className="mt-5 font-display text-[2.2rem] leading-[1.08] tracking-[-0.05em] text-white sm:text-[3.2rem]">
                지금 필요한 것이
                <br />
                분별인지, 정리인지, 실행인지
                <br />
                함께 확인해보세요
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/62 sm:text-base">
                먼저 무료 워크스페이스로 시작해보세요. 필요하면 이후에 콘텐츠 제작이나 운영 확장까지 이어갈 수 있습니다.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#09111f]">
                  무료로 시작하기
                </Link>
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 text-sm font-medium text-white">
                  문의하기
                </Link>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="rounded-[24px] border border-white/8 bg-[#091122] px-5 py-5">
                <p className="text-xs tracking-[0.16em] text-white/38">01</p>
                <p className="mt-2 text-sm leading-7 text-white/82">무료 워크스페이스로 먼저 흐름을 정리합니다.</p>
              </div>
              <div className="rounded-[24px] border border-white/8 bg-[#091122] px-5 py-5">
                <p className="text-xs tracking-[0.16em] text-white/38">02</p>
                <p className="mt-2 text-sm leading-7 text-white/82">필요하면 콘텐츠 제작과 운영 확장을 이어갑니다.</p>
              </div>
              <div className="rounded-[24px] border border-white/8 bg-[#091122] px-5 py-5">
                <p className="text-xs tracking-[0.16em] text-white/38">03</p>
                <p className="mt-2 text-sm leading-7 text-white/82">나중에 결제와 플랜이 붙어도, 지금은 가볍게 시작할 수 있게 설계합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
