import { PrismaClient, Gender, ApplicationStatus, MembershipRole, Plan, SubscriptionStatus } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_CHURCH_SLUG = "daehung-ieum-dubit";
const DEMO_CHURCH_NAME = "대흥교회 이음두빛";

async function main() {
  // Legacy demo slug migration guard
  const legacy = await prisma.church.findUnique({ where: { slug: "demo-soom" } });
  if (legacy) {
    await prisma.church.update({
      where: { id: legacy.id },
      data: { slug: DEMO_CHURCH_SLUG, name: DEMO_CHURCH_NAME },
    });
  }

  const church = await prisma.church.upsert({
    where: { slug: DEMO_CHURCH_SLUG },
    update: { name: DEMO_CHURCH_NAME, timezone: "Asia/Seoul", isActive: true },
    create: {
      slug: DEMO_CHURCH_SLUG,
      name: DEMO_CHURCH_NAME,
      timezone: "Asia/Seoul",
    },
  });

  const existingSubscription = await prisma.subscription.findFirst({ where: { churchId: church.id } });
  if (!existingSubscription) {
    await prisma.subscription.create({
      data: {
        churchId: church.id,
        plan: Plan.FREE,
        status: SubscriptionStatus.TRIALING,
        trialEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      },
    });
  }

  const adminRole = await prisma.role.upsert({
    where: { churchId_key: { churchId: church.id, key: "ADMIN" } },
    update: { name: "관리자" },
    create: { churchId: church.id, key: "ADMIN", name: "관리자" },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@soom.church" },
    update: { name: "숨 플랫폼 관리자" },
    create: {
      email: "admin@soom.church",
      passwordHash: "demo-admin",
      name: "숨 플랫폼 관리자",
    },
  });

  await prisma.churchMembership.upsert({
    where: { userId_churchId: { userId: admin.id, churchId: church.id } },
    update: { role: MembershipRole.OWNER, isActive: true, roleId: adminRole.id },
    create: {
      userId: admin.id,
      churchId: church.id,
      role: MembershipRole.OWNER,
      roleId: adminRole.id,
    },
  });

  const districtA = await prisma.district.upsert({
    where: { churchId_name: { churchId: church.id, name: "1교구" } },
    update: {},
    create: { churchId: church.id, name: "1교구", leadName: "홍길동 목자" },
  });

  const districtB = await prisma.district.upsert({
    where: { churchId_name: { churchId: church.id, name: "2교구" } },
    update: {},
    create: { churchId: church.id, name: "2교구", leadName: "김은혜 목자" },
  });

  const groupA = await prisma.group.upsert({
    where: { churchId_districtId_name: { churchId: church.id, districtId: districtA.id, name: "소망 목장" } },
    update: {},
    create: { churchId: church.id, districtId: districtA.id, name: "소망 목장" },
  });

  const groupB = await prisma.group.upsert({
    where: { churchId_districtId_name: { churchId: church.id, districtId: districtB.id, name: "은혜 목장" } },
    update: {},
    create: { churchId: church.id, districtId: districtB.id, name: "은혜 목장" },
  });

  const household = await prisma.household.create({
    data: { churchId: church.id, name: "박가정", address: "대전 중구" },
  });

  await prisma.member.createMany({
    data: [
      {
        churchId: church.id,
        name: "박수진",
        gender: Gender.FEMALE,
        birthDate: new Date("1993-02-14"),
        phone: "010-1111-2222",
        email: "sujin@example.com",
        address: "대전 서구",
        householdId: household.id,
        districtId: districtA.id,
        groupId: groupA.id,
        position: "집사",
        statusTag: "정착중",
        requiresFollowUp: true,
      },
      {
        churchId: church.id,
        name: "이민호",
        gender: Gender.MALE,
        birthDate: new Date("1988-06-03"),
        phone: "010-2222-3333",
        districtId: districtB.id,
        groupId: groupB.id,
        position: "성도",
        statusTag: "목장배정완료",
      },
    ],
  });

  const form = await prisma.applicationForm.create({
    data: {
      churchId: church.id,
      title: "새가족 등록 신청",
      description: "주일 예배 방문자 등록",
    },
  });

  await prisma.application.create({
    data: {
      churchId: church.id,
      formId: form.id,
      applicantName: "최하나",
      applicantPhone: "010-4444-5555",
      status: ApplicationStatus.PENDING,
      assignedToId: admin.id,
    },
  });

  await prisma.notice.create({
    data: {
      churchId: church.id,
      title: "이번 주일 새가족 환영팀 모집",
      content: "예배 후 로비에서 안내 봉사자를 모집합니다.",
      pinned: true,
      authorId: admin.id,
    },
  });

  await prisma.activityLog.create({
    data: {
      churchId: church.id,
      actorId: admin.id,
      action: "SEED_INIT",
      targetType: "SYSTEM",
      metadata: "Daehung Ieum Dubit demo workspace seeded",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
