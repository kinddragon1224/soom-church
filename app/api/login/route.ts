import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPostLoginPath } from "@/auth";

function buildLoginRedirect(request: Request, path: string, next?: string, error?: string) {
  const url = new URL(path, request.url);
  if (next && next.startsWith("/")) url.searchParams.set("next", next);
  if (error) url.searchParams.set("error", error);
  return url;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!email || !password) {
    return NextResponse.redirect(buildLoginRedirect(request, "/login", next, "credentials"), { status: 303 });
  }

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  const redirectTo = next.startsWith("/") ? next : user ? await getPostLoginPath(user.id) : "/app";

  const callbackUrl = new URL("/api/auth/callback/credentials", request.url);
  callbackUrl.searchParams.set("callbackUrl", redirectTo);

  const body = new URLSearchParams();
  body.set("email", email);
  body.set("password", password);
  body.set("callbackUrl", redirectTo);

  const response = await fetch(callbackUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      cookie: request.headers.get("cookie") ?? "",
    },
    body,
    redirect: "manual",
  });

  const location = response.headers.get("location");
  const destination = location
    ? new URL(location, request.url)
    : buildLoginRedirect(request, "/login", next, "credentials");

  const nextResponse = NextResponse.redirect(destination, { status: 303 });
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) nextResponse.headers.append("set-cookie", setCookie);

  return nextResponse;
}
