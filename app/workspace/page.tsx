import Link from "next/link";
import SiteHeader from "@/components/site-header";

const sidebarItems = ["대시보드", "사람", "공지", "작업", "콘텐츠", "설정"];
const quickStats = [
  { label: "오늘 할 일", value: "7" },
  { label: "미처리 요청", value: "4" },
  { label: "이번 주 공지", value: "3" },
  { label: "콘텐츠 진행", value: "5" },
];
const recentTasks = [
  "새가족 후속관리 상태 정리",
  "주일 공지 문구 점검",
  "수련회 신청 페이지 확인",
  "이번 주 쇼츠 업로드 준비",
];
const workspaceFlows = [
  {
    title: "운영 흐름을 한곳에서",
    desc: "공지, 사람 관리, 작업 메모, 콘텐츠 진행 상황을 한 워크스페이스 안에서 정리합니다.",
  },
  {
    title: "무료로 먼저 시작",
    desc: "처음부터 결제보다, 실제로 쓸 수 있는 흐름을 먼저 경험할 수 있게 준비합니다.",
  },
  {
    title: "교회에 맞는 MVP",
    desc: "gloo처럼 무겁게 시작하지 않고, 교회와 사역팀이 바로 쓸 수 있는 핵심 구조부터 만듭니다.",
  },
];

export default function WorkspacePage() {
  return (
    <main className="min-h-screen bg-[#07101d] text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SiteHeader theme="dark" ctaHref="/signup" ctaLabel="무료로 시작하기" />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.24em] text-white/38">WORKSPACE MVP</p>
            <h1 className="mt-5 font-display text-[2.6rem] leading-[1.05] tracking-[-0.06em] sm:text-[4.4rem]">
              교회와 사역팀을 위한
              <br />
              워크스페이스 MVP
            </h1>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-white/68 sm:text-base">
              숨의 주력 상품은 워크스페이스입니다. 사람 관리, 공지, 작업 흐름, 콘텐츠 진행을 한곳에서 정리할 수 있는
              가벼운 제품부터 시작합니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#09111f]">
                무료로 시작하기
              </Link>
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 text-sm font-medium text-white">
                도입 문의하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0b1327]/92 shadow-[0_24px_80px_rgba(2,6,23,0.42)]">
            <div className="grid lg:grid-cols-[260px_1fr]">
              <aside className="border-b border-white/10 bg-[#0a1222] p-5 lg:border-b-0 lg:border-r">
                <p className="text-xs tracking-[0.2em] text-white/32">SOOM WORKSPACE</p>
                <div className="mt-4 rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm font-semibold">대흥교회 청년부</p>
                  <p className="mt-1 text-xs text-white/46">무료 플랜 · MVP</p>
                </div>
                <div className="mt-5 grid gap-2">
                  {sidebarItems.map((item, index) => (
                    <div
                      key={item}
                      className={`rounded-[16px] px-4 py-3 text-sm ${index === 0 ? "bg-white text-[#09111f] font-semibold" : "border border-white/10 bg-white/[0.03] text-white/72"}`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </aside>

              <div className="p-5 sm:p-7">
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {quickStats.map((item) => (
                      <div key={item.label} className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-xs text-white/44">{item.label}</p>
                        <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                      <p className="text-xs tracking-[0.18em] text-white/38">THIS WEEK</p>
                      <h2 className="mt-3 text-xl font-semibold">이번 주 운영 요약</h2>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
                        미처리 요청, 공지 점검, 콘텐츠 준비 상황을 한 번에 보고 지금 가장 먼저 해야 할 일을 정리할 수 있습니다.
                      </p>
                      <div className="mt-5 grid gap-3">
                        {recentTasks.map((task, index) => (
                          <div key={task} className="flex items-center justify-between rounded-[18px] border border-white/10 bg-[#091122] px-4 py-3">
                            <p className="text-sm text-white/80">{task}</p>
                            <span className="text-xs text-white/38">0{index + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                      <p className="text-xs tracking-[0.18em] text-white/38">QUICK ACTIONS</p>
                      <div className="mt-4 grid gap-3">
                        <div className="rounded-[18px] border border-white/10 bg-[#091122] px-4 py-3 text-sm text-white/78">공지 작성</div>
                        <div className="rounded-[18px] border border-white/10 bg-[#091122] px-4 py-3 text-sm text-white/78">사람 상태 업데이트</div>
                        <div className="rounded-[18px] border border-white/10 bg-[#091122] px-4 py-3 text-sm text-white/78">콘텐츠 요청 등록</div>
                        <div className="rounded-[18px] border border-white/10 bg-[#091122] px-4 py-3 text-sm text-white/78">행사 페이지 점검</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f4ee] text-[#0c1220]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.24em] text-[#7a6f67]">WHY THIS PRODUCT</p>
            <h2 className="mt-5 font-display text-[2.2rem] leading-[1.06] tracking-[-0.05em] sm:text-[3.4rem]">
              거창한 플랫폼보다
              <br />
              먼저 쓸 수 있는 워크스페이스부터
            </h2>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {workspaceFlows.map((item) => (
              <article key={item.title} className="rounded-[26px] border border-[#e6dfd5] bg-white p-6 shadow-[0_16px_40px_rgba(16,24,40,0.06)]">
                <h3 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-[#0c1220]">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#475069]">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
