import Link from "next/link";
import GidoActivityPanel from "./gido-activity-panel";
import { getGidoWorkspaceData } from "@/lib/gido-workspace-data";

export default async function GidoDashboardPage({
  churchId,
  base,
  currentUserName,
}: {
  churchId: string;
  base: string;
  currentUserName?: string;
}) {
  const data = await getGidoWorkspaceData(churchId);
  const displayName = currentUserName?.split(" ").pop() ?? "목자";
  const highlightHousehold = data.households[0];
  const urgentFollowUps = data.followUps.slice(0, 4);
  const feedItems = [
    ...data.updates.slice(0, 4).map((item) => ({ title: item.title, note: item.body, meta: item.due ? `일정 ${item.due}` : "근황 기록" })),
    ...data.followUps.slice(0, 4).map((item) => ({ title: item.title, note: item.note, meta: `후속 · ${item.due}` })),
  ].slice(0, 6);
  const notificationItems = data.members
    .filter((member) => member.requiresFollowUp)
    .slice(0, 6)
    .map((member) => ({ title: `${member.name} 확인 필요`, note: `${member.householdName} · ${member.statusTag}`, meta: "후속 필요" }));

  const steps = [
    { label: "목원 상태 확인", action: "보기", href: `${base}/members`, done: data.members.length > 0 },
    { label: "이번 주 후속 정리", action: "열기", href: `${base}/dashboard#followups`, done: data.followUps.length > 0 },
    { label: "근황 기록 확인", action: "열기", href: `${base}/dashboard#updates`, done: data.updates.length > 0 },
    { label: "새 목원 등록", action: "추가", href: `${base}/members/new`, done: false },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 rounded-[28px] border border-[#ece4d9] bg-white px-6 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-[2rem] font-semibold tracking-[-0.06em] text-[#111111]">{displayName}, 오늘 볼 건 이것뿐이야</h1>
          <p className="mt-1 text-sm leading-6 text-[#6b5f50]">중보, 후속, 목원 흐름만 바로 정리할 수 있게 묶었어.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`${base}/members`} className="rounded-[14px] border border-[#e6dfd5] bg-white px-4 py-2.5 text-sm font-medium text-[#171717]">
            목원 관리
          </Link>
          <Link href={`${base}/members/new`} className="rounded-[14px] bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white">
            새 목원 추가
          </Link>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_1fr_0.88fr]">
        <article className="rounded-[28px] border border-[#ebe4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <p className="text-[11px] tracking-[0.18em] text-[#8f8478]">이번 주 시작</p>
          <h2 className="mt-2 text-[1.4rem] font-semibold tracking-[-0.05em] text-[#111111]">목장 첫 행동만 남겼어</h2>
          <div className="mt-5 space-y-4">
            {steps.map((step, index) => (
              <div key={step.label} className="flex items-center justify-between gap-3 rounded-[18px] border border-[#eee8de] bg-[#fcfbf8] px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] ${step.done ? "border-[#111827] bg-[#111827] text-white" : "border-[#d8cdbd] text-[#8f8478]"}`}>
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium text-[#171717]">{step.label}</p>
                </div>
                <Link href={step.href} className="rounded-[12px] bg-[#111827] px-3 py-2 text-xs font-semibold text-white">
                  {step.action}
                </Link>
              </div>
            ))}
          </div>
        </article>

        <GidoActivityPanel feed={feedItems} notifications={notificationItems} />

        <article className="overflow-hidden rounded-[28px] border border-[#ebe4d8] bg-[linear-gradient(180deg,#2d6d46_0%,#111827_100%)] p-5 text-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-white/70">이번 주 중보</p>
              <h2 className="mt-3 text-[2rem] font-semibold leading-[1.02] tracking-[-0.06em]">
                {highlightHousehold ? highlightHousehold.title : data.groupName}
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/78">
                {highlightHousehold?.prayers[0] ?? "이번 주 함께 품을 기도제목부터 차분히 정리해봐."}
              </p>
            </div>
            <div className="mt-8">
              <Link href={`${base}/dashboard#households`} className="inline-flex rounded-[14px] bg-white px-4 py-2.5 text-sm font-semibold text-[#111827]">
                가정별 중보 보기
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <MiniCard
          title="목원 보기"
          desc="등록된 목원과 가정을 한 번에 보고 상태를 정리해."
          href={`${base}/members`}
        />
        <MiniCard
          title="후속 확인"
          desc="이번 주 챙겨야 하는 사람과 일정만 따로 모아서 봐."
          href={`${base}/dashboard#followups`}
        />
        <MiniCard
          title="가정별 중보"
          desc="가정별 기도제목과 함께 품는 이름을 한 화면에서 봐."
          href={`${base}/dashboard#households`}
        />
      </section>

      <section id="followups" className="grid gap-4 xl:grid-cols-[0.98fr_1.02fr]">
        <section className="rounded-[28px] border border-[#ebe4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <Header title="이번 주 챙길 사람" count={`${data.followUps.length}건`} />
          <div className="mt-4 space-y-3">
            {urgentFollowUps.map((item) => (
              <article key={`${item.title}-${item.due}`} className="rounded-[18px] border border-[#eee8de] bg-[#fcfbf8] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#171717]">{item.title}</p>
                  <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.priority}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.note}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#7a6d5c]">
                  <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1">기한 {item.due}</span>
                  {item.owner ? <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1">담당 {item.owner}</span> : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="updates" className="rounded-[28px] border border-[#ebe4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <Header title="최근 근황 기록" count={`${data.updates.length}건`} />
          <div className="mt-4 space-y-3">
            {data.updates.map((item) => (
              <article key={`${item.title}-${item.due ?? "x"}`} className="rounded-[18px] border border-[#eee8de] bg-[#fcfbf8] p-4">
                <p className="text-sm font-semibold text-[#171717]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.body}</p>
                {item.note ? <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.note}</p> : null}
              </article>
            ))}
          </div>
        </section>
      </section>

      <section id="households" className="rounded-[28px] border border-[#ebe4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
        <Header title="가정별 중보" count={`${data.households.length}가정`} />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {data.households.map((household) => (
            <article key={household.id} className="rounded-[20px] border border-[#eee8de] bg-[#fcfbf8] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-[#171717]">{household.title}</p>
                {household.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{tag}</span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {household.members.map((member) => (
                  <span key={`${household.id}-${member.name}`} className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#6b5f50]">
                    {member.name} · {member.birthLabel}
                  </span>
                ))}
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-[#5f564b]">
                {household.prayers.map((prayer) => (
                  <li key={prayer} className="flex gap-2">
                    <span className="mt-[8px] h-1.5 w-1.5 rounded-full bg-[#2d6d46]" />
                    <span>{prayer}</span>
                  </li>
                ))}
              </ul>
              {household.contacts.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {household.contacts.map((contact) => (
                    <span key={contact} className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#6b5f50]">{contact}</span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Header({ title, count }: { title: string; count?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-[1.25rem] font-semibold tracking-[-0.04em] text-[#111111]">{title}</h2>
      {count ? <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">{count}</span> : null}
    </div>
  );
}

function MiniCard({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="rounded-[24px] border border-[#ebe4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] transition hover:translate-y-[-1px] hover:shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
      <p className="text-sm font-semibold text-[#171717]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{desc}</p>
    </Link>
  );
}
