import Link from "next/link";
import { RelationshipType } from "@prisma/client";
import {
  addAttendanceRecord,
  addCareRecord,
  createFamilyLink,
  removeFamilyLink,
  restoreMember,
  softDeleteMember,
} from "./actions";
import { formatDate } from "@/lib/date";
import { getGidoLeadershipProfile } from "@/lib/gido-leadership";
import { getWorkspaceMemberRecord } from "@/lib/workspace-data";

type MemberRecord = NonNullable<Awaited<ReturnType<typeof getWorkspaceMemberRecord>>>;

type MemberOption = {
  id: string;
  name: string;
  phone: string | null;
  statusTag: string;
};

type HouseholdMeta = {
  prayers?: string[];
  contacts?: string[];
  tags?: string[];
};

const RELATIONSHIP_OPTIONS = [
  { value: RelationshipType.SPOUSE, label: "배우자" },
  { value: RelationshipType.PARENT, label: "부모" },
  { value: RelationshipType.CHILD, label: "자녀" },
  { value: RelationshipType.SIBLING, label: "형제자매" },
  { value: RelationshipType.RELATIVE, label: "친인척" },
  { value: RelationshipType.CAREGIVER, label: "돌봄 담당" },
  { value: RelationshipType.CUSTOM, label: "직접 입력" },
] as const;

