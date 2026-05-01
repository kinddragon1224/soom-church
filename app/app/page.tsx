import { redirect } from "next/navigation";

import { getCurrentUserId } from "@/lib/auth";
import { getAccessibleChurchesByUserId } from "@/lib/church-context";

export default async function AppEntryPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/diagnosis");
  }

  const churches = await getAccessibleChurchesByUserId(userId);

  if (churches.length === 0) {
    redirect("/app/onboarding");
  }

  redirect("/app/mobile");
}
