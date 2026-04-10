import Link from "next/link";
import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getAppliedRecordLog } from "@/lib/chat-apply-log";
import { getGidoWorkspaceData } from "@/lib/gido-workspace-data";

function effectForMember(member: { requiresFollowUp: boolean; statusTag: string }) {
  if (member.requiresFollowUp) return { label: "후속", emoji: "✉️", tone: "amber" as const };
  if (/기도|중보/.test(member.statusTag)) return { label: "기도", emoji: "✨", tone: "violet" as const };
  if (/심방|건강|회복|상담/.test(member.statusTag)) return { label: "돌봄", emoji: "💧", tone: "sky" as const };
  return { label: "안정", emoji: "•", tone: "stone" as const };
}

function toneClass(tone: "amber" | "violet" | "sky" | "stone") {
  switch (tone) {
    case "amber":
      return "border-[#fbbf24]/40 bg-[#f59e0b22] text-[#fde68a]";
    case "violet":
      return "border-[#c4b5fd]/40 bg-[#8b5cf622] text-[#e9d5ff]";
    case "sky":
      return "border-[#7dd3fc]/40 bg-[#0ea5e922] text-[#bae6fd]";
    default:
      return "border-white/12 bg-white/[0.05] text-white/76";
  }
}

export default async function ChurchWorldPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  if (membership.church.slug !== "gido") {
    redirect(`/app/${membership.church.slug}/dashboard`);
  }

  const base = `/app/${membership.church.slug}`;
  const [data, logs] = await Promise.all([
    getGidoWorkspaceData(membership.church.id),
    getAppliedRecordLog(membership.church.id, 60),
  ]);

  const worldName = "숨 목장 월드";
  const households = data.households.slice(0, 5);
  const members = data.members.slice(0, 10);
  const latestLogs = logs.slice(0, 4);
  const highlighted = members.filter((member) => member.requiresFollowUp).length;

  const housePositions = [
    "left-[6%] top-[16%]",
    "right-[8%] top-[18%]",
    "left-[14%] bottom-[18%]",
    "right-[15%] bottom-[16%]",
    "left-[40%] bottom-[6%]",
  ];

  const memberPositions = [
    "left-[24%] top-[26%]",
    "left-[38%] top-[18%]",
    "left-[60%] top-[28%]",
    "left-[74%] top-[34%]",
    "left-[28%] top-[56%]",
    "left-[44%] top-[48%]",
    "left-[58%] top-[58%]",
    "left-[72%] top-[64%]",
    "left-[48%] top-[72%]",
    "left-[34%] top-[74%]",
  ];

  return (
    <div className="flex flex-col gap-5 text-[#171717]">
      <header className="rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">WORLD / MOKJANG OS</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">목장 월드</h1>
            <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#5f564b]">
              채팅으로 들어온 목장 상태를 작은 마을처럼 봅니다. 가정은 집, 사람은 캐릭터, 후속과 기도는 이펙트로 읽습니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatPill label="목원" value={`${data.stats.memberCount}명`} />
            <StatPill label="가정" value={`${data.stats.householdCount}개`} />
            <StatPill label="기도" value={`${data.stats.prayerCount}건`} />
            <StatPill label="후속" value={`${highlighted}명`} />
          </div>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="overflow-hidden rounded-[34px] border border-[#111827] bg-[linear-gradient(180deg,#131a2a_0%,#172033_48%,#1a2540_100%)] p-5 text-white shadow-[0_22px_64px_rgba(15,23,42,0.22)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.18em] text-white/46">MOKJANG VILLAGE</p>
              <p className="mt-1 text-lg font-semibold">{worldName}</p>
            </div>
            <div className="flex gap-2 text-[11px] text-white/62">
              <Link href={`${base}/chat`} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">입력</Link>
              <Link href={`${base}/people`} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">사람</Link>
              <Link href={`${base}/households`} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">가정</Link>
            </div>
          </div>

          <div className="relative min-h-[680px] rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,#22314d_0%,#1a2540_34%,#1b2f25_35%,#223924_100%)] px-6 py-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
              <div className="absolute left-[8%] top-[12%] h-24 w-24 rounded-full bg-[#a78bfa22] blur-3xl" />
              <div className="absolute right-[10%] top-[18%] h-20 w-20 rounded-full bg-[#38bdf822] blur-3xl" />
              <div className="absolute left-[22%] bottom-[10%] h-24 w-24 rounded-full bg-[#f59e0b22] blur-3xl" />

              <div className="absolute left-[12%] top-[28%] h-[3px] w-[30%] rotate-[12deg] rounded-full bg-[#cabf9f55]" />
              <div className="absolute right-[16%] top-[44%] h-[3px] w-[28%] -rotate-[18deg] rounded-full bg-[#cabf9f55]" />
              <div className="absolute left-[36%] bottom-[18%] h-[3px] w-[24%] rounded-full bg-[#cabf9f55]" />
            </div>

            <div className="absolute left-[45%] top-[10%] z-10 flex h-20 w-20 items-center justify-center rounded-[26px] border border-[#fbbf24]/35 bg-[#f59e0b22] text-xl font-semibold text-[#fde68a] shadow-[0_0_28px_rgba(245,158,11,0.18)]">
              목
            </div>
            <div className="absolute left-[40%] top-[5%] text-[11px] text-white/60">목자</div>

            <div className="absolute left-[42%] top-[20%] z-10 flex h-[110px] w-[130px] items-center justify-center rounded-[28px] border border-white/10 bg-[#f8f3ea14] text-center shadow-[0_12px_24px_rgba(15,23,42,0.14)]">
              <div>
                <div className="text-2xl">⛪</div>
                <div className="mt-2 text-[12px] text-white/72">모임 공간</div>
              </div>
            </div>

            {households.map((household, index) => (
              <Link
                key={household.id}
                href={`${base}/households?focus=${household.id}`}
                className={`absolute ${housePositions[index] ?? housePositions[0]} z-10 w-[150px] rounded-[24px] border border-white/10 bg-[#fbf6ed12] p-3 backdrop-blur-sm transition hover:bg-white/[0.10]`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-2xl">🏠</span>
                  <span className="rounded-full border border-white/10 bg-black/10 px-2 py-0.5 text-[10px] text-white/60">{household.members.length}명</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-white">{household.title}</p>
                <p className="mt-1 text-[11px] text-white/56">기도 {household.prayers.length} · 관계 {household.relationships.length}</p>
              </Link>
            ))}

            {members.map((member, index) => {
              const effect = effectForMember(member);
              return (
                <Link
                  key={member.id}
                  href={`${base}/people`}
                  className={`absolute ${memberPositions[index] ?? memberPositions[0]} z-20 flex w-[88px] flex-col items-center text-center`}
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-[18px] border text-sm font-semibold shadow-[0_8px_18px_rgba(15,23,42,0.18)] ${toneClass(effect.tone)}`}>
                    {member.name.slice(0, 1)}
                  </div>
                  <p className="mt-2 text-[12px] font-medium text-white">{member.name}</p>
                  <span className={`mt-1 rounded-full border px-2 py-0.5 text-[10px] ${toneClass(effect.tone)}`}>
                    {effect.emoji} {effect.label}
                  </span>
                </Link>
              );
            })}

            {data.stats.memberCount === 0 ? (
              <div className="absolute inset-0 z-30 flex items-center justify-center">
                <div className="rounded-[28px] border border-dashed border-white/12 bg-black/12 px-8 py-10 text-center backdrop-blur-sm">
                  <p className="text-lg font-semibold text-white">아직 비어 있는 목장입니다</p>
                  <p className="mt-2 max-w-[360px] text-sm leading-6 text-white/58">Chat에서 첫 새가족을 입력하면 집과 캐릭터가 이 마을에 생기기 시작합니다.</p>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <aside className="grid gap-4">
          <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">운영 포인트</p>
            <div className="mt-4 grid gap-3">
              <InfoCard title="새가족" body="새로 들어온 사람은 마을에 새 방문자처럼 보입니다." />
              <InfoCard title="후속" body="연락이 필요한 사람은 노란 상태로 먼저 읽힙니다." />
              <InfoCard title="가정" body="같은 가정은 같은 집 주변에 묶여 보입니다." />
            </div>
          </article>

          <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">최근 반영 기록</p>
            <div className="mt-4 grid gap-3">
              {latestLogs.length === 0 ? (
                <div className="rounded-[16px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-4 text-sm text-[#6f6256]">아직 반영된 로그가 없습니다.</div>
              ) : (
                latestLogs.map((item) => (
                  <div key={item.id} className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">
                    <p className="text-[11px] text-[#8c7a5b]">{item.updateTypeLabel}</p>
                    <p className="mt-2 text-sm font-semibold text-[#111111]">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.body}</p>
                  </div>
                ))
              )}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1.5 text-[11px] text-[#6f6256]">{label} {value}</span>;
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">
      <p className="text-sm font-semibold text-[#111111]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{body}</p>
    </div>
  );
}
