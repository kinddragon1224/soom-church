"use client";

import Image from "next/image";
import Link from "next/link";

const homes = [
  { name: "가정 A", className: "left-[7%] top-[24%]" },
  { name: "가정 B", className: "right-[9%] top-[29%]" },
  { name: "가정 C", className: "left-[16%] bottom-[17%]" },
  { name: "가정 D", className: "right-[16%] bottom-[15%]" },
];

const villagers = [
  { name: "목자", status: "집중", className: "left-[48%] top-[39%]", src: "/beta-world/asset-leader-01.jpg", effect: "☀" },
  { name: "새가족", status: "새 방문", className: "left-[28%] top-[46%]", src: "/beta-world/asset-member-01.jpg", effect: "✦" },
  { name: "기도", status: "기도", className: "right-[28%] top-[47%]", src: "/beta-world/asset-member-01.jpg", effect: "✧" },
  { name: "후속", status: "후속", className: "left-[35%] bottom-[21%]", src: "/beta-world/asset-member-01.jpg", effect: "✉" },
  { name: "돌봄", status: "돌봄", className: "right-[34%] bottom-[20%]", src: "/beta-world/asset-member-01.jpg", effect: "💧" },
];

export default function BetaWorldPage() {
  return (
    <div className="relative -m-4 min-h-[calc(100vh-2rem)] overflow-hidden rounded-[30px] sm:-m-5 lg:-m-6">
      <Image src="/beta-world/world-bg-key-01.jpg" alt="Soom beta world key visual" fill priority className="object-cover" />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,25,0.12)_0%,rgba(8,14,25,0.03)_24%,rgba(8,14,25,0.08)_66%,rgba(8,14,25,0.22)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,232,178,0.14),transparent_28%)]" />

      <div className="absolute left-4 right-4 top-4 z-20 flex items-start justify-between gap-4 sm:left-6 sm:right-6 sm:top-6">
        <div className="max-w-[560px] rounded-[24px] border border-white/16 bg-black/16 px-5 py-4 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.14)]">
          <p className="text-[10px] tracking-[0.18em] text-white/58">BETA / WORLD SCENE</p>
          <h1 className="mt-2 text-[1.8rem] font-semibold tracking-[-0.05em]">월드 첫 장면</h1>
          <p className="mt-2 text-sm leading-6 text-white/78">
            배경뿐 아니라 집, 중심 건물, 캐릭터도 에셋으로 바꾸기 시작했다. 이제 박스형 프로토타입에서 진짜 장면형 월드로 넘어간다.
          </p>
        </div>

        <div className="hidden gap-2 md:flex text-[11px]">
          <Link href="/app/beta/chat" className="rounded-full border border-white/16 bg-black/14 px-3 py-1.5 text-white/80 backdrop-blur-md">Chat</Link>
          <Link href="/app/beta/records" className="rounded-full border border-white/16 bg-black/14 px-3 py-1.5 text-white/80 backdrop-blur-md">Records</Link>
        </div>
      </div>

      <div className="absolute inset-0 z-10">
        <div className="absolute left-[50%] top-[8%] z-10 -translate-x-1/2 text-center animate-[float_10s_ease-in-out_infinite]">
          <div className="relative h-[170px] w-[190px] drop-shadow-[0_20px_28px_rgba(0,0,0,0.22)]">
            <Image src="/beta-world/asset-church-01.jpg" alt="church asset" fill className="object-contain" />
          </div>
          <p className="mt-2 text-sm font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]">중심 공간</p>
        </div>

        {homes.map((home, index) => (
          <div
            key={home.name}
            className={`absolute ${home.className} z-10 w-[180px] text-center`}
            style={{ animation: `float ${9 + index * 1.1}s ease-in-out infinite` }}
          >
            <div className="relative mx-auto h-[150px] w-[170px] drop-shadow-[0_18px_26px_rgba(0,0,0,0.2)]">
              <Image src="/beta-world/asset-house-01.jpg" alt={`${home.name} asset`} fill className="object-contain" />
            </div>
            <p className="-mt-2 text-sm font-semibold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]">{home.name}</p>
            <div className="mx-auto mt-1 h-2 w-12 rounded-full bg-black/20 blur-[2px]" />
          </div>
        ))}

        {villagers.map((villager, index) => (
          <div
            key={villager.name}
            className={`absolute ${villager.className} z-20 flex w-[104px] flex-col items-center text-center`}
            style={{ animation: `bob ${2.7 + index * 0.22}s ease-in-out infinite` }}
          >
            <div className="relative h-[92px] w-[92px] drop-shadow-[0_12px_22px_rgba(0,0,0,0.24)]">
              <Image src={villager.src} alt={`${villager.name} asset`} fill className="object-contain" />
              <span className="absolute right-1 top-0 text-sm animate-[sparkle_2.4s_linear_infinite] drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]">{villager.effect}</span>
            </div>
            <p className="mt-1 text-[12px] font-medium text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]">{villager.name}</p>
            <span className="mt-1 rounded-full border border-white/14 bg-black/16 px-2 py-0.5 text-[10px] text-white/78 backdrop-blur-sm">{villager.status}</span>
            <div className="mt-1 h-2 w-8 rounded-full bg-black/20 blur-[2px]" />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-20 grid gap-3 sm:bottom-6 sm:left-6 sm:right-6 lg:grid-cols-[1fr_220px]">
        <div className="rounded-[24px] border border-white/16 bg-black/16 px-5 py-4 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.14)]">
          <p className="text-[10px] tracking-[0.18em] text-white/56">ASSET PIPELINE</p>
          <p className="mt-2 text-sm leading-6 text-white/82">
            배경, 중심 건물, 집, 캐릭터까지 에셋으로 전환했다. 다음은 상태별 캐릭터 변형과 실제 데이터 연결이다.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/16 bg-black/16 px-4 py-4 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.14)]">
          <p className="text-[10px] tracking-[0.18em] text-white/56">NOW</p>
          <div className="mt-3 grid gap-2 text-sm text-white/82">
            <div className="rounded-[16px] border border-white/10 bg-white/[0.04] px-3 py-2">배경 에셋</div>
            <div className="rounded-[16px] border border-white/10 bg-white/[0.04] px-3 py-2">집/중심 건물 에셋</div>
            <div className="rounded-[16px] border border-white/10 bg-white/[0.04] px-3 py-2">캐릭터 에셋</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
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
