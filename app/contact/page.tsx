import Link from "next/link";

const helpTypes = ["랜딩페이지", "디자인", "영상", "운영용 웹", "아직 잘 모르겠음"];
const schedules = ["최대한 빨리", "2주 이내", "이번 달 안", "일정 협의"];
const budgets = ["30만 원 이하", "30~100만 원", "100만 원 이상", "아직 미정"];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050b16] text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between gap-4">
            <Link href="/" className="font-display text-[1.85rem] font-semibold tracking-[-0.08em] text-white sm:text-[2.3rem]">
              soom
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-white/72 md:flex">
              <Link href="/">홈</Link>
              <Link href="/pricing">상품</Link>
              <Link href="/about">About</Link>
              <Link href="/contact" className="text-white">문의</Link>
            </nav>
            <Link href="/pricing" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 text-sm font-medium text-white">
              상품 보기
            </Link>
          </header>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.24em] text-white/40">CONTACT</p>
            <h1 className="mt-5 font-display text-[2.6rem] leading-[1.05] tracking-[-0.06em] sm:text-[4.4rem]">
              필요한 작업을
              <br />
              알려주세요
            </h1>
            <p className="mt-6 text-sm leading-7 text-white/68 sm:text-base">
              정확히 정리되지 않아도 괜찮습니다. 지금 상황을 알려주시면 숨이 맞는 방식으로 함께 정리해드립니다.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pb-28">
          <div className="rounded-[34px] border border-white/10 bg-[#0b1327]/88 p-6 sm:p-8">
            <form className="grid gap-8">
              <div>
                <label className="text-sm font-semibold text-white">어떤 도움이 필요한가요?</label>
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
                <span className="font-semibold text-white">어떤 작업을 생각하고 있나요?</span>
                <textarea
                  className="min-h-[180px] rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-4 text-white outline-none placeholder:text-white/32"
                  placeholder={"예: 행사 안내 페이지가 필요합니다\n설교 쇼츠를 매주 올리고 싶습니다\n소개 자료가 정리가 안 되어 있습니다"}
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
                <input className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none placeholder:text-white/32" placeholder="링크나 간단한 참고 설명을 남겨주세요" />
              </label>

              <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#09111f]">
                상담 요청 보내기
              </button>
            </form>
          </div>

          <div className="grid gap-5 self-start">
            <div className="rounded-[34px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <p className="text-xs tracking-[0.24em] text-white/38">REASSURANCE</p>
              <h2 className="mt-5 font-display text-[2rem] leading-[1.08] tracking-[-0.05em] text-white sm:text-[2.6rem]">
                작업 범위가 아직 흐릿해도 괜찮습니다
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/62 sm:text-base">
                홈페이지가 필요한지, 디자인이 먼저인지, 반복 콘텐츠로 가야 하는지 함께 판단해드릴 수 있습니다.
              </p>
              <p className="mt-4 text-sm leading-7 text-white/48 sm:text-base">
                작게 시작하고, 필요하면 다음 단계로 확장하면 됩니다.
              </p>
            </div>

            <div className="rounded-[34px] border border-white/10 bg-[#0b1327]/88 p-6 sm:p-8">
              <p className="text-xs tracking-[0.24em] text-white/38">QUICK LINKS</p>
              <div className="mt-5 grid gap-3">
                <Link href="/pricing" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/78">
                  상품 먼저 보기
                </Link>
                <Link href="/about" className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/78">
                  About 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
