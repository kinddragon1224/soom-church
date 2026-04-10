import Link from "next/link";

export default function BetaPage() {
  return (
    <main className="min-h-screen bg-[#f6f4ef] px-6 py-10 text-[#171717]">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-[#e6dfd5] bg-white p-8 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
        <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">SOOM BETA</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#111111]">새 베타를 다시 만드는 중</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f564b]">
          기존 기도 목장 베타는 과감하게 정리하고 있습니다. 다음 버전은 목장 운영 OS에 맞춰 더 단순하고, 더 감성적이고, 더 선명한 월드 중심 구조로 다시 시작합니다.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <section className="rounded-[20px] border border-[#ece4d8] bg-[#fcfbf8] p-5">
            <h2 className="text-sm font-semibold text-[#111111]">1. 기존 베타 정리</h2>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">gido 전용 화면, 테스트 로그인, 실험 구조를 걷어냅니다.</p>
          </section>
          <section className="rounded-[20px] border border-[#ece4d8] bg-[#fcfbf8] p-5">
            <h2 className="text-sm font-semibold text-[#111111]">2. 새 운영 화면</h2>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">채팅 입력과 월드 시각화가 자연스럽게 이어지는 새 베타를 만듭니다.</p>
          </section>
          <section className="rounded-[20px] border border-[#ece4d8] bg-[#fcfbf8] p-5">
            <h2 className="text-sm font-semibold text-[#111111]">3. 단계별 리빌드</h2>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">한 번에 많이 얹지 않고, 한 단계씩 검증하면서 다시 세웁니다.</p>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/app" className="rounded-[14px] bg-[#111827] px-4 py-2 text-sm font-semibold text-white">워크스페이스로 가기</Link>
        </div>
      </div>
    </main>
  );
}
