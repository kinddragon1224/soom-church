import { PrismaClient, MembershipRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const PLATFORM_ADMIN_EMAILS = ["platform-admin@soom.church", "admin@soom.church"];

const prisma = new PrismaClient();

const simpleLoginId = (process.env.GIDO_SIMPLE_LOGIN_ID || "gido").trim().toLowerCase();
const simplePassword = process.env.GIDO_SIMPLE_PASSWORD || "1234";
const leaderPasswordFromEnv = process.env.GIDO_LEADER_PASSWORD || process.env.GIDO_LEADER1_PASSWORD;

const leaderAccount = {
  email: process.env.GIDO_LEADER_EMAIL || process.env.GIDO_LEADER1_EMAIL || "gido.mokja1@soom.church",
  name: process.env.GIDO_LEADER_NAME || process.env.GIDO_LEADER1_NAME || "G.I.D.O 목자",
  password: leaderPasswordFromEnv || simplePassword,
  role: MembershipRole.LEADER,
};

async function attachPlatformAdmins(churchId) {
  const admins = await prisma.user.findMany({
    where: { email: { in: PLATFORM_ADMIN_EMAILS } },
    select: { id: true, email: true },
  });

  for (const admin of admins) {
    await prisma.churchMembership.upsert({
      where: { userId_churchId: { userId: admin.id, churchId } },
      update: { role: MembershipRole.ADMIN },
      create: { userId: admin.id, churchId, role: MembershipRole.ADMIN },
    });
  }

  return admins;
}

async function removeLegacyLeader(churchId) {
  const legacyEmail = process.env.GIDO_LEADER2_EMAIL || "gido.mokja2@soom.church";
  const legacyUser = await prisma.user.findUnique({ where: { email: legacyEmail }, select: { id: true } });
  if (!legacyUser) return;

  await prisma.churchMembership.deleteMany({ where: { userId: legacyUser.id, churchId } });
  const remainingMemberships = await prisma.churchMembership.count({ where: { userId: legacyUser.id } });
  if (remainingMemberships === 0) {
    await prisma.user.delete({ where: { id: legacyUser.id } });
  }
}

async function main() {
  const church = await prisma.church.upsert({
    where: { slug: "gido" },
    update: { name: "G.I.D.O 목장" },
    create: { slug: "gido", name: "G.I.D.O 목장" },
  });

  const passwordHash = await bcrypt.hash(leaderAccount.password, 10);
  const user = await prisma.user.upsert({
    where: { email: leaderAccount.email },
    update: { name: leaderAccount.name, passwordHash },
    create: { email: leaderAccount.email, name: leaderAccount.name, passwordHash },
  });

  await prisma.churchMembership.upsert({
    where: { userId_churchId: { userId: user.id, churchId: church.id } },
    update: { role: leaderAccount.role },
    create: { userId: user.id, churchId: church.id, role: leaderAccount.role },
  });

  await removeLegacyLeader(church.id);
  const attachedAdmins = await attachPlatformAdmins(church.id);

  console.log(`G.I.D.O workspace ready: /app/${church.slug}/chat`);
  console.log(`Leader account: ${leaderAccount.email}`);
  console.log(`Quick login: ${simpleLoginId} / ${leaderPasswordFromEnv ? "custom password from env" : simplePassword}`);
  console.log(`Attached platform admins: ${attachedAdmins.map((admin) => admin.email).join(", ") || "none found"}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
