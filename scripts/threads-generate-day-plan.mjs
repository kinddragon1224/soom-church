#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const TZ = 'Asia/Seoul';
const HOURS = [7, 9, 11, 13, 15, 17, 19, 21, 23];
const CATEGORIES = ['faith-daily', 'method', 'insight', 'faith-daily', 'method', 'insight', 'faith-daily', 'method', 'insight'];
const imageHours = new Set([9, 15, 21]);

function todayKST(offsetDays = 0) {
  const now = new Date();
  const kst = new Date(now.toLocaleString('en-US', { timeZone: TZ }));
  kst.setDate(kst.getDate() + offsetDays);
  const y = kst.getFullYear();
  const m = String(kst.getMonth() + 1).padStart(2, '0');
  const d = String(kst.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function minusDay(dateStr, days = 1) {
  const [y, m, d] = String(dateStr).split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  dt.setDate(dt.getDate() - days);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

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

function stripCodeFence(text = '') {
  const fenced = String(text).match(/```json\s*([\s\S]*?)```/i) || String(text).match(/```\s*([\s\S]*?)```/i);
  return (fenced?.[1] ?? text).trim();
}

function normalizeHashTag(text = '') {
  const tags = String(text).match(/#[\w가-힣]+/g) || [];
  if (!tags.length) return '#일상기록';
  return tags[0];
}

function pickTagByCategory(category) {
  if (category === 'method') return '#의사결정';
  if (category === 'insight') return '#역학신학';
  return '#일상신앙';
}

function validateCandidatePosts(posts) {
  if (!Array.isArray(posts) || posts.length !== 9) return false;
  for (let i = 0; i < 9; i += 1) {
    const p = posts[i] || {};
    if (typeof p.text !== 'string' || p.text.trim().length < 25) return false;
    if (typeof p.comment !== 'string' || p.comment.trim().length < 8) return false;
  }
  return true;
}

function buildImagePrompt({ post, hour, index }) {
  const panel = ['初九', '九二', '六三', '六四', '九五', '上六'][index % 6];
  const moodByCategory = {
    'faith-daily': '따뜻하지만 절제된 감정, 과장 없는 일상의 긴장감',
    method: '판단과 선택의 긴장, 구조가 보이는 장면',
    insight: '사유가 느껴지는 정적, 상징보다 상황 중심'
  };

  return [
    '[MODEL] openai/gpt-image-2',
    '[INTENT] Threads 세로 이미지, 실사풍이 아닌 삼국지 8 리메이크 PK 감성의 시네마틱 일러스트',
    `[SCENE] ${post.sceneHint || post.text.split('\n').slice(0, 3).join(' ')}`,
    `[MOOD] ${moodByCategory[post.category] || moodByCategory.insight}`,
    '[COMPOSITION] 인물 초상 클로즈업 금지, 상황 연출형 미디엄/와이드 샷, 행동 맥락이 보이게',
    '[UI OVERLAY] 우상단 미니 패널 고정: 괘/효 표시 + 6효 세로 도식 + 해당 효만 금색 하이라이트',
    `[UI OVERLAY DETAIL] 패널 텍스트 예시: ${normalizeHashTag(post.text).replace('#', '')} · ${panel}`,
    '[TEXT POLICY] 이미지 내부 큰 카피 금지, 패널 외 텍스트 최소화',
    '[COLOR] 저채도 기반 + 포인트 골드, 과포화 금지',
    '[NEGATIVE] 과한 AI 광택, 플라스틱 피부, 과장된 렌즈 플레어, 게임 UI 난삽함, 로고/워터마크, 손가락 오류, 얼굴 왜곡',
    '[OUTPUT] portrait 3:4, 1024x1536, high detail, clean edges',
    `[POST SLOT] ${hour}:00`
  ].join('\n');
}

function fallbackPosts() {
  return [
    {
      category: 'faith-daily',
      text: '요즘 집에서 아들 둘 챙기다 보면, 하루가 내 계획대로 간 날이 거의 없다.\n\n그래도 신기하게 무너지지 않는 날은 기준이 하나였다.\n큰 성과 말고, 오늘 지킬 태도 하나.\n\n오늘 나는 말의 속도부터 늦췄다.\n너는 오늘 뭘 늦추면 하루가 나아질까?\n\n#일상신앙',
      comment: '오늘 지킬 태도 하나만 댓글로 남겨줘. 내일 글에 반영할게.',
      sceneHint: '아침 준비 중 잠깐 멈춰 숨 고르는 장면'
    },
    {
      category: 'method',
      text: '회의가 길어질수록 팀이 똑똑해지는 게 아니라 지친다는 걸 자주 본다.\n\n그래서 요즘은 시작 문장 하나부터 맞춘다.\n"오늘 결정할 건 딱 하나."\n\n결정이 줄면 집중이 선명해진다.\n너희 팀은 회의 시작을 어떻게 여는 편이야?\n\n#의사결정',
      comment: '회의 시작 문장 하나만 공유해줘. 좋은 건 바로 써볼게.',
      sceneHint: '화이트보드 앞에서 우선순위 한 줄 적는 장면'
    },
    {
      category: 'insight',
      text: '주역을 오래 붙들수록 느끼는 건 예언보다 해석의 책임이다.\n\n같은 괘라도 내가 어떤 상태로 읽느냐에 따라 행동이 달라진다.\n정답 찾기보다 지금의 나를 먼저 읽는 쪽.\n\n나는 이 계정을 그런 식으로 쓰고 싶다.\n복잡한 흐름을 읽고, 오늘의 선택 하나로 줄이는 쪽.\n\n오늘 너는 결과를 기다리는 중이야, 선택을 만드는 중이야?\n\n#역학신학',
      comment: '결과 대기/선택 실행 중 하나만 적어줘. 흐름 맞춰서 다음 글 쓸게.',
      sceneHint: '책상 위 주역 노트와 체크리스트를 함께 보는 장면'
    },
    {
      category: 'faith-daily',
      text: '육아휴직이면 시간이 넉넉할 줄 알았는데, 실제로는 마음이 더 쉽게 흩어졌다.\n\n그래서 루틴을 줄였다.\n호흡 3분, 기도 3분, 오늘 할 일 1개.\n\n작게 줄였더니 오히려 하루가 붙었다.\n너는 마음 흔들릴 때 어디서 다시 시작해?\n\n#알아차림',
      comment: '너만의 재시작 루틴 한 줄만 알려줘. 다음 글에 녹여볼게.',
      sceneHint: '창가 앞에서 타이머 켜고 호흡 정리하는 장면'
    },
    {
      category: 'method',
      text: '일이 밀릴 때 나는 자주 더 붙잡았다.\n\n근데 막힌 날의 해답은 보통 반대였다.\n추가보다 삭제.\n\n오늘도 일정에서 하나를 지우니까 중요한 게 보였다.\n너는 지금 뭘 지우면 숨통이 트일까?\n\n#의사결정',
      comment: '지울 것 1개만 댓글로 적어줘. 우선순위 같이 맞춰보자.',
      sceneHint: '플래너에서 일정 한 줄 지우고 다시 배열하는 장면'
    },
    {
      category: 'insight',
      text: '역학과 신학을 같이 보면 공통점이 선명하다.\n\n사람을 고정해서 보지 않고, 다음 선택으로 움직이게 한다는 점.\n\n그래서 나는 해석을 길게 늘어놓기보다\n오늘 붙잡을 행동 하나로 번역하려고 한다.\n\n지금 너의 다음 행동 하나는 뭐야?\n\n#역학신학',
      comment: '다음 행동 1개만 남겨줘. 내일 글에서 연결할게.',
      sceneHint: '노트에 다음 행동 한 줄 쓰고 체크하는 장면'
    },
    {
      category: 'faith-daily',
      text: '아내랑 대화가 어긋나는 날을 보면 늘 패턴이 같았다.\n\n내 말은 맞는데, 타이밍이 틀린 날.\n\n요즘은 결론 먼저 말하지 않고 질문부터 한다.\n그 한 번이 분위기를 바꾼다.\n너는 대화 꼬일 때 먼저 뭘 바꾸는 편이야?\n\n#관계',
      comment: '관계 살린 질문 한 문장만 공유해줘. 바로 써볼게.',
      sceneHint: '식탁에서 대화 전에 잠깐 멈추는 장면'
    },
    {
      category: 'method',
      text: '고교학점제 같이 변수 많은 일은 열정만으로 안 굴러간다.\n\n기준을 문장으로 못 박아야 팀이 같이 간다.\n\n요즘 내가 붙잡는 문장은 이거다.\n"오늘 결정, 이번 주 실행."\n너희 팀의 기준 문장은 뭐야?\n\n#고교학점제',
      comment: '팀 기준 문장 하나만 남겨줘. 다음 회의에 써먹게.',
      sceneHint: '프로젝트 보드 앞에서 핵심 문장 붙이는 장면'
    },
    {
      category: 'insight',
      text: '주역을 공부하며 가장 크게 바뀐 건 불안 다루는 방식이었다.\n\n길흉을 결과표처럼 보면 흔들리고, 신호처럼 보면 준비하게 된다.\n\n그래서 이 계정에서도 막연한 위로보다\n지금 선택할 수 있는 행동 하나를 남기고 싶다.\n\n너는 불안할 때 뭘 먼저 정리해?\n\n#주역',
      comment: '불안 줄이는 너만의 순서 한 줄만 남겨줘.',
      sceneHint: '조용한 책상에서 노트 정리하며 체크하는 장면'
    }
  ];
}

async function generateWithOpenAi({ date, report }) {
  const env = { ...parseEnvFile(path.resolve('.env.local')), ...process.env };
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = (env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = env.THREADS_PLAN_MODEL || 'gpt-5.4';

  const reportSummary = {
    date: report?.date || null,
    totals: report?.totals || null,
    bestCategory: report?.categoryRows?.[0]?.category || null,
    topHooks: (report?.topHooks || []).slice(0, 3),
    lowHooks: (report?.lowHooks || []).slice(0, 3),
    directives: (report?.directives || []).slice(0, 6)
  };

  const system = [
    '너는 Threads 글 생성기다.',
    '출력은 반드시 JSON 객체 하나만 반환한다.',
    '문체: 반말, 차분하고 관찰적인 톤. 과장/허세 금지.',
    '화자: 클론 김선용(41세 남성, 대전, 아들 둘, 교회 다님, 육아휴직 중, 주역 관점).',
    '개인 사생활 침해 없이 경험을 창작하되 현실감은 유지한다.',
    '정치/교회는 분란 조장 금지, 중도적/성찰형으로만.',
    '계정 브랜딩 역할은 명확해야 한다: 복잡한 흐름을 읽고 오늘의 행동 1개로 번역해주는 계정.',
    '단순 일기처럼 쓰지 말고, 개인 경험에서 출발하되 독자가 왜 이 계정을 팔로우해야 하는지가 드러나야 한다.',
    '각 글은 공감+행동 유도 구조. 댓글 유도 문장 필수.',
    '해시태그는 글당 1개만 사용한다.',
    '9개 글 모두 톤/구조를 미세하게 다르게 만들어 반복감을 줄인다.'
  ].join('\n');

  const user = {
    targetDate: date,
    hours: HOURS,
    categories: CATEGORIES,
    outputSchema: {
      posts: [
        {
          hour: 7,
          category: 'faith-daily|method|insight',
          text: '본문 문자열(줄바꿈 포함, 5~9문장, 마지막에 해시태그 1개)',
          comment: '첫댓글용 한 문장(존댓말 아님)',
          sceneHint: '이미지 생성용 장면 힌트(짧게)'
        }
      ]
    },
    yesterday: reportSummary
  };

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.9,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: JSON.stringify(user) }
      ]
    })
  });

  if (!res.ok) return null;
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') return null;

  try {
    const parsed = JSON.parse(stripCodeFence(content));
    if (!validateCandidatePosts(parsed?.posts)) return null;
    return parsed.posts;
  } catch {
    return null;
  }
}

