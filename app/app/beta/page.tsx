import Link from "next/link";

const primaryCards = [
  {
    title: "Chat",
    body: "운영 입력이 시작되는 곳. 사람, 상태, 후속, 아이디어를 가장 먼저 넣는다.",
    href: "/app/beta/chat",
    tone: "bg-[#111827] text-white border-[#111827]",
    badge: "INPUT",
  },
  {
    title: "World",
    body: "운영 상태를 장면으로 보는 핵심 씬. 다음 단계에서 가장 먼저 밀어붙일 화면.",
    href: "/app/beta/world",
    tone: "bg-[#fcfbf8] text-[#111111] border-[#e6dfd5]",
    badge: "SCENE",
  },
  {
    title: "Records",
    body: "정리된 운영 데이터, apply 로그, 사람/가정 구조의 뼈대를 붙일 자리.",
    href: "/app/beta/records",
    tone: "bg-[#fcfbf8] text-[#111111] border-[#e6dfd5]",
    badge: "DATA",
  },
];

const nextSteps = [
  "beta 홈을 운영 개발 OS 런처로 고정",
  "world 첫 장면을 실제 메인 화면 수준으로 만들기",
  "chat 입력과 records 연결 다시 붙이기",
];

export default function BetaHomePage() {
  return (
    <div className="flex flex-col gap-6 text-[#171717]">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <header className="rounded-[30px] border border-[#e8e1d6] bg-white px-6 py-7 shadow-[0_10px_28px_rgba(15,23,42,0.05)] lg:px-7">
          <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">SOOM BETA OS</p>
          <h1 className="mt-3 text-[2.3rem] font-semibold tracking-[-0.06em] text-[#111111]">운영 개발 OS 홈</h1>
          <p className="mt-4 max-w-[760px] text-sm leading-7 text-[#5f564b]">
            지금은 기능을 많이 얹지 않고, 무엇이 메인이고 어디부터 개발할지 선명하게 보이는 런처부터 고정한다.
            이 홈은 다음 작업과 진입점을 관리하는 기본 베이스다.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-[11px] text-[#6f6256]">
            <span className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-3 py-1.5">chat-first</span>
            <span className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-3 py-1.5">world-next</span>
            <span className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-3 py-1.5">step-by-step rebuild</span>
          </div>
        </header>

        <aside className="rounded-[30px] border border-[#111827] bg-[#111827] px-6 py-7 text-white shadow-[0_18px_44px_rgba(15,23,42,0.18)]">
          <p className="text-[10px] tracking-[0.18em] text-white/48">FOCUS NOW</p>
          <h2 className="mt-3 text-xl font-semibold">지금 개발 순서</h2>
          <div className="mt-5 grid gap-3">
            {nextSteps.map((item, index) => (
              <div key={item} className="rounded-[18px] border border-white/8 bg-white/[0.04] p-4">
                <div className="text-[11px] text-white/42">STEP {index + 1}</div>
                <div className="mt-2 text-sm leading-6 text-white/86">{item}</div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {primaryCards.map((card) => (
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
            <h3 className="mt-6 text-[1.5rem] font-semibold tracking-[-0.04em]">{card.title}</h3>
            <p className={`mt-3 text-sm leading-7 ${card.title === "Chat" ? "text-white/72" : "text-[#5f564b]"}`}>{card.body}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <article className="rounded-[28px] border border-[#e8e1d6] bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">WHY THIS HOME EXISTS</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#111111]">지금 필요한 건 런처다</h2>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <InfoCard
              title="메인 고정"
              body="무엇이 메인 화면인지 흔들리지 않게 잡는다. 지금 기준은 Chat 입력, World 씬, Records 구조다."
            />
            <InfoCard
              title="단계 분리"
              body="예쁜 화면과 데이터 파이프라인을 한 번에 섞지 않고, 단계별로 검증할 수 있게 나눈다."
            />
            <InfoCard
              title="리빌드 기준"
              body="이전 gido 실험 흔적에 덧대지 않고, 운영 OS 기준에서 다시 세운다."
            />
          </div>
        </article>

        <aside className="rounded-[28px] border border-[#e8e1d6] bg-[#fcfbf8] p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">TODAY'S TRACK</p>
          <div className="mt-4 grid gap-3 text-sm text-[#5f564b]">
            <div className="rounded-[18px] border border-[#ece4d8] bg-white p-4">로그인, 가입, 기본 진입을 beta 중심으로 고정</div>
            <div className="rounded-[18px] border border-[#ece4d8] bg-white p-4">World를 다음 메인 작업으로 올리기</div>
            <div className="rounded-[18px] border border-[#ece4d8] bg-white p-4">Records는 구조를 다시 붙일 최소 그릇으로 유지</div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[20px] border border-[#ece4d8] bg-[#fcfbf8] p-5">
      <p className="text-sm font-semibold text-[#111111]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{body}</p>
    </div>
  );
}
