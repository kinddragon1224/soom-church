import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";

function normalizeIdentifier(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const identifier = normalizeIdentifier(String(formData.get("identifier") ?? ""));
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!identifier || !name || !password) {
    return NextResponse.redirect(new URL("/signup?error=모든 항목을 입력해 주세요.", request.url));
  }

  if (identifier.length < 3) {
    return NextResponse.redirect(new URL("/signup?error=아이디는 3자 이상이어야 합니다.", request.url));
  }

  if (password.length < 4) {
    return NextResponse.redirect(new URL("/signup?error=비밀번호는 4자 이상이어야 합니다.", request.url));
  }

  const email = `${identifier}@beta.soom.local`;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { name: identifier }],
    },
    select: { id: true },
  });

  if (existingUser) {
    return NextResponse.redirect(new URL("/signup?error=이미 사용 중인 아이디입니다.", request.url));
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: hashedPassword,
    },
  });

  await signIn("credentials", {
    identifier,
    password,
    redirect: true,
    redirectTo: "/app/beta",
  });

  return NextResponse.redirect(new URL("/app/beta", request.url));
}
