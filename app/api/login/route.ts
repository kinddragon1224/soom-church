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

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.passwordHash !== password) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  setLoginCookie(user.id);

  if (PLATFORM_ADMIN_EMAILS.includes(user.email)) {
    return NextResponse.redirect(new URL("/platform-admin", request.url));
  }

  const church = await getFirstChurchByUserId(user.id);
  if (church) {
    return NextResponse.redirect(new URL(`/app/${church.slug}/dashboard`, request.url));
  }

  return NextResponse.redirect(new URL("/app", request.url));
}
