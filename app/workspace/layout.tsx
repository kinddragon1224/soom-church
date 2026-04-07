import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  const loggedIn = await isLoggedIn();
  const target = loggedIn ? "/app" : "/login?next=%2Fapp";

  redirect(target);

  return children;
}
