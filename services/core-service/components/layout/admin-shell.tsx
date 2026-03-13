"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { DesktopSidebar, MobileSidebar } from "@/components/layout/sidebar";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div className="flex min-h-screen w-full min-w-0">
      <DesktopSidebar />

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="모바일 메뉴"
      >
        <button
          className={cn(
            "absolute inset-0 bg-black/35 transition-opacity duration-200",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          aria-label="메뉴 닫기"
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={cn(
            "absolute left-0 top-0 h-full w-[82vw] max-w-[320px] transform transition-transform duration-250 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-end border-b border-border bg-white px-4 py-3">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border"
              aria-label="드로어 닫기"
            >
              <X size={16} />
            </button>
          </div>
          <MobileSidebar onNavigate={() => setMobileOpen(false)} />
        </div>
      </div>

      <div className="flex w-full min-w-0 flex-1 flex-col">
        <Header onOpenMenu={() => setMobileOpen(true)} />
        <main className="flex-1 w-full min-w-0 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
