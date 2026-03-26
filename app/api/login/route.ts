import { NextResponse } from "next/server";
import { MembershipRole, Plan, SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { getPostLoginPath } from "@/auth";
import { isPlatformAdminEmail } from "@/lib/admin";

const DEV_USER_EMAIL = "dev@soom.church";
const DEV_USER_PASSWORD = "1224";
const DEV_CHURCH_SLUG = "soom-dev";
const DEV_CHURCH_NAME = "숨 개발용 워크스페이스";

const PLATFORM_ADMIN_PASSWORD = "1234";
const PLATFORM_ADMIN_NAME = "숨 플랫폼 관리자";

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

async function ensurePlatformAdminAccount(email: string) {
  return prisma.user.upsert({
    where: { email },
    update: { name: PLATFORM_ADMIN_NAME, passwordHash: await hashPassword(PLATFORM_ADMIN_PASSWORD), isActive: true },
    create: {
      email,
      name: PLATFORM_ADMIN_NAME,
      passwordHash: await hashPassword(PLATFORM_ADMIN_PASSWORD),
      isActive: true,
    },
    select: { id: true },
  });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  const user = email === DEV_USER_EMAIL
    ? await ensureDevWorkspaceAccount()
    : isPlatformAdminEmail(email)
      ? await ensurePlatformAdminAccount(email)
      : await prisma.user.findUnique({ where: { email }, select: { id: true } });

  const redirectTo = next.startsWith("/") ? next : user ? await getPostLoginPath(user.id) : "/app";

  const callbackUrl = new URL("/api/auth/callback/credentials", request.url);
  callbackUrl.searchParams.set("callbackUrl", redirectTo);

  const body = new URLSearchParams();
  body.set("email", email);
  body.set("password", password);
  body.set("callbackUrl", redirectTo);

  return NextResponse.redirect(callbackUrl, { status: 307 });
}
