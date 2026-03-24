import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export async function getChurchOrganizationOverview(churchId: string) {
  return unstable_cache(
    async () => {
      const [labels, units] = await Promise.all([
        prisma.organizationUnitLabel.findMany({
          where: { churchId },
          orderBy: { type: "asc" },
        }),
        prisma.organizationUnit.findMany({
          where: { churchId },
          include: {
            parent: { select: { id: true, name: true, type: true } },
            _count: { select: { memberLinks: true, children: true } },
          },
          orderBy: [{ type: "asc" }, { name: "asc" }],
        }),
      ]);

      return { labels, units };
    },
    [`church-organization-overview-${churchId}`],
    { revalidate: 20, tags: [`church:${churchId}:organizations`] },
  )();
}
