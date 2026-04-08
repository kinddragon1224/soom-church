import Link from "next/link";
import { notFound } from "next/navigation";
import { MemberOrgRole, RelationshipType } from "@prisma/client";
import {
  addAttendanceRecord,
  addCareRecord,
  addMinistryRecord,
  addOrganizationMembership,
  createFamilyLink,
  removeFamilyLink,
  removeOrganizationMembership,
  restoreMember,
  softDeleteMember,
  updateFamilyLink,
  updateOrganizationMembership,
} from "../actions";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { formatDate } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { buildGidoMembersView } from "@/lib/gido-members-view";
import { getWorkspaceMemberRecord, getWorkspaceMembers } from "@/lib/workspace-data";
import GidoMemberRecord from "../gido-member-record";

const RELATIONSHIP_OPTIONS = [
  { value: RelationshipType.SPOUSE, label: "배우자" },
  { value: RelationshipType.PARENT, label: "부모" },
  { value: RelationshipType.CHILD, label: "자녀" },
  { value: RelationshipType.SIBLING, label: "형제자매" },
  { value: RelationshipType.GRANDPARENT, label: "조부모" },
  { value: RelationshipType.GRANDCHILD, label: "손주" },
  { value: RelationshipType.GUARDIAN, label: "보호자" },
  { value: RelationshipType.RELATIVE, label: "친인척" },
  { value: RelationshipType.CAREGIVER, label: "돌봄 담당" },
  { value: RelationshipType.CUSTOM, label: "직접 입력" },
] as const;

const MEMBER_ORG_ROLE_OPTIONS = [
  { value: MemberOrgRole.MEMBER, label: "구성원" },
  { value: MemberOrgRole.LEAD, label: "리더" },
  { value: MemberOrgRole.ASSISTANT_LEAD, label: "부리더" },
  { value: MemberOrgRole.PASTOR, label: "담당 사역자" },
  { value: MemberOrgRole.STAFF, label: "스태프" },
  { value: MemberOrgRole.VOLUNTEER, label: "봉사자" },
  { value: MemberOrgRole.TEACHER, label: "교사" },
  { value: MemberOrgRole.CUSTOM, label: "직접 입력" },
] as const;

const GIDO_QUEUE_LABELS = {
  all: "전체 목록",
  priority: "운영 우선 큐",
  leaders: "현 목자 목록",
  rotation: "순환 진행 목록",
  followup: "후속 필요 목록",
} as const;

function buildGidoMemberHref(churchSlug: string, memberId: string, filter?: string, q?: string) {
  const params = new URLSearchParams();
  params.set("filter", filter || "all");
  if (q) params.set("q", q);
  return `/app/${churchSlug}/members/${memberId}?${params.toString()}`;
}

function getGidoQueueDescription(filter: keyof typeof GIDO_QUEUE_LABELS, q: string | undefined, reasonBody: string) {
  if (q) return `검색 결과 안에서 이어서 볼 수 있어. ${reasonBody}`;
  if (filter === "priority") return reasonBody;
  if (filter === "leaders") return "현 목자 흐름을 이어서 보면서 바로 다음 리더까지 넘길 수 있어.";
  if (filter === "rotation") return "올해 순환 진행 가정을 한 흐름으로 이어서 확인하면 돼.";
  if (filter === "followup") return "후속 필요한 사람만 이어서 보면서 연락과 메모를 정리하면 돼.";
  return "지금 보고 있는 목록 기준으로 앞뒤 사람을 바로 넘길 수 있어.";
}

