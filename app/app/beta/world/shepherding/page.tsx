"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BetaMember, readMembersFromStorage } from "@/lib/beta-shepherding-client";

const memberPositions = [
  "left-[18%] top-[68%]",
  "left-[31%] top-[61%]",
  "left-[45%] top-[56%]",
  "left-[58%] top-[60%]",
  "left-[72%] top-[52%]",
  "left-[24%] top-[48%]",
  "left-[39%] top-[43%]",
  "left-[63%] top-[43%]",
  "left-[78%] top-[66%]",
  "left-[52%] top-[74%]",
];

export default function BetaWorldShepherdingPage() {
  const [members, setMembers] = useState<BetaMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<BetaMember | null>(null);

  useEffect(() => {
    const nextMembers = readMembersFromStorage();
    setMembers(nextMembers);
    setSelectedMember(nextMembers[0] ?? null);
  }, []);

  return (
    <div className="-m-4 min-h-[calc(100vh-2rem)] sm:-m-5 lg:-m-6">
      <section className="relative min-h-[calc(100vh-2rem)] overflow-hidden rounded-[30px] bg-[#e9dccb]">
        <Image
          src="/beta-world/shepherding-room-bg-05-hq.jpg"
          alt="목양 내부 공간 배경"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-34 blur-[20px] scale-[1.03]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(44,28,18,0.08)_0%,rgba(44,28,18,0.04)_28%,rgba(44,28,18,0.12)_72%,rgba(44,28,18,0.18)_100%)]" />

        <div className="absolute inset-0 z-[1] flex items-center justify-center p-3 sm:p-4 lg:p-6">
          <div className="relative inline-block max-w-full">
            <img
              src="/beta-world/shepherding-room-bg-05-hq.jpg"
              alt="목양 내부 공간"
              width={2528}
              height={1696}
              className="block h-auto max-h-[calc(100vh-5.5rem)] w-auto max-w-full rounded-[28px] border border-white/22 shadow-[0_28px_60px_rgba(44,28,18,0.22)]"
            />

            <div className="absolute inset-0 z-10">
              {members.slice(0, 10).map((member, index) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className={`absolute ${memberPositions[index] ?? "left-[20%] top-[60%]"} flex -translate-x-1/2 -translate-y-1/2 flex-col items-center`}
                >
                  <div className="rounded-full border border-white/18 bg-[rgba(88,58,34,0.72)] px-3 py-2 text-[11px] font-semibold text-white backdrop-blur-md shadow-[0_10px_24px_rgba(44,28,18,0.24)]">
                    {member.name}
                  </div>
                  <div className="mt-2 h-3 w-3 rounded-full border border-white/40 bg-[#f7e6c4] shadow-[0_0_14px_rgba(247,230,196,0.55)]" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute left-5 top-5 z-20 flex flex-wrap items-center gap-2">
          <Link
            href="/app/beta/world"
            className="rounded-full border border-white/18 bg-[rgba(255,248,238,0.76)] px-4 py-2 text-sm text-[#3d2d1e] backdrop-blur-md shadow-[0_10px_24px_rgba(66,38,12,0.10)]"
          >
            월드로
          </Link>
          <div className="rounded-full border border-white/18 bg-[rgba(255,248,238,0.68)] px-4 py-2 text-sm text-[#6b5743] backdrop-blur-md shadow-[0_10px_24px_rgba(66,38,12,0.10)]">
            목양
          </div>
        </div>

        <div className="absolute bottom-5 left-5 z-20 rounded-[20px] border border-white/16 bg-[rgba(88,58,34,0.54)] px-4 py-3 text-white backdrop-blur-md shadow-[0_14px_30px_rgba(44,28,18,0.20)]">
          <p className="text-[10px] tracking-[0.18em] text-white/60">공간 보기</p>
          <p className="mt-1 text-sm text-white/88">목원 포인트를 눌러 요약 보기</p>
        </div>

        <aside className="absolute right-5 top-5 z-20 hidden w-[320px] rounded-[28px] border border-white/18 bg-[rgba(255,248,238,0.84)] p-5 text-[#5f564b] backdrop-blur-md shadow-[0_18px_36px_rgba(44,28,18,0.14)] xl:block">
          <p className="text-[10px] tracking-[0.18em] text-[#9f8361]">목원 정보</p>
          {selectedMember ? (
            <Link href={`/app/beta/world/shepherding/member/${selectedMember.id}`} className="mt-4 block rounded-[22px] border border-[#ece4d8] bg-white/82 p-4 transition hover:bg-white">
              <p className="text-base font-semibold text-[#2f2416]">{selectedMember.name}</p>
              <p className="mt-1 text-[12px] text-[#8a7a69]">
                {selectedMember.status} · {selectedMember.relationship}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-[16px] border border-[#ece4d8] bg-[#fcfbf8] p-3">성별: {selectedMember.gender}</div>
                <div className="rounded-[16px] border border-[#ece4d8] bg-[#fcfbf8] p-3">나이: {selectedMember.age}</div>
                <div className="rounded-[16px] border border-[#ece4d8] bg-[#fcfbf8] p-3">연락처: {selectedMember.phone}</div>
                <div className="rounded-[16px] border border-[#ece4d8] bg-[#fcfbf8] p-3">침례: {selectedMember.baptized ? "유" : "무"}</div>
              </div>
              <div className="mt-4 rounded-[16px] border border-[#ece4d8] bg-[#fcfbf8] p-3 text-sm">메모: {selectedMember.note}</div>
              <div className="mt-4 rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-4 py-2 text-center text-sm text-[#3f372d]">
                더 상세하게 보기
              </div>
            </Link>
          ) : (
            <div className="mt-4 rounded-[18px] border border-[#ece4d8] bg-white/84 p-4 text-sm">
              목원을 선택하면 상세 정보가 보여.
            </div>
          )}
        </aside>
      </section>

      <section className="border-t border-[#eadfce] bg-[linear-gradient(180deg,#f7efe1_0%,#efe4d3_100%)] p-4 xl:hidden">
        <p className="text-[10px] tracking-[0.18em] text-[#9f8361]">목원 정보</p>
        {selectedMember ? (
          <Link href={`/app/beta/world/shepherding/member/${selectedMember.id}`} className="mt-4 block rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4 text-sm text-[#5f564b]">
            <p className="text-base font-semibold text-[#2f2416]">{selectedMember.name}</p>
            <p className="mt-1 text-[12px] text-[#8a7a69]">
              {selectedMember.status} · {selectedMember.relationship}
            </p>
            <div className="mt-4 rounded-[16px] border border-[#ece4d8] bg-white p-3 text-center text-sm text-[#3f372d]">
              더 상세하게 보기
            </div>
          </Link>
        ) : null}
      </section>
    </div>
  );
}
