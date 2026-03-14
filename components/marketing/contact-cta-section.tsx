import Link from "next/link";

const steps = [
  "원하는 작업을 간단히 알려주세요",
  "필요 범위와 납기만 빠르게 정리합니다",
  "합의된 범위대로 제작 후 납품합니다",
];

export function ContactCtaSection() {
  return (
    <section id="contact-consulting" className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(99,102,241,0.02),rgba(255,255,255,0))]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-18">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0b1327]/92 shadow-[0_24px_80px_rgba(2,6,23,0.42)]">
          <div className="grid gap-8 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-10 lg:py-10">
            <div>
              <p className="font-display text-xs tracking-[0.22em] text-white/48">CONTACT & CONSULTING</p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-4xl">
                필요한 작업이 있다면,
                <br />
                짧고 분명하게 남겨주세요.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                필요한 결과물과 일정만 알려주면 가장 가볍고 빠른 방식으로 제안합니다.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="flex min-h-12 items-center justify-center rounded-full bg-indigo-500/95 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(79,70,229,0.28)] transition hover:bg-indigo-400"
                >
                  문의 남기기
                </Link>
                <Link
                  href="#service-offers"
                  className="flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  상품 다시 보기
                </Link>
              </div>
            </div>

            <div className="grid gap-3">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-3 rounded-2xl border border-white/8 bg-[#091122] px-4 py-4 text-white/78"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-indigo-300/20 bg-indigo-400/10 text-xs font-semibold text-indigo-100">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
