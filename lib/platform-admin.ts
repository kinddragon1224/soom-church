import { redirect } from "next/navigation";
import { getCurrentUserOrRedirect } from "@/lib/church-context";
import { prisma } from "@/lib/prisma";

export const PLATFORM_ADMIN_EMAILS = ["platform-admin@soom.church", "admin@soom.church"];

export async function requirePlatformAdmin() {
  const userId = await getCurrentUserOrRedirect("/platform-admin");
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });

  if (!user || !PLATFORM_ADMIN_EMAILS.includes(user.email)) {
    redirect("/app");
  }

  return user;
}
