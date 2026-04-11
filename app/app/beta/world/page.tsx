"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const tones = [
  {
    key: "morning",
    label: "아침",
    overlay: "bg-[linear-gradient(180deg,rgba(255,244,214,0.22)_0%,rgba(255,244,214,0.08)_22%,rgba(120,180,255,0.06)_100%)]",
    filter: "brightness(1.05) saturate(1.02)",
  },
  {
    key: "day",
    label: "낮",
    overlay: "bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.01)_100%)]",
    filter: "brightness(1) saturate(1)",
  },
  {
    key: "evening",
    label: "저녁",
    overlay: "bg-[linear-gradient(180deg,rgba(255,202,122,0.24)_0%,rgba(255,177,84,0.14)_28%,rgba(44,32,74,0.16)_100%)]",
    filter: "brightness(0.92) saturate(1.08)",
  },
  {
    key: "cloudy",
    label: "흐림",
    overlay: "bg-[linear-gradient(180deg,rgba(170,180,196,0.20)_0%,rgba(140,150,170,0.12)_40%,rgba(90,100,120,0.10)_100%)]",
    filter: "brightness(0.95) saturate(0.86)",
  },
] as const;

const worldSignals = [
  { label: "기도", className: "left-[37%] top-[55%]", color: "#c4b5fd" },
  { label: "후속", className: "left-[57%] top-[59%]", color: "#fcd34d" },
  { label: "돌봄", className: "left-[67%] top-[51%]", color: "#7dd3fc" },
  { label: "새 방문", className: "left-[27%] top-[59%]", color: "#f9d7a5" },
];

export default function BetaWorldPage() {
  const [selected, setSelected] = useState<(typeof tones)[number]["key"]>("day");
  const current = useMemo(() => tones.find((item) => item.key === selected) ?? tones[1], [selected]);

  return (
    <div className="relative -m-4 min-h-[calc(100vh-2rem)] overflow-hidden rounded-[30px] sm:-m-5 lg:-m-6">
      <div className="absolute inset-0 transition-all duration-500" style={{ filter: current.filter }}>
        <Image
          src="/beta-world/world-bg-master-fixed.jpg"
          alt="Soom beta world master background"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className={`absolute inset-0 transition-all duration-500 ${current.overlay}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,232,178,0.10),transparent_30%)]" />

      <div className="absolute left-4 right-4 top-4 z-20 flex items-start justify-between gap-4 sm:left-6 sm:right-6 sm:top-6">
        <div className="max-w-[380px] rounded-[22px] border border-white/14 bg-black/10 px-5 py-4 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.10)]">
          <p className="text-[10px] tracking-[0.18em] text-white/56">BETA / WORLD</p>
          <h1 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.05em]">월드 첫 장면</h1>
          <p className="mt-2 text-sm text-white/76">고정 원본 1장 기준으로 시간대만 바꾼다.</p>
        </div>

        <div className="hidden gap-2 md:flex text-[11px]">
          <Link href="/app/beta/chat" className="rounded-full border border-white/14 bg-black/10 px-3 py-1.5 text-white/78 backdrop-blur-md">Chat</Link>
          <Link href="/app/beta/records" className="rounded-full border border-white/14 bg-black/10 px-3 py-1.5 text-white/78 backdrop-blur-md">Records</Link>
        </div>
      </div>

      <div className="absolute left-4 top-[120px] z-20 sm:left-6 sm:top-[132px]">
        <div className="flex flex-wrap gap-2 rounded-[18px] border border-white/14 bg-black/10 p-2 text-[11px] text-white/80 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.10)]">
          {tones.map((item) => {
            const active = item.key === current.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelected(item.key)}
                className={`rounded-full px-3 py-1.5 transition ${active ? "bg-white text-[#111111]" : "bg-white/6 text-white/76 hover:bg-white/12"}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-0 z-10">
        {worldSignals.map((signal, index) => (
          <div key={signal.label} className={`absolute ${signal.className}`} style={{ animation: `pulse ${2.6 + index * 0.35}s ease-in-out infinite` }}>
            <div className="relative flex items-center justify-center">
              <div className="h-8 w-8 rounded-full blur-md" style={{ backgroundColor: `${signal.color}88` }} />
              <div className="absolute h-3.5 w-3.5 rounded-full border border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.12)]" style={{ backgroundColor: signal.color }} />
            </div>
            <div className="mt-2 -ml-4 rounded-full border border-white/12 bg-black/12 px-2.5 py-1 text-[10px] text-white/78 backdrop-blur-sm">
              {signal.label}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 z-20 sm:bottom-6 sm:left-6">
        <div className="rounded-[20px] border border-white/14 bg-black/10 px-4 py-3 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.10)]">
          <p className="text-[10px] tracking-[0.18em] text-white/56">SCENE MODE</p>
          <p className="mt-1 text-sm text-white/80">원본 1장 + 시간대 오버레이</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(0.96); opacity: 0.72; }
          50% { transform: scale(1.04); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
