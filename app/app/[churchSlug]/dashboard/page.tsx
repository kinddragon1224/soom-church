import Link from "next/link";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getWorkspaceDashboardData } from "@/lib/workspace-data";
import { getChurchStructureMap } from "@/lib/visualization-data";
import GidoDashboardPage from "./gido-dashboard";

const statusTone: Record<string, string> = {
  새가족: "bg-[#E8F1FF] text-[#295FA8] border-[#C9DCF8]",
  정착중: "bg-[#EEF8EA] text-[#2F6B2F] border-[#D5EACF]",
  심방필요: "bg-[#FFF1E5] text-[#A35A11] border-[#F1D5B6]",
  후속필요: "bg-[#FFF0F0] text-[#A33D3D] border-[#F0D0D0]",
  안정: "bg-[#F5F1EA] text-[#6D6255] border-[#E4DACE]",
  정착완료: "bg-[#F1F8EF] text-[#406C3C] border-[#D8E8D3]",
};

function badgeClass(statusTag: string) {
  return statusTone[statusTag] ?? "bg-[#F5F1EA] text-[#6D6255] border-[#E4DACE]";
}

export default async function ChurchDashboardPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  const church = membership.church;
  if (church.slug === "gido") {
    return <GidoDashboardPage />;
  }

  const base = `/app/${church.slug}`;
  const [summary, structure] = await Promise.all([
    getWorkspaceDashboardData(church.id),
    getChurchStructureMap(church.id),
  ]);

  const totalGroups = structure.reduce((acc, district) => acc + district.groups.length, 0);
  const totalFamilies = structure.reduce(
    (acc, district) => acc + district.groups.reduce((groupAcc, group) => groupAcc + group.familyCount, 0),
    0,
  );

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="overflow-hidden rounded-[30px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_58%,#243252_100%)] text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
        <div className="grid gap-px bg-white/10 xl:grid-cols-[minmax(0,1.2fr)_420px]">
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] tracking-[0.2em] text-white/46">GRAPH WORKSPACE</p>
              <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] text-white/70">OBSIDIAN MODE</span>
            </div>
            <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[2.8rem]">
              교회의 연결 구조를
              <br />
              그래프로 읽는다
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/66">
              전교인을 리스트가 아니라 그래프로 읽는다. 개인, 가족, 목장, 교구, 사역 연결이 군집으로 보이고 후속 상태는 오버레이처럼 읽히는 그래프 워크스페이스 프로토타입이다.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[18px] border border-white/10 bg-white/8 px-4 py-3">
                <p className="text-[11px] tracking-[0.16em] text-white/42">교구</p>
                <p className="mt-2 text-2xl font-semibold text-white">{structure.length}</p>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/8 px-4 py-3">
                <p className="text-[11px] tracking-[0.16em] text-white/42">목장</p>
                <p className="mt-2 text-2xl font-semibold text-white">{totalGroups}</p>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/8 px-4 py-3">
                <p className="text-[11px] tracking-[0.16em] text-white/42">가정</p>
                <p className="mt-2 text-2xl font-semibold text-white">{totalFamilies}</p>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/8 px-4 py-3">
                <p className="text-[11px] tracking-[0.16em] text-white/42">전체 인원</p>
                <p className="mt-2 text-2xl font-semibold text-white">{summary.totalMembers}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-white/10">
            <div className="bg-white/6 px-5 py-4 sm:px-6">
              <p className="text-[11px] tracking-[0.18em] text-white/46">OVERLAY</p>
              <h2 className="mt-2 text-lg font-semibold text-white">운영 상태</h2>
            </div>
            <div className="grid gap-px bg-white/10 text-sm">
              <div className="grid grid-cols-[1fr_auto] bg-white/4 px-5 py-4 sm:px-6"><span className="text-white/68">후속 필요</span><span className="font-semibold text-[#F8D089]">{summary.followUpMembers}명</span></div>
              <div className="grid grid-cols-[1fr_auto] bg-white/4 px-5 py-4 sm:px-6"><span className="text-white/68">심방 필요</span><span className="font-semibold text-[#F8D089]">{summary.visitNeededMembers}명</span></div>
              <div className="grid grid-cols-[1fr_auto] bg-white/4 px-5 py-4 sm:px-6"><span className="text-white/68">미배정</span><span className="font-semibold text-[#F8D089]">{summary.unassignedMembers}명</span></div>
              <div className="grid grid-cols-[1fr_auto] bg-white/4 px-5 py-4 sm:px-6"><span className="text-white/68">이번 달 등록</span><span className="font-semibold text-[#F8D089]">{summary.newThisMonth}명</span></div>
            </div>
            <div className="bg-white/6 px-5 py-4 sm:px-6">
              <div className="flex flex-wrap gap-2 text-xs">
                <Link href={`${base}/members`} className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-white/82">사람</Link>
                <Link href={`${base}/records`} className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-white/82">기록</Link>
                <Link href={`${base}/notices`} className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-white/82">공지</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="overflow-hidden rounded-[24px] border border-[#e6dfd5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between border-b border-[#efe7da] px-5 py-4">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">GRAPH VIEW</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">교회 그래프 워크스페이스</h2>
            </div>
            <span className="text-xs text-[#8C7A5B]">옵시디언 감각 프로토타입</span>
          </div>

          <div className="grid gap-4 p-5">
            {structure.map((district) => (
              <div key={district.id} className="rounded-[22px] border border-[#E7E0D4] bg-[#FCFBF8] p-4">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#ECE4D8] pb-3">
                  <div>
                    <p className="text-[11px] tracking-[0.18em] text-[#9A8B7A]">DISTRICT</p>
                    <h3 className="mt-2 text-xl font-semibold text-[#111111]">{district.name}</h3>
                  </div>
                  <p className="text-xs text-[#8C7A5B]">목장 {district.groups.length}개</p>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  {district.groups.map((group) => (
                    <div key={group.id} className="rounded-[18px] border border-[#E7E0D4] bg-white p-4 shadow-[0_6px_18px_rgba(15,23,42,0.03)]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#111111]">{group.name}</p>
                          <p className="mt-1 text-xs text-[#8C7A5B]">가정 {group.familyCount} · 인원 {group.memberCount}</p>
                        </div>
                        <div className="flex flex-wrap justify-end gap-1.5 text-[11px]">
                          <span className="rounded-full border border-[#E7E0D4] bg-[#FBF9F4] px-2.5 py-1">후속 {group.followUpCount}</span>
                          <span className="rounded-full border border-[#E7E0D4] bg-[#FBF9F4] px-2.5 py-1">심방 {group.visitCount}</span>
                          <span className="rounded-full border border-[#E7E0D4] bg-[#FBF9F4] px-2.5 py-1">새가족 {group.newCount}</span>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2">
                        {group.families.slice(0, 4).map((family) => (
                          <div key={family.id} className="rounded-[14px] border border-[#EFE7DA] bg-[#FCFBF8] px-3 py-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-medium text-[#111111]">{family.name}</p>
                              <span className="text-[11px] text-[#8C7A5B]">{family.members.length}명</span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {family.members.map((member) => (
                                <Link
                                  key={member.id}
                                  href={`${base}/members/${member.id}`}
                                  className={`rounded-full border px-2.5 py-1 text-[11px] ${badgeClass(member.statusTag)}`}
                                >
                                  {member.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-4">
          <section className="overflow-hidden rounded-[24px] border border-[#e6dfd5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between border-b border-[#efe7da] px-5 py-4">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">STATUS</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">상태 범례</h2>
              </div>
            </div>
            <div className="grid gap-2 p-5 text-sm">
              {Object.keys(statusTone).map((status) => (
                <div key={status} className="flex items-center justify-between rounded-[14px] border border-[#EFE7DA] bg-[#FCFBF8] px-3 py-3">
                  <span>{status}</span>
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] ${badgeClass(status)}`}>예시</span>
                </div>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-[24px] border border-[#e6dfd5] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between border-b border-[#efe7da] px-5 py-4">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">NEXT BUILD</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">다음 작업</h2>
              </div>
            </div>
            <div className="grid gap-2 p-5 text-sm text-[#5F564B]">
              <div className="rounded-[14px] border border-[#EFE7DA] bg-[#FCFBF8] px-3 py-3">1. force-directed 그래프 레이아웃으로 전환</div>
              <div className="rounded-[14px] border border-[#EFE7DA] bg-[#FCFBF8] px-3 py-3">2. 노드 선택 시 우측 상세 패널 연결</div>
              <div className="rounded-[14px] border border-[#EFE7DA] bg-[#FCFBF8] px-3 py-3">3. 후속 / 심방 / 부서 오버레이 강화</div>
              <div className="rounded-[14px] border border-[#EFE7DA] bg-[#FCFBF8] px-3 py-3">4. 온보딩 입력 후 그래프 자동 생성 연결</div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
