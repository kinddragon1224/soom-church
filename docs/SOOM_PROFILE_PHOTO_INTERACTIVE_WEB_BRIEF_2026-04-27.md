# Soom Profile Photo Interactive Web Brief — 2026-04-27

## Purpose

Use the attached full-body profile photo as the visual anchor for a redesigned Soom homepage.

The site should position Sun-yong as an **AI-era career, job, and direction strategist** — not a generic coach, not a fortune teller, not a church SaaS operator, not a normal AI lecturer.

Reference mood: Awwwards interactive websites — high contrast, immersive, editorial, motion-forward, sharp layout.

Reference URL provided by user:
https://www.awwwards.com/websites/interactive/

## Profile Photo Direction

Source image:
`/home/kinddragon/.openclaw/media/inbound/file_295---54482758-0b32-414f-97d0-754dc18314de.jpg`

Visual read:
- Full-body portrait
- Black structured outfit
- White/gray studio background
- Calm, serious expression
- East Asian minimal/futurist atmosphere
- Feels like: strategist, monk, designer, operator, quiet authority

Use the image as a **signature figure**, not a normal profile picture.

## Core Creative Concept

### Concept Name
**The Career Oracle, without fortune-telling.**

But do not literally use “oracle” unless it feels tasteful.

Better public-facing concept:

> AI 시대의 선택을 읽는 사람.

or

> 진로와 일의 흐름을 읽고, 다음 행동을 설계합니다.

## Visual System

### Mood
- Dark premium editorial
- Interactive career intelligence dashboard
- Korean futurism
- Minimal but intense
- Calm authority
- “A strategist standing inside a map of future work”

### Avoid
- cheerful coaching site
- beige handmade studio look
- church/community imagery
- overused AI gradients only
- generic SaaS homepage
- stock photo cards

### Palette
- Deep black: `#050507`
- Near black blue: `#080B12`
- Bone white: `#F3EFE7`
- Muted gray: `#8E939D`
- Signal orange: `#FF5B2E`
- Electric blue: `#4B7BFF`
- Soft jade: `#73D6B6`
- Hairline border: `rgba(255,255,255,0.10)`

### Typography
- Large, compressed, editorial Korean headline
- Very tight tracking on hero
- Small uppercase English labels
- Short copy blocks only
- Text should feel like a magazine cover + strategy dashboard

## Hero Layout

### Structure
Full viewport hero.

Left:
- Label
- Huge headline
- Short positioning copy
- CTA buttons
- proof chips

Right:
- Full-body portrait cut out or masked in a tall panel
- Subtle grid / orbit / signal lines around figure
- Floating data chips around body

### Hero Label
`AI CAREER INTELLIGENCE`

### Hero Headline Options

#### Option A
AI 시대,
진로와 일의
흐름을 읽습니다.

#### Option B
막힌 선택을
다음 행동으로
번역합니다.

#### Option C
과목·취업·재취업·AI.
커리어의 다음 수를 봅니다.

Recommended hero:

> AI 시대,
> 진로와 일의
> 흐름을 읽습니다.

Subcopy:

학생 진로, 20대 커리어, 중장년 후반전 커리어를 AI 시대의 직업 변화 속에서 다시 읽습니다. 정보가 아니라 기준을 만들고, 다음 7일에 할 행동 하나로 정리합니다.

CTA:
- Primary: `30분 방향 진단 신청`
- Secondary: `진단 방식 보기`

Proof chips:
- `학생 진로`
- `이력서/면접`
- `AI 활용 증거`
- `재취업/전직`
- `경력 재정의`

## Hero Image Treatment

Use the photo in one of these ways:

### Preferred
Tall right-side masked portrait panel:
- background remove if possible; if not, use photo inside tall rounded rectangle
- photo panel height: 76–88vh desktop
- grayscale/low saturation
- subtle orange/blue rim glow behind subject
- thin vertical grid lines behind
- overlay small signal nodes around figure

### Alternative
Center stage figure:
- figure centered
- giant headline wraps around/behind image
- cards orbit around subject

### CSS/Visual Effects
- radial gradient behind head/shoulders
- transparent grid background
- mix-blend or opacity overlays
- floating cards with slight transform
- scroll reveals for sections
- no heavy external animation library required

## Interactive/Awwwards-Inspired Motifs

Codex should implement tasteful lightweight interactions:

1. Cursor/hover responsive cards
   - cards lift, border glows, background shifts
2. Scroll progression line
   - `READ → TRANSLATE → ACT`
