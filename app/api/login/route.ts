import { setLoginCookie } from "@/lib/auth";
import { getFirstChurchByUserId } from "@/lib/church-context";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const preferredRegion = "sin1";

const PLATFORM_ADMIN_EMAILS = ["platform-admin@soom.church", "admin@soom.church"];

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.passwordHash !== password) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "invalid");
    if (next.startsWith("/")) loginUrl.searchParams.set("next", next);
    return NextResponse.redirect(loginUrl);
  }

  setLoginCookie(user.id);

  if (next.startsWith("/")) {
    return NextResponse.redirect(new URL(next, request.url));
  }

  if (PLATFORM_ADMIN_EMAILS.includes(user.email)) {
    return NextResponse.redirect(new URL("/platform-admin", request.url));
  }

  const church = await getFirstChurchByUserId(user.id);
  if (church) {
    return NextResponse.redirect(new URL(`/app/${church.slug}/dashboard`, request.url));
  }

  return NextResponse.redirect(new URL("/app", request.url));
}
