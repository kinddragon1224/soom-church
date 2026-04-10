import Link from "next/link";

const villageNodes = [
  { name: "모임 공간", emoji: "⛪", className: "left-[41%] top-[12%] w-[132px] h-[112px]" },
  { name: "가정 A", emoji: "🏠", className: "left-[8%] top-[24%] w-[124px] h-[100px]" },
  { name: "가정 B", emoji: "🏠", className: "right-[10%] top-[28%] w-[124px] h-[100px]" },
  { name: "가정 C", emoji: "🏠", className: "left-[18%] bottom-[18%] w-[124px] h-[100px]" },
  { name: "가정 D", emoji: "🏠", className: "right-[18%] bottom-[16%] w-[124px] h-[100px]" },
];

const characterNodes = [
  { name: "목자", effect: "집중", emoji: "목", className: "left-[47%] top-[30%]" },
  { name: "새가족", effect: "새 방문", emoji: "새", className: "left-[26%] top-[38%]" },
  { name: "기도 대상", effect: "기도", emoji: "기", className: "right-[28%] top-[42%]" },
  { name: "후속 대상", effect: "후속", emoji: "후", className: "left-[34%] bottom-[26%]" },
  { name: "돌봄 대상", effect: "돌봄", emoji: "돌", className: "right-[34%] bottom-[24%]" },
];

export default function BetaWorldPage() {
  return (
    <div className="flex flex-col gap-6 text-[#171717]">
      <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-[30px] border border-[#ece4d8] bg-white px-6 py-7 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:px-7">
          <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">BETA / WORLD SCENE</p>
          <h1 className="mt-3 text-[2.2rem] font-semibold tracking-[-0.06em] text-[#111111]">월드 첫 장면</h1>
          <p className="mt-4 max-w-[760px] text-sm leading-7 text-[#5f564b]">
            여기부터가 진짜 메인이다. 운영 상태를 카드로 읽는 게 아니라, 작은 마을 장면 안에서 사람과 가정, 기도와 후속 흐름을 공간적으로 읽게 만든다.
          </p>
        </section>

        <aside className="rounded-[30px] border border-[#111827] bg-[#111827] px-6 py-7 text-white shadow-[0_18px_44px_rgba(15,23,42,0.16)]">
          <p className="text-[10px] tracking-[0.18em] text-white/46">SCENE GOAL</p>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-white/82">
            <div className="rounded-[18px] border border-white/8 bg-white/[0.04] p-4">마을을 먼저 느끼게 만들기</div>
            <div className="rounded-[18px] border border-white/8 bg-white/[0.04] p-4">사람 상태를 텍스트보다 위치와 이펙트로 읽히게 만들기</div>
            <div className="rounded-[18px] border border-white/8 bg-white/[0.04] p-4">다음 단계에서 실제 데이터만 갈아끼우면 되게 구조 고정</div>
          </div>
        </aside>
      </header>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="overflow-hidden rounded-[34px] border border-[#111827] bg-[linear-gradient(180deg,#131a2a_0%,#172033_45%,#1d3426_46%,#264328_100%)] p-5 text-white shadow-[0_24px_64px_rgba(15,23,42,0.2)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.18em] text-white/46">SOOM VILLAGE</p>
              <p className="mt-1 text-lg font-semibold">운영 월드 프로토타입</p>
            </div>
            <div className="flex gap-2 text-[11px] text-white/64">
              <Link href="/app/beta/chat" className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">Chat</Link>
              <Link href="/app/beta/records" className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">Records</Link>
            </div>
          </div>

          <div className="relative min-h-[720px] rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,#263756_0%,#22314b_34%,#31502d_35%,#3e612e_100%)] px-6 py-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
              <div className="absolute left-[9%] top-[12%] h-24 w-24 rounded-full bg-[#a78bfa22] blur-3xl" />
              <div className="absolute right-[10%] top-[18%] h-20 w-20 rounded-full bg-[#38bdf822] blur-3xl" />
              <div className="absolute left-[25%] bottom-[10%] h-24 w-24 rounded-full bg-[#f59e0b22] blur-3xl" />

              <div className="absolute left-[16%] top-[30%] h-[4px] w-[26%] rotate-[10deg] rounded-full bg-[#dbc59a66]" />
              <div className="absolute right-[18%] top-[44%] h-[4px] w-[24%] -rotate-[18deg] rounded-full bg-[#dbc59a66]" />
              <div className="absolute left-[38%] bottom-[18%] h-[4px] w-[22%] rounded-full bg-[#dbc59a66]" />
            </div>

            {villageNodes.map((node) => (
              <div
                key={node.name}
                className={`absolute ${node.className} rounded-[26px] border border-white/10 bg-[#fbf6ed12] p-4 text-center shadow-[0_12px_24px_rgba(15,23,42,0.14)] backdrop-blur-sm`}
              >
                <div className="text-3xl">{node.emoji}</div>
                <div className="mt-2 text-sm font-semibold text-white">{node.name}</div>
              </div>
            ))}

            {characterNodes.map((node) => (
              <div key={node.name} className={`absolute ${node.className} z-20 flex w-[94px] flex-col items-center text-center`}>
                <div className="flex h-16 w-16 items-center justify-center rounded-[20px] border border-white/14 bg-white/[0.08] text-sm font-semibold text-white shadow-[0_10px_20px_rgba(15,23,42,0.16)]">
                  {node.emoji}
                </div>
                <p className="mt-2 text-[12px] font-medium text-white">{node.name}</p>
                <span className="mt-1 rounded-full border border-white/12 bg-black/10 px-2 py-0.5 text-[10px] text-white/72">{node.effect}</span>
              </div>
            ))}

            <div className="absolute bottom-[6%] left-[50%] -translate-x-1/2 rounded-[22px] border border-white/10 bg-black/12 px-5 py-4 text-center backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">다음 단계</p>
              <p className="mt-2 text-[12px] leading-6 text-white/70">실제 데이터, 진짜 캐릭터, 실제 상태 이펙트로 갈아끼우기</p>
            </div>
          </div>
        </section>

        <aside className="grid gap-4">
          <article className="rounded-[28px] border border-[#e8e1d6] bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">SCENE READ</p>
            <div className="mt-4 grid gap-3 text-sm text-[#5f564b]">
              <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">중앙 상단은 모임 공간</div>
              <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">좌우 집은 가정</div>
              <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">사람 상태는 캐릭터 주변 이펙트로 읽기</div>
            </div>
          </article>

          <article className="rounded-[28px] border border-[#e8e1d6] bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">WHY THIS FIRST</p>
            <p className="mt-4 text-sm leading-7 text-[#5f564b]">
              홈보다 중요한 건 결국 이 장면이다. 운영 OS가 다른 툴과 달라 보이려면, 여기서 이미 제품 감각이 나와야 한다.
            </p>
          </article>
        </aside>
      </section>
    </div>
  );
}
