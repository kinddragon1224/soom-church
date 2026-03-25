import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";

const howWeWork = [
  {
    title: "먼저 흐름을 정리합니다",
    desc: "무엇을 만들기 전에 사람, 공지, 작업, 기록이 어디서 어떻게 움직이는지부터 봅니다.",
  },
  {
    title: "한곳에 모읍니다",
    desc: "흩어진 운영 요소를 하나의 흐름 안에서 이어질 수 있도록 정리합니다.",
  },
  {
    title: "필요할 때 연결합니다",
    desc: "콘텐츠 제작이나 전달 작업도 운영 안에서 필요한 순간 자연스럽게 이어지도록 설계합니다.",
  },
];

const principles = [
  {
    title: "운영은 가볍게",
    desc: "복잡한 관리보다, 실제로 굴러가는 흐름을 우선합니다.",
  },
  {
    title: "전달은 정확하게",
    desc: "필요한 정보가 필요한 사람에게 끊기지 않고 가야 합니다.",
  },
  {
    title: "구조는 계속 남게",
    desc: "한 번 쓰고 끝나는 정리보다, 반복해서 사용할 수 있는 구조를 지향합니다.",
  },
];

const whatSoomBuilds = [
  {
    title: "워크스페이스",
    desc: "교회 운영의 기본 흐름을 한곳에 모으는 공간",
  },
  {
    title: "인사이트 아카이브",
    desc: "운영과 사역에 도움이 되는 실행형 글과 가이드",
  },
  {
    title: "콘텐츠 스튜디오 연결",
    desc: "운영 안에서 필요해지는 영상, 페이지, 전달 작업의 연결 기능",
  },
];

