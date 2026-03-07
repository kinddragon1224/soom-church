import { getCurrentUserId, requireAuth } from "@/lib/auth";
import { getFirstChurchByUserId } from "@/lib/church-context";
import { redirect } from "next/navigation";

export default async function AppEntryPage() {
  requireAuth();

  const userId = getCurrentUserId();
  if (!userId) redirect("/login");

  const church = await getFirstChurchByUserId(userId);
  if (!church) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold">교회 워크스페이스가 없습니다</h1>
        <p className="mt-2 text-sm text-muted-foreground">온보딩 단계에서 교회 생성 또는 초대 수락 흐름이 필요합니다.</p>
      </main>
    );
  }

  redirect(`/app/${church.slug}/dashboard`);
}
