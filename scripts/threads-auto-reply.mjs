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
    return { text: '댓글 남겨주셔서 감사합니다. 말씀해주신 내용은 다음 글에 더 구체적으로 반영해보겠습니다.', skip: false, reason: 'empty-generic' };
  }

  const lower = trimmed.toLowerCase();
  const negativeKeywords = [
    '논쟁', '토론', '분쟁', '비난', '비방', '싸움', '공격', '혐오', '조롱', '무식', '멍청', '꺼져',
    '병신', '개소리', '헛소리', '쓰레기', '최악', '신고함', '신고할게', '짜증', '역겹', '불쾌'
  ];

  if (negativeKeywords.some((k) => lower.includes(k))) {
    return { text: '', skip: true, reason: 'negative-comment' };
  }

  const isQuestion = /\?$/.test(trimmed) || lower.includes('뭔가요') || lower.includes('왜') || lower.includes('어떻게');

  if (lower.includes('창세기') || lower.includes('성경') || lower.includes('신학') || lower.includes('샤마임') || lower.includes('에레츠')) {
    return {
      text: isQuestion
        ? '좋은 질문 주셔서 감사합니다. 창세기 본문 맥락이랑 용어 의미를 같이 보면서 다음 글에서 더 정확히 풀어보겠습니다.'
        : '좋은 포인트 감사합니다. 성경 본문 맥락과 연결해서 다음 글에서 더 선명하게 정리해보겠습니다.',
      skip: false,
      reason: 'topic-bible'
    };
  }

  if (lower.includes('주역') || lower.includes('건곤') || lower.includes('계사전') || lower.includes('역학') || lower.includes('길흉')) {
    return {
      text: isQuestion
        ? '좋은 질문 주셔서 감사합니다. 주역 원문 기준으로 핵심 개념을 다음 글에서 더 쉽게 풀어보겠습니다.'
        : '좋은 의견 감사합니다. 주역 원문 의미와 현실 적용을 같이 보이도록 다음 글에 반영해보겠습니다.',
      skip: false,
      reason: 'topic-iching'
    };
  }

  if (lower.includes('돈') || lower.includes('재물') || lower.includes('지출') || lower.includes('수입')) {
    return {
      text: '좋은 의견 감사합니다. 재물/지출 흐름은 더 실전적으로 적용할 수 있게 다음 글에서 사례 중심으로 보강해보겠습니다.',
      skip: false,
      reason: 'topic-money'
    };
  }

  if (lower.includes('관계') || lower.includes('갈등') || lower.includes('가정') || lower.includes('대화')) {
    return {
      text: '말씀 감사합니다. 관계 주제는 실제 대화 문장까지 쓸 수 있게 다음 글에서 더 구체적으로 정리해보겠습니다.',
      skip: false,
      reason: 'topic-relationship'
    };
  }

  return {
    text: isQuestion
      ? '좋은 질문 주셔서 감사합니다. 말씀해주신 포인트 기준으로 다음 글에서 더 구체적으로 풀어보겠습니다.'
      : '댓글 남겨주셔서 감사합니다. 말씀해주신 포인트를 반영해서 다음 글에서 더 구체적으로 다뤄보겠습니다.',
    skip: false,
    reason: 'generic'
  };
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
    const built = buildHonorificReply(c.text);
    if (built.skip) {
      state.handled[c.replyId] = { at: new Date().toISOString(), status: 'skipped', reason: built.reason };
      console.log(`skip ${c.replyId} (${built.reason})`);
      continue;
    }
    const text = built.text;
    if (args.dryRun) {
      console.log(`[dry-run] ${c.replyId} @${c.username} (${built.reason}) -> ${text}`);
      continue;
    }

    try {
      const replyPostId = await postReply({ userId, token, text, replyToId: c.replyId });
      state.handled[c.replyId] = { at: new Date().toISOString(), status: 'replied', reason: built.reason, replyPostId };
      fs.appendFileSync(logPath, JSON.stringify({ at: new Date().toISOString(), sourceReplyId: c.replyId, sourcePostId: c.postId, sourceAuthor: c.username, replyPostId, reason: built.reason, text }) + '\n');
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
