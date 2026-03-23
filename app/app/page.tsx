import Link from "next/link";
import { getAccessibleChurchesByUserId, getCurrentUserOrRedirect, getChurchBySlug } from "@/lib/church-context";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const preferredRegion = "sin1";

const setupSteps = [
  { label: "STEP 1", title: "교회 이름과 기본 운영 정보 입력", desc: "출석 규모, 역할, 운영 목표를 같이 정리합니다." },
  { label: "STEP 2", title: "즉시 워크스페이스 생성", desc: "무료 플랜과 기본 권한 구조가 바로 준비됩니다." },
  { label: "STEP 3", title: "대시보드에서 사람·신청·공지 시작", desc: "생성 직후 실사용 화면으로 바로 들어갑니다." },
] as const;

const onboardingChecklist = [
  "대표 역할과 운영 목표를 먼저 정리해 둡니다.",
  "팀 이름이 있으면 함께 기록해 이후 설정 초안으로 이어집니다.",
  "출석 규모를 남겨두면 관리자 화면에서 교회 상태를 더 빨리 파악할 수 있습니다.",
] as const;

const roleLabels: Record<string, string> = {
  OWNER: "총괄",
  PASTOR: "목회자",
  ADMIN: "행정",
  LEADER: "리더",
  VIEWER: "협력",
};

