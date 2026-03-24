import { OrganizationUnitType } from "@prisma/client";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getChurchOrganizationOverview } from "@/lib/organization-data";
import { createOrganizationUnit, updateOrganizationLabel, updateOrganizationUnit } from "./actions";

const ORGANIZATION_TYPE_OPTIONS = [
  { value: OrganizationUnitType.CONGREGATION, label: "회중" },
  { value: OrganizationUnitType.DISTRICT, label: "교구" },
  { value: OrganizationUnitType.GROUP, label: "목장/소그룹" },
  { value: OrganizationUnitType.DEPARTMENT, label: "부서" },
  { value: OrganizationUnitType.MINISTRY, label: "사역" },
  { value: OrganizationUnitType.FELLOWSHIP, label: "선교회/친교" },
  { value: OrganizationUnitType.WORSHIP_COMMUNITY, label: "예배 공동체" },
  { value: OrganizationUnitType.SPECIAL_COMMUNITY, label: "특별 공동체" },
  { value: OrganizationUnitType.FAMILY_UNIT, label: "가정 단위" },
  { value: OrganizationUnitType.CUSTOM, label: "직접 정의" },
] as const;

function getTypeLabel(type: OrganizationUnitType) {
  return ORGANIZATION_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;
}

export default async function ChurchOrganizationsPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  const church = membership.church;
  const { labels, units } = await getChurchOrganizationOverview(church.id);

  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <p className="text-[11px] tracking-[0.2em] text-white/46">ORGANIZATION STRUCTURE</p>
          <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[2.7rem]">
            교회별 용어로 조직을
            <br />
            실사용 구조로 관리합니다
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
            교구, 부서, 사역, 선교회처럼 교회마다 다른 용어를 그대로 쓰되 내부 구조는 중립적으로 유지하고,
            연결된 사람과 상위/하위 조직을 바로 손볼 수 있게 정리하는 화면이야.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">조직 수</p>
              <p className="mt-2 text-2xl font-semibold">{units.length}</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">용어 수</p>
              <p className="mt-2 text-2xl font-semibold">{labels.length}</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">교회</p>
              <p className="mt-2 text-sm font-semibold">{church.name}</p>
            </div>
          </div>
        </div>

        <section className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">CREATE ORGANIZATION</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">조직 추가</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">add unit</span>
          </div>
          <form action={createOrganizationUnit.bind(null, params.churchSlug)} className="mt-4 grid gap-3">
            <input name="name" placeholder="예: 2교구, 청년부, 새가족팀" className="rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]" />
            <select name="type" defaultValue={OrganizationUnitType.DISTRICT} className="rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]">
              {ORGANIZATION_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select name="parentId" defaultValue="" className="rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]">
              <option value="">상위 조직 없음</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>{unit.name} · {getTypeLabel(unit.type)}</option>
              ))}
            </select>
            <input name="slug" placeholder="슬러그(비우면 자동 생성)" className="rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]" />
            <button className="rounded-[14px] bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-white">조직 생성</button>
          </form>
        </section>
      </section>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">LABELS</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">교회별 용어</h2>
          </div>
          <span className="text-xs text-[#8C7A5B]">singular / plural</span>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {labels.map((label) => (
            <form key={label.id} action={updateOrganizationLabel.bind(null, params.churchSlug)} className="rounded-[18px] border border-[#ece6dc] bg-[#fcfbf8] p-4">
              <input type="hidden" name="type" value={label.type} />
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#111111]">{getTypeLabel(label.type)}</p>
                <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{label.type}</span>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input name="singular" defaultValue={label.singular} placeholder="단수형" className="rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]" />
                <input name="plural" defaultValue={label.plural ?? ""} placeholder="복수형" className="rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]" />
              </div>
              <button className="mt-3 rounded-[12px] border border-[#d8cfbf] bg-white px-3 py-2 text-sm font-semibold text-[#3f3528]">용어 저장</button>
            </form>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">ORGANIZATION LIST</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">조직 구조</h2>
          </div>
          <span className="text-xs text-[#8C7A5B]">상위 조직 · 연결 인원 · 빠른 수정</span>
        </div>
        <div className="mt-4 grid gap-4">
          {units.map((unit) => (
            <div key={unit.id} className="rounded-[20px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-[#111111]">{unit.name}</p>
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{getTypeLabel(unit.type)}</span>
                    {unit.parent ? <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">상위 · {unit.parent.name}</span> : null}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#6d6254]">
                    <span className="rounded-full bg-white px-3 py-1">연결 인원 {unit._count.memberLinks}</span>
                    <span className="rounded-full bg-white px-3 py-1">하위 조직 {unit._count.children}</span>
                    <span className="rounded-full bg-white px-3 py-1">slug {unit.slug}</span>
                  </div>
                </div>
                <form action={updateOrganizationUnit.bind(null, params.churchSlug)} className="grid gap-3 rounded-[18px] border border-[#e7dfd4] bg-white p-4 xl:min-w-[460px] xl:grid-cols-[minmax(0,1fr)_160px_160px_auto]">
                  <input type="hidden" name="unitId" value={unit.id} />
                  <input name="name" defaultValue={unit.name} className="rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]" />
                  <select name="type" defaultValue={unit.type} className="rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]">
                    {ORGANIZATION_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <select name="parentId" defaultValue={unit.parent?.id ?? ""} className="rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]">
                    <option value="">상위 조직 없음</option>
                    {units.filter((candidate) => candidate.id !== unit.id).map((candidate) => (
                      <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
                    ))}
                  </select>
                  <button className="rounded-[14px] bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-white">수정</button>
                </form>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
                {unit.memberLinks.length === 0 ? (
                  <div className="rounded-[16px] border border-dashed border-[#dccfb9] bg-white p-4 text-sm text-[#5f564b]">아직 연결된 인원이 없어. 성도 상세에서 먼저 소속을 붙이면 여기서 바로 보여.</div>
                ) : (
                  unit.memberLinks.map((link) => (
                    <div key={link.id} className="rounded-[16px] border border-[#ece6dc] bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[#111111]">{link.member.name}</p>
                        <span className="rounded-full border border-[#e6dfd5] bg-[#fcfbf8] px-2.5 py-1 text-[11px] text-[#8C7A5B]">{link.customRoleLabel ?? link.role}</span>
                      </div>
                      <p className="mt-2 text-xs text-[#7a6e5d]">{link.member.district?.name ?? "교구 미정"} / {link.member.group?.name ?? "목장 미정"}</p>
                      <p className="mt-1 text-xs text-[#7a6e5d]">상태 · {link.member.statusTag}{link.isPrimary ? " · 주 소속" : ""}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
