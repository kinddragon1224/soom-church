"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

async function refresh(churchId: string) {
  revalidatePath("/platform-admin");
  revalidatePath("/platform-admin/churches");
  revalidatePath(`/platform-admin/churches/${churchId}`);
}

export async function updatePlatformChurch(churchId: string, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const timezone = String(formData.get("timezone") || "Asia/Seoul").trim();
  const adminNote = String(formData.get("adminNote") || "").trim() || null;
  const priorityTag = String(formData.get("priorityTag") || "").trim() || null;
  const isActive = formData.get("isActive") === "on";

  if (!name) return;

  await prisma.church.update({
    where: { id: churchId },
    data: { name, timezone, adminNote, priorityTag, isActive },
  });

  await refresh(churchId);
  redirect(`/platform-admin/churches/${churchId}?saved=1`);
}
