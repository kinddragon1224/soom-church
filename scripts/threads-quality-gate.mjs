#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const TZ = 'Asia/Seoul';
const MIN_SCORE = Number(process.env.THREADS_QUALITY_MIN_SCORE || 75);
const BANNED = [
  '핵심은 단순하다',
  '예를 들면',
  '댓글 한 줄이면',
  '방향 잡는 데 도움 된다',
  'AI 시대에',
  '문제 해결 방향',
  '번역 실패'
];
const REQUIRED_BRAND_VERSION = process.env.THREADS_REQUIRED_BRAND_VERSION || 'brand-flow-v1';

function todayKST() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: TZ }));
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalize(text = '') {
  return String(text || '')
    .replace(/#[\w가-힣]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function choiceComment(track, question = '') {
  const templates = {
    teen: [
      'A. 과목 선택\nB. 학과 선택\n지금 막힌 쪽을 하나만 고르면 된다.',
      'A. 좋아하는 걸 모름\nB. 좋아하는 걸로 먹고살 수 있을지 모름\n대부분은 둘 중 하나에서 멈춘다.'
    ],
    youth: [
      'A. 취업 준비\nB. 다음 실험\n막힌 곳을 하나만 좁혀도 움직이기 쉬워진다.',
      'A. 경험 설명\nB. 방향 정리\n둘 중 하나만 먼저 잡아도 글이 달라진다.'
    ],
    mid: [
      'A. 경력 설명\nB. 버릴 일 정리\n후반전 커리어는 보통 이 둘 중 하나에서 막힌다.',
      'A. AI 적용 위치\nB. 다시 팔 경력 문장\n급한 쪽부터 좁히면 된다.'
    ]
  };
  const list = templates[track] || templates.youth;
  return list[Math.abs(String(question).length) % list.length];
}

function extractQuestion(text = '') {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .reverse()
    .find((line) => line.endsWith('?') || line.endsWith('까?') || line.endsWith('야?')) || '';
}

function improveText(text = '') {
  let out = String(text || '')
    .replace(/\n\n핵심은 단순하다\.?(?=\n\n)/g, '')
    .replace(/예를 들면\s*/g, '')
    .replace(/AI 시대에 고등학생이 먼저 해야 할 건/g, '고등학생 진로 상담에서 먼저 볼 건')
    .replace(/문제 해결 방향/g, '졸업 뒤 실제로 풀 일')
    .replace(/번역 실패/g, '설명 실패');

  const lines = out.split('\n').map((line) => line.trim()).filter(Boolean);
  if (lines.length >= 3 && !lines.some((line) => /A\.|B\.|엄마|아이|회사|면접|상담|이력서|퇴사|과목/.test(line))) {
    lines.splice(1, 0, '실제 상담에서는 여기서 말문이 자주 막힌다.');
  }
  return lines.join('\n\n');
}

function scorePost(post) {
  const text = String(post.text || '');
  const comment = String(post.comment || '');
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const reasons = [];
  let score = 100;

  if (post.brand !== REQUIRED_BRAND_VERSION) {
    score -= 20;
    reasons.push(`brand-version:${post.brand || 'missing'}`);
  }

  for (const phrase of BANNED) {
    if (text.includes(phrase) || comment.includes(phrase)) {
      score -= 10;
      reasons.push(`banned:${phrase}`);
    }
  }
  if (lines.length < 3 || lines.length > 6) {
    score -= 8;
    reasons.push(`line-count:${lines.length}`);
  }
  if (/[?？]$/.test(lines.at(-1) || '') && /[?？]$/.test(comment.trim())) {
    score -= 8;
    reasons.push('too-question-driven');
  }
  if (!/A\.|B\./.test(comment)) {
    score -= 15;
    reasons.push('comment-not-ab');
  }
  if (text.length > 430) {
    score -= 8;
    reasons.push(`too-long:${text.length}`);
  }
  if (!/(엄마|아이|회사|면접|상담|이력서|퇴사|과목|경력|업무|학과|생기부|현금흐름)/.test(text)) {
    score -= 8;
    reasons.push('low-scene-specificity');
  }
  return { score: Math.max(0, score), reasons };
}

function main() {
  const date = process.argv.find((arg) => /^\d{4}-\d{2}-\d{2}$/.test(arg)) || todayKST();
  const fix = process.argv.includes('--fix');
  const queuePath = path.resolve(`ops/threads/queue/${date}.json`);
  const reportDir = path.resolve('ops/threads/quality');
  const reportPath = path.join(reportDir, `${date}.json`);
  const queue = readJson(queuePath);

  const seen = new Map();
  const rows = [];
  let changed = false;

  for (const post of queue.posts || []) {
    const before = { text: post.text, comment: post.comment };
    if (fix) {
      post.text = improveText(post.text);
      post.comment = choiceComment(post.track, extractQuestion(post.text));
    }

    const key = normalize(post.text);
    const duplicateHour = seen.get(key);
    if (duplicateHour) {
      rows.push({ hour: post.hour, score: 0, reasons: [`duplicate-in-queue:${duplicateHour}:00`] });
      continue;
    }
    seen.set(key, post.hour);

    const result = scorePost(post);
    rows.push({ hour: post.hour, track: post.track, ...result });
    if (before.text !== post.text || before.comment !== post.comment) changed = true;
  }

  fs.mkdirSync(reportDir, { recursive: true });
  const failing = rows.filter((row) => row.score < MIN_SCORE);
  const report = {
    at: new Date().toISOString(),
    date,
    status: failing.length ? 'blocked' : 'ok',
    minScore: MIN_SCORE,
    requiredBrandVersion: REQUIRED_BRAND_VERSION,
    changed,
    failing,
    rows
  };
  if (fix && changed) fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  if (failing.length) {
    console.error(`Threads quality blocked ${date}: ${failing.length} low-quality slots`);
    process.exit(1);
  }
  console.log(`Threads quality ok ${date}${changed ? ' (queue improved)' : ''}`);
}

main();
