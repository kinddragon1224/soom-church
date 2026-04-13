import { redirect } from "next/navigation";

import { getCurrentUserId } from "@/lib/auth";
import { getAccessibleChurchesByUserId } from "@/lib/church-context";

export default async function AppEntryPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login?next=/app/onboarding");
  }

  const churches = await getAccessibleChurchesByUserId(userId);

  if (churches.length === 0) {
    redirect("/app/onboarding");
  }

  redirect(`/app/${churches[0].church.slug}/world`);
}
