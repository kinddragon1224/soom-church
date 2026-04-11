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
  const [command, setCommand] = useState("목원 추가 김은혜, 여, 34, 010-1234-5678, 새가족, 이번 주 첫 방문");
  const [message, setMessage] = useState("입력한 내용이 바로 월드와 목양 공간에 반영되도록 붙이는 중이야.");
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
      setMessage(`${member.name} 목원이 목양 공간에 추가됐어.`);
      setCommand("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "명령 처리 중 오류가 났어.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative -m-4 min-h-[calc(100vh-2rem)] overflow-hidden rounded-[30px] sm:-m-5 lg:-m-6">
      <Image
        src="/beta-world/world-bg-key-01.jpg"
        alt="Soom beta world background"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,25,0.04)_0%,rgba(8,14,25,0.01)_30%,rgba(8,14,25,0.12)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,232,178,0.12),transparent_32%)]" />

      <div className="absolute right-[18%] top-[34%] z-20">
        <Link href="/app/beta/world/shepherding" className="group flex flex-col items-center">
          <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border border-white/28 bg-[radial-gradient(circle_at_30%_30%,rgba(255,246,231,0.95),rgba(192,148,94,0.86))] shadow-[0_18px_40px_rgba(33,22,10,0.28)] transition group-hover:scale-[1.04]">
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full border border-white/35 bg-[linear-gradient(180deg,#fff2df_0%,#e2b781_100%)] text-[1.1rem] font-semibold text-[#55351f]">
              요한
            </div>
          </div>
          <div className="mt-3 rounded-full border border-white/18 bg-[rgba(58,40,23,0.72)] px-4 py-2 text-[12px] font-medium text-white backdrop-blur-md shadow-[0_10px_24px_rgba(33,22,10,0.24)]">
            요한과 목양 공간 들어가기
          </div>
        </Link>
      </div>

      {members.slice(0, 4).map((member, index) => {
        const positions = [
          "left-[26%] top-[63%]",
          "left-[39%] top-[57%]",
          "left-[56%] top-[60%]",
          "left-[67%] top-[52%]",
        ];

        return (
          <div
            key={member.id}
            className={`absolute ${positions[index] ?? "left-[28%] top-[62%]"} z-20 -translate-x-1/2 -translate-y-1/2`}
          >
            <div className="rounded-full border border-white/18 bg-[rgba(58,40,23,0.62)] px-3 py-2 text-[11px] font-semibold text-white backdrop-blur-md shadow-[0_10px_24px_rgba(44,28,18,0.22)]">
              {member.name}
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-5 left-4 right-4 z-20 sm:bottom-6 sm:left-6 sm:right-6">
        <div className="mx-auto max-w-[980px] rounded-[28px] border border-white/14 bg-[rgba(20,16,13,0.58)] p-4 text-white backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-5">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[0.18em] text-white/42">SOOM WORLD INPUT</p>
                <p className="mt-1 text-sm text-white/74">말로 적으면 월드와 목양 공간이 같이 바뀌는 구조로 가는 중이야.</p>
              </div>
              <Link
                href="/app/beta/chat"
                className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[12px] text-white/72"
              >
                채팅 화면 열기
              </Link>
            </div>

            <div className="rounded-[24px] border border-white/12 bg-black/18 px-4 py-4 sm:px-5">
              <textarea
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                placeholder="무엇을 기록할까? 예: 목원 추가 김은혜, 여, 34, 010-1234-5678, 새가족, 이번 주 첫 방문"
                className="min-h-[96px] w-full resize-none bg-transparent text-[15px] leading-7 text-white outline-none placeholder:text-white/32"
              />

              <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2 text-[12px] text-white/54">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">목원 추가</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">심방 메모</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">기도 요청</span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-white px-4 py-2.5 text-sm font-medium text-[#1f1a16] transition hover:bg-[#f8ecda] disabled:opacity-60"
                >
                  {isSubmitting ? "반영 중..." : "반영하기"}
                </button>
              </div>
            </div>

            <p className="px-1 text-sm text-white/66">{message}</p>
          </form>
        </div>
      </div>
    </div>
  );
}
