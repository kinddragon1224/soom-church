"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Crown,
  Flame,
  Hand,
  Heart,
  Music,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

type Theme = {
  text: string;
  bg: string;
  border: string;
  label: string;
  ring: string;
};

type DialogueItem = {
  speaker: string;
  text: string;
  theme: Theme;
};

type ScriptItem = {
  type: "intro" | "greeting" | "scene" | "final";
  category: string;
  title?: string;
  character?: string;
  action?: string;
  content?: string[];
  dialogue?: string | DialogueItem[];
  icon: React.ReactNode;
  theme: Theme;
  accent?: string;
  multi?: boolean;
};

const colors = {
  king: { text: "text-amber-900", bg: "bg-amber-50", border: "border-amber-200", label: "bg-amber-600", ring: "ring-amber-100" },
  messenger: { text: "text-purple-900", bg: "bg-purple-50", border: "border-purple-200", label: "bg-purple-600", ring: "ring-purple-100" },
  friend1: { text: "text-emerald-900", bg: "bg-emerald-50", border: "border-emerald-200", label: "bg-emerald-600", ring: "ring-emerald-100" },
  friend2: { text: "text-sky-900", bg: "bg-sky-50", border: "border-sky-200", label: "bg-sky-600", ring: "ring-sky-100" },
  friend3: { text: "text-indigo-900", bg: "bg-indigo-50", border: "border-indigo-200", label: "bg-indigo-600", ring: "ring-indigo-100" },
  astrologer: { text: "text-slate-800", bg: "bg-slate-100", border: "border-slate-300", label: "bg-slate-600", ring: "ring-slate-200" },
  soldier: { text: "text-rose-900", bg: "bg-rose-50", border: "border-rose-200", label: "bg-rose-600", ring: "ring-rose-100" },
  all: { text: "text-pink-900", bg: "bg-pink-50", border: "border-pink-200", label: "bg-pink-600", ring: "ring-pink-100" },
  base: { text: "text-slate-900", bg: "bg-white", border: "border-slate-200", label: "bg-slate-700", ring: "ring-slate-100" },
};

