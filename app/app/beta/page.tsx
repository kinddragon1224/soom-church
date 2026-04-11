import Link from "next/link";

const primaryFlows = [
  {
    href: "/app/beta/chat",
    label: "운영 입력",
    eyebrow: "CHAT",
    title: "지금 바로 입력하기",
    description: "목원 등록, 심방 메모, 기도 요청, 후속조치를 가장 빠르게 넣는 공간.",
  },
  {
    href: "/app/beta/world",
    label: "월드 홈",
    eyebrow: "WORLD",
    title: "공간으로 상태 보기",
    description: "목장 상태와 주요 공간을 감각적으로 보고, 필요한 곳으로 바로 들어가는 허브.",
  },
  {
    href: "/app/beta/records",
    label: "기록 보기",
    eyebrow: "RECORDS",
    title: "쌓인 기록 확인하기",
    description: "자동 반영된 내용을 다시 보고, 사람이 필요한 부분을 보정하는 공간.",
  },
];

const todayItems = [
  "새가족이나 최근 연결된 사람부터 먼저 입력하기",
  "돌봄이 필요한 사람을 월드와 목양 공간에서 바로 확인하기",
  "오늘 남긴 기록이 실제로 어떻게 쌓이는지 체크하기",
];

const spaceLinks = [
  {
    href: "/app/beta/world",
    title: "월드 홈",
    description: "전체 운영 흐름과 주요 공간 진입",
  },
  {
    href: "/app/beta/world/shepherding",
    title: "목양 공간",
    description: "사람별 돌봄 상태와 다음 행동 보기",
  },
  {
    href: "/app/beta/settings",
    title: "설정",
    description: "워크스페이스 기준과 환경 조정",
  },
];

export default function BetaHomePage() {
  return (
    <div className="flex flex-col gap-5 text-[#171717]">
      <section className="overflow-hidden rounded-[30px] border border-[#e8ddcf] bg-[linear-gradient(135deg,#fffaf2_0%,#f7efe2_52%,#efe4d4_100%)] p-6 shadow-[0_18px_40px_rgba(66,38,12,0.06)] lg:p-7">
        <p className="text-[10px] tracking-[0.18em] text-[#9a8366]">SOOM BETA HOME</p>
        <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.05em] text-[#1f1a16] lg:text-[2.4rem]">
          오늘의 운영을 어디서 시작할지 바로 보이는 홈
        </h1>
        <p className="mt-4 max-w-[840px] text-sm leading-7 text-[#5f564b] lg:text-[15px]">
          홈은 안내 화면이 아니라 운영 시작점이야. 여기서 바로 입력하고, 월드로 들어가고, 기록을 확인하는 흐름이 한 번에 이어져야 해.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/app/beta/chat"
            className="inline-flex items-center rounded-[16px] bg-[#2f2416] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_24px_rgba(47,36,22,0.18)]"
          >
            지금 입력하러 가기
          </Link>
          <Link
            href="/app/beta/world"
            className="inline-flex items-center rounded-[16px] border border-[#ddcfbe] bg-white/76 px-5 py-3 text-sm font-medium text-[#3f372d]"
          >
            월드 홈 열기
          </Link>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {primaryFlows.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[28px] border border-[#ece4d8] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-[2px] hover:shadow-[0_16px_32px_rgba(66,38,12,0.08)]"
          >
            <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">{item.eyebrow}</p>
            <p className="mt-3 text-lg font-semibold text-[#1c1713]">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.description}</p>
            <div className="mt-5 inline-flex rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-3 py-1.5 text-[12px] text-[#3f372d]">
              {item.label}
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <article className="rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:px-7">
          <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">TODAY FLOW</p>
          <h2 className="mt-3 text-[1.4rem] font-semibold tracking-[-0.04em] text-[#1c1713]">오늘 이 순서로 움직이면 돼</h2>
          <div className="mt-5 grid gap-3">
            {todayItems.map((item, index) => (
              <div key={item} className="flex gap-3 rounded-[20px] border border-[#efe7db] bg-[#fcfaf7] p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3e6d2] text-sm font-semibold text-[#6b4d2e]">
                  {index + 1}
                </div>
                <p className="pt-1 text-sm leading-6 text-[#544a3f]">{item}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-[#ece4d8] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">SPACES</p>
          <h2 className="mt-3 text-[1.3rem] font-semibold tracking-[-0.04em] text-[#1c1713]">주요 공간</h2>
          <div className="mt-4 grid gap-3">
            {spaceLinks.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-[20px] border border-[#ece4d8] bg-[#fcfbf8] p-4 transition hover:bg-[#faf6f0]">
                <p className="text-sm font-semibold text-[#2f2416]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#6b6258]">{item.description}</p>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
