import { PrismaClient, MembershipRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const accounts = [
  {
    email: process.env.GIDO_LEADER1_EMAIL || "gido.mokja1@soom.church",
    name: process.env.GIDO_LEADER1_NAME || "G.I.D.O 목자 1",
    password: process.env.GIDO_LEADER1_PASSWORD,
    role: MembershipRole.LEADER,
  },
  {
    email: process.env.GIDO_LEADER2_EMAIL || "gido.mokja2@soom.church",
    name: process.env.GIDO_LEADER2_NAME || "G.I.D.O 목자 2",
    password: process.env.GIDO_LEADER2_PASSWORD,
    role: MembershipRole.LEADER,
  },
  {
    email: process.env.GIDO_ADMIN1_EMAIL || "sunyong@gido.local",
    name: process.env.GIDO_ADMIN1_NAME || "김선용 관리자",
    password: process.env.GIDO_ADMIN1_PASSWORD,
    role: MembershipRole.ADMIN,
  },
  {
    email: process.env.GIDO_ADMIN2_EMAIL || "mora@gido.local",
    name: process.env.GIDO_ADMIN2_NAME || "모라 관리자",
    password: process.env.GIDO_ADMIN2_PASSWORD,
    role: MembershipRole.ADMIN,
  },
];

for (const account of accounts) {
  if (!account.password) {
    throw new Error(`Missing password for ${account.email}. Set the matching GIDO_*_PASSWORD env.`);
  }
}

async function main() {
  const church = await prisma.church.upsert({
    where: { slug: "gido" },
    update: { name: "G.I.D.O 목장" },
    create: { slug: "gido", name: "G.I.D.O 목장" },
  });

  for (const account of accounts) {
    const passwordHash = await bcrypt.hash(account.password, 10);
    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: { name: account.name, passwordHash },
      create: { email: account.email, name: account.name, passwordHash },
    });

    await prisma.churchMembership.upsert({
      where: { userId_churchId: { userId: user.id, churchId: church.id } },
      update: { role: account.role },
      create: { userId: user.id, churchId: church.id, role: account.role },
    });
  }

  console.log(`G.I.D.O workspace ready: /app/${church.slug}/dashboard`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
