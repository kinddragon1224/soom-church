import { redirect } from "next/navigation";
import { getCurrentUserOrRedirect } from "@/lib/church-context";
import { prisma } from "@/lib/prisma";
import { isPlatformAdminEmail } from "@/lib/admin";

export async function requirePlatformAdmin() {
  const userId = await getCurrentUserOrRedirect("/platform-admin");

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });

    if (!user || !isPlatformAdminEmail(user.email)) {
      redirect("/app");
    }

    return user;
  } catch {
    redirect("/app");
  }
}
