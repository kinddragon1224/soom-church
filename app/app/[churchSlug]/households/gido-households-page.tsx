import Link from "next/link";
import { getGidoFamilyRoleLabel } from "@/lib/gido-home-config";
import { GidoHouseholdView } from "@/lib/gido-workspace-data";
import { createGidoHouseholdChild, updateGidoHouseholdSettings } from "./actions";

type Props = {
  churchSlug: string;
  households: GidoHouseholdView[];
  focusId?: string;
};

export default function GidoHouseholdsPage({ churchSlug, households, focusId }: Props) {
  const sortedHouseholds = [...households].sort((a, b) => {
    const orderDiff = (a.prayerOrder ?? Number.MAX_SAFE_INTEGER) - (b.prayerOrder ?? Number.MAX_SAFE_INTEGER);
    if (orderDiff !== 0) return orderDiff;
    return a.title.localeCompare(b.title, "ko-KR");
  });

  const selectedHousehold = sortedHouseholds.find((household) => household.id === focusId) ?? sortedHouseholds[0] ?? null;
  const returnPath = selectedHousehold ? `/app/${churchSlug}/households?focus=${selectedHousehold.id}` : `/app/${churchSlug}/households`;
  const memberSections = selectedHousehold ? buildHouseholdMemberSections(selectedHousehold.members) : [];
  const availableParentOptions = selectedHousehold
    ? (() => {
        const parents = selectedHousehold.members.filter((member) => member.familyRole !== "CHILD");
        return parents.length > 0 ? parents : selectedHousehold.members;
      })()
    : [];

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">G.I.D.O HOUSEHOLDS</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">가정</h1>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">가정 목록과 선택한 가정 상세 관리</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label="가정" value={`${households.length}개`} />
            <MetricCard label="중보 설정" value={`${sortedHouseholds.filter((household) => household.prayers.length > 0).length}개`} />
            <MetricCard label="순서 설정" value={`${sortedHouseholds.filter((household) => typeof household.prayerOrder === "number").length}개`} />
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
                <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-2.5 py-1 text-[10px] text-[#6f6256]">{sortedHouseholds.length}개</span>
              </div>

              <div className="grid gap-2">
                {sortedHouseholds.map((household) => {
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
                          <p className={`mt-1 text-[12px] ${active ? "text-white/72" : "text-[#6d6259]"}`}>구성원 {household.members.length}명</p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] ${active ? "bg-white/12 text-white/84" : "border border-[#e4dbc9] bg-white text-[#6f6256]"}`}>
                          {typeof household.prayerOrder === "number" ? household.prayerOrder : "-"}
                        </span>
                      </div>
                      <div className={`mt-3 flex flex-wrap gap-2 text-[10px] ${active ? "text-white/72" : "text-[#8c7a5b]"}`}>
                        <span>중보 {household.prayers.length}</span>
                        <span>연락 {household.contacts.length}</span>
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
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">구성원, 중보, 연락 메모, 순서 설정</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <InfoPill label="구성원" value={`${selectedHousehold.members.length}명`} />
                  <InfoPill label="중보" value={`${selectedHousehold.prayers.length}개`} />
                  <InfoPill label="연락" value={`${selectedHousehold.contacts.length}개`} />
                  <InfoPill label="순서" value={typeof selectedHousehold.prayerOrder === "number" ? `${selectedHousehold.prayerOrder}` : "미설정"} />
                </div>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
              <div className="grid gap-4">
                <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">MEMBERS</p>
                      <h3 className="mt-2 text-lg font-semibold text-[#111111]">구성원</h3>
                    </div>
                    <Link href={`/app/${churchSlug}/members`} className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">
                      목원 관리
                    </Link>
                  </div>

                  <div className="mt-4 grid gap-4">
                    {selectedHousehold.members.length === 0 ? (
                      <EmptyBox text="구성원 없음" compact />
                    ) : (
                      memberSections.map((section) => (
                        <div key={`${selectedHousehold.id}-${section.key}`} className="grid gap-2.5">
                          <div className="flex items-center justify-between gap-3 px-1">
                            <p className="text-[12px] font-semibold text-[#5f564b]">{section.title}</p>
                            <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-2.5 py-1 text-[10px] text-[#6f6256]">{section.members.length}명</span>
                          </div>
                          {section.members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between rounded-[16px] border border-[#ece4d8] bg-[#fbfaf7] px-4 py-3">
                              <div>
                                <Link href={`/app/${churchSlug}/members/${member.id}`} className="text-sm font-semibold text-[#111111] hover:text-[#8C6A2E]">
                                  {member.name}
                                </Link>
                              </div>
                              <span className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[10px] text-[#6f6256]">{getGidoFamilyRoleLabel(member.familyRole) ?? "구성원"}</span>
                            </div>
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                </article>

                <form action={createGidoHouseholdChild.bind(null, churchSlug, returnPath)} className="grid gap-4 rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
                  <input type="hidden" name="householdId" value={selectedHousehold.id} />

                  <div>
                    <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">CHILD ADD</p>
                    <h3 className="mt-2 text-lg font-semibold text-[#111111]">아이 추가</h3>
                    <p className="mt-2 text-sm leading-6 text-[#5f564b]">가정 안에서 바로 아이를 등록하고, 나머지는 상세 화면에서 이어서 수정.</p>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_150px_minmax(0,1fr)_auto]">
                    <label className="grid gap-2">
                      <span className="text-[12px] font-medium text-[#5f564b]">이름</span>
                      <input name="name" required placeholder="아이 이름" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[12px] font-medium text-[#5f564b]">생년월일</span>
                      <input name="birthDate" type="date" required className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[12px] font-medium text-[#5f564b]">성별</span>
                      <select name="gender" defaultValue="OTHER" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]">
                        <option value="OTHER">미지정</option>
                        <option value="MALE">남성</option>
                        <option value="FEMALE">여성</option>
                      </select>
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[12px] font-medium text-[#5f564b]">부모 연결</span>
                      <select name="parentMemberId" defaultValue="" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]">
                        <option value="">선택 안함</option>
                        {availableParentOptions.map((member) => (
                          <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                      </select>
                    </label>
                    <div className="flex items-end">
                      <button className="h-[42px] rounded-[12px] bg-[#111827] px-4 text-sm font-semibold text-white">추가</button>
                    </div>
                  </div>
                </form>
              </div>

              <form action={updateGidoHouseholdSettings.bind(null, churchSlug, returnPath)} className="grid gap-4 rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
                <input type="hidden" name="householdId" value={selectedHousehold.id} />

                <div>
                  <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">SETTINGS</p>
                  <h3 className="mt-2 text-lg font-semibold text-[#111111]">가정 설정</h3>
                </div>

                <label className="grid gap-2">
                  <span className="text-[12px] font-medium text-[#5f564b]">중보 순서</span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    name="prayerOrder"
                    defaultValue={typeof selectedHousehold.prayerOrder === "number" ? selectedHousehold.prayerOrder : ""}
                    placeholder="예: 1"
                    className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-[12px] font-medium text-[#5f564b]">중보 기도</span>
                  <textarea
                    name="prayers"
                    defaultValue={selectedHousehold.prayers.join("\n")}
                    placeholder="한 줄에 하나씩 입력"
                    className="min-h-[140px] rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-[12px] font-medium text-[#5f564b]">연락 메모</span>
                  <textarea
                    name="contacts"
                    defaultValue={selectedHousehold.contacts.join("\n")}
                    placeholder="한 줄에 하나씩 입력"
                    className="min-h-[120px] rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]"
                  />
                </label>

                <div className="flex justify-end">
                  <button className="rounded-[12px] bg-[#111827] px-4 py-2 text-sm font-semibold text-white">저장</button>
                </div>
              </form>
            </section>
          </div>
        </section>
      ) : (
        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-8 text-center shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <p className="text-base font-semibold text-[#111111]">가정 없음</p>
          <p className="mt-2 text-sm text-[#5f564b]">가정 데이터가 들어오면 여기서 편집할 수 있어.</p>
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
  return (
    <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1.5 text-[11px] text-[#6f6256]">
      {label} {value}
    </span>
  );
}

function EmptyBox({ text, compact = false }: { text: string; compact?: boolean }) {
  return <div className={`rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] text-sm text-[#5f564b] ${compact ? "p-4" : "p-6"}`}>{text}</div>;
}

function buildHouseholdMemberSections(members: GidoHouseholdView["members"]) {
  const adults = members.filter((member) => member.familyRole === "SELF" || member.familyRole === "SPOUSE" || !member.familyRole);
  const children = members.filter((member) => member.familyRole === "CHILD");
  const families = members.filter((member) => member.familyRole === "FAMILY");

  return [
    { key: "adults", title: "성인", members: adults },
    { key: "children", title: "자녀", members: children },
    { key: "families", title: "기타 가족", members: families },
  ].filter((section) => section.members.length > 0);
}
