import { prisma } from "@/lib/prisma";

export default async function PlatformAdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      memberships: {
        where: { isActive: true },
        include: { church: { select: { name: true } } },
      },
    },
    take: 100,
  });

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">사용자 / 멤버십</h2>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="min-w-[780px]">
          <thead><tr><th>이름</th><th>이메일</th><th>활성</th><th>워크스페이스</th><th>역할</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.isActive ? "Y" : "N"}</td>
                <td>{u.memberships.map((m) => m.church.name).join(", ") || "-"}</td>
                <td>{u.memberships.map((m) => m.role).join(", ") || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
