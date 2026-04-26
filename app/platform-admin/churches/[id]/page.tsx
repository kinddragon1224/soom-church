import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePlatformChurch } from "../actions";

function planStatusLabel(status?: string) {
  return (
    {
      TRIALING: "체험중",
      ACTIVE: "유료 운영중",
      CANCELED: "해지됨",
      PAST_DUE: "결제 확인 필요",
      INCOMPLETE: "설정 미완료",
    }[status ?? ""] ?? (status || "상태 없음")
  );
}

function parseOnboardingMeta(metadata: string | null) {
  if (!metadata) return null;
  try {
    return JSON.parse(metadata) as {
      ownerName?: string;
      role?: string;
      teamName?: string;
      ministry?: string;
      attendanceBand?: string;
      primaryGoal?: string;
      setupNote?: string;
      createdFrom?: string;
    };
  } catch {
    return null;
  }
}

export default async function PlatformAdminChurchDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { saved?: string };
}) {
  const church = await prisma.church.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { memberships: true, members: true, notices: true, applications: true } },
      subscriptions: { orderBy: { createdAt: "desc" }, take: 1 },
      memberships: {
        take: 10,
        orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
        include: { user: { select: { name: true, email: true } } },
      },
      members: {
        take: 8,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, statusTag: true, requiresFollowUp: true },
      },
      activityLogs: {
        take: 10,
        orderBy: { createdAt: "desc" },
        select: { action: true, targetType: true, createdAt: true, metadata: true },
      },
    },
  });

  if (!church) notFound();

  const subscription = church.subscriptions[0];
  const onboardingLog = church.activityLogs.find((log) => log.action === "WORKSPACE_ONBOARDED");
  const onboarding = parseOnboardingMeta(onboardingLog?.metadata ?? null);

  return (
    <div className="space-y-4 text-[#111111]">
      <section className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-white/46">LAB SPACE DETAIL</p>
            <h1 className="mt-3 text-[2.2rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white">{church.name}</h1>
            <p className="mt-3 text-sm text-white/66">{church.slug} · {church.timezone}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-white/78">
            <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5">{church.isActive ? "운영중" : "비활성"}</span>
            <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5">{subscription?.plan ?? "FREE"}</span>
            <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5">{planStatusLabel(subscription?.status)}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">OPERATIONS</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">운영 정보 수정</h2>
            </div>
            {searchParams?.saved === "1" ? <span className="rounded-full bg-[#eefbf3] px-3 py-1 text-xs font-semibold text-[#2d7a46]">저장 완료</span> : null}
          </div>
          <form action={updatePlatformChurch.bind(null, church.id)} className="mt-4 grid gap-3">
            <label className="text-sm font-medium text-[#3f3528]">목장월드 이름<input name="name" defaultValue={church.name} className="mt-1 w-full rounded-[14px] border border-[#ddd5c8] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]" /></label>
            <label className="text-sm font-medium text-[#3f3528]">시간대<input name="timezone" defaultValue={church.timezone} className="mt-1 w-full rounded-[14px] border border-[#ddd5c8] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]" /></label>
            <label className="text-sm font-medium text-[#3f3528]">우선순위 태그<input name="priorityTag" defaultValue={church.priorityTag ?? ""} placeholder="예: trial-우선, legacy-정리" className="mt-1 w-full rounded-[14px] border border-[#ddd5c8] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]" /></label>
            <label className="text-sm font-medium text-[#3f3528]">운영 메모<textarea name="adminNote" defaultValue={church.adminNote ?? onboarding?.setupNote ?? ""} className="mt-1 min-h-[120px] w-full rounded-[14px] border border-[#ddd5c8] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]" /></label>
            <label className="flex items-center gap-2 text-sm font-medium text-[#5f564b]"><input type="checkbox" name="isActive" defaultChecked={church.isActive} /> 운영중으로 유지</label>
            <button className="rounded-[14px] bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-white">운영 정보 저장</button>
          </form>
        </section>

        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">SUMMARY</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4"><p className="text-xs text-[#8C7A5B]">목원 수</p><p className="mt-2 text-2xl font-semibold">{church._count.members}</p></div>
              <div className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4"><p className="text-xs text-[#8C7A5B]">멤버십</p><p className="mt-2 text-2xl font-semibold">{church._count.memberships}</p></div>
              <div className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4"><p className="text-xs text-[#8C7A5B]">신청</p><p className="mt-2 text-2xl font-semibold">{church._count.applications}</p></div>
              <div className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4"><p className="text-xs text-[#8C7A5B]">공지</p><p className="mt-2 text-2xl font-semibold">{church._count.notices}</p></div>
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">ONBOARDING</p>
            <div className="mt-4 grid gap-3 text-sm text-[#3f3528]">
              <div className="rounded-[16px] border border-[#ece6dc] bg-[#fcfbf8] p-4">담당자 · {onboarding?.ownerName ?? "없음"}</div>
              <div className="rounded-[16px] border border-[#ece6dc] bg-[#fcfbf8] p-4">팀/사역 · {onboarding?.teamName ?? onboarding?.ministry ?? "없음"}</div>
              <div className="rounded-[16px] border border-[#ece6dc] bg-[#fcfbf8] p-4">출석 규모 · {onboarding?.attendanceBand ?? "없음"}</div>
              <div className="rounded-[16px] border border-[#ece6dc] bg-[#fcfbf8] p-4">우선 목표 · {onboarding?.primaryGoal ?? "없음"}</div>
            </div>
          </section>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#111111]">최근 등록 목원</h2>
            <Link href={`/app/${church.slug}/members`} className="text-sm text-[#8C6A2E]">사람 보기</Link>
          </div>
          <div className="mt-4 grid gap-3">
            {church.members.map((member) => (
              <div key={member.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-[#111111]">{member.name}</p>
                  <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{member.statusTag}</span>
                </div>
                <p className="mt-2 text-xs text-[#8c7a5b]">{member.requiresFollowUp ? "후속 연락 필요" : "후속 연락 안정"}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#111111]">최근 활동</h2>
            <Link href={`/app/${church.slug}/dashboard`} className="text-sm text-[#8C6A2E]">대시보드</Link>
          </div>
          <div className="mt-4 grid gap-3">
            {church.activityLogs.map((log, index) => (
              <div key={`${log.action}-${index}`} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                <p className="font-medium text-[#111111]">{log.action}</p>
                <p className="mt-1 text-xs text-[#8c7a5b]">{log.targetType} · {new Date(log.createdAt).toLocaleString("ko-KR")}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
