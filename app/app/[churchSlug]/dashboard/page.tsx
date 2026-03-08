import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getWorkspaceDashboardData } from "@/lib/workspace-data";
import { formatDate } from "@/lib/date";

export default async function ChurchDashboardPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) {
    return (
      <section className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-semibold">접근 권한이 없습니다</h2>
        <p className="mt-2 text-sm text-muted-foreground">워크스페이스 선택 화면으로 돌아가 다시 시도해주세요.</p>
      </section>
    );
  }

  const church = membership.church;
  const data = await getWorkspaceDashboardData(church.id);

  const kpis = [
    ["총 교인 수", data.totalMembers],
    ["이번 달 신규", data.newThisMonth],
    ["미처리 신청", data.pendingApplications],
    ["후속관리", data.followUpMembers],
  ];

  const modules = [
    { title: "숨 교적", desc: "교인·가족·상태를 관리", href: `/app/${church.slug}/members`, state: "활성" },
    { title: "숨 신청", desc: "신청과 접수 현황 관리", href: `/app/${church.slug}/applications`, state: "활성" },
    { title: "숨 알림", desc: "공지와 전달 흐름 관리", href: `/app/${church.slug}/notices`, state: "활성" },
    { title: "숨 기록", desc: "행사/아카이브 기능", href: "#", state: "준비 중" },
    { title: "숨 모임", desc: "목장/소모임 확장 기능", href: "#", state: "곧 연결" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="rounded-xl border border-slate-700 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 p-4 text-slate-100 sm:p-5">
        <h2 className="text-lg font-semibold sm:text-xl">이번 주 운영 요약</h2>
        <p className="mt-1 text-xs text-slate-300 sm:text-sm">
          미배정 교인 {data.unassignedMembers}명, 미처리 신청 {data.pendingApplications}건, 후속관리 {data.followUpMembers}명, 최근 공지 {data.recentNotices.length}건
        </p>
        <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">교회 운영에서 지금 바로 확인할 항목을 먼저 보여줍니다.</p>
      </section>

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {kpis.map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold leading-none">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">후속관리 필요 교인</h3>
            <Link href={`/app/${church.slug}/members`} className="text-xs text-primary hover:underline">전체 보기</Link>
          </div>
          <ul className="space-y-2">
            {data.recentMembers.slice(0, 3).map((m) => (
              <li key={m.id} className="rounded-md border border-border p-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{m.name}</p>
                  <StatusBadge>{m.statusTag}</StatusBadge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">등록일 {formatDate(m.registeredAt)}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-3">
          <h3 className="mb-2 text-sm font-semibold">빠른 작업</h3>
          <div className="grid grid-cols-2 gap-2 max-[360px]:grid-cols-1">
            <QuickAction href={`/app/${church.slug}/members`} title="교인 확인" desc="명단과 상태 점검" />
            <QuickAction href={`/app/${church.slug}/applications`} title="신청 확인" desc="미처리 항목 점검" />
            <QuickAction href={`/app/${church.slug}/notices`} title="공지 확인" desc="전달 상태 확인" />
            <QuickAction href={`/app/${church.slug}/dashboard`} title="운영 요약" desc="오늘 상태 다시 확인" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-3 xl:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">최근 신청</h3>
            <Link href={`/app/${church.slug}/applications`} className="text-xs text-primary hover:underline">전체 보기</Link>
          </div>
          <div className="space-y-2">
            {data.recentApplications.map((a) => (
              <div key={a.id} className="rounded-md border border-border p-2.5">
                <p className="text-sm font-medium">{a.applicantName}</p>
                <p className="mt-1 text-xs text-muted-foreground">상태: {a.status} · {formatDate(a.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">최근 공지</h3>
            <Link href={`/app/${church.slug}/notices`} className="text-xs text-primary hover:underline">전체 보기</Link>
          </div>
          <ul className="space-y-2">
            {data.recentNotices.map((n) => (
              <li key={n.id} className="rounded-md border border-border p-2.5">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{n.pinned ? "상단고정" : "일반"} · {formatDate(n.createdAt)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-2">
        <div>
          <h3 className="text-sm font-semibold">숨 모듈 허브</h3>
          <p className="text-xs text-muted-foreground">교회 운영 기능을 한 플랫폼 안에서 연결합니다.</p>
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
  const stateClass = state === "활성" ? "bg-emerald-100 text-emerald-700" : state === "곧 연결" ? "bg-blue-100 text-blue-700" : "bg-muted text-muted-foreground";

  return (
    <Link
      href={href}
      aria-disabled={disabled}
      className={`rounded-md border border-border p-3 transition ${disabled ? "pointer-events-none opacity-70" : "hover:bg-muted/40 active:scale-[0.99]"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">{title}</p>
        <span className={`rounded-full px-2 py-0.5 text-[11px] ${stateClass}`}>{state}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </Link>
  );
}
