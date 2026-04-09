import { type GidoFamilyRole, getGidoPrayerOrder, parseGidoHouseholdMeta, parseGidoMemberMeta } from "@/lib/gido-home-config";
import { prisma } from "@/lib/prisma";

export type GidoMemberView = {
  id: string;
  name: string;
  birthLabel: string;
  householdName: string;
  statusTag: string;
  requiresFollowUp: boolean;
  homePinned: boolean;
  homePinnedAt: string | null;
};

export type GidoFollowUpView = {
  title: string;
  note: string;
  due: string;
  priority: "높음" | "중간" | "낮음";
  owner?: string;
};

export type GidoUpdateView = {
  title: string;
  body: string;
  note?: string;
  due?: string;
};

export type GidoHouseholdView = {
  id: string;
  title: string;
  members: { id: string; name: string; birthLabel: string; familyRole?: GidoFamilyRole }[];
  tags: string[];
  prayers: string[];
  contacts: string[];
  prayerOrder: number | null;
};

export type GidoWorkspaceData = {
  groupName: string;
  households: GidoHouseholdView[];
  members: GidoMemberView[];
  followUps: GidoFollowUpView[];
  updates: GidoUpdateView[];
  stats: {
    householdCount: number;
    memberCount: number;
    prayerCount: number;
    contactCount: number;
  };
};

function toBirthLabel(birthDate: Date, notes?: string | null) {
  const meta = parseGidoMemberMeta(notes);
  if (meta.birthLabel) return meta.birthLabel;
  return String(birthDate.getFullYear()).slice(-2);
}

export async function getGidoWorkspaceData(churchId: string): Promise<GidoWorkspaceData> {
  const [church, households, members] = await Promise.all([
    prisma.church.findUnique({ where: { id: churchId }, select: { name: true } }),
    prisma.household.findMany({
      where: { churchId },
      orderBy: { name: "asc" },
      select: { id: true, name: true, notes: true },
    }),
    prisma.member.findMany({
      where: { churchId, isDeleted: false },
      orderBy: [{ householdId: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        birthDate: true,
        notes: true,
        householdId: true,
        statusTag: true,
        requiresFollowUp: true,
        household: { select: { name: true } },
      },
    }),
  ]);

  const membersByHousehold = new Map<string, GidoHouseholdView["members"]>();
  const memberViews: GidoMemberView[] = members.map((member) => {
    const birthLabel = toBirthLabel(member.birthDate, member.notes);
    const householdName = member.household?.name ?? "미분류";
    const memberMeta = parseGidoMemberMeta(member.notes);
    const item = {
      id: member.id,
      name: member.name,
      birthLabel,
      familyRole: memberMeta.familyRole,
    };
    if (member.householdId) {
      const bucket = membersByHousehold.get(member.householdId) ?? [];
      bucket.push(item);
      membersByHousehold.set(member.householdId, bucket);
    }
    return {
      id: member.id,
      name: member.name,
      birthLabel,
      householdName,
      statusTag: member.statusTag,
      requiresFollowUp: member.requiresFollowUp,
      homePinned: Boolean(memberMeta.homePinned),
      homePinnedAt: memberMeta.homePinnedAt ?? null,
    };
  });

  const followUps: GidoFollowUpView[] = [];
  const updates: GidoUpdateView[] = [];

  const householdViews: GidoHouseholdView[] = households.map((household) => {
    const meta = parseGidoHouseholdMeta(household.notes);
    if (meta.followUps?.length) followUps.push(...(meta.followUps as GidoFollowUpView[]));
    if (meta.updates?.length) updates.push(...(meta.updates as GidoUpdateView[]));

    return {
      id: household.id,
      title: household.name,
      members: membersByHousehold.get(household.id) ?? [],
      tags: meta.tags ?? [],
      prayers: meta.prayers ?? [],
      contacts: meta.contacts ?? [],
      prayerOrder: getGidoPrayerOrder(household.name, household.notes),
    };
  });

  const prayerCount = householdViews.reduce((sum, household) => sum + household.prayers.length, 0);
  const contactCount = householdViews.reduce((sum, household) => sum + household.contacts.length, 0);

  return {
    groupName: church?.name ?? "G.I.D.O 목장",
    households: householdViews,
    members: memberViews,
    followUps,
    updates,
    stats: {
      householdCount: householdViews.length,
      memberCount: memberViews.length,
      prayerCount,
      contactCount,
    },
  };
}
