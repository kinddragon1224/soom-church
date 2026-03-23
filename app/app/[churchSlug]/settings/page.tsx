import Link from "next/link";
import { requireWorkspaceMembership } from "@/lib/church-context";

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

  const setupChecklist = [
    {
      title: "기본 정보 점검",
      desc: "사용자에게 보이는 이름, 주소, 시간대를 먼저 확인합니다.",
      tone: "ready",
      status: "바로 확인 가능",
      href: "#profile-fields",
    },
    {
      title: "팀 운영 규칙 준비",
      desc: "역할별 권한과 초대 흐름을 정리할 순서를 먼저 맞춥니다.",
      tone: "review",
      status: "운영 기준 필요",
      href: `${basePath}/members`,
    },
    {
      title: "기본 동작값 정의",
      desc: "신청, 공지, 후속관리의 기본 리듬을 설정할 준비를 합니다.",
      tone: "next",
      status: "다음 청크",
      href: "#default-rules",
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
      desc: "실제 초대 화면을 붙이기 전에 역할 기준을 먼저 고정할 수 있게 준비합니다.",
      tone: "review",
      status: "역할 기준 정리",
      rows: [
        { label: "현재 멤버십", value: membership.role, hint: "현재 로그인한 사용자의 기본 권한입니다." },
        { label: "권장 운영 역할", value: "담당 사역자 / 행정 / 콘텐츠", hint: "역할명은 다음 단계에서 실제 권한값으로 나눌 예정입니다." },
        { label: "초대 흐름", value: "목록 → 역할 선택 → 안내 발송", hint: "멤버 목록 화면과 연결되는 최소 흐름으로 설계합니다." },
      ],
    },
  ] as const;

  const defaultRules = [
    {
      label: "신규 신청 기본 처리",
      value: "접수 → 확인중 → 안내 연결",
      desc: "신청 화면 상태 구조와 같은 리듬으로 맞춥니다.",
    },
    {
      label: "공지 전달 기준",
      value: "고정 / 이번 주 전달 / 지난 공지",
      desc: "공지 목록에서 바로 쓰는 3단 구조를 기본값으로 둡니다.",
    },
    {
      label: "후속관리 리듬",
      value: "당일 확인 → 담당자 배정 → 후속 완료",
      desc: "사람 목록과 연결되는 운영 기준을 짧게 고정합니다.",
    },
  ] as const;

  const nextActions = [
    { label: "멤버 역할 기준 보기", href: `${basePath}/members`, note: "팀 구조와 연결" },
    { label: "신청 상태 흐름 보기", href: `${basePath}/applications`, note: "기본 처리 규칙 확인" },
    { label: "공지 전달 리듬 보기", href: `${basePath}/notices`, note: "전달 상태와 연결" },
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
                아직 복잡한 설정 화면을 늘리기보다, 지금 바로 점검하고 다음 작업과 연결되는 핵심 값만 먼저 정리합니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[260px] lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">{church.name}</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">settings</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">edit flow prep</span>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">PROFILE</p>
              <p className="mt-2 text-2xl font-semibold">3개</p>
              <p className="mt-2 text-xs text-white/60">먼저 점검할 기본 항목</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">TEAM</p>
              <p className="mt-2 text-2xl font-semibold">역할 기준</p>
              <p className="mt-2 text-xs text-white/60">다음 단계 초대 흐름 준비</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">DEFAULTS</p>
              <p className="mt-2 text-2xl font-semibold">3단 규칙</p>
              <p className="mt-2 text-xs text-white/60">신청 · 공지 · 후속관리 기준</p>
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
                  <div
                    key={row.label}
                    className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] px-3 py-3 transition hover:border-[#dfd3bf] hover:bg-white"
                  >
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
        </div>

        <div className="grid gap-4">
          <section id="default-rules" className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">DEFAULT RULES</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">기본 동작값 초안</h2>
              </div>
              <span className="rounded-full border border-[#d9e3f5] bg-[#eff4ff] px-3 py-1 text-[11px] text-[#365b96]">다음 단계 연결</span>
            </div>
            <div className="mt-4 grid gap-3">
              {defaultRules.map((rule) => (
                <div key={rule.label} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#111111]">{rule.label}</p>
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">초안</span>
                  </div>
                  <p className="mt-2 text-sm text-[#3f382f]">{rule.value}</p>
                  <p className="mt-2 text-xs leading-5 text-[#7a6d5c]">{rule.desc}</p>
                </div>
              ))}
            </div>
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
