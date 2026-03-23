import { requireWorkspaceMembership } from "@/lib/church-context";

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

  const settingsCards = [
    {
      title: "기본 정보",
      status: "확인 필요",
      desc: "교회 이름, 워크스페이스 주소, 시간대를 먼저 점검합니다.",
      items: [church.name, church.slug, church.timezone],
    },
    {
      title: "팀과 역할",
      status: "다음 단계",
      desc: "운영자, 팀원, 역할 구조를 정리할 준비를 합니다.",
      items: ["owner 설정됨", "팀원 초대 준비", "권한 구조 정리 예정"],
    },
    {
      title: "플랜과 결제",
      status: "무료 플랜",
      desc: "현재는 무료 플랜 기준으로 워크스페이스를 운영합니다.",
      items: ["FREE", "결제 연동 준비중", "사용량 지표 확장 예정"],
    },
  ] as const;

  const actionRail = [
    { title: "교회 이름 확인", desc: "실제 사용자에게 보이는 이름을 먼저 점검합니다." },
    { title: "팀원 초대 준비", desc: "함께 쓸 팀원과 역할을 정리할 준비를 합니다." },
    { title: "운영 기준 정리", desc: "사람/신청/공지 흐름의 기본 규칙을 잡습니다." },
  ] as const;

  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] tracking-[0.2em] text-white/46">WORKSPACE SETTINGS</p>
              <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[2.7rem]">
                워크스페이스 기본값을
                <br />
                짧고 명확하게 정리합니다
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                실사용 전에 꼭 필요한 기본 정보와 운영 기준만 먼저 확인하는 설정 화면입니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[240px] lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">{church.name}</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">settings</span>
            </div>
          </div>
        </div>

        <section className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">GET READY</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">먼저 확인할 것</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">settings</span>
          </div>
          <div className="mt-4 grid gap-3">
            {actionRail.map((item) => (
              <div key={item.title} className="rounded-[18px] border border-[#ece6dc] bg-white p-4">
                <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {settingsCards.map((card) => (
          <section key={card.title} className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[#111111]">{card.title}</h2>
              <span className="rounded-full border border-[#eadfcd] bg-[#fff7e8] px-2.5 py-1 text-[11px] text-[#8C6A2E]">{card.status}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#5f564b]">{card.desc}</p>
            <div className="mt-4 grid gap-2">
              {card.items.map((item) => (
                <div key={item} className="rounded-[14px] border border-[#e6dfd5] bg-[#fcfbf8] px-3 py-2 text-sm text-[#111111]">
                  {item}
                </div>
              ))}
            </div>
          </section>
        ))}
      </section>
    </div>
  );
}
