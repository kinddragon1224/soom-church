import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { getDashboardData } from "@/lib/data";
import { formatDate } from "@/lib/date";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";

export default async function DashboardPage() {
  const data = await getDashboardData();

  const stats = [
    { label: "총 교인 수", value: data.totalMembers },
    { label: "이번 달 신규", value: data.newThisMonth },
    { label: "미처리 신청", value: data.pendingApplications },
  ];

  const modules = [
    { title: "숨 교적", desc: "교인·가족·상태를 관리", href: "/members", state: "활성" },
    { title: "숨 신청", desc: "주차·행사·접수 현황 관리", href: "/applications", state: "활성" },
    { title: "숨 알림", desc: "공지와 전달 흐름 관리", href: "/notices", state: "활성" },
    { title: "숨 기록", desc: "성경필사/행사 아카이브", href: "#", state: "준비 중" },
    { title: "숨 모임", desc: "소모임/목장 연결 확장", href: "#", state: "곧 연결" },
  ];

  return (
    <div className="space-y-3 sm:space-y-5">
      <section className="rounded-xl border border-border bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 p-4 text-slate-100 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold sm:text-xl">이번 주 운영 요약</h2>
            <p className="mt-1 text-xs text-slate-300 sm:text-sm">
              미배정 교인 {data.unassignedMembers}명, 미처리 신청 {data.pendingApplications}건, 후속관리 {data.followUpMembers}명, 최근 공지 {data.recentNotices.length}건
            </p>
            <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">교회 운영에서 지금 바로 확인해야 할 항목을 한눈에 정리합니다.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:w-[300px]">
            <HeroMini label="미배정" value={`${data.unassignedMembers}명`} />
            <HeroMini label="미처리 신청" value={`${data.pendingApplications}건`} />
            <HeroMini label="후속관리" value={`${data.followUpMembers}명`} />
            <HeroMini label="최근 공지" value={`${data.recentNotices.length}건`} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-2.5 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label} className="p-2.5 sm:p-4">
            <p className="text-[11px] text-muted-foreground sm:text-sm">{item.label}</p>
            <p className="mt-1 text-2xl font-bold leading-none sm:mt-2 sm:text-3xl">{item.value}</p>
          </Card>
        ))}
        <Link href="/members?followup=1" className="block">
          <Card className="h-full p-2.5 transition active:scale-[0.99] hover:bg-muted/40 sm:p-4">
            <p className="text-[11px] text-muted-foreground sm:text-sm">후속관리 필요</p>
            <div className="mt-1 flex items-end justify-between sm:mt-2">
              <p className="text-2xl font-bold leading-none sm:text-3xl">{data.followUpMembers}</p>
              <ChevronRight size={16} className="text-primary" />
            </div>
            <p className="mt-1 text-[11px] text-primary">바로 확인</p>
          </Card>
        </Link>
      </section>

      <Card className="p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold sm:text-base">후속관리 필요 교인</h3>
          <Link href="/members?followup=1" className="text-xs text-primary hover:underline">전체 보기</Link>
        </div>
        <ul className="space-y-2 text-sm">
          {data.followUpPanel.map((m) => (
            <li key={m.id}>
              <Link
                href={`/members/${m.id}`}
                className="block rounded-md border border-border p-2.5 transition active:scale-[0.99] hover:bg-muted/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{m.name}</p>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge>{m.statusTag}</StatusBadge>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </div>
                </div>
                <p className="mt-1 text-xs text-foreground/90">사유: {m.reason}</p>
                <p className="text-[11px] text-muted-foreground">{m.district?.name ?? "교구 미배정"} · {formatDate(m.updatedAt)} 갱신</p>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-3 sm:p-4 lg:hidden">
        <h3 className="mb-2 text-sm font-semibold sm:text-base">빠른 작업</h3>
        <div className="grid grid-cols-2 gap-2 max-[360px]:grid-cols-1">
          <QuickAction href="/members/new" title="교인 등록" desc="새가족 즉시 등록" />
          <QuickAction href="/notices" title="공지 작성" desc="주요 공지 게시" />
          <QuickAction href="/applications" title="신청 확인" desc="미처리 항목 점검" />
          <QuickAction href="/districts" title="교구 배정" desc="미배정 교인 연결" />
        </div>
      </Card>

      <Card className="p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold sm:text-base">최근 신청 내역</h3>
          <Link href="/applications" className="text-xs text-primary hover:underline">전체 보기</Link>
        </div>

        <div className="space-y-2 lg:hidden">
          {data.recentApplications.map((a) => (
            <div key={a.id} className="rounded-md border border-border p-2.5">
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

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3 sm:gap-4">
        <Card className="p-3 sm:p-4">
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

        <Card className="p-3 sm:p-4 xl:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold sm:text-base">최근 등록 교인</h3>
            <Link href="/members" className="text-xs text-primary hover:underline">전체 보기</Link>
          </div>

          <div className="space-y-2 xl:hidden">
            {data.recentMembers.map((m) => (
              <Link key={m.id} href={`/members/${m.id}`} className="block rounded-md border border-border p-2.5 active:scale-[0.99]">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{m.name}</p>
                  <StatusBadge>{m.statusTag}</StatusBadge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{m.district?.name ?? "교구 미배정"} · 리더 {m.leaderName}</p>
                <p className="text-xs text-foreground/90">다음 액션: {m.nextAction}</p>
              </Link>
            ))}
          </div>

          <div className="hidden overflow-x-auto xl:block">
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
      </div>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-2 sm:gap-4">
        <Card className="p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold sm:text-base">최근 공지</h3>
            <Link href="/notices" className="text-xs text-primary hover:underline">전체 보기</Link>
          </div>
          <ul className="space-y-2 text-sm">
            {data.recentNotices.map((n) => (
              <li key={n.id} className="rounded-md border border-border p-2.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{n.title}</p>
                  <ExternalLink size={14} className="mt-0.5 text-muted-foreground" />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{n.scopeLabel}</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">{n.publishStatus}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(n.createdAt)}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold sm:text-base">최근 활동 로그</h3>
            <Link href="/activity-logs" className="text-xs text-primary hover:underline">전체 보기</Link>
          </div>
          <ul className="space-y-2 text-sm">
            {data.recentActivityLogs.map((log) => (
              <li key={log.id} className="flex items-center justify-between rounded-md border border-border p-2.5">
                <div>
                  <p className="font-medium">{log.action}</p>
                  <p className="text-xs text-muted-foreground">대상: {log.targetType}</p>
                </div>
                <p className="text-[11px] text-muted-foreground">{formatDate(log.createdAt)}</p>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card className="hidden p-3 sm:p-4 lg:block">
        <h3 className="mb-2 text-sm font-semibold sm:text-base">빠른 작업</h3>
        <div className="grid gap-2 text-sm">
          <Link className="rounded-md border border-border px-3 py-2 hover:bg-muted" href="/members/new">교인 등록 · 새가족 즉시 등록</Link>
          <Link className="rounded-md border border-border px-3 py-2 hover:bg-muted" href="/notices">공지 작성 · 주요 공지 게시</Link>
          <Link className="rounded-md border border-border px-3 py-2 hover:bg-muted" href="/applications">신청 확인 · 미처리 항목 점검</Link>
          <Link className="rounded-md border border-border px-3 py-2 hover:bg-muted" href="/districts">교구 배정 · 미배정 교인 연결</Link>
        </div>
      </Card>

      <section className="space-y-2">
        <div>
          <h3 className="text-sm font-semibold sm:text-base">숨 모듈</h3>
          <p className="text-xs text-muted-foreground">교회 운영 기능을 연결해 쓰는 플랫폼 구조입니다.</p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard key={module.title} {...module} />
          ))}
        </div>
      </section>
    </div>
  );
}

function HeroMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-700 bg-slate-800/70 p-2">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}

function QuickAction({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="rounded-md border border-border bg-card p-2.5 transition active:scale-[0.99] hover:bg-muted/40">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold">{title}</p>
        <ChevronRight size={14} className="mt-0.5 text-primary" />
      </div>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{desc}</p>
    </Link>
  );
}

function ModuleCard({ title, desc, href, state }: { title: string; desc: string; href: string; state: string }) {
  const disabled = href === "#";
  return (
    <Link
      href={href}
      aria-disabled={disabled}
      className={`rounded-md border border-border p-3 transition ${disabled ? "pointer-events-none opacity-70" : "hover:bg-muted/40 active:scale-[0.99]"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">{title}</p>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{state}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </Link>
  );
}
