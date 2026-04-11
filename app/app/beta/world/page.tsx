"use client";

import Image from "next/image";
import Link from "next/link";

const worldSignals = [
  { label: "기도", className: "left-[37%] top-[55%]", src: "/beta-world/effect-prayer-01.jpg" },
  { label: "후속", className: "left-[57%] top-[59%]", src: "/beta-world/effect-followup-01.jpg" },
  { label: "돌봄", className: "left-[67%] top-[51%]", src: "/beta-world/effect-care-01.jpg" },
  { label: "새 방문", className: "left-[27%] top-[59%]", src: "/beta-world/effect-newcomer-01.jpg" },
];

export default function BetaWorldPage() {
  return (
    <div className="relative -m-4 min-h-[calc(100vh-2rem)] overflow-hidden rounded-[30px] sm:-m-5 lg:-m-6">
      <Image
        src="/beta-world/world-bg-key-01.jpg"
        alt="Soom beta world background"
        fill
        priority
        className="object-cover scale-[1.02]"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,25,0.08)_0%,rgba(8,14,25,0.01)_28%,rgba(8,14,25,0.06)_70%,rgba(8,14,25,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,232,178,0.10),transparent_30%)]" />

      <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
        <div className="absolute left-[8%] top-[16%] h-24 w-24 rounded-full bg-[#fff4cf12] blur-3xl animate-[floatCloud_16s_ease-in-out_infinite]" />
        <div className="absolute right-[10%] top-[18%] h-20 w-20 rounded-full bg-[#ffffff10] blur-3xl animate-[floatCloud_18s_ease-in-out_infinite]" />
        <div className="absolute left-[18%] bottom-[14%] h-24 w-24 rounded-full bg-[#ffd49b10] blur-3xl animate-[floatCloud_20s_ease-in-out_infinite]" />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[6] h-[24%] bg-[linear-gradient(180deg,transparent,rgba(6,8,14,0.16))]" />

      <div className="absolute left-4 right-4 top-4 z-20 flex items-start justify-between gap-4 sm:left-6 sm:right-6 sm:top-6">
        <div className="max-w-[380px] rounded-[22px] border border-white/14 bg-black/10 px-5 py-4 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.10)]">
          <p className="text-[10px] tracking-[0.18em] text-white/56">BETA / WORLD</p>
          <h1 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.05em]">월드 첫 장면</h1>
        </div>

        <div className="hidden gap-2 md:flex text-[11px]">
          <Link href="/app/beta/chat" className="rounded-full border border-white/14 bg-black/10 px-3 py-1.5 text-white/78 backdrop-blur-md">Chat</Link>
          <Link href="/app/beta/records" className="rounded-full border border-white/14 bg-black/10 px-3 py-1.5 text-white/78 backdrop-blur-md">Records</Link>
        </div>
      </div>

      <div className="absolute inset-0 z-10">
        <Link
          href="/app/beta/world/shepherding"
          className="absolute left-[48%] top-[63%] z-20 flex -translate-x-1/2 flex-col items-center"
          style={{ animation: "npcBob 3.4s ease-in-out infinite" }}
        >
          <div className="relative flex h-[84px] w-[84px] items-center justify-center rounded-full border border-white/20 bg-black/12 text-xl text-white backdrop-blur-sm shadow-[0_18px_28px_rgba(0,0,0,0.16)]">
            <span className="text-2xl">🧍</span>
            <span className="absolute -right-1 -top-1 rounded-full border border-white/20 bg-[#f6d48a22] px-2 py-1 text-[10px] text-[#fff0bf] shadow-[0_0_14px_rgba(246,212,138,0.22)]">
              목양
            </span>
          </div>
          <div className="mt-2 h-2 w-8 rounded-full bg-black/20 blur-[2px]" />
        </Link>

        {worldSignals.map((signal, index) => (
          <div
            key={signal.label}
            className={`absolute ${signal.className} z-10`}
            style={{ animation: `pulse ${2.6 + index * 0.35}s ease-in-out infinite` }}
          >
            <div className="relative h-[66px] w-[66px] drop-shadow-[0_0_18px_rgba(255,255,255,0.18)]">
              <Image src={signal.src} alt={signal.label} fill className="object-contain" />
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 z-20 sm:bottom-6 sm:left-6">
        <div className="rounded-[20px] border border-white/14 bg-black/10 px-4 py-3 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.10)]">
          <p className="text-[10px] tracking-[0.18em] text-white/56">SCENE MODE</p>
          <p className="mt-1 text-sm text-white/80">배경 애니메이션 + 목양 NPC 진입</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(0.96); opacity: 0.72; }
          50% { transform: scale(1.04); opacity: 1; }
        }
        @keyframes floatCloud {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(8px); }
        }
        @keyframes npcBob {
          0%, 100% { transform: translateX(-50%) translateY(0px); }
          50% { transform: translateX(-50%) translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