const team = [
  {
    role: "운영 구조 설계 · 기획 · 제품 방향",
    name: "김선용",
    desc: "숨의 방향을 설계합니다. 교회 운영에서 무엇이 먼저 정리되어야 하는지, 어떤 흐름이 실제로 필요한지, 그것이 어떻게 제품 구조로 이어져야 하는지를 고민합니다.",
    image: "/team/kim-sunyong.png",
    imageAlt: "김선용 프로필 이미지",
  },
  {
    role: "기술 개발 · 구현",
    name: "최재성",
    desc: "숨의 구조를 실제 서비스로 구현합니다. 기획된 흐름이 화면과 기능 안에서 자연스럽게 작동하도록 웹 개발과 구현을 맡고 있습니다.",
    image: null,
    imageAlt: "최재성 프로필 이미지 자리",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f3f0e8] text-[#0c1220]">
      <section className="border-b border-[#e6dfd5] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader current="about" />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-5xl">
            <p className="text-xs tracking-[0.24em] text-[#7a6f67]">ABOUT SOOM</p>
            <h1 className="mt-5 text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.06em] text-[#111827] sm:text-[4.4rem]">
              숨은 교회 운영을 위한
              <br />
              워크스페이스를 만드는 팀입니다
            </h1>
            <div className="mt-8 max-w-3xl space-y-5 text-sm leading-8 text-[#4c566d] sm:text-base">
              <p>
                교회 안에는 늘 해야 할 일이 많습니다. 사람을 정리해야 하고, 공지를 전달해야 하고, 작업을 나눠야 하고,
                기록을 남겨야 하고, 필요할 때는 콘텐츠와 안내까지 연결해야 합니다.
              </p>
              <p>
                문제는 이 흐름이 자주 흩어진다는 데 있습니다. 공지와 기록은 여기저기 나뉘고, 작업은 사람마다 따로 움직이고,
                행사와 전달은 늘 급하게 붙습니다.
              </p>
              <p>
                숨은 그 흩어진 운영의 흐름을 한곳에 모으기 위해 시작했습니다. 교회와 사역이 더 선명하게 움직일 수 있도록,
                운영의 기준이 되는 워크스페이스를 만들고 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
          <div className="rounded-[36px] border border-[#e6dfd5] bg-white p-7 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
              <div>
                <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">WHY WE STARTED</p>
                <h2 className="mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.05em] text-[#111827] sm:text-[3rem]">
                  왜 숨을 시작했는가
                </h2>
              </div>
              <div className="space-y-5 text-sm leading-8 text-[#44506d] sm:text-base">
                <p>
                  교회 운영은 늘 바쁘지만, 정작 흐름은 한곳에 모여 있지 않은 경우가 많습니다.
                </p>
                <p>
                  사람 정보는 따로 있고, 공지와 일정은 흩어져 있고, 해야 할 작업은 구두로 오가고, 기록은 남아도 다시 찾기 어렵습니다.
                </p>
                <p>
                  행사나 사역 안내가 필요할 때마다 새로 페이지를 만들고, 새로 전달물을 정리하고, 새로 설명해야 하는 일도 반복됩니다.
                </p>
                <p>
                  숨은 이 반복을 줄이고 싶었습니다. 교회와 사역의 운영이 사람의 기억과 헌신만으로 버티지 않도록,
                  기본 흐름을 정리하는 워크스페이스가 필요하다고 보았습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0f172a] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.24em] text-white/40">HOW WE WORK</p>
            <h2 className="mt-5 text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.05em] sm:text-[3.2rem]">
              숨은 이렇게 일합니다
            </h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {howWeWork.map((item) => (
              <article key={item.title} className="rounded-[30px] border border-white/10 bg-white/[0.03] p-7">
                <h3 className="text-[1.4rem] font-semibold tracking-[-0.03em] text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/64">{item.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {principles.map((item) => (
              <article key={item.title} className="rounded-[30px] border border-white/10 bg-white/[0.03] p-7">
                <h3 className="text-[1.4rem] font-semibold tracking-[-0.03em] text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/64">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <div>
              <p className="text-xs tracking-[0.24em] text-[#7a6f67]">WHAT SOOM BUILDS</p>
              <h2 className="mt-5 text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.05em] text-[#111827] sm:text-[3.2rem]">
                숨이 만들고 있는 것
              </h2>
              <div className="mt-6 space-y-5 text-sm leading-8 text-[#44506d] sm:text-base">
                <p>
                  숨은 교회를 위한 운영 워크스페이스를 중심에 두고 있습니다.
                </p>
                <p>
                  사람, 공지, 작업, 기록을 한곳에서 정리하고 이어갈 수 있는 구조, 그리고 필요할 때 콘텐츠와 전달까지 연결되는 흐름.
                </p>
                <p>
                  우리는 단순한 제작 도구보다 운영의 기준이 되는 제품을 만들고 싶습니다.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              {whatSoomBuilds.map((item) => (
                <article key={item.title} className="rounded-[28px] border border-[#e6dfd5] bg-white p-6 shadow-[0_16px_36px_rgba(16,24,40,0.05)]">
                  <h3 className="text-[1.35rem] font-semibold leading-[1.12] tracking-[-0.04em] text-[#111827]">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#5d667d]">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="flex flex-col gap-4">
            <p className="text-xs tracking-[0.24em] text-[#7a6f67]">TEAM</p>
            <h2 className="text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.05em] text-[#111827] sm:text-[3.2rem]">
              숨을 만드는 사람들
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[#5d667d] sm:text-base">
              숨은 기획과 구현이 분리되지 않는 팀입니다. 운영의 문제를 먼저 정의하고, 그것이 실제 제품과 화면 안에서 작동하도록 함께 만듭니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {team.map((member) => (
              <article key={member.name} className="rounded-[34px] border border-[#e6dfd5] bg-white p-7 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-8">
                <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#201c21_0%,#4a2530_45%,#131b2b_100%)]">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.imageAlt}
                      fill
                      className="object-cover object-center scale-[0.82]"
                      sizes="(min-width: 1024px) 40vw, 100vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm tracking-[0.18em] text-white/48">
                      IMAGE PLACEHOLDER
                    </div>
                  )}
                </div>
                <p className="text-sm tracking-[0.18em] text-[#8a7d72]">{member.role}</p>
                <h3 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#0c1220]">{member.name}</h3>
                <p className="mt-5 text-sm leading-8 text-[#44506d] sm:text-base">{member.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
          <div className="rounded-[36px] border border-[#e6dfd5] bg-white p-7 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
              <div>
                <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">VISION</p>
                <h2 className="mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.05em] text-[#111827] sm:text-[3rem]">
                  우리가 만들고 싶은 것
                </h2>
              </div>
              <div className="space-y-5 text-sm leading-8 text-[#44506d] sm:text-base">
                <p>
                  숨은 단순히 기능 몇 개를 붙인 도구에 머물고 싶지 않습니다. 교회와 사역이 운영 때문에 지치지 않도록, 흐름을 정리하고 반복을 줄이고, 필요한 전달까지 자연스럽게 이어지는 구조를 만들고 싶습니다.
                </p>
                <p>
                  좋은 사역은 늘 사람의 헌신 위에만 서 있어서는 오래가기 어렵습니다. 우리는 그 헌신이 더 오래 이어질 수 있도록 운영의 바닥을 정리하는 제품을 만들고 싶습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
          <div className="rounded-[36px] border border-[#e6dfd5] bg-white p-7 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-10">
            <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">CTA</p>
            <h2 className="mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.05em] text-[#111827] sm:text-[3rem]">
              숨은 지금
              <br />
              교회를 위한 운영 워크스페이스를 만들어가고 있습니다
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-[#44506d] sm:text-base">
              운영을 한곳에 모으고, 필요한 순간 전달까지 이어가고 싶다면 숨의 흐름을 함께 살펴보세요.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/workspace" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-semibold text-white">
                워크스페이스 보기
              </Link>
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ddd2c3] px-6 text-sm font-medium text-[#0c1220]">
                문의하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
