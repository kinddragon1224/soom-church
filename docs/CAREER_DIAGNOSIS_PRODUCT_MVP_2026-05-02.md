# Career Diagnosis Product MVP — 2026-05-02

## Goal
Build the first sellable bridge between Threads attention and paid career diagnosis.

This is not a generic AI diagnosis. Position it as:

> 김선용의 판단 기준으로 만든 AI 커리어 해석 리포트

The product uses:
- Sun-yong's trust assets: real face/name, career counselor credential, media planner background, father/field perspective.
- Mora's interpretation system: questions, framing, report language.
- Codex/web implementation: form, lead capture, report request workflow, later payment/report automation.

## Why comments matter
Threads comments and replies are not only engagement. They are customer desire data.
Collect recurring phrases in three buckets:
1. Anxiety: “우리 애도 이런데…”, “AI 때문에 뭘 해야 할지 모르겠어요.”
2. Objection: “현실은 스펙 없으면 안 되잖아요.”, “지방은 기회가 없어요.”
3. Buying signal: “제 상황은 어떻게 봐야 하죠?”, “검사/상담 있나요?”

Turn those phrases into diagnosis form questions and report sections.

## MVP Offer Ladder
1. Free: 3-minute diagnosis, no personal info.
2. Lead capture: detailed report request, no payment yet.
3. Manual paid beta: 29,000 KRW detailed report or 99,000 KRW 30-minute interpretation session.
4. Later automation: payment + automatic Mora report draft + Sun-yong review.

## First Audience Tracks
### 1. Student / Parent
Name: 우리 아이 진로 방향 해석 리포트
Promise: 직업명보다 아이가 오래 버틸 환경과 탐색 순서를 좁힌다.
Collect:
- child grade/age
- parent's biggest worry
- subjects/activities liked/disliked
- current pressure point
- desired outcome

### 2. 20s / Early Career
Name: 첫 커리어 방향 재정렬 리포트
Promise: 전공·경험·AI 활용을 시장 언어/증거로 바꾼다.
Collect:
- major/current status
- target jobs or confusion
- projects/experiences
- AI usage level
- biggest blocker

### 3. 40–50s / Transition
Name: 경력 재호명 리포트
Promise: 기존 경력을 버리지 않고 시장 언어로 다시 부른다.
Collect:
- career history
- repeat roles/problems solved
- constraints: money/time/region/health
- avoided paths
- transition candidates

## Required Web Changes
Use existing `/diagnosis` and `/diagnosis/report-intake` as the base.

### `/diagnosis`
- Reposition page from generic “미래직업·진로 방향 진단” to “김선용의 AI 커리어 해석 리포트”.
- Add three audience track cards before or inside the flow.
- Keep free 7-question diagnosis, but make copy clearer: this is a free preview, not the final product.
- Result screen should show:
  - current state one-liner
  - why it feels stuck
  - first next action
  - CTA: “내 상황 기준 상세 리포트 요청하기”

### `/diagnosis/report-intake`
- Add selected audience track support: `track=student_parent|early_career|transition`.
- Show track-specific helper copy and placeholders.
- Keep storage as JSONL for now: `ops/diagnosis-report-requests/requests.jsonl`.
- Add consent note: input is used to prepare a diagnosis/report reply.
- Keep bot honeypot.

## Do Not Build Yet
- Do not add payment yet.
- Do not add automatic report generation yet.
- Do not add external database unless already required by the app.
- Do not overcomplicate admin UI.

## Quality Gate
Run at least:
- `npm run build`

If build is too slow/fails from unrelated existing issue, report the exact blocker.

## Completion Summary Format
When finished, summarize:
1. changed files
2. implemented user-facing flow
3. build/test result
4. next recommended step
