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

  return (
    <div className="-m-4 flex flex-col gap-4 bg-[#f3ede3] p-4 sm:-m-5 sm:p-5 lg:-m-6 lg:p-6">
      <section className="relative overflow-hidden rounded-[34px] border border-[#e8ddcf] bg-[#d9c7b0] shadow-[0_28px_70px_rgba(66,38,12,0.10)]">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src="/beta-world/world-bg-key-01.jpg"
            alt="Soom beta world background"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,25,0.02)_0%,rgba(8,14,25,0.00)_38%,rgba(8,14,25,0.12)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,232,178,0.12),transparent_34%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[28%] bg-[linear-gradient(180deg,rgba(96,66,37,0.00)_0%,rgba(96,66,37,0.10)_45%,rgba(96,66,37,0.18)_100%)]" />

          <div className="absolute left-4 top-4 z-20 sm:left-5 sm:top-5">
            <div className="rounded-full border border-white/18 bg-[rgba(255,248,238,0.68)] px-4 py-2 text-[12px] text-[#5b4631] backdrop-blur-md shadow-[0_10px_24px_rgba(66,38,12,0.08)]">
              우리 목장 월드
            </div>
          </div>

          <Link
            href="/app/beta/world/shepherding"
            className="absolute left-[46.7%] top-[60.8%] z-20 -translate-x-1/2 -translate-y-1/2 group"
            aria-label="요한"
          >
            <div className="absolute bottom-[2px] left-1/2 h-3 w-7 -translate-x-1/2 rounded-full bg-[rgba(43,28,17,0.22)] blur-[4px]" />
            <div className="absolute inset-x-0 -bottom-7 flex justify-center opacity-0 transition duration-200 group-hover:opacity-100">
              <span className="rounded-full border border-white/18 bg-[rgba(71,49,30,0.74)] px-3 py-1 text-[10px] font-medium text-white backdrop-blur-md shadow-[0_10px_24px_rgba(33,22,10,0.20)]">
                요한
              </span>
            </div>
            <Image
              src="/beta-world/npc-yohan-cutout-02.png"
              alt="요한"
              width={48}
              height={76}
              className="relative h-auto w-[48px] saturate-[0.82] sepia-[0.08] brightness-[0.98] drop-shadow-[0_8px_12px_rgba(51,31,18,0.12)] transition duration-200 group-hover:translate-y-[-2px] group-hover:scale-[1.04]"
            />
          </Link>

          <Link
            href="/app/beta/world/shepherding"
            className="absolute left-[53.6%] top-[60.9%] z-20 -translate-x-1/2 -translate-y-1/2 group"
            aria-label="마리아"
          >
            <div className="absolute bottom-[2px] left-1/2 h-3 w-7 -translate-x-1/2 rounded-full bg-[rgba(43,28,17,0.20)] blur-[4px]" />
            <div className="absolute inset-x-0 -bottom-7 flex justify-center opacity-0 transition duration-200 group-hover:opacity-100">
              <span className="rounded-full border border-white/18 bg-[rgba(71,49,30,0.74)] px-3 py-1 text-[10px] font-medium text-white backdrop-blur-md shadow-[0_10px_24px_rgba(33,22,10,0.20)]">
                마리아
              </span>
            </div>
            <Image
              src="/beta-world/npc-maria-cutout-03.png"
              alt="마리아"
              width={44}
              height={74}
              className="relative h-auto w-[44px] saturate-[0.8] sepia-[0.06] brightness-[0.99] drop-shadow-[0_8px_12px_rgba(51,31,18,0.11)] transition duration-200 group-hover:translate-y-[-2px] group-hover:scale-[1.04]"
            />
          </Link>

          <div className="absolute left-[50%] top-[56.5%] z-10 h-10 w-28 -translate-x-1/2 rounded-full bg-[rgba(255,220,156,0.14)] blur-[18px]" />

        </div>
      </section>

      <section className="rounded-[30px] border border-[#e7dece] bg-[linear-gradient(180deg,#fbfaf7_0%,#f5efe6_100%)] p-4 shadow-[0_18px_40px_rgba(66,38,12,0.05)] sm:p-5">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="rounded-[26px] border border-[#e8dece] bg-[rgba(255,255,255,0.88)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:px-5">
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
                className="rounded-full bg-[#2e2419] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#473425] disabled:opacity-60"
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
