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

function normalizeForDuplicate(text = '') {
  return String(text || '')
    .replace(/#[\w가-힣]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function findDuplicatePost(logs = [], text = '') {
  const needle = normalizeForDuplicate(text);
  if (!needle) return null;
  return logs.find((row) => normalizeForDuplicate(row?.text || '') === needle) || null;
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

const openingPools = {
  teen: [
    'AI 시대에 고등학생이 먼저 해야 할 건 스펙 추가보다 방향 정리다.',
    '고등학생 진로가 흔들리는 건 정보가 없어서보다 기준이 없어서인 경우가 많다.',
    '입시보다 먼저 정리해야 할 건 내가 오래 버틸 수 있는 문제다.',
    '요즘 학생 진로에서 중요한 건 학과 이름보다 문제 해결 방향이다.',
    '고교학점제에서 무서운 건 과목이 아니라 선택 맥락이 끊기는 순간이다.',
    '학생 때 제일 빨리 커지는 격차는 성적보다 질문의 질이다.'
  ],
  youth: [
    '20대 커리어는 정답 찾기보다 실험 속도에서 차이가 난다.',
    '취업 준비가 길어질수록 필요한 건 더 많은 정보보다 실행 구조다.',
    '요즘 20대는 스펙보다 일을 다루는 방식에서 차이가 벌어진다.',
    'AI 시대 취업 준비는 자소서보다 일 처리 방식부터 달라져야 한다.',
    '창업이 막히는 건 아이디어 부족보다 문제를 좁히지 못해서다.',
    '퇴사 고민은 감정보다 현금흐름과 실험 계획부터 봐야 덜 위험하다.'
  ],
  mid: [
    '40대 이후 커리어는 경험의 양보다 설명 가능한 구조가 더 중요해진다.',
    '중장년 커리어가 흔들리는 건 역량 부족보다 번역 실패인 경우가 많다.',
    '50대 이후 불안은 정보 부족보다 방향 부재에서 더 크게 온다.',
    '경력이 길수록 더 필요한 건 공부보다 재정리다.',
    'AI는 늦게 배워도 된다. 문제는 어디에 붙일지 모른 채 겁먹는 상태다.',
    '후반전 커리어는 더 배우는 것보다 버릴 일과 남길 일을 나누는 데서 시작된다.'
  ]
};

const bodyPools = {
  teen: [
    {
      problem: '좋아 보이는 과목만 담으면 진로 스토리가 끊기기 쉽다.',
      action: '과목 선택 전에 “이 과목이 어떤 일로 이어지는가”를 한 줄로 적어봐야 한다.',
      question: '지금 네가 고른 과목 중 미래 일과 바로 연결되는 과목은 뭐야?'
    },
    {
      problem: '입시 준비가 길어질수록 학생은 학과 이름만 붙잡기 쉽다.',
      action: '학과보다 졸업 후 어떤 문제를 풀게 되는지 먼저 찾아보는 게 덜 흔들린다.',
      question: '네가 가고 싶은 학과는 결국 어떤 문제를 푸는 곳 같아?'
    },
    {
      problem: '생기부를 채우는 활동이 많아도 방향 설명이 안 되면 힘이 약하다.',
      action: '활동 3개보다 왜 이 길을 가는지 설명하는 문장 1개가 더 중요하다.',
      question: '지금 너의 진로를 한 문장으로 말하면 뭐라고 할래?'
    },
    {
      problem: 'AI 시대엔 직업 이름이 빨리 바뀌어서 학과 이름만 믿고 가면 불안이 커진다.',
      action: '전공보다 내가 반복해서 풀고 싶은 문제를 먼저 정리해두는 편이 오래 간다.',
      question: '너는 어떤 문제를 오래 붙들어도 덜 지치니?'
    }
  ],
  youth: [
    {
      problem: 'AI를 쓴다고 말만 해서는 취업 시장에서 차별점이 잘 안 생긴다.',
      action: '내 직무에서 무엇을 줄였고 어떤 결과가 나왔는지 사례로 보여줘야 한다.',
      question: '너는 최근 AI로 줄인 작업 하나를 말할 수 있어?'
    },
    {
      problem: '취업 준비가 길어질수록 사람은 자기 경험을 회사 언어로 번역하지 못한다.',
      action: '경험을 “내가 한 일”이 아니라 “회사 문제를 어떻게 줄였는가”로 바꿔 적는 연습이 필요하다.',
      question: '너의 경험 중 회사 입장에서 바로 쓸 수 있는 건 뭐야?'
    },
    {
      problem: '창업 아이디어가 막히는 이유는 아이템이 없어서보다 고객 문제를 좁히지 못해서다.',
      action: '누구의 어떤 불편을 지금 당장 줄일지 한 줄로 못 적으면 아직 문제 정의가 덜 된 상태다.',
      question: '네가 풀고 싶은 문제는 누구의 어떤 불편이야?'
    },
    {
      problem: '퇴사 고민은 감정만 따라가면 후회가 커지기 쉽다.',
      action: '퇴사 전에는 최소 3개월 현금흐름과 다음 실험 계획부터 먼저 적어두는 게 안전하다.',
      question: '지금 네가 그만두기 전에 먼저 계산해야 할 건 뭐야?'
    }
  ],
  mid: [
    {
      problem: '경력이 길어도 채용 언어로 번역되지 않으면 전달이 잘 안 된다.',
      action: '“몇 년 했다”보다 “무슨 문제를 반복해서 해결했다”로 바꿔 말해야 한다.',
      question: '당신 경력을 문제 해결 언어로 바꾸면 첫 문장은 뭐가 될까?'
    },
    {
      problem: 'AI를 늦게 배운다고 뒤처지는 건 아니다. 어디에 붙일지 모르는 게 진짜 문제다.',
      action: '한 번에 다 배우려 하지 말고 반복 업무 하나를 줄이는 데 먼저 붙여보는 게 맞다.',
      question: '지금 가장 먼저 줄이고 싶은 반복 업무는 뭐야?'
    },
    {
      problem: '후반전 커리어는 더 배우는 것보다 버릴 일과 남길 일을 나누는 데서 시작된다.',
      action: '내가 계속할 일 1개, 그만둘 일 1개만 정해도 방향이 훨씬 선명해진다.',
      question: '지금 계속할 것 하나, 버릴 것 하나를 고르면 뭐야?'
    },
    {
      problem: '중장년 재취업에서 가장 자주 보이는 막힘은 경험이 많은데 설명이 짧지 않은 상태다.',
      action: '경력 전체를 늘어놓기보다 대표 문제 3개만 뽑아 재구성하는 편이 훨씬 강하다.',
      question: '네 경력에서 대표 문제 3개만 뽑으면 무엇이 남아?'
    }
  ]
};

function composeCandidate({ opener, body, styleIndex }) {
  const styles = [
    [opener, body.problem, body.action, body.question],
    [`${opener} ${body.problem}`, body.action, body.question],
    [opener, '핵심은 단순하다.', body.problem, body.action, body.question]
  ];

  return {
    text: styles[styleIndex % styles.length].filter(Boolean).join('\n\n'),
    comment: `${body.question} 댓글 한 줄이면 다음 글 방향 잡는 데 도움 된다.`
  };
}

function freshenDuplicatePost(target, publishLogs) {
  if (process.env.THREADS_ALLOW_LEGACY_FRESHEN !== '1') return null;
  const track = target.track || 'youth';
  const openers = openingPools[track] || openingPools.youth;
  const bodies = bodyPools[track] || bodyPools.youth;
  const blocked = new Set(publishLogs.map((row) => normalizeForDuplicate(row?.text || '')));
  const original = normalizeForDuplicate(target.text || '');

  for (let oi = 0; oi < openers.length; oi += 1) {
    for (let bi = 0; bi < bodies.length; bi += 1) {
      for (let si = 0; si < 3; si += 1) {
        const candidate = composeCandidate({ opener: openers[oi], body: bodies[bi], styleIndex: si });
        const key = normalizeForDuplicate(candidate.text);
        if (!key || key === original || blocked.has(key)) continue;
        return candidate;
      }
    }
  }

  return null;
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

  const blockPath = path.resolve(`ops/threads/state/blocked/${date}.json`);
  if (fs.existsSync(blockPath) && !process.argv.includes('--ignore-preflight')) {
    let reason = 'preflight blocked today\'s Threads publishing';
    try {
      const block = JSON.parse(fs.readFileSync(blockPath, 'utf8'));
      reason = block?.reason || reason;
    } catch {
      // keep default reason
    }
    throw new Error(`${reason} (${blockPath})`);
  }

  const preflightPath = path.resolve(`ops/threads/state/preflight/${date}.json`);
  if (!process.argv.includes('--ignore-preflight')) {
    if (!fs.existsSync(preflightPath)) {
      throw new Error(`preflight report missing: ${preflightPath}`);
    }
    let preflight = null;
    try {
      preflight = JSON.parse(fs.readFileSync(preflightPath, 'utf8'));
    } catch {
      throw new Error(`preflight report unreadable: ${preflightPath}`);
    }
    if (preflight?.status !== 'ok') {
      throw new Error(`preflight status is ${preflight?.status || 'unknown'} (${preflightPath})`);
    }
  }

  const queuePath = path.resolve(`ops/threads/queue/${date}.json`);
  if (!fs.existsSync(queuePath)) throw new Error(`queue not found: ${queuePath}`);
  const queueStat = fs.statSync(queuePath);
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

  if (!Array.isArray(queue.posts) || queue.posts.length !== 9) {
    throw new Error(`unexpected queue shape: ${queuePath}`);
  }

  const queueDedup = new Map();
  for (const post of queue.posts) {
    const key = normalizeForDuplicate(post?.text || '');
    if (!key) continue;
    if (queueDedup.has(key)) {
      const prevHour = queueDedup.get(key);
      throw new Error(`duplicate queue text blocked: ${prevHour}:00 and ${post.hour}:00`);
    }
    queueDedup.set(key, post.hour);
  }
  if ((queue.generator || '') !== 'career-cron-v2') {
    throw new Error(`unexpected generator: ${queue.generator || 'unknown'}`);
  }

  const queueAgeMs = now.getTime() - queueStat.mtimeMs;
  if (queueAgeMs > 18 * 60 * 60 * 1000) {
    throw new Error(`stale queue detected: ageHours=${(queueAgeMs / 3600000).toFixed(1)}`);
  }

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

  if (target.track && !['teen', 'youth', 'mid'].includes(target.track)) {
    throw new Error(`unexpected track: ${target.track}`);
  }

  const toneLocked = Boolean(target.category);
  const adaptive = toneLocked
    ? { tone: 'locked', reason: `category=${target.category}` }
    : await chooseAdaptiveTone({ date, token, state });
  let tuned = toneLocked
    ? { text: target.text, comment: target.comment || '' }
    : applyToneVariant({ text: target.text, comment: target.comment || '', tone: adaptive.tone });

  if (target.imagePrompt && !target.imageUrl) {
    console.warn(`image prompt exists but imageUrl missing (${date} ${hour}:00)`);
  }

  const publishLogPath = path.resolve('ops/threads/logs/publish.jsonl');
  const publishLogs = parseJsonl(publishLogPath);
  const duplicate = findDuplicatePost(publishLogs, tuned.text);
  if (duplicate) {
    const fresh = freshenDuplicatePost(target, publishLogs);
    if (!fresh) {
      throw new Error(`duplicate publish blocked: already posted ${duplicate.date} ${duplicate.hour}:00 (${duplicate.postId || 'unknown'})`);
    }
    tuned = fresh;
    console.warn(`duplicate detected (${duplicate.date} ${duplicate.hour}:00), regenerated a fresh variant`);
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
