import Link from "next/link";
import { District, Group, Household, Member } from "@prisma/client";
import { formatDate } from "@/lib/date";
import { GIDO_ACTIVE_LEADER_NAMES, GIDO_ROTATION_TRACKS } from "@/lib/gido-leadership";
import { buildGidoMembersView } from "@/lib/gido-members-view";
import { getDailyPrayerTargets } from "@/lib/gido-prayer-rotation";

type GidoMemberRow = Member & {
  district: District | null;
  group: Group | null;
  household: Household | null;
};

type Props = {
  churchSlug: string;
  members: GidoMemberRow[];
  q?: string;
  filter?: string;
};

export default function GidoMembersPage({ churchSlug, members, q = "", filter = "all" }: Props) {
  const {
    filter: activeFilter,
    decoratedMembers,
    priorityMembers,
    unassignedMembers,
    counts,
    filteredMembers,
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

  const getPrimaryAction = (member: typeof decoratedMembers[number], nextFilter = activeFilter) => {
    return {
      href: buildMemberHref(member.id, nextFilter, member.actionPlan.section),
      label: member.actionPlan.shortLabel,
    };
  };

  const currentLeaders = decoratedMembers.filter((member) => member.leadership.isActiveLeader);
  const filterItems = [
    { key: "all", label: "전체", value: counts.all },
    { key: "priority", label: "운영 우선", value: counts.priority },
    { key: "leaders", label: "현 목자", value: counts.leaders },
    { key: "rotation", label: "순환 진행", value: counts.rotation },
    { key: "followup", label: "후속 필요", value: counts.followup },
    { key: "unassigned", label: "미분류", value: counts.unassigned },
  ];

  const qParam = q ? `&q=${encodeURIComponent(q)}` : "";
  const priorityQueue = (activeFilter === "priority" ? filteredMembers : priorityMembers).slice(0, activeFilter === "priority" ? 6 : 4);
  const prayerTargets = getDailyPrayerTargets(
    decoratedMembers.map((member) => ({
      ...member,
      householdName: member.household?.name ?? "미분류",
    })),
    3,
  );
  const followupLane = (activeFilter === "followup" ? filteredMembers : decoratedMembers.filter((member) => member.requiresFollowUp)).slice(0, 4);
  const householdBoards = buildHouseholdBoards(decoratedMembers).slice(0, 6);

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">G.I.D.O PEOPLE</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">목원 관리</h1>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">우선 확인 대상, 후속, 가정 연결</p>
          </div>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            <Link href={`/app/${churchSlug}/members/import`} className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-2 text-sm font-medium text-[#121212]">
              CSV 등록
            </Link>
            <Link href={`/app/${churchSlug}/members/new`} className="rounded-[14px] bg-[#111827] px-4 py-2 text-sm font-semibold text-white">
              새 목원 추가
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
          <form className="rounded-[22px] border border-[#ece4d8] bg-[#fbfaf7] p-4" method="get">
            <input type="hidden" name="filter" value={activeFilter} />
            <label className="grid gap-3">
              <span className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">SEARCH PEOPLE</span>
              <div className="flex items-center gap-3 rounded-[16px] border border-[#e7dfd3] bg-white px-4 py-3">
                <span className="text-sm text-[#8c7a5b]">⌕</span>
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="이름, 연락처, 가정 이름으로 찾기"
                  className="w-full bg-transparent text-sm text-[#111111] outline-none placeholder:text-[#a89c8f]"
                />
              </div>
            </label>
          </form>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="전체 목원" value={`${counts.all}명`} />
            <MetricCard label="현 목자" value={`${GIDO_ACTIVE_LEADER_NAMES.length}명`} />
            <MetricCard label="순환 진행" value={`${GIDO_ROTATION_TRACKS.length}가정`} />
            <MetricCard label="후속 필요" value={`${counts.followup}명`} tone={counts.followup > 0 ? "alert" : "neutral"} />
            <MetricCard label="미분류" value={`${counts.unassigned}명`} tone={counts.unassigned > 0 ? "alert" : "neutral"} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr_0.9fr]">
        <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">TODAY PRAYER ORDER</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">오늘 중보 순서</h2>
            </div>
            <Link href={`/app/${churchSlug}/households`} className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">
              가정 흐름
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {prayerTargets.map((member, index) => (
              <article key={`prayer-${member.id}`} className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] tracking-[0.14em] text-[#9a8b7a]">DAY {index + 1}</p>
                    <p className="mt-2 text-base font-semibold text-[#111111]">{member.name}</p>
                    <p className="mt-1 text-sm text-[#6d6259]">{member.householdName}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${getPriorityToneClasses(member.priorityReason.tone)}`}>
                    {member.priorityReason.title}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={buildMemberHref(member.id, activeFilter, "household-prayer")} className="rounded-[12px] bg-[#111827] px-3.5 py-2 text-sm font-semibold text-white">
                    중보 보기
                  </Link>
                  <Link href={buildMemberHref(member.id, activeFilter, "care-log")} className="rounded-[12px] border border-[#e4dbc9] bg-white px-3.5 py-2 text-sm font-medium text-[#121212]">
                    메모 바로가기
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">FOLLOW-UP LANE</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">이번 주 먼저 연락할 사람</h2>
            </div>
            <Link href={`?filter=followup${qParam}`} className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">
              후속 {counts.followup}명
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {followupLane.length === 0 ? (
              <EmptyBox text="표시할 후속 대상 없음" compact />
            ) : (
              followupLane.map((member) => (
                <article key={`followup-${member.id}`} className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[#111111]">{member.name}</p>
                      <p className="mt-1 text-sm text-[#6d6259]">{member.household?.name ?? "미분류"}</p>
                    </div>
                    <span className="rounded-full bg-[#fff4df] px-2.5 py-1 text-[11px] text-[#8C6A2E]">후속 필요</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#5f564b]">{member.priorityReason.body}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={buildMemberHref(member.id, "followup", "care-log")} className="rounded-[12px] bg-[#111827] px-3.5 py-2 text-sm font-semibold text-white">
                      후속 정리
                    </Link>
                    <Link href={`/app/${churchSlug}/followups`} className="rounded-[12px] border border-[#e4dbc9] bg-white px-3.5 py-2 text-sm font-medium text-[#121212]">
                      후속 보드
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
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">HOUSEHOLD LINK</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">가정 연결 점검</h2>
            </div>
            <Link href={`?filter=unassigned${qParam}`} className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">
              미분류 {counts.unassigned}명
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {unassignedMembers.length === 0 ? (
              <EmptyBox text="미분류 목원 없음" compact />
            ) : (
              unassignedMembers.slice(0, 4).map((member) => (
                <article key={`unassigned-${member.id}`} className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[#111111]">{member.name}</p>
                      <p className="mt-1 text-sm text-[#6d6259]">가정 연결 전</p>
                    </div>
                    <span className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#6f6256]">미분류</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#5f564b]">가정 연결이 필요한 목원</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={buildMemberHref(member.id, "unassigned", "family-links")} className="rounded-[12px] bg-[#111827] px-3.5 py-2 text-sm font-semibold text-white">
                      가정 연결
                    </Link>
                    <Link href={`/app/${churchSlug}/households`} className="rounded-[12px] border border-[#e4dbc9] bg-white px-3.5 py-2 text-sm font-medium text-[#121212]">
                      가정 화면
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </article>
      </section>

      {priorityQueue.length > 0 ? (
        <section className={`rounded-[24px] border bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] ${activeFilter === "priority" ? "border-[#d9cfbf]" : "border-[#e6dfd5]"}`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">PRIORITY QUEUE</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">지금 바로 볼 목원</h2>
              <p className="mt-2 text-sm leading-6 text-[#5f564b]">운영 우선 순서</p>
            </div>
            <span className="inline-flex h-9 items-center rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 text-[11px] text-[#6f6256]">
              {activeFilter === "priority" ? `운영 우선 ${filteredMembers.length}명` : `지금 먼저 볼 사람 ${priorityMembers.length}명`}
            </span>
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
            {priorityQueue.map((member) => {
              const secondaryHref = member.requiresFollowUp ? `/app/${churchSlug}/followups` : `/app/${churchSlug}/households`;
              const secondaryLabel = member.requiresFollowUp ? "후속 보드" : "가정 흐름";
              const primaryAction = getPrimaryAction(member, "priority");

              return (
                <article key={`priority-${member.id}`} className="rounded-[20px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[#111111]">{member.name}</p>
                      <p className="mt-1 text-sm text-[#6d6259]">{member.household?.name ?? "가정 연결 전"}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${getPriorityToneClasses(member.priorityReason.tone)}`}>{member.priorityReason.title}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#7d705f]">
                    <RoleTags member={member} />
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#5f564b]">{member.priorityReason.body}</p>

                  <div className="mt-3 rounded-[16px] border border-[#e7ddcf] bg-white px-3.5 py-3">
                    <p className="text-[10px] tracking-[0.14em] text-[#9a8b7a]">NEXT ACTION</p>
                    <p className="mt-1 text-sm font-semibold text-[#111111]">{member.actionPlan.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#5f564b]">{member.actionPlan.body}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={getPrimaryAction(member, member.actionPlan.queueFilter).href} className="rounded-[12px] bg-[#111827] px-3.5 py-2 text-sm font-semibold text-white">
                      {primaryAction.label}
                    </Link>
                    <Link href={secondaryHref} className="rounded-[12px] border border-[#e4dbc9] bg-white px-3.5 py-2 text-sm font-medium text-[#121212]">
                      {secondaryLabel}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">CURRENT LEADERS</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">지금 목장을 맡고 있는 사람</h2>
            </div>
            <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">올해 운영 기준</span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {currentLeaders.map((member) => (
              <Link key={member.id} href={buildMemberHref(member.id, "leaders", "household-prayer")} className="rounded-[20px] border border-[#ece4d8] bg-[#fbfaf7] p-4 transition hover:border-[#d8ccba]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-[#111111]">{member.name}</p>
                    <p className="mt-1 text-sm text-[#6d6259]">{member.household?.name ?? "가정 연결 전"}</p>
                  </div>
                  <span className="rounded-full bg-[#111827] px-2.5 py-1 text-[11px] font-semibold text-white">현 목자</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#7d705f]">
                  {member.requiresFollowUp ? <span className="rounded-full border border-[#f0ddae] bg-[#fff8e8] px-2.5 py-1 text-[#8c6a2e]">후속 필요</span> : null}
                </div>
              </Link>
            ))}
          </div>
        </article>

        <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">HOUSEHOLD BOARD</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">가정별 목원 보드</h2>
            </div>
            <Link href={`/app/${churchSlug}/households`} className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">
              전체 가정 보기
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {GIDO_ROTATION_TRACKS.map((track) => {
              const matched = householdBoards.find((item) => item.isRotation && item.rotationLabel === track.label);
              return (
                <span key={track.key} className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#6f6256]">
                  {track.label} {matched ? `${matched.memberCount}명` : "진행"}
                </span>
              );
            })}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {householdBoards.map((household) => (
              <article key={household.name} className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{household.name}</p>
                    <p className="mt-1 text-xs text-[#8C7A5B]">목원 {household.memberCount}명 · 후속 {household.followupCount}명</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1.5 text-[11px]">
                    {household.leaderCount > 0 ? <span className="rounded-full bg-[#111827] px-2.5 py-1 text-white">목자 {household.leaderCount}</span> : null}
                    {household.isRotation ? <span className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[#6f6256]">순환 진행</span> : null}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {household.members.slice(0, 5).map((member) => {
                    const primaryAction = getPrimaryAction(member);
                    return (
                      <Link key={`${household.name}-${member.id}`} href={primaryAction.href} className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#6f6256]">
                        {member.name}
                      </Link>
                    );
                  })}
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

        {filteredMembers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-base font-semibold text-[#111111]">조건에 맞는 목원이 없어</p>
            <p className="mt-2 text-sm text-[#5f564b]">검색어나 필터 조건을 확인해줘.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#FBF9F4] text-[#8C7A5B]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">이름</th>
                  <th className="px-4 py-3 text-left font-medium">우선 이유</th>
                  <th className="px-4 py-3 text-left font-medium">구별</th>
                  <th className="px-4 py-3 text-left font-medium">가정</th>
                  <th className="px-4 py-3 text-left font-medium">연락처</th>
                  <th className="px-4 py-3 text-left font-medium">등록일</th>
                  <th className="px-4 py-3 text-left font-medium">바로가기</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => {
                  const secondaryHref = member.requiresFollowUp ? `/app/${churchSlug}/followups` : `/app/${churchSlug}/households`;
                  const secondaryLabel = member.requiresFollowUp ? "후속" : "가정";
                  const primaryAction = getPrimaryAction(member);
                  const actionFilter = activeFilter === "all" ? member.actionPlan.queueFilter : activeFilter;

                  return (
                    <tr key={member.id} className="border-t border-[#f1eadf] text-[#111111] align-top">
                      <td className="px-4 py-4">
                        <div>
                          <Link href={primaryAction.href} className="font-semibold hover:text-[#8C6A2E]">
                            {member.name}
                          </Link>
                          <p className="mt-1 text-xs text-[#8C7A5B]">{member.group?.name ?? "G.I.D.O 목장"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="max-w-[320px]">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${getPriorityToneClasses(member.priorityReason.tone)}`}>
                            {member.priorityReason.title}
                          </span>
                          <p className="mt-2 text-sm leading-6 text-[#5f564b]">{member.priorityReason.body}</p>
                          <div className="mt-3 rounded-[14px] border border-[#e7ddcf] bg-[#fcfbf8] px-3 py-2.5">
                            <p className="text-[10px] tracking-[0.14em] text-[#9a8b7a]">NEXT ACTION</p>
                            <p className="mt-1 text-sm font-semibold text-[#111111]">{member.actionPlan.title}</p>
                            <p className="mt-1 text-sm leading-6 text-[#5f564b]">{member.actionPlan.body}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          <RoleTags member={member} />
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[#5f564b]">{member.household?.name ?? "미분류"}</td>
                      <td className="px-4 py-4 text-[#5f564b]">{member.phone || member.email || "-"}</td>
                      <td className="px-4 py-4 text-[#5f564b]">{formatDate(member.registeredAt)}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <Link href={getPrimaryAction(member, actionFilter).href} className="rounded-[10px] border border-[#111827] bg-[#111827] px-3 py-1.5 text-center text-xs font-medium text-white">
                            {primaryAction.label}
                          </Link>
                          <Link href={secondaryHref} className="rounded-[10px] border border-[#E7E0D4] bg-white px-3 py-1.5 text-center text-xs font-medium text-[#121212]">
                            {secondaryLabel}
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

function buildHouseholdBoards(members: ReturnType<typeof buildGidoMembersView<GidoMemberRow>>["decoratedMembers"]) {
  const buckets = new Map<string, {
    name: string;
    members: typeof members;
    followupCount: number;
    leaderCount: number;
    isRotation: boolean;
    rotationLabel?: string;
  }>();

  members.forEach((member) => {
    const name = member.household?.name ?? "미분류";
    const current = buckets.get(name) ?? {
      name,
      members: [] as typeof members,
      followupCount: 0,
      leaderCount: 0,
      isRotation: false,
      rotationLabel: undefined,
    };

    current.members.push(member);
    if (member.requiresFollowUp) current.followupCount += 1;
    if (member.leadership.isActiveLeader) current.leaderCount += 1;
    if (member.leadership.rotationTrack) {
      current.isRotation = true;
      current.rotationLabel = member.leadership.rotationTrack.label;
    }

    buckets.set(name, current);
  });

  return [...buckets.values()]
    .map((item) => ({
      ...item,
      memberCount: item.members.length,
      members: item.members.sort((a, b) => a.name.localeCompare(b.name, "ko-KR")),
    }))
    .sort((a, b) => {
      if (a.followupCount !== b.followupCount) return b.followupCount - a.followupCount;
      if (a.leaderCount !== b.leaderCount) return b.leaderCount - a.leaderCount;
      if (a.memberCount !== b.memberCount) return b.memberCount - a.memberCount;
      if (a.name === "미분류") return -1;
      if (b.name === "미분류") return 1;
      return a.name.localeCompare(b.name, "ko-KR");
    });
}

function MetricCard({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "alert" }) {
  return (
    <div className={`rounded-[18px] border p-4 ${tone === "alert" ? "border-[#e9d8b0] bg-[#fff7e8]" : "border-[#ece4d8] bg-white"}`}>
      <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[#111111]">{value}</p>
    </div>
  );
}

function RoleTags({ member }: { member: ReturnType<typeof buildGidoMembersView<GidoMemberRow>>["decoratedMembers"][number] }) {
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
      {member.requiresFollowUp ? <span className="rounded-full bg-[#fff4df] px-2.5 py-1 text-[11px] text-[#8C6A2E]">후속 필요</span> : null}
      {!member.household?.name ? <span className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#6f6256]">미분류</span> : null}
    </>
  );
}

function getPriorityToneClasses(tone: "alert" | "dark" | "warm" | "neutral") {
  if (tone === "alert") return "bg-[#fff4df] text-[#8C6A2E]";
  if (tone === "dark") return "bg-[#111827] text-white";
  if (tone === "warm") return "border border-[#e6d8bf] bg-white text-[#6f6256]";
  return "border border-[#e4dbc9] bg-white text-[#6f6256]";
}

function EmptyBox({ text, compact = false }: { text: string; compact?: boolean }) {
  return <div className={`rounded-[16px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] text-[13px] text-[#5f564b] ${compact ? "p-4" : "p-6"}`}>{text}</div>;
}