const scriptData: ScriptItem[] = [
  {
    type: "intro",
    category: "표어 및 표어말씀",
    title: "하나님의 Who~ 이삭 I do~",
    content: [
      "하나님의 Who~ 이삭 I do~",
      "하나님의 Who~ 이삭 I do~",
      "여호와 하나님이 땅의 흙으로\n사람(이름)을 지으시고",
      "생기를 그 코에 불어 넣으시니\n사람(이름)이 생령이 되니라.",
      "창세기 2장 7절 말씀. 아멘.",
    ],
    icon: <Hand className="h-8 w-8 text-blue-600" />,
    theme: colors.base,
    accent: "text-blue-700",
  },
  {
    type: "greeting",
    category: "인사 및 말씀 소개",
    title: "샬롬! 진짜 진짜 하나님 이야기",
    content: [
      "이삭영유아부 샬롬!",
      "우리 손가락 인사하자.",
      "오늘 말씀은, 여호와 하나님,\n진짜 진짜 하나님을 고백한\n다니엘 이야기에요.",
      "여호와 하나님, 진짜 진짜 하나님,\n하나님만 사랑해요",
      "한번 더,\n여호와 하나님, 진짜 진짜 하나님,\n하나님만 사랑해요!",
    ],
    icon: <Sparkles className="h-8 w-8 text-yellow-500" />,
    theme: colors.all,
    accent: "text-pink-700",
  },
  {
    type: "scene",
    category: "장면 1",
    character: "느부갓네살왕",
    action: "금 신상을 만들며",
    dialogue: "나는 바벨론의 왕 느부갓네살.\n\n뚝딱뚝딱 금 신상을 만들지,\n하나님보다 더 사랑해 (x2)",
    icon: <Crown className="h-8 w-8 text-amber-500" />,
    theme: colors.king,
  },
  {
    type: "scene",
    category: "장면 2",
    character: "전령",
    action: "엄중하게 선포하며",
    dialogue:
      "악기 소리가 들리면,\n금 신상에 엎드려서 절하세요.\n\n그렇지 않으면, 그 즉시\n불타는 화덕 속에 던져 넣을 것이에요!",
    icon: <Music className="h-8 w-8 text-purple-500" />,
    theme: colors.messenger,
  },
  {
    type: "scene",
    category: "장면 3",
    character: "세 친구",
    action: "함께 고백해요",
    dialogue:
      "여호와 하나님, 진짜 진짜 하나님,\n하나님만 사랑해요\n\n이삭이들 우리 같이 고백해요.\n여호와 하나님, 진짜 진짜 하나님,\n하나님만 사랑해요",
    icon: <Users className="h-8 w-8 text-emerald-500" />,
    theme: colors.friend1,
  },
  {
    type: "scene",
    category: "장면 4",
    character: "점성가",
    action: "왕에게 일러바치며",
    dialogue:
      "근데요, 쟤네들은,\n왕이 하나님보다 더 좋아요-\n하나님보다 신상이 더 좋아요~ 하지 않아요!\n혼내주세요.",
    icon: <Users className="h-8 w-8 text-slate-500" />,
    theme: colors.astrologer,
  },
  {
    type: "scene",
    category: "장면 5",
    character: "대화형 장면",
    action: "왕의 분노와 친구 1의 대답",
    dialogue: [
      {
        speaker: "왕",
        text: "에이잇~ (분노) 너희, 진짜로,\n내가 뚝딱뚝딱한 금 신상에게 절을 하지 않았어?\n\n어느 신이 너희를\n내 손에서 구해 낼 수 있겠느냐?",
        theme: colors.king,
      },
      {
        speaker: "친구 1",
        text: "(앞으로 나서며) 왕이시여.\n여호와 하나님, 진짜 진짜 하나님이\n우리를 활활 타는 화덕 속에서 구해 주실 거에요.\n\n여호와 하나님, 진짜 진짜 하나님,\n하나님만 사랑해요!",
        theme: colors.friend1,
      },
    ],
    icon: <Flame className="h-8 w-8 text-orange-500" />,
    theme: colors.base,
    multi: true,
  },
  {
    type: "scene",
    category: "장면 6",
    character: "대화형 장면",
    action: "친구 2와 친구 3의 당당함",
    dialogue: [
      {
        speaker: "친구 2",
        text: "(앞으로 나서며) 왕이시여.\n여호와 하나님, 진짜 진짜 하나님이\n임금님의 손에서도 구해 주실 것입니다.\n\n여호와 하나님, 진짜 진짜 하나님,\n하나님만 사랑해요!",
        theme: colors.friend2,
      },
      {
        speaker: "친구 3",
        text: "(앞으로 나서며) 왕이시여.\n비록 그렇게 되지 않더라도,\n우리는 왕의 신들은 섬기지도 않고,\n왕이 뚝딱뚝딱한 금 신상에게 절을 하지도 않을 것입니다.\n\n여호와 하나님, 진짜 진짜 하나님,\n하나님만 사랑해요!",
        theme: colors.friend3,
      },
    ],
    icon: <Heart className="h-8 w-8 text-pink-500" />,
    theme: colors.base,
    multi: true,
  },
  {
    type: "scene",
    category: "장면 7",
    character: "긴박한 상황",
    action: "왕의 명령과 군인의 행동",
    dialogue: [
      { speaker: "왕", text: "(화가 잔뜩 나며, 얼굴이 빨개짐) 이놈들!!!!!\n화덕을 일곱 배 더 뜨겁게 달구어라!\n이놈들을 던져 넣어라!", theme: colors.king },
      { speaker: "군인", text: "(관을 쓰인 채로 묶음, 화덕 속에 던져 넣음)\n으아아악! (붙든 사람들도 그 불꽃에 타서 죽음)", theme: colors.soldier },
    ],
    icon: <Shield className="h-8 w-8 animate-pulse text-rose-600" />,
    theme: colors.base,
    multi: true,
  },
  {
    type: "scene",
    category: "장면 8",
    character: "기적",
    action: "놀라워하는 왕",
    dialogue:
      "(세 친구와 다른 한 사람의 실루엣)\n\n(놀라며, 일어나서) 모두 결박이 풀린 채 화덕 안에서 걷고 있고,\n그들에게 아무런 상처도 없다!\n더욱이 넷째 사람의 모습은 신의 아들과 같다!\n\n(화덕 어귀로 가까이 감)\n가장 높으신 하나님의 종\n사드락과 메삭과 아벳느고는 이리로 나오너라.\n\n세 친구: (불에서 걸어 나옴)",
    icon: <Sparkles className="h-8 w-8 text-sky-400" />,
    theme: colors.king,
  },
  {
    type: "final",
    category: "마무리",
    character: "조서 선포",
    action: "하나님을 찬양하는 왕",
    dialogue:
      "내가 조서를 내린다.\n여호와 하나님, 진짜 진짜 하나님.\n\n이와 같이 자기를 믿는 사람을\n구원할 수 있는 신은 다시 없을 것이다.\n\n여호와 하나님, 진짜 진짜 하나님,\n하나님만 사랑해요!",
    icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
    theme: colors.king,
  },
];

