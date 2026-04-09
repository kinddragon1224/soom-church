import Link from "next/link";
import { type AppliedRecordLogItem } from "@/lib/chat-apply-log";
import { type GidoFamilyRole, getGidoFamilyRoleLabel } from "@/lib/gido-home-config";
import { GidoHouseholdView } from "@/lib/gido-workspace-data";

type Props = {
  churchSlug: string;
  households: GidoHouseholdView[];
  logs: AppliedRecordLogItem[];
  focusId?: string;
};

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

export default function GidoHouseholdsPage({ churchSlug, households, logs, focusId }: Props) {
  const householdCards = households
    .map((household) => {
      const recentLogs = logs.filter((item) => item.relatedHouseholdIds.includes(household.id)).slice(0, 4);
      const latestAt = recentLogs[0]?.appliedAt?.getTime() ?? 0;
      return {
        ...household,
        recentLogs,
        latestAt,
      };
    })
    .sort((a, b) => {
      if (b.latestAt !== a.latestAt) return b.latestAt - a.latestAt;
      const orderDiff = (a.prayerOrder ?? Number.MAX_SAFE_INTEGER) - (b.prayerOrder ?? Number.MAX_SAFE_INTEGER);
      if (orderDiff !== 0) return orderDiff;
      return a.title.localeCompare(b.title, "ko-KR");
    });

  const selectedHousehold = householdCards.find((item) => item.id === focusId) ?? householdCards[0] ?? null;
  const memberSections = selectedHousehold ? buildHouseholdMemberSections(selectedHousehold.members) : [];
  const familySummary = selectedHousehold ? summarizeHouseholdFamilyRoles(selectedHousehold.members) : null;
  const withRecentActivity = householdCards.filter((item) => item.recentLogs.length > 0).length;

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">HOUSEHOLDS</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">가정 관계 보드</h1>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">
              입력 폼 대신, 현재 가정 구조와 최근 반영 로그를 같이 본다. 관계와 기록이 실제로 어떻게 쌓였는지 확인하는 판이야.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label="가정" value={`${householdCards.length}개`} />
            <MetricCard label="최근 반영" value={`${withRecentActivity}개`} />
            <MetricCard label="관계 연결" value={`${householdCards.reduce((sum, item) => sum + item.relationships.length, 0)}건`} />
          </div>
        </div>
      </section>

      {selectedHousehold ? (
        <section className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="grid gap-4 xl:sticky xl:top-6 xl:self-start">
            <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-3 px-1 pb-3">
                <div>
                  <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">HOUSEHOLD LIST</p>
                  <p className="mt-1 text-sm font-semibold text-[#111111]">가정 선택</p>
                </div>
                <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-2.5 py-1 text-[10px] text-[#6f6256]">{householdCards.length}개</span>
              </div>

              <div className="grid gap-2">
                {householdCards.map((household) => {
                  const active = household.id === selectedHousehold.id;
                  return (
                    <Link
                      key={household.id}
                      href={`/app/${churchSlug}/households?focus=${household.id}`}
                      className={`rounded-[18px] border px-4 py-3 transition ${
                        active
                          ? "border-[#111827] bg-[#111827] text-white"
                          : "border-[#ece4d8] bg-[#fbfaf7] text-[#111111] hover:border-[#d8ccba] hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{household.title}</p>
                          <p className={`mt-1 text-[12px] ${active ? "text-white/72" : "text-[#6d6259]"}`}>
                            구성원 {household.members.length}명 · 관계 {household.relationships.length}건
                          </p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] ${active ? "bg-white/12 text-white/84" : "border border-[#e4dbc9] bg-white text-[#6f6256]"}`}>
                          로그 {household.recentLogs.length}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </aside>

          <div className="grid gap-4">
            <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">HOUSEHOLD DETAIL</p>
                  <h2 className="mt-2 text-[1.6rem] font-semibold tracking-[-0.04em] text-[#111111]">{selectedHousehold.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">가정 구조, 현재 가족 연결, 최근 반영 기록을 한곳에서 본다.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <InfoPill label="구성원" value={`${selectedHousehold.members.length}명`} />
                  <InfoPill label="가정 대표" value={familySummary?.representativeName ?? "미지정"} />
                  <InfoPill label="자녀" value={`${familySummary?.childCount ?? 0}명`} />
                  <InfoPill label="관계" value={`${selectedHousehold.relationships.length}건`} />
                  <InfoPill label="최근 반영" value={`${selectedHousehold.recentLogs.length}건`} />
                </div>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[0.94fr_1.06fr]">
              <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">MEMBERS</p>
                    <h3 className="mt-2 text-lg font-semibold text-[#111111]">현재 구성</h3>
                  </div>
                  <Link href={`/app/${churchSlug}/people`} className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">
                    People 보기
                  </Link>
                </div>

                <div className="mt-4 grid gap-4">
                  {memberSections.length === 0 ? (
                    <EmptyBox text="구성원 없음" compact />
                  ) : (
                    memberSections.map((section) => (
                      <div key={`${selectedHousehold.id}-${section.key}`} className="grid gap-2.5">
                        <div className="flex items-center justify-between gap-3 px-1">
                          <div>
                            <p className="text-[12px] font-semibold text-[#5f564b]">{section.title}</p>
                            {section.caption ? <p className="mt-1 text-[11px] text-[#8c7a5b]">{section.caption}</p> : null}
                          </div>
                          <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-2.5 py-1 text-[10px] text-[#6f6256]">{section.members.length}명</span>
                        </div>
                        {section.members.map((member) => (
                          <div key={member.id} className="rounded-[16px] border border-[#ece4d8] bg-[#fbfaf7] px-4 py-3">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <Link href={`/app/${churchSlug}/members/${member.id}`} className="text-sm font-semibold text-[#111111] hover:text-[#8C6A2E]">
                                  {member.name}
                                </Link>
                                <p className="mt-1 text-[12px] text-[#8c7a5b]">{getFamilyRoleHint(member.familyRole)}</p>
                              </div>
                              <span className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[10px] text-[#6f6256]">{getGidoFamilyRoleLabel(member.familyRole) ?? "미지정"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </article>

              <div className="grid gap-4">
                <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">RELATIONSHIPS</p>
                      <h3 className="mt-2 text-lg font-semibold text-[#111111]">현재 가족 연결</h3>
                    </div>
                    <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">{selectedHousehold.relationships.length}건</span>
                  </div>

                  <div className="mt-4 grid gap-3">
                    {selectedHousehold.relationships.length === 0 ? (
                      <EmptyBox text="아직 연결된 가족 관계가 없어" compact />
                    ) : (
                      selectedHousehold.relationships.map((relationship) => (
                        <article key={relationship.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                          <p className="text-sm font-semibold text-[#111111]">
                            {relationship.fromMemberName}
                            <span className="px-2 text-[#8c7a5b]">· {getRelationshipLabel(relationship.relationshipType, relationship.customRelationship)} ·</span>
                            {relationship.toMemberName}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[#5f564b]">{relationship.notes ?? "메모 없음"}</p>
                        </article>
                      ))
                    )}
                  </div>
                </article>

                <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
                  <div>
                    <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">RECENT APPLY LOG</p>
                    <h3 className="mt-2 text-lg font-semibold text-[#111111]">최근 반영 기록</h3>
                  </div>

                  <div className="mt-4 grid gap-3">
                    {selectedHousehold.recentLogs.length === 0 ? (
                      <EmptyBox text="이 가정에 직접 연결된 반영 로그가 아직 없어" compact />
                    ) : (
                      selectedHousehold.recentLogs.map((item) => (
                        <article key={item.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8c7a5b]">
                            <span className="rounded-full border border-[#e6dccd] bg-white px-2.5 py-1">{item.updateTypeLabel}</span>
                            <span>{formatDateTime(item.appliedAt)}</span>
                          </div>
                          <p className="mt-2 text-sm font-semibold text-[#111111]">{item.title}</p>
                          <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.body}</p>
                          <p className="mt-3 text-[12px] leading-5 text-[#8c7a5b]">원문: {item.captureText}</p>
                        </article>
                      ))
                    )}
                  </div>
                </article>

                <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
                  <div>
                    <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">HOUSEHOLD NOTES</p>
                    <h3 className="mt-2 text-lg font-semibold text-[#111111]">가정 메모</h3>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <NoteList title="중보" items={selectedHousehold.prayers} emptyText="중보 메모 없음" />
                    <NoteList title="연락" items={selectedHousehold.contacts} emptyText="연락 메모 없음" />
                  </div>
                </article>
              </div>
            </section>
          </div>
        </section>
      ) : (
        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-8 text-center shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <p className="text-base font-semibold text-[#111111]">가정 없음</p>
          <p className="mt-2 text-sm text-[#5f564b]">가정 데이터가 들어오면 여기서 관계와 기록을 함께 볼 수 있어.</p>
        </section>
      )}
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

function InfoPill({ label, value }: { label: string; value: string }) {
  return <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1.5 text-[11px] text-[#6f6256]">{label} {value}</span>;
}

function EmptyBox({ text, compact = false }: { text: string; compact?: boolean }) {
  return <div className={`rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] text-sm text-[#5f564b] ${compact ? "p-4" : "p-6"}`}>{text}</div>;
}

function NoteList({ title, items, emptyText }: { title: string; items: string[]; emptyText: string }) {
  return (
    <div className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
      <p className="text-sm font-semibold text-[#111111]">{title}</p>
      <div className="mt-3 grid gap-2">
        {items.length === 0 ? (
          <p className="text-sm text-[#6f6256]">{emptyText}</p>
        ) : (
          items.map((item, index) => (
            <div key={`${title}-${index}`} className="rounded-[14px] border border-[#ece4d8] bg-white px-3 py-2 text-sm leading-6 text-[#5f564b]">
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function buildHouseholdMemberSections(members: GidoHouseholdView["members"]) {
  const representative = members.filter((member) => member.familyRole === "SELF");
  const spouse = members.filter((member) => member.familyRole === "SPOUSE");
  const children = members.filter((member) => member.familyRole === "CHILD");
  const family = members.filter((member) => member.familyRole === "FAMILY");
  const unassigned = members.filter((member) => !member.familyRole);

  return [
    { key: "representative", title: "가정 대표", caption: "가정의 기본 기준 인물", members: representative },
    { key: "spouse", title: "배우자", caption: "대표와 함께 보는 성인 구성원", members: spouse },
    { key: "children", title: "자녀", caption: "아이와 청소년 구성원", members: children },
    { key: "family", title: "기타 가족", caption: "부모, 형제자매, 동거 가족 등", members: family },
    { key: "unassigned", title: "미지정", caption: "역할을 아직 정하지 않은 구성원", members: unassigned },
  ].filter((section) => section.members.length > 0);
}

function summarizeHouseholdFamilyRoles(members: GidoHouseholdView["members"]) {
  const representative = members.find((member) => member.familyRole === "SELF") ?? null;
  const childCount = members.filter((member) => member.familyRole === "CHILD").length;

  return {
    representativeName: representative?.name ?? null,
    childCount,
  };
}

function getFamilyRoleHint(role?: GidoFamilyRole | null) {
  if (role === "SELF") return "가정 기준 인물";
  if (role === "SPOUSE") return "대표와 함께 보는 배우자";
  if (role === "CHILD") return "자녀 / 청소년 구성원";
  if (role === "FAMILY") return "기타 가족 구성원";
  return "가정 역할을 아직 정하지 않음";
}

function getRelationshipLabel(type: string, customRelationship?: string | null) {
  if (customRelationship) return customRelationship;
  const labelMap: Record<string, string> = {
    SPOUSE: "배우자",
    PARENT: "부모",
    CHILD: "자녀",
    SIBLING: "형제자매",
    RELATIVE: "친인척",
    GUARDIAN: "보호자",
    CAREGIVER: "돌봄 담당",
  };
  return labelMap[type] ?? type;
}
