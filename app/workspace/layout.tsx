import type { ReactNode } from "react";
import { redirect } from "next/navigation";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  redirect("/diagnosis");

  return children;
}
