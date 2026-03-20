import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";

const values = [
  {
    title: "먼저 정리합니다",
    desc: "무조건 만들기부터 하지 않습니다. 무엇을 보여줘야 하는지, 무엇이 먼저 전달되어야 하는지부터 정리합니다.",
  },
  {
    title: "목적에 맞게 만듭니다",
    desc: "같은 디자인, 같은 페이지라도 행사 소개용인지, 사역 안내용인지, 반복 운영용인지에 따라 구조가 달라집니다.",
  },
  {
    title: "계속 이어질 수 있게 만듭니다",
    desc: "한 번 쓰고 버리는 결과물보다 반복해서 설명하고 전달하고 운영할 수 있는 구조를 지향합니다.",
  },
];

const team = [
  {
    name: "김선용",
    role: "브랜드 디렉션 · 기획 · 제품 설계",
    desc: "선용은 숨의 방향을 설계합니다. 무엇을 먼저 보여줘야 하는지, 어떤 메시지가 브랜드의 중심이 되어야 하는지, 그리고 그것이 실제 서비스와 결과물로 어떻게 이어져야 하는지를 다룹니다.",
    image: "/team/kim-sunyong.png",
    imageAlt: "김선용 프로필 이미지",
  },
  {
    name: "최재성",
    role: "기술 개발 · 구현",
    desc: "재성은 숨의 구조와 기능을 실제 서비스로 구현합니다. 기획된 흐름이 화면과 기능 안에서 정확하게 작동하도록, 웹 개발과 구현의 완성도를 책임집니다.",
    image: null,
    imageAlt: "재성 프로필 이미지 자리",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#0c1220]">
      <section className="border-b border-[#e6dfd5] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader current="about" />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.24em] text-[#7a6f67]">ABOUT SOOM</p>
            <h1 className="mt-5 font-display text-[2.6rem] leading-[1.05] tracking-[-0.06em] sm:text-[4.4rem]">
              숨은 교회와 사역의
              <br />
              전달을 설계하는 팀입니다
            </h1>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-[#5d667d] sm:text-base">
              우리는 보기 좋은 결과물만 만들지 않습니다. 무엇을 말해야 하는지, 어떻게 보여줘야 하는지,
              그리고 그것이 어떻게 전달되어야 하는지까지 함께 설계합니다.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
          <div className="rounded-[36px] border border-[#e6dfd5] bg-white p-7 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">WHY WE STARTED</p>
                <h2 className="mt-5 font-display text-[2rem] leading-[1.08] tracking-[-0.05em] sm:text-[3rem]">
                  왜 숨을 시작했는가
                </h2>
              </div>
              <div className="space-y-5 text-sm leading-8 text-[#44506d] sm:text-base">
                <p>
                  교회와 사역 현장에는 좋은 내용이 많습니다. 하지만 그것이 늘 잘 전달되는 것은 아닙니다.
                </p>
                <p>
                  소개해야 할 사역은 많은데 정리가 어렵고, 행사를 알리려면 페이지와 디자인이 필요하고,
                  메시지를 더 넓게 전하려면 영상과 반복 콘텐츠가 필요합니다.
                </p>
                <p>
                  숨은 바로 그 사이를 메우기 위해 시작했습니다. 사역의 메시지와 현장의 필요를 이해하고,
                  그것을 실제로 전달되는 결과물로 만드는 팀. 그것이 숨이 하려는 일입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#111827] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.24em] text-white/40">HOW WE WORK</p>
            <h2 className="mt-5 font-display text-[2.1rem] leading-[1.08] tracking-[-0.05em] sm:text-[3.2rem]">
              숨은 이렇게 일합니다
            </h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {values.map((value) => (
              <article key={value.title} className="rounded-[30px] border border-white/10 bg-white/[0.03] p-7">
                <h3 className="text-[1.4rem] font-semibold tracking-[-0.03em] text-white">{value.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/64">{value.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="flex flex-col gap-4">
            <p className="text-xs tracking-[0.24em] text-[#7a6f67]">TEAM</p>
            <h2 className="font-display text-[2.1rem] leading-[1.08] tracking-[-0.05em] sm:text-[3.2rem]">
              숨을 만드는 사람들
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[#5d667d] sm:text-base">
              숨은 기획과 제작이 분리되지 않는 팀입니다. 전달의 방향을 세우고, 그것을 결과물로 끝까지 구현합니다.
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
        <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
          <div className="rounded-[36px] border border-[#e6dfd5] bg-white p-7 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">VISION</p>
                <h2 className="mt-5 font-display text-[2rem] leading-[1.08] tracking-[-0.05em] sm:text-[3rem]">
                  우리가 만들고 싶은 것
                </h2>
              </div>
              <div className="space-y-5 text-sm leading-8 text-[#44506d] sm:text-base">
                <p>
                  숨은 단순히 외주 결과물을 납품하는 팀에 머물고 싶지 않습니다. 교회와 사역자가 더 쉽게 설명하고,
                  더 선명하게 전달하고, 더 덜 지치면서 운영할 수 있도록 돕는 팀이 되고 싶습니다.
                </p>
                <p>
                  작은 랜딩페이지 하나에서 시작하더라도, 그것이 더 나은 전달과 더 나은 사역 구조로 이어질 수 있다고 믿습니다.
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-semibold text-white">
                문의하기
              </Link>
              <Link href="/pricing" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ddd2c3] px-6 text-sm font-medium text-[#0c1220]">
                상품 보기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
