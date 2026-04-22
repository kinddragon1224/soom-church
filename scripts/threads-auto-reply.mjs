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

function parseArgs(argv) {
  const args = { sinceMinutes: 180, dryRun: false, limit: 10 };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    if (a === '--since-minutes' && argv[i + 1]) args.sinceMinutes = Number(argv[++i]);
    if (a === '--limit' && argv[i + 1]) args.limit = Number(argv[++i]);
  }
  if (!Number.isFinite(args.sinceMinutes) || args.sinceMinutes < 1) args.sinceMinutes = 180;
  if (!Number.isFinite(args.limit) || args.limit < 1) args.limit = 10;
  return args;
}

async function getJson(url, token) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const j = await res.json();
  if (!res.ok) throw new Error(`GET failed ${url}: ${JSON.stringify(j)}`);
  return j;
}

async function postReply({ userId, token, text, replyToId }) {
  const createRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ media_type: 'TEXT', text, reply_to_id: replyToId, access_token: token })
  });
  const createJson = await createRes.json();
  if (!createRes.ok || !createJson.id) throw new Error(`reply create failed: ${JSON.stringify(createJson)}`);

  await new Promise((r) => setTimeout(r, 1500));
  const publishRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ creation_id: createJson.id, access_token: token })
  });
  const publishJson = await publishRes.json();
  if (!publishRes.ok || !publishJson.id) throw new Error(`reply publish failed: ${JSON.stringify(publishJson)}`);

  return publishJson.id;
}

function buildHonorificReply(originalText = '') {
  const trimmed = String(originalText || '').replace(/\s+/g, ' ').trim();
  if (!trimmed) {
    return '댓글 남겨주셔서 감사합니다. 말씀해주신 내용 참고해서 다음 글에 더 구체적으로 반영해보겠습니다.';
  }
  return '댓글 남겨주셔서 감사합니다. 말씀해주신 포인트를 반영해서 다음 글에서 더 구체적으로 풀어보겠습니다.';
}

async function main() {
  const args = parseArgs(process.argv);
  const env = { ...parseEnvFile(path.resolve('.env.local')), ...process.env };
  const token = env.THREADS_ACCESS_TOKEN;
  const userId = env.THREADS_USER_ID;
  const username = env.THREADS_USERNAME;
  if (!token || !userId || !username) throw new Error('THREADS_ACCESS_TOKEN/THREADS_USER_ID/THREADS_USERNAME missing');

  const stateDir = path.resolve('ops/threads/state');
  const statePath = path.join(stateDir, 'replied-comments.json');
  fs.mkdirSync(stateDir, { recursive: true });
  const state = fs.existsSync(statePath)
    ? JSON.parse(fs.readFileSync(statePath, 'utf8'))
    : { handled: {} };
  state.handled ||= {};

  const cutoff = Date.now() - args.sinceMinutes * 60 * 1000;

  const list = await getJson(`https://graph.threads.net/v1.0/${userId}/threads?fields=id,text,timestamp&limit=25`, token);
  const posts = list.data || [];

  const candidates = [];
  for (const p of posts) {
    const replies = await getJson(`https://graph.threads.net/v1.0/${p.id}/replies?fields=id,text,username,timestamp&limit=50`, token);
    for (const r of replies.data || []) {
      if (!r?.id) continue;
      if ((r.username || '') === username) continue;
      const ts = new Date(r.timestamp || 0).getTime();
      if (!Number.isFinite(ts) || ts < cutoff) continue;
      if (state.handled[r.id]) continue;
      candidates.push({ postId: p.id, replyId: r.id, text: r.text || '', username: r.username || '', timestamp: r.timestamp || '' });
    }
  }

  candidates.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const queue = candidates.slice(0, args.limit);

  const logDir = path.resolve('ops/threads/logs');
  fs.mkdirSync(logDir, { recursive: true });
  const logPath = path.join(logDir, 'auto-replies.jsonl');

  for (const c of queue) {
    const text = buildHonorificReply(c.text);
    if (args.dryRun) {
      console.log(`[dry-run] ${c.replyId} @${c.username} -> ${text}`);
      continue;
    }

    try {
      const replyPostId = await postReply({ userId, token, text, replyToId: c.replyId });
      state.handled[c.replyId] = new Date().toISOString();
      fs.appendFileSync(logPath, JSON.stringify({ at: new Date().toISOString(), sourceReplyId: c.replyId, sourcePostId: c.postId, sourceAuthor: c.username, replyPostId, text }) + '\n');
      console.log(`replied ${c.replyId} -> ${replyPostId}`);
    } catch (e) {
      console.warn(`failed ${c.replyId}: ${e.message || e}`);
    }
  }

  if (!args.dryRun) {
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  }

  const kst = new Date(new Date().toLocaleString('en-US', { timeZone: TZ }));
  const hh = String(kst.getHours()).padStart(2, '0');
  const mm = String(kst.getMinutes()).padStart(2, '0');
  console.log(`done ${hh}:${mm} KST, scanned=${candidates.length}, processed=${queue.length}, dryRun=${args.dryRun}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
