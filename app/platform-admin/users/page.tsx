import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PlatformAdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      memberships: {
        include: {
          church: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
    take: 50,
  });

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">가입 사용자 목록</h2>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="min-w-[920px] text-sm">
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th>워크스페이스</th>
              <th>역할</th>
              <th>가입일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const membership = user.memberships[0];
              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{membership?.church?.name ?? "-"}</td>
                  <td>{membership?.role ?? "-"}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString("ko-KR")}</td>
                  <td>{user.isActive ? "ACTIVE" : "INACTIVE"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
