#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

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

async function getJson(url, token) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const j = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(j));
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

  await new Promise((r) => setTimeout(r, 2000));
  const publishRes = await fetch(`https://graph.threads.net/v1.0/${userId}/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ creation_id: createJson.id, access_token: token })
  });
  const publishJson = await publishRes.json();
  if (!publishRes.ok || !publishJson.id) throw new Error(`reply publish failed: ${JSON.stringify(publishJson)}`);
  return publishJson.id;
}

async function main() {
  const env = { ...parseEnvFile(path.resolve('.env.local')), ...process.env };
  const token = env.THREADS_ACCESS_TOKEN;
  const userId = env.THREADS_USER_ID;
  const username = env.THREADS_USERNAME;
  if (!token || !userId || !username) throw new Error('THREADS_ACCESS_TOKEN/THREADS_USER_ID/THREADS_USERNAME missing');

  const date = process.argv[2] || new Date().toISOString().slice(0, 10);
  const queuePath = path.resolve(`ops/threads/queue/${date}.json`);
  const statePath = path.resolve('ops/threads/state/published.json');
  if (!fs.existsSync(queuePath) || !fs.existsSync(statePath)) throw new Error('queue/state missing');

  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  const posted = state?.[date] || {};

  for (const [hourStr, postId] of Object.entries(posted)) {
    const hour = Number(hourStr);
    const slot = (queue.posts || []).find((p) => p.hour === hour);
    if (!slot?.comment) continue;

    const replies = await getJson(`https://graph.threads.net/v1.0/${postId}/replies?fields=id,username,text&limit=50`, token);
    const mine = (replies.data || []).some((r) => r.username === username);
    if (mine) {
      console.log(`ok ${date} ${hour}:00 ${postId} (already has reply)`);
      continue;
    }

    const replyId = await postReply({ userId, token, text: slot.comment, replyToId: postId });
    console.log(`fixed ${date} ${hour}:00 ${postId} -> reply ${replyId}`);
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
