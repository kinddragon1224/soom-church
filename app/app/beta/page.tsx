import Link from "next/link";

const launcherCards = [
  {
    title: "Chat",
    body: "운영 입력 시작",
    href: "/app/beta/chat",
    tone: "bg-[#111827] text-white border-[#111827]",
    badge: "INPUT",
  },
  {
    title: "World",
    body: "월드 씬 확인",
    href: "/app/beta/world",
    tone: "bg-[#fcfbf8] text-[#111111] border-[#e6dfd5]",
    badge: "SCENE",
  },
  {
    title: "Records",
    body: "운영 기록 구조",
    href: "/app/beta/records",
    tone: "bg-[#fcfbf8] text-[#111111] border-[#e6dfd5]",
    badge: "DATA",
  },
];

export default function BetaHomePage() {
  return (
    <div className="flex flex-col gap-6 text-[#171717]">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <header className="rounded-[30px] border border-[#e8e1d6] bg-white px-6 py-7 shadow-[0_10px_28px_rgba(15,23,42,0.05)] lg:px-7">
          <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">SOOM BETA OS</p>
          <h1 className="mt-3 text-[2.3rem] font-semibold tracking-[-0.06em] text-[#111111]">운영 개발 OS 홈</h1>
          <p className="mt-4 max-w-[700px] text-sm leading-7 text-[#5f564b]">
            새 beta의 기본 런처. 지금은 어디로 들어갈지 선명하게 보여주는 데 집중한다.
          </p>
        </header>

        <aside className="rounded-[30px] border border-[#111827] bg-[#111827] px-6 py-7 text-white shadow-[0_18px_44px_rgba(15,23,42,0.16)]">
          <p className="text-[10px] tracking-[0.18em] text-white/46">NOW</p>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-white/86">
            <div className="rounded-[18px] border border-white/8 bg-white/[0.04] p-4">핵심은 World 먼저</div>
            <div className="rounded-[18px] border border-white/8 bg-white/[0.04] p-4">Chat, Records는 최소 구조 유지</div>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {launcherCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className={`rounded-[28px] border p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)] ${card.tone}`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className={`rounded-full px-2.5 py-1 text-[10px] tracking-[0.16em] ${card.title === "Chat" ? "bg-white/10 text-white/72" : "bg-[#f3efe8] text-[#7b6f60]"}`}>
                {card.badge}
              </span>
              <span className={`text-sm ${card.title === "Chat" ? "text-white/60" : "text-[#8c7a5b]"}`}>열기</span>
            </div>
            <h3 className="mt-8 text-[1.7rem] font-semibold tracking-[-0.04em]">{card.title}</h3>
            <p className={`mt-3 text-sm leading-7 ${card.title === "Chat" ? "text-white/72" : "text-[#5f564b]"}`}>{card.body}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
