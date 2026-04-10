"use client";

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
  summary: {
    memberCount: number;
    followUpCount: number;
    pendingCandidates: number;
    recentAttendanceCount: number;
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

export default function ChatComposer({ churchSlug, summary }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [message, setMessage] = useState("");
  const [draftTranscript, setDraftTranscript] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [recording, setRecording] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
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

    try {
      const response = await fetch("/api/gido/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ churchSlug, message: message.trim() }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        throw new Error(result?.message || "입력을 반영하지 못했어.");
      }

      setMessage("");
      setDraftTranscript("");
      setStatusText(result.assistantReply || "반영되었습니다.");
      textareaRef.current?.focus();
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "입력을 반영하지 못했어.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f6f3ec] lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-4 lg:px-4 lg:py-4">
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden bg-[radial-gradient(circle_at_top,#fffdf8_0%,#f8f4ec_48%,#f3efe7_100%)] lg:rounded-[32px] lg:border lg:border-[#e7dfd3] lg:shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8%] top-[-8%] h-48 w-48 rounded-full bg-[#efe6d6] blur-3xl" />
          <div className="absolute right-[-12%] top-[12%] h-44 w-44 rounded-full bg-[#e6eef8] blur-3xl" />
          <div className="absolute bottom-[10%] left-[12%] h-36 w-36 rounded-full bg-[#ece4f7] blur-3xl" />
        </div>

        <header className="relative z-10 flex items-center justify-between border-b border-[#ece4d8]/80 px-4 py-3 sm:px-5 lg:px-6">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8c7c]">SOOM</p>
            <p className="mt-1 text-sm font-medium text-[#2f2a24]">목장 채팅</p>
          </div>
          <div className="rounded-full border border-[#e7dfd3] bg-white/80 px-3 py-1.5 text-[11px] text-[#6f6256] backdrop-blur">
            AI workspace
          </div>
        </header>

        <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-3xl">
            <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
              <div className="inline-flex rounded-full border border-[#e8dfd1] bg-white/80 px-3 py-1 text-[11px] text-[#8b7b69] backdrop-blur">
                출석, 심방, 기도제목, 근황 정리
              </div>
              <p className="mt-5 text-[18px] font-medium leading-8 tracking-[-0.03em] text-[#2f2a24] sm:text-[20px]">
                오늘 목장 상황을 자유롭게 입력해 주세요.
              </p>
              <p className="mt-3 text-sm leading-7 text-[#6f6256]">
                신방 기록, 출석 체크, 기도제목, 관리가 필요한 사람까지 편하게 남겨 주세요.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative z-20 sticky bottom-0 border-t border-[#e7dfd3]/90 bg-white/88 px-3 pb-[max(0.8rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:px-4 lg:px-6 lg:pb-6 lg:pt-4">
          <div className="mx-auto w-full max-w-4xl rounded-[26px] border border-[#e5dccf] bg-white/95 p-2.5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
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
              placeholder="목장 상황을 자유롭게 입력해 주세요..."
              required
            />

            <div className="flex items-center justify-between gap-2 border-t border-[#f0e8dc] px-2 pt-2">
              <div className="min-w-0 flex-1 text-[12px] text-[#8f8172]">
                {statusText ? <span className="truncate">{statusText}</span> : null}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={!voiceSupported}
                  className={`inline-flex h-10 items-center rounded-full border px-3.5 text-sm font-medium transition ${recording ? "border-[#111827] bg-[#111827] text-white" : "border-[#e0d7ca] bg-[#faf7f1] text-[#2f2a24] hover:bg-white"} ${!voiceSupported ? "opacity-40" : ""}`}
                >
                  {recording ? "멈춤" : "음성"}
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
        <div className="sticky top-4 rounded-[28px] border border-[#e7dfd3] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          <div className="mb-4">
            <p className="text-[10px] tracking-[0.18em] text-[#9a8c7c]">CURRENT MOKJANG</p>
            <p className="mt-2 text-sm font-medium text-[#2f2a24]">지금 목장 요약</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm text-[#2f2a24]">
            <div className="rounded-[18px] border border-[#eee7dc] bg-[#fcfaf6] px-3 py-3">
              <div className="text-[11px] text-[#9a8c7c]">출석</div>
              <div className="mt-1 font-medium">{summary.recentAttendanceCount}건</div>
            </div>
            <div className="rounded-[18px] border border-[#eee7dc] bg-[#fcfaf6] px-3 py-3">
              <div className="text-[11px] text-[#9a8c7c]">관리 필요</div>
              <div className="mt-1 font-medium">{summary.followUpCount}명</div>
            </div>
            <div className="rounded-[18px] border border-[#eee7dc] bg-[#fcfaf6] px-3 py-3">
              <div className="text-[11px] text-[#9a8c7c]">목원</div>
              <div className="mt-1 font-medium">{summary.memberCount}명</div>
            </div>
            <div className="rounded-[18px] border border-[#eee7dc] bg-[#fcfaf6] px-3 py-3">
              <div className="text-[11px] text-[#9a8c7c]">등록 후보</div>
              <div className="mt-1 font-medium">{summary.pendingCandidates}건</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {summary.recentLogs.map((item) => (
              <div key={item.id} className="rounded-[18px] border border-[#eee7dc] bg-[#fcfaf6] px-3 py-3 text-sm text-[#2f2a24]">
                <div className="font-medium">{item.title}</div>
                <div className="mt-1 leading-6 text-[#6f6256]">{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
