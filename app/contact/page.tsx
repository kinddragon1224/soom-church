import Link from "next/link";
import SiteHeader from "@/components/site-header";

const helpTypes = ["쇼츠 · 홍보영상", "유튜브 운영 세팅", "행사 랜딩 · 안내 제작", "아직 잘 모르겠음"];
const schedules = ["최대한 빨리", "2주 이내", "이번 달 안", "일정 협의"];
const budgets = ["30만 원 이하", "30~100만 원", "100만 원 이상", "아직 미정"];

const processSteps = [
  {
    step: "01",
    title: "상황을 남겨주세요",
    desc: "지금 급한 일, 일정, 참고 자료를 편하게 적어주시면 됩니다.",
  },
  {
    step: "02",
    title: "1영업일 안에 1차 답변",
    desc: "내용을 보고 가장 현실적인 시작점과 필요한 범위를 먼저 정리해드립니다.",
  },
  {
    step: "03",
    title: "일정과 범위를 맞춥니다",
    desc: "진행이 맞으면 일정, 산출물, 예산 범위를 함께 확정합니다.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050b16] text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" current="contact" ctaHref="/pricing" ctaLabel="상품 보기" />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.24em] text-white/40">CONTACT</p>
            <h1 className="mt-5 font-display text-[2.6rem] leading-[1.05] tracking-[-0.06em] sm:text-[4.4rem]">
              지금 가장 급한 일부터
              <br />
              함께 정리해보세요
            </h1>
            <p className="mt-6 text-sm leading-7 text-white/68 sm:text-base">
              쇼츠가 먼저인지, 유튜브 운영이 먼저인지, 행사 안내가 급한지 아직 정확히 정리되지 않아도 괜찮습니다.
              지금 상황을 알려주시면 가장 현실적인 시작점을 함께 정리해드립니다.
            </p>
            <div className="mt-6 grid gap-2 text-sm text-white/60 sm:flex sm:flex-row sm:flex-wrap sm:gap-4">
              <p>보내주신 내용은 확인 후 순서대로 답변드립니다.</p>
              <p>보통 1영업일 안에 1차 답변을 드립니다.</p>
              <p>진행이 어렵거나 맞지 않는 경우에도 먼저 가능 여부를 솔직하게 안내드립니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pb-28">
          <div className="rounded-[34px] border border-white/10 bg-[#0b1327]/88 p-6 sm:p-8">
            <div className="mb-5 rounded-[24px] border border-emerald-400/15 bg-emerald-400/[0.06] px-4 py-4 text-sm text-white/72">
              <p className="font-semibold text-white">문의는 이렇게 진행됩니다</p>
              <div className="mt-3 grid gap-3">
                {processSteps.map((item) => (
                  <div key={item.step} className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                    <p className="text-[11px] tracking-[0.18em] text-emerald-200/70">STEP {item.step}</p>
                    <p className="mt-2 font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/62">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <form className="grid gap-8">
              <div>
                <label className="text-sm font-semibold text-white">지금 어떤 도움이 가장 필요하신가요?</label>
                <div className="mt-4 flex flex-wrap gap-3">
                  {helpTypes.map((item) => (
                    <button key={item} type="button" className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-2.5 text-sm text-white/78 transition hover:border-white/28 hover:bg-white/[0.08]">
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm text-white/78">
                  <span className="font-semibold text-white">교회 / 단체명</span>
                  <input className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none placeholder:text-white/32" placeholder="예: 숨교회 청년부" />
                </label>
                <label className="grid gap-2 text-sm text-white/78">
                  <span className="font-semibold text-white">연락처</span>
                  <input className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none placeholder:text-white/32" placeholder="이메일 / 전화번호 / 카카오톡 ID" />
                </label>
              </div>

              <label className="grid gap-2 text-sm text-white/78">
                <span className="font-semibold text-white">지금 상황을 자유롭게 알려주세요</span>
                <textarea
                  className="min-h-[180px] rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none placeholder:text-white/32"
                  placeholder={"예: 수련회 랜딩페이지가 급합니다\n설교 쇼츠를 매주 올리고 싶은데 담당 인력이 부족합니다\n유튜브 채널은 있는데 운영이 거의 멈춰 있습니다"}
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-white">예상 일정</p>
                  <div className="mt-4 grid gap-3">
                    {schedules.map((item) => (
                      <button key={item} type="button" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white/78 transition hover:border-white/24 hover:bg-white/[0.08]">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">예산 범위</p>
                  <div className="mt-4 grid gap-3">
                    {budgets.map((item) => (
                      <button key={item} type="button" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white/78 transition hover:border-white/24 hover:bg-white/[0.08]">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <label className="grid gap-2 text-sm text-white/78">
                <span className="font-semibold text-white">참고 링크 / 자료</span>
                <input className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none placeholder:text-white/32" placeholder="기존 유튜브, 행사 안내 링크, 참고 자료를 남겨주세요" />
              </label>

              <div className="grid gap-3">
                <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#09111f]">
                  상담 요청 보내기
                </button>
                <p className="text-xs leading-6 text-white/52">
                  문의 내용이 접수되면 먼저 가능 여부와 추천 시작점을 짧게 안내드리고,
                  이후 필요할 때만 상세 일정과 범위를 함께 맞춥니다.
                </p>
              </div>
            </form>
          </div>

          <div className="grid gap-5 self-start">
            <div className="rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <p className="text-xs tracking-[0.24em] text-white/38">HOW WE HELP</p>
              <h2 className="mt-5 font-display text-[2rem] leading-[1.08] tracking-[-0.05em] text-white sm:text-[2.6rem]">
                아직 무엇부터 해야 할지
                <br />
                선명하지 않아도 괜찮습니다
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/62 sm:text-base">
                지금 필요한 것이 쇼츠인지, 유튜브 세팅인지, 행사 안내 제작인지 먼저 함께 구분해볼 수 있습니다.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/48 sm:text-base">
                복잡한 제안보다 먼저, 지금 바로 시작할 수 있는 일부터 정리해드립니다.
              </p>
            </div>

            <div className="rounded-[34px] border border-white/10 bg-[#0b1327]/88 p-6 sm:p-8">
              <p className="text-xs tracking-[0.24em] text-white/38">RESPONSE GUIDE</p>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-white/70">
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                  <p className="font-semibold text-white">어떤 답변을 받게 되나요?</p>
                  <p className="mt-2">가능 여부, 추천 시작점, 대략적인 범위를 먼저 안내드립니다.</p>
                </div>
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                  <p className="font-semibold text-white">급한 일정도 가능한가요?</p>
                  <p className="mt-2">가능한 경우 빠른 대응 여부를 먼저 확인해드리고, 어려우면 현실적인 대안을 같이 제안드립니다.</p>
                </div>
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-4">
                  <p className="font-semibold text-white">바로 계약해야 하나요?</p>
                  <p className="mt-2">아닙니다. 먼저 상황을 보고, 지금 당장 필요한 범위만 가볍게 정리해드립니다.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[34px] border border-white/10 bg-[#0b1327]/88 p-6 sm:p-8">
              <p className="text-xs tracking-[0.24em] text-white/38">QUICK LINKS</p>
              <div className="mt-5 grid gap-3">
                <Link href="/pricing" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/78">
                  핵심 상품 보기
                </Link>
                <Link href="/ai-guides" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/78">
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
