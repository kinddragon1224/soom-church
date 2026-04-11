"use client";

import Link from "next/link";

const shepherds = [
  { name: "목자 01", status: "방문 가능", note: "최근 방문 기록 없음", accent: "#f6d48a" },
  { name: "목자 02", status: "방문 가능", note: "이번 주 확인 필요", accent: "#c4b5fd" },
  { name: "목자 03", status: "대기", note: "아직 배정 전", accent: "#7dd3fc" },
  { name: "목자 04", status: "대기", note: "아직 배정 전", accent: "#f9d7a5" },
  { name: "목자 05", status: "대기", note: "아직 배정 전", accent: "#ffd59e" },
  { name: "목자 06", status: "대기", note: "아직 배정 전", accent: "#d6bcfa" },
];

export default function BetaWorldShepherdingPage() {
  return (
    <div className="flex flex-col gap-5 text-[#171717]">
      <header className="flex flex-col gap-4 rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:flex-row lg:items-end lg:justify-between lg:px-7">
        <div>
          <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">WORLD / SHEPHERDING</p>
          <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">목양</h1>
          <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#5f564b]">
            월드 안의 첫 기능 공간. 지금은 목자 아바타를 방문하는 구조부터 먼저 세우고, 이후 chat 명령으로 실제 목자/상태를 반영한다.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="rounded-[14px] border border-[#e7dfd3] bg-[#faf7f2] px-4 py-2 text-sm text-[#3f372d]">목자 추가</button>
          <Link href="/app/beta/world" className="rounded-[14px] border border-[#e7dfd3] bg-white px-4 py-2 text-sm text-[#3f372d]">
            월드로 돌아가기
          </Link>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <section className="rounded-[30px] border border-[#111827] bg-[linear-gradient(180deg,#141a28_0%,#1a2235_52%,#223222_100%)] p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] tracking-[0.18em] text-white/46">SHEPHERDING ROOM</p>
              <p className="mt-1 text-lg font-semibold">목자 방문 공간</p>
            </div>

            <div className="flex items-center gap-2 rounded-[18px] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white/62">
              <span>⌕</span>
              <span>목자 검색, 그룹, 상태 필터는 다음 단계에서 붙일 예정</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {shepherds.map((shepherd) => (
              <button
                key={shepherd.name}
                className="rounded-[24px] border border-white/10 bg-white/[0.06] p-5 text-left transition hover:bg-white/[0.10]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/12 bg-white/[0.08] text-lg font-semibold text-white"
                    style={{ boxShadow: `inset 0 0 0 1px ${shepherd.accent}33` }}
                  >
                    {shepherd.name.slice(-2)}
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 text-[11px] text-white/70">{shepherd.status}</span>
                </div>
                <p className="mt-4 text-base font-semibold text-white">{shepherd.name}</p>
                <p className="mt-2 text-sm leading-6 text-white/64">{shepherd.note}</p>
                <div className="mt-4 rounded-[16px] border border-white/8 bg-black/10 px-3 py-3 text-[12px] text-white/56">
                  방문 기록, 다음 행동, 담당 목원 상태를 이 카드 안에서 이어서 보게 할 예정
                </div>
              </button>
            ))}
          </div>
        </section>

        <aside className="grid gap-4">
          <article className="rounded-[28px] border border-[#e8e1d6] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">CURRENT PRINCIPLE</p>
            <div className="mt-4 grid gap-3 text-sm text-[#5f564b]">
              <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">처음엔 목자 방문 기능만</div>
              <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">많아질 것을 대비한 카드 구조 먼저</div>
              <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">chat 명령이 공간 상태를 바꾸는 구조로 확장</div>
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
