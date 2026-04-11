"use client";

import Link from "next/link";

const homes = [
  { name: "가정 A", className: "left-[8%] top-[24%]" },
  { name: "가정 B", className: "right-[10%] top-[28%]" },
  { name: "가정 C", className: "left-[18%] bottom-[18%]" },
  { name: "가정 D", className: "right-[18%] bottom-[16%]" },
];

const villagers = [
  { name: "목자", status: "집중", className: "left-[47%] top-[34%]", tone: "gold" },
  { name: "새가족", status: "새 방문", className: "left-[28%] top-[40%]", tone: "soft" },
  { name: "기도", status: "기도", className: "right-[28%] top-[43%]", tone: "violet" },
  { name: "후속", status: "후속", className: "left-[34%] bottom-[24%]", tone: "amber" },
  { name: "돌봄", status: "돌봄", className: "right-[34%] bottom-[22%]", tone: "sky" },
];

function villagerTone(tone: string) {
  switch (tone) {
    case "gold":
      return "border-[#f5d48a]/40 bg-[#f6c86a33] text-[#fff0bf] shadow-[#f59e0b33]";
    case "violet":
      return "border-[#c4b5fd]/40 bg-[#8b5cf633] text-[#efe7ff] shadow-[#8b5cf644]";
    case "amber":
      return "border-[#fcd34d]/40 bg-[#f59e0b33] text-[#fff2c2] shadow-[#f59e0b44]";
    case "sky":
      return "border-[#7dd3fc]/40 bg-[#38bdf833] text-[#dff6ff] shadow-[#38bdf844]";
    default:
      return "border-white/20 bg-white/10 text-white shadow-black/20";
  }
}