3. Sticky portrait section
   - portrait stays fixed while service cards scroll on desktop
4. Signal chips around profile photo
   - `AI SIGNAL`, `CAREER MAP`, `NEXT ACTION`, `WORK SHIFT`
5. Dashboard-like panels
   - use thin borders, mono labels, timestamps, signal bars

No need for complex WebGL. Tailwind + CSS is enough.

## Page Sections

### 1. Hero — Identity
Purpose: immediately communicate premium AI-era career strategist.

Content:
- label: `AI CAREER INTELLIGENCE`
- headline
- profile photo as signature visual
- CTA above fold

### 2. Problem — Why people are stuck
Title:
정보는 많은데, 선택은 더 어려워졌습니다.

Cards:
1. 학생/부모
   - 과목과 생기부는 채우는데 진로 문장이 없다.
2. 20대
   - 경험은 있는데 이력서에서 장면이 안 보인다.
3. 40–50대
   - 경력은 긴데 다시 팔 첫 문장이 약하다.

### 3. Method — READ / TRANSLATE / ACT
Title:
숨은 커리어를 세 단계로 읽습니다.

1. READ
   - AI, 직업 변화, 교육/채용 신호를 읽는다.
2. TRANSLATE
   - 불안과 경험을 직무·경력·포트폴리오 언어로 바꾼다.
3. ACT
   - 다음 7일에 할 행동 3개를 정한다.

### 4. Who It Is For
Three interactive cards:

#### 학생/부모
- 과목 선택
- 생기부 방향
- 학과 선택
- 부모-아이 기준 조율

#### 20대 커리어
- 이력서/면접
- AI 활용 증거
- 퇴사 전 실험
- 창업 아이디어 검증

#### 후반전 커리어
- 경력 재정의
- 재취업 첫 문장
- AI 업무 적용
- 버릴 일/남길 일

### 5. Offer
Title:
30분이면 정답은 몰라도, 다음 행동은 정할 수 있습니다.

Offer card:
`30분 AI 커리어 방향 진단`

Includes:
- 현재 선택 상황 정리
- 막힌 이유 1개 진단
- AI 시대 관점에서 직업/진로 흐름 해석
- 다음 7일 행동 3개
- 필요 시 이력서/포트폴리오/콘텐츠 방향 제안

### 6. Research Operating System
Title:
감이 아니라, 매일 흐름을 읽습니다.

Explain:
Soom runs a daily research/editorial system:
`Research → Strategy → Writing → Session → Action`

This gives the brand professional credibility.

### 7. Final CTA
Title:
지금 막힌 선택을 하나만 가져오세요.

Body:
과목, 학과, 이력서, 퇴사, 재취업, AI 활용. 문제를 크게 들고 와도 괜찮습니다. 먼저 한 문장으로 접고, 다음 행동 하나부터 정리합니다.

CTA:
`30분 방향 진단 신청`

## Copy Rules

Use:
- short, confident Korean
- editorial phrasing
- human but sharp
- authority without arrogance

Avoid:
- “꿈을 응원합니다”
- “AI 시대에 뒤처지지 마세요”
- “성공을 보장합니다”
- vague coaching language
- mystical fortune-telling language

## Implementation Notes For Codex

Target:
- `app/page.tsx`

Use image:
- Copy the source photo into `public/` if needed, e.g. `public/sunyong-profile.jpg`
- Use Next/Image if available
- Keep responsive behavior clean

Suggested component blocks inside same file if simple:
- `SignalChip`
- `AudienceCard`
- `MethodStep`
- `DashboardPanel`

Recommended technical style:
- Tailwind only
- CSS gradients
- no external animation library unless already installed
- keep build safe

Must run:

```bash
npm run build
```

If build fails due to unrelated existing project issues, report exact blocker.

## Exact Codex Prompt

Use `docs/SOOM_PROFILE_PHOTO_INTERACTIVE_WEB_BRIEF_2026-04-27.md` as the primary brief.

Redesign `app/page.tsx` into a premium interactive-style landing page for Soom as an AI-era career/direction intelligence studio. Use the attached full-body profile photo as the signature visual anchor. The page should feel inspired by Awwwards interactive sites: dark editorial, high contrast, dashboard-like, refined motion/hover details, and strong information hierarchy.

Do not keep the current beige maker-studio positioning. The new site must clearly position Sun-yong/Soom as an expert in AI-era student direction, early career, second career, jobs, and career strategy.

Copy the image to `public/sunyong-profile.jpg` if necessary, use it in the hero, build the full landing page, then run `npm run build`.
