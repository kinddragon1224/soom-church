import Link from "next/link";
import { District, Group, Household, Member } from "@prisma/client";
import { GidoHouseholdView } from "@/lib/gido-workspace-data";
import { getGidoLeadershipProfile } from "@/lib/gido-leadership";

type GidoMemberRow = Member & {
  district: District | null;
  group: Group | null;
  household: Household | null;
};

export default function GidoHouseholdsPage({
  churchSlug,
  households,
  members,
  q = "",
  focus = "all",
}: {
  churchSlug: string;
  households: GidoHouseholdView[];
  members: GidoMemberRow[];
  q?: string;
  focus?: string;
}) {
  const query = q.trim().toLowerCase();

  const memberIndex = new Map(
    members.map((member) => [`${member.household?.name ?? ""}::${member.name}`, member]),
  );

  const decoratedHouseholds = households.map((household) => {
    const matchedMembers = household.members
      .map((member) => memberIndex.get(`${household.title}::${member.name}`))
      .filter(Boolean) as GidoMemberRow[];

    const leadershipProfiles = matchedMembers.map((member) => getGidoLeadershipProfile(member.name, member.household?.name));
    const hasActiveLeader = leadershipProfiles.some((profile) => profile.isActiveLeader);
    const hasRotationTrack = leadershipProfiles.some((profile) => profile.isRotationHousehold);
    const leadershipBadges = Array.from(
      new Set(leadershipProfiles.flatMap((profile) => profile.tags).filter(Boolean)),
    );

    return {
      ...household,
      matchedMembers,
      hasActiveLeader,
      hasRotationTrack,
      leadershipBadges,
    };
  });

  const filteredHouseholds = decoratedHouseholds.filter((household) => {
    const matchesQuery =
      !query ||
      [
        household.title,
        household.tags.join(" "),
        household.prayers.join(" "),
        household.contacts.join(" "),
        household.members.map((member) => member.name).join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

    const matchesFocus =
      focus === "rotation"
        ? household.hasRotationTrack
        : focus === "leaders"
          ? household.hasActiveLeader
          : focus === "prayer"
            ? household.prayers.length > 0
            : focus === "contact"
              ? household.contacts.length > 0
              : true;

    return matchesQuery && matchesFocus;
  });

  const focusItems = [
    { key: "all", label: "전체", value: decoratedHouseholds.length },
    { key: "rotation", label: "순환 진행", value: decoratedHouseholds.filter((household) => household.hasRotationTrack).length },
    { key: "leaders", label: "현 목자", value: decoratedHouseholds.filter((household) => household.hasActiveLeader).length },
    { key: "prayer", label: "기도제목", value: decoratedHouseholds.filter((household) => household.prayers.length > 0).length },
    { key: "contact", label: "연락 메모", value: decoratedHouseholds.filter((household) => household.contacts.length > 0).length },
  ];

  const qParam = q ? `&q=${encodeURIComponent(q)}` : "";

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">G.I.D.O HOUSEHOLDS</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">가정별 중보</h1>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">가정 단위로 기도제목, 연락 메모, 순환 진행 구별을 함께 본다.</p>
          </div>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            <Link href={`/app/${churchSlug}/followups`} className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-2 text-sm font-medium text-[#121212]">
              후속 관리
            </Link>
            <Link href={`/app/${churchSlug}/members`} className="rounded-[14px] bg-[#111827] px-4 py-2 text-sm font-semibold text-white">
              목원 보기
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
          <form className="rounded-[22px] border border-[#ece4d8] bg-[#fbfaf7] p-4" method="get">
            <input type="hidden" name="focus" value={focus} />
            <label className="grid gap-3">
              <span className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">SEARCH HOUSEHOLD</span>
              <div className="flex items-center gap-3 rounded-[16px] border border-[#e7dfd3] bg-white px-4 py-3">
                <span className="text-sm text-[#8c7a5b]">⌕</span>
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="가정 이름, 목원, 기도제목으로 찾기"
                  className="w-full bg-transparent text-sm text-[#111111] outline-none placeholder:text-[#a89c8f]"
                />
              </div>
            </label>
          </form>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="가정" value={`${decoratedHouseholds.length}가정`} />
            <MetricCard label="기도제목" value={`${decoratedHouseholds.reduce((sum, household) => sum + household.prayers.length, 0)}개`} />
            <MetricCard label="연락 메모" value={`${decoratedHouseholds.reduce((sum, household) => sum + household.contacts.length, 0)}개`} />
            <MetricCard label="순환 진행" value={`${decoratedHouseholds.filter((household) => household.hasRotationTrack).length}가정`} />
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-3 border-b border-[#efe7da] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#111111]">가정 목록</p>
            <p className="mt-1 text-xs text-[#8C7A5B]">{filteredHouseholds.length}가정 표시</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {focusItems.map((item) => (
              <Link
                key={item.key}
                href={`?focus=${item.key}${qParam}`}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  focus === item.key ? "bg-[#111827] text-white" : "border border-[#E7E0D4] bg-white text-[#5f564b]"
                }`}
              >
                {item.label} {item.value}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-2">
          {filteredHouseholds.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b] lg:col-span-2">조건에 맞는 가정이 없어.</div>
          ) : (
            filteredHouseholds.map((household) => (
              <article key={household.id} className="rounded-[22px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-[#111111]">{household.title}</p>
                  {household.leadershipBadges.map((badge) => (
                    <span key={`${household.id}-${badge}`} className={`rounded-full px-2.5 py-1 text-[11px] ${badge === "현 목자" ? "bg-[#111827] text-white" : "border border-[#e4dbc9] bg-white text-[#5f564b]"}`}>
                      {badge}
                    </span>
                  ))}
                  {household.tags.map((tag) => (
                    <span key={`${household.id}-${tag}`} className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {household.members.map((member) => {
                    const linkedMember = memberIndex.get(`${household.title}::${member.name}`);
                    return linkedMember ? (
                      <Link
                        key={`${household.id}-${member.name}`}
                        href={`/app/${churchSlug}/members/${linkedMember.id}`}
                        className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#5f564b]"
                      >
                        {member.name} · {member.birthLabel}
                      </Link>
                    ) : (
                      <span key={`${household.id}-${member.name}`} className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#5f564b]">
                        {member.name} · {member.birthLabel}
                      </span>
                    );
                  })}
                </div>

                <div className="mt-4 grid gap-3">
                  <Block title="기도제목" items={household.prayers} emptyText="아직 기도제목이 없어." bulletColor="bg-[#2d6d46]" />
                  <Block title="연락 메모" items={household.contacts} emptyText="연락 메모가 없어." bulletColor="bg-[#8C6A2E]" />
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#ece4d8] bg-white p-4">
      <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[#111111]">{value}</p>
    </div>
  );
}

function Block({
  title,
  items,
  emptyText,
  bulletColor,
}: {
  title: string;
  items: string[];
  emptyText: string;
  bulletColor: string;
}) {
  return (
    <section className="rounded-[18px] border border-[#ede6d8] bg-white p-4">
      <p className="text-sm font-semibold text-[#111111]">{title}</p>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-[#5f564b]">{emptyText}</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm leading-6 text-[#5f564b]">
          {items.map((item) => (
            <li key={`${title}-${item}`} className="flex gap-2">
              <span className={`mt-[8px] h-1.5 w-1.5 rounded-full ${bulletColor}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
