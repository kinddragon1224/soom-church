import Link from "next/link";
import { OrganizationUnitType } from "@prisma/client";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { prisma } from "@/lib/prisma";
import {
  createDistrictDefault,
  createGroupDefault,
  createHouseholdDefault,
  updateChurchTerminology,
} from "./actions";

const statusTone = {
  ready: "border-[#d7e8dc] bg-[#eefbf3] text-[#2d7a46]",
  review: "border-[#eadfcd] bg-[#fff7e8] text-[#8C6A2E]",
  next: "border-[#d9e3f5] bg-[#eff4ff] text-[#365b96]",
} as const;

export default async function WorkspaceSettingsPage({ params }: { params: { churchSlug: string } }) {
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
  const basePath = `/app/${church.slug}`;

  const [households, districts, groups, labels] = await Promise.all([
    prisma.household.findMany({ where: { churchId: church.id }, orderBy: { name: "asc" }, take: 12 }),
    prisma.district.findMany({ where: { churchId: church.id }, orderBy: { name: "asc" }, take: 12 }),
    prisma.group.findMany({ where: { churchId: church.id }, include: { district: true }, orderBy: { name: "asc" }, take: 12 }),
    prisma.organizationUnitLabel.findMany({ where: { churchId: church.id }, orderBy: { type: "asc" } }),
  ]);

  const districtLabel = labels.find((item) => item.type === OrganizationUnitType.DISTRICT);
  const departmentLabel = labels.find((item) => item.type === OrganizationUnitType.DEPARTMENT);
  const groupLabel = labels.find((item) => item.type === OrganizationUnitType.GROUP);

  const setupChecklist = [
    {
      title: "기본 정보 점검",
      desc: "사용자에게 보이는 이름, 주소, 시간대를 먼저 확인합니다.",
      tone: "ready",
      status: "바로 확인 가능",
      href: "#profile-fields",
    },
    {
      title: "사람 기본값 등록",
      desc: "가족, 교구, 목장처럼 등록 폼에서 바로 쓰는 선택값을 여기서 준비합니다.",
      tone: "review",
      status: "실제 입력 가능",
      href: "#member-defaults",
    },
    {
      title: "용어 기준 정리",
      desc: "교구 / 부서 / 목장처럼 보이는 이름을 교회 문맥에 맞게 맞춥니다.",
      tone: "next",
      status: "즉시 수정 가능",
      href: "#terminology",
    },
  ] as const;

  const fieldGroups = [
    {
      id: "profile-fields",
      eyebrow: "WORKSPACE PROFILE",
      title: "기본 정보",
      desc: "가장 먼저 바뀌어야 하는 기본값만 gloo식으로 짧게 확인합니다.",
      tone: "ready",
      status: "현재값 점검",
      rows: [
        { label: "교회 이름", value: church.name, hint: "메인 화면과 안내 문구에 노출됩니다." },
        { label: "워크스페이스 주소", value: church.slug, hint: "링크 공유와 로그인 이후 진입 경로에 사용됩니다." },
        { label: "시간대", value: church.timezone, hint: "일정과 등록 시각 표시 기준입니다." },
      ],
    },
    {
      id: "team-fields",
      eyebrow: "TEAM ACCESS",
      title: "팀과 역할",
      desc: "실제 초대 화면을 붙이기 전에 역할 기준과 입력 구조를 먼저 고정할 수 있게 준비합니다.",
      tone: "review",
      status: "역할 기준 정리",
      rows: [
        { label: "현재 멤버십", value: membership.role, hint: "현재 로그인한 사용자의 기본 권한입니다." },
        { label: "권장 운영 역할", value: "담당 사역자 / 행정 / 콘텐츠", hint: "역할명은 다음 단계에서 실제 권한값으로 나눌 예정입니다." },
        { label: "초대 흐름", value: "목록 → 역할 선택 → 안내 발송", hint: "멤버 목록 화면과 연결되는 최소 흐름으로 설계합니다." },
      ],
    },
  ] as const;

  const nextActions = [
    { label: "멤버 역할 기준 보기", href: `${basePath}/members`, note: "팀 구조와 연결" },
    { label: "조직 구조 보기", href: `${basePath}/organizations`, note: "교구/부서/목장 구조 확인" },
    { label: "신청 상태 흐름 보기", href: `${basePath}/applications`, note: "기본 처리 규칙 확인" },
  ] as const;

  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] tracking-[0.2em] text-white/46">WORKSPACE SETTINGS</p>
              <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[2.7rem]">
                기본 설정을
                <br />
                실제 편집 흐름으로 준비합니다
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                사람 등록 폼에서 반복해서 쓰는 기본값과 용어를 여기서 관리하도록 올렸어. 이제 가족, 교구, 목장은 설정에서 먼저 넣고 쓰면 돼.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[260px] lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">{church.name}</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">settings</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">member defaults</span>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">가족</p>
              <p className="mt-2 text-2xl font-semibold">{households.length}</p>
              <p className="mt-2 text-xs text-white/60">등록된 기본 가정</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">교구</p>
              <p className="mt-2 text-2xl font-semibold">{districts.length}</p>
              <p className="mt-2 text-xs text-white/60">등록 폼 선택값</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">목장</p>
              <p className="mt-2 text-2xl font-semibold">{groups.length}</p>
              <p className="mt-2 text-xs text-white/60">교구 아래 기본 구조</p>
            </div>
          </div>
        </div>

        <section className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">SETUP CHECKLIST</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">지금 먼저 할 준비</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">settings</span>
          </div>
          <div className="mt-4 grid gap-3">
            {setupChecklist.map((item) => (
              <Link key={item.title} href={item.href} className="rounded-[18px] border border-[#ece6dc] bg-white p-4 transition hover:bg-[#fcfbf8]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.desc}</p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] ${statusTone[item.tone]}`}>{item.status}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
        <div className="grid gap-4">
          {fieldGroups.map((group) => (
            <section key={group.id} id={group.id} className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
              <div className="flex flex-col gap-3 border-b border-[#efe7da] pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">{group.eyebrow}</p>
                  <h2 className="mt-2 text-lg font-semibold text-[#111111]">{group.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{group.desc}</p>
                </div>
                <span className={`w-fit rounded-full border px-3 py-1 text-[11px] ${statusTone[group.tone]}`}>{group.status}</span>
              </div>

              <div className="mt-4 grid gap-2">
                <div className="hidden grid-cols-[160px_minmax(0,1fr)_220px] gap-3 px-3 text-[11px] tracking-[0.16em] text-[#9a8b7a] md:grid">
                  <span>항목</span>
                  <span>현재값</span>
                  <span>설명</span>
                </div>
                {group.rows.map((row) => (
                  <div key={row.label} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] px-3 py-3 transition hover:border-[#dfd3bf] hover:bg-white">
                    <div className="flex flex-col gap-2 md:grid md:grid-cols-[160px_minmax(0,1fr)_220px] md:items-center md:gap-3">
                      <p className="text-sm font-semibold text-[#111111]">{row.label}</p>
                      <div className="rounded-[14px] border border-[#e6dfd5] bg-white px-3 py-2 text-sm text-[#111111]">{row.value}</div>
                      <p className="text-xs leading-5 text-[#7a6d5c]">{row.hint}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section id="member-defaults" className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#efe7da] pb-4">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">MEMBER DEFAULTS</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">사람 등록 기본값</h2>
                <p className="mt-2 text-sm leading-6 text-[#5f564b]">사람 등록 폼의 가족 / 교구 / 목장 선택값은 여기서 먼저 추가하면 기본 옵션으로 바로 보여.</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-3">
              <div className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                <p className="text-sm font-semibold text-[#111111]">가족 기본값</p>
                <form action={createHouseholdDefault.bind(null, params.churchSlug)} className="mt-3 grid gap-3">
                  <input name="name" placeholder="예: 김가정, 3구역 새가족" className="rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]" />
                  <input name="address" placeholder="주소 메모" className="rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]" />
                  <textarea name="notes" placeholder="가족 설명 / 메모" className="min-h-[88px] rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]" />
                  <button className="rounded-[12px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">가족 추가</button>
                </form>
                <div className="mt-3 grid gap-2">
                  {households.map((item) => (
                    <div key={item.id} className="rounded-[14px] border border-[#e6dfd5] bg-white px-3 py-2 text-sm text-[#111111]">{item.name}</div>
                  ))}
                </div>
              </div>

              <div className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                <p className="text-sm font-semibold text-[#111111]">교구 기본값</p>
                <form action={createDistrictDefault.bind(null, params.churchSlug)} className="mt-3 grid gap-3">
                  <input name="name" placeholder="예: 1교구, 청장년교구" className="rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]" />
                  <input name="leadName" placeholder="담당자 / 리더명" className="rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]" />
                  <button className="rounded-[12px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">교구 추가</button>
                </form>
                <div className="mt-3 grid gap-2">
                  {districts.map((item) => (
                    <div key={item.id} className="rounded-[14px] border border-[#e6dfd5] bg-white px-3 py-2 text-sm text-[#111111]">{item.name}</div>
                  ))}
                </div>
              </div>

              <div className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                <p className="text-sm font-semibold text-[#111111]">목장 기본값</p>
                <form action={createGroupDefault.bind(null, params.churchSlug)} className="mt-3 grid gap-3">
                  <select name="districtId" defaultValue="" className="rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]">
                    <option value="">소속 교구 선택</option>
                    {districts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                  <input name="name" placeholder="예: 소망 목장, 청년 2목장" className="rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]" />
                  <button className="rounded-[12px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">목장 추가</button>
                </form>
                <div className="mt-3 grid gap-2">
                  {groups.map((item) => (
                    <div key={item.id} className="rounded-[14px] border border-[#e6dfd5] bg-white px-3 py-2 text-sm text-[#111111]">{item.name} <span className="text-xs text-[#8C7A5B]">· {item.district.name}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-4">
          <section id="terminology" className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">TERMINOLOGY</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">교회별 용어</h2>
              </div>
              <span className="rounded-full border border-[#d9e3f5] bg-[#eff4ff] px-3 py-1 text-[11px] text-[#365b96]">교구 / 부서 / 목장</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">조직 화면과 설정 화면에서 보이는 기본 용어를 여기서 맞춘다. 지금은 교구 / 부서 / 목장 기준으로 정리해뒀어.</p>
            <form action={updateChurchTerminology.bind(null, params.churchSlug)} className="mt-4 grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="districtSingular" defaultValue={districtLabel?.singular ?? "교구"} placeholder="교구 단수형" className="rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]" />
                <input name="districtPlural" defaultValue={districtLabel?.plural ?? districtLabel?.singular ?? "교구"} placeholder="교구 복수형" className="rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]" />
                <input name="departmentSingular" defaultValue={departmentLabel?.singular ?? "부서"} placeholder="부서 단수형" className="rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]" />
                <input name="departmentPlural" defaultValue={departmentLabel?.plural ?? departmentLabel?.singular ?? "부서"} placeholder="부서 복수형" className="rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]" />
                <input name="groupSingular" defaultValue={groupLabel?.singular ?? "목장"} placeholder="목장 단수형" className="rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]" />
                <input name="groupPlural" defaultValue={groupLabel?.plural ?? groupLabel?.singular ?? "목장"} placeholder="목장 복수형" className="rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]" />
              </div>
              <button className="rounded-[12px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">용어 저장</button>
            </form>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">CONNECTED PAGES</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">바로 이어서 볼 화면</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">gloo식 연결</span>
            </div>
            <div className="mt-4 grid gap-3">
              {nextActions.map((action) => (
                <Link key={action.label} href={action.href} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 transition hover:bg-white">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#111111]">{action.label}</p>
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{action.note}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
