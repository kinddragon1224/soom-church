import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import ChatComposer from "./chat-composer";

export default async function ChurchChatPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  if (membership.church.slug !== "gido") {
    redirect(`/app/${membership.church.slug}/dashboard`);
  }

  return <ChatComposer churchSlug={params.churchSlug} />;
}
