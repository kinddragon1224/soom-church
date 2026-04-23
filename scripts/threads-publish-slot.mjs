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

function parseJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs
    .readFileSync(filePath, 'utf8')
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

function classifyTone(text = '') {
  const t = String(text).toLowerCase();
  const faithKeys = ['신앙', '신학', '성경', '요셉', '기도', '하나님', '구원', '교회'];
  const methodKeys = ['주역', '時中', '中正', '改過', '손괘', '익괘', '의사결정', '프레임', '길흉'];
  if (faithKeys.some((k) => t.includes(String(k).toLowerCase()))) return 'faith';
  if (methodKeys.some((k) => t.includes(String(k).toLowerCase()))) return 'method';
  return 'neutral';
}

function engagementScore(insights) {
  const views = Math.max(1, Number(insights?.views || 0));
  const likes = Number(insights?.likes || 0);
  const replies = Number(insights?.replies || 0);
  const reposts = Number(insights?.reposts || 0);
  const quotes = Number(insights?.quotes || 0);
  return (likes * 2 + replies * 4 + reposts * 3 + quotes * 3) / views;
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

function applyToneVariant({ text, comment, tone }) {
  const hasFaith = classifyTone(text) === 'faith';
  const hasMethod = classifyTone(text) === 'method';

  if (tone === 'faith' && !hasFaith) {
    return {
      text: `${text} 신앙의 언어로 옮기면 결국 오늘 맡은 자리를 끝까지 지키는 문제다.`,
      comment: comment || '믿음은 큰 선언보다 오늘의 책임에서 먼저 드러난다.'
    };
  }

  if (tone === 'method' && !hasMethod) {
    return {
      text: `${text} 주역식으로 보면 때를 읽고, 균형을 잡고, 틀린 지점을 바로 고치는 순서다.`,
      comment: comment || '길흉은 결과 예언보다 대응 신호로 읽을 때 실전성이 높아진다.'
    };
  }

  return { text, comment };
}

async function chooseAdaptiveTone({ date, token, state }) {
  const posted = state?.[date] || {};
  const recentHours = Object.keys(posted)
    .map((h) => Number(h))
    .filter((h) => Number.isFinite(h))
    .sort((a, b) => b - a)
    .slice(0, 4);

  if (recentHours.length < 2) return { tone: 'neutral', reason: 'insufficient-samples' };

  const logs = parseJsonl(path.resolve('ops/threads/logs/publish.jsonl'))
    .filter((row) => row.date === date && recentHours.includes(Number(row.hour)));

  if (!logs.length) return { tone: 'neutral', reason: 'no-publish-log' };

  const buckets = { faith: [], method: [], neutral: [] };
  for (const row of logs) {
    const tone = classifyTone(row.text || '');
    try {
      const ins = await postInsights(row.postId, token);
      buckets[tone].push(engagementScore(ins));
    } catch {
      // ignore partial API failures
    }
  }

  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : -1);
  const scored = [
    ['faith', avg(buckets.faith)],
    ['method', avg(buckets.method)],
    ['neutral', avg(buckets.neutral)]
  ].sort((a, b) => b[1] - a[1]);

  if (scored[0][1] < 0) return { tone: 'neutral', reason: 'no-insights-yet' };
  return {
    tone: scored[0][0],
    reason: `recent-best=${scored[0][0]}(${scored[0][1].toFixed(3)})`
  };
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
  const dryRun = process.argv.includes('--dry-run');
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

  const toneLocked = Boolean(target.category);
  const adaptive = toneLocked
    ? { tone: 'locked', reason: `category=${target.category}` }
    : await chooseAdaptiveTone({ date, token, state });
  const tuned = toneLocked
    ? { text: target.text, comment: target.comment || '' }
    : applyToneVariant({ text: target.text, comment: target.comment || '', tone: adaptive.tone });

  if (target.imagePrompt && !target.imageUrl) {
    console.warn(`image prompt exists but imageUrl missing (${date} ${hour}:00)`);
  }

  if (dryRun) {
    console.log(JSON.stringify({ date, hour, adaptive, text: tuned.text, comment: tuned.comment || null }, null, 2));
    return;
  }

  const postId = await postText({ userId, token, text: tuned.text, imageUrl: target.imageUrl || '' });
  let commentId = null;
  state[date][hour] = postId;
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

  const logDir = path.resolve('ops/threads/logs');
  fs.mkdirSync(logDir, { recursive: true });
  fs.appendFileSync(path.join(logDir, 'publish.jsonl'), JSON.stringify({ at: new Date().toISOString(), date, hour, postId, commentId, imageUrl: target.imageUrl || null, imagePrompt: target.imagePrompt || null, imageModel: target.imageModel || null, imageAspectRatio: target.imageAspectRatio || null, category: target.category || null, text: tuned.text, comment: tuned.comment || null, adaptiveTone: adaptive.tone, adaptiveReason: adaptive.reason }) + '\n');
  console.log(`Posted ${date} ${hour}:00 -> ${postId}${commentId ? ` (comment ${commentId})` : ''} [tone=${adaptive.tone}]`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
