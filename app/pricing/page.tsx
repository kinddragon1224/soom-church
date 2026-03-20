import Link from "next/link";
import SiteHeader from "@/components/site-header";

type Service = {
  title: string;
  badge?: string;
  summary: string;
  desc: string;
  points: string[];
  cta: string;
};

const services: Service[] = [
  {
    title: "쇼츠 · 홍보영상",
    badge: "빠른 실행",
    summary: "설교와 행사를 바로 활용 가능한 영상으로 정리합니다",
    desc: "설교 쇼츠, 행사 홍보영상, 짧은 소개 영상을 빠르게 제작해 교회 채널과 현장에서 바로 사용할 수 있게 돕습니다.",
    points: ["설교 쇼츠 제작", "행사 홍보영상", "짧은 소개 영상"],
    cta: "영상 문의하기",
  },
  {
    title: "유튜브 운영 세팅",
    badge: "운영 구조",
    summary: "채널이 실제로 굴러가게 만드는 시작 세팅",
    desc: "촬영 장비보다 먼저 채널 구조, 썸네일, 제목, 플레이리스트, 업로드 흐름을 정리해 실제 운영이 가능하게 만듭니다.",
    points: ["채널 진단", "썸네일·제목 구조", "업로드 운영 세팅"],
    cta: "유튜브 세팅 문의",
  },
  {
    title: "행사 랜딩 · 안내 제작",
    badge: "행사 대응",
    summary: "등록과 안내 흐름을 한 번에 정리합니다",
    desc: "집회, 수련회, 등록, 신청, 안내를 한 페이지와 한 세트의 홍보물로 정리해 행사 준비 공백을 줄입니다.",
    points: ["행사 랜딩페이지", "신청·안내 흐름", "리플렛·홍보물 연계"],
    cta: "행사 문의하기",
  },
];

const compareRows = [
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

      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <p className="text-xs tracking-[0.24em] text-[#7a6f67]">SERVICES</p>
          <h1 className="mt-5 font-display text-[2.6rem] leading-[1.05] tracking-[-0.06em] sm:text-[4.4rem]">
            지금 교회가 바로 맡기기 쉬운
            <br />
            핵심 상품만 남겼습니다
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-[#5d667d] sm:text-base">
            숨은 복잡한 플랫폼 설명보다, 교회가 당장 필요를 느끼는 실행형 서비스를 먼저 제공합니다.
            쇼츠, 유튜브 운영, 행사 안내 제작처럼 바로 결과물이 나오는 상품부터 시작합니다.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:px-10 lg:pb-16">
          <div className="grid gap-5 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="rounded-[34px] border border-[#e6dfd5] bg-white p-7 shadow-[0_16px_40px_rgba(16,24,40,0.05)] sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-[1.9rem] tracking-[-0.04em]">{service.title}</h2>
                  {service.badge ? <span className="rounded-full bg-[#f3ede3] px-3 py-1 text-xs text-[#7a6f67]">{service.badge}</span> : null}
                </div>
                <p className="mt-4 text-sm text-[#7a6f67]">{service.summary}</p>
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
                  AI 안내서 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
