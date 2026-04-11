"use client";

import Image from "next/image";
import Link from "next/link";

export default function BetaWorldPage() {
  return (
    <div className="relative -m-4 min-h-[calc(100vh-2rem)] overflow-hidden rounded-[30px] sm:-m-5 lg:-m-6">
      <Image
        src="/beta-world/world-bg-key-01.jpg"
        alt="Soom beta world background"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,25,0.08)_0%,rgba(8,14,25,0.01)_28%,rgba(8,14,25,0.06)_70%,rgba(8,14,25,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,232,178,0.10),transparent_30%)]" />

      <div className="absolute left-4 right-4 top-4 z-20 flex items-start justify-between gap-4 sm:left-6 sm:right-6 sm:top-6">
        <div className="max-w-[320px] rounded-[22px] border border-white/14 bg-black/10 px-5 py-4 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.10)]">
          <p className="text-[10px] tracking-[0.18em] text-white/56">BETA / WORLD</p>
          <h1 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.05em]">월드 첫 장면</h1>
        </div>

        <div className="hidden gap-2 md:flex text-[11px]">
          <Link href="/app/beta/chat" className="rounded-full border border-white/14 bg-black/10 px-3 py-1.5 text-white/78 backdrop-blur-md">Chat</Link>
          <Link href="/app/beta/records" className="rounded-full border border-white/14 bg-black/10 px-3 py-1.5 text-white/78 backdrop-blur-md">Records</Link>
          <Link href="/app/beta/world/shepherding" className="rounded-full border border-white/14 bg-black/10 px-3 py-1.5 text-white/78 backdrop-blur-md">목양</Link>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 z-20 sm:bottom-6 sm:left-6">
        <div className="rounded-[20px] border border-white/14 bg-black/10 px-4 py-3 text-white backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.10)]">
          <p className="text-[10px] tracking-[0.18em] text-white/56">SCENE MODE</p>
          <p className="mt-1 text-sm text-white/80">배경 중심 월드</p>
        </div>
      </div>
    </div>
  );
}
