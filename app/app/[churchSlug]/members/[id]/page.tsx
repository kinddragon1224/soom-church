import Link from "next/link";
import { notFound } from "next/navigation";
import { addCareRecord, restoreMember, softDeleteMember } from "../actions";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { formatDate } from "@/lib/date";
import { getWorkspaceMemberRecord } from "@/lib/workspace-data";

export default async function ChurchMemberRecordPage({
  params,
}: {
  params: { churchSlug: string; id: string };
}) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) notFound();

  const church = membership.church;
  const member = await getWorkspaceMemberRecord(church.id, params.id);
  if (!member) notFound();

  const familyLinks = [
    ...member.relationshipsFrom.map((item) => ({
      id: `from-${item.id}`,
      label: item.relationshipType,
      member: item.toMember,
      note: item.notes,
    })),
    ...member.relationshipsTo.map((item) => ({
      id: `to-${item.id}`,
      label: item.relationshipType,
      member: item.fromMember,
      note: item.notes,
    })),
  ];

  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.2em] text-white/46">MEMBER RECORD</p>
              <h1 className="mt-3 text-[2.2rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white">{member.name}</h1>
              <p className="mt-3 text-sm text-white/68">사역자가 사람 한 명을 깊게 파악하는 메인 레코드 화면</p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">{member.position ?? "직분 미정"}</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">{member.statusTag}</span>
              {member.requiresFollowUp ? <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/12 px-3 py-1.5 text-xs text-[#f1dfb2]">후속 연락 필요</span> : null}
              {member.isDeleted ? <span className="rounded-full border border-[#f0c9c9] bg-[#fff2f2] px-3 py-1.5 text-xs text-[#9a4a4a]">삭제됨</span> : null}
              <Link href={`/app/${church.slug}/members/${member.id}/edit`} className="rounded-[12px] border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-medium text-white">수정</Link>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
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
              <p className="text-[11px] tracking-[0.16em] text-white/48">기록</p>
              <p className="mt-2 text-sm font-semibold">{member.careRecords.length}건</p>
              <p className="mt-1 text-xs text-white/60">심방 · 상담 · 메모</p>
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
              <span className="text-xs text-[#8C7A5B]">클릭 이동</span>
            </div>
            <div className="mt-4 grid gap-3">
              {familyLinks.length === 0 ? (
                <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">아직 연결된 가족 정보가 없어.</div>
              ) : (
                familyLinks.map((item) => (
                  <Link key={item.id} href={`/app/${church.slug}/members/${item.member.id}`} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 transition hover:bg-white">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#111111]">{item.member.name}</p>
                        <p className="mt-1 text-xs text-[#8c7a5b]">관계 · {item.label}</p>
                        <p className="mt-2 text-sm text-[#5f564b]">{item.member.phone ?? item.member.email ?? "연락처 없음"}</p>
                      </div>
                      <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">이동</span>
                    </div>
                  </Link>
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
              {member.careRecords.length === 0 ? (
                <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">아직 기록이 없어. 심방이나 상담 메모가 쌓이면 여기서 본다.</div>
              ) : (
                member.careRecords.map((record) => (
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
              <span className="text-xs text-[#8C7A5B]">다중 소속</span>
            </div>
            <div className="mt-4 grid gap-3">
              {member.organizations.length === 0 ? (
                <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">아직 연결된 조직 정보가 없어.</div>
              ) : (
                member.organizations.map((link) => (
                  <div key={link.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#111111]">{link.organization.name}</p>
                      <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{link.role}</span>
                    </div>
                    <p className="mt-2 text-sm text-[#5f564b]">유형 · {link.organization.type}{link.isPrimary ? " · 주 소속" : ""}</p>
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
