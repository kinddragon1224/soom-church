#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const TZ = 'Asia/Seoul';
const HOURS = [7, 9, 11, 13, 15, 17, 19, 21, 23];

function todayKST(offsetDays = 0) {
  const now = new Date();
  const kst = new Date(now.toLocaleString('en-US', { timeZone: TZ }));
  kst.setDate(kst.getDate() + offsetDays);
  const y = kst.getFullYear();
  const m = String(kst.getMonth() + 1).padStart(2, '0');
  const d = String(kst.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function daySeed(input) {
  return String(input || '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function minusDay(dateStr, days = 1) {
  const [y, m, d] = String(dateStr).split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  dt.setDate(dt.getDate() - days);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

const date = process.argv[2] || todayKST(0);
const outDir = path.resolve('ops/threads/queue');
const outPath = path.join(outDir, `${date}.json`);

const reportDate = minusDay(date, 1);
const reportPath = path.resolve(`ops/threads/reports/${reportDate}.json`);
const yesterdayReport = readJson(reportPath, {});
const bestCategory = yesterdayReport?.categoryRows?.[0]?.category || 'faith-daily';

const imageByHour = {};
const seed = daySeed(date);

const slots = [
  '일상 공감 1',
  '일상 공감 2',
  '관점 글 1',
  '일상 공감 3',
  '일상 공감 4',
  '관점 글 2',
  '일상 공감 5',
  '일상 공감 6',
  '관점 글 3'
];

const categories = [
  'faith-daily', 'faith-daily', 'insight',
  'method', 'faith-daily', 'insight',
  'method', 'faith-daily', 'insight'
];

const openers = [
  '사는 일은 결국 마음과 순서의 싸움이더라.',
  '하루를 버티게 하는 건 거창한 결심이 아니었다.',
  '요즘 나는 결과보다 리듬을 먼저 본다.',
  '무너지는 날에는 이유가 크지 않고, 반복이 느슨했다.',
  '사람을 살리는 건 대개 정답이 아니라 말의 온도였다.',
  '마음이 흔들릴수록 작은 규칙이 사람을 붙든다.',
  '좋은 날보다 어려운 날이 나를 더 정확하게 가르쳤다.',
  '내가 바꾼 건 삶 전체가 아니라 오늘의 한 칸이었다.',
  '생각은 복잡했는데, 행동은 늘 단순한 데서 풀렸다.'
];

const experienceSeeds = [
  {
    category: 'faith-daily',
    scene: '대전 집에서 아들 둘 등교 준비를 시키다 보면, 아침은 늘 전쟁처럼 지나간다.',
    realization: '목소리를 높이면 일정은 맞아도 마음이 깨진다.',
    action: '오늘은 지시보다 먼저 눈을 맞추고 한 문장만 천천히 말했다.',
    prompt: '너도 아침을 바꾼 한 문장 있으면 알려줘.',
    tag: '아침루틴'
  },
  {
    category: 'faith-daily',
    scene: '육아휴직 중이라 시간이 많을 줄 알았는데, 오히려 마음이 자주 흩어졌다.',
    realization: '비는 시간은 쉬는 시간이 아니라 방향을 잃기 쉬운 시간이었다.',
    action: '호흡 3분, 기도 3분, 오늘 해야 할 일 1개만 적고 시작했다.',
    prompt: '너는 마음이 흔들릴 때 어떤 순서로 다시 서?',
    tag: '육아휴직'
  },
  {
    category: 'insight',
    scene: '주역을 붙들고 있으면 미래를 맞히는 기술보다 지금을 읽는 눈이 먼저 생긴다.',
    realization: '길흉은 공포를 키우는 단어가 아니라 선택을 맑게 하는 신호였다.',
    action: '오늘도 결정을 미루는 대신, 멈출지 밀지 먼저 정했다.',
    prompt: '너는 요즘 예측에 기대는 편이야, 판단을 훈련하는 편이야?',
    tag: '주역'
  },
  {
    category: 'method',
    scene: '고교학점제 프로젝트 회의에서 말이 길어질수록 결론은 늦어졌다.',
    realization: '똑똑한 말보다 기준 한 줄이 팀을 움직였다.',
    action: '이번엔 "오늘 결정할 한 가지"부터 먼저 합의했다.',
    prompt: '너희 팀도 회의 시작 문장 하나 정해볼래?',
    tag: '고교학점제'
  },
  {
    category: 'faith-daily',
    scene: '교회 갔다 오는 길, 아이가 던진 짧은 질문이 하루 종일 남았다.',
    realization: '신앙은 설명이 아니라 태도로 먼저 전해진다는 걸 또 배웠다.',
    action: '오늘은 옳은 답보다 부드러운 대답을 먼저 고르기로 했다.',
    prompt: '요즘 너를 멈춰 세운 질문 한 가지 있어?',
    tag: '일상신앙'
  },
  {
    category: 'insight',
    scene: '직업상담 공부 때 익힌 건 결국 한 사람의 가능성을 현재형으로 보는 훈련이었다.',
    realization: '사람을 과거 이력으로 고정하면 내일이 닫힌다.',
    action: '대화할 때 "원래 너는" 대신 "지금 너는"으로 말을 바꿨다.',
    prompt: '말 한마디를 바꿔서 관계가 풀린 경험 있어?',
    tag: '상담감각'
  },
  {
    category: 'method',
    scene: '한국사 공부할 때도 느꼈지만, 큰 흐름은 작은 전환점에서 갈렸다.',
    realization: '인생도 대사건보다 미세한 습관의 누적이 결과를 만든다.',
    action: '오늘은 계획표보다 첫 20분 행동을 고정했다.',
    prompt: '네 하루를 여는 첫 20분은 뭐야?',
    tag: '작은전환'
  },
  {
    category: 'faith-daily',
    scene: '김주환 교수 강의를 듣다 보니, 알아차림은 감성이 아니라 기술이라는 생각이 들었다.',
    realization: '감정에 끌려가지 않으려면 먼저 몸의 신호를 읽어야 했다.',
    action: '답답할 때 어깨 힘부터 빼고 숨을 길게 뱉었다.',
    prompt: '너는 긴장 올라올 때 제일 먼저 뭘 조절해?',
    tag: '알아차림'
  },
  {
    category: 'insight',
    scene: '역학과 신학을 같이 보다 보면 공통점이 분명하다.',
    realization: '사람을 운명으로 가두지 않고, 다음 선택으로 초대한다는 점이다.',
    action: '그래서 오늘 글도 정답보다 다음 행동 하나를 남기려 했다.',
    prompt: '네가 붙잡고 있는 다음 행동 하나만 적어줘.',
    tag: '역학신학'
  },
  {
    category: 'method',
    scene: '하루가 꼬일 때 나는 보통 더 열심히 하려고 들었다.',
    realization: '문제는 노력 부족이 아니라 순서 오류인 날이 더 많았다.',
    action: '오늘은 "삭제할 일 1개"부터 고르고 나머지를 다시 배치했다.',
    prompt: '지금 네 일정에서 지울 것 하나만 고르면 뭐야?',
    tag: '의사결정'
  },
  {
    category: 'faith-daily',
    scene: '아이들 재우고 나면 하루 평가를 길게 하던 버릇이 있었다.',
    realization: '반성이 길수록 자책도 길어졌다.',
    action: '요즘은 "잘한 것 1개, 고칠 것 1개"만 적고 끝낸다.',
    prompt: '오늘 너의 1+1 회고도 한 줄로 남겨줘.',
    tag: '하루회고'
  },
  {
    category: 'insight',
    scene: '글을 쓸수록 확신이 아니라 질문이 사람을 움직인다는 걸 본다.',
    realization: '철학은 어려운 말이 아니라 정확한 질문에서 시작됐다.',
    action: '오늘 글은 결론보다 질문을 먼저 세웠다.',
    prompt: '지금 네가 붙들고 있는 질문은 뭐야?',
    tag: '질문의힘'
  }
];

function rotate(list, salt = 0) {
  if (!Array.isArray(list) || list.length === 0) return [];
  const offset = (seed + salt) % list.length;
  return [...list.slice(offset), ...list.slice(0, offset)];
}

function pickSeedsByCategory(category, count, used) {
  const pool = rotate(experienceSeeds.filter((s) => s.category === category), count * 3 + 7);
  const out = [];
  for (const item of pool) {
    if (used.has(item)) continue;
    used.add(item);
    out.push(item);
    if (out.length >= count) break;
  }
  return out;
}

const used = new Set();
const categoryNeed = categories.reduce((acc, c) => {
  acc[c] = (acc[c] || 0) + 1;
  return acc;
}, {});

const byCategory = {
  'faith-daily': pickSeedsByCategory('faith-daily', categoryNeed['faith-daily'] || 0, used),
  method: pickSeedsByCategory('method', categoryNeed.method || 0, used),
  insight: pickSeedsByCategory('insight', categoryNeed.insight || 0, used)
};

if (bestCategory in byCategory && byCategory[bestCategory]?.length > 1) {
  byCategory[bestCategory] = rotate(byCategory[bestCategory], 1);
}

const counters = { 'faith-daily': 0, method: 0, insight: 0 };

function nextSeed(category) {
  const idx = counters[category] || 0;
  counters[category] = idx + 1;
  return byCategory[category]?.[idx] || rotate(experienceSeeds, idx)[0];
}

function toPostText({ opener, seedItem, styleIndex }) {
  const styleA = [
    opener,
    seedItem.scene,
    seedItem.realization,
    seedItem.action,
    seedItem.prompt,
    `#${seedItem.tag}`
  ];

  const styleB = [
    opener,
    seedItem.scene,
    seedItem.realization,
    seedItem.action,
    seedItem.prompt,
    `#${seedItem.tag}`
  ];

  const styleC = [
    `${opener} ${seedItem.realization}`,
    seedItem.scene,
    seedItem.action,
    seedItem.prompt,
    `#${seedItem.tag}`
  ];

  const styles = [styleA, styleB, styleC];
  return styles[styleIndex % styles.length].filter(Boolean).join('\n\n');
}

function toComment(seedItem, idx) {
  const endings = [
    '댓글로 한 줄만 남겨줘. 내가 다음 글에 반영할게.',
    '너의 문장 하나가 다음 사람한테 길이 될 수 있어.',
    '짧게 남겨주면 내일 글에서 더 잘 다듬어볼게.'
  ];
  return `${seedItem.prompt} ${endings[idx % endings.length]}`;
}

const posts = HOURS.map((hour, i) => {
  const category = categories[i];
  const seedItem = nextSeed(category);
  const opener = rotate(openers, 13)[i % openers.length];
  return {
    hour,
    slot: slots[i],
    category,
    text: toPostText({ opener, seedItem, styleIndex: i }),
    comment: toComment(seedItem, i),
    imageUrl: imageByHour[hour] || null,
    status: 'pending'
  };
});

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ date, timezone: TZ, sourceReport: reportDate, bestCategory, posts }, null, 2));
console.log(`Generated: ${outPath}`);
