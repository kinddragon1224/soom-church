import { redirect } from "next/navigation";

export default function ChurchWorkspaceIndexPage({
  params,
}: {
  params: { churchSlug: string };
}) {
  redirect(params.churchSlug === "gido" ? `/app/${params.churchSlug}/chat` : "/app/mobile");
}
