import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugifyKorean } from "@/lib/slug";

async function getUniqueSlug(baseName: string) {
  const baseSlug = slugifyKorean(baseName) || "soom-workspace";

  const existing = await prisma.church.findMany({
    where: { slug: { startsWith: baseSlug } },
    select: { slug: true },
  });

  const existingSet = new Set(existing.map((item) => item.slug));
  if (!existingSet.has(baseSlug)) return baseSlug;

  let index = 2;
  while (existingSet.has(`${baseSlug}-${index}`)) {
    index += 1;
  }

  return `${baseSlug}-${index}`;
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "로그인이 필요해." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? "").trim();

  if (!name) {
    return NextResponse.json({ error: "이름을 입력해줘." }, { status: 400 });
  }

  const existingMembership = await prisma.churchMembership.findFirst({
    where: { userId, isActive: true, church: { isActive: true } },
    select: { church: { select: { slug: true } } },
  });

  if (existingMembership?.church?.slug) {
    return NextResponse.json({ redirectTo: `/app/${existingMembership.church.slug}/world` });
  }

  const slug = await getUniqueSlug(name);

  const church = await prisma.church.create({
    data: {
      name,
      slug,
      timezone: "Asia/Seoul",
      isActive: true,
    },
  });

  await prisma.churchMembership.create({
    data: {
      userId,
      churchId: church.id,
      role: "OWNER",
      isActive: true,
    },
  });

  return NextResponse.json({
    redirectTo: `/app/${church.slug}/world`,
    churchId: church.id,
    slug: church.slug,
  });
}
