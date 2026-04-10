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
      setStatusText("음성 입력을 다시 시도해줘.");
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
      setStatusText(result.assistantReply || "반영했어.");
      textareaRef.current?.focus();
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "입력을 반영하지 못했어.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-0 lg:bg-[#faf8f4]">
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col bg-white">
        <div className="flex-1" />

        <form onSubmit={handleSubmit} className="sticky bottom-0 z-20 border-t border-[#ece7df] bg-white px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-4 lg:px-6 lg:pb-6 lg:pt-4">
          <div className="mx-auto w-full max-w-4xl rounded-[22px] border border-[#e8e1d6] bg-[#fcfbf8] p-2">
            <textarea
              ref={textareaRef}
              name="message"
              value={visibleMessage}
              onChange={(event) => {
                setDraftTranscript("");
                setStatusText(null);
                setMessage(event.target.value);
              }}
              className="min-h-[120px] w-full resize-none rounded-[18px] border-0 bg-transparent px-3 py-3 text-[16px] leading-7 text-[#171717] outline-none placeholder:text-[#a29586]"
              placeholder="메시지 입력"
              required
            />

            <div className="flex items-center justify-between gap-2 border-t border-[#eee7dc] px-2 pt-2">
              <div className="min-w-0 flex-1 text-[12px] text-[#8f8172]">
                {statusText ? <span className="truncate">{statusText}</span> : null}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={!voiceSupported}
                  className={`inline-flex h-10 items-center rounded-full border px-3 text-sm ${recording ? "border-[#111827] bg-[#111827] text-white" : "border-[#ddd5c9] bg-white text-[#2f2a24]"} ${!voiceSupported ? "opacity-40" : ""}`}
                >
                  {recording ? "멈춤" : "음성"}
                </button>
                <button
                  type="submit"
                  disabled={isPending || !message.trim()}
                  className="inline-flex h-10 items-center rounded-full bg-[#111827] px-4 text-sm font-medium text-white disabled:opacity-40"
                >
                  {isPending ? "전송 중" : "보내기"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>

      <aside className="hidden lg:block lg:border-l lg:border-[#ece7df] lg:bg-white">
        <div className="sticky top-0 p-4">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm text-[#2f2a24]">
              <div className="rounded-[16px] border border-[#eee7dc] px-3 py-3">
                <div className="text-[11px] text-[#9a8c7c]">출석</div>
                <div className="mt-1 font-medium">{summary.recentAttendanceCount}건</div>
              </div>
              <div className="rounded-[16px] border border-[#eee7dc] px-3 py-3">
                <div className="text-[11px] text-[#9a8c7c]">관리 필요</div>
                <div className="mt-1 font-medium">{summary.followUpCount}명</div>
              </div>
              <div className="rounded-[16px] border border-[#eee7dc] px-3 py-3">
                <div className="text-[11px] text-[#9a8c7c]">목원</div>
                <div className="mt-1 font-medium">{summary.memberCount}명</div>
              </div>
              <div className="rounded-[16px] border border-[#eee7dc] px-3 py-3">
                <div className="text-[11px] text-[#9a8c7c]">등록 후보</div>
                <div className="mt-1 font-medium">{summary.pendingCandidates}건</div>
              </div>
            </div>

            <div className="space-y-2">
              {summary.recentLogs.map((item) => (
                <div key={item.id} className="rounded-[16px] border border-[#eee7dc] px-3 py-3 text-sm text-[#2f2a24]">
                  <div className="font-medium">{item.title}</div>
                  <div className="mt-1 text-[#6f6256]">{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
