import { PrismaClient } from '@prisma/client';
import { getChatThread, getPendingReviewQueue } from '../lib/chat-review-data.ts';
const prisma = new PrismaClient();
async function main() {
  const church = await prisma.church.findUnique({ where: { slug: 'gido' }, select: { id: true } });
  if (!church) throw new Error('no church');
  const captures = await getChatThread(church.id);
  const reviews = await getPendingReviewQueue(church.id);
  console.log('captures', captures.length, 'reviews', reviews.length);
}
main().finally(async () => { await prisma.$disconnect(); });
