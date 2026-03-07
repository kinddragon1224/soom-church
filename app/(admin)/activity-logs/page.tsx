import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/date";

export default async function ActivityLogsPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { actor: true, member: true },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">활동 로그 / 리포트</h1>
      <div className="rounded-xl border border-border bg-white">
        <table>
          <thead><tr><th>시각</th><th>액션</th><th>대상</th><th>담당자</th><th>메모</th></tr></thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{formatDate(log.createdAt)}</td>
                <td>{log.action}</td>
                <td>{log.targetType} {log.member?.name ? `(${log.member.name})` : ""}</td>
                <td>{log.actor?.name ?? "system"}</td>
                <td>{log.metadata ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
