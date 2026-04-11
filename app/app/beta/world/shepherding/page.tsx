"use client";

import Link from "next/link";

const shepherds = [
  { name: "목자 01", status: "방문 가능" },
  { name: "목자 02", status: "방문 가능" },
  { name: "목자 03", status: "대기" },
  { name: "목자 04", status: "대기" },
  { name: "목자 05", status: "대기" },
  { name: "목자 06", status: "대기" },
];

export default function BetaWorldShepherdingPage() {
  return (
    <div className="flex flex-col gap-5 text-[#171717]">
      <header className="flex flex-col gap-4 rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:flex-row lg:items-end lg:justify-between lg:px-7">
        <div>
          <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">WORLD / SHEPHERDING</p>
          <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">목양</h1>
          <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#5f564b]">
            월드 안에서 목자들을 방문하는 첫 기능 공간. 지금은 구조만 세우고, 이후 chat 명령으로 목자 아바타와 상태가 실제로 반영되게 만든다.
          </p>
        </div>

        <Link href="/app/beta/world" className="rounded-[14px] border border-[#e7dfd3] bg-[#faf7f2] px-4 py-2 text-sm text-[#3f372d]">
          월드로 돌아가기
        </Link>
      </header>

      <section className="rounded-[30px] border border-[#111827] bg-[linear-gradient(180deg,#141a28_0%,#1a2235_50%,#223222_100%)] p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-white/46">SHEPHERDING ROOM</p>
            <p className="mt-1 text-lg font-semibold">목자 방문 공간</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] text-white/64">초기 구조</div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shepherds.map((shepherd) => (
            <button
              key={shepherd.name}
              className="rounded-[24px] border border-white/10 bg-white/[0.06] p-5 text-left transition hover:bg-white/[0.10]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/12 bg-white/[0.08] text-lg">
                  🧍
                </div>
                <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 text-[11px] text-white/70">{shepherd.status}</span>
              </div>
              <p className="mt-4 text-base font-semibold text-white">{shepherd.name}</p>
              <p className="mt-2 text-sm leading-6 text-white/64">추후 chat 명령으로 추가된 목자 아바타가 여기에 구조화되어 모이게 된다.</p>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
