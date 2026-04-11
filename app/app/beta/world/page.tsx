"use client";

import Link from "next/link";

const homes = [
  { name: "가정 A", className: "left-[8%] top-[25%]", glow: "#ffd28a" },
  { name: "가정 B", className: "right-[10%] top-[30%]", glow: "#ffd28a" },
  { name: "가정 C", className: "left-[18%] bottom-[18%]", glow: "#ffcf9f" },
  { name: "가정 D", className: "right-[18%] bottom-[16%]", glow: "#ffcf9f" },
];

const villagers = [
  { name: "목자", status: "집중", className: "left-[47%] top-[36%]", tone: "gold", effect: "☀" },
  { name: "새가족", status: "새 방문", className: "left-[28%] top-[42%]", tone: "soft", effect: "✦" },
  { name: "기도", status: "기도", className: "right-[28%] top-[44%]", tone: "violet", effect: "✧" },
  { name: "후속", status: "후속", className: "left-[34%] bottom-[23%]", tone: "amber", effect: "✉" },
  { name: "돌봄", status: "돌봄", className: "right-[34%] bottom-[21%]", tone: "sky", effect: "💧" },
];

function villagerTone(tone: string) {
  switch (tone) {
    case "gold":
      return "border-[#f5d48a]/50 bg-[#f6c86a40] text-[#fff0bf] shadow-[#f59e0b44]";
    case "violet":
      return "border-[#c4b5fd]/50 bg-[#8b5cf640] text-[#efe7ff] shadow-[#8b5cf655]";
    case "amber":
      return "border-[#fcd34d]/50 bg-[#f59e0b40] text-[#fff2c2] shadow-[#f59e0b55]";
    case "sky":
      return "border-[#7dd3fc]/50 bg-[#38bdf840] text-[#dff6ff] shadow-[#38bdf855]";
    default:
      return "border-white/20 bg-white/12 text-white shadow-black/20";
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
            감성 톤과 장면 몰입감을 먼저 고정한다. 설명보다 장면이 먼저 읽히는 방향으로 계속 다듬는다.
          </p>
        </div>

        <div className="flex gap-2 text-[11px]">
          <Link href="/app/beta/chat" className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-3 py-1.5 text-[#6f6256]">Chat</Link>
          <Link href="/app/beta/records" className="rounded-full border border-[#e7dfd3] bg-[#faf7f2] px-3 py-1.5 text-[#6f6256]">Records</Link>
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_240px]">
        <section className="overflow-hidden rounded-[34px] border border-[#111827] bg-[#121826] p-4 text-white shadow-[0_24px_64px_rgba(15,23,42,0.20)]">
          <div className="relative min-h-[780px] overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,#415987_0%,#4e6f97_18%,#637d9e_30%,#688358_31%,#4f733e_60%,#3f5f32_100%)]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-x-0 top-0 h-[44%] bg-[radial-gradient(circle_at_50%_8%,rgba(255,232,178,0.52),transparent_28%)]" />
              <div className="absolute left-[10%] top-[12%] h-28 w-28 rounded-full bg-[#d8c2ff2b] blur-3xl animate-[float_12s_ease-in-out_infinite]" />
              <div className="absolute right-[11%] top-[18%] h-24 w-24 rounded-full bg-[#8be1ff2e] blur-3xl animate-[float_15s_ease-in-out_infinite]" />
              <div className="absolute left-[22%] bottom-[10%] h-28 w-28 rounded-full bg-[#ffd48d26] blur-3xl animate-[float_16s_ease-in-out_infinite]" />

              <div className="absolute inset-x-0 bottom-0 h-[24%] bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.18))]" />

              <div className="absolute left-[14%] top-[32%] h-[5px] w-[24%] rotate-[11deg] rounded-full bg-[#dbc59aaa] shadow-[0_0_14px_rgba(219,197,154,0.4)]" />
              <div className="absolute right-[17%] top-[46%] h-[5px] w-[22%] -rotate-[18deg] rounded-full bg-[#dbc59aaa] shadow-[0_0_14px_rgba(219,197,154,0.4)]" />
              <div className="absolute left-[38%] bottom-[18%] h-[5px] w-[20%] rounded-full bg-[#dbc59aaa] shadow-[0_0_14px_rgba(219,197,154,0.4)]" />

              <div className="absolute left-[8%] bottom-[8%] h-[18%] w-[18%] rounded-full bg-black/8 blur-2xl" />
              <div className="absolute right-[8%] bottom-[10%] h-[16%] w-[16%] rounded-full bg-black/8 blur-2xl" />
            </div>

            <div className="absolute left-[50%] top-[9%] z-10 -translate-x-1/2 text-center">
              <div className="mx-auto flex h-[128px] w-[148px] items-center justify-center rounded-[34px] border border-white/14 bg-[#f8f1e926] shadow-[0_18px_38px_rgba(15,23,42,0.20)] backdrop-blur-sm animate-[pulseGlow_5s_ease-in-out_infinite]">
                <span className="text-5xl drop-shadow-[0_4px_8px_rgba(255,255,255,0.15)]">⛪</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-white">모임 공간</p>
            </div>

            {homes.map((home, index) => (
              <div
                key={home.name}
                className={`absolute ${home.className} z-10 w-[164px] text-center`}
                style={{ animation: `float ${9 + index * 1.2}s ease-in-out infinite` }}
              >
                <div className="relative rounded-[28px] border border-white/10 bg-[#fbf6ed18] p-4 shadow-[0_16px_28px_rgba(15,23,42,0.16)] backdrop-blur-sm">
                  <div className="absolute inset-x-[20%] top-[18%] h-6 rounded-full blur-xl" style={{ backgroundColor: `${home.glow}55` }} />
                  <div className="text-4xl">🏠</div>
                  <div className="mt-2 text-sm font-semibold text-white">{home.name}</div>
                  <div className="mt-1 text-[11px] text-white/60">창문 불빛 · 저녁 방문</div>
                </div>
                <div className="mx-auto mt-2 h-2 w-12 rounded-full bg-black/20 blur-[2px]" />
              </div>
            ))}

            {villagers.map((villager, index) => (
              <div
                key={villager.name}
                className={`absolute ${villager.className} z-20 flex w-[102px] flex-col items-center text-center`}
                style={{ animation: `bob ${2.7 + index * 0.2}s ease-in-out infinite` }}
              >
                <div className={`relative flex h-[74px] w-[74px] items-center justify-center rounded-[24px] border text-base font-semibold shadow-[0_12px_28px] ${villagerTone(villager.tone)}`}>
                  <span className="absolute -top-3 right-0 text-sm animate-[sparkle_2.4s_linear_infinite] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{villager.effect}</span>
                  {villager.name.slice(0, 1)}
                </div>
                <p className="mt-2 text-[12px] font-medium text-white">{villager.name}</p>
                <span className="mt-1 rounded-full border border-white/12 bg-black/14 px-2 py-0.5 text-[10px] text-white/72">{villager.status}</span>
                <div className="mt-1 h-2 w-8 rounded-full bg-black/18 blur-[2px]" />
              </div>
            ))}

            <div className="absolute bottom-[6%] left-[50%] z-20 -translate-x-1/2 rounded-[24px] border border-white/12 bg-black/16 px-6 py-4 text-center backdrop-blur-sm shadow-[0_10px_24px_rgba(0,0,0,0.14)]">
              <p className="text-sm font-semibold text-white">A 방식 리파인 중</p>
              <p className="mt-2 text-[12px] leading-6 text-white/72">레이어 애니메이션으로 감성을 먼저 만들고, 다음에 실제 데이터와 캐릭터 아트를 연결한다.</p>
            </div>
          </div>

          <style jsx>{`
            @keyframes bob {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-12px); }
            }
            @keyframes pulseGlow {
              0%, 100% { box-shadow: 0 18px 38px rgba(15,23,42,0.20), 0 0 0 rgba(255,220,156,0.0); }
              50% { box-shadow: 0 22px 44px rgba(15,23,42,0.24), 0 0 44px rgba(255,220,156,0.16); }
            }
            @keyframes sparkle {
              0% { transform: translateY(0px) scale(0.92); opacity: 0.55; }
              50% { transform: translateY(-5px) scale(1); opacity: 1; }
              100% { transform: translateY(0px) scale(0.92); opacity: 0.55; }
            }
          `}</style>
        </section>

        <aside className="grid gap-4">
          <article className="rounded-[28px] border border-[#e8e1d6] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[10px] tracking-[0.18em] text-[#9a8b7a]">RULE</p>
            <div className="mt-4 grid gap-3 text-sm text-[#5f564b]">
              <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">장면이 먼저 보이고, 설명은 나중</div>
              <div className="rounded-[18px] border border-[#ece4d8] bg-[#fcfbf8] p-4">집, 사람, 빛, 길의 밀도를 계속 올리기</div>
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
