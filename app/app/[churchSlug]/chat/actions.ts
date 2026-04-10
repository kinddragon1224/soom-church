"use server";

import { revalidatePath } from "next/cache";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { submitStructuredChatMessage } from "@/lib/chat-submit";

export async function submitChatMessage(churchSlug: string, formData: FormData) {
  const rawText = String(formData.get("message") || "").trim();
  if (!rawText) return;

  const { membership, userId } = await requireWorkspaceMembership(churchSlug);
  if (!membership) return;

  await submitStructuredChatMessage({
    churchId: membership.church.id,
    churchName: membership.church.name,
    userId,
    rawText,
  });

  revalidatePath(`/app/${churchSlug}/chat`);
  revalidatePath(`/app/${churchSlug}/review`);
  revalidatePath(`/app/${churchSlug}/search`);
  revalidatePath(`/app/${churchSlug}/timeline`);
  revalidatePath(`/app/${churchSlug}/people`);
  revalidatePath(`/app/${churchSlug}/households`);
  revalidatePath(`/app/${churchSlug}/members`);
}