async function main() {
  const date = process.argv[2] || todayKST(0);
  const outDir = path.resolve('ops/threads/queue');
  const outPath = path.join(outDir, `${date}.json`);

  const reportDate = minusDay(date, 1);
  const reportPath = path.resolve(`ops/threads/reports/${reportDate}.json`);
  const yesterdayReport = readJson(reportPath, {});

  const llmPosts = await generateWithOpenAi({ date, report: yesterdayReport });
  const source = llmPosts ? 'openai-gpt-5.4' : 'fallback-template';
  const basePosts = llmPosts || fallbackPosts();

  const posts = HOURS.map((hour, i) => {
    const raw = basePosts[i] || basePosts[0] || {};
    const category = CATEGORIES[i];
    const tag = normalizeHashTag(raw.text || '') || pickTagByCategory(category);
    const safeText = String(raw.text || '').replace(/#[\w가-힣]+/g, '').trim();
    const finalText = `${safeText}\n\n${tag}`;
    const post = {
      hour,
      slot: `클론 일상 ${i + 1}`,
      category,
      text: finalText,
      comment: String(raw.comment || '너 생각도 한 줄만 남겨줘. 다음 글에 반영할게.').trim(),
      sceneHint: String(raw.sceneHint || '').trim(),
      imagePrompt: null,
      imageModel: null,
      imageAspectRatio: null,
      imageUrl: null,
      status: 'pending'
    };

    if (imageHours.has(hour)) {
      post.imagePrompt = buildImagePrompt({ post, hour, index: i });
      post.imageModel = 'openai/gpt-image-2';
      post.imageAspectRatio = '3:4';
    }

    return post;
  });

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ date, timezone: TZ, sourceReport: reportDate, generator: source, posts }, null, 2));
  console.log(`Generated: ${outPath} (generator=${source})`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
