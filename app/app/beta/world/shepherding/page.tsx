"use client";

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
    <div className="-m-4 min-h-[calc(100vh-2rem)] bg-[#f3ede3] sm:-m-5 lg:-m-6">
      <section className="relative min-h-[76vh] overflow-hidden rounded-[30px] bg-[#e9dccb] md:min-h-[calc(100vh-2rem)]">
        <img
          src="/beta-world/shepherding-room-bg-05-hq.jpg"
          alt="목양 내부 공간"
          className="absolute inset-0 h-full w-full object-cover object-top md:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(44,28,18,0.05)_0%,rgba(44,28,18,0.01)_24%,rgba(44,28,18,0.10)_68%,rgba(44,28,18,0.18)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[28%] bg-[linear-gradient(180deg,rgba(255,248,238,0.16)_0%,rgba(255,248,238,0.00)_100%)]" />

        <div className="absolute left-5 top-5 z-20 flex flex-wrap items-center gap-2">
          <Link
            href="/app/beta/world"
            className="rounded-full border border-white/18 bg-[rgba(255,248,238,0.68)] px-4 py-2 text-sm text-[#4b3929] backdrop-blur-md shadow-[0_10px_24px_rgba(66,38,12,0.08)]"
          >
            월드로
          </Link>
          <div className="rounded-full border border-white/18 bg-[rgba(255,248,238,0.60)] px-4 py-2 text-sm text-[#6b5743] backdrop-blur-md shadow-[0_10px_24px_rgba(66,38,12,0.08)]">
            목양 공간
          </div>
        </div>

        <div className="absolute left-5 top-20 z-20 max-w-[280px] rounded-[24px] border border-white/16 bg-[rgba(80,52,31,0.42)] px-4 py-4 text-white backdrop-blur-md shadow-[0_18px_34px_rgba(44,28,18,0.18)]">
          <p className="text-[10px] tracking-[0.18em] text-white/58">SHEPHERDING ROOM</p>
          <p className="mt-2 text-base font-medium text-white/92">돌봄이 필요한 사람을 안쪽으로 불러 보는 공간</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/74">
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">기도</span>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">심방</span>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">후속조치</span>
          </div>
        </div>

        <div className="absolute inset-0 z-10">
          {members.slice(0, 10).map((member, index) => {
            const isSelected = selectedMember?.id === member.id;
            return (
              <button
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`absolute ${memberPositions[index] ?? "left-[20%] top-[60%]"} flex -translate-x-1/2 -translate-y-1/2 flex-col items-center`}
              >
                <div
                  className={`rounded-full border px-3 py-2 text-[11px] font-semibold backdrop-blur-md shadow-[0_10px_24px_rgba(44,28,18,0.22)] transition ${
                    isSelected
                      ? "border-[#ffe2b3] bg-[rgba(120,77,41,0.82)] text-white"
                      : "border-white/18 bg-[rgba(88,58,34,0.68)] text-white/92"
                  }`}
                >
                  {member.name}
                </div>
                <div className={`mt-2 rounded-full border ${isSelected ? "h-4 w-4 border-[#ffe7bd] bg-[#ffe0a5] shadow-[0_0_18px_rgba(255,224,165,0.8)]" : "h-3 w-3 border-white/40 bg-[#f7e6c4] shadow-[0_0_14px_rgba(247,230,196,0.55)]"}`} />
              </button>
            );
          })}
        </div>

        <div className="absolute bottom-5 left-5 z-20 rounded-[18px] border border-white/14 bg-[rgba(88,58,34,0.42)] px-4 py-2.5 text-white/86 backdrop-blur-md shadow-[0_14px_30px_rgba(44,28,18,0.16)]">
          <p className="text-sm">사람을 선택하면 지금 상태가 열린다</p>
        </div>

        <aside className="absolute right-5 top-5 z-20 hidden w-[350px] rounded-[30px] border border-white/18 bg-[rgba(255,248,238,0.86)] p-5 text-[#5f564b] backdrop-blur-md shadow-[0_22px_44px_rgba(44,28,18,0.14)] xl:block">
          {selectedMember ? (
            <div>
              <p className="text-[10px] tracking-[0.18em] text-[#9f8361]">SELECTED MEMBER</p>
              <div className="mt-4 rounded-[24px] border border-[#ece4d8] bg-white/90 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-[#eadfce] bg-[linear-gradient(180deg,#fff8ee_0%,#f4e7d4_100%)] text-lg font-semibold text-[#5b4631]">
                    {selectedMember.name.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[#2f2416]">{selectedMember.name}</p>
                    <p className="mt-1 text-[12px] text-[#8a7a69]">
                      {selectedMember.status} · {selectedMember.relationship}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-[12px]">
                  <div className="rounded-[14px] border border-[#ece4d8] bg-[#fcfbf8] px-3 py-2">성별 {selectedMember.gender}</div>
                  <div className="rounded-[14px] border border-[#ece4d8] bg-[#fcfbf8] px-3 py-2">나이 {selectedMember.age}</div>
                  <div className="rounded-[14px] border border-[#ece4d8] bg-[#fcfbf8] px-3 py-2">연락처 {selectedMember.phone}</div>
                  <div className="rounded-[14px] border border-[#ece4d8] bg-[#fcfbf8] px-3 py-2">침례 {selectedMember.baptized ? "유" : "무"}</div>
                </div>

                <div className="mt-4 rounded-[16px] border border-[#ece4d8] bg-[#fcfbf8] p-3 text-sm text-[#5e5448]">
                  {selectedMember.note}
                </div>

                <div className="mt-4 grid gap-2 text-[12px]">
                  <div className="rounded-[16px] border border-[#efe4d6] bg-[#fffaf3] px-3 py-2 text-[#6c573c]">기도를 이어서 적기</div>
                  <div className="rounded-[16px] border border-[#efe4d6] bg-[#fffaf3] px-3 py-2 text-[#6c573c]">심방 메모 정리하기</div>
                  <div className="rounded-[16px] border border-[#efe4d6] bg-[#fffaf3] px-3 py-2 text-[#6c573c]">다음 연락 잡기</div>
                </div>
              </div>

              <Link
                href={`/app/beta/world/shepherding/member/${selectedMember.id}`}
                className="mt-4 flex rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-4 py-2 text-center text-sm text-[#3f372d]"
              >
                더 자세히 보기
              </Link>
            </div>
          ) : (
            <div className="rounded-[20px] border border-[#ece4d8] bg-white/90 p-4 text-sm">선택된 사람이 아직 없어.</div>
          )}
        </aside>
      </section>

      <section className="border-t border-[#eadfce] bg-[linear-gradient(180deg,#f7efe1_0%,#efe4d3_100%)] p-4 xl:hidden">
        {selectedMember ? (
          <Link href={`/app/beta/world/shepherding/member/${selectedMember.id}`} className="block rounded-[22px] border border-[#ece4d8] bg-[#fcfbf8] p-4 text-sm text-[#5f564b]">
            <p className="text-[10px] tracking-[0.18em] text-[#9f8361]">SELECTED MEMBER</p>
            <p className="mt-3 text-base font-semibold text-[#2f2416]">{selectedMember.name}</p>
            <p className="mt-1 text-[12px] text-[#8a7a69]">
              {selectedMember.status} · {selectedMember.relationship}
            </p>
            <div className="mt-4 grid gap-2 text-[12px] text-[#6c573c]">
              <div className="rounded-[14px] border border-[#ece4d8] bg-white px-3 py-2">기도를 이어서 적기</div>
              <div className="rounded-[14px] border border-[#ece4d8] bg-white px-3 py-2">심방 메모 정리하기</div>
            </div>
            <div className="mt-4 rounded-[16px] border border-[#ece4d8] bg-white p-3 text-center text-sm text-[#3f372d]">
              더 자세히 보기
            </div>
          </Link>
        ) : null}
      </section>
    </div>
  );
}
