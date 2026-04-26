import type { ReactNode } from "react";
import { redirect } from "next/navigation";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  redirect("/contact");

  return children;
}
