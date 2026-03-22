import { AdminShell } from "@/components/layout/admin-shell";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  return <AdminShell>{children}</AdminShell>;
}
