import Link from "next/link";
import { RelationshipType } from "@prisma/client";
import type { ReactNode } from "react";
import {
  addAttendanceRecord,
  addCareRecord,
  createFamilyLink,
  removeFamilyLink,
  restoreMember,
  softDeleteMember,
} from "./actions";
import { formatDate } from "@/lib/date";
import { getGidoFamilyRoleLabel, parseGidoMemberMeta } from "@/lib/gido-home-config";
import { getGidoLeadershipProfile } from "@/lib/gido-leadership";
import { decorateGidoMember } from "@/lib/gido-members-view";
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

type QueueContext = {
  label: string;
  helper: string;
  index: number;
  total: number;
  listHref: string;
  prev?: { href: string; name: string };
  next?: { href: string; name: string };
};

const RELATIONSHIP_OPTIONS = [
  { value: RelationshipType.SPOUSE, label: "배우자" },
  { value: RelationshipType.PARENT, label: "부모" },
  { value: RelationshipType.CHILD, label: "자녀" },
  { value: RelationshipType.SIBLING, label: "형제자매" },
  { value: RelationshipType.RELATIVE, label: "친인척" },
  { value: RelationshipType.CAREGIVER, label: "관리 담당" },
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

type QuickJumpItem = {
  label: string;
  href: string;
  tone?: "primary" | "secondary";
};

export default function GidoMemberRecord({
  churchSlug,
  member,
  memberOptions,
  queueContext,
}: {
  churchSlug: string;
  member: MemberRecord;
  memberOptions: MemberOption[];
  queueContext?: QueueContext;
}) {
  const leadership = getGidoLeadershipProfile(member.name, member.household?.name);
  const memberView = decorateGidoMember(member);
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
  const activeLifeStatuses = member.lifeStatuses.filter((status) => status.isActive);
  const householdMeta = parseJson<HouseholdMeta>(member.household?.notes) ?? {};
  const memberMeta = parseGidoMemberMeta(member.notes);
  const familyRoleLabel = getGidoFamilyRoleLabel(memberMeta.familyRole);

  const latestTouch = careRecords[0] ?? attendanceRecords[0] ?? ministryRecords[0] ?? null;
  const focusItems = [
    member.requiresFollowUp
      ? {
          label: "관리",
          text: "관리 기록 필요",
        }
      : null,
    latestTouch
      ? {
          label: "최근 접점",
          text: `${latestTouch.title} · ${formatDate(latestTouch.happenedAt)}`,
        }
      : {
          label: "최근 접점",
          text: "최근 기록 없음",
        },
    householdMeta.prayers?.[0]
      ? {
          label: "이번 주 중보",
          text: householdMeta.prayers[0],
        }
      : null,
    leadership.rotationTrack
      ? {
          label: "리더 구별",
          text: leadership.rotationTrack.label,
        }
      : null,
  ].filter((item): item is { label: string; text: string } => Boolean(item));

  const roleSummary = leadership.isActiveLeader
    ? "현 목자"
    : familyRoleLabel ?? (leadership.rotationTrack ? "순환 진행 가정" : "일반 목원");

  const overviewItems = [
    { label: "관리 기록", value: `${careRecords.length}건` },
    { label: "출석 흐름", value: `${attendanceRecords.length}건` },
    { label: "삶 상태", value: `${member.lifeStatuses.length}건` },
    { label: "사역 이력", value: `${ministryRecords.length}건` },
  ];

  const quickJumpItems: QuickJumpItem[] = [
    {
      label: memberView.actionPlan.shortLabel,
      href: `#${memberView.actionPlan.section}`,
      tone: "primary" as const,
    },
    {
      label: !member.household?.name || familyLinks.length === 0 ? "가족 연결" : "가족 보기",
      href: "#family-links",
    },
    {
      label: householdMeta.prayers?.length ? "가정 중보" : "출석 확인",
      href: householdMeta.prayers?.length ? "#household-prayer" : "#attendance-log",
    },
  ].filter((item, index, list) => list.findIndex((candidate) => candidate.href === item.href) === index);

  return (
    <div className="flex flex-col gap-4 text-[#111111]">
      <section className="rounded-[30px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-[#111827] text-[1.4rem] font-semibold text-white shadow-[0_12px_24px_rgba(17,24,39,0.18)]">
                {member.name.slice(0, 1)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">G.I.D.O PEOPLE DETAIL</p>
                <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">{member.name}</h1>
                <p className="mt-2 text-sm leading-6 text-[#5f564b]">
                  상태, 관리, 가정 연결, 리더 구별
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {leadership.tags.length > 0 ? (
                    leadership.tags.map((tag) => (
                      <Tag key={tag} strong={tag === "현 목자"}>
                        {tag}
                      </Tag>
                    ))
                  ) : (
                    <Tag>목원</Tag>
                  )}
                  {familyRoleLabel ? <Tag>{familyRoleLabel}</Tag> : null}
                  {member.requiresFollowUp ? <Tag tone="alert">관리 필요</Tag> : null}
                  {member.household?.name ? <Tag>{member.household.name}</Tag> : null}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <HeroMetric label="구별" value={roleSummary} sub={member.position ?? "역할 미정"} />
              <HeroMetric label="가정" value={member.household?.name ?? "미분류"} sub={`${member.district?.name ?? "교구 미정"} · ${member.group?.name ?? "목장 미정"}`} />
              <HeroMetric
                label="최근 접점"
                value={latestTouch ? formatDate(latestTouch.happenedAt) : "기록 없음"}
                sub={latestTouch?.title ?? "기록 메모부터 시작"}
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {overviewItems.map((item) => (
                <OverviewMetric key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
          </div>

          <div id="today-check" className="rounded-[24px] border border-[#ece4d8] bg-[#fbfaf7] p-5 scroll-mt-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">TODAY CHECK</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">지금 바로 볼 것</h2>
              </div>
              <span className="rounded-full border border-[#e6dfd5] bg-white px-3 py-1 text-[11px] text-[#6f6256]">people</span>
            </div>

            {queueContext ? (
              <div className="mt-4 rounded-[18px] border border-[#e6d8bf] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">WORK QUEUE</p>
                    <p className="mt-2 text-sm font-semibold text-[#111111]">{queueContext.label}</p>
                    <p className="mt-1 text-xs text-[#8C7A5B]">{queueContext.index} / {queueContext.total}</p>
                  </div>
                  <Link href={queueContext.listHref} className="rounded-[12px] border border-[#E7E0D4] bg-[#fcfaf6] px-3 py-2 text-xs font-medium text-[#121212]">
                    목록 보기
                  </Link>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#5f564b]">{queueContext.helper}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {queueContext.prev ? (
                    <Link href={queueContext.prev.href} className="rounded-[12px] border border-[#E7E0D4] bg-white px-3.5 py-2 text-sm font-medium text-[#121212]">
                      이전 {queueContext.prev.name}
                    </Link>
                  ) : null}
                  {queueContext.next ? (
                    <Link href={queueContext.next.href} className="rounded-[12px] bg-[#111827] px-3.5 py-2 text-sm font-semibold text-white">
                      다음 {queueContext.next.name}
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="mt-4 rounded-[18px] border border-[#e7ddcf] bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">NEXT ACTION</p>
                  <p className="mt-2 text-sm font-semibold text-[#111111]">{memberView.actionPlan.title}</p>
                </div>
                <span className="rounded-full border border-[#e7ddcf] bg-[#fcfaf6] px-2.5 py-1 text-[11px] text-[#6f6256]">{memberView.actionPlan.laneLabel}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#5f564b]">{memberView.actionPlan.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`#${memberView.actionPlan.section}`} className="rounded-[12px] bg-[#111827] px-3.5 py-2 text-sm font-semibold text-white">
                  {memberView.actionPlan.shortLabel}
                </Link>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {focusItems.map((item) => (
                <FocusRow key={`${item.label}-${item.text}`} label={item.label} text={item.text} />
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {quickJumpItems.map((item) => (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  className={`rounded-[12px] px-3.5 py-2 text-sm font-medium ${
                    item.tone === "primary"
                      ? "bg-[#111827] text-white"
                      : "border border-[#E7E0D4] bg-white text-[#121212]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link href={`/app/${churchSlug}/members/${member.id}/edit`} className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-2 text-sm font-medium text-[#121212]">
                기본 정보 수정
              </Link>
              <Link href={`/app/${churchSlug}/members/${member.id}/summary`} className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-2 text-sm font-medium text-[#121212]">
                요약 보기
              </Link>
              <Link href={`/app/${churchSlug}/followups`} className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-2 text-sm font-medium text-[#121212]">
                관리 보드
              </Link>
              <Link href={`/app/${churchSlug}/households`} className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-2 text-sm font-medium text-[#121212]">
                가정 화면
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
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="grid gap-4 xl:sticky xl:top-6 xl:self-start">
          <SurfaceCard>
            <Header title="사람 카드" caption="기본 프로필" />
            <div className="mt-4 rounded-[20px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#111827] text-lg font-semibold text-white">
                  {member.name.slice(0, 1)}
                </div>
                <div>
                  <p className="text-base font-semibold text-[#111111]">{member.name}</p>
                  <p className="mt-1 text-xs text-[#6f6256]">{roleSummary}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                <CompactStat label="관리 상태" value={member.requiresFollowUp ? "바로 체크" : "안정"} />
                <CompactStat label="가족 연결" value={`${familyLinks.length}건`} />
                <CompactStat label="기도제목" value={householdMeta.prayers?.length ? `${householdMeta.prayers.length}개` : "없음"} />
                <CompactStat label="최근 접점" value={latestTouch ? formatDate(latestTouch.happenedAt) : "없음"} />
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <InfoRow label="전화번호" value={member.phone ?? "-"} />
              <InfoRow label="이메일" value={member.email ?? "-"} />
              <InfoRow label="현재 역할" value={member.position ?? "미정"} />
              <InfoRow label="가정 역할" value={familyRoleLabel ?? "미지정"} />
              <InfoRow label="등록일" value={formatDate(member.registeredAt)} />
              <InfoRow label="직장" value={member.currentJob ?? "미기록"} />
              <InfoRow label="세례 / 침례" value={member.baptismStatus ?? "미기록"} />
              <InfoRow label="신앙 배경" value={member.previousChurch ?? member.previousFaith ?? "미기록"} />
            </div>
          </SurfaceCard>

          <SurfaceCard>
            <Header title="리더 구별" caption="운영 기준" />
            <div className="mt-4 grid gap-3">
              <MiniCallout
                tone={leadership.isActiveLeader ? "dark" : leadership.rotationTrack ? "warm" : "neutral"}
                title={leadership.isActiveLeader ? "현 목자" : leadership.rotationTrack ? "순환 진행 가정" : "일반 목원"}
                body={
                  leadership.isActiveLeader
                    ? "현재 목장 운영 리더"
                    : leadership.rotationTrack
                      ? `${leadership.rotationTrack.label} 순환 진행 대상`
                      : "일반 목원"
                }
              />
              <InfoRow label="가정" value={member.household?.name ?? "미분류"} />
              <InfoRow label="교구 / 목장" value={`${member.district?.name ?? "미정"} / ${member.group?.name ?? "미정"}`} />
            </div>
          </SurfaceCard>

          <SurfaceCard>
            <Header title="가정 메타" caption="중보와 태그" />
            <div className="mt-4 grid gap-3">
              <InfoRow label="기도제목" value={householdMeta.prayers?.length ? `${householdMeta.prayers.length}개` : "없음"} />
              <InfoRow label="연락 메모" value={householdMeta.contacts?.length ? `${householdMeta.contacts.length}개` : "없음"} />
              <InfoRow label="가족 연결" value={`${familyLinks.length}건`} />
            </div>

            {householdMeta.tags?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {householdMeta.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            ) : null}
          </SurfaceCard>
        </aside>

        <div className="grid gap-4">
          <section className="grid gap-4 2xl:grid-cols-[1.02fr_0.98fr]">
            <SurfaceCard id="care-log">
              <Header title="상세 기록 / 메모" caption="바로 기록" />
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
                <textarea name="summary" placeholder="관리 내용, 대화 요점, 다음 액션" className="sm:col-span-4 rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]" />
              </form>

              <div className="mt-4 grid gap-3">
                {careRecords.length === 0 ? (
                  <EmptyBox text="기록 없음" />
                ) : (
                  careRecords.slice(0, 8).map((record) => (
                    <TimelineCard
                      key={record.id}
                      label={record.category}
                      title={record.title}
                      body={record.summary ?? record.details ?? "세부 내용 없음"}
                      date={formatDate(record.happenedAt)}
                    />
                  ))
                )}
              </div>
            </SurfaceCard>

            <SurfaceCard id="family-links">
              <Header title="가족 / 연결" caption="가정 안에서 보기" />
              <form action={createFamilyLink.bind(null, churchSlug, member.id)} className="mt-4 grid gap-3 rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 lg:grid-cols-[minmax(0,1.2fr)_170px_1fr_auto]">
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
                  <EmptyBox text="가족 연결 없음" />
                ) : (
                  familyLinks.map((item) => (
                    <article key={item.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link href={`/app/${churchSlug}/members/${item.member.id}`} className="text-sm font-semibold text-[#111111] hover:underline">
                            {item.member.name}
                          </Link>
                          <p className="mt-1 text-xs text-[#8c7a5b]">관계 · {item.customRelationship ?? item.label}</p>
                          <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.note ?? item.member.phone ?? item.member.email ?? "메모 없음"}</p>
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
            </SurfaceCard>
          </section>

          <section className="grid gap-4 2xl:grid-cols-[0.92fr_1.08fr]">
            <SurfaceCard id="attendance-log">
              <Header title="출석 관리" caption="예배와 모임" />
              <form action={addAttendanceRecord.bind(null, churchSlug, member.id)} className="mt-4 grid gap-3 rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 sm:grid-cols-[150px_130px_minmax(0,1fr)_140px_auto]">
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
                  <EmptyBox text="출석 기록 없음" />
                ) : (
                  attendanceRecords.slice(0, 8).map((record) => (
                    <TimelineCard
                      key={record.id}
                      label="출석"
                      title={record.title}
                      body={record.summary ?? "메모 없음"}
                      date={formatDate(record.happenedAt)}
                    />
                  ))
                )}
              </div>
            </SurfaceCard>

            <div className="grid gap-4">
              <SurfaceCard id="household-prayer">
                <Header title="가정별 중보" caption="같이 챙길 것" />
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <InfoRow label="가정 이름" value={member.household?.name ?? "미분류"} />
                  <InfoRow label="교구 / 목장" value={`${member.district?.name ?? "미정"} / ${member.group?.name ?? "미정"}`} />
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
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
                  ) : (
                    <EmptyBox text="기도제목 없음" />
                  )}

                  {householdMeta.contacts?.length ? (
                    <article className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                      <p className="text-sm font-semibold text-[#111111]">연락 메모</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {householdMeta.contacts.map((contact) => (
                          <Tag key={contact}>{contact}</Tag>
                        ))}
                      </div>
                    </article>
                  ) : (
                    <EmptyBox text="연락 메모 없음" />
                  )}
                </div>
              </SurfaceCard>

              <SurfaceCard id="life-status">
                <Header title="삶 상태 / 사역" caption="깊은 관리" />
                <div className="grid gap-3 lg:grid-cols-2">
                  <div className="grid gap-3">
                    <p className="text-xs font-semibold text-[#8C7A5B]">삶 상태</p>
                    {member.lifeStatuses.length > 0 ? (
                      (activeLifeStatuses.length > 0 ? activeLifeStatuses : member.lifeStatuses).slice(0, 5).map((status) => (
                        <TimelineCard
                          key={status.id}
                          label={status.type}
                          title={status.title}
                          body={status.summary ?? status.details ?? "세부 내용 없음"}
                          date={status.happenedAt ? formatDate(status.happenedAt) : "날짜 미정"}
                        />
                      ))
                    ) : (
                      <EmptyBox text="삶 상태 기록 없음" />
                    )}
                  </div>

                  <div className="grid gap-3">
                    <p className="text-xs font-semibold text-[#8C7A5B]">사역 기록</p>
                    {ministryRecords.length > 0 ? (
                      ministryRecords.slice(0, 5).map((record) => (
                        <TimelineCard
                          key={record.id}
                          label="사역"
                          title={record.title}
                          body={record.summary ?? "메모 없음"}
                          date={formatDate(record.happenedAt)}
                        />
                      ))
                    ) : (
                      <EmptyBox text="사역 기록 없음" />
                    )}
                  </div>
                </div>
              </SurfaceCard>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function SurfaceCard({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <section id={id} className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] scroll-mt-6">
      {children}
    </section>
  );
}

function Header({ title, caption }: { title: string; caption?: string }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[#111111]">{title}</h2>
      {caption ? <p className="mt-1 text-xs text-[#8C7A5B]">{caption}</p> : null}
    </div>
  );
}

function HeroMetric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
      <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{label}</p>
      <p className="mt-2 text-base font-semibold text-[#111111]">{value}</p>
      {sub ? <p className="mt-1 text-xs text-[#6f6256]">{sub}</p> : null}
    </div>
  );
}

function OverviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-[#ece4d8] bg-white px-4 py-3">
      <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{label}</p>
      <p className="mt-1.5 text-sm font-semibold text-[#111111]">{value}</p>
    </div>
  );
}

function FocusRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-[18px] border border-[#ece4d8] bg-white p-4">
      <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{label}</p>
      <p className="mt-2 text-sm leading-6 text-[#111111]">{text}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#ece4d8] bg-[#fbfaf7] p-4">
      <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{label}</p>
      <p className="mt-2 text-sm font-medium leading-6 text-[#111111]">{value}</p>
    </div>
  );
}

function CompactStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-[#e7dfd3] bg-white px-3 py-2.5">
      <p className="text-[11px] tracking-[0.14em] text-[#9a8b7a]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#111111]">{value}</p>
    </div>
  );
}

function TimelineCard({
  label,
  title,
  body,
  date,
}: {
  label: string;
  title: string;
  body: string;
  date: string;
}) {
  return (
    <article className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
      <div className="flex gap-3">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#111827]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#111111]">{title}</p>
            <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{label}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#5f564b]">{body}</p>
          <p className="mt-2 text-[11px] text-[#8c7a5b]">{date}</p>
        </div>
      </div>
    </article>
  );
}

function MiniCallout({
  title,
  body,
  tone = "neutral",
}: {
  title: string;
  body: string;
  tone?: "neutral" | "warm" | "dark";
}) {
  const toneClass =
    tone === "dark"
      ? "border-[#111827] bg-[#111827] text-white"
      : tone === "warm"
        ? "border-[#e9d8b0] bg-[#fff7e8] text-[#5b4630]"
        : "border-[#ece4d8] bg-[#fbfaf7] text-[#111111]";

  const bodyClass = tone === "dark" ? "text-white/78" : tone === "warm" ? "text-[#6f6256]" : "text-[#5f564b]";

  return (
    <div className={`rounded-[18px] border p-4 ${toneClass}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className={`mt-2 text-sm leading-6 ${bodyClass}`}>{body}</p>
    </div>
  );
}

function Tag({
  children,
  strong = false,
  tone = "neutral",
}: {
  children: ReactNode;
  strong?: boolean;
  tone?: "neutral" | "alert";
}) {
  if (strong) {
    return <span className="rounded-full bg-[#111827] px-3 py-1.5 text-xs text-white">{children}</span>;
  }

  if (tone === "alert") {
    return <span className="rounded-full bg-[#fff4df] px-3 py-1.5 text-xs text-[#8C6A2E]">{children}</span>;
  }

  return <span className="rounded-full border border-[#e6dfd5] bg-white px-3 py-1.5 text-xs text-[#5f564b]">{children}</span>;
}

function EmptyBox({ text }: { text: string }) {
  return <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">{text}</div>;
}
