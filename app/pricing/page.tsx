import Link from "next/link";
import SiteHeader from "@/components/site-header";

type Service = {
  title: string;
  badge: string;
  summary: string;
  price: string;
  note: string;
  points: string[];
  cta: string;
};

const services: Service[] = [
  {
    title: "숏폼 · 홍보영상",
    badge: "빠른 실행",
    summary: "설교, 행사, 소개 영상을 현장에 맞게 빠르게 제작합니다.",
    price: "30만 원부터",
    note: "분량, 촬영 유무, 편집 난이도에 따라 달라질 수 있습니다.",
    points: ["설교 쇼츠", "행사 홍보영상", "짧은 소개 영상"],
    cta: "영상 문의하기",
  },
  {
    title: "유튜브 채널 세팅",
    badge: "운영 구조",
    summary: "채널이 실제로 굴러가도록 구조와 업로드 흐름을 먼저 정리합니다.",
    price: "프로젝트 80만 원부터",
    note: "초기 진단 범위와 세팅 항목에 따라 조정됩니다.",
    points: ["채널 구조 정리", "썸네일·제목 방향", "업로드 운영 흐름"],
    cta: "유튜브 세팅 문의",
  },
  {
    title: "행사 페이지 · 안내물 제작",
    badge: "행사 대응",
    summary: "등록과 안내 흐름을 한 번에 정리해 행사 준비 공백을 줄입니다.",
    price: "프로젝트 120만 원부터",
    note: "행사 규모와 필요한 산출물 범위에 따라 달라집니다.",
    points: ["행사 랜딩페이지", "신청·안내 구조", "리플렛·홍보물"],
    cta: "행사 문의하기",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f3f1ec] text-[#0c1220]">
      <section className="border-b border-[#e6dfd5] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader current="pricing" />
        </div>
      </section>

      <section className="overflow-hidden border-b border-white/10 bg-[#0b0d12] text-white">
        <div className="mx-auto w-full max-w-[1600px] px-0 py-0">
          <div className="relative min-[320px]:min-h-[620px] overflow-hidden bg-[#0b0d12] sm:min-h-[700px] lg:min-h-[820px]">
            <div className="absolute inset-0 bg-[#0b0d12]" />
            <img
              src="/content-studio-hero.jpg"
              alt="콘텐츠 스튜디오"
              className="absolute inset-x-0 top-[84px] mx-auto h-[calc(100%-84px)] w-auto max-w-[min(100%,1280px)] object-contain object-top sm:top-[96px] sm:h-[calc(100%-96px)] lg:top-[110px] lg:h-[calc(100%-110px)]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,10,15,0.42)_0%,rgba(9,10,15,0.5)_22%,rgba(9,10,15,0.56)_44%,rgba(9,10,15,0.82)_74%,rgba(9,10,15,0.96)_100%)]" />

            <div className="relative z-10 flex min-h-[620px] flex-col justify-between px-5 py-6 sm:min-h-[700px] sm:px-8 sm:py-10 lg:min-h-[820px] lg:px-12 lg:py-12 xl:px-16">
              <div className="flex justify-center sm:justify-start">
                <div className="inline-flex rounded-full border border-white/18 bg-black/18 px-3 py-1.5 text-[11px] tracking-[0.28em] text-white/82 backdrop-blur-sm">CONTENT STUDIO</div>
              </div>

              <div className="mx-auto flex w-full max-w-[360px] flex-col items-center justify-end pb-16 text-center select-none cursor-default sm:max-w-[920px] sm:pb-20 lg:max-w-[980px] lg:pb-24 xl:max-w-[1040px]">
                <h1 className="text-[2.15rem] font-light leading-[1.02] tracking-[-0.06em] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.32)] sm:text-[4.4rem] lg:text-[5.9rem] xl:text-[6.6rem]">
                  콘텐츠 스튜디오
                </h1>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-white/86 drop-shadow-[0_6px_20px_rgba(0,0,0,0.24)] sm:text-base sm:leading-8">
                  영상 제작부터 채널 운영 세팅, 행사 페이지 제작까지 교회와 사역 현장에 필요한 작업을 빠르게 연결합니다.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#111827]">
                    작업 문의하기
                  </Link>
                  <a href="#services" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-medium text-white backdrop-blur-sm">
                    제작 항목 보기
                  </a>
                </div>
                <p className="mt-5 text-sm text-white/66">필요한 작업만 골라서 시작할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-14 sm:px-8 lg:px-10 lg:pb-16 lg:pt-18">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">SERVICES</p>
            <h2 className="mt-4 text-[2.3rem] font-semibold leading-[1.04] tracking-[-0.05em] text-[#111827] sm:text-[3.8rem]">
              우리가 바로 연결하는 작업
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#5d667d] sm:text-base sm:leading-8">
              필요한 순간, 필요한 제작만 빠르게 붙일 수 있도록 현장 중심의 콘텐츠 작업을 세 가지 축으로 정리했습니다.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="flex h-full flex-col rounded-[34px] border border-[#e6dfd5] bg-white p-7 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-8">
                <div className="inline-flex w-fit rounded-full bg-[#f3ede3] px-3 py-1 text-xs text-[#7a6f67]">{service.badge}</div>
                <h3 className="mt-5 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#111827]">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#5d667d]">{service.summary}</p>
                <p className="mt-7 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#111827]">{service.price}</p>
                <p className="mt-2 text-xs leading-6 text-[#8a7f75]">{service.note}</p>
                <ul className="mt-7 grid gap-2 text-sm leading-7 text-[#334155]">
                  {service.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
                <div className="mt-8 pt-2">
                  <Link href="/contact" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-semibold text-white">
                    {service.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
          <div className="rounded-[34px] border border-[#e6dfd5] bg-white p-7 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">NEXT STEP</p>
                <h2 className="mt-4 text-[2rem] font-semibold leading-[1.08] tracking-[-0.05em] text-[#111827] sm:text-[3rem]">
                  필요한 작업만 먼저 연결해보세요
                </h2>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-[#5d667d] sm:text-base sm:leading-8">
                  작은 영상 한 편부터 채널 세팅, 행사 페이지 제작까지 지금 필요한 범위만 문의하면 됩니다.
                </p>
                <p className="mt-4 text-xs leading-6 text-[#8a7f75]">작업 범위와 일정에 따라 견적은 달라질 수 있습니다.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-semibold text-white">
                  문의하기
                </Link>
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ddd2c3] px-6 text-sm font-medium text-[#0c1220]">
                  카카오톡으로 상담하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
