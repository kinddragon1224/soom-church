#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const TZ = 'Asia/Seoul';

const QUERIES = [
  { track: 'teen', label: '학생 진로/고교학점제', query: '고교학점제 진로 선택 과목 생기부 OR 학과 선택' },
  { track: 'youth', label: '20대 취업/AI 커리어', query: '청년 취업 AI 이력서 면접 직무역량 OR 커리어' },
  { track: 'mid', label: '중장년 재취업/AI 적응', query: '중장년 재취업 AI 직무교육 경력 전환 OR 커리어' }
];

function todayKST() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: TZ }));
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function decodeHtml(text = '') {
  return String(text)
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function tagValue(itemXml, tag) {
  const m = itemXml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return decodeHtml(m?.[1] || '');
}

function parseRss(xml, source) {
  return [...String(xml || '').matchAll(/<item\b[\s\S]*?<\/item>/gi)]
    .slice(0, 8)
    .map((m) => {
      const item = m[0];
      return {
        track: source.track,
        label: source.label,
        title: tagValue(item, 'title'),
        link: tagValue(item, 'link'),
        pubDate: tagValue(item, 'pubDate'),
        summary: tagValue(item, 'description')
      };
    })
    .filter((row) => row.title && row.link);
}

function signalFrom(item) {
  const compact = String(item.title || '')
    .replace(/\s+-\s+[^-]{2,20}$/g, '')
    .replace(/뉴스|보도자료|기자|제공|사진|종합/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 90);
  if (item.track === 'teen') return `학생/부모 자료 신호: ${compact}`;
  if (item.track === 'mid') return `중장년 자료 신호: ${compact}`;
  return `20대 커리어 자료 신호: ${compact}`;
}

async function fetchSource(source) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(source.query)}&hl=ko&gl=KR&ceid=KR:ko`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 ThreadsResearchBot/1.0' } });
  if (!res.ok) throw new Error(`fetch failed ${source.label}: ${res.status}`);
  const xml = await res.text();
  return parseRss(xml, source);
}

async function main() {
  const date = process.argv.find((arg) => /^\d{4}-\d{2}-\d{2}$/.test(arg)) || todayKST();
  const outDir = path.resolve('ops/threads/research');
  fs.mkdirSync(outDir, { recursive: true });

  const all = [];
  const errors = [];
  for (const source of QUERIES) {
    try {
      const rows = await fetchSource(source);
      all.push(...rows);
    } catch (e) {
      errors.push(String(e?.message || e));
    }
  }

  const seen = new Set();
  const items = all.filter((item) => {
    const key = item.title.replace(/\s+/g, ' ').trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const byTrack = Object.fromEntries(['teen', 'youth', 'mid'].map((track) => [track, items.filter((item) => item.track === track).slice(0, 5)]));
  const signals = Object.fromEntries(Object.entries(byTrack).map(([track, rows]) => [track, rows.slice(0, 3).map(signalFrom)]));
  const report = { at: new Date().toISOString(), date, source: 'google-news-rss', queries: QUERIES, errors, byTrack, signals };

  fs.writeFileSync(path.join(outDir, `${date}.json`), JSON.stringify(report, null, 2));

  const md = [
    `# Threads Research Brief - ${date}`,
    '',
    ...Object.entries(byTrack).flatMap(([track, rows]) => [
      `## ${track}`,
      '',
      ...(rows.length ? rows.map((row) => `- ${row.title}\n  - ${row.link}`) : ['- 자료 없음']),
      ''
    ]),
    errors.length ? `## Errors\n\n${errors.map((e) => `- ${e}`).join('\n')}` : ''
  ].filter(Boolean).join('\n');
  fs.writeFileSync(path.join(outDir, `${date}.md`), md);

  if (items.length < 3) {
    console.error(`research brief too small: ${items.length} items`);
    process.exit(1);
  }
  console.log(`Research brief written: ${path.join(outDir, `${date}.md`)} (${items.length} items)`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