function HighlightLove({ text }: { text: string }) {
  return (
    <>
      {text.split("하나님만 사랑해요").map((part, i, arr) => (
        <span key={`${part}-${i}`}>
          {part.split("\n").map((line, j, lines) => (
            <span key={`${line}-${j}`}>
              {line}
              {j < lines.length - 1 ? <br /> : null}
            </span>
          ))}
          {i < arr.length - 1 ? <mark className="rounded-md bg-pink-100 px-1 font-extrabold text-pink-700">하나님만 사랑해요</mark> : null}
        </span>
      ))}
    </>
  );
}

export default function IsakScriptPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const current = scriptData[currentStep];

  const progress = useMemo(() => ((currentStep + 1) / scriptData.length) * 100, [currentStep]);

  const nextStep = () => {
    if (currentStep === scriptData.length - 1) {
      setCurrentStep(0);
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-stone-50 to-slate-100 px-3 py-4 text-slate-900 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl pb-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">이삭영유아부</h1>
          </div>
          <img src="/isak-script/logo-top-right.png" alt="이삭영유아부 로고" className="h-8 w-auto object-contain sm:h-10" />
        </div>

        <div className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-black text-white">{currentStep + 1} / {scriptData.length}</span>
            <span className="text-xs font-bold text-slate-500">{current.category}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
          <div className="p-4 sm:p-7">
            <div className="mb-6 flex items-start gap-3">
              <div className={`rounded-2xl border bg-white p-3 shadow-sm ${current.theme.border} ${current.theme.ring}`}>{current.icon}</div>
              <div>
                <div className="text-xs font-bold tracking-wider text-slate-500">{current.category}</div>
                {current.character ? <div className="mt-1 text-lg font-extrabold tracking-tight">{current.character}</div> : null}
                {current.action ? <div className="text-sm font-medium text-slate-500">{current.action}</div> : null}
              </div>
            </div>

            {(current.type === "intro" || current.type === "greeting") && current.content ? (
              <div className="space-y-5">
                <h2 className={`inline-block rounded-2xl bg-slate-50 px-5 py-2 text-lg font-black ${current.accent ?? "text-slate-700"}`}>{current.title}</h2>
                <div className="space-y-4">
                  {current.content.map((line, idx) => (
                    <p
                      key={`${idx}-${line}`}
                      className={`break-keep whitespace-pre-line text-[1.2rem] font-bold leading-[1.8] tracking-[-0.01em] sm:text-[1.55rem] ${line.includes("사랑해요") ? "text-pink-700" : "text-slate-800"}`}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ) : current.multi && Array.isArray(current.dialogue) ? (
              <div className="space-y-4">
                {current.dialogue.map((item) => (
                  <div key={`${item.speaker}-${item.text.slice(0, 10)}`} className={`rounded-3xl border-2 p-5 sm:p-6 ${item.theme.bg} ${item.theme.border}`}>
                    <div className="mb-3 flex items-center">
                      <span className={`rounded-lg px-3 py-1 text-xs font-black text-white ${item.theme.label}`}>{item.speaker}</span>
                    </div>
                    <p className={`${item.theme.text} break-keep text-[1.17rem] font-bold leading-[1.78] tracking-[-0.01em] sm:text-[1.5rem]`}>
                      <HighlightLove text={item.text} />
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`rounded-[2rem] border-2 p-6 sm:p-8 ${current.theme.bg} ${current.theme.border}`}>
                <p className={`${current.theme.text} break-keep text-[1.2rem] font-bold leading-[1.82] tracking-[-0.01em] sm:text-[1.55rem]`}>
                  <HighlightLove text={String(current.dialogue ?? "")} />
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-4 sm:px-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${
                currentStep === 0 ? "cursor-not-allowed border-slate-200 text-slate-300" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              <ChevronLeft size={24} strokeWidth={3} />
            </button>

            <div className="text-center">
              <div className="text-[10px] font-black tracking-[0.2em] text-slate-400">SCENE</div>
              <div className="text-lg font-black text-slate-900">{String(currentStep + 1).padStart(2, "0")}</div>
            </div>

            <button onClick={nextStep} className="flex h-12 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-black text-white shadow hover:bg-slate-800">
              {currentStep === scriptData.length - 1 ? "다시 시작" : "다음"}
              {currentStep === scriptData.length - 1 ? null : <ChevronRight size={20} strokeWidth={3} />}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs font-semibold text-slate-500">한 문장을 또박또박 읽고, 반복 문장은 아이들과 함께 따라 말하면 좋아.</p>
      </div>
    </div>
  );
}
