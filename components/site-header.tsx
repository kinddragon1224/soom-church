"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type SiteHeaderProps = {
  theme?: "light" | "dark";
  current?: "home" | "workspace" | "pricing" | "about" | "guides" | "contact";
  ctaHref?: string;
  ctaLabel?: string;
};

const navItems = [
  { href: "/", label: "홈", key: "home" },
  { href: "/app/soom-dev/dashboard", label: "워크스페이스", key: "workspace" },
  { href: "/pricing", label: "콘텐츠 제작", key: "pricing" },
  { href: "/ai-guides", label: "블로그", key: "guides" },
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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navClass = isDark ? "text-white/80" : "text-[#43506b]";
  const activeClass = isDark ? "text-white" : "text-[#0c1220]";
  const buttonClass = isDark
    ? "border-white/20 bg-white/5 text-white"
    : "border-[#d9d2c7] bg-[#111827] text-white";
  const mobileSurfaceClass = isDark
    ? "bg-[#07101d] text-white"
    : "bg-[#f7f4ee] text-[#0c1220]";
  const mobileLinkClass = isDark
    ? "border-white/10 bg-white/[0.03] text-white/88"
    : "border-[#e6dfd5] bg-white text-[#334155]";

  return (
    <>
      <header className="relative flex items-center justify-between gap-4">
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
      </header>

      {open && (
        <div className={`fixed inset-0 z-[100] md:hidden ${mobileSurfaceClass}`}>
          <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={`font-display text-[1.85rem] font-semibold tracking-[-0.08em] ${isDark ? "text-white" : "text-[#0c1220]"}`}
              >
                soom
              </Link>
              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setOpen(false)}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full border ${isDark ? "border-white/15 bg-white/[0.04] text-white" : "border-[#ddd2c3] bg-white text-[#0c1220]"}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-10 grid gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-[20px] border px-5 py-4 text-base font-medium ${current === item.key ? activeClass : ""} ${mobileLinkClass}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto grid gap-3 pt-10">
              <Link
                href={ctaHref}
                onClick={() => setOpen(false)}
                className={`inline-flex min-h-12 items-center justify-center rounded-full border px-5 text-sm font-semibold ${buttonClass}`}
              >
                {ctaLabel}
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className={`inline-flex min-h-12 items-center justify-center rounded-full border px-5 text-sm font-medium ${isDark ? "border-white/15 bg-white/[0.03] text-white" : "border-[#ddd2c3] bg-white text-[#0c1220]"}`}
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
