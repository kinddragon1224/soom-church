import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { getDashboardData } from "@/lib/data";
import { formatDate } from "@/lib/date";
import Link from "next/link";

export default async function DashboardPage() {
  const data = await getDashboardData();

  const stats = [
    { label: "총 교인 수", value: data.totalMembers },
    { label: "이번 달 신규 등록", value: data.newThisMonth },
    { label: "미처리 신청", value: data.pendingApplications },
  ];

  return (
    <div className="space-y-3 sm:space-y-5">
      <section className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label} className="p-3 sm:p-4">
            <p className="text-xs text-muted-foreground sm:text-sm">{item.label}</p>
            <p className="mt-1 text-2xl font-bold sm:mt-2 sm:text-3xl">{item.value}</p>
          </Card>
        ))}
        <Link href="/members?followup=1" className="block">
          <Card className="h-full p-3 transition hover:bg-muted/40 sm:p-4">
            <p className="text-xs text-muted-foreground sm:text-sm">후속관리 필요</p>
            <p className="mt-1 text-2xl font-bold sm:mt-2 sm:text-3xl">{data.followUpMembers}</p>
            <p className="mt-1 text-xs text-primary">클릭해서 바로 보기</p>
          </Card>
        </Link>
      </section>

      <Card className="order-2 p-3 sm:p-4">
        <h3 className="mb-2 text-sm font-semibold sm:text-base">후속관리 필요 교인</h3>
        <ul className="space-y-2 text-sm">
          {data.followUpPanel.map((m) => (
            <li key={m.id} className="rounded-md border border-border p-2 sm:p-2.5">
              <div className="flex items-center justify-between gap-2">
                <Link href={`/members/${m.id}`} className="font-medium hover:underline">{m.name}</Link>
                <StatusBadge>{m.statusTag}</StatusBadge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">사유: {m.reason}</p>
              <p className="text-xs text-muted-foreground">{m.district?.name ?? "교구 미배정"} · {formatDate(m.updatedAt)} 갱신</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="order-3 p-3 sm:p-4 lg:hidden">
        <h3 className="mb-2 text-sm font-semibold sm:text-base">빠른 작업</h3>
        <div className="grid grid-cols-2 gap-2">
          <Link className="rounded-md border border-border p-2 hover:bg-muted" href="/members/new">
            <p className="text-sm font-medium">교인 등록</p>
            <p className="text-[11px] text-muted-foreground">새가족 즉시 등록</p>
          </Link>
          <Link className="rounded-md border border-border p-2 hover:bg-muted" href="/notices">
            <p className="text-sm font-medium">공지 작성</p>
            <p className="text-[11px] text-muted-foreground">주요 공지 게시</p>
          </Link>
          <Link className="rounded-md border border-border p-2 hover:bg-muted" href="/applications">
            <p className="text-sm font-medium">신청 확인</p>
            <p className="text-[11px] text-muted-foreground">미처리 항목 점검</p>
          </Link>
          <Link className="rounded-md border border-border p-2 hover:bg-muted" href="/districts">
            <p className="text-sm font-medium">교구 배정</p>
            <p className="text-[11px] text-muted-foreground">미배정 교인 연결</p>
          </Link>
        </div>
      </Card>

      <Card className="order-4 p-3 sm:p-4">
        <h3 className="mb-2 text-sm font-semibold sm:text-base">최근 신청 내역</h3>

        <div className="space-y-2 lg:hidden">
          {data.recentApplications.map((a) => (
            <div key={a.id} className="rounded-md border border-border p-2">
              <p className="text-sm font-medium">{a.applicantName}</p>
              <p className="text-xs text-muted-foreground">{a.form.title}</p>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span>{a.status}</span>
                <span className="text-muted-foreground">{formatDate(a.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="min-w-[640px]">
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
        </div>
      </Card>

      <Card className="order-5 p-3 sm:p-4">
        <h3 className="mb-3 text-sm font-semibold sm:text-base">교구별 인원 분포</h3>
        <div className="space-y-2">
          {data.districtCounts.map((item) => (
            <div key={item.district} className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-20 text-xs text-muted-foreground sm:text-sm">{item.district}</div>
                <div className="h-2 flex-1 rounded bg-muted">
                  <div className="h-2 rounded bg-primary" style={{ width: `${Math.min(100, item.count * 12)}%` }} />
                </div>
                <div className="w-10 text-right text-xs font-medium sm:text-sm">{item.count}</div>
              </div>
              <p className="pl-[5.75rem] text-xs text-muted-foreground">후속관리 {item.followUps}명</p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:text-sm">
          <div className="rounded-md border border-border bg-muted/40 p-2">
            <p className="text-muted-foreground">전체 미배정</p>
            <p className="font-semibold">{data.unassignedMembers}명</p>
          </div>
          <div className="rounded-md border border-border bg-muted/40 p-2">
            <p className="text-muted-foreground">전체 후속관리</p>
            <p className="font-semibold">{data.followUpMembers}명</p>
          </div>
        </div>
      </Card>

      <section className="order-6 grid grid-cols-1 gap-3 xl:grid-cols-3 sm:gap-4">
        <Card className="p-3 sm:p-4 xl:col-span-2">
          <h3 className="mb-3 text-sm font-semibold sm:text-base">최근 등록 교인</h3>
          <div className="overflow-x-auto">
            <table className="min-w-[760px]">
              <thead><tr><th>이름</th><th>상태</th><th>교구</th><th>담당 리더</th><th>다음 액션</th><th>등록일</th></tr></thead>
              <tbody>
                {data.recentMembers.map((m) => (
                  <tr key={m.id}>
                    <td><Link href={`/members/${m.id}`} className="hover:underline">{m.name}</Link></td>
                    <td><StatusBadge>{m.statusTag}</StatusBadge></td>
                    <td>{m.district?.name ?? "-"}</td>
                    <td>{m.leaderName}</td>
                    <td>{m.nextAction}</td>
                    <td>{formatDate(m.registeredAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <h3 className="mb-3 text-sm font-semibold sm:text-base">최근 공지</h3>
          <ul className="space-y-2 text-sm">
            {data.recentNotices.map((n) => (
              <li key={n.id} className="rounded-md border border-border p-2">
                <p className="font-medium">{n.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{n.scopeLabel}</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">{n.publishStatus}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.createdAt)}</p>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card className="order-8 p-3 sm:p-4">
        <h3 className="mb-2 text-sm font-semibold sm:text-base">최근 활동 로그</h3>
        <ul className="space-y-2 text-sm">
          {data.recentActivityLogs.map((log) => (
            <li key={log.id} className="flex items-center justify-between rounded-md border border-border p-2">
              <div>
                <p className="font-medium">{log.action}</p>
                <p className="text-xs text-muted-foreground">대상: {log.targetType}</p>
              </div>
              <p className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="order-7 hidden p-3 sm:p-4 lg:block">
        <h3 className="mb-2 text-sm font-semibold sm:text-base">빠른 작업</h3>
        <div className="grid gap-2 text-sm">
          <Link className="rounded-md border border-border px-3 py-2 hover:bg-muted" href="/members/new">교인 등록 · 새가족 즉시 등록</Link>
          <Link className="rounded-md border border-border px-3 py-2 hover:bg-muted" href="/notices">공지 작성 · 주요 공지 게시</Link>
          <Link className="rounded-md border border-border px-3 py-2 hover:bg-muted" href="/applications">신청 확인 · 미처리 항목 점검</Link>
          <Link className="rounded-md border border-border px-3 py-2 hover:bg-muted" href="/districts">교구 배정 · 미배정 교인 연결</Link>
        </div>
      </Card>
    </div>
  );
}
