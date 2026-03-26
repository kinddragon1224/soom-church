import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const next = String(formData.get("next") ?? "");
  const callbackUrl = next.startsWith("/") ? next : "/app";

  const target = new URL("/login", request.url);
  target.searchParams.set("legacy", "1");
  target.searchParams.set("next", callbackUrl);

  return NextResponse.redirect(target, { status: 303 });
}
