import { prisma } from "@/lib/prisma";
import { signIn, getPostLoginPath } from "@/auth";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    const signupUrl = new URL("/signup", request.url);
    signupUrl.searchParams.set("error", "required");
    return NextResponse.redirect(signupUrl);
  }

  if (password.length < 8) {
    const signupUrl = new URL("/signup", request.url);
    signupUrl.searchParams.set("error", "weak_password");
    return NextResponse.redirect(signupUrl);
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const signupUrl = new URL("/signup", request.url);
    signupUrl.searchParams.set("error", "exists");
    return NextResponse.redirect(signupUrl);
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
      isActive: true,
    },
    select: { id: true },
  });

  return signIn("credentials", {
    email,
    password,
    redirectTo: await getPostLoginPath(user.id),
  });
}
