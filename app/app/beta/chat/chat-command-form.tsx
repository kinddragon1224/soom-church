"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { addMemberToStorage, parseMemberCommand } from "@/lib/beta-shepherding-client";

export function ChatCommandForm() {
  const router = useRouter();
  const [command, setCommand] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const parsed = parseMemberCommand(command);

      if (!parsed) {
        setMessage("지금은 `목원 추가 이름, 성별, 나이, 연락처, 관계, 메모` 형식부터 받게 해놨어.");
        return;
      }

      const member = addMemberToStorage(parsed);
      setMessage(`${member.name} 목원이 추가됐어. 요한 NPC를 눌러 목양 공간에서 바로 볼 수 있어.`);
      setCommand("");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "명령 처리 중 오류가 났어.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="rounded-[28px] border border-[#e4d9ca] bg-white px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:px-5">
        <textarea
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          placeholder="무엇이든 적어봐. 예: 목원 추가 김은혜, 여, 34, 010-1234-5678, 새가족, 이번 주 첫 방문"
          className="min-h-[110px] w-full resize-none bg-transparent text-[16px] leading-7 text-[#1f1a16] outline-none placeholder:text-[#9d9285]"
        />

        <div className="mt-4 flex flex-col gap-3 border-t border-[#eee5da] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2 text-[12px] text-[#776d62]">
            <span className="rounded-full border border-[#eadfce] bg-[#faf7f2] px-3 py-1.5">목원 추가</span>
            <span className="rounded-full border border-[#eadfce] bg-[#faf7f2] px-3 py-1.5">심방 기록</span>
            <span className="rounded-full border border-[#eadfce] bg-[#faf7f2] px-3 py-1.5">기도 요청</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#1f1a16] px-5 text-sm font-medium text-white transition hover:bg-[#34291f] disabled:opacity-50"
          >
            {isSubmitting ? "정리 중..." : "보내기"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 text-[12px] text-[#7f7366]">
        <span className="rounded-full border border-[#e7dfd3] bg-white px-3 py-1.5">예: 목원 추가 박요한, 남, 29, 010-2222-3333, 청년, 연결 필요</span>
        <span className="rounded-full border border-[#e7dfd3] bg-white px-3 py-1.5">예: 김은혜 이번 주 심방 필요, 어머니 수술로 기도 요청</span>
      </div>

      {message ? (
        <div className="text-center text-sm text-[#5f564b]">{message}</div>
      ) : (
        <div className="text-center text-sm text-[#8d8172]">지금은 현재 브라우저 기준으로 바로 반영되게 붙여놨어.</div>
      )}
    </form>
  );
}
