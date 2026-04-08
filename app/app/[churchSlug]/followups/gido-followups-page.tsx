import Link from "next/link";
import { District, Group, Household, Member } from "@prisma/client";
import { GIDO_ROTATION_TRACKS } from "@/lib/gido-leadership";
import { buildGidoMembersView } from "@/lib/gido-members-view";
import { GidoFollowUpView, GidoUpdateView } from "@/lib/gido-workspace-data";

type GidoMemberRow = Member & {
  district: District | null;
  group: Group | null;
  household: Household | null;
};

type Props = {
  churchSlug: string;
  members: GidoMemberRow[];
  followUps: GidoFollowUpView[];
  updates: GidoUpdateView[];
  q?: string;
  scope?: string;
};

type FollowupScope = "all" | "followup" | "leaders" | "rotation";

export default function GidoFollowupsPage({
  churchSlug,
  members,
  followUps,
  updates,
  q = "",
  scope = "all",
}: Props) {
  const { rankedMembers } = buildGidoMembersView(members);
  const query = q.trim().toLowerCase();
  const activeScope = normalizeScope(scope);

  const executionMembers = rankedMembers.filter((member) => {
    const matchesQuery =
      !query ||
      [member.name, member.phone, member.email ?? "", member.household?.name ?? "", member.statusTag]
        .join(" ")
        .toLowerCase()
        .includes(query);

    const matchesScope =
      activeScope === "followup"
        ? member.requiresFollowUp
        : activeScope === "leaders"
          ? member.leadership.isActiveLeader
          : activeScope === "rotation"
            ? member.leadership.isRotationHousehold
            : member.requiresFollowUp || member.leadership.isActiveLeader || member.leadership.isRotationHousehold;

    return matchesQuery && matchesScope;
  });

  const counts = {
    all: rankedMembers.filter((member) => member.requiresFollowUp || member.leadership.isActiveLeader || member.leadership.isRotationHousehold).length,
    followup: rankedMembers.filter((member) => member.requiresFollowUp).length,
    leaders: rankedMembers.filter((member) => member.leadership.isActiveLeader).length,
    rotation: rankedMembers.filter((member) => member.leadership.isRotationHousehold).length,
  };

  const highPriorityCards = followUps.filter((item) => item.priority === "높음").length;
  const filterItems = [
    { key: "all", label: "실행 전체", value: counts.all },
    { key: "followup", label: "후속", value: counts.followup },
    { key: "leaders", label: "현 목자", value: counts.leaders },
    { key: "rotation", label: "순환 진행", value: counts.rotation },
  ];

  const qParam = q ? `&q=${encodeURIComponent(q)}` : "";
  const rotationSummary = GIDO_ROTATION_TRACKS.map((track) => ({
    track,
    members: rankedMembers.filter((member) => member.leadership.rotationTrack?.key === track.key),
  }));

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">G.I.D.O FOLLOW-UPS</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">후속</h1>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">실행 대상, 후속 카드, 순환 진행 체크</p>
          </div>

          <form className="w-full max-w-[420px] rounded-[22px] border border-[#ece4d8] bg-[#fbfaf7] p-4" method="get">
            <input type="hidden" name="scope" value={activeScope} />
            <label className="grid gap-3">
              <span className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">SEARCH</span>
              <div className="flex items-center gap-3 rounded-[16px] border border-[#e7dfd3] bg-white px-4 py-3">
                <span className="text-sm text-[#8c7a5b]">⌕</span>
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="이름, 연락처, 가정으로 찾기"
                  className="w-full bg-transparent text-sm text-[#111111] outline-none placeholder:text-[#a89c8f]"
                />
              </div>
            </label>
          </form>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="후속 대상" value={`${counts.followup}명`} tone={counts.followup > 0 ? "alert" : "neutral"} />
          <MetricCard label="후속 카드" value={`${followUps.length}건`} />
          <MetricCard label="높은 우선순위" value={`${highPriorityCards}건`} tone={highPriorityCards > 0 ? "alert" : "neutral"} />
          <MetricCard label="순환 진행" value={`${counts.rotation}명`} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">FOLLOW-UP CARDS</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">기록된 후속 카드</h2>
            </div>
            <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">{followUps.length}건</span>
          </div>

          <div className="mt-4 grid gap-3">
            {followUps.length === 0 ? (
              <EmptyBox text="기록된 후속 카드 없음" />
            ) : (
              followUps.map((item, index) => (
                <article key={`${item.title}-${index}`} className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.note}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] ${item.priority === "높음" ? "bg-[#fff4df] text-[#8C6A2E]" : "border border-[#e4dbc9] bg-white text-[#6f6256]"}`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-[#6f6256]">
                    <span className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1">기한 {item.due}</span>
                    <Link href={`/app/${churchSlug}/households`} className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1">
                      가정 화면
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
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">EXECUTION QUEUE</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">지금 처리할 대상</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterItems.map((item) => (
                <Link
                  key={item.key}
                  href={`?scope=${item.key}${qParam}`}
                  className={`rounded-full px-3 py-1.5 text-[11px] transition ${
                    activeScope === item.key ? "bg-[#111827] text-white" : "border border-[#E7E0D4] bg-white text-[#5f564b]"
                  }`}
                >
                  {item.label} {item.value}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {executionMembers.length === 0 ? (
              <EmptyBox text="실행 대상 없음" />
            ) : (
              executionMembers.slice(0, 8).map((member) => (
                <article key={member.id} className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
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
                    <Link href={`/app/${churchSlug}/members/${member.id}?filter=followup`} className="rounded-[12px] bg-[#111827] px-3.5 py-2 text-sm font-semibold text-white">
                      상세 관리
                    </Link>
                    <Link href={`/app/${churchSlug}/households`} className="rounded-[12px] border border-[#e4dbc9] bg-white px-3.5 py-2 text-sm font-medium text-[#121212]">
                      가정 확인
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">UPDATES</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">공유할 근황</h2>
            </div>
            <Link href={`/app/${churchSlug}/updates`} className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">
              전체 보기
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {updates.length === 0 ? (
              <EmptyBox text="최근 근황 기록 없음" compact />
            ) : (
              updates.slice(0, 4).map((item, index) => (
                <article key={`${item.title}-${index}`} className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
                  <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.body}</p>
                  {item.note ? <p className="mt-3 text-[12px] text-[#8C7A5B]">{item.note}</p> : null}
                </article>
              ))
            )}
          </div>
        </article>

        <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">ROTATION CHECK</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">순환 진행 가정 체크</h2>
            </div>
            <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">{GIDO_ROTATION_TRACKS.length}가정</span>
          </div>

          <div className="mt-4 grid gap-3">
            {rotationSummary.map((item) => (
              <article key={item.track.key} className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#111111]">{item.track.label}</p>
                  <span className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#6f6256]">
                    {item.members.length > 0 ? `${item.members.length}명` : "진행"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(item.members.length > 0 ? item.members.map((member) => member.name) : item.track.memberNames).map((name) => (
                    <span key={`${item.track.key}-${name}`} className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#6f6256]">
                      {name}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">ACTION BOARD</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">후속 대상 보드</h2>
          </div>
          <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">{executionMembers.length}명</span>
        </div>

        {executionMembers.length === 0 ? (
          <div className="mt-4">
            <EmptyBox text="표시할 대상 없음" />
          </div>
        ) : (
          <div className="mt-4 grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
            {executionMembers.map((member) => (
              <article key={`board-${member.id}`} className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-[#111111]">{member.name}</p>
                    <p className="mt-1 text-sm text-[#6d6259]">{member.household?.name ?? "미분류"}</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1.5 text-[11px]">
                    {member.leadership.tags.map((tag) => (
                      <span key={`${member.id}-${tag}`} className={`rounded-full px-2.5 py-1 ${tag === "현 목자" ? "bg-[#111827] text-white" : "border border-[#E7E0D4] bg-white text-[#5f564b]"}`}>
                        {tag}
                      </span>
                    ))}
                    {member.requiresFollowUp ? <span className="rounded-full bg-[#fff4df] px-2.5 py-1 text-[#8C6A2E]">후속 필요</span> : null}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#5f564b]">{member.priorityReason.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/app/${churchSlug}/members/${member.id}?filter=${activeScope}`} className="rounded-[12px] bg-[#111827] px-3.5 py-2 text-sm font-semibold text-white">
                    상세 관리
                  </Link>
                  <Link href={`/app/${churchSlug}/followups?scope=${activeScope}${qParam}`} className="rounded-[12px] border border-[#e4dbc9] bg-white px-3.5 py-2 text-sm font-medium text-[#121212]">
                    큐 유지
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function normalizeScope(scope?: string): FollowupScope {
  if (scope === "followup" || scope === "leaders" || scope === "rotation") return scope;
  return "all";
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
  return <div className={`rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] text-sm text-[#5f564b] ${compact ? "p-4" : "p-6"}`}>{text}</div>;
}
