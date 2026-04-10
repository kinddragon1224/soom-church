import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";

export default async function ChurchChatPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  if (membership.church.slug !== "gido") {
    redirect(`/app/${membership.church.slug}/dashboard`);
  }

  redirect(`/app/${membership.church.slug}/people`);
}
