import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="flex w-full min-w-0 items-center justify-between gap-2 border-b border-border bg-white/95 px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.05)] backdrop-blur sm:px-6 sm:py-4">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border lg:hidden"
          aria-label="메뉴 열기"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <p className="hidden text-sm text-muted-foreground sm:block">교회 운영 허브</p>
          <h2 className="truncate text-base font-semibold sm:text-lg">오늘의 운영 현황</h2>
        </div>
      </div>
      <form action="/api/logout" method="post" className="shrink-0">
        <Button variant="outline" type="submit" className="h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm">로그아웃</Button>
      </form>
    </header>
  );
}
