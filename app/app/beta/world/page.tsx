"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  BetaMember,
  addMemberToStorage,
  parseMemberCommand,
  readMembersFromStorage,
} from "@/lib/beta-shepherding-client";

export default function BetaWorldPage() {
  const [command, setCommand] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState<BetaMember[]>([]);

  useEffect(() => {
    setMembers(readMembersFromStorage());
  }, []);

  function refreshMembers() {
    setMembers(readMembersFromStorage());
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const parsed = parseMemberCommand(command);

      if (!parsed) {
        setMessage("지금은 `목원 추가 이름, 성별, 나이, 연락처, 관계, 메모` 형식으로 반응하게 해놨어.");
        return;
      }

      const member = addMemberToStorage(parsed);
      refreshMembers();
      setMessage(`${member.name} 추가 완료`);
      setCommand("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "명령 처리 중 오류가 났어.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const memberPositions = [
    "left-[32%] top-[73%]",
    "left-[43%] top-[67%]",
    "left-[58%] top-[72%]",
    "left-[69%] top-[66%]",
  ];

  return (
    <div className="-m-4 flex flex-col gap-4 bg-[#f3ede3] p-4 sm:-m-5 sm:p-5 lg:-m-6 lg:p-6">
      <section className="relative overflow-hidden rounded-[30px] border border-[#e6dccd] bg-[#d9c7b0] shadow-[0_24px_60px_rgba(66,38,12,0.10)]">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src="/beta-world/world-bg-key-01.jpg"
            alt="Soom beta world background"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,25,0.03)_0%,rgba(8,14,25,0.00)_35%,rgba(8,14,25,0.10)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,232,178,0.10),transparent_32%)]" />

          <div className="absolute left-4 top-4 z-20 sm:left-5 sm:top-5">
            <div className="rounded-full border border-white/18 bg-[rgba(255,248,238,0.76)] px-4 py-2 text-sm text-[#3d2d1e] backdrop-blur-md shadow-[0_10px_24px_rgba(66,38,12,0.10)]">
              월드
            </div>
          </div>

          <div className="absolute left-1/2 top-[58%] z-20 -translate-x-1/2 -translate-y-1/2">
            <Link href="/app/beta/world/shepherding" className="group flex flex-col items-center">
              <div className="flex h-[86px] w-[86px] items-center justify-center rounded-full border border-white/28 bg-[radial-gradient(circle_at_30%_30%,rgba(255,246,231,0.96),rgba(193,148,93,0.90))] shadow-[0_18px_40px_rgba(33,22,10,0.30)] transition group-hover:scale-[1.04]">
                <div className="flex h-[66px] w-[66px] items-center justify-center rounded-full border border-white/35 bg-[linear-gradient(180deg,#fff2df_0%,#e2b781_100%)] text-[1rem] font-semibold text-[#55351f]">
                  요한
                </div>
              </div>
              <div className="mt-2 rounded-full border border-white/18 bg-[rgba(58,40,23,0.72)] px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md shadow-[0_10px_24px_rgba(33,22,10,0.24)]">
                목양 공간 들어가기
              </div>
            </Link>
          </div>

          {members.slice(0, 4).map((member, index) => (
            <div
              key={member.id}
              className={`absolute ${memberPositions[index] ?? "left-[32%] top-[73%]"} z-20 -translate-x-1/2 -translate-y-1/2`}
            >
              <div className="h-3 w-3 rounded-full border border-white/40 bg-[rgba(58,40,23,0.78)] shadow-[0_8px_18px_rgba(44,28,18,0.28)]" />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-[#e7dece] bg-[#fbfaf7] p-4 shadow-[0_18px_40px_rgba(66,38,12,0.05)] sm:p-5">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="rounded-[24px] border border-[#e7dfd3] bg-white px-4 py-4 sm:px-5">
            <textarea
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              placeholder="무엇을 기록할까요?"
              className="min-h-[110px] w-full resize-none bg-transparent text-[15px] leading-7 text-[#1f1a16] outline-none placeholder:text-[#9d9285]"
            />

            <div className="mt-4 flex flex-col gap-3 border-t border-[#eee5da] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2 text-[12px] text-[#776d62]">
                <span className="rounded-full border border-[#eadfce] bg-[#faf7f2] px-3 py-1.5">목원 추가</span>
                <span className="rounded-full border border-[#eadfce] bg-[#faf7f2] px-3 py-1.5">심방 메모</span>
                <span className="rounded-full border border-[#eadfce] bg-[#faf7f2] px-3 py-1.5">기도 요청</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-[#1f1a16] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#34291f] disabled:opacity-60"
              >
                {isSubmitting ? "반영 중..." : "반영하기"}
              </button>
            </div>
          </div>

          {message ? <p className="px-1 text-sm text-[#6b6258]">{message}</p> : null}
        </form>
      </section>
    </div>
  );
}
