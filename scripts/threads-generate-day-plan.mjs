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

const variantsByCategory = {
  method: [
    {
      text: '돈이 안 모이는 이유, 의외로 수입보다 누수야.\n\n주역식으로 보면 순서는 간단해.\n損(손, 덜어냄) → 節(절, 경계) → 益(익, 불림).\n\n오늘 자동결제 1개만 끊어보자.\n\n#주역',
      comment: '오늘은 늘리는 날이 아니라 새는 구멍 막는 날.'
    },
    {
      text: '결정이 꼬일 때는 정보 부족보다\n타이밍 미스가 더 크다.\n\n時中(시중, 때에 맞음)은\n"지금 밀지, 멈출지"부터 보라는 말이다.\n\n큰 결정 하나는 10분만 멈춰서 다시 보자.\n\n#시중',
      comment: '지금은 속도보다 타이밍이 먼저다.'
    },
    {
      text: '관계 싸움에서 말 세게 하면\n대부분 둘 다 손해 본다.\n\n中正(중정, 치우치지 않음)은\n이럴 때 말의 순서를 잡아준다.\n\n반박 전에 질문 하나만: "지금 뭐가 제일 답답해?"\n\n#중정',
      comment: '중정은 센 말보다 맞는 순서다.'
    },
    {
      text: '주역을 실전에 쓰는 기준은 어렵지 않다.\n\n지금의 때(時中)를 먼저 읽고,\n과한 힘을 빼고(中正),\n틀린 지점은 바로 고친다(改過).\n\n오늘 실패 장면 1개를 이 순서로 다시 읽어보자.\n\n#주역',
      comment: '방법은 복잡할수록 안 먹힌다. 3단계면 충분하다.'
    },
    {
      text: '일이 막힐 때 대부분은\n"더 열심히"를 먼저 꺼낸다.\n\n근데 주역은 보통 반대로 묻는다.\n지금 필요한 건 추진이냐, 정리냐.\n\n오늘 할 일 하나는 속도보다 방향부터 점검해보자.\n\n#의사결정',
      comment: '열심히보다 먼저, 지금 방향이 맞는지.'
    },
    {
      text: '길한 괘가 나왔다고 무조건 밀면\n오히려 판이 깨질 때가 있다.\n\n좋은 신호일수록 더 중요한 건 순서다.\n무엇부터 할지 정하면 실수가 줄어든다.\n\n오늘은 우선순위 1개만 다시 정해보자.\n\n#길흉',
      comment: '좋은 신호일수록 순서 관리가 핵심이다.'
    }
  ],
  'faith-daily': [
    {
      text: '믿음은 큰 말보다 작은 책임에서 먼저 보여.\n\n미뤄둔 연락 1건만 오늘 답해봐.\n그 한 통이 관계 분위기를 바꾼다.\n\n#일상신학',
      comment: '미뤄둔 연락 하나만 해도 하루 결이 달라진다.'
    },
    {
      text: '불안한 날엔 큰 계획이 더 무겁게 느껴진다.\n\n오늘은 하나만 끝내자.\n할 일 3개 중 제일 작은 것부터.\n그게 흐름을 다시 살린다.\n\n#일상신학',
      comment: '작은 완료 하나가 불안을 꺾는다.'
    },
    {
      text: '신앙을 현실 언어로 바꾸면\n결국 돌봄의 순서가 된다.\n\n오늘 옆 사람 한 명 부담을 줄여주는\n작은 행동 1개만 고르자.\n\n#돌봄',
      comment: '돌봄은 작아도 바로 체감되는 행동에서 시작한다.'
    },
    {
      text: '기도가 막막할 때는 거창한 문장보다\n정직한 한 줄이 낫다.\n\n"지금 내가 피하는 걸 보게 해주세요."\n이 한 줄이면 충분하다.\n\n#일상신앙',
      comment: '신앙은 멋진 말보다 정직한 한 줄에서 시작된다.'
    },
    {
      text: '믿음이 흔들리는 날에는\n확신보다 루틴이 사람을 붙든다.\n\n내일 아침 첫 20분 행동 하나만\n지금 정해두자.\n\n#루틴',
      comment: '확신이 약한 날일수록 루틴이 버팀목이다.'
    },
    {
      text: '관계가 무거울수록\n정답 말하기 전에 숨 한 번이 먼저다.\n\n오늘 대화 하나는\n조언보다 질문부터 시작해보자.\n\n#관계',
      comment: '좋은 답보다 먼저, 상대 마음의 위치부터.'
    }
  ],
  insight: [
    {
      text: '창세기 1:1의 샤마임·에레츠와\n주역의 乾坤(건곤)을 같이 놓고 보면 꽤 재밌다.\n\n둘 다 세계를 여는 두 축인데,\n하나는 창조의 문법, 하나는 변화의 문법에 가깝다.\n\n#건곤',
      comment: '건곤 비교는 세계를 읽는 관점을 넓혀준다.'
    },
    {
      text: '역학과 신학이 닿는 지점이 있다.\n사람을 숙명으로 못 박지 않는다는 점.\n\n해석은 낙인 찍으려고 하는 게 아니라\n다시 움직이게 하려고 하는 거다.\n\n#역학신학',
      comment: '해석은 사람을 묶는 게 아니라 풀어주는 쪽이어야 한다.'
    },
    {
      text: '길흉을 결과 예언으로만 읽으면 불안해진다.\n\n근데 대응 신호로 읽으면\n다음 선택이 훨씬 또렷해진다.\n\n너는 지금 주역을 어떤 방식으로 읽고 있어?\n\n#길흉',
      comment: '길흉을 신호로 읽으면 다음 수가 보인다.'
    },
    {
      text: '같은 괘라도 사람마다 해석이 달라지는 건\n상황의 결이 다르기 때문이다.\n\n그래서 핵심은 정답 찾기가 아니라\n내 상황의 변수 찾기다.\n\n#해석',
      comment: '정답보다 변수. 그걸 잡으면 방향이 나온다.'
    },
    {
      text: '주역이 오래 살아남은 이유를 한 줄로 말하면\n결과를 맞히는 기술이 아니라\n판을 읽는 언어이기 때문.\n\n지금 우리한테 필요한 것도 종종 그쪽이다.\n\n#주역',
      comment: '예측보다 판 읽기. 여기서 차이가 난다.'
    },
    {
      text: '신학과 역학을 같이 보면 좋은 점 하나.\n사람을 고정해서 보지 않게 된다.\n\n지금의 상태를 읽고,\n다음 선택으로 이동하게 만든다.\n\n#인사이트',
      comment: '해석의 목적은 고정이 아니라 이동이다.'
    }
  ]
};

function daySeed(input) {
  return String(input || '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

const seed = daySeed(date);
const seenByCategory = { method: 0, 'faith-daily': 0, insight: 0 };

function pickVariant(category, slotIndex) {
  const pool = variantsByCategory[category] || variantsByCategory.insight;
  const nth = seenByCategory[category] || 0;
  const idx = (seed + slotIndex * 2 + nth) % pool.length;
  seenByCategory[category] = nth + 1;
  return pool[idx];
}

const posts = HOURS.map((hour, i) => {
  const category = categories[i];
  const variant = pickVariant(category, i);
  return {
    hour,
    slot: slots[i],
    category,
    text: variant.text,
    comment: variant.comment,
    imageUrl: imageByHour[hour] || null,
    status: 'pending'
  };
});

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ date, timezone: TZ, posts }, null, 2));
console.log(`Generated: ${outPath}`);
