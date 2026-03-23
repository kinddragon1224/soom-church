import { AuthError } from "next-auth";
import { NextResponse } from "next/server";
import { MembershipRole, Plan, SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { signIn, getPostLoginPath } from "@/auth";

const DEV_USER_EMAIL = "dev@soom.church";
const DEV_USER_PASSWORD = "1234";
const DEV_CHURCH_SLUG = "soom-dev";
const DEV_CHURCH_NAME = "숨 개발용 워크스페이스";

async function ensureDevWorkspaceAccount() {
  const church = await prisma.church.upsert({
    where: { slug: DEV_CHURCH_SLUG },
    update: { name: DEV_CHURCH_NAME, timezone: "Asia/Seoul", isActive: true },
    create: { slug: DEV_CHURCH_SLUG, name: DEV_CHURCH_NAME, timezone: "Asia/Seoul", isActive: true },
  });

  const user = await prisma.user.upsert({
    where: { email: DEV_USER_EMAIL },
    update: { name: "숨 개발용 운영자", passwordHash: await hashPassword(DEV_USER_PASSWORD), isActive: true },
    create: {
      email: DEV_USER_EMAIL,
      name: "숨 개발용 운영자",
      passwordHash: await hashPassword(DEV_USER_PASSWORD),
      isActive: true,
    },
  });

  const subscription = await prisma.subscription.findFirst({ where: { churchId: church.id } });
  if (!subscription) {
    await prisma.subscription.create({
      data: {
        churchId: church.id,
        plan: Plan.FREE,
        status: SubscriptionStatus.TRIALING,
        trialEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      },
    });
  }

  const membership = await prisma.churchMembership.findUnique({
    where: { userId_churchId: { userId: user.id, churchId: church.id } },
    select: { id: true },
  });

  if (!membership) {
    await prisma.churchMembership.create({
      data: {
        userId: user.id,
        churchId: church.id,
        role: MembershipRole.OWNER,
        isActive: true,
      },
    });
  }

  return user;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  const user = email === DEV_USER_EMAIL ? await ensureDevWorkspaceAccount() : await prisma.user.findUnique({ where: { email }, select: { id: true } });
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
