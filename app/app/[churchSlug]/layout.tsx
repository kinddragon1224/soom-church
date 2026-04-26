import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const preferredRegion = "icn1";

export default function ChurchWorkspaceLayout() {
  redirect("/app/mobile");
}
