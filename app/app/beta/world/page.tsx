"use client";

import Image from "next/image";
import Link from "next/link";

const villagers = [
  { name: "목자", status: "집중", className: "left-[48%] top-[39%]", tone: "gold", effect: "☀" },
  { name: "새가족", status: "새 방문", className: "left-[28%] top-[46%]", tone: "soft", effect: "✦" },
  { name: "기도", status: "기도", className: "right-[28%] top-[47%]", tone: "violet", effect: "✧" },
  { name: "후속", status: "후속", className: "left-[35%] bottom-[21%]", tone: "amber", effect: "✉" },
  { name: "돌봄", status: "돌봄", className: "right-[34%] bottom-[20%]", tone: "sky", effect: "💧" },
];

function villagerTone(tone: string) {
  switch (tone) {
    case "gold":
      return "border-[#f5d48a]/60 bg-[#f6c86a40] text-[#fff0bf] shadow-[#f59e0b44]";
    case "violet":
      return "border-[#c4b5fd]/60 bg-[#8b5cf640] text-[#efe7ff] shadow-[#8b5cf655]";
    case "amber":
      return "border-[#fcd34d]/60 bg-[#f59e0b40] text-[#fff2c2] shadow-[#f59e0b55]";
    case "sky":
      return "border-[#7dd3fc]/60 bg-[#38bdf840] text-[#dff6ff] shadow-[#38bdf855]";
    default:
      return "border-white/24 bg-white/16 text-white shadow-black/20";
  }
}

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

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,25,0.18)_0%,rgba(8,14,25,0.05)_25%,rgba(8,14,25,0.12)_65%,rgba(8,14,25,0.28)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,232,178,0.12),transparent_28%)]" />

      <div className="absolute left-4 right-4 top-4 z-20 flex items-start justify-between gap-4 sm:left-6 sm:right-6 sm:top-6">
        <div className="max-w-[560px] rounded-[24px] border border-white/16 bg-black/16 px-5 py-4 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.14)]">
          <p className="text-[10px] tracking-[0.18em] text-white/58">BETA / WORLD SCENE</p>
          <h1 className="mt-2 text-[1.8rem] font-semibold tracking-[-0.05em]">월드 첫 장면</h1>
          <p className="mt-2 text-sm leading-6 text-white/78">
            키비주얼 기반 장면으로 전환했다. 이제부터는 박스보다 아트와 레이어를 중심으로 월드를 만든다.
          </p>
        </div>

        <div className="hidden gap-2 md:flex text-[11px]">
          <Link href="/app/beta/chat" className="rounded-full border border-white/16 bg-black/14 px-3 py-1.5 text-white/80 backdrop-blur-md">Chat</Link>
          <Link href="/app/beta/records" className="rounded-full border border-white/16 bg-black/14 px-3 py-1.5 text-white/80 backdrop-blur-md">Records</Link>
        </div>
      </div>

      <div className="absolute inset-0 z-10">
        {villagers.map((villager, index) => (
          <div
            key={villager.name}
            className={`absolute ${villager.className} z-20 flex w-[102px] flex-col items-center text-center`}
            style={{ animation: `bob ${2.7 + index * 0.22}s ease-in-out infinite` }}
          >
            <div className={`relative flex h-[74px] w-[74px] items-center justify-center rounded-[24px] border text-base font-semibold shadow-[0_12px_28px] backdrop-blur-sm ${villagerTone(villager.tone)}`}>
              <span className="absolute -top-3 right-0 text-sm animate-[sparkle_2.4s_linear_infinite] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{villager.effect}</span>
              {villager.name.slice(0, 1)}
            </div>
            <p className="mt-2 text-[12px] font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]">{villager.name}</p>
            <span className="mt-1 rounded-full border border-white/14 bg-black/16 px-2 py-0.5 text-[10px] text-white/78 backdrop-blur-sm">{villager.status}</span>
            <div className="mt-1 h-2 w-8 rounded-full bg-black/20 blur-[2px]" />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-20 grid gap-3 sm:bottom-6 sm:left-6 sm:right-6 lg:grid-cols-[1fr_220px]">
        <div className="rounded-[24px] border border-white/16 bg-black/16 px-5 py-4 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.14)]">
          <p className="text-[10px] tracking-[0.18em] text-white/56">ASSET PIPELINE</p>
          <p className="mt-2 text-sm leading-6 text-white/82">
            배경 이미지는 고정했다. 다음은 집, 캐릭터, 상태 이펙트를 실제 에셋으로 갈아끼우고 데이터를 붙인다.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/16 bg-black/16 px-4 py-4 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.14)]">
          <p className="text-[10px] tracking-[0.18em] text-white/56">NOW</p>
          <div className="mt-3 grid gap-2 text-sm text-white/82">
            <div className="rounded-[16px] border border-white/10 bg-white/[0.04] px-3 py-2">배경 고정</div>
            <div className="rounded-[16px] border border-white/10 bg-white/[0.04] px-3 py-2">오버레이 캐릭터 임시</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bob {
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
