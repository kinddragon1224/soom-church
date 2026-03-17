import { AdminShell } from "@/components/layout/admin-shell";
import { requireAuth } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  return <AdminShell>{children}</AdminShell>;
}
