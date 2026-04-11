"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BetaShepherd, readShepherdsFromStorage } from "@/lib/beta-shepherding-client";

export default function BetaWorldShepherdingPage() {
  const [shepherds, setShepherds] = useState<BetaShepherd[]>([]);

  useEffect(() => {
    setShepherds(readShepherdsFromStorage());
  }, []);

  return (
    <div className="flex flex-col gap-5 text-[#171717]">
      <header className="flex flex-col gap-4 rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:flex-row lg:items-end lg:justify-between lg:px-7">
        <div>
          <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">WORLD / SHEPHERDING</p>
          <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">목양</h1>
          <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#5f564b]">
            월드 안의 첫 기능 공간. 상단은 따뜻한 내부 공간, 아래는 목자 아바타 카드 공간으로 나눴다.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/app/beta/chat" className="rounded-[14px] border border-[#e7dfd3] bg-[#faf7f2] px-4 py-2 text-sm text-[#3f372d]">
            chat에서 목자 추가
          </Link>
          <Link href="/app/beta/world" className="rounded-[14px] border border-[#e7dfd3] bg-white px-4 py-2 text-sm text-[#3f372d]">
            월드로 돌아가기
          </Link>
        </div>
      </header>

      <section className="rounded-[32px] border border-[#e6dccd] bg-[linear-gradient(180deg,#f7efe1_0%,#efe4d3_100%)] p-5 shadow-[0_18px_40px_rgba(66,38,12,0.08)] lg:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-[28px] border border-[#eadfce] bg-[linear-gradient(180deg,#fff8ee_0%,#f4e7d4_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <p className="text-[10px] tracking-[0.18em] text-[#9f8361]">INSIDE ROOM</p>
            <h2 className="mt-2 text-[1.4rem] font-semibold tracking-[-0.04em] text-[#3d2d1e]">따뜻한 내부 공간</h2>
            <p className="mt-3 max-w-[560px] text-sm leading-6 text-[#6b5743]">
              목원 아바타가 들어와 머무르고, 목자가 오늘 봐야 할 사람들을 한눈에 정리하는 공간으로 키울 자리.
            </p>

            <div className="mt-5 rounded-[24px] border border-[#e6d5bc] bg-[linear-gradient(180deg,#9d6f42_0%,#7f5731_100%)] p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] tracking-[0.18em] text-white/60">MAIN TABLE</p>
                  <p className="mt-2 text-base font-semibold">오늘 모인 목원 아바타 자리</p>
                </div>
                <div className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[11px] text-white/80">
                  확장 예정
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex aspect-square items-center justify-center rounded-[18px] border border-white/12 bg-white/10 text-sm text-white/76"
                  >
                    입장
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#eadfce] bg-white/72 p-5 backdrop-blur-sm">
            <p className="text-[10px] tracking-[0.18em] text-[#9f8361]">ROOM STATUS</p>
            <div className="mt-4 grid gap-3 text-sm text-[#5f564b]">
              <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">지금은 목자 추가 명령만 먼저 연결</div>
              <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">다음은 카드 클릭 시 목자별 내부 보기</div>
              <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">그 다음엔 목원 아바타가 실제로 위 공간에 들어오게</div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-[#111827] bg-[linear-gradient(180deg,#141a28_0%,#1a2235_52%,#223222_100%)] p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.14)]">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-white/46">SHEPHERD CARD SPACE</p>
            <p className="mt-1 text-lg font-semibold">목자 아바타 카드 공간</p>
          </div>

          <Link href="/app/beta/chat" className="inline-flex items-center gap-2 rounded-[18px] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white/72">
            <span>＋</span>
            <span>chat에서 목자 추가</span>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shepherds.map((shepherd) => (
            <button
              key={shepherd.id}
              className="rounded-[24px] border border-white/10 bg-white/[0.06] p-5 text-left transition hover:bg-white/[0.10]"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/12 bg-white/[0.08] text-lg font-semibold text-white"
                  style={{ boxShadow: `inset 0 0 0 1px ${shepherd.accent}33` }}
                >
                  {shepherd.name.slice(0, 2)}
                </div>
                <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 text-[11px] text-white/70">{shepherd.status}</span>
              </div>
              <p className="mt-4 text-base font-semibold text-white">{shepherd.name}</p>
              <p className="mt-2 text-sm leading-6 text-white/64">{shepherd.note}</p>
              <div className="mt-4 flex items-center justify-between rounded-[16px] border border-white/8 bg-black/10 px-3 py-3 text-[12px] text-white/56">
                <span>담당 가정 {shepherd.householdCount}개</span>
                <span>{shepherd.updatedAt}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
