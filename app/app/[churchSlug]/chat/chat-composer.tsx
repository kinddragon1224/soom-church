"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";

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
  action: (formData: FormData) => void | Promise<void>;
};

const EXAMPLES = [
  "오상준 형제 허벅지 다쳐서 내일 병원 가. 중보기도 올렸고 다음 주에 연락해봐야 해.",
  "박지은 자매 오늘 처음 왔어. 새가족 등록 후보로 넣어줘.",
  "김민수 이번 주 예배 못 왔고 다음 주에 전화해보자.",
];

export default function ChatComposer({ action }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [message, setMessage] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [recording, setRecording] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
    };
    recognition.onend = () => setRecording(false);
    recognition.onerror = (event) => {
      setRecording(false);
      setVoiceError(event.error === "not-allowed" ? "마이크 권한이 필요해." : "음성 입력을 다시 시도해줘.");
    };
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0]?.transcript ?? "";
      }
      setMessage((prev) => {
        const next = `${prev}${prev && !prev.endsWith(" ") ? " " : ""}${transcript}`.trim();
        return next;
      });
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  const helperText = useMemo(() => {
    if (recording) return "듣고 있어. 말을 마치면 다시 눌러서 멈추면 돼.";
    if (voiceError) return voiceError;
    return "텍스트나 음성으로 목원 등록, 심방, 기도, 이벤트, 후속조치를 입력해.";
  }, [recording, voiceError]);

  function toggleRecording() {
    if (!recognitionRef.current) return;
    if (recording) {
      recognitionRef.current.stop();
      return;
    }
    recognitionRef.current.start();
  }

  function applyExample(value: string) {
    setMessage(value);
    textareaRef.current?.focus();
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-4xl flex-col px-4 pb-8 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl text-center">
        <p className="text-[11px] tracking-[0.18em] text-[#8c7a5b]">MOKJANG CHAT</p>
        <h1 className="mt-4 text-[2.1rem] font-semibold tracking-[-0.06em] text-[#111111] sm:text-[2.6rem]">
          목장 운영 내용을 바로 입력해
        </h1>
        <p className="mx-auto mt-4 max-w-[620px] text-sm leading-6 text-[#5f564b]">{helperText}</p>
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-3xl flex-wrap justify-center gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => applyExample(example)}
            className="rounded-full border border-[#e7dfd3] bg-white px-3 py-2 text-xs text-[#5f564b] transition hover:bg-[#faf7f2]"
          >
            예시 넣기
          </button>
        ))}
      </div>

      <form
        ref={formRef}
        action={(formData) => {
          startTransition(async () => {
            await action(formData);
            setMessage("");
          });
        }}
        className="mx-auto mt-8 w-full max-w-3xl"
      >
        <div className="rounded-[32px] border border-[#e7dfd3] bg-white p-3 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
          <textarea
            ref={textareaRef}
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="min-h-[280px] w-full resize-none rounded-[24px] border border-[#efe7da] bg-[#fcfbf8] px-5 py-5 text-[15px] leading-7 text-[#171717] outline-none placeholder:text-[#9a8b7a] focus:border-[#111827]"
            placeholder="예: 오상준 형제 허벅지 다쳐서 내일 병원 가. 중보기도 올렸고 다음 주에 연락해봐야 해."
            required
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1 pb-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleRecording}
                disabled={!voiceSupported}
                className={`inline-flex h-11 items-center rounded-[16px] border px-4 text-sm font-medium transition ${
                  recording
                    ? "border-[#111827] bg-[#111827] text-white"
                    : "border-[#e7dfd3] bg-[#faf7f2] text-[#3f372d]"
                } ${!voiceSupported ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {recording ? "음성 멈추기" : "음성 입력"}
              </button>
              <span className="text-xs text-[#8c7a5b]">{voiceSupported ? "브라우저 음성 입력 사용" : "이 브라우저에서는 음성 입력이 아직 안 돼"}</span>
            </div>

            <button
              type="submit"
              disabled={isPending || !message.trim()}
              className="inline-flex h-11 items-center justify-center rounded-[16px] bg-[#111827] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "정리 중..." : "보내기"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
