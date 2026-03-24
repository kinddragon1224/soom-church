import { PrismaClient, Gender, ApplicationStatus, MembershipRole, Plan, SubscriptionStatus, OrganizationUnitType, MemberOrgRole, RelationshipType, CareCategory, SacramentType } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

const DEV_CHURCH_SLUG = "soom-dev";
const DEV_CHURCH_NAME = "숨 개발용 워크스페이스";

const PLATFORM_ADMIN_EMAIL = "platform-admin@soom.church";
const PLATFORM_ADMIN_PASSWORD = "1234";

const DEV_USER_EMAIL = "dev@soom.church";
const DEV_USER_PASSWORD = "1234";

async function main() {
  const legacy = await prisma.church.findUnique({ where: { slug: "demo-soom" } });
  if (legacy) {
    await prisma.church.update({
      where: { id: legacy.id },
      data: { slug: DEV_CHURCH_SLUG, name: DEV_CHURCH_NAME },
    });
  }

  const church = await prisma.church.upsert({
    where: { slug: DEV_CHURCH_SLUG },
    update: { name: DEV_CHURCH_NAME, timezone: "Asia/Seoul", isActive: true },
    create: {
      slug: DEV_CHURCH_SLUG,
      name: DEV_CHURCH_NAME,
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

  const ownerRole = await prisma.role.upsert({
    where: { churchId_key: { churchId: church.id, key: "OWNER" } },
    update: { name: "워크스페이스 오너" },
    create: { churchId: church.id, key: "OWNER", name: "워크스페이스 오너" },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: DEV_USER_EMAIL },
    update: { name: "숨 개발용 운영자", passwordHash: await hashPassword(DEV_USER_PASSWORD), isActive: true },
    create: {
      email: DEV_USER_EMAIL,
      passwordHash: await hashPassword(DEV_USER_PASSWORD),
      name: "숨 개발용 운영자",
      isActive: true,
    },
  });

  await prisma.churchMembership.upsert({
    where: { userId_churchId: { userId: demoUser.id, churchId: church.id } },
    update: { role: MembershipRole.OWNER, isActive: true, roleId: ownerRole.id },
    create: {
      userId: demoUser.id,
      churchId: church.id,
      role: MembershipRole.OWNER,
      roleId: ownerRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: PLATFORM_ADMIN_EMAIL },
    update: { name: "숨 플랫폼 관리자", passwordHash: await hashPassword(PLATFORM_ADMIN_PASSWORD), isActive: true },
    create: {
      email: PLATFORM_ADMIN_EMAIL,
      passwordHash: await hashPassword(PLATFORM_ADMIN_PASSWORD),
      name: "숨 플랫폼 관리자",
      isActive: true,
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

  const orgLabels = [
    { type: OrganizationUnitType.DISTRICT, singular: "교구", plural: "교구" },
    { type: OrganizationUnitType.GROUP, singular: "목장", plural: "목장" },
    { type: OrganizationUnitType.DEPARTMENT, singular: "부서", plural: "부서" },
    { type: OrganizationUnitType.MINISTRY, singular: "사역", plural: "사역" },
    { type: OrganizationUnitType.FELLOWSHIP, singular: "선교회", plural: "선교회" },
    { type: OrganizationUnitType.SPECIAL_COMMUNITY, singular: "공동체", plural: "공동체" },
  ];

  for (const label of orgLabels) {
    await prisma.organizationUnitLabel.upsert({
      where: { churchId_type: { churchId: church.id, type: label.type } },
      update: { singular: label.singular, plural: label.plural },
      create: { churchId: church.id, type: label.type, singular: label.singular, plural: label.plural },
    });
  }

  const ieumDistrict = await prisma.organizationUnit.upsert({
    where: { churchId_slug: { churchId: church.id, slug: "ieum-district" } },
    update: { name: "이음교구", type: OrganizationUnitType.DISTRICT },
    create: { churchId: church.id, name: "이음교구", slug: "ieum-district", type: OrganizationUnitType.DISTRICT },
  });

  const gidoGroup = await prisma.organizationUnit.upsert({
    where: { churchId_slug: { churchId: church.id, slug: "gido-group" } },
    update: { name: "G.I.D.O 목장", type: OrganizationUnitType.GROUP, parentId: ieumDistrict.id },
    create: { churchId: church.id, name: "G.I.D.O 목장", slug: "gido-group", type: OrganizationUnitType.GROUP, parentId: ieumDistrict.id },
  });

  const youthDept = await prisma.organizationUnit.upsert({
    where: { churchId_slug: { churchId: church.id, slug: "yedidiyah-young-adults" } },
    update: { name: "여디디야", type: OrganizationUnitType.DEPARTMENT },
    create: { churchId: church.id, name: "여디디야", slug: "yedidiyah-young-adults", type: OrganizationUnitType.DEPARTMENT },
  });

  const womensMission = await prisma.organizationUnit.upsert({
    where: { churchId_slug: { churchId: church.id, slug: "total-women-mission" } },
    update: { name: "총여선교회", type: OrganizationUnitType.FELLOWSHIP },
    create: { churchId: church.id, name: "총여선교회", slug: "total-women-mission", type: OrganizationUnitType.FELLOWSHIP },
  });

  const household = await prisma.household.upsert({
    where: { id: `${church.id}-park-home` },
    update: { name: "박가정", address: "대전 중구" },
    create: { id: `${church.id}-park-home`, churchId: church.id, name: "박가정", address: "대전 중구" },
  });

  const parkSujin = await prisma.member.upsert({
    where: { id: `${church.id}-member-park-sujin` },
    update: {
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
      currentJob: "중학교 교사",
      previousChurch: "대흥침례교회 이명",
      baptismStatus: "침례 완료",
      isDeleted: false,
    },
    create: {
      id: `${church.id}-member-park-sujin`,
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
      currentJob: "중학교 교사",
      previousChurch: "대흥침례교회 이명",
      baptismStatus: "침례 완료",
    },
  });

  const leeMinho = await prisma.member.upsert({
    where: { id: `${church.id}-member-lee-minho` },
    update: {
      name: "이민호",
      gender: Gender.MALE,
      birthDate: new Date("1988-06-03"),
      phone: "010-2222-3333",
      districtId: districtB.id,
      groupId: groupB.id,
      position: "성도",
      statusTag: "목장배정완료",
      currentJob: "디자이너",
      previousFaith: "모태신앙",
      baptismStatus: "세례 완료",
      isDeleted: false,
    },
    create: {
      id: `${church.id}-member-lee-minho`,
      churchId: church.id,
      name: "이민호",
      gender: Gender.MALE,
      birthDate: new Date("1988-06-03"),
      phone: "010-2222-3333",
      districtId: districtB.id,
      groupId: groupB.id,
      position: "성도",
      statusTag: "목장배정완료",
      currentJob: "디자이너",
      previousFaith: "모태신앙",
      baptismStatus: "세례 완료",
    },
  });

  const kangEunmi = await prisma.member.upsert({
    where: { id: `${church.id}-member-kang-eunmi` },
    update: {
      name: "강은미",
      gender: Gender.FEMALE,
      birthDate: new Date("1990-09-12"),
      phone: "010-3333-4444",
      email: "eunmi@example.com",
      address: "대전 서구",
      householdId: household.id,
      districtId: districtA.id,
      groupId: groupA.id,
      position: "권사",
      statusTag: "정착완료",
      currentJob: "간호사",
      baptismStatus: "침례 완료",
      isDeleted: false,
    },
    create: {
      id: `${church.id}-member-kang-eunmi`,
      churchId: church.id,
      name: "강은미",
      gender: Gender.FEMALE,
      birthDate: new Date("1990-09-12"),
      phone: "010-3333-4444",
      email: "eunmi@example.com",
      address: "대전 서구",
      householdId: household.id,
      districtId: districtA.id,
      groupId: groupA.id,
      position: "권사",
      statusTag: "정착완료",
      currentJob: "간호사",
      baptismStatus: "침례 완료",
    },
  });

  await prisma.memberOrganization.createMany({
    data: [
      { churchId: church.id, memberId: parkSujin.id, organizationId: ieumDistrict.id, role: MemberOrgRole.MEMBER, isPrimary: true },
      { churchId: church.id, memberId: parkSujin.id, organizationId: gidoGroup.id, role: MemberOrgRole.MEMBER },
      { churchId: church.id, memberId: parkSujin.id, organizationId: womensMission.id, role: MemberOrgRole.VOLUNTEER },
      { churchId: church.id, memberId: leeMinho.id, organizationId: youthDept.id, role: MemberOrgRole.VOLUNTEER, isPrimary: true },
      { churchId: church.id, memberId: kangEunmi.id, organizationId: ieumDistrict.id, role: MemberOrgRole.LEAD, isPrimary: true },
      { churchId: church.id, memberId: kangEunmi.id, organizationId: gidoGroup.id, role: MemberOrgRole.ASSISTANT_LEAD },
    ],
    skipDuplicates: true,
  });

  const existingRelationship = await prisma.memberRelationship.findFirst({
    where: { churchId: church.id, fromMemberId: parkSujin.id, toMemberId: kangEunmi.id, relationshipType: RelationshipType.SPOUSE },
  });
  if (!existingRelationship) {
    await prisma.memberRelationship.createMany({
      data: [
        { churchId: church.id, fromMemberId: parkSujin.id, toMemberId: kangEunmi.id, relationshipType: RelationshipType.SPOUSE, isPrimaryFamilyLink: true },
        { churchId: church.id, fromMemberId: kangEunmi.id, toMemberId: parkSujin.id, relationshipType: RelationshipType.SPOUSE, isPrimaryFamilyLink: true },
      ],
    });
  }

  const careExists = await prisma.memberCareRecord.findFirst({ where: { churchId: church.id, memberId: parkSujin.id, title: "봄 심방" } });
  if (!careExists) {
    await prisma.memberCareRecord.createMany({
      data: [
        { churchId: church.id, memberId: parkSujin.id, category: CareCategory.VISIT, title: "봄 심방", summary: "가정 예배와 자녀 양육 부담을 함께 나눔", recordedBy: "김선용", happenedAt: new Date("2026-03-10T10:00:00+09:00") },
        { churchId: church.id, memberId: parkSujin.id, category: CareCategory.JOB, title: "직장 고민 메모", summary: "학기 중 업무 과중으로 피로감 호소", recordedBy: "김선용", happenedAt: new Date("2026-03-16T15:30:00+09:00") },
        { churchId: church.id, memberId: kangEunmi.id, category: CareCategory.HEALTH, title: "건강 기도 요청", summary: "허리 통증으로 장시간 봉사 어려움", recordedBy: "조성진", happenedAt: new Date("2026-03-18T18:00:00+09:00") },
      ],
    });
  }

  const lifeExists = await prisma.memberLifeStatus.findFirst({ where: { churchId: church.id, memberId: parkSujin.id, title: "가정 재정 점검" } });
  if (!lifeExists) {
    await prisma.memberLifeStatus.createMany({
      data: [
        { churchId: church.id, memberId: parkSujin.id, type: "FINANCE", title: "가정 재정 점검", summary: "자녀 교육비 부담으로 지출 압박이 큼", happenedAt: new Date("2026-03-12T00:00:00+09:00") },
        { churchId: church.id, memberId: parkSujin.id, type: "FAMILY", title: "가족 돌봄 이슈", summary: "부모님 병원 동행으로 주중 시간이 부족함", happenedAt: new Date("2026-03-14T00:00:00+09:00") },
        { churchId: church.id, memberId: kangEunmi.id, type: "HEALTH", title: "건강 회복 필요", summary: "허리 통증으로 장시간 봉사 어려움", happenedAt: new Date("2026-03-18T00:00:00+09:00") },
      ],
    });
  }

  const faithExists = await prisma.memberFaithMilestone.findFirst({ where: { churchId: church.id, memberId: parkSujin.id, type: SacramentType.BAPTISM } });
  if (!faithExists) {
    await prisma.memberFaithMilestone.createMany({
      data: [
        { churchId: church.id, memberId: parkSujin.id, type: SacramentType.BAPTISM, happenedAt: new Date("2018-05-20T00:00:00+09:00"), churchName: "대흥침례교회" },
        { churchId: church.id, memberId: leeMinho.id, type: SacramentType.MEMBERSHIP_TRANSFER, happenedAt: new Date("2024-09-01T00:00:00+09:00"), churchName: "서울새빛교회" },
      ],
    });
  }

  const existingForm = await prisma.applicationForm.findFirst({ where: { churchId: church.id, title: "새가족 등록 신청" } });
  const form = existingForm
    ? await prisma.applicationForm.update({ where: { id: existingForm.id }, data: { description: "주일 예배 방문자 등록", isActive: true } })
    : await prisma.applicationForm.create({
        data: {
          churchId: church.id,
          title: "새가족 등록 신청",
          description: "주일 예배 방문자 등록",
        },
      });

  const existingApplication = await prisma.application.findFirst({ where: { churchId: church.id, applicantName: "최하나" } });
  if (!existingApplication) {
    await prisma.application.create({
      data: {
        churchId: church.id,
        formId: form.id,
        applicantName: "최하나",
        applicantPhone: "010-4444-5555",
        status: ApplicationStatus.PENDING,
        assignedToId: demoUser.id,
      },
    });
  }

  const existingNotice = await prisma.notice.findFirst({ where: { churchId: church.id, title: "이번 주일 새가족 환영팀 모집" } });
  if (!existingNotice) {
    await prisma.notice.create({
      data: {
        churchId: church.id,
        title: "이번 주일 새가족 환영팀 모집",
        content: "예배 후 로비에서 안내 봉사자를 모집합니다.",
        pinned: true,
        authorId: demoUser.id,
      },
    });
  }

  const existingGuide = await prisma.guidePost.findFirst({ where: { slug: "sermon-ai-start" } });
  if (!existingGuide) {
    await prisma.guidePost.create({
      data: {
        title: "설교 준비에 AI를 시작하는 가장 쉬운 방법",
        slug: "sermon-ai-start",
        excerpt: "설교 초안을 대신 쓰게 하는 것이 아니라, 구조 정리와 자료 탐색을 빠르게 돕는 방식으로 AI를 시작하는 방법을 정리합니다.",
        content: "AI는 설교를 대신하는 도구가 아니라 준비 시간을 줄이는 보조 도구입니다.\n\n1. 본문을 먼저 정합니다.\n2. 핵심 질문을 3개로 나눕니다.\n3. AI에게 배경 정보, 반대 관점, 적용 예시를 따로 요청합니다.\n4. 마지막 구조와 문장은 직접 정리합니다.",
        published: true,
        publishedAt: new Date(),
        authorId: demoUser.id,
      },
    });
  }

  await prisma.activityLog.create({
    data: {
      churchId: church.id,
      actorId: demoUser.id,
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
