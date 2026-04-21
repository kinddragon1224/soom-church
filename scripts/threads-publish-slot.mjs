#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const TZ = 'Asia/Seoul';

function parseEnvFile(filePath) {
  const out = {};
  if (!fs.existsSync(filePath)) return out;
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function nowKST() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: TZ }));
}

function dateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

async function postText({ userId, token, text, imageUrl }) {
  const body = new URLSearchParams({ access_token: token, text });
  if (imageUrl) {
    body.set('media_type', 'IMAGE');
    body.set('image_url', imageUrl);
  } else {
    body.set('media_type', 'TEXT');
  }
  const createRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  const createJson = await createRes.json();
  if (!createRes.ok || !createJson.id) throw new Error(`create failed: ${JSON.stringify(createJson)}`);

  const publishRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ creation_id: createJson.id, access_token: token })
  });
  const publishJson = await publishRes.json();
  if (!publishRes.ok || !publishJson.id) throw new Error(`publish failed: ${JSON.stringify(publishJson)}`);
  return publishJson.id;
}

async function postReply({ userId, token, text, replyToId }) {
  const createRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ media_type: 'TEXT', text, reply_to_id: replyToId, access_token: token })
  });
  const createJson = await createRes.json();
  if (!createRes.ok || !createJson.id) throw new Error(`reply create failed: ${JSON.stringify(createJson)}`);

  for (let i = 0; i < 3; i += 1) {
    if (i > 0) await new Promise((r) => setTimeout(r, 1500));
    const publishRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ creation_id: createJson.id, access_token: token })
    });
    const publishJson = await publishRes.json();
    if (publishRes.ok && publishJson.id) return publishJson.id;
  }
  return null;
}

async function main() {
  const env = {
    ...parseEnvFile(path.resolve('.env.local')),
    ...process.env,
  };

  const token = env.THREADS_ACCESS_TOKEN;
  const userId = env.THREADS_USER_ID;
  if (!token || !userId) throw new Error('THREADS_ACCESS_TOKEN/THREADS_USER_ID missing');

  const now = nowKST();
  const date = process.argv[2] || dateStr(now);
  const hour = Number(process.argv[3] || now.getHours());

  const queuePath = path.resolve(`ops/threads/queue/${date}.json`);
  if (!fs.existsSync(queuePath)) throw new Error(`queue not found: ${queuePath}`);
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

  const target = queue.posts.find((p) => p.hour === hour);
  if (!target) {
    console.log(`No slot for ${date} ${hour}:00`);
    return;
  }

  const stateDir = path.resolve('ops/threads/state');
  const statePath = path.join(stateDir, 'published.json');
  fs.mkdirSync(stateDir, { recursive: true });
  const state = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : {};
  state[date] ||= {};
  if (state[date][hour]) {
    console.log(`Already posted ${date} ${hour}:00 -> ${state[date][hour]}`);
    return;
  }

  const postId = await postText({ userId, token, text: target.text, imageUrl: target.imageUrl || '' });
  let commentId = null;
  if (target.comment) {
    commentId = await postReply({ userId, token, text: target.comment, replyToId: postId });
    if (!commentId) {
      console.warn(`reply skipped ${date} ${hour}:00`);
    }
  }
  state[date][hour] = postId;
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

  const logDir = path.resolve('ops/threads/logs');
  fs.mkdirSync(logDir, { recursive: true });
  fs.appendFileSync(path.join(logDir, 'publish.jsonl'), JSON.stringify({ at: new Date().toISOString(), date, hour, postId, commentId, imageUrl: target.imageUrl || null, text: target.text, comment: target.comment || null }) + '\n');
  console.log(`Posted ${date} ${hour}:00 -> ${postId}${commentId ? ` (comment ${commentId})` : ''}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
