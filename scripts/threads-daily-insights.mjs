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

  for (const p of posts) {
    const ins = await postInsights(p.id, token);
    rows.push({ ...p, ...ins });
    for (const k of Object.keys(totals)) totals[k] += ins[k] || 0;
  }

  rows.sort((a, b) => b.views - a.views);

  const reportDir = path.resolve('ops/threads/reports');
  fs.mkdirSync(reportDir, { recursive: true });
  const jsonPath = path.join(reportDir, `${targetDate}.json`);
  const mdPath = path.join(reportDir, `${targetDate}.md`);

  fs.writeFileSync(jsonPath, JSON.stringify({ date: targetDate, totals, count: rows.length, rows }, null, 2));

  const top = rows.slice(0, 5).map((r, i) => `${i + 1}. [${r.views}뷰/${r.likes}좋아요/${r.replies}답글] ${String(r.text || '').slice(0, 80)}\n   - ${r.permalink}`).join('\n');
  const low = rows.slice(-3).map((r) => `- ${String(r.text || '').slice(0, 80)}`).join('\n');

  const md = `# Threads Daily Report - ${targetDate}\n\n` +
    `- 게시물 수: ${rows.length}\n` +
    `- 총 조회: ${totals.views}\n` +
    `- 총 좋아요: ${totals.likes}\n` +
    `- 총 답글: ${totals.replies}\n` +
    `- 총 리포스트: ${totals.reposts}\n` +
    `- 총 인용: ${totals.quotes}\n\n` +
    `## Top 5\n${top || '- 없음'}\n\n` +
    `## 개선 메모\n` +
    `- 저성과 포스트(하위 3):\n${low || '- 없음'}\n` +
    `- 내일은 상위 포스트의 문장 구조(첫 줄 훅/중간 사례/끝 CTA)를 재사용\n` +
    `- CTA는 soom.io.kr 링크를 하루 2회만 유지\n`;

  fs.writeFileSync(mdPath, md);
  console.log(`report written: ${mdPath}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
