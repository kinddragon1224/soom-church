#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const TZ = 'Asia/Seoul';

function parseEnvFile(filePath) {
  const out = {};
  if (!fs.existsSync(filePath)) return out;
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const idx = t.indexOf('=');
    if (idx < 1) continue;
    const k = t.slice(0, idx).trim();
    let v = t.slice(idx + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[k] = v;
  }
  return out;
}

function kstDate(offset = 0) {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: TZ }));
  d.setDate(d.getDate() + offset);
  return d;
}

function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function parseJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function firstLine(text = '') {
  return String(text || '').split('\n').map((v) => v.trim()).find(Boolean) || '';
}

function engagementRate(row) {
  const views = Math.max(1, Number(row?.views || 0));
  const likes = Number(row?.likes || 0);
  const replies = Number(row?.replies || 0);
  const reposts = Number(row?.reposts || 0);
  const quotes = Number(row?.quotes || 0);
  return (likes + replies * 2 + reposts * 1.5 + quotes * 1.5) / views;
}

async function getJson(url, token) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const j = await res.json();
  if (!res.ok) throw new Error(`GET failed ${url}: ${JSON.stringify(j)}`);
  return j;
}

async function postInsights(postId, token) {
  const m = 'views,likes,replies,reposts,quotes';
  const url = `https://graph.threads.net/v1.0/${postId}/insights?metric=${encodeURIComponent(m)}`;
  const j = await getJson(url, token);
  const out = { views: 0, likes: 0, replies: 0, reposts: 0, quotes: 0 };
  for (const row of j.data || []) {
    const v = row?.values?.[0]?.value ?? 0;
    if (row.name in out) out[row.name] = v;
  }
  return out;
}

