import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugifyKorean } from "@/lib/slug";
import { MembershipRole, Plan, SubscriptionStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const formData = await request.formData();
  const churchName = String(formData.get("churchName") ?? "").trim();
  const churchSlugInput = String(formData.get("churchSlug") ?? "").trim();

  if (!churchName) {
    const appUrl = new URL("/app", request.url);
    appUrl.searchParams.set("error", "church_name_required");
    return NextResponse.redirect(appUrl);
  }

  const baseSlug = slugifyKorean(churchSlugInput || churchName) || `church-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;

  while (await prisma.church.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const church = await prisma.church.create({
    data: {
      name: churchName,
      slug,
      timezone: "Asia/Seoul",
      subscriptions: {
        create: {
          plan: Plan.FREE,
          status: SubscriptionStatus.TRIALING,
          trialEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        },
      },
      memberships: {
        create: {
          userId,
          role: MembershipRole.OWNER,
        },
      },
    },
  });

  return NextResponse.redirect(new URL(`/app/${church.slug}/dashboard`, request.url));
}
