import { setLoginCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.passwordHash !== password) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  setLoginCookie();
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