export default async function AppEntryPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const userId = await getCurrentUserOrRedirect();

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });
  if (user?.email === "platform-admin@soom.church" || user?.email === "admin@soom.church") {
    redirect("/platform-admin");
  }

  const memberships = await getAccessibleChurchesByUserId(userId);
  if (memberships.length === 1) {
    redirect(`/app/${memberships[0].church.slug}/dashboard`);
  }

  const demoChurch = await getChurchBySlug("daehung-ieum-dubit");
  const error = searchParams?.error;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="overflow-hidden rounded-[32px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] tracking-[0.2em] text-white/46">WORKSPACE ONBOARDING</p>
            <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] text-white/70">초기 설정</span>
          </div>
          <h1 className="mt-3 text-[2.35rem] font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-[3.2rem]">
            교회 운영 흐름을
            <br />
            바로 시작한다
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/68">
            {user?.name ?? "사용자"}님 계정은 준비됐어. 이제 교회 기본 정보와 운영 맥락만 정리하면 사람, 신청, 공지 흐름이 열려.
          </p>

          <div className="mt-6 grid gap-3">
            {setupSteps.map((step) => (
              <div key={step.label} className="rounded-[20px] border border-white/10 bg-white/8 p-4">
                <p className="text-[11px] tracking-[0.18em] text-white/46">{step.label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{step.title}</p>
                <p className="mt-2 text-sm text-white/64">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="rounded-[30px] border border-[#e5dccd] bg-[#fbfaf6] p-5 text-[#111111] shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">CREATE WORKSPACE</p>
              <h2 className="mt-2 text-xl font-semibold">새 교회 만들기</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">무료 시작</span>
          </div>
          <p className="mt-2 text-sm text-[#5f564b]">입력한 값은 첫 설정과 운영 맥락 정리에 바로 쓰여. 불필요한 설명 대신 실제 시작 정보만 받는다.</p>

          {error === "church_name_required" ? (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              교회 이름을 입력해줘.
            </div>
          ) : null}

          <form action="/api/onboarding/create-church" method="post" className="mt-5 grid gap-3 sm:grid-cols-2">
            <input
              name="churchName"
              placeholder="예: 대흥교회 이음두빛"
              className="w-full rounded-[16px] border border-[#e1d7c7] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#c8a96b]"
              required
            />
            <input
              name="churchSlug"
              placeholder="선택: 영문 슬러그"
              className="w-full rounded-[16px] border border-[#e1d7c7] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#c8a96b]"
            />
            <select
              name="role"
              defaultValue="OWNER"
              className="w-full rounded-[16px] border border-[#e1d7c7] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#c8a96b]"
            >
              <option value="OWNER">담당자 / 총괄</option>
              <option value="PASTOR">목회자</option>
              <option value="ADMIN">행정 / 사무국</option>
              <option value="LEADER">리더 / 사역자</option>
              <option value="VIEWER">기타 협력자</option>
            </select>
            <input
              name="teamName"
              placeholder="담당 부서 또는 팀명"
              className="w-full rounded-[16px] border border-[#e1d7c7] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#c8a96b]"
            />
            <select
              name="attendanceBand"
              defaultValue=""
              className="w-full rounded-[16px] border border-[#e1d7c7] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#c8a96b]"
            >
              <option value="">주일 출석 규모</option>
              <option value="UNDER_100">100명 이하</option>
              <option value="100_300">100~300명</option>
              <option value="300_1000">300~1,000명</option>
              <option value="OVER_1000">1,000명 이상</option>
            </select>
            <select
              name="primaryGoal"
              defaultValue=""
              className="w-full rounded-[16px] border border-[#e1d7c7] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#c8a96b]"
            >
              <option value="">지금 가장 먼저 정리할 흐름</option>
              <option value="PEOPLE">사람 관리</option>
              <option value="APPLICATIONS">신청 접수</option>
              <option value="NOTICES">공지 전달</option>
              <option value="SETUP">운영 구조 세팅</option>
            </select>
            <textarea
              name="setupNote"
              placeholder="선택: 지금 바로 해결하고 싶은 운영 메모"
              rows={4}
              className="w-full rounded-[18px] border border-[#e1d7c7] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#c8a96b] sm:col-span-2"
            />
            <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-[16px] bg-[#111827] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0f172a] sm:col-span-2">
              워크스페이스 만들고 시작하기
            </button>
          </form>

          <div className="mt-5 rounded-[22px] border border-[#ece6dc] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">CHECKLIST</p>
                <p className="mt-2 text-sm font-semibold">입력 전에 보면 좋은 기준</p>
              </div>
              <span className="text-xs text-[#8C7A5B]">3 items</span>
            </div>
            <div className="mt-4 grid gap-2">
              {onboardingChecklist.map((item) => (
                <div key={item} className="rounded-[16px] border border-[#efe7da] bg-[#fcfbf8] px-3 py-3 text-sm text-[#5f564b]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.92fr]">
        <div className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">WORKSPACES</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">열 수 있는 교회</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">{memberships.length}곳</span>
          </div>
          <p className="mt-2 text-sm text-[#5f564b]">
            {memberships.length > 1
              ? "여러 워크스페이스에 연결돼 있으면 가장 최근에 합류한 교회부터 바로 고를 수 있게 둔다."
              : "아직 연결된 워크스페이스가 없으면 아래에서 새 교회를 바로 만들면 된다."}
          </p>
          <div className="mt-4 grid gap-3">
            {memberships.length > 0 ? (
              memberships.map((membership) => (
                <Link
                  key={membership.church.id}
                  href={`/app/${membership.church.slug}/dashboard`}
                  className="rounded-[18px] border border-[#e7dece] bg-[#fcfbf8] px-4 py-4 transition hover:border-[#d7c4a3] hover:bg-white"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">{membership.church.name}</p>
                      <p className="mt-1 text-xs text-[#7b6f61]">/{membership.church.slug}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8C7A5B]">
                      <span className="rounded-full border border-[#eadfcd] bg-white px-2.5 py-1">{roleLabels[membership.role] ?? membership.role}</span>
                      <span className="rounded-full border border-[#eadfcd] bg-white px-2.5 py-1">바로 열기</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-[18px] border border-dashed border-[#d9cfbe] bg-[#fcfbf8] px-4 py-6 text-sm text-[#7b6f61]">
                아직 연결된 교회가 없어. 위 입력으로 첫 워크스페이스를 만들면 바로 대시보드로 들어간다.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">SHORTCUTS</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">바로 열기</h2>
            </div>
            <span className="text-xs text-[#8C7A5B]">quick links</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {demoChurch ? (
              <Link href={`/app/${demoChurch.slug}/dashboard`} className="rounded-[14px] border border-[#e1d7c7] bg-[#fcfbf8] px-3 py-2 transition hover:bg-white">
                대흥교회 이음두빛 데모 보기
              </Link>
            ) : null}
            <Link href="/signup" className="rounded-[14px] border border-[#e1d7c7] bg-[#fcfbf8] px-3 py-2 transition hover:bg-white">
              회원가입 화면 보기
            </Link>
            <Link href="/login" className="rounded-[14px] border border-[#e1d7c7] bg-[#fcfbf8] px-3 py-2 transition hover:bg-white">
              다른 계정으로 로그인
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
