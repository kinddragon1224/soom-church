import Link from "next/link";
import SiteHeader from "@/components/site-header";

type Service = {
  title: string;
  badge?: string;
  summary: string;
  desc: string;
  price: string;
  note: string;
  points: string[];
  cta: string;
};

const services: Service[] = [
  {
    title: "쇼츠 · 홍보영상",
    badge: "빠른 실행",
    summary: "설교와 행사를 바로 쓰는 영상으로 정리합니다",
    desc: "설교 쇼츠, 행사 홍보영상, 짧은 소개 영상을 빠르게 제작해 현장에서 바로 활용할 수 있게 돕습니다.",
    price: "건당 30만 원부터",
    note: "분량, 촬영 유무, 편집 난이도에 따라 달라질 수 있습니다.",
    points: ["설교 쇼츠", "행사 홍보영상", "짧은 소개 영상"],
    cta: "영상 문의하기",
  },
  {
    title: "유튜브 운영 세팅",
    badge: "운영 구조",
    summary: "채널이 실제로 굴러가게 시작 구조를 잡아줍니다",
    desc: "채널 구조, 썸네일, 제목, 플레이리스트, 업로드 흐름을 먼저 정리해 실제 운영이 가능하게 만듭니다.",
    price: "프로젝트 80만 원부터",
    note: "초기 진단 범위와 세팅 항목에 따라 조정됩니다.",
    points: ["채널 구조", "썸네일·제목", "업로드 흐름"],
    cta: "유튜브 세팅 문의",
  },
  {
    title: "행사 랜딩 · 안내 제작",
    badge: "행사 대응",
    summary: "등록과 안내 흐름을 한 번에 정리합니다",
    desc: "집회, 수련회, 등록, 신청, 안내를 한 페이지와 한 세트의 홍보물로 묶어 행사 준비 공백을 줄입니다.",
    price: "프로젝트 120만 원부터",
    note: "행사 규모와 필요한 산출물 범위에 따라 달라집니다.",
    points: ["행사 랜딩", "신청·안내", "리플렛·홍보물"],
    cta: "행사 문의하기",
  },
];

