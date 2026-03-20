"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

type SiteHeaderProps = {
  theme?: "light" | "dark";
  current?: "home" | "pricing" | "about" | "contact";
  ctaHref?: string;
  ctaLabel?: string;
};

const navItems = [
  { href: "/", label: "홈", key: "home" },
  { href: "/pricing", label: "상품", key: "pricing" },
  { href: "/about", label: "About", key: "about" },
  { href: "/contact", label: "문의", key: "contact" },
] as const;

export default function SiteHeader({
  theme = "light",
  current,
  ctaHref = "/contact",
  ctaLabel = "문의하기",
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const isDark = theme === "dark";

  const shellClass = isDark
    ? "border-white/10 bg-transparent text-white"
    : "border-[#e6dfd5] bg-white text-[#0c1220]";
  const navClass = isDark ? "text-white/80" : "text-[#43506b]";
  const activeClass = isDark ? "text-white" : "text-[#0c1220]";
  const buttonClass = isDark
    ? "border-white/20 bg-white/5 text-white"
    : "border-[#d9d2c7] bg-[#111827] text-white";
  const mobilePanelClass = isDark
    ? "border-white/10 bg-[#091122]/98 text-white"
    : "border-[#e6dfd5] bg-white text-[#0c1220]";
  const mobileLinkClass = isDark
    ? "border-white/10 bg-white/[0.03] text-white/84"
    : "border-[#ece5db] bg-[#faf8f4] text-[#334155]";

  return (
    <header className={`relative flex items-center justify-between gap-4 ${shellClass}`}>
      <Link
        href="/"
        className={`font-display text-[1.85rem] font-semibold tracking-[-0.08em] sm:text-[2.3rem] ${isDark ? "text-white" : "text-[#0c1220]"}`}
      >
        soom
      </Link>

      <nav className={`hidden items-center gap-6 text-sm md:flex ${navClass}`}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={current === item.key ? activeClass : undefined}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border ${isDark ? "border-white/15 bg-white/[0.04] text-white" : "border-[#ddd2c3] bg-[#faf8f4] text-[#0c1220]"}`}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <Link
        href={ctaHref}
        className={`hidden min-h-11 items-center justify-center rounded-full border px-5 text-sm font-semibold md:inline-flex ${buttonClass}`}
      >
        {ctaLabel}
      </Link>

      {open && (
        <div className={`absolute left-0 right-0 top-full z-50 mt-3 rounded-[28px] border p-4 shadow-[0_24px_60px_rgba(15,23,42,0.18)] md:hidden ${mobilePanelClass}`}>
          <div className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-2xl border px-4 py-3 text-sm ${current === item.key ? activeClass : ""} ${mobileLinkClass}`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={ctaHref}
              onClick={() => setOpen(false)}
              className={`mt-2 inline-flex min-h-11 items-center justify-center rounded-full border px-5 text-sm font-semibold ${buttonClass}`}
            >
              {ctaLabel}
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={`inline-flex min-h-11 items-center justify-center rounded-full border px-5 text-sm font-medium ${isDark ? "border-white/15 bg-white/[0.03] text-white" : "border-[#ddd2c3] bg-white text-[#0c1220]"}`}
            >
              로그인
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
