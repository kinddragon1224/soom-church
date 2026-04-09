# SOOM-CHURCH NEXT ACTIONS

이 파일은 다음 세션 시작 시 가장 먼저 읽는 복구용 파일이다.
긴 문서 보기 전에 이것부터 확인한다.

---

## LATEST SESSION RECOVERY - 2026-04-09
### 현재 제품 정의
- 숨은 `목자가 목장 운영을 대화로 처리하고, 웹앱은 그 결과를 정리/검토/복구하는 운영 OS`
- 제품 방향은 `chat-first`
- 웹앱은 입력툴이 아니라 운영판
- 현재 채팅 입력 채널은 우선 텔레그램의 모라를 그대로 사용
- 1차 모델 검증은 현재 스택의 GPT-5.4로 진행

### 왜 방향을 바꿨는가
1. 목자가 직접 입력해야 하는 양이 많아졌다
2. UI가 반복 노출이 많고 피곤하다
3. 기존 관리툴과 본질적으로 다르지 않게 느껴진다
4. `목자가 덜 헤매고 더 정확하게 사람을 관리하게 한다`는 철학에서 멀어졌다

### 기준 문서
- `docs/SOOM_V2_CHAT_FIRST_PLAN_2026-04-09.md`
- `docs/SOOM_V2_IA_2026-04-09.md`
- `docs/SOOM_V2_REVIEW_SCHEMA_2026-04-09.md`

### 이번 세션 반영
- G.I.D.O 전용 shell을 `Today / Review / People / Households / Timeline / Search` 구조로 교체함
- `/app/gido`와 로그인 후 기본 진입점을 `/today`로 변경함
- `Review`, `Timeline`, `Search` v2 골격 화면을 추가함
- 로그인은 이메일 대신 간단한 아이디 `gido`를 받도록 바꾸고, 기본 비밀번호는 `1234` 기준으로 단순화함

### 바로 다음에 할 것
1. Prisma에 `capture / extracted update / review item / apply result` 초안 추가
2. 지금 만든 `Review` 골격을 실제 DB 기준 리스트로 교체
3. `People`를 기존 members redirect가 아니라 v2 레코드 화면으로 교체
4. `Households`도 관계 중심 정리판으로 다시 정리

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
