"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [successNote, setSuccessNote] = useState<string | null>(null);
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
      setVoiceError(null);
      setSuccessNote(null);
    };
    recognition.onend = () => {
      setRecording(false);
      setDraftTranscript("");
    };
    recognition.onerror = (event) => {
      setRecording(false);
      setDraftTranscript("");
      setVoiceError(event.error === "not-allowed" ? "마이크 권한이 필요해." : "음성 입력을 다시 시도해줘.");
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

  const helperText = useMemo(() => {
    if (recording) return "듣고 있어. 끝나면 다시 눌러서 멈추면 돼.";
    if (voiceError) return voiceError;
    if (successNote) return successNote;
    return "목원 등록, 출석, 심방, 기도제목, 근황을 편하게 적어줘.";
  }, [recording, successNote, voiceError]);

  const visibleMessage = draftTranscript ? appendSegment(message, draftTranscript) : message;

  function toggleRecording() {
    if (!recognitionRef.current) return;
    if (recording) {
      recognitionRef.current.stop();
      return;
    }
    recognitionRef.current.start();
  }

  function clearInput() {
    setMessage("");
    setDraftTranscript("");
    setSuccessNote(null);
    setVoiceError(null);
    textareaRef.current?.focus();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim() || isPending) return;

    setIsPending(true);
    setSuccessNote(null);
    setVoiceError(null);

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
      setSuccessNote(result.assistantReply || "입력한 내용을 정리해서 워크스페이스에 반영했어.");
      textareaRef.current?.focus();
    } catch (error) {
      setVoiceError(error instanceof Error ? error.message : "입력을 반영하지 못했어.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-7xl flex-col gap-4 px-0 py-0 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6 lg:px-6 lg:py-6">
      <section className="flex min-h-[calc(100vh-4.5rem)] flex-col bg-[#fcfbf8] lg:min-h-[calc(100vh-6rem)] lg:rounded-[32px] lg:border lg:border-[#ece4d8] lg:bg-white lg:shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <header className="sticky top-0 z-10 border-b border-[#efe7da] bg-[#fcfbf8]/95 px-4 py-3 backdrop-blur sm:px-5 lg:rounded-t-[32px] lg:bg-white/95">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.18em] text-[#8c7a5b]">MOKJANG CHAT</p>
              <p className="mt-1 truncate text-sm text-[#5f564b]">{helperText}</p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <Link href={`/app/${churchSlug}/people`} className="rounded-full border border-[#e7dfd3] bg-white px-3 py-2 text-xs text-[#3f372d]">
                Members
              </Link>
              <Link href={`/app/${churchSlug}/timeline`} className="rounded-full border border-[#e7dfd3] bg-white px-3 py-2 text-xs text-[#3f372d]">
                Timeline
              </Link>
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 pb-32 pt-6 sm:px-5 lg:px-6 lg:pb-40">
          <div className="mx-auto flex h-full w-full max-w-3xl flex-col justify-center">
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-[1.35rem] font-semibold tracking-[-0.05em] text-[#111111] sm:text-[1.6rem]">
                오늘 목장 상황을 바로 정리해줘
              </h1>
              <p className="text-sm leading-6 text-[#5f564b]">
                긴 설명 없이 바로 적으면 돼. AI가 정리해서 목원 관리 데이터에 반영할게.
              </p>
            </div>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#efe7da] bg-white/96 px-3 py-3 backdrop-blur sm:px-4 lg:absolute lg:inset-x-auto lg:bottom-6 lg:left-6 lg:right-[calc(320px+2rem)] lg:rounded-[28px] lg:border lg:shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
          <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl">
            <div className="rounded-[24px] border border-[#e7dfd3] bg-white p-2.5 sm:p-3">
              <textarea
                ref={textareaRef}
                name="message"
                value={visibleMessage}
                onChange={(event) => {
                  setSuccessNote(null);
                  setVoiceError(null);
                  setDraftTranscript("");
                  setMessage(event.target.value);
                }}
                className="min-h-[104px] w-full resize-none rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] px-4 py-4 text-[15px] leading-7 text-[#171717] outline-none placeholder:text-[#9a8b7a] focus:border-[#111827] sm:min-h-[120px]"
                placeholder="예: 오상준 형제 허벅지 다쳐서 내일 병원 가. 중보기도 올렸고 다음 주에 연락해봐야 해."
                required
              />

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleRecording}
                    disabled={!voiceSupported}
                    className={`inline-flex h-10 items-center rounded-[14px] border px-3 text-sm font-medium transition ${
                      recording
                        ? "border-[#111827] bg-[#111827] text-white"
                        : "border-[#e7dfd3] bg-[#faf7f2] text-[#3f372d]"
                    } ${!voiceSupported ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {recording ? "음성 멈추기" : "음성"}
                  </button>
                  <button
                    type="button"
                    onClick={clearInput}
                    disabled={!visibleMessage.trim() && !draftTranscript}
                    className="inline-flex h-10 items-center rounded-[14px] border border-[#e7dfd3] bg-white px-3 text-sm font-medium text-[#3f372d] transition disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    지우기
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isPending || !message.trim()}
                  className="inline-flex h-10 items-center justify-center rounded-[14px] bg-[#111827] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? "정리 중..." : "보내기"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <aside className="hidden lg:block">
        <div className="sticky top-6 space-y-4 rounded-[28px] border border-[#ece4d8] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-[#95897b]">MOKJANG SUMMARY</p>
            <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[#111111]">현재 요약</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SummaryCard label="등록 목원" value={`${summary.memberCount}명`} />
            <SummaryCard label="관리 필요" value={`${summary.followUpCount}명`} />
            <SummaryCard label="출석 기록" value={`${summary.recentAttendanceCount}건`} />
            <SummaryCard label="등록 후보" value={`${summary.pendingCandidates}건`} />
          </div>

          <div className="rounded-[22px] border border-[#efe7da] bg-[#fcfbf8] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] tracking-[0.16em] text-[#95897b]">RECENT</p>
                <p className="mt-1 text-sm font-semibold text-[#111111]">최근 기록</p>
              </div>
              <Link href={`/app/${churchSlug}/timeline`} className="text-xs text-[#8c6a2e] underline underline-offset-4">
                더 보기
              </Link>
            </div>

            <div className="mt-3 grid gap-3">
              {summary.recentLogs.length === 0 ? (
                <div className="rounded-[16px] border border-dashed border-[#dccfb9] bg-white p-3 text-sm text-[#6f6256]">최근 기록이 아직 없어.</div>
              ) : (
                summary.recentLogs.map((item) => (
                  <div key={item.id} className="rounded-[16px] border border-[#e9e1d6] bg-white p-3">
                    <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#5f564b]">{item.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">
      <p className="text-[10px] tracking-[0.16em] text-[#95897b]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[#111111]">{value}</p>
    </div>
  );
}
