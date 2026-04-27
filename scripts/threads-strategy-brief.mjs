#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const TZ = 'Asia/Seoul';
const HOURS = [7, 9, 11, 13, 15, 17, 19, 21, 23];

function todayKST() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: TZ }));
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function minusDay(dateStr, days = 1) {
  const [y, m, d] = String(dateStr).split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  dt.setDate(dt.getDate() - days);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function topTrackFromReport(report = {}) {
  const rows = Array.isArray(report.categoryRows) ? report.categoryRows : [];
  const known = rows.find((row) => ['teen', 'youth', 'mid'].includes(String(row.category || '').toLowerCase()));
  return String(known?.category || 'youth').toLowerCase();
}

function strongestResearchTrack(research = {}) {
  const counts = Object.fromEntries(['teen', 'youth', 'mid'].map((track) => [track, research?.byTrack?.[track]?.length || 0]));
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'youth';
}

function rotateTracks(primary, secondary) {
  const rest = ['teen', 'youth', 'mid'].filter((track) => track !== primary && track !== secondary);
  return [primary, secondary, ...rest.filter(Boolean)].filter((track, idx, arr) => track && arr.indexOf(track) === idx);
}

function slotPlan(date, primary, secondary) {
  const order = rotateTracks(primary, secondary);
  const roles = [
    ['problem-awareness', '오늘 가장 큰 흐름을 쉬운 장면으로 연다'],
    ['pillar-depth', '핵심 타깃의 구체 장면으로 신뢰를 만든다'],
    ['authority', '경력/진로 해석자로서 판단 기준을 보여준다'],
    ['evidence-translation', '자료 신호를 사람의 선택 문제로 번역한다'],
    ['checklist', '독자가 바로 점검할 기준 2~3개를 남긴다'],
    ['contrarian', '흔한 조언을 뒤집고 브랜드 관점을 각인한다'],
    ['scene-case', '상담 장면처럼 느껴지는 사례를 쓴다'],
    ['conversion-prep', 'DM/상담으로 이어질 수 있는 막힘을 짚는다'],
    ['daily-close', '하루의 관점을 정리하고 과한 CTA 없이 닫는다']
  ];
  return HOURS.map((hour, index) => ({
    hour,
    track: order[index % order.length],
    role: roles[index][0],
    intent: roles[index][1]
  }));
}

function main() {
  const date = process.argv.find((arg) => /^\d{4}-\d{2}-\d{2}$/.test(arg)) || todayKST();
  const reportDate = minusDay(date, 1);
  const researchPath = path.resolve(`ops/threads/research/${date}.json`);
  const reportPath = path.resolve(`ops/threads/reports/${reportDate}.json`);
  const outDir = path.resolve('ops/threads/strategy');
  fs.mkdirSync(outDir, { recursive: true });

  const research = readJson(researchPath, {});
  const report = readJson(reportPath, {});
  const performanceTrack = topTrackFromReport(report);
  const researchTrack = strongestResearchTrack(research);
  const primary = performanceTrack || researchTrack || 'youth';
  const secondary = researchTrack === primary ? 'mid' : researchTrack;
  const slots = slotPlan(date, primary, secondary);

  const strategy = {
    at: new Date().toISOString(),
    date,
    version: 'strategic-editor-v1',
    brandCore: '복잡한 선택을 읽고, 다음 행동 하나로 바꾸는 계정',
    dayObjective: '자료 기반 전문성을 잃지 않으면서, 각 타깃의 실제 선택 장면으로 번역한다.',
    primaryTrack: primary,
    secondaryTrack: secondary,
    performanceTrack,
    researchTrack,
    editorialMix: {
      trust: 3,
      empathy: 3,
      practical: 2,
      conversion: 1
    },
    slots,
    rules: [
      '자료 제목을 본문에 직접 붙이지 않는다.',
      '각 글은 하나의 판단만 남긴다.',
      '마지막 문장은 질문보다 관찰/정리형을 우선한다.',
      'CTA는 하루 1회만 강하게 쓴다.',
      '학생/20대/중장년 장면을 섞되 같은 리듬을 반복하지 않는다.'
    ]
  };

  fs.writeFileSync(path.join(outDir, `${date}.json`), JSON.stringify(strategy, null, 2));
  const md = [
    `# Threads Strategy Brief - ${date}`,
    '',
    `- Primary: ${primary}`,
    `- Secondary: ${secondary}`,
    `- Objective: ${strategy.dayObjective}`,
    '',
    '## Slots',
    '',
    ...slots.map((slot) => `- ${slot.hour}:00 / ${slot.track} / ${slot.role} — ${slot.intent}`)
  ].join('\n');
  fs.writeFileSync(path.join(outDir, `${date}.md`), md);
  console.log(`Strategy brief written: ${path.join(outDir, `${date}.md`)}`);
}

main();
