import Link from "next/link";
import { District, Group, Household, Member } from "@prisma/client";
import { formatDate } from "@/lib/date";
import { GIDO_ROTATION_TRACKS, getGidoLeadershipProfile } from "@/lib/gido-leadership";
import { GidoFollowUpView, GidoUpdateView } from "@/lib/gido-workspace-data";

type GidoMemberRow = Member & {
  district: District | null;
  group: Group | null;
  household: Household | null;
};

export default function GidoFollowupsPage({
  churchSlug,
  members,
  followUps,
  updates,
  q = "",
  scope = "all",
}: {
  churchSlug: string;
  members: GidoMemberRow[];
  followUps: GidoFollowUpView[];
  updates: GidoUpdateView[];
  q?: string;
  scope?: string;
}) {
  const query = q.trim().toLowerCase();
  const decoratedMembers = members.map((member) => ({
    ...member,
    leadership: getGidoLeadershipProfile(member.name, member.household?.name),
  }));

  const filteredMembers = decoratedMembers.filter((member) => {
    const matchesQuery =
      !query ||
      [member.name, member.phone, member.email ?? "", member.household?.name ?? "", member.statusTag]
        .join(" ")
        .toLowerCase()
        .includes(query);

    const matchesScope =
      scope === "leaders"
        ? member.leadership.isActiveLeader
        : scope === "rotation"
          ? member.leadership.isRotationHousehold
          : scope === "general"
            ? !member.leadership.isRotationHousehold && !member.leadership.isActiveLeader
            : true;

    return member.requiresFollowUp && matchesQuery && matchesScope;
  });

  const scopeItems = [
    { key: "all", label: "전체", value: decoratedMembers.filter((member) => member.requiresFollowUp).length },
    { key: "leaders", label: "현 목자", value: decoratedMembers.filter((member) => member.requiresFollowUp && member.leadership.isActiveLeader).length },
    { key: "rotation", label: "순환 진행", value: decoratedMembers.filter((member) => member.requiresFollowUp && member.leadership.isRotationHousehold).length },
    { key: "general", label: "일반 목원", value: decoratedMembers.filter((member) => member.requiresFollowUp && !member.leadership.isActiveLeader && !member.leadership.isRotationHousehold).length },
  ];

  const rotationSummary = GIDO_ROTATION_TRACKS.map((track) => ({
    label: track.label,
    count: decoratedMembers.filter((member) => member.requiresFollowUp && member.leadership.rotationTrack?.key === track.key).length,
  }));

  const qParam = q ? `&q=${encodeURIComponent(q)}` : "";

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">G.I.D.O FOLLOW-UP</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">후속 관리</h1>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">이번 주 챙길 사람과 가정, 실제 후속 메모를 한 페이지에서 정리해.</p>
          </div>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            <Link href={`/app/${churchSlug}/members`} className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-2 text-sm font-medium text-[#121212]">
              목원 목록
            </Link>
            <Link href={`/app/${churchSlug}/members/new`} className="rounded-[14px] bg-[#111827] px-4 py-2 text-sm font-semibold text-white">
              새 목원 추가
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
          <form className="rounded-[22px] border border-[#ece4d8] bg-[#fbfaf7] p-4" method="get">
            <input type="hidden" name="scope" value={scope} />
            <label className="grid gap-3">
              <span className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">SEARCH FOLLOW-UP</span>
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
            <MetricCard label="후속 필요 목원" value={`${decoratedMembers.filter((member) => member.requiresFollowUp).length}명`} tone="alert" />
            <MetricCard label="실제 후속 카드" value={`${followUps.length}건`} />
            <MetricCard label="최근 근황" value={`${updates.length}건`} />
            <MetricCard label="순환 진행 가정" value={`${GIDO_ROTATION_TRACKS.length}가정`} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">FOLLOW-UP BOARD</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">기록된 후속 메모</h2>
            </div>
            <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">가정 메타 기준</span>
          </div>

          <div className="mt-4 grid gap-3">
            {followUps.length === 0 ? (
              <EmptyBox text="아직 기록된 후속 카드가 없어. 가정 메타에 후속 내용을 넣으면 여기에 모여." />
            ) : (
              followUps.map((item) => (
                <article key={`${item.title}-${item.due}-${item.note}`} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] ${priorityTone(item.priority)}`}>{item.priority}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.note}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#7a6d5c]">
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1">기한 {item.due}</span>
                    {item.owner ? <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1">담당 {item.owner}</span> : null}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">ROTATION CHECK</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">순환 진행 가정 체크</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {rotationSummary.map((item) => (
              <article key={item.label} className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#111111]">{item.label}</p>
                  <span className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#6f6256]">후속 {item.count}명</span>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-4 rounded-[20px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
            <p className="text-sm font-semibold text-[#111111]">최근 근황</p>
            <div className="mt-3 grid gap-3">
              {updates.slice(0, 4).map((item) => (
                <article key={`${item.title}-${item.due ?? "x"}`} className="rounded-[16px] border border-[#ede6d8] bg-white p-3.5">
                  <p className="text-sm font-medium text-[#111111]">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#5f564b]">{item.body}</p>
                </article>
              ))}
              {updates.length === 0 ? <EmptyBox text="최근 근황 기록이 아직 없어." compact /> : null}
            </div>
          </div>
        </section>
      </section>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-3 border-b border-[#efe7da] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#111111]">후속 필요 목원</p>
            <p className="mt-1 text-xs text-[#8C7A5B]">{filteredMembers.length}명 표시</p>
          </div>

          <div className="flex flex-wrap gap-2">
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
        </div>

        {filteredMembers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-base font-semibold text-[#111111]">후속이 필요한 목원이 없어</p>
            <p className="mt-2 text-sm text-[#5f564b]">좋아, 지금은 큐가 비어 있어.</p>
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
                  <th className="px-4 py-3 text-left font-medium">관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-t border-[#f1eadf] text-[#111111]">
                    <td className="px-4 py-4 font-semibold">
                      <Link href={`/app/${churchSlug}/members/${member.id}`} className="hover:text-[#8C6A2E]">
                        {member.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {member.leadership.tags.length > 0 ? member.leadership.tags.map((tag) => (
                          <span key={`${member.id}-${tag}`} className={`rounded-full px-2.5 py-1 text-[11px] ${tag === "현 목자" ? "bg-[#111827] text-white" : "border border-[#E7E0D4] bg-white text-[#5f564b]"}`}>
                            {tag}
                          </span>
                        )) : <span className="rounded-full border border-[#E7E0D4] bg-white px-2.5 py-1 text-[11px] text-[#5f564b]">목원</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#5f564b]">{member.household?.name ?? "미분류"}</td>
                    <td className="px-4 py-4 text-[#5f564b]">{member.statusTag}</td>
                    <td className="px-4 py-4 text-[#5f564b]">{member.phone || member.email || "-"}</td>
                    <td className="px-4 py-4 text-[#5f564b]">{formatDate(member.registeredAt)}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/app/${churchSlug}/members/${member.id}`} className="rounded-[10px] border border-[#E7E0D4] bg-white px-3 py-1.5 text-xs font-medium text-[#121212]">
                          상세 관리
                        </Link>
                        <Link href={`/app/${churchSlug}/members/${member.id}/summary`} className="rounded-[10px] border border-[#E7E0D4] bg-white px-3 py-1.5 text-xs font-medium text-[#121212]">
                          요약
                        </Link>
                      </div>
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

function priorityTone(priority: GidoFollowUpView["priority"]) {
  if (priority === "높음") return "bg-[#fff1e5] text-[#a35a11]";
  if (priority === "중간") return "bg-[#fff7e8] text-[#8c6a2e]";
  return "bg-[#f5f1ea] text-[#6d6255]";
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
