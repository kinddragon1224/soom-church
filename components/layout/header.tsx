import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="flex w-full min-w-0 items-center justify-between gap-2 border-b border-[#e6dfd5] bg-white px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.05)] sm:px-6 sm:py-4">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#d9d2c7] lg:hidden"
          aria-label="메뉴 열기"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <p className="hidden text-sm text-[#8C7A5B] sm:block">플랫폼 관리자</p>
          <h2 className="truncate text-base font-semibold text-[#111111] sm:text-lg">운영 콘솔</h2>
        </div>
      </div>
      <form action="/api/logout" method="post" className="shrink-0">
        <Button variant="outline" type="submit" className="h-9 border-[#d9d2c7] px-3 text-xs text-[#111111] sm:h-10 sm:px-4 sm:text-sm">로그아웃</Button>
      </form>
    </header>
  );
}
