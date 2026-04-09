import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";

export default async function ChurchPeoplePage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  redirect(`/app/${membership.church.slug}/members`);
}
