import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "soom_admin_session";
const USER_COOKIE = "soom_user_id";

export function getCurrentUserId() {
  return cookies().get(USER_COOKIE)?.value ?? null;
}

export function isLoggedIn() {
  const session = cookies().get(SESSION_COOKIE)?.value === "1";
  const userId = getCurrentUserId();
  return session && Boolean(userId);
}

export function requireAuth() {
  if (!isLoggedIn()) redirect("/login");
}

export function setLoginCookie(userId: string) {
  cookies().set(SESSION_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  cookies().set(USER_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export function clearLoginCookie() {
  cookies().delete(SESSION_COOKIE);
  cookies().delete(USER_COOKIE);
}