const compareRows = [
  { label: "시작가", values: ["30만 원부터", "80만 원부터", "120만 원부터"] },
  { label: "가장 잘 맞는 상황", values: ["콘텐츠가 급할 때", "채널이 안 굴러갈 때", "행사 준비가 몰릴 때"] },
  { label: "핵심 결과물", values: ["쇼츠·홍보영상", "운영 가능한 유튜브 구조", "행사 페이지·안내 흐름"] },
  { label: "구매 이유", values: ["빠르게 결과물이 필요함", "담당자 없이도 시작해야 함", "등록·안내를 한 번에 정리해야 함"] },
  { label: "다음 단계", values: ["월 콘텐츠 운영", "업로드·리포트 운영형", "후속 콘텐츠·행사 패키지"] },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f3f1ec] text-[#0c1220]">
      <section className="border-b border-[#e6dfd5] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader current="pricing" />
        </div>
      </section>

      <section className="overflow-hidden border-b border-[#e6dfd5] bg-[#f3f1ec]">
        <div className="mx-auto w-full max-w-[1600px] px-0 py-0">
          <div className="relative min-[320px]:min-h-[560px] overflow-hidden bg-[#f3f1ec] sm:min-h-[640px] lg:min-h-[760px]">
            <div className="absolute inset-0 bg-[#f3f1ec]" />
            <img src="/content-studio-hero.png" alt="콘텐츠 스튜디오" className="absolute inset-x-0 top-[84px] mx-auto h-[calc(100%-84px)] w-auto max-w-[min(100%,1280px)] object-contain object-top sm:top-[96px] sm:h-[calc(100%-96px)] lg:top-[110px] lg:h-[calc(100%-110px)]" />

            <div className="relative z-10 flex min-h-[560px] flex-col justify-between px-5 py-6 sm:min-h-[640px] sm:px-8 sm:py-10 lg:min-h-[760px] lg:px-12 lg:py-12 xl:px-16">
              <div className="flex justify-center sm:justify-start">
                <div className="inline-flex rounded-full border border-[#ddd2c3] bg-white/80 px-3 py-1.5 text-[11px] tracking-[0.28em] text-[#7a6f67] backdrop-blur-sm">CONTENT STUDIO</div>
              </div>

              <div className="mx-auto flex w-full max-w-[360px] flex-col items-center justify-start pb-0 pt-8 text-center select-none cursor-default sm:max-w-[1240px] sm:pt-10 lg:max-w-[1320px] xl:max-w-[1380px]">
                <h1 className="text-[2.4rem] font-light leading-[1.04] tracking-[-0.06em] text-[#111827] sm:text-[5rem] lg:text-[6.8rem] xl:text-[7.4rem]">
                  콘텐츠 스튜디오
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 lg:px-10 lg:pb-16 lg:pt-16">
          <div className="grid gap-5 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="rounded-[34px] border border-[#e6dfd5] bg-white p-7 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-[1.9rem] tracking-[-0.04em]">{service.title}</h2>
                  {service.badge ? <span className="rounded-full bg-[#f3ede3] px-3 py-1 text-xs text-[#7a6f67]">{service.badge}</span> : null}
                </div>
                <p className="mt-4 text-sm text-[#7a6f67]">{service.summary}</p>
                <div className="mt-6 rounded-[22px] border border-[#efe5d3] bg-[#fcf8f1] px-5 py-5">
                  <p className="text-xs tracking-[0.18em] text-[#9a8b7a]">STARTING PRICE</p>
                  <p className="mt-2 text-[1.9rem] font-semibold tracking-[-0.04em] text-[#111827]">{service.price}</p>
                  <p className="mt-2 text-xs leading-6 text-[#7a6f67]">{service.note}</p>
                </div>
                <p className="mt-6 text-sm leading-7 text-[#475069]">{service.desc}</p>
                <ul className="mt-6 grid gap-2 text-sm leading-7 text-[#334155]">
                  {service.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
                <div className="mt-8">
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
        <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
          <div className="overflow-hidden rounded-[34px] border border-[#e6dfd5] bg-white shadow-[0_16px_40px_rgba(16,24,40,0.05)]">
            <div className="border-b border-[#eee7dd] px-6 py-6 sm:px-8">
              <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">COMPARE</p>
              <h2 className="mt-3 font-display text-[2rem] tracking-[-0.04em]">어떤 상품이 더 맞을까?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5d667d]">
                교회마다 먼저 필요한 것이 다릅니다. 지금 가장 급한 실행 과제를 기준으로 시작 상품을 정하면 됩니다.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-[#7a6f67]">항목</th>
                    <th className="px-6 py-4 text-left text-[#7a6f67]">쇼츠 · 홍보영상</th>
                    <th className="px-6 py-4 text-left text-[#7a6f67]">유튜브 운영 세팅</th>
                    <th className="px-6 py-4 text-left text-[#7a6f67]">행사 랜딩 · 안내 제작</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr key={row.label} className="border-t border-[#eee7dd]">
                      <td className="px-6 py-4 font-medium text-[#0c1220]">{row.label}</td>
                      {row.values.map((value, index) => (
                        <td key={`${row.label}-${index}`} className="px-6 py-4 text-[#475069]">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
          <div className="rounded-[34px] border border-[#e6dfd5] bg-white p-7 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs tracking-[0.24em] text-[#9a8b7a]">NEXT STEP</p>
                <h2 className="mt-4 font-display text-[2rem] leading-[1.08] tracking-[-0.05em] sm:text-[3rem]">
                  지금 가장 급한 실행부터
                  <br />
                  함께 정리하면 됩니다
                </h2>
                <p className="mt-5 max-w-3xl text-sm leading-7 text-[#5d667d] sm:text-base">
                  쇼츠가 필요한지, 유튜브 운영이 막혀 있는지, 행사 안내가 급한지 아직 애매해도 괜찮습니다.
                  교회 상황을 기준으로 가장 현실적인 시작 상품부터 제안해드릴게요.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-semibold text-white">
                  문의하기
                </Link>
                <Link href="/ai-guides" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ddd2c3] px-6 text-sm font-medium text-[#0c1220]">
                  블로그 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
