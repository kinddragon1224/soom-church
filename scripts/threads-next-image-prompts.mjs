#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const TZ = 'Asia/Seoul';
const AFTERNOON_HOURS = [15, 19, 21];

function kstDate(offset = 0) {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: TZ }));
  d.setDate(d.getDate() + offset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function buildPrompt(post, idx) {
  const persona = '긴 장발과 수염이 있는 한국 남성, 차분한 표정, 실제 인물을 닮았지만 과장 없는 사실적 변주';
  const panel = ['九二', '六三', '九五'][idx % 3];
  return [
    `슬롯: ${post.hour}시 Threads 글용 세로 이미지`,
    `인물: ${persona}`,
    '목표: 글의 메시지를 설명하는 것이 아니라, 글을 읽고 싶게 만드는 상황 연출형 이미지',
    `장면 힌트: ${post.sceneHint || post.text.split('\n').slice(0, 3).join(' ')}`,
    '스타일: 삼국지 8 리메이크 PK 감성, 시네마틱, 초상 정면샷보다 상황 중심, 과한 판타지 금지',
    '브랜딩 맥락: 역학과 신학을 배경으로 세상을 읽지만 실제 포지션은 AI를 잘 다루는 기획자/컨설턴트',
    '상품 연결 맥락: 점술 느낌 금지, 브랜딩 컨설팅/AI 기획 컨설팅으로 이어질 수 있는 지적이고 신뢰감 있는 분위기',
    '구성: 우상단에 작은 괘/효 패널, 6효 세로 도식, 해당 효 하이라이트',
    `패널 표기: ${panel}`,
    '비율: 3:4 세로',
    '금지: 저품질 AI 느낌, 과한 광택, 손 왜곡, 복잡한 텍스트, 점술 포스터 느낌'
  ].join('\n');
}

const date = process.argv[2] || kstDate(1);
const queuePath = path.resolve(`ops/threads/queue/${date}.json`);
if (!fs.existsSync(queuePath)) {
  console.error(`queue not found: ${queuePath}`);
  process.exit(1);
}

const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
const selected = queue.posts.filter((p) => AFTERNOON_HOURS.includes(Number(p.hour)));

const lines = [];
lines.push(`# Threads 이미지 프롬프트 브리프 - ${date}`);
lines.push('');
lines.push('내일 오전에 ChatGPT 앱에서 이미지 만들 3개만 정리했어.');
lines.push('오후 슬롯용만 뽑았고, 이미지 업로드 대상은 15시 / 19시 / 21시야.');
lines.push('');

selected.forEach((post, idx) => {
  lines.push(`## ${idx + 1}. ${post.hour}시 / ${post.category}`);
  lines.push(`본문 요약: ${String(post.text).split('\n').slice(0, 4).join(' ')}`);
  lines.push('프롬프트:');
  lines.push(buildPrompt(post, idx));
  lines.push('');
});

const outDir = path.resolve('ops/threads/briefs');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `${date}-image-prompts.md`);
fs.writeFileSync(outPath, lines.join('\n'));
console.log(`written: ${outPath}`);
