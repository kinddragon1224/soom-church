import { PrismaClient } from '@prisma/client';
import { getGidoWorkspaceData } from '../lib/gido-workspace-data.ts';
import { buildGidoRecoveryQueries } from '../lib/gido-chat-first.ts';
const prisma = new PrismaClient();
async function main() {
  const church = await prisma.church.findUnique({ where: { slug: 'gido' }, select: { id: true } });
  if (!church) throw new Error('no church');
  const data = await getGidoWorkspaceData(church.id);
  console.log('members', data.members.length, 'households', data.households.length, 'followUps', data.followUps.length, 'updates', data.updates.length);
  const queries = buildGidoRecoveryQueries(data);
  console.log('queries', queries.length);
}
main().finally(async () => { await prisma.$disconnect(); });
