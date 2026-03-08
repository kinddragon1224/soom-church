import { getCurrentUserOrRedirect } from "@/lib/church-context";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const PLATFORM_ADMIN_EMAILS = ["platform-admin@soom.church", "admin@soom.church"];

export default async function PlatformAdminPage() {
  const userId = getCurrentUserOrRedirect();
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });

  if (!user || !PLATFORM_ADMIN_EMAILS.includes(user.email)) {
    redirect("/app");
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <section className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs text-muted-foreground">SOOM PLATFORM ADMIN</p>
        <h1 className="mt-1 text-2xl font-bold">숨 플랫폼 관리자 페이지</h1>
        <p className="mt-2 text-sm text-muted-foreground">{user.name} 계정으로 접속 중입니다. 이 영역은 플랫폼 운영 전용입니다.</p>
      </section>
    </main>
  );
}
