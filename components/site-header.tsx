"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type SiteHeaderProps = {
  theme?: "light" | "dark";
  current?: "home" | "about" | "diagnosis" | "contact" | "workspace" | "pricing" | "guides";
  ctaHref?: string;
  ctaLabel?: string;
  loggedIn?: boolean;
  adminMode?: boolean;
};

const navItems = [
  { href: "/", label: "홈", key: "home" },
  { href: "/about", label: "진단 관점", key: "about" },
  { href: "/diagnosis", label: "진단하기", key: "diagnosis" },
  { href: "/contact", label: "30분 방향 진단", key: "contact" },
] as const;

export default function SiteHeader({ theme = "light", current, ctaHref = "/contact", ctaLabel = "30분 방향 진단 신청", loggedIn = false, adminMode = false }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navClass = isDark ? "text-white/68" : "text-[#4a5568]";
  const activeClass = isDark ? "text-white" : "text-[#0b1020]";
  const buttonClass = isDark ? "border-white/15 bg-white text-[#080b12]" : "border-[#080b12] bg-[#080b12] text-white";
  const mobileSurfaceClass = isDark ? "bg-[#080b12] text-white" : "bg-[#f6f1e8] text-[#080b12]";
  const mobileLinkClass = isDark ? "border-white/10 bg-white/[0.04] text-white/86" : "border-[#d7d0c5] bg-white/80 text-[#1f2937]";

  return (
    <>
      <header className="relative z-20 flex min-w-0 items-center justify-between gap-3">
        <Link href="/" className={`shrink-0 text-[1.9rem] font-black tracking-[-0.1em] sm:text-[2.35rem] ${isDark ? "text-white" : "text-[#080b12]"}`}>soom</Link>
        <nav className={`hidden min-w-0 items-center gap-7 text-sm font-bold md:flex ${navClass}`}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={current === item.key ? activeClass : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button type="button" aria-label={open ? "메뉴 닫기" : "메뉴 열기"} aria-expanded={open} onClick={() => setOpen((value) => !value)} className={`inline-flex h-11 w-11 items-center justify-center rounded-full border md:hidden ${isDark ? "border-white/15 bg-white/[0.04] text-white" : "border-[#d7d0c5] bg-white/60 text-[#080b12]"}`}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="hidden items-center gap-2 md:flex">
          {loggedIn ? (
            adminMode ? (
              <Link href="/platform-admin" className={`inline-flex min-h-11 items-center justify-center rounded-full border px-5 text-sm font-bold ${isDark ? "border-white/18 bg-white/[0.04] text-white" : "border-[#d7d0c5] bg-white/70 text-[#080b12]"}`}>관리자 콘솔</Link>
            ) : (
              <form action="/api/logout" method="post"><button type="submit" className={`inline-flex min-h-11 items-center justify-center rounded-full border px-5 text-sm font-bold ${isDark ? "border-white/18 bg-white/[0.04] text-white" : "border-[#d7d0c5] bg-white/70 text-[#080b12]"}`}>로그아웃</button></form>
            )
          ) : null}
          <Link href={ctaHref} className={`inline-flex min-h-11 items-center justify-center rounded-full border px-5 text-sm font-bold ${buttonClass}`}>{ctaLabel}</Link>
        </div>
      </header>
      {open ? (
        <div className={`fixed inset-0 z-[100] overflow-y-auto md:hidden ${mobileSurfaceClass}`}>
          <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6">
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)} className="text-[1.9rem] font-black tracking-[-0.1em]">soom</Link>
              <button type="button" aria-label="메뉴 닫기" onClick={() => setOpen(false)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-current/15"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-10 grid gap-3">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`rounded-[22px] border px-5 py-4 text-base font-bold ${mobileLinkClass}`}>{item.label}</Link>
              ))}
            </div>
            <div className="mt-auto pb-4 pt-10">
              <Link href={ctaHref} onClick={() => setOpen(false)} className={`inline-flex min-h-12 w-full items-center justify-center rounded-full border px-5 text-sm font-bold ${buttonClass}`}>{ctaLabel}</Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
