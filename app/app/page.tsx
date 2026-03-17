import Link from "next/link";
import { getCurrentUserOrRedirect, getFirstChurchByUserId, getChurchBySlug } from "@/lib/church-context";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const preferredRegion = "sin1";

export default async function AppEntryPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const userId = await getCurrentUserOrRedirect();

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });
  if (user?.email === "platform-admin@soom.church" || user?.email === "admin@soom.church") {
    redirect("/platform-admin");
  }

  const church = await getFirstChurchByUserId(userId);
  if (church) {
    redirect(`/app/${church.slug}/dashboard`);
  }

  const demoChurch = await getChurchBySlug("daehung-ieum-dubit");
  const error = searchParams?.error;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs text-muted-foreground">SOOM PLATFORM</p>
        <h1 className="mt-1 text-2xl font-bold">아직 연결된 교회 워크스페이스가 없습니다</h1>
        <p className="mt-2 text-sm text-muted-foreground">{user?.name ?? "사용자"}님 계정은 만들어졌어. 이제 새 교회를 만들거나 초대받은 워크스페이스에 참여하면 바로 시작할 수 있어.</p>

        {error === "church_name_required" ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            교회 이름을 입력해줘.
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <form action="/api/onboarding/create-church" method="post" className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="text-sm font-medium">새 교회 만들기</p>
            <p className="mt-1 text-xs text-muted-foreground">교회 이름만 입력하면 무료 워크스페이스를 바로 만들 수 있어.</p>
            <div className="mt-4 space-y-3">
              <input
                name="churchName"
                placeholder="예: 대흥교회 이음두빛"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                required
              />
              <input
                name="churchSlug"
                placeholder="선택: 영문 슬러그 (예: daehung-ieum)"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <button type="submit" className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-white">
                무료 워크스페이스 만들기
              </button>
            </div>
          </form>

          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="text-sm font-medium">초대받은 교회에 참여하기</p>
            <p className="mt-1 text-xs text-muted-foreground">초대 코드 기반 참여 기능은 다음 단계에서 붙일게. 지금은 새 교회 생성부터 먼저 열어뒀어.</p>
            <div className="mt-4 rounded-md border border-dashed border-border bg-background px-3 py-4 text-sm text-muted-foreground">
              초대 코드 입력 기능 준비 중
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {demoChurch ? (
            <Link href={`/app/${demoChurch.slug}/dashboard`} className="rounded-md border border-border px-3 py-2">대흥교회 이음두빛 데모 보기</Link>
          ) : null}
          <Link href="/signup" className="rounded-md border border-border px-3 py-2">회원가입 화면 보기</Link>
        </div>
      </div>
    </main>
  );
}
