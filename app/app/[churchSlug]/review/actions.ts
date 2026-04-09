"use server";

import { revalidatePath } from "next/cache";
import { ExtractedUpdateStatus, ReviewItemStatus } from "@prisma/client";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { prisma } from "@/lib/prisma";

function getNextExtractedStatus(status: ReviewItemStatus) {
  switch (status) {
    case ReviewItemStatus.APPROVED:
    case ReviewItemStatus.EDITED_AND_APPROVED:
      return ExtractedUpdateStatus.CONFIRMED;
    case ReviewItemStatus.REJECTED:
      return ExtractedUpdateStatus.REJECTED;
    case ReviewItemStatus.MERGED:
      return ExtractedUpdateStatus.MERGED;
    case ReviewItemStatus.SKIPPED:
      return ExtractedUpdateStatus.DRAFT;
    default:
      return ExtractedUpdateStatus.NEEDS_REVIEW;
  }
}

export async function resolveReviewItem(churchSlug: string, formData: FormData) {
  const reviewItemId = String(formData.get("reviewItemId") || "").trim();
  const statusValue = String(formData.get("status") || "").trim();
  const resolutionNote = String(formData.get("resolutionNote") || "").trim() || null;
  if (!reviewItemId || !statusValue) return;

  const status = Object.values(ReviewItemStatus).find((item) => item === statusValue as ReviewItemStatus);
  if (!status) return;

  const { membership, userId } = await requireWorkspaceMembership(churchSlug);
  if (!membership) return;

  const reviewItem = await prisma.reviewItem.findFirst({
    where: {
      id: reviewItemId,
      churchId: membership.church.id,
    },
    select: {
      id: true,
      extractedUpdateId: true,
    },
  });
  if (!reviewItem) return;

  await prisma.$transaction(async (tx) => {
    await tx.reviewItem.update({
      where: { id: reviewItem.id },
      data: {
        status,
        reviewerId: userId,
        reviewedAt: new Date(),
        resolutionNote,
      },
    });

    await tx.extractedUpdate.update({
      where: { id: reviewItem.extractedUpdateId },
      data: {
        status: getNextExtractedStatus(status),
      },
    });
  });

  revalidatePath(`/app/${churchSlug}/chat`);
  revalidatePath(`/app/${churchSlug}/review`);
}
