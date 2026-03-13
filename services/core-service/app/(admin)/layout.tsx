import { AdminShell } from "@/components/layout/admin-shell";
import { requireAuth } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  requireAuth();

  return <AdminShell>{children}</AdminShell>;
}
