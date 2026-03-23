import { AuthError } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signIn, getPostLoginPath } from "@/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  const redirectTo = next.startsWith("/") ? next : user ? await getPostLoginPath(user.id) : "/app";

  try {
    return await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const loginUrl = new URL("/login", request.url);
      if (next.startsWith("/")) loginUrl.searchParams.set("next", next);
      loginUrl.searchParams.set("error", "credentials");
      return NextResponse.redirect(loginUrl);
    }
    throw error;
  }
}
