import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";

export default async function ChurchDashboardPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  redirect(membership.church.slug === "gido" ? `/app/${membership.church.slug}/chat` : "/app/mobile");
}
