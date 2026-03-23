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

  const filters = [
    { key: "all", label: "전체", value: counts.all },
    { key: "new", label: "이번 달 신규", value: members.length },
    { key: "followup", label: "후속관리", value: counts.followup },
  ] as const;

  const actionRail = [
    {
      title: `후속관리 ${counts.followup}명`,
      desc: "예배 이후 바로 챙겨야 하는 사람부터 먼저 정리합니다.",
      href: `?filter=followup`,
    },
    {
      title: `미배정 ${counts.unassigned}명`,
      desc: "교구나 목장이 비어 있는 사람을 우선 연결합니다.",
      href: `?filter=all`,
    },
    {
      title: "신규 등록 확인",
      desc: "이번 달 새로 들어온 사람을 빠르게 확인합니다.",
      href: `?filter=new`,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] tracking-[0.2em] text-white/46">PEOPLE WORKSPACE</p>
              <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[2.7rem]">
                사람 흐름을
                <br />
                운영 기준으로 정리합니다
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                교인 목록, 후속관리, 미배정 상태를 한 화면에서 확인하고 바로 정리하는 실사용 화면입니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[240px] lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">{church.name}</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">people</span>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">TOTAL</p>
              <p className="mt-2 text-2xl font-semibold">{counts.all}</p>
              <p className="mt-2 text-xs text-white/60">현재 화면 기준 인원</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">FOLLOW-UP</p>
              <p className="mt-2 text-2xl font-semibold">{counts.followup}</p>
              <p className="mt-2 text-xs text-white/60">바로 챙겨야 할 사람</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">UNASSIGNED</p>
              <p className="mt-2 text-2xl font-semibold">{counts.unassigned}</p>
              <p className="mt-2 text-xs text-white/60">교구·목장 연결 필요</p>
            </div>
          </div>
        </div>

        <section className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">QUICK FILTERS</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">바로 보기</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">people</span>
          </div>
          <div className="mt-4 grid gap-3">
            {filters.map((item) => (
              <Link
                key={item.key}
                href={`?filter=${item.key}`}
                className={`rounded-[18px] border p-4 transition ${filter === item.key ? "border-[#C8A96B] bg-[#fff7e8]" : "border-[#ece6dc] bg-white hover:bg-[#fcfbf8]"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#111111]">{item.label}</p>
                  <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{item.value}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.86fr_1.14fr]">
        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">ACTION RAIL</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">지금 먼저 할 일</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">운영 우선순위</span>
            </div>
            <div className="mt-4 grid gap-3">
              {actionRail.map((item) => (
                <Link key={item.title} href={item.href} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 transition hover:bg-white">
                  <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">PEOPLE LIST</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">사람 목록</h2>
            </div>
            <span className="text-xs text-[#8C7A5B]">{filter === "followup" ? "후속관리 보기" : filter === "new" ? "이번 달 신규" : "전체 보기"}</span>
          </div>
          <div className="mt-4 grid gap-3">
            {members.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">
                아직 표시할 사람이 없어. 회원가입 이후 사람 데이터를 추가하면 여기서 바로 관리할 수 있어.
              </div>
            ) : (
              members.map((member) => (
                <div key={member.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-[#111111]">{member.name}</p>
                        <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{member.statusTag}</span>
                        {member.requiresFollowUp ? <span className="rounded-full border border-[#eadfcd] bg-[#fff7e8] px-2.5 py-1 text-[11px] text-[#8C6A2E]">follow-up</span> : null}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#5f564b]">
                        {member.phone} · {member.district?.name ?? "교구 미정"} / {member.group?.name ?? "목장 미정"}
                      </p>
                      <p className="mt-1 text-[11px] text-[#9a8b7a]">등록일 {formatDate(member.registeredAt)}</p>
                    </div>
                    <div className="grid gap-2 text-[11px] text-[#7a6d5c] sm:min-w-[220px]">
                      <div className="rounded-[12px] border border-[#e6dfd5] bg-white px-3 py-2">직분: {member.position ?? "미정"}</div>
                      <div className="rounded-[12px] border border-[#e6dfd5] bg-white px-3 py-2">이메일: {member.email ?? "없음"}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </div>
  );
}
