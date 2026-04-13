#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = "/home/kinddragon/.openclaw/workspace/soom-church";
const opsDir = path.join(root, "ops", "mokjang-world-hourly");
const statePath = path.join(opsDir, "state.json");
const currentPath = path.join(opsDir, "current.json");
const promptPath = path.join(opsDir, "PROMPT.txt");

const tasks = [
  {
    id: "app-01",
    category: "앱개발",
    title: "월드 명령창 프리셋을 실제 운영 액션(후속/기도/심방) 템플릿으로 확장",
    doneWhen: [
      "월드 탭 프리셋 최소 6개",
      "프리셋 클릭 시 명령창 자동 입력",
      "명령 실행 후 기록 탭에 타임라인 반영 확인",
    ],
  },
  {
    id: "design-01",
    category: "앱디자인",
    title: "목양 메인 화면 정보 밀도 정리(핵심 3블록 우선순위 고정)",
    doneWhen: [
      "상단 월드, 중단 명령창, 하단 오늘 운영 블록 시각 계층 명확",
      "불필요한 보조 카피/배지 제거",
      "모바일 세로 화면 기준 스크롤 부담 축소",
    ],
  },
  {
    id: "asset-01",
    category: "에셋구현",
    title: "이미지 제작 전 구조용 에셋 슬롯 체계 고정",
    doneWhen: [
      "world/person/house/hub 슬롯 명명 규칙 통일",
      "fallback 에셋 경로 규칙 문서화",
      "실에셋 교체 시 코드 수정 최소화 구조 확보",
    ],
  },
  {
    id: "benchmark-01",
    category: "벤치마킹->우리화",
    title: "벤치마킹 요소를 목양 OS 용어/흐름으로 치환",
    doneWhen: [
      "게임 용어 0개 유지(운영 용어로 치환)",
      "참고한 UX 패턴과 우리 도메인 대응표 1개 업데이트",
      "월드/목원/기록 3탭 모두 용어 톤 일관성 점검",
    ],
  },
];

fs.mkdirSync(opsDir, { recursive: true });

let state = { pointer: 0, updatedAt: null };
if (fs.existsSync(statePath)) {
  try {
    state = JSON.parse(fs.readFileSync(statePath, "utf8"));
  } catch {
    state = { pointer: 0, updatedAt: null };
  }
}

const pointer = Number.isFinite(state.pointer) ? state.pointer : 0;
const task = tasks[pointer % tasks.length];
const now = new Date().toISOString();

const current = {
  generatedAt: now,
  pointer,
  task,
  rules: [
    "코드 수정 -> typecheck/build -> commit/push 순서 준수",
    "작업 결과는 docs 또는 memory에 짧게 남기기",
    "비밀값/토큰/개인정보는 기록 금지",
  ],
};

const prompt = [
  "[MOKJANG WORLD HOURLY LOOP]",
  `generatedAt=${now}`,
  `taskId=${task.id}`,
  `category=${task.category}`,
  `title=${task.title}`,
  "",
  "doneWhen:",
  ...task.doneWhen.map((d, i) => `${i + 1}. ${d}`),
  "",
  "execute:",
  "1) task를 코드에 반영",
  "2) npm run mobile:typecheck && npm run build",
  "3) commit + push",
  "4) memory/2026-04-13.md에 3줄 요약 append",
].join("\n");

fs.writeFileSync(currentPath, JSON.stringify(current, null, 2));
fs.writeFileSync(promptPath, `${prompt}\n`);

state.pointer = pointer + 1;
state.updatedAt = now;
fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

console.log(`[hourly-loop] generated ${currentPath}`);
console.log(`[hourly-loop] prompt ${promptPath}`);
console.log(`[hourly-loop] next pointer ${state.pointer}`);
