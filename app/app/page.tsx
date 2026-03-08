import Link from "next/link";
import { getCurrentUserOrRedirect, getFirstChurchByUserId, getChurchBySlug } from "@/lib/church-context";
import { redirect } from "next/navigation";

export const preferredRegion = "sin1";

export default async function AppEntryPage() {
  const userId = getCurrentUserOrRedirect();

  const church = await getFirstChurchByUserId(userId);
  if (church) {
    redirect(`/app/${church.slug}/dashboard`);
  }

  const demoChurch = await getChurchBySlug("daehung-ieum-dubit");

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs text-muted-foreground">SOOM PLATFORM</p>
        <h1 className="mt-1 text-2xl font-bold">아직 연결된 교회 워크스페이스가 없습니다</h1>
        <p className="mt-2 text-sm text-muted-foreground">숨에 로그인한 뒤, 새 교회를 만들거나 초대받은 교회 워크스페이스에 참여하세요.</p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            className="rounded-md border border-border bg-muted px-3 py-2 text-left"
            disabled
            aria-disabled
          >
            <p className="text-sm font-medium">새 교회 만들기</p>
            <p className="text-xs text-muted-foreground">온보딩 2차에서 연결 예정</p>
          </button>

          <button
            type="button"
            className="rounded-md border border-border bg-muted px-3 py-2 text-left"
            disabled
            aria-disabled
          >
            <p className="text-sm font-medium">초대 코드 입력</p>
            <p className="text-xs text-muted-foreground">초대 토큰 기능 준비 중</p>
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {demoChurch ? (
            <Link href={`/app/${demoChurch.slug}/dashboard`} className="rounded-md bg-primary px-3 py-2 text-white">대흥교회 이음두빛 워크스페이스 보기</Link>
          ) : null}
          <Link href="/signup" className="rounded-md border border-border px-3 py-2">온보딩 안내 보기</Link>
        </div>
      </div>
    </main>
  );
}