export default async function ChurchMemberRecordPage({
  params,
  searchParams,
}: {
  params: { churchSlug: string; id: string };
  searchParams?: { filter?: string; q?: string };
}) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) notFound();

  const church = membership.church;
  const [member, memberOptions] = await Promise.all([
    getWorkspaceMemberRecord(church.id, params.id),
    prisma.member.findMany({
      where: { churchId: church.id, isDeleted: false, NOT: { id: params.id } },
      select: { id: true, name: true, phone: true, statusTag: true },
      orderBy: { name: "asc" },
      take: 200,
    }),
  ]);
  if (!member) notFound();

  if (church.slug === "gido") {
    const shouldShowQueue = Boolean(searchParams?.filter || searchParams?.q);
    let queueContext: {
      label: string;
      helper: string;
      index: number;
      total: number;
      listHref: string;
      prev?: { href: string; name: string };
      next?: { href: string; name: string };
    } | undefined;

    if (shouldShowQueue) {
      const queueMembers = await getWorkspaceMembers(church.id);
      const queueView = buildGidoMembersView(queueMembers, {
        filter: searchParams?.filter,
        q: searchParams?.q,
      });
      const currentIndex = queueView.filteredMembers.findIndex((item) => item.id === member.id);
      const currentMember = currentIndex >= 0 ? queueView.filteredMembers[currentIndex] : null;
      const prevMember = currentIndex > 0 ? queueView.filteredMembers[currentIndex - 1] : null;
      const nextMember = currentIndex >= 0 && currentIndex < queueView.filteredMembers.length - 1 ? queueView.filteredMembers[currentIndex + 1] : null;
      const filter = queueView.filter;
      const trimmedQuery = searchParams?.q?.trim() || undefined;

      if (currentMember) {
        queueContext = {
          label: `${GIDO_QUEUE_LABELS[filter]}${trimmedQuery ? " · 검색 결과" : ""}`,
          helper: getGidoQueueDescription(filter, trimmedQuery, currentMember.priorityReason.body),
          index: currentIndex + 1,
          total: queueView.filteredMembers.length,
          listHref: `/app/${church.slug}/members?filter=${filter}${trimmedQuery ? `&q=${encodeURIComponent(trimmedQuery)}` : ""}`,
          prev: prevMember
            ? {
                href: buildGidoMemberHref(church.slug, prevMember.id, filter, trimmedQuery),
                name: prevMember.name,
              }
            : undefined,
          next: nextMember
            ? {
                href: buildGidoMemberHref(church.slug, nextMember.id, filter, trimmedQuery),
                name: nextMember.name,
              }
            : undefined,
        };
      }
    }

    return <GidoMemberRecord churchSlug={church.slug} member={member} memberOptions={memberOptions} queueContext={queueContext} />;
  }

  const organizationOptions = await prisma.organizationUnit.findMany({
    where: { churchId: church.id },
    select: { id: true, name: true, type: true },
    orderBy: [{ type: "asc" }, { name: "asc" }],
    take: 200,
  });

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
  const generalCareRecords = member.careRecords.filter(
    (record) => record.category !== "ATTENDANCE" && record.category !== "MINISTRY",
  );

  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.2em] text-white/46">MEMBER RECORD</p>
              <h1 className="mt-3 text-[2.2rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white">{member.name}</h1>
              <p className="mt-3 text-sm text-white/68">사역자가 사람 한 명을 깊게 파악하고 바로 기록·연결을 갱신하는 메인 레코드 화면</p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">{member.position ?? "직분 미정"}</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">{member.statusTag}</span>
              {member.requiresFollowUp ? <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/12 px-3 py-1.5 text-xs text-[#f1dfb2]">후속 연락 필요</span> : null}
              {member.isDeleted ? <span className="rounded-full border border-[#f0c9c9] bg-[#fff2f2] px-3 py-1.5 text-xs text-[#9a4a4a]">삭제됨</span> : null}
              <Link href={`/app/${church.slug}/members/${member.id}/edit`} className="rounded-[12px] border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-medium text-white">수정</Link>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">소속</p>
              <p className="mt-2 text-sm font-semibold">{member.district?.name ?? "교구 미정"}</p>
              <p className="mt-1 text-xs text-white/60">{member.group?.name ?? "목장 미정"}</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">가족 연결</p>
              <p className="mt-2 text-sm font-semibold">{familyLinks.length}건</p>
              <p className="mt-1 text-xs text-white/60">가족 링크 / 관계</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">출석 기록</p>
              <p className="mt-2 text-sm font-semibold">{attendanceRecords.length}건</p>
              <p className="mt-1 text-xs text-white/60">예배 · 모임 참석</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">사역 기록</p>
              <p className="mt-2 text-sm font-semibold">{ministryRecords.length}건</p>
              <p className="mt-1 text-xs text-white/60">봉사 · 섬김 이력</p>
            </div>
          </div>
        </div>

        <section className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">QUICK INFO</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">핵심 정보</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">record</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {member.isDeleted ? (
              <form action={restoreMember.bind(null, church.slug, member.id)}>
                <button className="rounded-[14px] border border-[#d7e8dc] bg-[#eefbf3] px-4 py-2 text-sm font-semibold text-[#2d7a46]">복구</button>
              </form>
            ) : (
              <form action={softDeleteMember.bind(null, church.slug, member.id)}>
                <button className="rounded-[14px] border border-[#f0c9c9] bg-[#fff2f2] px-4 py-2 text-sm font-semibold text-[#9a4a4a]">삭제</button>
              </form>
            )}
          </div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-[18px] border border-[#ece6dc] bg-white p-4 text-sm text-[#111111]">전화번호 · {member.phone ?? "-"}</div>
            <div className="rounded-[18px] border border-[#ece6dc] bg-white p-4 text-sm text-[#111111]">이메일 · {member.email ?? "-"}</div>
            <div className="rounded-[18px] border border-[#ece6dc] bg-white p-4 text-sm text-[#111111]">현재 직업 · {member.currentJob ?? "미기록"}</div>
            <div className="rounded-[18px] border border-[#ece6dc] bg-white p-4 text-sm text-[#111111]">이전 교회/신앙 · {member.previousChurch ?? member.previousFaith ?? "미기록"}</div>
            <div className="rounded-[18px] border border-[#ece6dc] bg-white p-4 text-sm text-[#111111]">침례/세례 · {member.baptismStatus ?? "미기록"}</div>
          </div>
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">FAMILY LINKS</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">가족 연결</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">생성 · 수정 · 제거</span>
            </div>
            <form action={createFamilyLink.bind(null, church.slug, member.id)} className="mt-4 grid gap-3 rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 lg:grid-cols-[minmax(0,1.2fr)_180px_1fr_auto]">
              <select name="relatedMemberId" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" defaultValue="">
                <option value="">가족으로 연결할 성도 선택</option>
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
              <button className="rounded-[12px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">가족 추가</button>
              <textarea name="notes" placeholder="메모 / 특이사항" className="lg:col-span-4 rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
            </form>
            <div className="mt-4 grid gap-3">
              {familyLinks.length === 0 ? (
                <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">아직 연결된 가족 정보가 없어.</div>
              ) : (
                familyLinks.map((item) => (
                  <div key={item.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/app/${church.slug}/members/${item.member.id}`} className="text-sm font-semibold text-[#111111] underline-offset-4 hover:underline">{item.member.name}</Link>
                        <p className="mt-1 text-xs text-[#8c7a5b]">관계 · {item.customRelationship ?? item.label}</p>
                        <p className="mt-2 text-sm text-[#5f564b]">{item.member.phone ?? item.member.email ?? "연락처 없음"}</p>
                      </div>
                      <form action={removeFamilyLink.bind(null, church.slug, member.id)}>
                        <input type="hidden" name="relationshipId" value={item.id} />
                        <button className="rounded-[12px] border border-[#f0c9c9] bg-white px-3 py-2 text-xs font-semibold text-[#9a4a4a]">연결 해제</button>
                      </form>
                    </div>
                    <form action={updateFamilyLink.bind(null, church.slug, member.id)} className="mt-3 grid gap-3 lg:grid-cols-[180px_1fr_auto]">
                      <input type="hidden" name="relationshipId" value={item.id} />
                      <select name="relationshipType" defaultValue={item.label} className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]">
                        {RELATIONSHIP_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <input name="customRelationship" defaultValue={item.customRelationship ?? ""} placeholder="직접 관계명" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
                      <button className="rounded-[12px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">관계 저장</button>
                      <textarea name="notes" defaultValue={item.note ?? ""} placeholder="메모" className="lg:col-span-3 rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
                    </form>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">ATTENDANCE LOG</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">출석 기록</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">예배 · 모임</span>
            </div>
            <form action={addAttendanceRecord.bind(null, church.slug, member.id)} className="mt-4 grid gap-3 rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 sm:grid-cols-[160px_140px_minmax(0,1fr)_140px_auto]">
              <select name="attendanceType" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]">
                <option value="주일예배">주일예배</option>
                <option value="수요예배">수요예배</option>
                <option value="금요기도회">금요기도회</option>
                <option value="새벽기도">새벽기도</option>
                <option value="목장모임">목장모임</option>
                <option value="교육부 모임">교육부 모임</option>
              </select>
              <select name="attendanceStatus" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]">
                <option value="출석">출석</option>
                <option value="지각">지각</option>
                <option value="결석">결석</option>
                <option value="온라인">온라인</option>
                <option value="방문">방문</option>
              </select>
              <input name="summary" placeholder="간단 메모" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
              <input name="happenedAt" type="date" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
              <button className="rounded-[12px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">출석 기록</button>
            </form>
            <div className="mt-4 grid gap-3">
              {attendanceRecords.length === 0 ? (
                <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">아직 출석 기록이 없어. 예배와 모임 참석 흐름부터 쌓자.</div>
              ) : (
                attendanceRecords.map((record) => (
                  <div key={record.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#111111]">{record.title}</p>
                      <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">출석</span>
                    </div>
                    <p className="mt-2 text-sm text-[#5f564b]">{record.summary ?? "메모 없음"}</p>
                    <p className="mt-2 text-[11px] text-[#8c7a5b]">{formatDate(record.happenedAt)}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">MINISTRY LOG</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">사역 · 봉사 기록</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">역할 · 투입 이력</span>
            </div>
            <form action={addMinistryRecord.bind(null, church.slug, member.id)} className="mt-4 grid gap-3 rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 sm:grid-cols-[minmax(0,1fr)_180px_140px_auto]">
              <input name="ministryName" placeholder="예: 2부 찬양팀, 유치부, 새가족팀" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
              <input name="ministryRole" placeholder="예: 리더, 교사, 봉사" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
              <input name="happenedAt" type="date" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
              <button className="rounded-[12px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">사역 기록</button>
              <textarea name="summary" placeholder="맡은 역할, 후속 메모, 평가" className="sm:col-span-4 rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
            </form>
            <div className="mt-4 grid gap-3">
              {ministryRecords.length === 0 ? (
                <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">아직 사역 기록이 없어. 실제 섬김 이력을 계속 쌓을 수 있게 해두자.</div>
              ) : (
                ministryRecords.map((record) => (
                  <div key={record.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#111111]">{record.title}</p>
                      <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">사역</span>
                    </div>
                    <p className="mt-2 text-sm text-[#5f564b]">{record.summary ?? "메모 없음"}</p>
                    <p className="mt-2 text-[11px] text-[#8c7a5b]">{formatDate(record.happenedAt)}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">LIFE STATUS</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">가정 · 삶의 상태</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">건강 · 재정 · 직장 · 결혼</span>
            </div>
            <div className="mt-4 grid gap-3">
              {member.lifeStatuses.length === 0 ? (
                <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">아직 기록된 삶의 상태가 없어.</div>
              ) : (
                member.lifeStatuses.map((status) => (
                  <div key={status.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#111111]">{status.title}</p>
                      <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{status.type}</span>
                    </div>
                    <p className="mt-2 text-sm text-[#5f564b]">{status.summary ?? status.details ?? "세부 내용 없음"}</p>
                    <p className="mt-2 text-[11px] text-[#8c7a5b]">{status.happenedAt ? formatDate(status.happenedAt) : "날짜 미정"}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">CARE LOG</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">심방 · 상담 · 메모</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">최신 순</span>
            </div>
            <form action={addCareRecord.bind(null, church.slug, member.id)} className="mt-4 grid gap-3 rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 sm:grid-cols-[140px_minmax(0,1fr)_140px_auto]">
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
              <button className="rounded-[12px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">기록 추가</button>
              <textarea name="summary" placeholder="간단 메모" className="sm:col-span-4 rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
            </form>
            <div className="mt-4 grid gap-3">
              {generalCareRecords.length === 0 ? (
                <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">아직 기록이 없어. 심방이나 상담 메모가 쌓이면 여기서 본다.</div>
              ) : (
                generalCareRecords.map((record) => (
                  <div key={record.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#111111]">{record.title}</p>
                      <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{record.category}</span>
                    </div>
                    <p className="mt-2 text-sm text-[#5f564b]">{record.summary ?? record.details ?? "세부 내용 없음"}</p>
                    <p className="mt-2 text-[11px] text-[#8c7a5b]">{formatDate(record.happenedAt)}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">ORGANIZATIONS</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">소속 조직</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">다중 소속 · 주 소속 지정</span>
            </div>
            <form action={addOrganizationMembership.bind(null, church.slug, member.id)} className="mt-4 grid gap-3 rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 lg:grid-cols-[minmax(0,1.2fr)_180px_1fr_auto]">
              <select name="organizationId" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" defaultValue="">
                <option value="">조직 선택</option>
                {organizationOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.name} · {option.type}</option>
                ))}
              </select>
              <select name="role" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" defaultValue={MemberOrgRole.MEMBER}>
                {MEMBER_ORG_ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <input name="customRoleLabel" placeholder="직접 역할명" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
              <button className="rounded-[12px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">조직 연결</button>
              <textarea name="notes" placeholder="메모 / 배정 근거" className="lg:col-span-3 rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
              <label className="flex items-center gap-2 text-sm text-[#5f564b]"><input type="checkbox" name="isPrimary" /> 주 소속으로 지정</label>
            </form>
            <div className="mt-4 grid gap-3">
              {member.organizations.length === 0 ? (
                <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">아직 연결된 조직 정보가 없어.</div>
              ) : (
                member.organizations.map((link) => (
                  <div key={link.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#111111]">{link.organization.name}</p>
                        <p className="mt-1 text-xs text-[#8c7a5b]">유형 · {link.organization.type}{link.isPrimary ? " · 주 소속" : ""}</p>
                      </div>
                      <form action={removeOrganizationMembership.bind(null, church.slug, member.id)}>
                        <input type="hidden" name="linkId" value={link.id} />
                        <button className="rounded-[12px] border border-[#f0c9c9] bg-white px-3 py-2 text-xs font-semibold text-[#9a4a4a]">연결 해제</button>
                      </form>
                    </div>
                    <form action={updateOrganizationMembership.bind(null, church.slug, member.id)} className="mt-3 grid gap-3 lg:grid-cols-[180px_1fr_auto]">
                      <input type="hidden" name="linkId" value={link.id} />
                      <select name="role" defaultValue={link.role} className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]">
                        {MEMBER_ORG_ROLE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <input name="customRoleLabel" defaultValue={link.customRoleLabel ?? ""} placeholder="직접 역할명" className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
                      <button className="rounded-[12px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">소속 저장</button>
                      <textarea name="notes" defaultValue={link.notes ?? ""} placeholder="메모" className="lg:col-span-3 rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
                      <label className="lg:col-span-3 flex items-center gap-2 text-sm text-[#5f564b]"><input type="checkbox" name="isPrimary" defaultChecked={link.isPrimary} /> 주 소속으로 유지</label>
                    </form>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">FAITH MILESTONES</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">신앙 이력</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">침례 · 세례 · 이명</span>
            </div>
            <div className="mt-4 grid gap-3">
              {member.faithMilestones.length === 0 ? (
                <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">아직 신앙 이력이 없어.</div>
              ) : (
                member.faithMilestones.map((item) => (
                  <div key={item.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#111111]">{item.type}</p>
                      <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{item.happenedAt ? formatDate(item.happenedAt) : "날짜 미정"}</span>
                    </div>
                    <p className="mt-2 text-sm text-[#5f564b]">{item.churchName ?? item.notes ?? "세부 내용 없음"}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
