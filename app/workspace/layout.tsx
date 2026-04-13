import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  const loggedIn = await isLoggedIn();
  const target = loggedIn ? "/app/mobile" : "/login?next=%2Fapp%2Fmobile";

  redirect(target);

  return children;
}
