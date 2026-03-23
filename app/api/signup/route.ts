import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import { slugifyKorean } from "@/lib/slug";
import { MembershipRole, Plan, SubscriptionStatus } from "@prisma/client";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const churchName = String(formData.get("churchName") ?? "").trim();
  const roleInput = String(formData.get("role") ?? "VIEWER").trim().toUpperCase();
  const ministry = String(formData.get("ministry") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password || !churchName) {
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

  const role = (["OWNER", "ADMIN", "PASTOR", "LEADER", "VIEWER"] as const).includes(roleInput as MembershipRole)
    ? (roleInput as MembershipRole)
    : MembershipRole.VIEWER;

  const baseSlug = slugifyKorean(churchName) || `church-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;
  while (await prisma.church.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  await prisma.user.create({
    data: {
      name: ministry ? `${name} · ${ministry}` : name,
      email,
      passwordHash: await hashPassword(password),
      isActive: true,
      memberships: {
        create: {
          role,
          isActive: true,
          church: {
            create: {
              name: churchName,
              slug,
              timezone: "Asia/Seoul",
              isActive: true,
              subscriptions: {
                create: {
                  plan: Plan.FREE,
                  status: SubscriptionStatus.TRIALING,
                  trialEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
                },
              },
            },
          },
        },
      },
    },
  });

  return signIn("credentials", {
    email,
    password,
    redirectTo: `/app/${slug}/dashboard`,
  });
}
