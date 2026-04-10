import Link from "next/link";
import { redirect } from "next/navigation";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getAppliedRecordLog } from "@/lib/chat-apply-log";
import { getGidoWorkspaceData } from "@/lib/gido-workspace-data";

function toneClasses(kind: "followup" | "prayer" | "care" | "calm" | "candidate") {
  switch (kind) {
    case "followup":
      return "border-[#f7c76f] bg-[#f59e0b]/20 text-[#fde68a]";
    case "prayer":
      return "border-[#b794f4] bg-[#8b5cf6]/20 text-[#e9d5ff]";
    case "care":
      return "border-[#7dd3fc] bg-[#0ea5e9]/18 text-[#bae6fd]";
    case "candidate":
      return "border-white/16 bg-white/10 text-white/76";
    default:
      return "border-[#d1d5db] bg-white/10 text-white/72";
  }
}

function effectText(member: { requiresFollowUp: boolean; statusTag: string }) {
  if (member.requiresFollowUp) return { label: "후속", kind: "followup" as const };
  if (/기도|중보/.test(member.statusTag)) return { label: "기도", kind: "prayer" as const };
  if (/심방|건강|회복|상담/.test(member.statusTag)) return { label: "돌봄", kind: "care" as const };
  return { label: "안정", kind: "calm" as const };
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

  const activeMembers = data.members.slice(0, 8);
  const featuredHouseholds = data.households.slice(0, 6);
  const latestLogs = logs.slice(0, 5);
  const pendingCount = logs.filter((item) => item.updateType === "FOLLOW_UP").length;

  return (
    <div className="flex flex-col gap-5 text-[#171717]">
      <header className="rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">WORLD / OPERATIONS OS</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">목장 월드</h1>
            <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#5f564b]">
              채팅으로 들어온 운영 상태를 하나의 마을처럼 본다. 사람은 캐릭터, 가정은 집, 후속과 기도는 월드 이펙트로 읽는다.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <MetricCard label="목원" value={`${data.stats.memberCount}명`} />
            <MetricCard label="가정" value={`${data.stats.householdCount}개`} />
            <MetricCard label="기도" value={`${data.stats.prayerCount}건`} />
            <MetricCard label="후속 흐름" value={`${pendingCount}건`} />
          </div>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
        <aside className="grid gap-4">
          <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">TODAY'S OPS</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">오늘 집중할 흐름</h2>
            <div className="mt-4 grid gap-3">
              <WorldInfoCard title="새가족 입력" body="Chat에서 새 이름을 넣으면 등록 후보가 생기고, 월드에는 새 방문자처럼 반영된다." />
              <WorldInfoCard title="후속 확인" body="연락이 필요한 사람은 캐릭터 위 노란 상태로 읽히게 만든다." />
              <WorldInfoCard title="가정 관계" body="같은 가정은 같은 집 주변에 배치하고, 관계가 비어 있으면 연결이 약하게 보인다." />
            </div>
          </article>

          <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">QUICK JUMP</p>
            <div className="mt-4 grid gap-2 text-sm">
              <Link href={`${base}/chat`} className="rounded-[14px] border border-[#e7dfd3] bg-[#faf7f2] px-3 py-3 text-[#3f372d]">Chat에서 입력하기</Link>
              <Link href={`${base}/people`} className="rounded-[14px] border border-[#e7dfd3] bg-[#faf7f2] px-3 py-3 text-[#3f372d]">People 보기</Link>
              <Link href={`${base}/households`} className="rounded-[14px] border border-[#e7dfd3] bg-[#faf7f2] px-3 py-3 text-[#3f372d]">Households 보기</Link>
            </div>
          </article>
        </aside>

        <section className="overflow-hidden rounded-[30px] border border-[#1f2937] bg-[linear-gradient(180deg,#131a2a_0%,#172033_55%,#1a2540_100%)] p-5 text-white shadow-[0_22px_60px_rgba(15,23,42,0.20)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.16em] text-white/46">WORLD MAP</p>
              <p className="mt-1 text-lg font-semibold">{data.groupName}</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/60">beta scene</span>
          </div>

          <div className="relative min-h-[560px] rounded-[26px] border border-white/8 bg-[radial-gradient(circle_at_top,#22304d_0%,#172033_48%,#101827_100%)] p-6">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[26px]">
              <div className="absolute left-[5%] top-[14%] h-20 w-20 rounded-full bg-[#8b5cf622] blur-2xl" />
              <div className="absolute right-[10%] top-[20%] h-16 w-16 rounded-full bg-[#38bdf822] blur-2xl" />
              <div className="absolute bottom-[18%] left-[22%] h-16 w-16 rounded-full bg-[#f59e0b22] blur-2xl" />
              <div className="absolute inset-x-[10%] bottom-[16%] h-[2px] bg-white/8" />
            </div>

            <div className="relative z-10">
              <div className="absolute left-[44%] top-[10%] flex h-16 w-16 items-center justify-center rounded-[20px] border border-[#fbbf24]/30 bg-[#f59e0b22] text-lg font-semibold text-[#fde68a] shadow-[0_0_20px_rgba(245,158,11,0.18)]">
                목
              </div>

              {featuredHouseholds.map((household, index) => {
                const positions = [
                  "left-[8%] top-[18%]",
                  "right-[10%] top-[22%]",
                  "left-[16%] bottom-[22%]",
                  "right-[16%] bottom-[18%]",
                  "left-[38%] bottom-[8%]",
                  "right-[36%] top-[44%]",
                ];
                const pos = positions[index] ?? "left-[20%] top-[20%]";
                return (
                  <Link
                    key={household.id}
                    href={`${base}/households?focus=${household.id}`}
                    className={`absolute ${pos} flex w-[160px] flex-col rounded-[22px] border border-white/10 bg-white/[0.06] p-3 backdrop-blur-sm transition hover:bg-white/[0.10]`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-lg">🏠</span>
                      <span className="rounded-full border border-white/10 bg-black/10 px-2 py-0.5 text-[10px] text-white/56">{household.members.length}명</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-white">{household.title}</p>
                    <p className="mt-1 text-[11px] text-white/56">기도 {household.prayers.length} · 연결 {household.relationships.length}</p>
                  </Link>
                );
              })}

              {activeMembers.map((member, index) => {
                const positions = [
                  "left-[26%] top-[30%]",
                  "left-[58%] top-[28%]",
                  "left-[24%] bottom-[28%]",
                  "left-[62%] bottom-[26%]",
                  "left-[46%] top-[54%]",
                  "left-[34%] top-[58%]",
                  "left-[68%] top-[56%]",
                  "left-[50%] bottom-[12%]",
                ];
                const pos = positions[index] ?? "left-[40%] top-[40%]";
                const effect = effectText(member);
                return (
                  <Link
                    key={member.id}
                    href={`${base}/people`}
                    className={`absolute ${pos} flex w-[88px] flex-col items-center text-center`}
                  >
                    <div className={`flex h-14 w-14 items-center justify-center rounded-[18px] border text-sm font-semibold shadow-[0_8px_20px_rgba(15,23,42,0.18)] ${toneClasses(effect.kind)}`}>
                      {member.name.slice(0, 1)}
                    </div>
                    <p className="mt-2 text-[12px] font-medium text-white">{member.name}</p>
                    <span className={`mt-1 rounded-full border px-2 py-0.5 text-[10px] ${toneClasses(effect.kind)}`}>{effect.label}</span>
                  </Link>
                );
              })}

              {data.stats.memberCount === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-[24px] border border-dashed border-white/12 bg-black/10 px-6 py-8 text-center">
                    <p className="text-base font-semibold text-white">아직 비어 있는 목장입니다</p>
                    <p className="mt-2 text-sm leading-6 text-white/58">Chat에서 첫 새가족을 입력하면 집과 캐릭터가 여기서부터 생기기 시작합니다.</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <aside className="grid gap-4">
          <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">LATEST EVENTS</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">최근 반영 기록</h2>
            <div className="mt-4 grid gap-3">
              {latestLogs.length === 0 ? (
                <div className="rounded-[16px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-4 text-sm text-[#6f6256]">아직 반영 로그가 없습니다.</div>
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

          <article className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">WORLD PRINCIPLES</p>
            <div className="mt-4 grid gap-3 text-sm text-[#5f564b]">
              <div className="rounded-[16px] border border-[#efe7da] bg-[#fcfbf8] p-4">채팅은 입력창, 월드는 운영 상태판이다.</div>
              <div className="rounded-[16px] border border-[#efe7da] bg-[#fcfbf8] p-4">가정은 집, 사람은 캐릭터, 상태는 이펙트로 읽는다.</div>
              <div className="rounded-[16px] border border-[#efe7da] bg-[#fcfbf8] p-4">People / Households / Timeline은 월드의 상세 패널 역할을 한다.</div>
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#ece4d8] bg-white p-4">
      <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[#111111]">{value}</p>
    </div>
  );
}

function WorldInfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[18px] border border-[#efe7da] bg-[#fcfbf8] p-4">
      <p className="text-sm font-semibold text-[#111111]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{body}</p>
    </div>
  );
}
