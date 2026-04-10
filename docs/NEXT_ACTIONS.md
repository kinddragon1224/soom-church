# SOOM-CHURCH NEXT ACTIONS

이 파일은 다음 세션 시작 시 가장 먼저 읽는 복구용 파일이다.
긴 문서 보기 전에 이것부터 확인한다.

---

## LATEST SESSION RECOVERY - 2026-04-09
### 현재 제품 정의
- 숨은 `목자가 채팅앱에 운영 내용을 간편하게 입력하면, 앱 내부 모델이 이를 자동 구조화해 관리자 워크스페이스 데이터로 적재하는 운영 OS`
- 제품 방향은 `chat-first`
- 웹앱은 입력툴이 아니라 관리자 워크스페이스다
- 목자는 표/폼 대신 채팅앱에 등록, 심방 기록, 이벤트, 기도제목을 넣는다
- 현재 채팅 입력 채널은 우선 텔레그램/채팅형 인터페이스를 기준으로 검증한다
- 1차 모델 검증은 현재 스택의 GPT-5.4로 진행
- `기도 목장`은 주력 데이터센터가 아니라 베타 레퍼런스 사용자 1곳이다

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

### 바로 다음에 할 것
1. `SOOM_V2_CHAT_INPUT_PLAN_2026-04-10.md` 기준으로 일반 채팅 입력 1차 범위를 구현하기
2. 기존 사람 기록 입력(심방/기도/이벤트/후속/출석) 자동 반영 정확도를 먼저 높이기
3. 새 사람 등록은 바로 `Member`에 꽂지 말고 안전한 `intake candidate` 레이어로 먼저 받기
4. `Members`는 단순한 운영 화면으로 다시 설계하되 직접 추가/직접 수정/기록 열람은 유지하기
5. visible `Review`는 예외 처리함 수준으로 축소하고, 정말 애매한 케이스만 `확인 필요`로 분리하기

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
