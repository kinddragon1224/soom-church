import { redirect } from "next/navigation";

export default async function AppEntryPage() {
  redirect("/app/mobile");
}
