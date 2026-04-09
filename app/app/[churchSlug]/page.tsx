import { redirect } from "next/navigation";

export default function ChurchWorkspaceIndexPage({
  params,
}: {
  params: { churchSlug: string };
}) {
  redirect(`/app/${params.churchSlug}/${params.churchSlug === "gido" ? "chat" : "dashboard"}`);
}