export default function BetaWorldPage() {
  return (
    <div className="flex flex-col gap-5 text-[#171717]">
      <header className="flex flex-col gap-4 rounded-[28px] border border-[#ece4d8] bg-white px-6 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:flex-row lg:items-end lg:justify-between lg:px-7">
        <div>
          <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">BETA / WORLD SCENE</p>
          <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">월드 첫 장면</h1>
          <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#5f564b]">
            포켓몬풍 친밀한 마을 구조를 오마주한 첫 장면. 지금은 감성과 무드, 위치감, 상태 이펙트를 먼저 고정한다.
          </p>
        </div>

        <div className="flex gap-2 text-[11px]">
          <Link href="/app/beta/chat" className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-3 py-1.5 text-[#6f6256]">Chat</Link>
          <Link href="/app/beta/records" className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-3 py-1.5 text-[#6f6256]">Records</Link>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="overflow-hidden rounded-[34px] border border-[#111827] bg-[#121826] p-4 text-white shadow-[0_24px_64px_rgba(15,23,42,0.20)]">
          <div className="relative min-h-[760px] overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,#31476f_0%,#3c5d84_26%,#496e4d_27%,#5c8447_100%)]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-x-0 top-0 h-[42%] bg-[radial-gradient(circle_at_50%_10%,rgba(255,220,156,0.32),transparent_34%)]" />
              <div className="absolute left-[8%] top-[10%] h-24 w-24 rounded-full bg-[#d8c2ff2b] blur-3xl animate-[float_9s_ease-in-out_infinite]" />
              <div className="absolute right-[12%] top-[16%] h-20 w-20 rounded-full bg-[#8be1ff2e] blur-3xl animate-[float_11s_ease-in-out_infinite]" />
              <div className="absolute left-[22%] bottom-[12%] h-24 w-24 rounded-full bg-[#ffd48d26] blur-3xl animate-[float_13s_ease-in-out_infinite]" />
              <div className="absolute inset-x-0 bottom-0 h-[22%] bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.12))]" />

              <div className="absolute left-[14%] top-[30%] h-[4px] w-[25%] rotate-[11deg] rounded-full bg-[#dbc59a88]" />
              <div className="absolute right-[16%] top-[44%] h-[4px] w-[23%] -rotate-[18deg] rounded-full bg-[#dbc59a88]" />
              <div className="absolute left-[38%] bottom-[17%] h-[4px] w-[22%] rounded-full bg-[#dbc59a88]" />
            </div>

            <div className="absolute left-[50%] top-[10%] z-10 -translate-x-1/2 text-center">
              <div className="mx-auto flex h-[120px] w-[140px] items-center justify-center rounded-[30px] border border-white/12 bg-[#f8f1e91c] shadow-[0_14px_30px_rgba(15,23,42,0.18)] backdrop-blur-sm animate-[pulseGlow_5s_ease-in-out_infinite]">
                <span className="text-4xl">⛪</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-white">모임 공간</p>
            </div>

            {homes.map((home, index) => (
              <div
                key={home.name}
                className={`absolute ${home.className} z-10 w-[150px] text-center`}
                style={{ animation: `float ${8 + index * 1.5}s ease-in-out infinite` }}
              >
                <div className="rounded-[26px] border border-white/10 bg-[#fbf6ed18] p-4 shadow-[0_12px_24px_rgba(15,23,42,0.14)] backdrop-blur-sm">
                  <div className="text-4xl">🏠</div>
                  <div className="mt-2 text-sm font-semibold text-white">{home.name}</div>
                </div>
                <div className="mx-auto mt-2 h-2 w-10 rounded-full bg-black/15 blur-[2px]" />
              </div>
            ))}

            {villagers.map((villager, index) => (
              <div
                key={villager.name}
                className={`absolute ${villager.className} z-20 flex w-[96px] flex-col items-center text-center`}
                style={{ animation: `bob ${2.6 + index * 0.25}s ease-in-out infinite` }}
              >
                <div className={`relative flex h-16 w-16 items-center justify-center rounded-[20px] border text-sm font-semibold shadow-[0_10px_24px] ${villagerTone(villager.tone)}`}>
                  {villager.status === "기도" ? <span className="absolute -top-2 right-0 text-xs animate-[sparkle_2.2s_linear_infinite]">✨</span> : null}
                  {villager.status === "후속" ? <span className="absolute -top-2 right-0 text-xs animate-[sparkle_2.6s_linear_infinite]">✉️</span> : null}
                  {villager.status === "돌봄" ? <span className="absolute -top-2 right-0 text-xs animate-[sparkle_2.8s_linear_infinite]">💧</span> : null}
                  {villager.name.slice(0, 1)}
                </div>
                <p className="mt-2 text-[12px] font-medium text-white">{villager.name}</p>
                <span className="mt-1 rounded-full border border-white/12 bg-black/12 px-2 py-0.5 text-[10px] text-white/72">{villager.status}</span>
                <div className="mt-1 h-2 w-8 rounded-full bg-black/15 blur-[2px]" />
              </div>
            ))}

            <div className="absolute bottom-[7%] left-[50%] z-20 -translate-x-1/2 rounded-[22px] border border-white/10 bg-black/14 px-5 py-4 text-center backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">A 방식 진행 중</p>
              <p className="mt-2 text-[12px] leading-6 text-white/70">키비주얼 1장 기준, 레이어 움직임과 빛 이펙트부터 먼저 붙인다.</p>
            </div>
          </div>

          <style jsx>{`
            @keyframes bob {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            @keyframes pulseGlow {
              0%, 100% { box-shadow: 0 14px 30px rgba(15,23,42,0.18), 0 0 0 rgba(255,220,156,0.0); }
              50% { box-shadow: 0 18px 40px rgba(15,23,42,0.22), 0 0 40px rgba(255,220,156,0.12); }
            }
            @keyframes sparkle {
              0% { transform: translateY(0px) scale(0.92); opacity: 0.45; }
              50% { transform: translateY(-4px) scale(1); opacity: 1; }
              100% { transform: translateY(0px) scale(0.92); opacity: 0.45; }
            }
          `}</style>
        </section>

        <aside className="grid gap-4">
          <article className="rounded-[28px] border border-[#e8e1d6] bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">CURRENT RULE</p>
            <div className="mt-4 grid gap-3 text-sm text-[#5f564b]">
              <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">메인 키비주얼 1개 기준으로 진행</div>
              <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">가벼운 2D 레이어 애니메이션부터 구현</div>
              <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">실제 데이터 연결은 다음 단계</div>
            </div>
          </article>

          <article className="rounded-[28px] border border-[#e8e1d6] bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">NEXT</p>
            <p className="mt-4 text-sm leading-7 text-[#5f564b]">
              다음에는 집과 캐릭터를 더 실제 아트 스타일로 바꾸고, 이 장면 위에 실제 사람/상태 데이터를 얹는다.
            </p>
          </article>
        </aside>
      </section>
    </div>
  );
}
