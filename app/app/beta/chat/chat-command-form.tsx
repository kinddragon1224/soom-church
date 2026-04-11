"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { addMemberToStorage, parseMemberCommand } from "@/lib/beta-shepherding-client";

export function ChatCommandForm() {
  const router = useRouter();
  const [command, setCommand] = useState("목원 추가 김은혜, 새가족 2가정 확인");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const parsed = parseMemberCommand(command);

      if (!parsed) {
        setMessage("지금은 `목원 추가 이름, 메모` 형식만 지원해.");
        return;
      }

      const member = addMemberToStorage(parsed);
      setMessage(`${member.name} 카드가 목양 공간에 추가됐어.`);
      setCommand("");
      router.push("/app/beta/world/shepherding");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "명령 처리 중 오류가 났어.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="rounded-[24px] border border-[#ece4d8] bg-[#fcfaf6] p-4">
        <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">COMMAND</p>
        <textarea
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          placeholder="목원 추가 김은혜, 새가족 2가정 확인"
          className="mt-3 min-h-[120px] w-full resize-none rounded-[18px] border border-[#e7dfd3] bg-white px-4 py-3 text-sm text-[#2f2a24] outline-none"
        />
        <div className="mt-3 flex flex-wrap gap-2 text-[12px] text-[#7a7064]">
          <span className="rounded-full border border-[#e7dfd3] bg-white px-3 py-1.5">예: 목원 추가 김은혜, 새가족 2가정 확인</span>
          <span className="rounded-full border border-[#e7dfd3] bg-white px-3 py-1.5">예: 목원 추가 박요한, 청년 목장 연결 필요</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#6b6155]">지금은 현재 브라우저 기준으로 바로 반영되게 붙여놨어.</p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-[16px] bg-[#1f2937] px-4 py-2.5 text-sm text-white transition hover:bg-[#111827] disabled:opacity-50"
        >
          {isSubmitting ? "추가 중..." : "명령 실행"}
        </button>
      </div>

      {message ? <div className="rounded-[18px] border border-[#ece4d8] bg-white px-4 py-3 text-sm text-[#4c4339]">{message}</div> : null}
    </form>
  );
}
