import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function getCurrentUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function isLoggedIn() {
  const userId = await getCurrentUserId();
  return Boolean(userId);
}

export async function requireAuth(next?: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    const loginPath = next ? `/login?next=${encodeURIComponent(next)}` : "/login";
    redirect(loginPath);
  }
}
