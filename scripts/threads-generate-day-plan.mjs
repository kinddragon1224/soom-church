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

const date = process.argv[2] || todayKST(0);
const outDir = path.resolve('ops/threads/queue');
const outPath = path.join(outDir, `${date}.json`);

const slots = [
  '주역 방법론 1',
  '신학 일상글 1',
  '역학·신학 인사이트 1',
  '주역 방법론 2',
  '신학 일상글 2',
  '역학·신학 인사이트 2',
  '주역 방법론 3',
  '신학 일상글 3',
  '역학·신학 인사이트 3'
];

const categories = [
  'method', 'faith-daily', 'insight',
  'method', 'faith-daily', 'insight',
  'method', 'faith-daily', 'insight'
];

const imageByHour = {};

const texts = [
  '돈이 안 모이는 이유, 의외로 수입보다 누수야.\n\n주역식으로 보면 순서는 간단해.\n損(손, 덜어냄) → 節(절, 경계) → 益(익, 불림).\n\n오늘 자동결제 1개만 끊어보자.\n\n#주역',
  '믿음은 큰 말보다 작은 책임에서 먼저 보여.\n\n미뤄둔 연락 1건만 오늘 답해봐.\n그 한 통이 관계 분위기를 바꾼다.\n\n#일상신학',
  '창세기 1:1의 샤마임·에레츠와\n주역의 乾坤(건곤)을 같이 놓고 보면 꽤 재밌다.\n\n둘 다 세계를 여는 두 축인데,\n하나는 창조의 문법, 하나는 변화의 문법에 가깝다.\n\n#건곤',
  '결정이 꼬일 때는 정보 부족보다\n타이밍 미스가 더 크다.\n\n時中(시중, 때에 맞음)은\n"지금 밀지, 멈출지"부터 보라는 말이다.\n\n큰 결정 하나는 10분만 멈춰서 다시 보자.\n\n#시중',
  '불안한 날엔 큰 계획이 더 무겁게 느껴진다.\n\n오늘은 하나만 끝내자.\n할 일 3개 중 제일 작은 것부터.\n그게 흐름을 다시 살린다.\n\n#일상신학',
  '역학과 신학이 닿는 지점이 있다.\n사람을 숙명으로 못 박지 않는다는 점.\n\n해석은 낙인 찍으려고 하는 게 아니라\n다시 움직이게 하려고 하는 거다.\n\n#역학신학',
  '관계 싸움에서 말 세게 하면\n대부분 둘 다 손해 본다.\n\n中正(중정, 치우치지 않음)은\n이럴 때 말의 순서를 잡아준다.\n\n반박 전에 질문 하나만: "지금 뭐가 제일 답답해?"\n\n#중정',
  '신앙을 현실 언어로 바꾸면\n결국 돌봄의 순서가 된다.\n\n오늘 옆 사람 한 명 부담을 줄여주는\n작은 행동 1개만 고르자.\n\n#돌봄',
  '길흉을 결과 예언으로만 읽으면 불안해진다.\n\n근데 대응 신호로 읽으면\n다음 선택이 훨씬 또렷해진다.\n\n너는 지금 주역을 어떤 방식으로 읽고 있어?\n\n#길흉'
];

const comments = [
  '오늘은 늘리는 날이 아니라 새는 구멍 막는 날.',
  '미뤄둔 연락 하나만 해도 하루 결이 달라진다.',
  '건곤 비교는 세계를 읽는 관점을 넓혀준다.',
  '지금은 속도보다 타이밍이 먼저다.',
  '작은 완료 하나가 불안을 꺾는다.',
  '해석은 사람을 묶는 게 아니라 풀어주는 쪽이어야 한다.',
  '중정은 센 말보다 맞는 순서다.',
  '돌봄은 작아도 바로 체감되는 행동에서 시작한다.',
  '길흉을 신호로 읽으면 다음 수가 보인다.'
];

const posts = HOURS.map((hour, i) => ({
  hour,
  slot: slots[i],
  category: categories[i],
  text: texts[i],
  comment: comments[i],
  imageUrl: imageByHour[hour] || null,
  status: 'pending'
}));

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ date, timezone: TZ, posts }, null, 2));
console.log(`Generated: ${outPath}`);
