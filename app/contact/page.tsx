import Link from "next/link";
import SiteHeader from "@/components/site-header";

const helpTypes = ["쇼츠 · 홍보영상", "유튜브 운영 세팅", "행사 랜딩 · 안내 제작", "아직 잘 모르겠음"];
const schedules = ["최대한 빨리", "2주 이내", "이번 달 안", "일정 협의"];
const budgets = ["30만 원 이하", "30~100만 원", "100만 원 이상", "아직 미정"];

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
              지금 가장 급한 실행부터
              <br />
              함께 정리해보자
            </h1>
            <p className="mt-6 text-sm leading-7 text-white/68 sm:text-base">
              쇼츠가 필요한지, 유튜브 운영이 먼저인지, 행사 안내가 급한지 아직 정확히 정리되지 않아도 괜찮아.
              지금 상황을 알려주면 가장 현실적인 시작점을 함께 잡아줄게.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pb-28">
          <div className="rounded-[34px] border border-white/10 bg-[#0b1327]/88 p-6 sm:p-8">
            <form className="grid gap-8">
              <div>
                <label className="text-sm font-semibold text-white">지금 어떤 도움이 가장 필요해?</label>
                <div className="mt-4 flex flex-wrap gap-3">
                  {helpTypes.map((item) => (
                    <button key={item} type="button" className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-2.5 text-sm text-white/78">
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
                <span className="font-semibold text-white">지금 상황을 자유롭게 알려줘</span>
                <textarea
                  className="min-h-[180px] rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none placeholder:text-white/32"
                  placeholder={"예: 수련회 랜딩페이지가 급합니다\n설교 쇼츠를 매주 올리고 싶은데 사람이 없습니다\n유튜브는 있는데 운영이 거의 멈춰 있습니다"}
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-white">예상 일정</p>
                  <div className="mt-4 grid gap-3">
                    {schedules.map((item) => (
                      <button key={item} type="button" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white/78">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">예산 범위</p>
                  <div className="mt-4 grid gap-3">
                    {budgets.map((item) => (
                      <button key={item} type="button" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white/78">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <label className="grid gap-2 text-sm text-white/78">
                <span className="font-semibold text-white">참고 링크 / 자료</span>
                <input className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none placeholder:text-white/32" placeholder="기존 유튜브, 행사 안내 링크, 참고 자료를 남겨줘" />
              </label>

              <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#09111f]">
                상담 요청 보내기
              </button>
            </form>
          </div>

          <div className="grid gap-5 self-start">
            <div className="rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <p className="text-xs tracking-[0.24em] text-white/38">HOW WE HELP</p>
              <h2 className="mt-5 font-display text-[2rem] leading-[1.08] tracking-[-0.05em] text-white sm:text-[2.6rem]">
                아직 뭐부터 해야 할지
                <br />
                흐릿해도 괜찮아
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/62 sm:text-base">
                지금 필요한 게 쇼츠인지, 유튜브 세팅인지, 행사 안내 제작인지 먼저 함께 구분해볼 수 있어.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/48 sm:text-base">
                숨은 복잡한 제안보다, 지금 바로 실행할 수 있는 시작점을 먼저 제안하려고 해.
              </p>
            </div>

            <div className="rounded-[34px] border border-white/10 bg-[#0b1327]/88 p-6 sm:p-8">
              <p className="text-xs tracking-[0.24em] text-white/38">QUICK LINKS</p>
              <div className="mt-5 grid gap-3">
                <Link href="/pricing" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/78">
                  핵심 상품 보기
                </Link>
                <Link href="/ai-guides" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/78">
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
