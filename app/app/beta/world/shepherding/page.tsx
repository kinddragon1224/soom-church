"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BetaMember, readMembersFromStorage } from "@/lib/beta-shepherding-client";

export default function BetaWorldShepherdingPage() {
  const [members, setMembers] = useState<BetaMember[]>([]);

  useEffect(() => {
    setMembers(readMembersFromStorage());
  }, []);

  return (
    <div className="flex flex-col gap-5 text-[#171717]">
      <header className="flex flex-col gap-4 rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:flex-row lg:items-end lg:justify-between lg:px-7">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#7f7366]">
            <Link href="/app/beta" className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-3 py-1">홈</Link>
            <span>/</span>
            <Link href="/app/beta/world" className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-3 py-1">월드</Link>
            <span>/</span>
            <span className="rounded-full border border-[#e7dfd3] bg-white px-3 py-1 text-[#3f372d]">목양</span>
          </div>
          <p className="mt-3 text-[10px] tracking-[0.18em] text-[#9a8b7a]">WORLD / SHEPHERDING</p>
          <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">목양</h1>
          <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#5f564b]">
            월드 안의 첫 기능 공간. 상단은 목원들이 들어오는 따뜻한 내부 공간, 아래는 목원 아바타 카드 공간이다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/app/beta" className="rounded-[14px] border border-[#e7dfd3] bg-[#faf7f2] px-4 py-2 text-sm text-[#3f372d]">
            홈으로
          </Link>
          <Link href="/app/beta/world" className="rounded-[14px] border border-[#e7dfd3] bg-white px-4 py-2 text-sm text-[#3f372d]">
            월드로
          </Link>
        </div>
      </header>

      <section className="rounded-[32px] border border-[#e6dccd] bg-[linear-gradient(180deg,#f7efe1_0%,#efe4d3_100%)] p-5 shadow-[0_18px_40px_rgba(66,38,12,0.08)] lg:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-[28px] border border-[#eadfce] bg-[linear-gradient(180deg,#fff8ee_0%,#f4e7d4_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <p className="text-[10px] tracking-[0.18em] text-[#9f8361]">INSIDE ROOM</p>
            <h2 className="mt-2 text-[1.4rem] font-semibold tracking-[-0.04em] text-[#3d2d1e]">따뜻한 내부 공간</h2>
            <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#6b5743]">
              방금 추가한 목원들이 들어와 머무르고, 오늘 돌봐야 할 흐름을 한눈에 보는 공간으로 키울 자리.
            </p>

            <div className="mt-5 rounded-[24px] border border-[#e6d5bc] bg-[linear-gradient(180deg,#9d6f42_0%,#7f5731_100%)] p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] tracking-[0.18em] text-white/60">MAIN TABLE</p>
                  <p className="mt-2 text-base font-semibold">지금 들어온 목원 자리</p>
                </div>
                <div className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[11px] text-white/80">
                  최근 추가 순
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {members.slice(0, 6).map((member) => (
                  <div
                    key={member.id}
                    className="flex aspect-square flex-col items-center justify-center rounded-[18px] border border-white/12 bg-white/10 px-2 text-center text-[11px] text-white/84"
                  >
                    <span className="font-semibold">{member.name.slice(0, 2)}</span>
                    <span className="mt-1 text-white/60">{member.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#eadfce] bg-white/72 p-5 backdrop-blur-sm">
            <p className="text-[10px] tracking-[0.18em] text-[#9f8361]">ROOM STATUS</p>
            <div className="mt-4 grid gap-3 text-sm text-[#5f564b]">
              <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">지금은 목원 추가 명령이 먼저 연결됨</div>
              <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">다음은 카드 클릭 시 목원별 내부 보기</div>
              <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">그 다음엔 상단 공간에 목원 상태 변화가 더 살아나게</div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-[#111827] bg-[linear-gradient(180deg,#141a28_0%,#1a2235_52%,#223222_100%)] p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-white/46">MEMBER CARD SPACE</p>
            <p className="mt-1 text-lg font-semibold">목원 아바타 카드 공간</p>
          </div>

          <Link href="/app/beta/world" className="inline-flex items-center gap-2 rounded-[18px] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white/72">
            <span>＋</span>
            <span>월드에서 목원 추가</span>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <button
              key={member.id}
              className="rounded-[24px] border border-white/10 bg-white/[0.06] p-5 text-left transition hover:bg-white/[0.10]"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/12 bg-white/[0.08] text-lg font-semibold text-white"
                  style={{ boxShadow: `inset 0 0 0 1px ${member.accent}33` }}
                >
                  {member.name.slice(0, 2)}
                </div>
                <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 text-[11px] text-white/70">{member.status}</span>
              </div>
              <p className="mt-4 text-base font-semibold text-white">{member.name}</p>
              <p className="mt-2 text-sm leading-6 text-white/64">{member.note}</p>
              <div className="mt-4 flex items-center justify-between rounded-[16px] border border-white/8 bg-black/10 px-3 py-3 text-[12px] text-white/56">
                <span>{member.groupName}</span>
                <span>{member.updatedAt}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
