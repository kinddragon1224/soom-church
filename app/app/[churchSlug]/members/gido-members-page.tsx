import Link from "next/link";
import { District, Group, Household, Member } from "@prisma/client";
import { AppliedRecordLogItem } from "@/lib/chat-apply-log";
import { formatDate } from "@/lib/date";
import { buildGidoMembersView } from "@/lib/gido-members-view";
import { createQuickWorkspaceMember } from "./actions";

type GidoMemberRow = Member & {
  district: District | null;
  group: Group | null;
  household: Household | null;
};

type Props = {
  churchSlug: string;
  members: GidoMemberRow[];
  groups: { id: string; name: string }[];
  households: { id: string; name: string }[];
  intakeCandidates: {
    id: string;
    proposedName: string | null;
    proposedPhone: string | null;
    proposedHouseholdName: string | null;
    summary: string | null;
    createdAt: Date;
  }[];
  recentLogs: AppliedRecordLogItem[];
  q?: string;
  filter?: string;
};

export default function GidoMembersPage({ churchSlug, members, groups, households, intakeCandidates, recentLogs, q = "", filter = "all" }: Props) {
  const {
    filter: activeFilter,
    decoratedMembers,
    counts,
    filteredMembers,
    rankedMembers,
  } = buildGidoMembersView(members, {
    filter,
    q,
  });

  const buildMemberHref = (memberId: string, nextFilter = activeFilter, hash?: string) => {
    const params = new URLSearchParams();
    params.set("filter", nextFilter);
    if (q) params.set("q", q);
    const href = `/app/${churchSlug}/members/${memberId}?${params.toString()}`;
    return hash ? `${href}#${hash}` : href;
  };

  const getPrimaryAction = (member: typeof decoratedMembers[number], nextFilter = activeFilter) => ({
    href: buildMemberHref(member.id, nextFilter, member.actionPlan.section),
    label: member.actionPlan.shortLabel,
  });

  const qParam = q ? `&q=${encodeURIComponent(q)}` : "";
  const listPath = `/app/${churchSlug}/members?filter=${activeFilter}${qParam}`;

  const compositionQueue = decoratedMembers
    .map((member) => ({ member, issues: getCompositionIssues(member) }))
    .filter((item) => item.issues.length > 0)
    .sort((a, b) => b.issues.length - a.issues.length || a.member.name.localeCompare(b.member.name, "ko-KR"))
    .slice(0, 5);

  const managementQueue = rankedMembers.filter((member) => member.requiresFollowUp).slice(0, 5);
  const recordQueue = rankedMembers.slice(0, 6);

  const filterItems = [
    { key: "all", label: "전체", value: counts.all },
    { key: "priority", label: "운영 우선", value: counts.priority },
    { key: "followup", label: "관리 필요", value: counts.followup },
    { key: "leaders", label: "현 목자", value: counts.leaders },
    { key: "unassigned", label: "미분류", value: counts.unassigned },
  ];

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">G.I.D.O MEMBER MANAGEMENT</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">목원 관리</h1>
            <p className="mt-2 max-w-[760px] text-sm leading-6 text-[#5f564b]">
              여기서는 목원 등록, 가정 연결 보완, 관리 대상 확인, 상세 기록 진입을 처리해. 중보 순서나 가정 운영 전체는 가정 화면에서 이어가고, 이 화면은 사람 운영에만 집중한다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            <Link href="#quick-add" className="rounded-[14px] bg-[#111827] px-4 py-2 text-sm font-semibold text-white">
              간단 추가
            </Link>
            <Link href={`/app/${churchSlug}/followups`} className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-2 text-sm font-medium text-[#121212]">
              관리 보드
            </Link>
            <Link href={`/app/${churchSlug}/households`} className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-2 text-sm font-medium text-[#121212]">
              가정 보기
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="전체 목원" value={`${counts.all}명`} />
          <MetricCard label="관리 필요" value={`${counts.followup}명`} tone={counts.followup > 0 ? "alert" : "neutral"} />
          <MetricCard label="구조 보완" value={`${compositionQueue.length}명`} tone={compositionQueue.length > 0 ? "alert" : "neutral"} />
          <MetricCard label="현 목자" value={`${counts.leaders}명`} />
          <MetricCard label="미분류" value={`${counts.unassigned}명`} tone={counts.unassigned > 0 ? "alert" : "neutral"} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">REGISTRATION CANDIDATES</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">새 등록 후보</h2>
              <p className="mt-2 text-sm leading-6 text-[#5f564b]">채팅 입력에서 바로 사람으로 만들기 애매한 항목을 먼저 여기로 모아둔다.</p>
            </div>
            <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">{intakeCandidates.length}건</span>
          </div>

          <div className="mt-4 grid gap-3">
            {intakeCandidates.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-4 text-sm text-[#6f6256]">지금 들어온 등록 후보가 없어.</div>
            ) : (
              intakeCandidates.map((candidate) => (
                <div key={candidate.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">{candidate.proposedName ?? "이름 미상"}</p>
                      <p className="mt-1 text-[12px] text-[#8c7a5b]">{formatDate(candidate.createdAt)} · 등록 후보</p>
                    </div>
                    <Link href={`/app/${churchSlug}/members/new`} className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-xs font-medium text-[#121212]">
                      직접 등록
                    </Link>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-[#5f564b]">
                    <p>{candidate.summary ?? "채팅 입력 요약 없음"}</p>
                    <div className="flex flex-wrap gap-2 text-[12px] text-[#7b6f60]">
                      {candidate.proposedPhone ? <span className="rounded-full border border-[#e6dccd] bg-white px-2.5 py-1">연락처 {candidate.proposedPhone}</span> : null}
                      {candidate.proposedHouseholdName ? <span className="rounded-full border border-[#e6dccd] bg-white px-2.5 py-1">가정 {candidate.proposedHouseholdName}</span> : null}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">RECENT INPUT RESULT</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">최근 운영 입력</h2>
              <p className="mt-2 text-sm leading-6 text-[#5f564b]">채팅이나 시스템 입력이 실제 운영 데이터로 정리된 최근 결과를 보여준다.</p>
            </div>
            <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">{recentLogs.length}건</span>
          </div>

          <div className="mt-4 grid gap-3">
            {recentLogs.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-4 text-sm text-[#6f6256]">아직 반영된 운영 기록이 없어.</div>
            ) : (
              recentLogs.map((item) => (
                <div key={item.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8c7a5b]">
                    <span className="rounded-full border border-[#e6dccd] bg-white px-2.5 py-1">{item.updateTypeLabel}</span>
                    <span>{formatDate(item.appliedAt)}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[#111111]">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.body}</p>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section id="quick-add" className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] scroll-mt-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">QUICK ADD</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">간단 목원 추가</h2>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">이름, 생년월일, 연락처, 가정, 목장만 넣고 바로 등록. 상세 정보와 기록은 등록 뒤 상세 화면에서 이어서 정리한다.</p>
          </div>
          <Link href={`/app/${churchSlug}/members/new`} className="inline-flex h-10 items-center rounded-[12px] border border-[#E7E0D4] bg-white px-4 text-sm font-medium text-[#121212]">
            상세 등록 열기
          </Link>
        </div>

        <form action={createQuickWorkspaceMember.bind(null, churchSlug, listPath)} className="mt-5 grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_180px_180px_180px_180px_auto]">
          <label className="grid gap-2">
            <span className="text-[12px] font-medium text-[#5f564b]">이름</span>
            <input name="name" required placeholder="이름 입력" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
          </label>
          <label className="grid gap-2">
            <span className="text-[12px] font-medium text-[#5f564b]">생년월일</span>
            <input name="birthDate" type="date" required className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
          </label>
          <label className="grid gap-2">
            <span className="text-[12px] font-medium text-[#5f564b]">연락처</span>
            <input name="phone" placeholder="없으면 비워도 됨" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
          </label>
          <label className="grid gap-2">
            <span className="text-[12px] font-medium text-[#5f564b]">가정</span>
            <select name="householdId" defaultValue="" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]">
              <option value="">선택 안함</option>
              {households.map((household) => (
                <option key={household.id} value={household.id}>{household.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-[12px] font-medium text-[#5f564b]">목장</span>
            <select name="groupId" defaultValue="" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]">
              <option value="">선택 안함</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button className="h-[42px] rounded-[12px] bg-[#111827] px-4 text-sm font-semibold text-white">등록</button>
          </div>
        </form>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">REGISTER / FIX</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">등록 / 구조 보완</h2>
            </div>
            <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">{compositionQueue.length}명</span>
          </div>

          <div className="mt-4 grid gap-3">
            {compositionQueue.length === 0 ? (
              <EmptyBox text="지금 보완할 구조 항목이 없어." compact />
            ) : (
              compositionQueue.map(({ member, issues }) => (
                <article key={`composition-${member.id}`} className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[#111111]">{member.name}</p>
                      <p className="mt-1 text-sm text-[#6d6259]">{member.household?.name ?? "가정 연결 전"}</p>
                    </div>
                    <span className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] font-medium text-[#6f6256]">보완 {issues.length}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#7d705f]">
                    {issues.map((issue) => (
                      <span key={`${member.id}-${issue}`} className="rounded-full border border-[#E7E0D4] bg-white px-2.5 py-1 text-[11px] text-[#5f564b]">
                        {issue}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#5f564b]">{getCompositionIssueSummary(issues)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={buildMemberHref(member.id, !member.household?.name ? "unassigned" : "all", !member.household?.name ? "family-links" : "today-check")} className="rounded-[12px] bg-[#111827] px-3.5 py-2 text-sm font-semibold text-white">
                      상세 관리
                    </Link>
                    <Link href={!member.household?.name ? `/app/${churchSlug}/households` : buildMemberHref(member.id, "all", "family-links")} className="rounded-[12px] border border-[#e4dbc9] bg-white px-3.5 py-2 text-sm font-medium text-[#121212]">
                      {!member.household?.name ? "가정 보기" : "가정 연결"}
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </article>

        <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">MANAGEMENT</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">오늘 관리 대상</h2>
            </div>
            <Link href={`/app/${churchSlug}/followups`} className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">
              관리 보드
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {managementQueue.length === 0 ? (
              <EmptyBox text="지금 바로 챙길 관리 대상은 없어." compact />
            ) : (
              managementQueue.map((member) => {
                const primaryAction = getPrimaryAction(member, "followup");
                return (
                  <article key={`manage-${member.id}`} className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-[#111111]">{member.name}</p>
                        <p className="mt-1 text-sm text-[#6d6259]">{member.household?.name ?? "미분류"}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${getPriorityToneClasses(member.priorityReason.tone)}`}>
                        {member.priorityReason.title}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#5f564b]">{member.priorityReason.body}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={primaryAction.href} className="rounded-[12px] bg-[#111827] px-3.5 py-2 text-sm font-semibold text-white">
                        {primaryAction.label}
                      </Link>
                      <Link href={buildMemberHref(member.id, "followup", "attendance-log")} className="rounded-[12px] border border-[#e4dbc9] bg-white px-3.5 py-2 text-sm font-medium text-[#121212]">
                        출석
                      </Link>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </article>

        <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">RECORD SHORTCUTS</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">기록 바로가기</h2>
            </div>
            <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">상세 진입</span>
          </div>

          <div className="mt-4 grid gap-3">
            {recordQueue.map((member) => (
              <article key={`record-${member.id}`} className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-[#111111]">{member.name}</p>
                    <p className="mt-1 text-sm text-[#6d6259]">{member.household?.name ?? "미분류"}</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <RoleBadges member={member} />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ShortcutLink href={buildMemberHref(member.id, activeFilter, "care-log")}>기록</ShortcutLink>
                  <ShortcutLink href={buildMemberHref(member.id, activeFilter, "attendance-log")}>출석</ShortcutLink>
                  <ShortcutLink href={buildMemberHref(member.id, activeFilter, "church-events")}>이벤트</ShortcutLink>
                  <ShortcutLink href={buildMemberHref(member.id, activeFilter, "organization-links")}>소속</ShortcutLink>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-3 border-b border-[#efe7da] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#111111]">목원 목록</p>
            <p className="mt-1 text-xs text-[#8C7A5B]">{filteredMembers.length}명 표시</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterItems.map((item) => (
              <Link
                key={item.key}
                href={`?filter=${item.key}${qParam}`}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  activeFilter === item.key ? "bg-[#111827] text-white" : "border border-[#E7E0D4] bg-white text-[#5f564b]"
                }`}
              >
                {item.label} {item.value}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-b border-[#efe7da] px-5 py-4">
          <form method="get" className="grid gap-3 lg:grid-cols-[180px_minmax(0,1fr)_auto]">
            <input type="hidden" name="filter" value={activeFilter} />
            <span className="inline-flex items-center rounded-[12px] border border-[#E7E0D4] bg-[#FBF9F4] px-4 text-sm text-[#7B6F60]">
              사람 검색
            </span>
            <input
              name="q"
              defaultValue={q}
              placeholder="이름, 연락처, 가정 이름으로 찾기"
              className="rounded-[12px] border border-[#E7E0D4] bg-white px-4 py-2 text-sm text-[#111111] outline-none"
            />
            <button className="rounded-[12px] bg-[#111827] px-4 py-2 text-sm font-semibold text-white">검색</button>
          </form>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-base font-semibold text-[#111111]">조건에 맞는 목원이 없어.</p>
            <p className="mt-2 text-sm text-[#5f564b]">검색어나 필터를 확인해줘.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#FBF9F4] text-[#8C7A5B]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">이름</th>
                  <th className="px-4 py-3 text-left font-medium">가정 / 소속</th>
                  <th className="px-4 py-3 text-left font-medium">상태</th>
                  <th className="px-4 py-3 text-left font-medium">연락처</th>
                  <th className="px-4 py-3 text-left font-medium">다음 작업</th>
                  <th className="px-4 py-3 text-left font-medium">등록일</th>
                  <th className="px-4 py-3 text-left font-medium">빠른 이동</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => {
                  const primaryAction = getPrimaryAction(member, activeFilter === "all" ? member.actionPlan.queueFilter : activeFilter);
                  return (
                    <tr key={member.id} className="border-t border-[#f1eadf] text-[#111111] align-top">
                      <td className="px-4 py-4">
                        <div>
                          <Link href={buildMemberHref(member.id, activeFilter)} className="font-semibold hover:text-[#8C6A2E]">
                            {member.name}
                          </Link>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <RoleBadges member={member} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[#5f564b]">
                        <p>{member.household?.name ?? "미분류"}</p>
                        <p className="mt-1 text-xs text-[#8C7A5B]">{member.district?.name ?? "교구 미정"} / {member.group?.name ?? "목장 미정"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${getPriorityToneClasses(member.priorityReason.tone)}`}>
                          {member.priorityReason.title}
                        </span>
                        <p className="mt-2 text-sm leading-6 text-[#5f564b]">{member.priorityReason.body}</p>
                      </td>
                      <td className="px-4 py-4 text-[#5f564b]">{member.phone || member.email || "-"}</td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-[#111111]">{member.actionPlan.title}</p>
                        <p className="mt-1 text-sm leading-6 text-[#5f564b]">{member.actionPlan.body}</p>
                      </td>
                      <td className="px-4 py-4 text-[#5f564b]">{formatDate(member.registeredAt)}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <Link href={primaryAction.href} className="rounded-[10px] border border-[#111827] bg-[#111827] px-3 py-1.5 text-center text-xs font-medium text-white">
                            {primaryAction.label}
                          </Link>
                          <Link href={buildMemberHref(member.id, activeFilter, "organization-links")} className="rounded-[10px] border border-[#E7E0D4] bg-white px-3 py-1.5 text-center text-xs font-medium text-[#121212]">
                            소속
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function ShortcutLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="rounded-[10px] border border-[#E7E0D4] bg-white px-3 py-1.5 text-xs font-medium text-[#121212]">
      {children}
    </Link>
  );
}

function RoleBadges({ member }: { member: ReturnType<typeof buildGidoMembersView<GidoMemberRow>>["decoratedMembers"][number] }) {
  return (
    <>
      {member.leadership.tags.length > 0 ? (
        member.leadership.tags.map((tag) => (
          <span key={`${member.id}-${tag}`} className={`rounded-full px-2.5 py-1 text-[11px] ${tag === "현 목자" ? "bg-[#111827] text-white" : "border border-[#E7E0D4] bg-white text-[#5f564b]"}`}>
            {tag}
          </span>
        ))
      ) : (
        <span className="rounded-full border border-[#E7E0D4] bg-white px-2.5 py-1 text-[11px] text-[#5f564b]">목원</span>
      )}
      {member.requiresFollowUp ? <span className="rounded-full bg-[#fff4df] px-2.5 py-1 text-[11px] text-[#8C6A2E]">관리 필요</span> : null}
      {!member.household?.name ? <span className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#6f6256]">미분류</span> : null}
    </>
  );
}

function getCompositionIssues(member: ReturnType<typeof buildGidoMembersView<GidoMemberRow>>["decoratedMembers"][number]) {
  const issues: string[] = [];
  if (!member.household?.name) issues.push("가정 연결");
  if (!member.phone && !member.email) issues.push("연락처");
  if (!member.group?.name) issues.push("목장 소속");
  if (!member.district?.name) issues.push("교구 소속");
  return issues;
}

function getCompositionIssueSummary(issues: string[]) {
  if (issues.length === 0) return "구조 보완 항목 없음";
  return `${issues.join(", ")}부터 확인해줘.`;
}

function getPriorityToneClasses(tone: "alert" | "dark" | "warm" | "neutral") {
  if (tone === "alert") return "bg-[#fff4df] text-[#8C6A2E]";
  if (tone === "dark") return "bg-[#111827] text-white";
  if (tone === "warm") return "border border-[#e6d8bf] bg-white text-[#6f6256]";
  return "border border-[#e4dbc9] bg-white text-[#6f6256]";
}

function MetricCard({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "alert" }) {
  return (
    <div className={`rounded-[18px] border p-4 ${tone === "alert" ? "border-[#e9d8b0] bg-[#fff7e8]" : "border-[#ece4d8] bg-white"}`}>
      <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[#111111]">{value}</p>
    </div>
  );
}

function EmptyBox({ text, compact = false }: { text: string; compact?: boolean }) {
  return <div className={`rounded-[16px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] text-[13px] text-[#5f564b] ${compact ? "p-4" : "p-6"}`}>{text}</div>;
}
