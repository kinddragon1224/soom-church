import Link from "next/link";

const positions = ["도구 운용자", "결과 제작자", "맥락 해석자", "문제 발견자", "관계 조율자"];

const reportPreview = [
  ["현재 주 포지션", "지금 내 선택이 어느 역할 위치에 가까운지 봅니다."],
  ["대체면 / 잔존면", "AI가 대신할 부분과 끝까지 남는 힘을 나눕니다."],
  ["다음 7일 행동", "당장 해볼 활동 3개로 방향을 작게 접습니다."],
];

const offers = [
  ["무료", "포지션 체크", "7문항으로 가까운 위치 확인"],
  ["29,000원", "미니 리포트", "한 줄 진단과 다음 행동 3개"],
  ["59,000원", "상세 리포트", "주/보조 포지션과 7/14일 실행안"],
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050507] text-white">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,91,46,0.2)_0%,rgba(255,91,46,0)_32%),radial-gradient(circle_at_78%_12%,rgba(79,123,255,0.18)_0%,rgba(79,123,255,0)_30%),linear-gradient(135deg,#050507_0%,#090d14_52%,#111827_100%)]" />
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:54px_54px]" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-5 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between">
            <Link href="/" className="text-lg font-black tracking-[-0.04em] text-white sm:text-2xl">
              THE LUMEN
            </Link>
            <Link href="/diagnosis" className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-xs font-black text-[#050507] transition hover:bg-[#ff5b2e] hover:text-white sm:px-5 sm:text-sm">
              무료 체크
            </Link>
          </header>

          <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.03fr_0.97fr]">
            <section className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[#ff6b35]">AI Career Position Check</p>
              <h1 className="mt-5 text-[3.15rem] font-black leading-[0.94] tracking-[-0.08em] text-white sm:text-[5.8rem] sm:leading-[0.88] lg:text-[7.5rem]">
                직업보다
                <br />
                먼저,
                <br />
                포지션.
              </h1>
              <p className="mt-7 max-w-xl text-lg font-bold leading-8 text-white/72 sm:text-2xl sm:leading-10">
                AI 시대 진로는 적성 찾기가 아니라
                <span className="text-white"> 내가 설 자리</span>를 찾는 일입니다.
              </p>

              <div className="mt-8 max-w-xl rounded-[28px] border border-[#ff6b35]/30 bg-[#ff6b35]/10 p-5 sm:p-6">
                <p className="text-sm font-black text-[#ffb199]">3분 무료 체크</p>
                <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-white sm:text-3xl">나는 5포지션 중 어디에 가까울까?</p>
                <Link href="/diagnosis" className="mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#ff5b2e] px-6 text-base font-black text-white shadow-[0_24px_80px_rgba(255,91,46,0.32)] transition hover:bg-white hover:text-[#050507]">
                  무료 포지션 체크 시작
                </Link>
                <p className="mt-3 text-center text-xs font-bold text-white/48">개인정보 없이 결과 먼저 확인</p>
              </div>
            </section>

            <aside className="rounded-[34px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_36px_120px_rgba(0,0,0,0.38)] backdrop-blur sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#73d6b6]">What you get</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl">결과는 직업명이 아니라 역할 위치로 나옵니다.</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {positions.map((position) => (
                  <span key={position} className="rounded-full border border-white/10 bg-black/24 px-3 py-2 text-xs font-black text-white/70">
                    {position}
                  </span>
                ))}
              </div>
              <div className="mt-7 grid gap-3">
                {reportPreview.map(([title, body]) => (
                  <div key={title} className="rounded-[22px] border border-white/10 bg-black/22 p-4">
                    <p className="font-black text-white">{title}</p>
                    <p className="mt-2 text-sm font-bold leading-6 text-white/58">{body}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#090d14]">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-12 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff6b35]">Offer</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">상담 전에 리포트로 정리합니다.</h2>
          </div>
          <div className="grid gap-3">
            {offers.map(([price, title, body]) => (
              <Link key={title} href={title === "포지션 체크" ? "/diagnosis" : "/diagnosis/report-intake?source=home-offer"} className="grid gap-2 rounded-[24px] border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#ff6b35]/45 hover:bg-[#ff6b35]/10 sm:grid-cols-[8rem_1fr_auto] sm:items-center">
                <p className="text-xl font-black tracking-[-0.04em] text-white">{price}</p>
                <div>
                  <p className="font-black text-white">{title}</p>
                  <p className="mt-1 text-sm font-bold leading-6 text-white/56">{body}</p>
                </div>
                <span className="text-sm font-black text-[#ffb199]">보기 →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
