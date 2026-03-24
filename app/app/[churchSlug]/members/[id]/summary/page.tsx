import Link from "next/link";
import { notFound } from "next/navigation";
import { updateMemberStatus } from "../../actions";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { formatDate } from "@/lib/date";
import { getWorkspaceMemberRecord } from "@/lib/workspace-data";

const STATUS_OPTIONS = ["등록대기", "새가족", "정착중", "목장배정완료", "봉사연결", "휴면", "심방필요"] as const;

function getChecklist(member: NonNullable<Awaited<ReturnType<typeof getWorkspaceMemberRecord>>>) {
  return [
    {
      label: "기본 상태 점검",
      done: member.statusTag !== "등록대기",
      value: member.statusTag,
    },
    {
      label: "교구 배정",
      done: Boolean(member.districtId),
      value: member.district?.name ?? "미배정",
    },
    {
      label: "목장 배정",
      done: Boolean(member.groupId),
      value: member.group?.name ?? "미배정",
    },
    {
      label: "가족 연결",
      done: member.relationshipsFrom.length + member.relationshipsTo.length > 0,
      value: `${member.relationshipsFrom.length + member.relationshipsTo.length}건`,
    },
  ];
}

export default async function MemberSummaryPage({ params }: { params: { churchSlug: string; id: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) notFound();

  const church = membership.church;
  const member = await getWorkspaceMemberRecord(church.id, params.id);
  if (!member) notFound();

  const checklist = getChecklist(member);
  const completionCount = checklist.filter((item) => item.done).length;

  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <p className="text-[11px] tracking-[0.2em] text-white/46">MEMBER SUMMARY</p>
          <h1 className="mt-3 text-[2.2rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white">{member.name}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">등록 직후 바로 정리해야 할 상태와 배정 항목을 먼저 확인하는 화면이야.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">상태</p>
              <p className="mt-2 text-sm font-semibold">{member.statusTag}</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">교구</p>
              <p className="mt-2 text-sm font-semibold">{member.district?.name ?? "미배정"}</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">목장</p>
              <p className="mt-2 text-sm font-semibold">{member.group?.name ?? "미배정"}</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">체크 완료</p>
              <p className="mt-2 text-sm font-semibold">{completionCount} / {checklist.length}</p>
            </div>
          </div>
        </div>

        <section className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">PRIMARY ACTIONS</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">바로 할 일</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">next</span>
          </div>
          <div className="mt-4 grid gap-3">
            <Link href={`/app/${church.slug}/members/${member.id}/edit`} className="rounded-[18px] border border-[#ece6dc] bg-white p-4 text-sm font-semibold text-[#111111] transition hover:bg-[#fcfbf8]">기본 정보 수정</Link>
            <Link href={`/app/${church.slug}/members/${member.id}`} className="rounded-[18px] border border-[#ece6dc] bg-white p-4 text-sm font-semibold text-[#111111] transition hover:bg-[#fcfbf8]">상세 기록 열기</Link>
            <Link href={`/app/${church.slug}/members`} className="rounded-[18px] border border-[#ece6dc] bg-white p-4 text-sm font-semibold text-[#111111] transition hover:bg-[#fcfbf8]">사람 목록으로 이동</Link>
          </div>
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">STATUS CONTROL</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">상태 업데이트</h2>
            </div>
            <span className="text-xs text-[#8C7A5B]">등록 직후 운영값</span>
          </div>
          <form action={updateMemberStatus.bind(null, church.slug, member.id)} className="mt-4 grid gap-3 rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
            <select name="statusTag" defaultValue={member.statusTag} className="rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]">
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-[#5f564b]"><input type="checkbox" name="requiresFollowUp" defaultChecked={member.requiresFollowUp} /> 후속 연락 필요</label>
            <button className="rounded-[12px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">상태 저장</button>
          </form>

          <div className="mt-4 grid gap-3">
            <div className="rounded-[16px] border border-[#ece6dc] bg-[#fcfbf8] p-4 text-sm text-[#111111]">등록일 · {formatDate(member.registeredAt)}</div>
            <div className="rounded-[16px] border border-[#ece6dc] bg-[#fcfbf8] p-4 text-sm text-[#111111]">전화번호 · {member.phone}</div>
            <div className="rounded-[16px] border border-[#ece6dc] bg-[#fcfbf8] p-4 text-sm text-[#111111]">이메일 · {member.email ?? "미입력"}</div>
          </div>
        </section>

        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">CHECKLIST</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">등록 후 정리 항목</h2>
            </div>
            <span className="text-xs text-[#8C7A5B]">워크스페이스 연결 상태</span>
          </div>
          <div className="mt-4 grid gap-3">
            {checklist.map((item) => (
              <div key={item.label} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#111111]">{item.label}</p>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] ${item.done ? "bg-[#eefbf3] text-[#2d7a46]" : "bg-[#fff7e8] text-[#8C6A2E]"}`}>{item.done ? "완료" : "필요"}</span>
                </div>
                <p className="mt-2 text-sm text-[#5f564b]">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
