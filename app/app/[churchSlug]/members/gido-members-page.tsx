import Link from "next/link";
import { District, Group, Household, Member } from "@prisma/client";
import { formatDate } from "@/lib/date";
import { GIDO_ACTIVE_LEADER_NAMES, GIDO_ROTATION_TRACKS, getGidoLeadershipProfile } from "@/lib/gido-leadership";

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

type DecoratedMember = GidoMemberRow & {
  leadership: ReturnType<typeof getGidoLeadershipProfile>;
};

export default function GidoMembersPage({ churchSlug, members, q = "", filter = "all" }: Props) {
  const query = q.trim().toLowerCase();

  const decoratedMembers: DecoratedMember[] = members.map((member) => {
    const leadership = getGidoLeadershipProfile(member.name, member.household?.name);
    return { ...member, leadership };
  });

  const rankedMembers = [...decoratedMembers].sort((a, b) => {
    const scoreDiff = getPriorityScore(b) - getPriorityScore(a);
    if (scoreDiff !== 0) return scoreDiff;
    if (a.requiresFollowUp !== b.requiresFollowUp) return a.requiresFollowUp ? -1 : 1;
    if (a.leadership.isActiveLeader !== b.leadership.isActiveLeader) return a.leadership.isActiveLeader ? -1 : 1;
    if (a.leadership.isRotationHousehold !== b.leadership.isRotationHousehold) return a.leadership.isRotationHousehold ? -1 : 1;
    return a.name.localeCompare(b.name, "ko-KR");
  });

  const priorityMembers = rankedMembers.filter((member) => getPriorityScore(member) > 0);

  const counts = {
    all: decoratedMembers.length,
    priority: priorityMembers.length,
    leaders: decoratedMembers.filter((member) => member.leadership.isActiveLeader).length,
    rotation: decoratedMembers.filter((member) => member.leadership.isRotationHousehold).length,
    followup: decoratedMembers.filter((member) => member.requiresFollowUp).length,
  };

  const filteredMembers = rankedMembers.filter((member) => {
    const matchesQuery =
      !query ||
      [member.name, member.phone, member.email ?? "", member.household?.name ?? "", member.statusTag]
        .join(" ")
        .toLowerCase()
        .includes(query);

    const matchesFilter =
      filter === "priority"
        ? getPriorityScore(member) > 0
        : filter === "leaders"
          ? member.leadership.isActiveLeader
          : filter === "rotation"
            ? member.leadership.isRotationHousehold
            : filter === "followup"
              ? member.requiresFollowUp
              : true;

    return matchesQuery && matchesFilter;
  });

  const currentLeaders = decoratedMembers.filter((member) => member.leadership.isActiveLeader);
  const rotationGroups = GIDO_ROTATION_TRACKS.map((track) => ({
    track,
    members: decoratedMembers.filter((member) => member.leadership.rotationTrack?.key === track.key),
  }));

  const filterItems = [
    { key: "all", label: "전체", value: counts.all },
    { key: "priority", label: "운영 우선", value: counts.priority },
    { key: "leaders", label: "현 목자", value: counts.leaders },
    { key: "rotation", label: "순환 진행", value: counts.rotation },
    { key: "followup", label: "후속 필요", value: counts.followup },
  ];

  const qParam = q ? `&q=${encodeURIComponent(q)}` : "";
  const priorityQueue = (filter === "priority" ? filteredMembers : priorityMembers).slice(0, filter === "priority" ? 6 : 4);

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">G.I.D.O PEOPLE</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">목원 관리</h1>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">현 목자, 순환 진행 가정, 일반 목원을 구별해서 보고 사람별 관리 화면으로 바로 들어가.</p>
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
            <input type="hidden" name="filter" value={filter} />
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

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="전체 목원" value={`${counts.all}명`} />
            <MetricCard label="현 목자" value={`${GIDO_ACTIVE_LEADER_NAMES.length}명`} />
            <MetricCard label="순환 진행" value={`${GIDO_ROTATION_TRACKS.length}가정`} />
            <MetricCard label="후속 필요" value={`${counts.followup}명`} tone={counts.followup > 0 ? "alert" : "neutral"} />
          </div>
        </div>
      </section>

      {priorityQueue.length > 0 ? (
        <section className={`rounded-[24px] border bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] ${filter === "priority" ? "border-[#d9cfbf]" : "border-[#e6dfd5]"}`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">PRIORITY QUEUE</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">지금 바로 볼 목원</h2>
              <p className="mt-2 text-sm leading-6 text-[#5f564b]">후속, 현 목자, 순환 진행 가정을 먼저 올려서 오늘 운영 흐름이 바로 보이게 했어.</p>
            </div>
            <span className="inline-flex h-9 items-center rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 text-[11px] text-[#6f6256]">
              {filter === "priority" ? `운영 우선 ${filteredMembers.length}명` : `지금 먼저 볼 사람 ${priorityMembers.length}명`}
            </span>
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
            {priorityQueue.map((member) => {
              const reason = getPriorityReason(member);
              const secondaryHref = member.requiresFollowUp ? `/app/${churchSlug}/followups` : `/app/${churchSlug}/households`;
              const secondaryLabel = member.requiresFollowUp ? "후속 보드" : "가정 흐름";

              return (
                <article key={`priority-${member.id}`} className="rounded-[20px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[#111111]">{member.name}</p>
                      <p className="mt-1 text-sm text-[#6d6259]">{member.household?.name ?? "가정 연결 전"} · {member.statusTag}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${getPriorityToneClasses(reason.tone)}`}>{reason.title}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#7d705f]">
                    {member.leadership.tags.length > 0 ? (
                      member.leadership.tags.map((tag) => (
                        <span key={`${member.id}-${tag}`} className={`rounded-full px-2.5 py-1 ${tag === "현 목자" ? "bg-[#111827] text-white" : "border border-[#e4dbc9] bg-white text-[#6f6256]"}`}>
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[#6f6256]">목원</span>
                    )}
                    {member.requiresFollowUp ? <span className="rounded-full bg-[#fff4df] px-2.5 py-1 text-[#8C6A2E]">후속 필요</span> : null}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#5f564b]">{reason.body}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/app/${churchSlug}/members/${member.id}`} className="rounded-[12px] bg-[#111827] px-3.5 py-2 text-sm font-semibold text-white">
                      상세 관리
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

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
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
              <Link key={member.id} href={`/app/${churchSlug}/members/${member.id}`} className="rounded-[20px] border border-[#ece4d8] bg-[#fbfaf7] p-4 transition hover:border-[#d8ccba]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-[#111111]">{member.name}</p>
                    <p className="mt-1 text-sm text-[#6d6259]">{member.household?.name ?? "가정 연결 전"}</p>
                  </div>
                  <span className="rounded-full bg-[#111827] px-2.5 py-1 text-[11px] font-semibold text-white">현 목자</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#7d705f]">
                  <span className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1">상태 {member.statusTag}</span>
                  {member.requiresFollowUp ? <span className="rounded-full border border-[#f0ddae] bg-[#fff8e8] px-2.5 py-1 text-[#8c6a2e]">후속 필요</span> : null}
                </div>
              </Link>
            ))}
          </div>
        </article>

        <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">ROTATION FAMILIES</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">올해 돌아가며 모임을 맡는 가정</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {rotationGroups.map(({ track, members }) => (
              <div key={track.key} className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#111111]">{track.label}</p>
                  <span className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#6f6256]">순환 진행</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(members.length > 0 ? members.map((member) => member.name) : track.memberNames).map((name) => (
                    <span key={`${track.key}-${name}`} className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#6f6256]">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
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
                  filter === item.key ? "bg-[#111827] text-white" : "border border-[#E7E0D4] bg-white text-[#5f564b]"
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
            <p className="mt-2 text-sm text-[#5f564b]">검색어나 필터를 바꾸거나 새 목원을 추가해봐.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#FBF9F4] text-[#8C7A5B]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">이름</th>
                  <th className="px-4 py-3 text-left font-medium">구별</th>
                  <th className="px-4 py-3 text-left font-medium">가정</th>
                  <th className="px-4 py-3 text-left font-medium">상태</th>
                  <th className="px-4 py-3 text-left font-medium">연락처</th>
                  <th className="px-4 py-3 text-left font-medium">등록일</th>
                  <th className="px-4 py-3 text-left font-medium">열기</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-t border-[#f1eadf] text-[#111111]">
                    <td className="px-4 py-4">
                      <div>
                        <Link href={`/app/${churchSlug}/members/${member.id}`} className="font-semibold hover:text-[#8C6A2E]">
                          {member.name}
                        </Link>
                        <p className="mt-1 text-xs text-[#8C7A5B]">{member.group?.name ?? "G.I.D.O 목장"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
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
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#5f564b]">{member.household?.name ?? "미분류"}</td>
                    <td className="px-4 py-4 text-[#5f564b]">{member.statusTag}</td>
                    <td className="px-4 py-4 text-[#5f564b]">{member.phone || member.email || "-"}</td>
                    <td className="px-4 py-4 text-[#5f564b]">{formatDate(member.registeredAt)}</td>
                    <td className="px-4 py-4">
                      <Link href={`/app/${churchSlug}/members/${member.id}`} className="rounded-[10px] border border-[#E7E0D4] bg-white px-3 py-1.5 text-xs font-medium text-[#121212]">
                        관리
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "alert" }) {
  return (
    <div className={`rounded-[18px] border p-4 ${tone === "alert" ? "border-[#e9d8b0] bg-[#fff7e8]" : "border-[#ece4d8] bg-white"}`}>
      <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[#111111]">{value}</p>
    </div>
  );
}

function getPriorityScore(member: DecoratedMember) {
  let score = 0;
  if (member.requiresFollowUp) score += 100;
  if (member.leadership.isActiveLeader) score += 40;
  if (member.leadership.isRotationHousehold) score += 20;
  if (!member.household?.name) score += 10;
  return score;
}

function getPriorityReason(member: DecoratedMember) {
  if (member.requiresFollowUp && member.leadership.isActiveLeader) {
    return {
      title: "후속 + 리더",
      body: "지금 목장 흐름을 맡고 있으면서 후속도 필요한 상태야. 오늘 제일 먼저 확인하는 게 좋아.",
      tone: "alert" as const,
    };
  }

  if (member.requiresFollowUp) {
    return {
      title: "오늘 후속",
      body: "연락이나 체크인을 바로 남겨야 흐름이 이어져. 상세 화면에서 다음 액션까지 바로 정리하면 돼.",
      tone: "alert" as const,
    };
  }

  if (member.leadership.isActiveLeader) {
    return {
      title: "현 목자",
      body: "지금 목장을 직접 맡고 있는 사람이라 전체 운영 흐름을 볼 때 먼저 체크하는 편이 좋아.",
      tone: "dark" as const,
    };
  }

  if (member.leadership.isRotationHousehold) {
    return {
      title: "순환 진행",
      body: "올해 모임 진행 흐름 안에 들어가 있는 가정이야. 가정 메모와 상태를 같이 보는 게 좋아.",
      tone: "warm" as const,
    };
  }

  return {
    title: "가정 연결",
    body: "가정 연결부터 잡아두면 뒤에서 후속과 중보 흐름이 덜 꼬여.",
    tone: "neutral" as const,
  };
}

function getPriorityToneClasses(tone: "alert" | "dark" | "warm" | "neutral") {
  if (tone === "alert") return "bg-[#fff4df] text-[#8C6A2E]";
  if (tone === "dark") return "bg-[#111827] text-white";
  if (tone === "warm") return "border border-[#e6d8bf] bg-white text-[#6f6256]";
  return "border border-[#e4dbc9] bg-white text-[#6f6256]";
}
