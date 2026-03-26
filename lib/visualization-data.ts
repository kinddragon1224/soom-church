import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function getChurchStructureMap(churchId: string) {
  return unstable_cache(
    async () => {
      const districts = await prisma.district.findMany({
        where: { churchId },
        orderBy: { name: "asc" },
        include: {
          groups: {
            orderBy: { name: "asc" },
            include: {
              members: {
                where: { isDeleted: false },
                include: { household: true },
                orderBy: { name: "asc" },
              },
            },
          },
        },
      });

      return districts.map((district) => ({
        id: district.id,
        name: district.name,
        groups: district.groups.map((group) => {
          const familyMap = new Map<string, { id: string; name: string; members: { id: string; name: string; statusTag: string; requiresFollowUp: boolean; position: string | null; }[] }>();

          for (const member of group.members) {
            const householdId = member.household?.id ?? `${group.id}-ungrouped`;
            const householdName = member.household?.name ?? "미분류 가정";
            if (!familyMap.has(householdId)) {
              familyMap.set(householdId, { id: householdId, name: householdName, members: [] });
            }
            familyMap.get(householdId)!.members.push({
              id: member.id,
              name: member.name,
              statusTag: member.statusTag,
              requiresFollowUp: member.requiresFollowUp,
              position: member.position,
            });
          }

          const families = [...familyMap.values()];
          const memberCount = group.members.length;
          const followUpCount = group.members.filter((member) => member.requiresFollowUp).length;
          const visitCount = group.members.filter((member) => member.statusTag === "심방필요").length;
          const newCount = group.members.filter((member) => member.statusTag === "새가족").length;

          return {
            id: group.id,
            name: group.name,
            memberCount,
            familyCount: families.length,
            followUpCount,
            visitCount,
            newCount,
            families,
          };
        }),
      }));
    },
    [`church-structure-map-${churchId}`],
    { revalidate: 20, tags: [`church:${churchId}:dashboard`, `church:${churchId}:members`] },
  )();
}
