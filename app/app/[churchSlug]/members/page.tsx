import Link from "next/link";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { startOfMonth, formatDate } from "@/lib/date";
import { getWorkspaceMembers } from "@/lib/workspace-data";

export default async function ChurchMembersPage({
  params,
  searchParams,
}: {
  params: { churchSlug: string };
  searchParams?: { filter?: string };
}) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) {
    return (
      <section className="rounded-[24px] border border-[#E7E0D4] bg-white p-5 text-[#121212] shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
        <h2 className="text-lg font-semibold">접근 권한이 없어</h2>
        <p className="mt-2 text-sm text-[#5F564B]">워크스페이스 선택 화면으로 돌아가 다시 시도해줘.</p>
      </section>
    );
  }

  const church = membership.church;
  const filter = searchParams?.filter ?? "all";
  const members = await getWorkspaceMembers(church.id, {
    followUpOnly: filter === "followup",
    registeredFrom: filter === "new" ? startOfMonth(new Date()) : undefined,
  });

  const counts = {
    all: members.length,
    followup: members.filter((member) => member.requiresFollowUp).length,
    unassigned: members.filter((member) => !member.districtId || !member.groupId).length,
  };

  const filterChips = [
    { key: "all", label: "전체", value: counts.all },
    { key: "followup", label: "후속 연락 필요", value: counts.followup },
    { key: "new", label: "이번 달 등록", value: members.length },
  ] as const;

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">PEOPLE</p>
            <h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">사람</h2>
            <p className="mt-2 text-sm text-[#5f564b]">교인과 상태를 한 화면에서 정리</p>
          </div>

          <div className="flex flex-col gap-3 xl:min-w-[520px] xl:items-end">
            <div className="flex w-full items-center gap-2 rounded-[16px] border border-[#E7E0D4] bg-[#FBF9F4] px-4 py-3">
              <span className="text-sm text-[#8C7A5B]">⌕</span>
              <span className="text-sm text-[#7B6F60]">사람 검색</span>
            </div>
            <div className="flex flex-wrap gap-2 xl:justify-end">
              <button className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-2 text-sm font-medium text-[#121212]">내보내기</button>
              <Link href={`/app/${church.slug}/members/import`} className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-2 text-sm font-medium text-[#121212]">CSV 등록</Link>
              <Link href={`/app/${church.slug}/members/new`} className="rounded-[14px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">사람 추가</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex flex-wrap items-center gap-2">
          {filterChips.map((item) => (
            <Link
              key={item.key}
              href={`?filter=${item.key}`}
              className={`rounded-full px-3 py-2 text-sm transition ${
                filter === item.key
                  ? "bg-[#0F172A] text-white"
                  : "border border-[#E7E0D4] bg-white text-[#5f564b]"
              }`}
            >
              {item.label} {item.value}
            </Link>
          ))}
          <button className="rounded-full border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#5f564b]">그룹</button>
          <button className="rounded-full border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#5f564b]">문자 수신</button>
          <button className="rounded-full border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#5f564b]">이메일 수신</button>
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-[#e6dfd5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between border-b border-[#efe7da] px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-[#111111]">사람 목록</p>
            <p className="mt-1 text-xs text-[#8C7A5B]">{counts.all}명</p>
          </div>
          <button className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-xs font-medium text-[#121212]">통합 관리</button>
        </div>

        {members.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-base font-semibold text-[#111111]">아직 등록된 사람이 없어</p>
            <p className="mt-2 text-sm text-[#5f564b]">첫 사람을 추가하면 여기서 바로 관리할 수 있어.</p>
            <div className="mt-4">
              <button className="rounded-[14px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">첫 사람 추가</button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#FBF9F4] text-[#8C7A5B]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">이름</th>
                  <th className="px-4 py-3 text-left font-medium">상태</th>
                  <th className="px-4 py-3 text-left font-medium">교구/목장</th>
                  <th className="px-4 py-3 text-left font-medium">전화번호</th>
                  <th className="px-4 py-3 text-left font-medium">이메일</th>
                  <th className="px-4 py-3 text-left font-medium">등록일</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-t border-[#f1eadf] text-[#111111]">
                    <td className="px-4 py-3 font-medium"><Link href={`/app/${church.slug}/members/${member.id}`} className="hover:text-[#8C6A2E]">{member.name}</Link></td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] ${member.requiresFollowUp ? "bg-[#fff4df] text-[#8C6A2E]" : "border border-[#E7E0D4] bg-white text-[#5f564b]"}`}>
                        {member.requiresFollowUp ? "후속 연락 필요" : member.statusTag}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#5f564b]">{member.district?.name ?? "미정"} / {member.group?.name ?? "미정"}</td>
                    <td className="px-4 py-3 text-[#5f564b]">{member.phone ?? "-"}</td>
                    <td className="px-4 py-3 text-[#5f564b]">{member.email ?? "-"}</td>
                    <td className="px-4 py-3 text-[#5f564b]">{formatDate(member.registeredAt)}</td>
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
