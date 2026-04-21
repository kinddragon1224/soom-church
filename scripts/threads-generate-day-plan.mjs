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
  '주역 방법론 1) 돈 문제는 損→節→益 순서로 본다. 먼저 누수를 덜어내고(損), 기준으로 지출을 분별한 뒤(節), 마지막에 확장(益)으로 간다. 오늘은 자동결제 1개 점검부터 시작하자.',
  '신학 일상글 1) 믿음은 큰 말보다 작은 책임에서 드러난다. 오늘 미뤄둔 연락 1건만 정직하게 답해도 관계의 흐름이 바뀐다.',
  '인사이트 1) 이정용 교수는 주역을 예언서보다 변화 해석의 언어로 읽었다. 같은 사건도 "왜"보다 "지금 어디를 고칠지"로 보면 행동이 빨라진다.',
  '주역 방법론 2) 時中은 타이밍 판단이다. 지금 밀어붙일 때인지 멈춰 정리할 때인지 먼저 읽어야 한다. 오늘 중요한 결정 1개는 10분 멈춰서 다시 보자.',
  '신학 일상글 2) 불안한 날일수록 거대한 계획보다 오늘의 자리 하나를 지키는 게 낫다. 해야 할 일 3개 중 가장 작은 것부터 끝내자.',
  '인사이트 2) 역학과 신학의 공통점은 사람을 숙명으로 묶지 않는다는 데 있다. 해석의 목적은 낙인보다 회복, 정답보다 방향이다.',
  '주역 방법론 3) 中正은 과속도 지연도 아닌 적정선이다. 관계 갈등에선 반박 전에 질문 1개가 중정에 가깝다. "지금 네가 제일 답답한 지점이 뭐야?"부터 묻자.',
  '신학 일상글 3) 신앙의 언어를 현실에 옮기면 결국 돌봄의 순서가 된다. 오늘 내 옆 사람 한 명의 부담을 줄이는 행동 1개를 선택하자.',
  '인사이트 3) 주역의 길흉을 결과 예언으로 읽으면 불안이 커지고, 대응 신호로 읽으면 선택이 선명해진다. 너는 지금 어떤 방식으로 읽고 있나?'
];

const comments = [
  '핵심은 확장보다 구조 정리다. 오늘은 하나만 줄여보자.',
  '성실은 감정이 아니라 행동의 누적이다. 작은 책임 하나부터.',
  '해석이 행동을 바꿔야 의미가 있다. 오늘 한 줄 복기해보자.',
  '때를 읽으면 실수 절반은 줄어든다. 지금은 속도보다 판단.',
  '불안한 날엔 작은 완료가 큰 확신을 만든다.',
  '좋은 해석은 사람을 고정하지 않고 다시 움직이게 만든다.',
  '중정은 말의 세기가 아니라 순서의 정확도다.',
  '돌봄은 거창함보다 실제 부담을 덜어주는 데서 시작한다.',
  '길흉을 신호로 읽는 순간, 다음 한 수가 보이기 시작한다.'
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
