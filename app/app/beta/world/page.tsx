"use client";

import Image from "next/image";
import Link from "next/link";

const worldSignals = [
  { label: "기도", className: "left-[37%] top-[54%]", color: "#c4b5fd" },
  { label: "후속", className: "left-[58%] top-[58%]", color: "#fcd34d" },
  { label: "돌봄", className: "left-[67%] top-[50%]", color: "#7dd3fc" },
  { label: "새 방문", className: "left-[28%] top-[58%]", color: "#f9d7a5" },
];

export default function BetaWorldPage() {
  return (
    <div className="relative -m-4 min-h-[calc(100vh-2rem)] overflow-hidden rounded-[30px] sm:-m-5 lg:-m-6">
      <Image
        src="/beta-world/world-bg-key-01.jpg"
        alt="Soom beta world key visual"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,25,0.08)_0%,rgba(8,14,25,0.01)_28%,rgba(8,14,25,0.06)_70%,rgba(8,14,25,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,232,178,0.10),transparent_30%)]" />

      <div className="absolute left-4 right-4 top-4 z-20 flex items-start justify-between gap-4 sm:left-6 sm:right-6 sm:top-6">
        <div className="max-w-[360px] rounded-[22px] border border-white/14 bg-black/10 px-5 py-4 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.10)]">
          <p className="text-[10px] tracking-[0.18em] text-white/56">BETA / WORLD</p>
          <h1 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.05em]">월드 첫 장면</h1>
        </div>

        <div className="hidden gap-2 md:flex text-[11px]">
          <Link href="/app/beta/chat" className="rounded-full border border-white/14 bg-black/10 px-3 py-1.5 text-white/78 backdrop-blur-md">Chat</Link>
          <Link href="/app/beta/records" className="rounded-full border border-white/14 bg-black/10 px-3 py-1.5 text-white/78 backdrop-blur-md">Records</Link>
        </div>
      </div>

      <div className="absolute inset-0 z-10">
        {worldSignals.map((signal, index) => (
          <div key={signal.label} className={`absolute ${signal.className}`} style={{ animation: `pulse ${2.6 + index * 0.35}s ease-in-out infinite` }}>
            <div className="relative flex items-center justify-center">
              <div
                className="h-8 w-8 rounded-full blur-md"
                style={{ backgroundColor: `${signal.color}88` }}
              />
              <div
                className="absolute h-3.5 w-3.5 rounded-full border border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.12)]"
                style={{ backgroundColor: signal.color }}
              />
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
          <p className="mt-1 text-sm text-white/80">배경 중심 장면으로 정리 중</p>
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
