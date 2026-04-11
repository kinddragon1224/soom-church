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
  const [command, setCommand] = useState("목원 추가 김은혜, 새가족 2가정 확인");
  const [message, setMessage] = useState("월드 안에서 바로 명령해봐. 이제 목원 추가가 바로 반영돼.");
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
        setMessage("지금은 `목원 추가 이름, 메모` 형식으로 먼저 반응하게 해놨어.");
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

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,25,0.08)_0%,rgba(8,14,25,0.01)_28%,rgba(8,14,25,0.10)_72%,rgba(8,14,25,0.30)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,232,178,0.10),transparent_30%)]" />

      <div className="absolute left-4 right-4 top-4 z-20 flex items-start justify-between gap-4 sm:left-6 sm:right-6 sm:top-6">
        <div className="max-w-[480px] rounded-[22px] border border-white/14 bg-black/10 px-5 py-4 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.10)]">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/62">
            <Link href="/app/beta" className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1">홈</Link>
            <span>/</span>
            <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-white/88">월드</span>
          </div>
          <p className="mt-3 text-[10px] tracking-[0.18em] text-white/56">BETA / WORLD</p>
          <h1 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.05em]">월드 안에서 운영하기</h1>
          <p className="mt-2 text-sm leading-6 text-white/72">월드 안에서 말을 치면 목양 공간의 목원 카드와 내부 공간이 같이 바뀌는 흐름으로 붙이는 중이야.</p>
        </div>

        <div className="hidden gap-2 md:flex text-[11px]">
          <Link href="/app/beta" className="rounded-full border border-white/14 bg-black/10 px-3 py-1.5 text-white/78 backdrop-blur-md">홈</Link>
          <Link href="/app/beta/world/shepherding" className="rounded-full border border-white/14 bg-black/10 px-3 py-1.5 text-white/78 backdrop-blur-md">목양 공간 열기</Link>
          <Link href="/app/beta/records" className="rounded-full border border-white/14 bg-black/10 px-3 py-1.5 text-white/78 backdrop-blur-md">Records</Link>
        </div>
      </div>

      <div className="absolute right-4 top-[108px] z-20 hidden w-[340px] lg:block xl:right-6">
        <div className="rounded-[24px] border border-white/14 bg-black/12 p-4 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.14)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.18em] text-white/46">CARE PREVIEW</p>
              <p className="mt-1 text-sm font-semibold text-white/90">목양 공간 미리보기</p>
            </div>
            <Link href="/app/beta/world/shepherding" className="rounded-full border border-white/14 px-3 py-1 text-[11px] text-white/70">
              열기
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {members.slice(0, 3).map((member) => (
              <div key={member.id} className="rounded-[18px] border border-white/10 bg-white/[0.06] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-white/12 bg-white/[0.08] text-sm font-semibold"
                      style={{ boxShadow: `inset 0 0 0 1px ${member.accent}33` }}
                    >
                      {member.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{member.name}</p>
                      <p className="text-[12px] text-white/58">{member.note}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/10 px-2 py-1 text-[10px] text-white/64">{member.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-4 right-4 z-20 sm:bottom-6 sm:left-6 sm:right-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[26px] border border-white/14 bg-black/14 p-4 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.16)] sm:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] tracking-[0.18em] text-white/46">WORLD INPUT</p>
                <p className="mt-1 text-sm font-semibold text-white/90">월드 안에서 바로 명령</p>
              </div>
              <div className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] text-white/64">
                1차 연결: 목원 추가
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <textarea
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                placeholder="목원 추가 김은혜, 새가족 2가정 확인"
                className="min-h-[96px] w-full resize-none rounded-[18px] border border-white/12 bg-black/18 px-4 py-3 text-sm text-white outline-none placeholder:text-white/34"
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2 text-[12px] text-white/62">
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5">예: 목원 추가 김은혜, 새가족 2가정 확인</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5">예: 목원 추가 박요한, 청년 목장 연결 필요</span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-[16px] bg-[#f4dfb8] px-4 py-2.5 text-sm font-medium text-[#2f2416] transition hover:bg-[#f0d29a] disabled:opacity-60"
                >
                  {isSubmitting ? "반영 중..." : "월드에 반영"}
                </button>
              </div>
            </div>
          </form>

          <div className="rounded-[26px] border border-white/14 bg-black/14 p-4 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.16)] sm:p-5">
            <p className="text-[10px] tracking-[0.18em] text-white/46">WORLD RESPONSE</p>
            <p className="mt-3 text-sm leading-6 text-white/82">{message}</p>
            <div className="mt-4 rounded-[18px] border border-white/10 bg-white/[0.05] p-3 text-[12px] leading-5 text-white/58">
              지금은 현재 브라우저 기준으로 목원 카드가 바로 갱신되게 붙여놨어. 다음엔 카드 클릭, 목원 상세, 내부 공간 입장까지 이어가면 돼.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
