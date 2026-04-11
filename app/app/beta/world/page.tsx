"use client";

import Image from "next/image";
import Link from "next/link";

const homes = [
  { className: "left-[7%] top-[24%]" },
  { className: "right-[9%] top-[29%]" },
  { className: "left-[16%] bottom-[17%]" },
  { className: "right-[16%] bottom-[15%]" },
];

const villagers = [
  { className: "left-[47%] top-[46%]", src: "/beta-world/asset-leader-01.jpg", effect: "☀" },
  { className: "left-[27%] top-[52%]", src: "/beta-world/asset-member-01.jpg", effect: "✦" },
  { className: "right-[28%] top-[53%]", src: "/beta-world/asset-member-01.jpg", effect: "✧" },
  { className: "left-[37%] bottom-[18%]", src: "/beta-world/asset-member-01.jpg", effect: "✉" },
  { className: "right-[35%] bottom-[17%]", src: "/beta-world/asset-member-01.jpg", effect: "💧" },
];

export default function BetaWorldPage() {
  return (
    <div className="relative -m-4 min-h-[calc(100vh-2rem)] overflow-hidden rounded-[30px] sm:-m-5 lg:-m-6">
      <Image src="/beta-world/world-bg-key-01.jpg" alt="Soom beta world key visual" fill priority className="object-cover" />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,25,0.08)_0%,rgba(8,14,25,0.02)_24%,rgba(8,14,25,0.06)_66%,rgba(8,14,25,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,232,178,0.12),transparent_28%)]" />

      <div className="absolute left-4 right-4 top-4 z-20 flex items-start justify-between gap-4 sm:left-6 sm:right-6 sm:top-6">
        <div className="max-w-[420px] rounded-[24px] border border-white/14 bg-black/12 px-5 py-4 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
          <p className="text-[10px] tracking-[0.18em] text-white/56">BETA / WORLD</p>
          <h1 className="mt-2 text-[1.6rem] font-semibold tracking-[-0.05em]">월드 첫 장면</h1>
        </div>

        <div className="hidden gap-2 md:flex text-[11px]">
          <Link href="/app/beta/chat" className="rounded-full border border-white/14 bg-black/12 px-3 py-1.5 text-white/78 backdrop-blur-md">Chat</Link>
          <Link href="/app/beta/records" className="rounded-full border border-white/14 bg-black/12 px-3 py-1.5 text-white/78 backdrop-blur-md">Records</Link>
        </div>
      </div>

      <div className="absolute inset-0 z-10">
        <div className="absolute left-[50%] top-[10%] z-10 -translate-x-1/2 animate-[float_10s_ease-in-out_infinite]">
          <div className="relative h-[170px] w-[190px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.22)]">
            <Image src="/beta-world/asset-church-01.jpg" alt="center building asset" fill className="object-contain" />
          </div>
        </div>

        {homes.map((home, index) => (
          <div
            key={index}
            className={`absolute ${home.className} z-10 w-[180px] text-center`}
            style={{ animation: `float ${9 + index * 1.1}s ease-in-out infinite` }}
          >
            <div className="relative mx-auto h-[150px] w-[170px] drop-shadow-[0_18px_26px_rgba(0,0,0,0.2)]">
              <Image src="/beta-world/asset-house-01.jpg" alt="house asset" fill className="object-contain" />
            </div>
            <div className="mx-auto mt-1 h-2 w-12 rounded-full bg-black/20 blur-[2px]" />
          </div>
        ))}

        {villagers.map((villager, index) => (
          <div
            key={index}
            className={`absolute ${villager.className} z-20 flex w-[92px] flex-col items-center`}
            style={{ animation: `groundBob ${2.9 + index * 0.18}s ease-in-out infinite` }}
          >
            <div className="relative h-[86px] w-[86px] drop-shadow-[0_12px_22px_rgba(0,0,0,0.22)]">
              <Image src={villager.src} alt="villager asset" fill className="object-contain" />
              <span className="absolute right-0 top-1 text-sm animate-[sparkle_2.4s_linear_infinite] drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]">{villager.effect}</span>
            </div>
            <div className="mt-0.5 h-2 w-8 rounded-full bg-black/20 blur-[2px]" />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 z-20 sm:bottom-6 sm:left-6">
        <div className="rounded-[22px] border border-white/14 bg-black/12 px-4 py-3 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
          <p className="text-[10px] tracking-[0.18em] text-white/56">ASSET SCENE</p>
          <p className="mt-1 text-sm text-white/80">에셋 기반 월드 전환 중</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes groundBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes sparkle {
          0% { transform: translateY(0px) scale(0.92); opacity: 0.55; }
          50% { transform: translateY(-5px) scale(1); opacity: 1; }
          100% { transform: translateY(0px) scale(0.92); opacity: 0.55; }
        }
      `}</style>
    </div>
  );
}
