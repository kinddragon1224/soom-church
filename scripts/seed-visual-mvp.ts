import { PrismaClient, Gender } from "@prisma/client";

const prisma = new PrismaClient();
const CHURCH_SLUG = "soom-dev";

type PersonSeed = {
  familyKey: string;
  householdName: string;
  districtName: string;
  groupName: string;
  name: string;
  gender: Gender;
  ageBand: "adult" | "youth" | "child";
  birthDate: Date;
  position?: string;
  statusTag: string;
  requiresFollowUp?: boolean;
  phone?: string;
  roleNote?: string;
};

const people: PersonSeed[] = [
  ["은혜가정","1교구","소망 목장",[
    ["김성훈",Gender.MALE,"adult","목자","안정",false],
    ["이은혜",Gender.FEMALE,"adult","집사","정착중",true],
    ["김하준",Gender.MALE,"child",undefined,"안정",false],
    ["김하린",Gender.FEMALE,"child",undefined,"안정",false],
  ]],
  ["사랑가정","1교구","소망 목장",[
    ["박준호",Gender.MALE,"adult","성도","후속필요",true],
    ["최수진",Gender.FEMALE,"adult","성도","정착중",true],
    ["박서연",Gender.FEMALE,"child",undefined,"안정",false],
  ]],
  ["평안가정","1교구","소망 목장",[
    ["정우진",Gender.MALE,"adult","집사","안정",false],
    ["한지민",Gender.FEMALE,"adult","권사","심방필요",true],
    ["정다온",Gender.FEMALE,"child",undefined,"안정",false],
  ]],
  ["이음가정","1교구","기쁨 목장",[
    ["오민석",Gender.MALE,"adult","목자","안정",false],
    ["서은지",Gender.FEMALE,"adult","집사","안정",false],
    ["오지후",Gender.MALE,"child",undefined,"후속필요",true],
  ]],
  ["새봄가정","1교구","기쁨 목장",[
    ["강다니엘",Gender.MALE,"adult","새가족","새가족",true],
    ["문소라",Gender.FEMALE,"adult","새가족","정착중",true],
    ["강예준",Gender.MALE,"child",undefined,"새가족",true],
  ]],
  ["반석가정","2교구","은혜 목장",[
    ["이도현",Gender.MALE,"adult","목자","안정",false],
    ["김나영",Gender.FEMALE,"adult","집사","안정",false],
    ["이주안",Gender.MALE,"child",undefined,"안정",false],
    ["이주원",Gender.FEMALE,"child",undefined,"안정",false],
  ]],
  ["소망가정","2교구","은혜 목장",[
    ["유승민",Gender.MALE,"adult","성도","심방필요",true],
    ["장혜진",Gender.FEMALE,"adult","성도","후속필요",true],
    ["유시온",Gender.MALE,"child",undefined,"안정",false],
  ]],
  ["열매가정","2교구","온유 목장",[
    ["조현우",Gender.MALE,"adult","목자","안정",false],
    ["백은서",Gender.FEMALE,"adult","권사","정착완료",false],
    ["조하율",Gender.FEMALE,"child",undefined,"안정",false],
  ]],
  ["믿음가정","2교구","온유 목장",[
    ["송태민",Gender.MALE,"adult","청년리더","정착중",true],
    ["윤아름",Gender.FEMALE,"adult","성도","후속필요",true],
    ["송하민",Gender.FEMALE,"child",undefined,"안정",false],
  ]],
].flatMap(([householdName,districtName,groupName,members]) =>
  (members as any[]).map(([name,gender,ageBand,position,statusTag,requiresFollowUp], index) => ({
    familyKey: String(householdName),
    householdName: String(householdName),
    districtName: String(districtName),
    groupName: String(groupName),
    name: String(name),
    gender: gender as Gender,
    ageBand: ageBand as "adult" | "youth" | "child",
    birthDate:
      ageBand === "child"
        ? new Date(2014 + (index % 6), index % 12, 10 + index)
        : new Date(1980 + (index % 20), index % 12, 10 + index),
    position: position ? String(position) : undefined,
    statusTag: String(statusTag),
    requiresFollowUp: Boolean(requiresFollowUp),
    phone: `010-${String(1000 + Math.floor(Math.random() * 9000))}-${String(1000 + Math.floor(Math.random() * 9000))}`,
  }))
);

async function main() {
  const church = await prisma.church.findUnique({ where: { slug: CHURCH_SLUG } });
  if (!church) throw new Error("church not found");

  for (const person of people) {
    const district = await prisma.district.upsert({
      where: { churchId_name: { churchId: church.id, name: person.districtName } },
      update: {},
      create: { churchId: church.id, name: person.districtName },
    });

    const group = await prisma.group.upsert({
      where: { churchId_districtId_name: { churchId: church.id, districtId: district.id, name: person.groupName } },
      update: {},
      create: { churchId: church.id, districtId: district.id, name: person.groupName },
    });

    const householdId = `${church.id}-household-${person.familyKey}`;
    const household = await prisma.household.upsert({
      where: { id: householdId },
      update: { name: person.householdName },
      create: { id: householdId, churchId: church.id, name: person.householdName },
    });

    const memberId = `${church.id}-member-${person.name}`;
    await prisma.member.upsert({
      where: { id: memberId },
      update: {
        name: person.name,
        gender: person.gender,
        birthDate: person.birthDate,
        householdId: household.id,
        districtId: district.id,
        groupId: group.id,
        position: person.position ?? (person.ageBand === "child" ? "어린이" : "성도"),
        phone: person.phone ?? "010-0000-0000",
        statusTag: person.statusTag,
        requiresFollowUp: person.requiresFollowUp ?? false,
        isDeleted: false,
      },
      create: {
        id: memberId,
        churchId: church.id,
        name: person.name,
        gender: person.gender,
        birthDate: person.birthDate,
        householdId: household.id,
        districtId: district.id,
        groupId: group.id,
        position: person.position ?? (person.ageBand === "child" ? "어린이" : "성도"),
        phone: person.phone ?? "010-0000-0000",
        statusTag: person.statusTag,
        requiresFollowUp: person.requiresFollowUp ?? false,
      },
    });
  }

  console.log(`Seeded visual MVP members: ${people.length}`);
}

main().finally(async () => {
  await prisma.$disconnect();
});
