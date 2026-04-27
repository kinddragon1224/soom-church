#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const TZ = 'Asia/Seoul';
const HOURS = [7, 9, 11, 13, 15, 17, 19, 21, 23];
const TRACKS = ['teen', 'youth', 'mid'];
const BRAND = {
  core: '복잡한 선택을 읽고, 다음 행동 하나로 바꾸는 계정',
  position: '진로와 일의 막힌 흐름을 읽고, 오늘 할 행동 하나로 번역합니다.',
  generatorVersion: 'brand-flow-v1'
};

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

function daySeed(input) {
  return String(input || '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function rotate(list, salt = 0) {
  if (!Array.isArray(list) || list.length === 0) return [];
  const offset = Math.abs(salt) % list.length;
  return [...list.slice(offset), ...list.slice(0, offset)];
}

function normalizeForAudit(text = '') {
  return String(text || '')
    .replace(/#[\w가-힣]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function topTokens(posts = []) {
  const stopwords = new Set([
    '지금', '요즘', '먼저', '그냥', '정말', '진짜', '하나', '같은', '이제', '오늘', '사람', '문제', '문제를', '이유', '결국',
    '때문', '이야기', '준비', '준비가', '정리', '시작', '가장', '바로', '계속', '하는', '하면', '해야', '합니다', '있습니다',
    '내가', '뭐야', '싶은', '길어질수록', '핵심은', '아니라', '한다', '여기서', '아니면', '다음', '너는', '일을',
    '있어', '가까워', '상태야', '문장이', '문장은'
  ]);
  const counts = new Map();
  for (const post of posts) {
    const seen = new Set();
    for (const token of normalizeForAudit(post.text).split(' ')) {
      if (token.length < 2 || stopwords.has(token) || seen.has(token)) continue;
      seen.add(token);
      counts.set(token, (counts.get(token) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([token, count]) => ({ token, count }));
}

function auditPosts(posts = []) {
  const openingCounts = new Map();

  for (const post of posts) {
    const opening = normalizeForAudit(String(post.text || '').split('\n').find(Boolean) || '')
      .split(' ')
      .slice(0, 6)
      .join(' ');
    if (!opening) continue;
    openingCounts.set(opening, (openingCounts.get(opening) || 0) + 1);
  }

  const repeatedOpenings = [...openingCounts.entries()]
    .filter(([, count]) => count >= 2)
    .map(([opening, count]) => ({ opening, count }));

  const tokenSummary = topTokens(posts);
  const postWarnings = posts.map((post) => {
    const warnings = [];
    const normalized = normalizeForAudit(post.text);
    const opening = normalized.split(' ').slice(0, 6).join(' ');
    if (repeatedOpenings.some((item) => item.opening === opening)) warnings.push('opening-repeat');
    for (const item of tokenSummary) {
      if (item.count >= 4 && normalized.includes(item.token)) warnings.push(`keyword-heavy:${item.token}`);
    }
    return {
      hour: post.hour,
      track: post.track,
      warnings
    };
  });

  const riskScore = postWarnings.reduce((sum, post) => sum + post.warnings.length, 0);

  return {
    summary: {
      riskScore,
      repeatedOpenings,
      repeatedKeywords: tokenSummary
    },
    posts: postWarnings
  };
}

const openingPools = {
  teen: [
    '엄마는 안정적인 과를 말하고, 아이는 “그건 재미없다”고 말한다.',
    '생기부를 채우다 보면 이상하게 진로는 더 흐려질 때가 있다.',
    '과목 선택표 앞에서 멈추는 학생은 게으른 게 아니라 기준이 없는 경우가 많다.',
    '학과 이름을 빨리 정한 학생보다, 싫어도 오래 붙들 문제를 아는 학생이 더 단단하다.',
    '진로 상담에서 제일 위험한 말은 “일단 뭐라도 채우자”다.',
    '좋아하는 일과 먹고사는 일 사이에서 처음으로 겁나는 시기가 고등학생 때 온다.'
  ],
  youth: [
    '면접장에서는 “열심히 했습니다”보다 “이 문제를 줄였습니다”가 더 세다.',
    '퇴사하고 싶은 마음은 틀린 게 아닌데, 통장 잔고는 감정을 봐주지 않는다.',
    'AI를 쓸 줄 안다는 말은 이제 장점이 아니라 증거를 요구받는 문장이다.',
    '이력서가 평평해지는 순간은 경험이 없어서가 아니라 장면이 없어서다.',
    '창업 아이디어보다 먼저 좁혀야 하는 건 누구의 짜증을 줄일지다.',
    '20대 커리어는 거창한 비전보다 작은 실험을 얼마나 빨리 돌렸는지에서 갈린다.'
  ],
  mid: [
    '경력이 길수록 설명은 짧아져야 하는데, 실제로는 반대로 가기 쉽다.',
    '40대 이후 커리어에서 무서운 건 실력이 없는 게 아니라 팔 문장이 없는 상태다.',
    'AI가 어려운 게 아니라, 내 일 어디에 붙일지 모르는 게 사람을 멈추게 한다.',
    '재취업에서 “다 해봤습니다”는 강점처럼 들리지만 가끔은 초점이 흐린 말이 된다.',
    '후반전 커리어는 더 쌓는 싸움보다 버릴 걸 고르는 싸움에 가깝다.',
    '50대의 불안은 정보 부족보다 “내 경험이 아직 팔릴까”에서 더 크게 온다.'
  ]
};

const creativeDeck = {
  teen: [
    {
      mode: 'scene',
      opener: '과목 선택표를 앞에 두고 “이거 들으면 생기부에 좋아요?”부터 묻는 학생이 많다.',
      problem: '그 질문이 틀린 건 아니다. 다만 그 순간부터 진로가 내 것이 아니라 평가자에게 맞춘 목록이 되기 쉽다.',
      pivot: '먼저 적어야 할 건 과목명이 아니라 “나는 어떤 문제를 오래 붙들 수 있나”다.',
      question: '지금 너는 과목을 고르는 중이야, 아니면 진로 문장을 찾는 중이야?',
      close: '과목보다 먼저 필요한 건, 내가 설명할 수 있는 진로 문장이다.'
    },
    {
      mode: 'contrast',
      opener: '진로가 없는 학생보다 더 위험한 건 너무 빨리 정한 진로를 의심하지 않는 학생이다.',
      problem: '고등학생 때의 확신은 정보가 많아서 생기기보다 주변 말이 크게 들려서 생길 때가 많다.',
      pivot: '학과 이름 하나를 붙잡기 전에, 그 학과 사람들이 실제로 어떤 문제를 푸는지부터 봐야 한다.',
      question: '너는 지금 학과 이름이 더 궁금해, 졸업 뒤 하는 일이 더 궁금해?',
      close: '학과 이름보다 졸업 뒤의 하루를 먼저 상상해보면 선택이 덜 흔들린다.'
    },
    {
      mode: 'checklist',
      opener: '생기부 활동을 고르기 전에 딱 세 가지만 보면 된다.',
      problem: '내가 왜 이 활동을 했는지 말할 수 있는가. 다음 활동과 이어지는가. 나중에 면접에서 내 언어로 설명 가능한가.',
      pivot: '활동이 많아도 이 세 개가 없으면 기록은 두꺼운데 방향은 얇아진다.',
      question: '지금 네 활동은 “많은 편”이야, 아니면 “이어지는 편”이야?',
      close: '활동은 많을수록 좋은 게 아니라, 서로 이어질 때 힘이 생긴다.'
    },
    {
      mode: 'scene',
      opener: '부모는 안정적인 과를 말하고, 아이는 유튜브에서 본 직업을 말한다.',
      problem: '둘 다 틀린 말은 아닌데 대화가 자꾸 어긋나는 이유는 기준이 다르기 때문이다.',
      pivot: '안정성과 흥미를 바로 싸우게 하지 말고, 먼저 “이 아이가 오래 견딜 문제”를 찾아야 한다.',
      question: '너에게 더 큰 걱정은 안정성이야, 아니면 흥미가 없는 일이야?',
      close: '안정성과 흥미를 싸움 붙이기 전에, 오래 견딜 수 있는 문제부터 봐야 한다.'
    }
  ],
  youth: [
    {
      mode: 'scene',
      opener: '면접에서 “AI 써봤습니다”라고 말하는 순간, 바로 다음 질문이 온다.',
      problem: '“그래서 시간이 얼마나 줄었고, 결과가 뭐가 달라졌나요?” 여기서 말문이 막히면 장점이 아니라 장식이 된다.',
      pivot: '툴 이름보다 강한 건 내가 줄인 업무 하나와 그 전후 차이다.',
      question: '너는 AI로 줄인 일을 하나 말할 수 있어, 아니면 아직 툴 이름만 남아 있어?',
      close: '툴 이름보다 오래 남는 건, 실제로 줄인 일 하나다.'
    },
    {
      mode: 'contrast',
      opener: '이력서가 약한 이유가 경험 부족이 아닐 때가 많다.',
      problem: '카페 알바, 동아리, 인턴, 사이드 프로젝트를 전부 “제가 한 일”로만 쓰면 회사 입장에서는 장면이 안 보인다.',
      pivot: '문장은 “무슨 일을 했다”에서 “어떤 불편을 줄였다”로 바뀌어야 한다.',
      question: '네 경험은 지금 업무 목록에 가까워, 문제 해결 장면에 가까워?',
      close: '이력서는 한 일을 나열하는 종이가 아니라, 내가 줄인 불편을 보여주는 장면에 가깝다.'
    },
    {
      mode: 'checklist',
      opener: '퇴사 고민이 올라오면 감정부터 믿지 말고 숫자 세 개를 먼저 봐야 한다.',
      problem: '월 고정비, 버틸 수 있는 개월 수, 다음 실험에 쓸 시간. 이 셋이 없으면 용기가 아니라 충동이 되기 쉽다.',
      pivot: '그만두는 결정은 감정을 부정해서가 아니라, 감정을 망치지 않으려고 계산하는 쪽이 안전하다.',
      question: '지금 너에게 부족한 건 용기야, 아니면 계산표야?',
      close: '용기를 오래 쓰려면 계산표가 먼저 깔려 있어야 한다.'
    },
    {
      mode: 'scene',
      opener: '창업 아이디어를 묻는 사람에게 “누가 왜 돈을 내요?”라고 물으면 대화가 갑자기 조용해진다.',
      problem: '아이디어가 나빠서가 아니다. 아직 고객의 짜증이 충분히 좁혀지지 않은 경우가 많다.',
      pivot: '처음부터 시장을 크게 잡기보다 한 사람이 오늘 겪는 불편 하나를 정확히 잡는 편이 낫다.',
      question: '네 아이디어는 아직 멋진 말에 가까워, 아니면 누군가의 짜증에 가까워?',
      close: '좋은 아이디어는 멋진 말보다 누군가의 짜증에 더 가까이 붙어 있다.'
    }
  ],
  mid: [
    {
      mode: 'scene',
      opener: '경력 상담에서 “이것저것 다 해봤습니다”라는 말이 나오면 나는 잠깐 멈춘다.',
      problem: '그 말 안에는 분명 실력이 있는데, 시장에는 너무 넓게 들려서 잘 팔리지 않는다.',
      pivot: '긴 경력은 전부 보여주는 게 아니라 반복해서 해결한 문제 세 개로 접어야 한다.',
      question: '당신 경력은 지금 넓게 펼쳐진 상태야, 세 문장으로 접힌 상태야?',
      close: '경력은 넓게 펼칠수록 약해지고, 세 문장으로 접을수록 팔리기 시작한다.'
    },
    {
      mode: 'contrast',
      opener: 'AI를 늦게 배워서 문제가 생기는 게 아니다.',
      problem: '진짜 막히는 지점은 “내 일 중 어디에 붙이면 돈이나 시간이 줄어드나”를 못 찾는 순간이다.',
      pivot: '처음 목표는 공부가 아니라 반복 업무 하나를 덜어내는 것이어야 한다.',
      question: '지금 당신에게 필요한 건 AI 강의야, 줄일 업무 하나야?',
      close: 'AI 공부는 강의 목록이 아니라 줄일 업무 하나에서 시작하는 편이 낫다.'
    },
    {
      mode: 'checklist',
      opener: '후반전 커리어를 다시 잡을 때는 더할 일보다 뺄 일을 먼저 적어야 한다.',
      problem: '계속할 일 하나, 그만둘 일 하나, 다시 팔 문장 하나. 이 세 개가 없으면 계획은 많은데 방향이 흐려진다.',
      pivot: '나이가 들수록 선택지는 늘어나는 게 아니라 에너지가 줄어든다. 그래서 기준이 먼저다.',
      question: '지금 당신은 더 배워야 할 때야, 덜어내야 할 때야?',
      close: '후반전에는 더하는 능력보다 덜어내는 기준이 먼저 힘을 낸다.'
    },
    {
      mode: 'scene',
      opener: '재취업 이력서를 보면 경력은 긴데 첫 문장이 약한 경우가 많다.',
      problem: '“20년 경력”은 사실이지만, 상대가 궁금한 건 그 시간이 아니라 지금 당장 맡길 수 있는 문제다.',
      pivot: '첫 문장은 연차가 아니라 해결 가능한 문제로 시작해야 한다.',
      question: '당신을 소개하는 첫 문장은 연차야, 해결할 수 있는 문제야?',
      close: '첫 문장이 연차에서 문제로 바뀌면, 경력은 다시 읽히기 시작한다.'
    }
  ]
};

function applyBrandVoice(post) {
  const text = String(post.text || '')
    .replace(/해야 한다/g, '하는 편이 낫다')
    .replace(/해야만 한다/g, '먼저 볼 필요가 있다')
    .replace(/반드시/g, '가능하면 먼저')
    .replace(/무조건/g, '대개')
    .replace(/뒤처진다/g, '늦어진다')
    .trim();
  return { ...post, text, brand: BRAND.generatorVersion };
}

const creativeModes = [
  (_opener, theme) => [theme.opener, theme.problem, theme.pivot, theme.close || theme.question],
  (_opener, theme) => [theme.opener, theme.problem, theme.close || theme.question],
  (_opener, theme) => [theme.opener, theme.problem, '판단은 이 지점에서 갈린다.', theme.pivot, theme.close || theme.question]
];

function choiceComment(track, question) {
  const templates = {
    teen: [
      'A. 과목 선택\nB. 학과 선택\n지금 막힌 쪽을 하나만 고르면 된다.',
      'A. 좋아하는 걸 모름\nB. 좋아하는 걸로 먹고살 수 있을지 모름\n대부분은 둘 중 하나에서 멈춘다.'
    ],
    youth: [
      'A. 취업 준비\nB. 다음 실험\n막힌 곳을 하나만 좁혀도 움직이기 쉬워진다.',
      'A. 경험 설명\nB. 방향 정리\n둘 중 하나만 먼저 잡아도 글이 달라진다.'
    ],
    mid: [
      'A. 경력 설명\nB. 버릴 일 정리\n후반전 커리어는 보통 이 둘 중 하나에서 막힌다.',
      'A. AI 적용 위치\nB. 다시 팔 경력 문장\n급한 쪽부터 좁히면 된다.'
    ]
  };
  const list = templates[track] || templates.youth;
  const index = Math.abs(String(question || '').length) % list.length;
  return list[index];
}

function researchLine(research, track, index) {
  const rows = research?.signals?.[track] || [];
  if (!rows.length) return '';
  return rows[index % rows.length];
}

function buildCreativePost({ track, hour, index, opener, theme }) {
  const render = creativeModes[index % creativeModes.length];
  const research = globalThis.__threadsResearch || null;
  const signal = researchLine(research, track, index);
  const lines = render(opener, theme).filter(Boolean);
  return applyBrandVoice({
    hour,
    slot: `${track}-${hour}`,
    track,
    category: track,
    text: lines.join('\n\n'),
    comment: choiceComment(track, theme.question),
    sceneHint: `${track} career thread`,
    researchSignal: signal || null,
    imagePrompt: null,
    imageModel: null,
    imageAspectRatio: null,
    imageUrl: null,
    status: 'pending'
  });
}

const bodyPools = {
  teen: [
    {
      problem: '좋아 보이는 과목만 담으면 진로 스토리가 끊기기 쉽다.',
      action: '과목 선택 전에 “이 과목이 어떤 일로 이어지는가”를 한 줄로 적어봐야 한다.',
      question: '지금 네가 고른 과목 중 미래 일과 바로 연결되는 과목은 뭐야?',
      tag: '고교진로'
    },
    {
      problem: '입시 준비가 길어질수록 학생은 학과 이름만 붙잡기 쉽다.',
      action: '학과보다 졸업 후 어떤 문제를 풀게 되는지 먼저 찾아보는 게 덜 흔들린다.',
      question: '네가 가고 싶은 학과는 결국 어떤 문제를 푸는 곳 같아?',
      tag: '학과선택'
    },
    {
      problem: '생기부를 채우는 활동이 많아도 방향 설명이 안 되면 힘이 약하다.',
      action: '활동 3개보다 왜 이 길을 가는지 설명하는 문장 1개가 더 중요하다.',
      question: '지금 너의 진로를 한 문장으로 말하면 뭐라고 할래?',
      tag: '학생진로'
    },
    {
      problem: 'AI 시대엔 직업 이름이 빨리 바뀌어서 학과 이름만 믿고 가면 불안이 커진다.',
      action: '전공보다 내가 반복해서 풀고 싶은 문제를 먼저 정리해두는 편이 오래 간다.',
      question: '너는 어떤 문제를 오래 붙들어도 덜 지치니?',
      tag: '진로설계'
    }
  ],
  youth: [
    {
      problem: 'AI를 쓴다고 말만 해서는 취업 시장에서 차별점이 잘 안 생긴다.',
      action: '내 직무에서 무엇을 줄였고 어떤 결과가 나왔는지 사례로 보여줘야 한다.',
      question: '너는 최근 AI로 줄인 작업 하나를 말할 수 있어?',
      tag: 'AI취업'
    },
    {
      problem: '취업 준비가 길어질수록 사람은 자기 경험을 회사 언어로 번역하지 못한다.',
      action: '경험을 “내가 한 일”이 아니라 “회사 문제를 어떻게 줄였는가”로 바꿔 적는 연습이 필요하다.',
      question: '너의 경험 중 회사 입장에서 바로 쓸 수 있는 건 뭐야?',
      tag: '취업준비'
    },
    {
      problem: '창업 아이디어가 막히는 이유는 아이템이 없어서보다 고객 문제를 좁히지 못해서다.',
      action: '누구의 어떤 불편을 지금 당장 줄일지 한 줄로 못 적으면 아직 문제 정의가 덜 된 상태다.',
      question: '네가 풀고 싶은 문제는 누구의 어떤 불편이야?',
      tag: '창업준비'
    },
    {
      problem: '퇴사 고민은 감정만 따라가면 후회가 커지기 쉽다.',
      action: '퇴사 전에는 최소 3개월 현금흐름과 다음 실험 계획부터 먼저 적어두는 게 안전하다.',
      question: '지금 네가 그만두기 전에 먼저 계산해야 할 건 뭐야?',
      tag: '커리어실험'
    }
  ],
  mid: [
    {
      problem: '경력이 길어도 채용 언어로 번역되지 않으면 전달이 잘 안 된다.',
      action: '“몇 년 했다”보다 “무슨 문제를 반복해서 해결했다”로 바꿔 말해야 한다.',
      question: '당신 경력을 문제 해결 언어로 바꾸면 첫 문장은 뭐가 될까?',
      tag: '중장년커리어'
    },
    {
      problem: 'AI를 늦게 배운다고 뒤처지는 건 아니다. 어디에 붙일지 모르는 게 진짜 문제다.',
      action: '한 번에 다 배우려 하지 말고 반복 업무 하나를 줄이는 데 먼저 붙여보는 게 맞다.',
      question: '지금 가장 먼저 줄이고 싶은 반복 업무는 뭐야?',
      tag: 'AI적응'
    },
    {
      problem: '후반전 커리어는 더 배우는 것보다 버릴 일과 남길 일을 나누는 데서 시작된다.',
      action: '내가 계속할 일 1개, 그만둘 일 1개만 정해도 방향이 훨씬 선명해진다.',
      question: '지금 계속할 것 하나, 버릴 것 하나를 고르면 뭐야?',
      tag: '후반전커리어'
    },
    {
      problem: '중장년 재취업에서 가장 자주 보이는 막힘은 경험이 많은데 설명이 짧지 않은 상태다.',
      action: '경력 전체를 늘어놓기보다 대표 문제 3개만 뽑아 재구성하는 편이 훨씬 강하다.',
      question: '네 경력에서 대표 문제 3개만 뽑으면 무엇이 남아?',
      tag: '재취업'
    }
  ]
};

function pickBestTrack(report = {}) {
  const rows = Array.isArray(report?.categoryRows) ? report.categoryRows : [];
  if (!rows.length) return 'youth';
  const mapping = {
    teen: 'teen',
    youth: 'youth',
    mid: 'mid',
    student: 'teen',
    students: 'teen',
    young: 'youth',
    career: 'youth',
    middle: 'mid',
    senior: 'mid'
  };
  const top = String(rows[0]?.category || '').toLowerCase();
  return mapping[top] || 'youth';
}

function buildTrackOrder(bestTrack, seed) {
  const base = rotate(TRACKS, seed % TRACKS.length);
  const filtered = base.filter((track) => track !== bestTrack);
  return [bestTrack, ...filtered];
}

function buildPost({ track, hour, index, opener, body, styleIndex }) {
  const styles = [
    [opener, body.problem, body.action, body.question],
    [`${opener} ${body.problem}`, body.action, body.question],
    [opener, '핵심은 단순하다.', body.problem, body.action, body.question]
  ];

  return {
    hour,
    slot: `${track}-${hour}`,
    track,
    category: track,
    text: styles[styleIndex % styles.length].filter(Boolean).join('\n\n'),
    comment: `${body.question} 댓글 한 줄이면 다음 글 방향 잡는 데 도움 된다.`,
    sceneHint: `${track} career thread`,
    imagePrompt: null,
    imageModel: null,
    imageAspectRatio: null,
    imageUrl: null,
    status: 'pending'
  };
}

async function main() {
  const date = process.argv[2] || todayKST(0);
  const seed = daySeed(date);
  const outDir = path.resolve('ops/threads/queue');
  const auditDir = path.resolve('ops/threads/audit');
  const outPath = path.join(outDir, `${date}.json`);
  const auditPath = path.join(auditDir, `${date}.json`);

  const reportDate = minusDay(date, 1);
  const reportPath = path.resolve(`ops/threads/reports/${reportDate}.json`);
  const researchPath = path.resolve(`ops/threads/research/${date}.json`);
  const strategyPath = path.resolve(`ops/threads/strategy/${date}.json`);
  const yesterdayReport = readJson(reportPath, {});
  const research = readJson(researchPath, {});
  const strategy = readJson(strategyPath, {});
  globalThis.__threadsResearch = research;
  const bestTrack = strategy.primaryTrack || pickBestTrack(yesterdayReport);
  const trackOrder = Array.isArray(strategy.slots) && strategy.slots.length
    ? strategy.slots.map((slot) => slot.track).filter((track) => TRACKS.includes(track))
    : buildTrackOrder(bestTrack, seed);

  const poolsByTrack = {
    teen: rotate(bodyPools.teen, seed + 3),
    youth: rotate(bodyPools.youth, seed + 7),
    mid: rotate(bodyPools.mid, seed + 11)
  };
  const openingByTrack = {
    teen: rotate(openingPools.teen, seed + 5),
    youth: rotate(openingPools.youth, seed + 9),
    mid: rotate(openingPools.mid, seed + 13)
  };
  const counters = { teen: 0, youth: 0, mid: 0 };

  const posts = HOURS.map((hour, index) => {
    const strategicSlot = Array.isArray(strategy.slots) ? strategy.slots.find((slot) => Number(slot.hour) === hour) : null;
    const track = strategicSlot?.track && TRACKS.includes(strategicSlot.track) ? strategicSlot.track : trackOrder[index % trackOrder.length];
    const localIndex = counters[track]++;
    const opener = openingByTrack[track][localIndex % openingByTrack[track].length];
    const theme = creativeDeck[track][localIndex % creativeDeck[track].length];
    const post = buildCreativePost({ track, hour, index, opener, theme });
    if (strategicSlot) {
      post.strategyRole = strategicSlot.role;
      post.strategyIntent = strategicSlot.intent;
    }
    return post;
  });

  const audit = auditPosts(posts);

  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(auditDir, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ date, timezone: TZ, sourceReport: reportDate, sourceResearch: fs.existsSync(researchPath) ? date : null, sourceStrategy: fs.existsSync(strategyPath) ? date : null, generator: 'career-cron-v2', brand: BRAND, bestTrack, posts }, null, 2));
  fs.writeFileSync(auditPath, JSON.stringify({ date, generator: 'career-cron-v2', brand: BRAND.generatorVersion, bestTrack, ...audit }, null, 2));
  console.log(`Generated: ${outPath} (generator=career-cron-v2, bestTrack=${bestTrack})`);
  console.log(`Audit: ${auditPath} (riskScore=${audit.summary.riskScore})`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
