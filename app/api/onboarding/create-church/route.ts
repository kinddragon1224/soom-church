import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugifyKorean } from "@/lib/slug";
import { MembershipRole, Plan, SubscriptionStatus } from "@prisma/client";
import { NextResponse } from "next/server";

const allowedRoles: MembershipRole[] = ["OWNER", "ADMIN", "PASTOR", "LEADER", "VIEWER"];

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const formData = await request.formData();
  const churchName = String(formData.get("churchName") ?? "").trim();
  const churchSlugInput = String(formData.get("churchSlug") ?? "").trim();
  const roleInput = String(formData.get("role") ?? "OWNER").trim().toUpperCase();
  const teamName = String(formData.get("teamName") ?? "").trim();
  const attendanceBand = String(formData.get("attendanceBand") ?? "").trim();
  const primaryGoal = String(formData.get("primaryGoal") ?? "").trim();
  const setupNote = String(formData.get("setupNote") ?? "").trim();

  if (!churchName) {
    const appUrl = new URL("/app", request.url);
    appUrl.searchParams.set("error", "church_name_required");
    return NextResponse.redirect(appUrl);
  }

  const role = allowedRoles.includes(roleInput as MembershipRole)
    ? (roleInput as MembershipRole)
    : MembershipRole.OWNER;

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
          role,
        },
      },
      activityLogs: {
        create: {
          action: "WORKSPACE_ONBOARDED",
          targetType: "CHURCH",
          metadata: JSON.stringify({
            churchName,
            slug,
            role,
            teamName,
            attendanceBand,
            primaryGoal,
            setupNote,
            createdFrom: "app-onboarding",
          }),
        },
      },
    },
  });

  return NextResponse.redirect(new URL(`/app/${church.slug}/dashboard`, request.url));
}
