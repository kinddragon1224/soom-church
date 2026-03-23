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
    new: members.filter((member) => new Date(member.registeredAt) >= startOfMonth(new Date())).length,
    followup: members.filter((member) => member.requiresFollowUp).length,
    unassigned: members.filter((member) => !member.districtId || !member.groupId).length,
  };

  const filters = [
    { key: "all", label: "전체", value: counts.all },
    { key: "new", label: "이번 달 신규", value: counts.new },
    { key: "followup", label: "후속관리", value: counts.followup },
  ] as const;

  const primaryActions = [
    { label: "교인 등록", href: "/members/new", tone: "solid" },
    { label: "후속관리만", href: `?filter=followup`, tone: filter === "followup" ? "active" : "ghost" },
    { label: "미배정 점검", href: `?filter=all`, tone: "ghost" },
  ] as const;

  const actionRail = [
    {
      title: `후속관리 ${counts.followup}명`,
      note: "바로 연락",
      href: `?filter=followup`,
    },
    {
      title: `미배정 ${counts.unassigned}명`,
      note: "교구·목장 연결",
      href: `?filter=all`,
    },
    {
      title: `이번 달 신규 ${counts.new}명`,
      note: "첫 인사 점검",
      href: `?filter=new`,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] tracking-[0.2em] text-white/46">PEOPLE</p>
              <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[2.7rem]">
                사람 운영을
                <br />
                바로 정리해
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/66 sm:text-base">
                목록·후속·미배정을 한 화면에서 본다.
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
          <div className="mt-4 flex flex-wrap gap-2">
            {primaryActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={`inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm transition ${
                  action.tone === "solid"
                    ? "bg-white text-[#09111f]"
                    : action.tone === "active"
                      ? "border border-[#d4af37]/40 bg-[#d4af37]/14 text-[#f5e7be]"
                      : "border border-white/14 bg-white/5 text-white/84 hover:bg-white/10"
                }`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        <section className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">FILTERS</p>
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
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">먼저 할 일</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">우선순위</span>
            </div>
            <div className="mt-4 grid gap-2">
              {actionRail.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-center justify-between gap-3 rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] px-4 py-3 transition hover:bg-white"
                >
                  <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                  <span className="text-xs text-[#8c7a5b]">{item.note}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-3 border-b border-[#efe7da] pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">PEOPLE LIST</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">사람</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#8C7A5B]">
              <span className="rounded-full border border-[#eadfcd] bg-[#fff7e8] px-3 py-1 text-[#8C6A2E]">{members.length}명 표시</span>
              <span>{filter === "followup" ? "후속관리 보기" : filter === "new" ? "이번 달 신규" : "전체 보기"}</span>
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            <div className="hidden grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_120px_120px_auto] gap-3 px-3 text-[11px] tracking-[0.16em] text-[#9a8b7a] md:grid">
              <span>이름 / 상태</span>
              <span>연락처 / 소속</span>
              <span>직분</span>
              <span>등록일</span>
              <span className="text-right">액션</span>
            </div>

            {members.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">
                아직 표시할 사람이 없어. 회원가입 이후 사람 데이터를 추가하면 여기서 바로 관리할 수 있어.
              </div>
            ) : (
              members.map((member) => {
                const memberAction = member.requiresFollowUp
                  ? { label: "후속 확인", href: `?filter=followup` }
                  : !member.districtId || !member.groupId
                    ? { label: "배정 정리", href: `?filter=all` }
                    : { label: "상세 보기", href: `/members/${member.id}` };

                return (
                  <div
                    key={member.id}
                    className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] px-3 py-3 transition hover:border-[#dfd3bf] hover:bg-white"
                  >
                    <div className="flex flex-col gap-3 md:grid md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_120px_120px_auto] md:items-center md:gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-[#111111]">{member.name}</p>
                          <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{member.statusTag}</span>
                          {member.requiresFollowUp ? (
                            <span className="rounded-full border border-[#eadfcd] bg-[#fff7e8] px-2.5 py-1 text-[11px] text-[#8C6A2E]">후속관리</span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs text-[#7a6d5c]">{member.email ?? "이메일 없음"}</p>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm text-[#3f382f]">{member.phone}</p>
                        <p className="mt-1 truncate text-xs text-[#8c7a5b]">
                          {member.district?.name ?? "교구 미정"} / {member.group?.name ?? "목장 미정"}
                        </p>
                      </div>

                      <div>
                        <span className="inline-flex rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#6a5e51]">
                          {member.position ?? "직분 미정"}
                        </span>
                      </div>

                      <p className="text-xs text-[#8c7a5b] md:text-right">{formatDate(member.registeredAt)}</p>

                      <div className="flex items-center md:justify-end">
                        <Link
                          href={memberAction.href}
                          className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#e2d8c9] bg-white px-3 text-xs font-medium text-[#5f564b] transition hover:border-[#cbb594] hover:text-[#111111]"
                        >
                          {memberAction.label}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </section>
    </div>
  );
}
