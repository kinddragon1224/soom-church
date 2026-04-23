# THREADS_GPT_IMAGE2_PLAYBOOK_2026-04-23

## 목적
- Threads 글 발행 시 GPT Image 2를 단순 키워드 프롬프트가 아니라 "운영 가능한 제작 파이프라인"으로 사용.
- 핵심: 이미지 1장 자체보다 **시리즈 일관성 + 클릭 전후 맥락 전달 + 댓글 유도**.

## 현재 반영 상태
- `scripts/threads-generate-day-plan.mjs`
  - 9슬롯 중 3슬롯(09/15/21시)에 `imagePrompt`, `imageModel`, `imageAspectRatio` 자동 생성
  - 프롬프트는 상황 연출형 + 우상단 괘/효 미니 패널 규칙 포함
- `scripts/threads-publish-slot.mjs`
  - `imagePrompt`는 로그에 저장됨(`ops/threads/logs/publish.jsonl`)
  - `imagePrompt`는 있는데 `imageUrl`이 없으면 경고 로그 출력

## GPT Image 2 활용 원칙 (실전)
1. 생성보다 편집 우선
- 첫 결과를 바로 쓰지 않고, 같은 장면을 2~3회 편집(iterative edit)으로 정제
- 목적: 얼굴/손/패널/UI 정합성 개선

2. 프롬프트 구조화
- 한 문장 감성 프롬프트 금지
- 섹션형 프롬프트 사용:
  - INTENT / SCENE / MOOD / COMPOSITION / UI OVERLAY / NEGATIVE / OUTPUT

3. "상황 연출형" 고정
- 인물 초상 클로즈업 금지
- 행동 맥락이 보이는 미디엄·와이드 샷

4. 고정 UI 시그니처
- 우상단: 괘/효 미니 패널 + 6효 도식 + 해당 효 하이라이트
- 패널 외 텍스트 최소화

5. 품질 체크리스트
- 손/얼굴 왜곡 여부
- 패널 위치/가독성
- 과한 AI 광택(플라스틱 피부) 여부
- 장면이 글의 행동문과 맞는지

## 운영 루프
- 01:00 전일 리포트 생성
- 01:10 당일 큐 생성(이미지 프롬프트 포함)
- 발행 전(해당 슬롯): `imagePrompt` 기반 생성/선별 후 `imageUrl` 채움
- 발행 후: 로그 기반으로 다음날 프롬프트 개선

## 다음 개선
- 이미지 결과 품질 점수(수동 1~5점) 필드 추가
- 고성과 이미지의 프롬프트 패턴 자동 재활용
- 텍스트 훅과 이미지 장면의 결합 점수화(CTR/댓글률 연동)
