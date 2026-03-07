import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { getDashboardData } from "@/lib/data";
import { formatDate } from "@/lib/date";
import Link from "next/link";

export default async function DashboardPage() {
  const data = await getDashboardData();

  const stats = [
    ["총 교인 수", data.totalMembers],
    ["이번 달 신규 등록", data.newThisMonth],
    ["미처리 신청", data.pendingApplications],
    ["후속관리 필요", data.followUpMembers],
  ];

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={String(label)} className="p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="p-4 xl:col-span-2">
          <h3 className="mb-3 text-base font-semibold">교구별 인원 분포</h3>
          <div className="space-y-2">
            {data.districtCounts.map((item) => (
              <div key={item.district} className="flex items-center gap-3">
                <div className="w-20 text-sm text-muted-foreground">{item.district}</div>
                <div className="h-2 flex-1 rounded bg-muted">
                  <div className="h-2 rounded bg-primary" style={{ width: `${Math.min(100, item.count * 12)}%` }} />
                </div>
                <div className="w-10 text-right text-sm font-medium">{item.count}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="mb-3 text-base font-semibold">빠른 작업</h3>
          <div className="grid gap-2 text-sm">
            <Link className="rounded-md border border-border px-3 py-2 hover:bg-muted" href="/members/new">교인 등록</Link>
            <Link className="rounded-md border border-border px-3 py-2 hover:bg-muted" href="/notices">공지 작성</Link>
            <Link className="rounded-md border border-border px-3 py-2 hover:bg-muted" href="/applications">신청 확인</Link>
            <Link className="rounded-md border border-border px-3 py-2 hover:bg-muted" href="/districts">교구 배정</Link>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="p-4 xl:col-span-2">
          <h3 className="mb-3 text-base font-semibold">최근 등록 교인</h3>
          <table>
            <thead><tr><th>이름</th><th>상태</th><th>교구</th><th>등록일</th></tr></thead>
            <tbody>
              {data.recentMembers.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td><StatusBadge>{m.statusTag}</StatusBadge></td>
                  <td>{m.district?.name ?? "-"}</td>
                  <td>{formatDate(m.registeredAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-4">
          <h3 className="mb-3 text-base font-semibold">최근 공지</h3>
          <ul className="space-y-2 text-sm">
            {data.recentNotices.map((n) => (
              <li key={n.id} className="rounded-md border border-border p-2">
                <p className="font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{formatDate(n.createdAt)}</p>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card className="p-4">
        <h3 className="mb-3 text-base font-semibold">최근 신청 내역</h3>
        <table>
          <thead><tr><th>신청자</th><th>양식</th><th>상태</th><th>등록일</th></tr></thead>
          <tbody>
            {data.recentApplications.map((a) => (
              <tr key={a.id}>
                <td>{a.applicantName}</td>
                <td>{a.form.title}</td>
                <td>{a.status}</td>
                <td>{formatDate(a.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
