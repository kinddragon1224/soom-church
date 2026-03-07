import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border lg:hidden"
          aria-label="메뉴 열기"
        >
          <Menu size={18} />
        </button>
        <div>
          <p className="text-xs text-muted-foreground sm:text-sm">교회 운영 허브</p>
          <h2 className="text-base font-semibold sm:text-lg">오늘의 운영 현황</h2>
        </div>
      </div>
      <form action="/api/logout" method="post">
        <Button variant="outline" type="submit" className="h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm">로그아웃</Button>
      </form>
    </header>
  );
}
