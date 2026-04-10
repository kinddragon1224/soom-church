import Link from "next/link";
import { District, Group, Household, Member } from "@prisma/client";
import { getGidoLeadershipProfile } from "@/lib/gido-leadership";
import { GidoFollowUpView, GidoUpdateView } from "@/lib/gido-workspace-data";

type GidoMemberRow = Member & {
  district: District | null;
  group: Group | null;
  household: Household | null;
};

export default function GidoUpdatesPage({
  churchSlug,
  updates,
  followUps,
  members,
  q = "",
  scope = "all",
}: {
  churchSlug: string;
  updates: GidoUpdateView[];
  followUps: GidoFollowUpView[];
  members: GidoMemberRow[];
  q?: string;
  scope?: string;
}) {
  const query = q.trim().toLowerCase();
  const decoratedMembers = members.map((member) => ({
    ...member,
    leadership: getGidoLeadershipProfile(member.name, member.household?.name),
  }));

  const filteredUpdates = updates.filter((update) => {
    const text = [update.title, update.body, update.note ?? "", update.due ?? ""].join(" ").toLowerCase();
    const matchesQuery = !query || text.includes(query);
    return matchesQuery;
  });

  const scopedMembers = decoratedMembers.filter((member) => {
    if (!member.requiresFollowUp) return false;
    if (scope === "leaders") return member.leadership.isActiveLeader;
    if (scope === "rotation") return member.leadership.isRotationHousehold;
    if (scope === "general") return !member.leadership.isActiveLeader && !member.leadership.isRotationHousehold;
    return true;
  });

  const scopeItems = [
    { key: "all", label: "전체", value: decoratedMembers.filter((member) => member.requiresFollowUp).length },
    { key: "leaders", label: "현 목자", value: decoratedMembers.filter((member) => member.requiresFollowUp && member.leadership.isActiveLeader).length },
    { key: "rotation", label: "순환 진행", value: decoratedMembers.filter((member) => member.requiresFollowUp && member.leadership.isRotationHousehold).length },
    { key: "general", label: "일반 목원", value: decoratedMembers.filter((member) => member.requiresFollowUp && !member.leadership.isActiveLeader && !member.leadership.isRotationHousehold).length },
  ];

  const qParam = q ? `&q=${encodeURIComponent(q)}` : "";

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">SOOM UPDATES</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">근황 기록</h1>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">최근 근황과 메모를 보고, 바로 챙겨야 할 사람까지 같이 확인해.</p>
          </div>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            <Link href={`/app/${churchSlug}/followups`} className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-2 text-sm font-medium text-[#121212]">
              관리 보드
            </Link>
            <Link href={`/app/${churchSlug}/members`} className="rounded-[14px] bg-[#111827] px-4 py-2 text-sm font-semibold text-white">
              목원 보기
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
          <form className="rounded-[22px] border border-[#ece4d8] bg-[#fbfaf7] p-4" method="get">
            <input type="hidden" name="scope" value={scope} />
            <label className="grid gap-3">
              <span className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">SEARCH UPDATE</span>
              <div className="flex items-center gap-3 rounded-[16px] border border-[#e7dfd3] bg-white px-4 py-3">
                <span className="text-sm text-[#8c7a5b]">⌕</span>
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="제목, 내용, 메모로 찾기"
                  className="w-full bg-transparent text-sm text-[#111111] outline-none placeholder:text-[#a89c8f]"
                />
              </div>
            </label>
          </form>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="근황 기록" value={`${updates.length}건`} />
            <MetricCard label="관리 카드" value={`${followUps.length}건`} />
            <MetricCard label="관리 필요" value={`${decoratedMembers.filter((member) => member.requiresFollowUp).length}명`} tone="alert" />
            <MetricCard label="검색 결과" value={`${filteredUpdates.length}건`} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">UPDATE FEED</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">최근 근황</h2>
            </div>
            <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">최신순</span>
          </div>

          <div className="mt-4 grid gap-3">
            {filteredUpdates.length === 0 ? (
              <EmptyBox text="조건에 맞는 근황 기록이 없어." />
            ) : (
              filteredUpdates.map((item) => (
                <article key={`${item.title}-${item.due ?? "x"}-${item.body}`} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                    <span className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#6f6256]">{item.due ?? "기록"}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.body}</p>
                  {item.note ? <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.note}</p> : null}
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">MANAGEMENT TARGETS</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">바로 챙길 사람</h2>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {scopeItems.map((item) => (
              <Link
                key={item.key}
                href={`?scope=${item.key}${qParam}`}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  scope === item.key ? "bg-[#111827] text-white" : "border border-[#E7E0D4] bg-white text-[#5f564b]"
                }`}
              >
                {item.label} {item.value}
              </Link>
            ))}
          </div>

          <div className="mt-4 grid gap-3">
            {scopedMembers.length === 0 ? (
              <EmptyBox text="현재 범위에서 바로 챙길 사람이 없어." compact />
            ) : (
              scopedMembers.map((member) => (
                <Link key={member.id} href={`/app/${churchSlug}/members/${member.id}`} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 transition hover:border-[#d8ccba]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">{member.name}</p>
                      <p className="mt-1 text-xs text-[#8C7A5B]">{member.household?.name ?? "미분류"} · {member.statusTag}</p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {member.leadership.tags.length > 0 ? member.leadership.tags.map((tag) => (
                        <span key={`${member.id}-${tag}`} className={`rounded-full px-2.5 py-1 text-[11px] ${tag === "현 목자" ? "bg-[#111827] text-white" : "border border-[#e4dbc9] bg-white text-[#5f564b]"}`}>
                          {tag}
                        </span>
                      )) : null}
                      <span className="rounded-full bg-[#fff4df] px-2.5 py-1 text-[11px] text-[#8C6A2E]">관리 필요</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="mt-4 rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
            <p className="text-sm font-semibold text-[#111111]">기록 기준</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[#5f564b]">
              <li>근황은 기록으로 남기고, 실제 행동은 관리 페이지에서 정리</li>
              <li>리더와 순환 진행 가정은 따로 필터해서 볼 수 있게 유지</li>
              <li>사람별 디테일 페이지에서 바로 메모와 출석을 추가</li>
            </ul>
          </div>
        </section>
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

function EmptyBox({ text, compact = false }: { text: string; compact?: boolean }) {
  return <div className={`rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] text-sm text-[#5f564b] ${compact ? "p-4" : "p-6"}`}>{text}</div>;
}
