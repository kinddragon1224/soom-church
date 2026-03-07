import { clearLoginCookie } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  clearLoginCookie();
  return NextResponse.redirect(new URL("/login", request.url));
}
