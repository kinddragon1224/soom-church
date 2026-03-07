import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "soom_admin_session";

export function isLoggedIn() {
  return cookies().get(SESSION_COOKIE)?.value === "1";
}

export function requireAuth() {
  if (!isLoggedIn()) redirect("/login");
}

export function setLoginCookie() {
  cookies().set(SESSION_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export function clearLoginCookie() {
  cookies().delete(SESSION_COOKIE);
}
