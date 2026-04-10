import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { submitChatMessage } from "./actions";
import ChatComposer from "./chat-composer";

export default async function ChurchChatPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  if (membership.church.slug !== "gido") {
    redirect(`/app/${membership.church.slug}/dashboard`);
  }

  const sendMessage = submitChatMessage.bind(null, params.churchSlug);

  return <ChatComposer action={sendMessage} />;
}
