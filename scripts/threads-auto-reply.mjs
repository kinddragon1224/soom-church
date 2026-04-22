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

function hashString(s = '') {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickByText(options, text) {
  if (!Array.isArray(options) || options.length === 0) return '';
  return options[hashString(text) % options.length];
}

function extractEchoPhrase(text = '') {
  const stop = new Set(['그리고', '근데', '그냥', '정말', '진짜', '너무', '약간', '이거', '저거', '그거', '에서', '으로', '하고', '이라', '입니다', '있어요', '같아요']);
  const tokens = String(text)
    .replace(/["'“”‘’.,!?()\[\]{}]/g, ' ')
    .split(/\s+/)
    .map((v) => v.trim())
    .filter((v) => /^[가-힣A-Za-z0-9]{2,12}$/.test(v) && !stop.has(v));
  if (!tokens.length) return '';
  tokens.sort((a, b) => b.length - a.length);
  return tokens[0];
}

function detectTopic(lower = '') {
  if (lower.includes('창세기') || lower.includes('성경') || lower.includes('신학') || lower.includes('샤마임') || lower.includes('에레츠')) return 'bible';
  if (lower.includes('주역') || lower.includes('건곤') || lower.includes('계사전') || lower.includes('역학') || lower.includes('길흉') || lower.includes('괘') || lower.includes('효')) return 'iching';
  if (lower.includes('돈') || lower.includes('재물') || lower.includes('지출') || lower.includes('수입') || lower.includes('소득')) return 'money';
  if (lower.includes('관계') || lower.includes('갈등') || lower.includes('가정') || lower.includes('대화') || lower.includes('부부')) return 'relationship';
  return 'generic';
}

function detectTone(lower = '') {
  if (/좋네요|좋다|좋아요|굿|최고|멋지|감사/.test(lower)) return 'praise';
  if (/ㅋㅋ|ㅎㅎ|하하/.test(lower)) return 'light';
  if (/아닌|별로|애매|어렵|헷갈|모르겠/.test(lower)) return 'doubt';
  if (/해보자|해볼|추천|제안|이렇게/.test(lower)) return 'suggestion';
  return 'neutral';
}

function buildHonorificReply(originalText = '') {
  const trimmed = String(originalText || '').replace(/\s+/g, ' ').trim();
  if (!trimmed) {
    return { text: '댓글 남겨주셔서 감사합니다. 말씀해주신 내용은 다음 글에서 더 구체적으로 반영해보겠습니다.', skip: false, reason: 'empty-generic' };
  }

  const lower = trimmed.toLowerCase();
  const negativeKeywords = [
    '논쟁', '토론', '분쟁', '비난', '비방', '싸움', '공격', '혐오', '조롱', '무식', '멍청', '꺼져',
    '병신', '개소리', '헛소리', '쓰레기', '최악', '신고함', '신고할게', '짜증', '역겹', '불쾌'
  ];
  if (negativeKeywords.some((k) => lower.includes(k))) {
    return { text: '', skip: true, reason: 'negative-comment' };
  }

  const debateKeywords = ['증명', '반박', '틀렸', '가짜', '거짓', '사기', '선동'];
  if (debateKeywords.some((k) => lower.includes(k))) {
    return { text: '', skip: true, reason: 'debate-comment' };
  }

  const isQuestion = /\?$/.test(trimmed) || lower.includes('뭔가요') || lower.includes('왜') || lower.includes('어떻게') || lower.includes('맞나요');
  const topic = detectTopic(lower);
  const tone = detectTone(lower);
  const echo = extractEchoPhrase(trimmed);

  const openers = {
    praise: ['좋게 봐주셔서 감사합니다.', '좋은 반응 남겨주셔서 감사합니다.'],
    light: ['재밌게 봐주셔서 감사합니다.', '센스 있는 댓글 감사합니다.'],
    doubt: ['솔직한 반응 남겨주셔서 감사합니다.', '헷갈릴 수 있는 지점 짚어주셔서 감사합니다.'],
    suggestion: ['좋은 제안 감사합니다.', '방향 제안 주셔서 감사합니다.'],
    neutral: ['댓글 남겨주셔서 감사합니다.', '의견 나눠주셔서 감사합니다.']
  };

  const topicLines = {
    bible: isQuestion
      ? '성경 본문 맥락과 용어를 같이 묶어서 다음 글에서 짧게 정리해보겠습니다.'
      : '성경 본문 맥락이 더 잘 보이도록 다음 글에서 연결을 보강해보겠습니다.',
    iching: isQuestion
      ? '해당 괘/효의 원문 뜻과 현실 적용을 함께 풀어서 다음 글에 반영해보겠습니다.'
      : '괘/효의 의미가 실제 상황에 닿게 다음 글에서 더 선명하게 풀어보겠습니다.',
    money: isQuestion
      ? '지출·누수 기준으로 바로 적용할 수 있는 체크 포인트를 다음 글에 넣어보겠습니다.'
      : '재정 흐름은 실전 체크리스트 형태로 다음 글에서 더 구체화해보겠습니다.',
    relationship: isQuestion
      ? '관계 상황에서 바로 쓸 수 있는 대화 문장까지 다음 글에서 함께 정리해보겠습니다.'
      : '관계 주제는 실제 대화 순서까지 포함해서 다음 글에서 더 구체화해보겠습니다.',
    generic: isQuestion
      ? '말씀 주신 포인트를 기준으로 다음 글에서 더 분명하게 답해보겠습니다.'
      : '말씀 주신 포인트를 다음 글에서 더 구체적으로 다뤄보겠습니다.'
  };

  const closer = isQuestion
    ? pickByText(['좋은 질문 감사합니다.', '질문 덕분에 핵심을 더 선명하게 다뤄볼 수 있겠습니다.'], trimmed)
    : pickByText(['덕분에 다음 글 방향이 더 분명해졌습니다.', '말씀해주신 결을 다음 글에 바로 반영해보겠습니다.'], trimmed);

  const echoLine = echo ? `특히 말씀하신 '${echo}' 포인트, 저도 중요하게 보고 있습니다.` : '';
  const text = [pickByText(openers[tone] || openers.neutral, trimmed), echoLine, topicLines[topic], closer]
    .filter(Boolean)
    .join(' ');

  return { text, skip: false, reason: `${topic}-${tone}${isQuestion ? '-q' : ''}` };
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
