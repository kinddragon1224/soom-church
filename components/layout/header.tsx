import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
      <div>
        <p className="text-sm text-muted-foreground">교회 운영 허브</p>
        <h2 className="text-lg font-semibold">오늘의 행정 상태</h2>
      </div>
      <form action="/api/logout" method="post">
        <Button variant="outline" type="submit">로그아웃</Button>
      </form>
    </header>
  );
}
