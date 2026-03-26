import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function getChurchGraphWorkspace(churchId: string) {
  return unstable_cache(
    async () => {
      const [districts, groups, households, members, orgLinks] = await Promise.all([
        prisma.district.findMany({ where: { churchId }, orderBy: { name: "asc" } }),
        prisma.group.findMany({ where: { churchId }, orderBy: { name: "asc" } }),
        prisma.household.findMany({ where: { churchId }, orderBy: { name: "asc" } }),
        prisma.member.findMany({
          where: { churchId, isDeleted: false },
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            statusTag: true,
            requiresFollowUp: true,
            districtId: true,
            groupId: true,
            householdId: true,
            position: true,
          },
        }),
        prisma.memberOrganization.findMany({
          where: { churchId },
          include: { organization: true },
        }),
      ]);

      const nodes = [
        ...districts.map((item) => ({ id: `district:${item.id}`, kind: "district", label: item.name })),
        ...groups.map((item) => ({ id: `group:${item.id}`, kind: "group", label: item.name, districtId: item.districtId })),
        ...households.map((item) => ({ id: `family:${item.id}`, kind: "family", label: item.name })),
        ...members.map((item) => ({
          id: `member:${item.id}`,
          kind: "member",
          label: item.name,
          statusTag: item.statusTag,
          requiresFollowUp: item.requiresFollowUp,
          position: item.position,
        })),
        ...orgLinks.map((item) => ({ id: `org:${item.organizationId}`, kind: "organization", label: item.organization.name, type: item.organization.type })),
      ];

      const orgNodeIds = new Set<string>();
      const uniqueNodes = nodes.filter((node) => {
        if (!node.id.startsWith("org:")) return true;
        if (orgNodeIds.has(node.id)) return false;
        orgNodeIds.add(node.id);
        return true;
      });

      const edges = [
        ...groups.map((item) => ({ id: `edge-group-district-${item.id}`, source: `district:${item.districtId}`, target: `group:${item.id}`, kind: "belongsTo" })),
        ...members.flatMap((item) => {
          const list = [] as { id: string; source: string; target: string; kind: string }[];
          if (item.groupId) list.push({ id: `edge-member-group-${item.id}`, source: `group:${item.groupId}`, target: `member:${item.id}`, kind: "groupMember" });
          if (item.householdId) list.push({ id: `edge-member-family-${item.id}`, source: `family:${item.householdId}`, target: `member:${item.id}`, kind: "familyMember" });
          return list;
        }),
        ...orgLinks.map((item) => ({ id: `edge-org-member-${item.memberId}-${item.organizationId}`, source: `org:${item.organizationId}`, target: `member:${item.memberId}`, kind: "organizationLink" })),
      ];

      return { nodes: uniqueNodes, edges };
    },
    [`church-graph-workspace-${churchId}`],
    { revalidate: 20, tags: [`church:${churchId}:dashboard`, `church:${churchId}:members`] },
  )();
}
