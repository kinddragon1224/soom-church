"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    SpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: null | (() => void);
  onend: null | (() => void);
  onerror: null | ((event: { error?: string }) => void);
  onresult: null | ((event: SpeechRecognitionEventLike) => void);
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: {
      transcript: string;
    };
  }>;
};

type Props = {
  churchSlug: string;
  world: {
    memberCount: number;
    followUpCount: number;
    pendingCandidates: number;
    recentAttendanceCount: number;
    members: {
      id: string;
      name: string;
      initial: string;
      householdName: string | null;
      statusTag: string;
      effectLabel: string;
      effectTone: "amber" | "violet" | "sky" | "emerald" | "rose" | "stone";
      effectDetail: string;
      active: boolean;
    }[];
    recentLogs: { id: string; title: string; body: string }[];
  };
};

function appendSegment(base: string, segment: string) {
  const cleanBase = base.trim();
  const cleanSegment = segment.trim();
  if (!cleanSegment) return cleanBase;
  if (!cleanBase) return cleanSegment;
  return `${cleanBase}${cleanBase.endsWith("\n") ? "" : "\n"}${cleanSegment}`;
}

export default function ChatComposer({ churchSlug, world }: Props) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [message, setMessage] = useState("");
  const [draftTranscript, setDraftTranscript] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [recording, setRecording] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"info" | "error">("info");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
    setVoiceSupported(true);

    const recognition = new Recognition();
    recognition.lang = "ko-KR";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onstart = () => {
      setRecording(true);
      setStatusText(null);
    };
    recognition.onend = () => {
      setRecording(false);
      setDraftTranscript("");
    };
    recognition.onerror = () => {
      setRecording(false);
      setDraftTranscript("");
      setStatusTone("error");
      setStatusText("음성 입력을 다시 시도해 주세요.");
    };
    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const piece = event.results[i][0]?.transcript ?? "";
        if (event.results[i].isFinal) finalTranscript += piece;
        else interimTranscript += piece;
      }

      if (finalTranscript.trim()) {
        setMessage((prev) => appendSegment(prev, finalTranscript));
      }
      setDraftTranscript(interimTranscript.trim());
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  const visibleMessage = draftTranscript ? appendSegment(message, draftTranscript) : message;

  function toggleRecording() {
    if (!recognitionRef.current) return;
    if (recording) {
      recognitionRef.current.stop();
      return;
    }
    recognitionRef.current.start();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim() || isPending) return;

    setIsPending(true);
    setStatusText(null);
    setStatusTone("info");

    try {
      const response = await fetch("/api/gido/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ churchSlug, message: message.trim() }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        throw new Error(result?.message || "입력을 반영하지 못했습니다.");
      }

      setMessage("");
      setDraftTranscript("");
      setStatusTone("info");
      setStatusText(result.assistantReply || "입력한 내용을 반영했습니다.");
      router.refresh();
      textareaRef.current?.focus();
    } catch (error) {
      setStatusTone("error");
      setStatusText(error instanceof Error ? error.message : "입력을 반영하지 못했습니다.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f7f4ee] lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-4 lg:p-4">
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden bg-[radial-gradient(circle_at_top,#fffdf9_0%,#faf7f0_52%,#f4efe7_100%)] lg:rounded-[32px] lg:border lg:border-[#e8e0d4] lg:shadow-[0_18px_48px_rgba(15,23,42,0.05)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8%] top-[-8%] h-48 w-48 rounded-full bg-[#efe6d6] blur-3xl" />
          <div className="absolute right-[-12%] top-[12%] h-44 w-44 rounded-full bg-[#e6eef8] blur-3xl" />
          <div className="absolute bottom-[10%] left-[12%] h-36 w-36 rounded-full bg-[#ece4f7] blur-3xl" />
        </div>

        <header className="relative z-10 flex items-center justify-between border-b border-[#eee7dc]/80 px-4 py-3 sm:px-5 lg:px-6">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8c7c]">SOOM</p>
            <p className="mt-1 text-sm font-medium text-[#2f2a24]">목장 채팅</p>
          </div>
          <div className="rounded-full border border-[#ebe3d7] bg-white/75 px-3 py-1.5 text-[11px] text-[#7a6d60] backdrop-blur">beta</div>
        </header>

        <div className="relative z-10 flex flex-1 px-5 py-8 sm:px-6 lg:px-8">
          <div className="flex w-full max-w-4xl flex-1 flex-col justify-end">
            <div className="max-w-xl rounded-[28px] border border-white/70 bg-white/55 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm">
              <p className="text-[18px] font-medium leading-8 tracking-[-0.03em] text-[#2f2a24] sm:text-[20px]">
                오늘 목장 상황을 입력해 주세요.
              </p>
              <p className="mt-2 text-sm leading-7 text-[#6f6256]">
                새가족 등록, 출석, 심방, 기도제목, 후속조치를 자연스럽게 적으시면 됩니다.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative z-20 sticky bottom-0 px-3 pb-[max(0.8rem,env(safe-area-inset-bottom))] pt-3 sm:px-4 lg:px-6 lg:pb-6 lg:pt-4">
          <div className="mx-auto w-full max-w-4xl rounded-[28px] border border-[#e4dccf] bg-white/96 p-2.5 shadow-[0_16px_34px_rgba(15,23,42,0.10)]">
            {statusText ? (
              <div className={`mb-3 rounded-[16px] px-3 py-2.5 text-sm ${statusTone === "error" ? "border border-[#f0c9c9] bg-[#fff6f6] text-[#9a4a4a]" : "border border-[#dfe8d8] bg-[#f5fbf2] text-[#42653b]"}`}>
                {statusText}
              </div>
            ) : null}

            <textarea
              ref={textareaRef}
              name="message"
              value={visibleMessage}
              onChange={(event) => {
                setDraftTranscript("");
                setStatusText(null);
                setMessage(event.target.value);
              }}
              className="min-h-[120px] w-full resize-none rounded-[20px] border-0 bg-transparent px-4 py-4 text-[16px] leading-7 text-[#171717] outline-none placeholder:text-[#ada08f]"
              placeholder="예: 조성진 형제 오늘 처음 오셨습니다. 다음 주에 다시 연락드리면 좋겠습니다."
              required
            />

            <div className="flex items-center justify-between gap-2 border-t border-[#f0e8dc] px-2 pt-2">
              <div className="min-w-0 flex-1 text-[12px] text-[#8f8172]">&nbsp;</div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={!voiceSupported}
                  className={`inline-flex h-10 items-center rounded-full border px-3.5 text-sm font-medium transition ${recording ? "border-[#111827] bg-[#111827] text-white" : "border-[#e0d7ca] bg-[#faf7f1] text-[#2f2a24] hover:bg-white"} ${!voiceSupported ? "opacity-40" : ""}`}
                >
                  {recording ? "중지" : "음성"}
                </button>
                <button
                  type="submit"
                  disabled={isPending || !message.trim()}
                  className="inline-flex h-10 items-center rounded-full bg-[#111827] px-4 text-sm font-medium text-white shadow-[0_8px_18px_rgba(17,24,39,0.18)] disabled:opacity-40"
                >
                  {isPending ? "전송 중" : "보내기"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>

      <aside className="hidden lg:block">
        <div className="sticky top-4 overflow-hidden rounded-[28px] border border-[#e7dfd3] bg-[linear-gradient(180deg,#111827_0%,#172033_46%,#1b2540_100%)] p-4 text-white shadow-[0_18px_44px_rgba(15,23,42,0.16)]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-[-6%] top-[10%] h-28 w-28 rounded-full bg-[#7c3aed33] blur-2xl" />
            <div className="absolute right-[-8%] top-[26%] h-24 w-24 rounded-full bg-[#38bdf833] blur-2xl" />
            <div className="absolute bottom-[8%] left-[18%] h-24 w-24 rounded-full bg-[#f59e0b22] blur-2xl" />
          </div>

          <div className="relative z-10">
            <div>
              <p className="text-[10px] tracking-[0.18em] text-white/48">MOKJANG MINI WORLD</p>
              <p className="mt-2 text-base font-medium text-white">채팅 결과가 쌓이는 미니 월드</p>
              <p className="mt-2 text-[12px] leading-5 text-white/64">사람이 등록되거나 기록이 반영되면 오른쪽 카드가 바로 채워집니다.</p>
            </div>

            <div className="mt-4 rounded-[24px] border border-white/8 bg-white/[0.05] p-4 backdrop-blur-sm">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] text-white/42">FIELD</p>
                  <p className="mt-1 text-sm font-medium text-white">현재 등록 상태</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/56">
                  {world.memberCount}명
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {world.members.length === 0 ? (
                  <div className="col-span-2 rounded-[20px] border border-dashed border-white/10 bg-black/10 px-4 py-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-white/70">
                      +
                    </div>
                    <p className="mt-4 text-sm font-medium text-white">아직 등록된 사람이 없습니다</p>
                    <p className="mt-2 text-[12px] leading-5 text-white/56">채팅에서 새가족을 입력하면 여기 카드가 사람 상태로 바뀝니다.</p>
                  </div>
                ) : (
                  world.members.map((member) => (
                    <div key={member.id} className={`rounded-[20px] border px-3 py-3 transition ${member.active ? "border-white/18 bg-white/[0.10] shadow-[0_10px_24px_rgba(15,23,42,0.16)]" : "border-white/8 bg-white/[0.05]"}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-[16px] text-sm font-semibold ${avatarToneClass(member.effectTone)}`}>
                          {member.initial}
                        </div>
                        <span className={`rounded-full px-2 py-1 text-[10px] ${effectBadgeClass(member.effectTone)}`}>{member.effectLabel}</span>
                      </div>
                      <p className="mt-3 text-sm font-medium text-white">{member.name}</p>
                      <p className="mt-1 line-clamp-1 text-[11px] text-white/56">{member.householdName ?? member.statusTag}</p>
                      <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-white/48">{member.effectDetail}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
              <MiniStat label="관리 필요" value={`${world.followUpCount}`} />
              <MiniStat label="출석 반영" value={`${world.recentAttendanceCount}`} />
              <MiniStat label="등록 후보" value={`${world.pendingCandidates}`} />
            </div>

            <div className="mt-4 rounded-[22px] border border-white/8 bg-white/[0.05] p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-white">최근 반영 기록</p>
                <span className="text-[11px] text-white/42">최근 {world.recentLogs.length}건</span>
              </div>
              <div className="mt-3 space-y-2">
                {world.recentLogs.length === 0 ? (
                  <p className="rounded-[16px] border border-dashed border-white/10 px-3 py-4 text-[12px] leading-5 text-white/50">아직 반영 로그가 없어. 첫 입력이 들어오면 여기서 바로 흐름이 보일 거야.</p>
                ) : (
                  world.recentLogs.map((item) => (
                    <div key={item.id} className="rounded-[16px] border border-white/8 bg-black/10 px-3 py-3">
                      <p className="text-[12px] font-medium text-white">{item.title}</p>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-white/52">{item.body}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function avatarToneClass(tone: Props["world"]["members"][number]["effectTone"]) {
  switch (tone) {
    case "amber":
      return "border border-[#fbbf24]/30 bg-[#f59e0b22] text-[#fde68a]";
    case "violet":
      return "border border-[#a78bfa]/30 bg-[#8b5cf622] text-[#ddd6fe]";
    case "sky":
      return "border border-[#7dd3fc]/30 bg-[#38bdf822] text-[#bae6fd]";
    case "emerald":
      return "border border-[#6ee7b7]/30 bg-[#10b98122] text-[#d1fae5]";
    case "rose":
      return "border border-[#fda4af]/30 bg-[#fb718522] text-[#ffe4e6]";
    default:
      return "border border-white/12 bg-white/[0.05] text-white/76";
  }
}

function effectBadgeClass(tone: Props["world"]["members"][number]["effectTone"]) {
  switch (tone) {
    case "amber":
      return "bg-[#f59e0b22] text-[#fde68a]";
    case "violet":
      return "bg-[#8b5cf622] text-[#ddd6fe]";
    case "sky":
      return "bg-[#38bdf822] text-[#bae6fd]";
    case "emerald":
      return "bg-[#10b98122] text-[#d1fae5]";
    case "rose":
      return "bg-[#fb718522] text-[#ffe4e6]";
    default:
      return "bg-white/[0.07] text-white/64";
  }
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-white/[0.05] px-3 py-3">
      <div className="text-[10px] text-white/40">{label}</div>
      <div className="mt-1 text-sm font-medium text-white">{value}</div>
    </div>
  );
}
