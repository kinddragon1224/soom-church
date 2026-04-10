# SOOM-CHURCH NEXT ACTIONS

이 파일은 다음 세션 시작 시 가장 먼저 읽는 복구용 파일이다.
긴 문서 보기 전에 이것부터 확인한다.

---

## LATEST SESSION RECOVERY - 2026-04-09
### 현재 제품 정의
- 숨은 `목자 전용 심플 AI 워크스페이스`다
- 메인 화면은 ChatGPT보다 더 단순한 채팅 인터페이스다
- 목자는 채팅으로 목원 추가, 출석, 심방, 기도제목, 근황을 관리한다
- 시스템은 이를 자동 구조화해 관리자 워크스페이스 데이터로 반영한다
- 심미적 차별점은 `목장 미니 월드` 레이어로 푼다. 메인 채팅은 단순하게 유지하고, 목자/목원 미니미 아바타와 상태 이펙트는 보조 홈/요약 레이어에 붙인다
- `기도 목장`은 주력 데이터센터가 아니라 빈 상태에서 다시 시작한 베타 레퍼런스 사용자 1곳이다

### 왜 방향을 바꿨는가
1. 목자가 직접 입력해야 하는 양이 많아졌다
2. UI가 반복 노출이 많고 피곤하다
3. 기존 관리툴과 본질적으로 다르지 않게 느껴진다
4. `목자가 덜 헤매고 더 정확하게 사람을 관리하게 한다`는 철학에서 멀어졌다

### 기준 문서
- `docs/SOOM_V2_CHAT_FIRST_PLAN_2026-04-09.md`
- `docs/SOOM_V2_IA_2026-04-09.md`
- `docs/SOOM_V2_REVIEW_SCHEMA_2026-04-09.md`
- `docs/SOOM_V2_PRODUCT_STRUCTURE_2026-04-10.md`
- `docs/SOOM_V2_CHAT_INPUT_PLAN_2026-04-10.md`
- `docs/SOOM_WORLD_GAME_LAYER_2026-04-10.md`
- `docs/SOOM_WORLD_ART_DIRECTION_V1_2026-04-11.md`

### 이번 세션 반영
- G.I.D.O 전용 shell을 `Chat / Review / People / Households / Timeline / Search` 구조로 다시 교체함
- `/app/gido`와 로그인 후 기본 진입점을 메인 채팅 화면 `/chat`으로 변경함
- `Chat`, `Review`, `Timeline`, `Search` v2 골격 화면을 추가함
- 로그인은 이메일 대신 간단한 아이디 `gido`를 받도록 바꾸고, 기본 비밀번호는 `1234` 기준으로 단순화함
- `ChatCapture`, `ExtractedUpdate`, `ReviewItem` Prisma 모델을 추가하고 `prisma db push`까지 완료함
- `Chat` 페이지에서 메시지 전송 시 `capture -> AI extract(or fallback parse) -> ambiguity flag Review Queue 등록 -> assistant reply 저장` 흐름을 실제로 연결함
- `Review` 페이지는 이제 실제 `ReviewItem` DB를 읽고 승인/수정후승인/보류/무시 상태 변경까지 동작함
- `ApplyResult` 모델과 `lib/extracted-update-apply.ts`를 추가함
- ambiguity 없는 `confirmed` 항목은 이제 자동으로 실제 도메인 모델에 반영됨: `MemberCareRecord`, `MemberFaithMilestone`, `MemberRelationship`, `Member`, `Household` 중 가능한 대상에 즉시 적용하고, 애매하면 다시 `Review`로 되돌림
- `Review`에서 승인한 카드도 같은 apply 로직을 타도록 연결함
- `lib/chat-apply-log.ts`를 추가해 `ApplyResult + ExtractedUpdate + Capture`를 공통 로그 뷰로 묶음
- `People`는 기존 `members` redirect를 걷어내고 사람별 최근 반영 로그를 보여주는 v2 레코드 화면으로 교체함
- `Timeline`은 임시 G.I.D.O 데이터가 아니라 실제 apply 결과를 시간순으로 보여주는 화면으로 교체함
- `Households`는 quick form 편집판 대신 가정 구조 / 가족 관계 / 최근 반영 기록 / 가정 메모를 함께 보는 관계 중심 보드로 재구성함
- fallback parser를 보강해 관계 후보는 실제 멤버 2명이 잡히거나 명시적 연결 의도가 있을 때만 만들도록 줄였음
- fallback parser에 교회 이벤트(`침례/세례/입교/성찬/등록/이명/헌아`)와 더 넓은 출석 표현 감지를 추가함
- LLM prompt에도 updateType별 payload 키 규약과 `두 번째 사람 이름을 지어내지 말 것` 규칙을 넣음
- `/app/gido/chat` 우측 요약은 이제 단순 수치 카드가 아니라 `목장 미니 월드` 1차 레이어로 바뀜. 실제 member + apply log 데이터를 읽어 사람별 상태를 색과 배지로 보여줌
- 빈 베타에서는 `첫 목원을 기다리는 중` empty state가 보이고, 첫 목원 입력 뒤부터 월드 카드가 생기는 흐름으로 정리함

### 바로 다음에 할 것
1. 빈 `gido` 베타에서 채팅으로 첫 목원 추가 테스트를 다시 시작하기
2. `채팅 입력 -> 등록 후보 -> Members 실제 생성` 흐름을 한 번 더 end-to-end로 검증하기
3. `/app/gido/world` 1차 화면을 만들고 실제 member / household 데이터를 월드 오브젝트로 배치하기
4. 포켓몬 마을 오마주 기반 아트디렉션으로 월드 톤, 집, 캐릭터, 색감, 상태 이펙트를 정교화하기
5. visible `Review`는 계속 숨기고, 채팅 중심 운영 구조를 유지하기

### 멈출 것
- G.I.D.O 입력형 UI 확장
- quick form 계속 추가하는 흐름
- 홈/운영/기록/편집 책임이 섞인 화면
- 반복 이름 나열형 UI

### 운영 메모
- 현재 G.I.D.O 트랙은 제품 기준이 아니라 참고용 V1 시도다
- OpenClaw cron은 전부 제거됨, 현재 `/home/kinddragon/.openclaw/cron/jobs.json` = 빈 jobs
- 텔레그램 발신은 정상
- `channels.telegram.apiRoot` 미지원 경고 로그 있음, 나중에 설정 정리 필요
- 커밋 시 이번 세션 관련 파일만 올리고, 여전히 무관한 `app/workspace/page.tsx` 같은 로컬 변경은 제외할 것

---

## 다음 세션 시작용 지시문
- `soom-church NEXT_ACTIONS부터 읽고 이어가`
- `숨 v2 chat-first 기준으로 이어가`
- `Review Queue부터 설계해`

## 응답 방식 원칙
- 선용은 비개발자다
- 항상 짧고 실행 가능하게 답한다
- 기본 형식:
  1. 지금 상태 한 줄
  2. 바로 할 일 1개
  3. 내가 대신 수정할 수 있는 것
  4. 확인만 필요한 것

## 톤 구분 메모
- 대화 톤: 반말
- 홈페이지/제품/마케팅 문구 톤: 존댓말
- 작업 중 헷갈리면 대화 톤과 사이트 문구 톤을 분리해서 판단한다