async function main() {
  const env = { ...parseEnvFile(path.resolve('.env.local')), ...process.env };
  const token = env.THREADS_ACCESS_TOKEN;
  const userId = env.THREADS_USER_ID;
  if (!token || !userId) throw new Error('THREADS_ACCESS_TOKEN/THREADS_USER_ID missing');

  const targetDate = process.argv[2] || fmtDate(kstDate(-1));

  const list = await getJson(`https://graph.threads.net/v1.0/${userId}/threads?fields=id,text,timestamp,permalink&limit=50`, token);
  const posts = (list.data || []).filter((p) => (p.timestamp || '').startsWith(targetDate));

  const rows = [];
  const totals = { views: 0, likes: 0, replies: 0, reposts: 0, quotes: 0 };

  const publishLogs = parseJsonl(path.resolve('ops/threads/logs/publish.jsonl'))
    .filter((r) => r.date === targetDate && r.postId)
    .reduce((acc, r) => {
      acc[r.postId] = r;
      return acc;
    }, {});

  for (const p of posts) {
    const ins = await postInsights(p.id, token);
    rows.push({ ...p, ...ins });
    for (const k of Object.keys(totals)) totals[k] += ins[k] || 0;
  }

  rows.sort((a, b) => b.views - a.views);

  const categoryAgg = {};
  const hourAgg = {};
  const enriched = rows.map((r) => {
    const meta = publishLogs[r.id] || {};
    const category = meta.category || 'unknown';
    const hour = Number(meta.hour);
    const er = engagementRate(r);

    categoryAgg[category] ||= { count: 0, views: 0, erSum: 0 };
    categoryAgg[category].count += 1;
    categoryAgg[category].views += Number(r.views || 0);
    categoryAgg[category].erSum += er;

    if (Number.isFinite(hour)) {
      hourAgg[hour] ||= { count: 0, views: 0, erSum: 0 };
      hourAgg[hour].count += 1;
      hourAgg[hour].views += Number(r.views || 0);
      hourAgg[hour].erSum += er;
    }

    return {
      ...r,
      category,
      hour,
      er,
      hook: firstLine(meta.text || r.text || '')
    };
  });

  const categoryRows = Object.entries(categoryAgg)
    .map(([category, v]) => ({
      category,
      count: v.count,
      avgViews: Math.round(v.views / Math.max(1, v.count)),
      avgER: v.erSum / Math.max(1, v.count)
    }))
    .sort((a, b) => b.avgER - a.avgER);

  const hourRows = Object.entries(hourAgg)
    .map(([hour, v]) => ({
      hour: Number(hour),
      count: v.count,
      avgViews: Math.round(v.views / Math.max(1, v.count)),
      avgER: v.erSum / Math.max(1, v.count)
    }))
    .sort((a, b) => b.avgER - a.avgER);

  const topHooks = enriched
    .slice()
    .sort((a, b) => b.er - a.er)
    .slice(0, 3)
    .map((r) => `- [ER ${r.er.toFixed(3)} | ${r.views}뷰] ${r.hook}`)
    .join('\n');

  const lowHooks = enriched
    .slice()
    .sort((a, b) => a.er - b.er)
    .slice(0, 3)
    .map((r) => `- [ER ${r.er.toFixed(3)} | ${r.views}뷰] ${r.hook}`)
    .join('\n');

  const bestCategory = categoryRows[0]?.category || 'method';
  const bestHour = hourRows[0]?.hour;

  const directives = [
    `- 내일 1순위 카테고리: ${bestCategory}`,
    `- 오프닝 훅은 질문형/대조형으로 시작`,
    `- 본문 4~6줄 유지, 한 문장 한 기능`,
    `- 댓글 유도는 이지선다(예: A/B)로 고정`,
    bestHour !== undefined ? `- 반응 빠른 시간대(${String(bestHour).padStart(2, '0')}시) 문장 구조 재사용` : '- 시간대 데이터 추가 수집'
  ].join('\n');

  const reportDir = path.resolve('ops/threads/reports');
  fs.mkdirSync(reportDir, { recursive: true });
  const jsonPath = path.join(reportDir, `${targetDate}.json`);
  const mdPath = path.join(reportDir, `${targetDate}.md`);

  fs.writeFileSync(jsonPath, JSON.stringify({ date: targetDate, totals, count: rows.length, rows, categoryRows, hourRows, topHooks: topHooks ? topHooks.split('\n') : [], lowHooks: lowHooks ? lowHooks.split('\n') : [], directives: directives.split('\n') }, null, 2));

  const top = rows.slice(0, 5).map((r, i) => `${i + 1}. [${r.views}뷰/${r.likes}좋아요/${r.replies}답글] ${String(r.text || '').slice(0, 80)}\n   - ${r.permalink}`).join('\n');

  const categoryMd = categoryRows.map((r) => `- ${r.category}: 평균 ${r.avgViews}뷰 / 평균 ER ${r.avgER.toFixed(3)} (n=${r.count})`).join('\n');
  const hourMd = hourRows.slice(0, 5).map((r) => `- ${String(r.hour).padStart(2, '0')}시: 평균 ${r.avgViews}뷰 / 평균 ER ${r.avgER.toFixed(3)} (n=${r.count})`).join('\n');

  const md = `# Threads Daily Report - ${targetDate}\n\n` +
    `- 게시물 수: ${rows.length}\n` +
    `- 총 조회: ${totals.views}\n` +
    `- 총 좋아요: ${totals.likes}\n` +
    `- 총 답글: ${totals.replies}\n` +
    `- 총 리포스트: ${totals.reposts}\n` +
    `- 총 인용: ${totals.quotes}\n\n` +
    `## Top 5\n${top || '- 없음'}\n\n` +
    `## 카테고리 성과\n${categoryMd || '- 없음'}\n\n` +
    `## 시간대 성과(ER 기준)\n${hourMd || '- 없음'}\n\n` +
    `## 상위 훅 3\n${topHooks || '- 없음'}\n\n` +
    `## 저성과 훅 3\n${lowHooks || '- 없음'}\n\n` +
    `## 내일 실행 지시\n${directives}\n`;

  fs.writeFileSync(mdPath, md);
  console.log(`report written: ${mdPath}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