function parseJson<T>(value?: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export default function GidoMemberRecord({
  churchSlug,
  member,
  memberOptions,
}: {
  churchSlug: string;
  member: MemberRecord;
  memberOptions: MemberOption[];
}) {
  const leadership = getGidoLeadershipProfile(member.name, member.household?.name);
  const familyLinks = [
    ...member.relationshipsFrom.map((item) => ({
      id: item.id,
      label: item.relationshipType,
      customRelationship: item.customRelationship,
      member: item.toMember,
      note: item.notes,
    })),
    ...member.relationshipsTo.map((item) => ({
      id: item.id,
      label: item.relationshipType,
      customRelationship: item.customRelationship,
      member: item.fromMember,
      note: item.notes,
    })),
  ];

  const attendanceRecords = member.careRecords.filter((record) => record.category === "ATTENDANCE");
  const ministryRecords = member.careRecords.filter((record) => record.category === "MINISTRY");
  const careRecords = member.careRecords.filter((record) => record.category !== "ATTENDANCE" && record.category !== "MINISTRY");
  const householdMeta = parseJson<HouseholdMeta>(member.household?.notes) ?? {};

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">G.I.D.O MEMBER</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">{member.name}</h1>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">한 사람의 상태, 후속, 가정 연결, 기도제목을 한 화면에서 관리하는 페이지야.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {leadership.tags.length > 0 ? leadership.tags.map((tag) => (
                <span key={tag} className={`rounded-full px-3 py-1.5 text-xs ${tag === "현 목자" ? "bg-[#111827] text-white" : "border border-[#e6dfd5] bg-white text-[#5f564b]"}`}>
                  {tag}
                </span>
              )) : <span className="rounded-full border border-[#e6dfd5] bg-white px-3 py-1.5 text-xs text-[#5f564b]">목원</span>}
              {member.requiresFollowUp ? <span className="rounded-full bg-[#fff4df] px-3 py-1.5 text-xs text-[#8C6A2E]">후속 필요</span> : null}
              <span className="rounded-full border border-[#e6dfd5] bg-white px-3 py-1.5 text-xs text-[#5f564b]">{member.statusTag}</span>
              {leadership.rotationTrack ? <span className="rounded-full border border-[#e6dfd5] bg-white px-3 py-1.5 text-xs text-[#5f564b]">{leadership.rotationTrack.label}</span> : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 xl:justify-end">
            <Link href={`/app/${churchSlug}/members/${member.id}/edit`} className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-2 text-sm font-medium text-[#121212]">
              기본 정보 수정
            </Link>
            <Link href={`/app/${churchSlug}/members/${member.id}/summary`} className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-2 text-sm font-medium text-[#121212]">
              요약 보기
            </Link>
            {member.isDeleted ? (
              <form action={restoreMember.bind(null, churchSlug, member.id)}>
                <button className="rounded-[14px] border border-[#d7e8dc] bg-[#eefbf3] px-4 py-2 text-sm font-semibold text-[#2d7a46]">복구</button>
              </form>
            ) : (
              <form action={softDeleteMember.bind(null, churchSlug, member.id)}>
                <button className="rounded-[14px] border border-[#f0c9c9] bg-[#fff2f2] px-4 py-2 text-sm font-semibold text-[#9a4a4a]">삭제</button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="가정" value={member.household?.name ?? "미분류"} />
          <StatCard label="가족 연결" value={`${familyLinks.length}건`} />
          <StatCard label="기록" value={`${careRecords.length}건`} />
          <StatCard label="출석" value={`${attendanceRecords.length}건`} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.98fr_1.02fr]">
        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <Header title="기본 정보" caption="사람 프로필" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoCard label="전화번호" value={member.phone ?? "-"} />
              <InfoCard label="이메일" value={member.email ?? "-"} />
              <InfoCard label="현재 역할" value={member.position ?? "미정"} />
              <InfoCard label="등록일" value={formatDate(member.registeredAt)} />
              <InfoCard label="직장" value={member.currentJob ?? "미기록"} />
              <InfoCard label="세례 / 침례" value={member.baptismStatus ?? "미기록"} />
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <Header title="후속 / 메모" caption="바로 기록" />
            <form action={addCareRecord.bind(null, churchSlug, member.id)} className="mt-4 grid gap-3 rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 sm:grid-cols-[140px_minmax(0,1fr)_140px_auto]">
              <select name="category" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]">
                <option value="VISIT">심방</option>
                <option value="COUNSEL">상담</option>
                <option value="FAMILY">가정</option>
                <option value="HEALTH">건강</option>
                <option value="JOB">직장</option>
                <option value="NOTE">메모</option>
              </select>
              <input name="title" placeholder="기록 제목" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
              <input name="happenedAt" type="date" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
              <button className="rounded-[12px] bg-[#111827] px-4 py-2 text-sm font-semibold text-white">기록 추가</button>
              <textarea name="summary" placeholder="후속 내용, 대화 요점, 다음 액션" className="sm:col-span-4 rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
            </form>

            <div className="mt-4 grid gap-3">
              {careRecords.length === 0 ? (
                <EmptyBox text="아직 기록이 없어. 후속이나 심방 메모를 남기면 여기서 바로 보여." />
              ) : (
                careRecords.slice(0, 8).map((record) => (
                  <article key={record.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#111111]">{record.title}</p>
                      <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{record.category}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#5f564b]">{record.summary ?? record.details ?? "세부 내용 없음"}</p>
                    <p className="mt-2 text-[11px] text-[#8c7a5b]">{formatDate(record.happenedAt)}</p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <Header title="가족 / 연결" caption="가정 안에서 보기" />
            <form action={createFamilyLink.bind(null, churchSlug, member.id)} className="mt-4 grid gap-3 rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 lg:grid-cols-[minmax(0,1.2fr)_180px_1fr_auto]">
              <select name="relatedMemberId" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" defaultValue="">
                <option value="">연결할 목원 선택</option>
                {memberOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.name} · {option.phone ?? option.statusTag}</option>
                ))}
              </select>
              <select name="relationshipType" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" defaultValue={RelationshipType.SPOUSE}>
                {RELATIONSHIP_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <input name="customRelationship" placeholder="직접 관계명" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
              <button className="rounded-[12px] bg-[#111827] px-4 py-2 text-sm font-semibold text-white">연결</button>
              <textarea name="notes" placeholder="메모" className="lg:col-span-4 rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
            </form>

            <div className="mt-4 grid gap-3">
              {familyLinks.length === 0 ? (
                <EmptyBox text="아직 연결된 가족 정보가 없어." />
              ) : (
                familyLinks.map((item) => (
                  <article key={item.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/app/${churchSlug}/members/${item.member.id}`} className="text-sm font-semibold text-[#111111] hover:underline">
                          {item.member.name}
                        </Link>
                        <p className="mt-1 text-xs text-[#8c7a5b]">관계 · {item.customRelationship ?? item.label}</p>
                        <p className="mt-2 text-sm text-[#5f564b]">{item.note ?? item.member.phone ?? item.member.email ?? "메모 없음"}</p>
                      </div>
                      <form action={removeFamilyLink.bind(null, churchSlug, member.id)}>
                        <input type="hidden" name="relationshipId" value={item.id} />
                        <button className="rounded-[12px] border border-[#f0c9c9] bg-white px-3 py-2 text-xs font-semibold text-[#9a4a4a]">해제</button>
                      </form>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <Header title="가정별 중보" caption="같이 챙길 것" />
            <div className="mt-4 grid gap-3">
              <InfoCard label="가정 이름" value={member.household?.name ?? "미분류"} />
              <InfoCard label="교구 / 목장" value={`${member.district?.name ?? "미정"} / ${member.group?.name ?? "미정"}`} />
            </div>

            {householdMeta.tags?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {householdMeta.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#6f6256]">{tag}</span>
                ))}
              </div>
            ) : null}

            <div className="mt-4 grid gap-3">
              {householdMeta.prayers?.length ? (
                <article className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <p className="text-sm font-semibold text-[#111111]">기도제목</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[#5f564b]">
                    {householdMeta.prayers.map((prayer) => (
                      <li key={prayer} className="flex gap-2">
                        <span className="mt-[8px] h-1.5 w-1.5 rounded-full bg-[#2d6d46]" />
                        <span>{prayer}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ) : null}

              {householdMeta.contacts?.length ? (
                <article className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <p className="text-sm font-semibold text-[#111111]">연락 메모</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {householdMeta.contacts.map((contact) => (
                      <span key={contact} className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#6f6256]">{contact}</span>
                    ))}
                  </div>
                </article>
              ) : null}

              {!householdMeta.prayers?.length && !householdMeta.contacts?.length ? <EmptyBox text="가정 메타 정보가 아직 없어." /> : null}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <Header title="출석 관리" caption="예배와 모임" />
            <form action={addAttendanceRecord.bind(null, churchSlug, member.id)} className="mt-4 grid gap-3 rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 sm:grid-cols-[160px_140px_minmax(0,1fr)_140px_auto]">
              <select name="attendanceType" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]">
                <option value="주일예배">주일예배</option>
                <option value="수요예배">수요예배</option>
                <option value="금요기도회">금요기도회</option>
                <option value="새벽기도">새벽기도</option>
                <option value="목장모임">목장모임</option>
              </select>
              <select name="attendanceStatus" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]">
                <option value="출석">출석</option>
                <option value="지각">지각</option>
                <option value="결석">결석</option>
                <option value="온라인">온라인</option>
              </select>
              <input name="summary" placeholder="간단 메모" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
              <input name="happenedAt" type="date" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
              <button className="rounded-[12px] bg-[#111827] px-4 py-2 text-sm font-semibold text-white">추가</button>
            </form>

            <div className="mt-4 grid gap-3">
              {attendanceRecords.length === 0 ? (
                <EmptyBox text="아직 출석 기록이 없어." />
              ) : (
                attendanceRecords.slice(0, 8).map((record) => (
                  <article key={record.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#111111]">{record.title}</p>
                      <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">출석</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#5f564b]">{record.summary ?? "메모 없음"}</p>
                    <p className="mt-2 text-[11px] text-[#8c7a5b]">{formatDate(record.happenedAt)}</p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <Header title="삶 상태 / 사역" caption="깊은 관리" />
            <div className="grid gap-3">
              {member.lifeStatuses.length > 0 ? (
                member.lifeStatuses.slice(0, 5).map((status) => (
                  <article key={status.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#111111]">{status.title}</p>
                      <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{status.type}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#5f564b]">{status.summary ?? status.details ?? "세부 내용 없음"}</p>
                  </article>
                ))
              ) : (
                <EmptyBox text="삶 상태 기록이 아직 없어." />
              )}

              {ministryRecords.length > 0 ? (
                ministryRecords.slice(0, 3).map((record) => (
                  <article key={record.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#111111]">{record.title}</p>
                      <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">사역</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#5f564b]">{record.summary ?? "메모 없음"}</p>
                  </article>
                ))
              ) : null}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function Header({ title, caption }: { title: string; caption?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-[#111111]">{title}</h2>
        {caption ? <p className="mt-1 text-xs text-[#8C7A5B]">{caption}</p> : null}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
      <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{label}</p>
      <p className="mt-2 text-base font-semibold text-[#111111]">{value}</p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
      <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{label}</p>
      <p className="mt-2 text-sm font-medium text-[#111111]">{value}</p>
    </div>
  );
}

function EmptyBox({ text }: { text: string }) {
  return <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">{text}</div>;
}
