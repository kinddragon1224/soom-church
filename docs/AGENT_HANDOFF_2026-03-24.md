# SOOM-CHURCH Agent Handoff — 2026-03-24

이 문서는 **재성 / 아티 같은 다른 에이전트가 바로 이어서 작업할 수 있게 만드는 기술 핸드오프 문서**다.
설명보다 **현재 구조, 결정, 구현 상태, 다음 우선순위**를 중심으로 정리한다.

---

## 1. 현재 제품 기준

### 메인 앱 기준 경로
- 실사용 본체는 `/app/[churchSlug]`
- `/workspace`는 참고 흔적/이전 데모 계열이고, 현재 핵심 구현 기준은 아님

### 현재 중요한 도메인 방향
- 제품은 **교회 워크스페이스 중심 운영 시스템**
- 중심 엔티티는 **성도(Member)**
- 모든 흐름은 결국 성도 등록 → 분류 → 배정 → 후속관리 → 기록 축으로 이어짐
- UI/카피 방향은 아래 3개를 고정 원칙으로 삼음:
  1. 자연어 처리 느낌 최소화, 웹서비스 전용의 직관 문구 사용
  2. 워크스페이스의 이점(운영 상태 / 행동 / 연결 구조)이 한눈에 보여야 함
  3. 추후 수정/보완이 꼬이지 않도록 확장 가능한 구조와 명확한 데이터 흐름 우선

---

## 2. 오늘 구축한 핵심 기능 요약

### A. 성도 상세/레코드 고도화
경로:
- `app/app/[churchSlug]/members/[id]/page.tsx`
- `app/app/[churchSlug]/members/actions.ts`

추가된 것:
- 출석 기록 표시/추가
- 사역/봉사 기록 표시/추가
- 가족 링크 생성/수정/해제
- 조직 소속 연결/수정/해제
- 주 소속 지정

의미:
- 성도 상세가 단순 조회가 아니라 **실제 운영 레코드 화면**으로 진입함

---

### B. 성도 등록/수정 폼 구조 안정화
경로:
- `components/members/workspace-member-form.tsx`
- `app/app/[churchSlug]/members/new/page.tsx`
- `app/app/[churchSlug]/members/[id]/edit/page.tsx`
- `app/app/[churchSlug]/members/actions.ts`

중요 결정:
- `WorkspaceMemberForm`은 **프레젠테이션 전용 폼 컴포넌트**로 유지
- auth / church scope / DB 조회 / server action binding은 페이지 레벨에서 처리
- 등록/수정 후 직접 상세로 보내지 않고 요약 흐름으로 연결

이유:
- 사람 추가 버튼 진입 시 서버 에러가 나던 원인을 제거하기 위해
- 이후 폼 재사용/확장이 덜 꼬이게 하기 위해

---

### C. 등록 직후 Summary 랜딩 추가
경로:
- `app/app/[churchSlug]/members/[id]/summary/page.tsx`
- `app/app/[churchSlug]/members/actions.ts`

핵심 변경:
- 성도 등록/수정 후 이동 경로를 상세 레코드가 아닌 `/members/[id]/summary`로 변경
- summary 화면에 아래를 배치
  - 현재 상태
  - 현재 단계
  - 다음 작업
  - 체크리스트
  - 배정 상태
  - 상태 업데이트 폼
  - 기본 액션 링크

중요 판단:
- **등록 직후에는 무거운 상세 페이지보다 “정리 화면”이 먼저**라는 제품 판단을 확정함

---

### D. 상태 시스템 1차 구축
경로:
- `lib/member-status.ts`
- `app/app/[churchSlug]/members/[id]/summary/page.tsx`
- `app/app/[churchSlug]/members/page.tsx`
- `app/app/[churchSlug]/members/actions.ts`

현재 상태값:
- `등록대기`
- `새가족`
- `정착중`
- `목장배정완료`
- `봉사연결`
- `휴면`
- `심방필요`

현재 상태 메타:
- `stage`
- `nextAction`
- `description`
- `quickActions`

현재 자동 규칙:
- `휴면`, `심방필요` 저장 시 `requiresFollowUp = true`
- `목장배정완료`, `봉사연결` 저장 시 `requiresFollowUp = false`

현재 빠른 처리:
- 성도 목록에서 `다음 단계` 버튼으로 상태 진전 가능
- `advanceMemberStatus()`가 현재 상태를 기준으로 다음 상태로 자동 전환

상태 전이 맵:
- 등록대기 → 새가족
- 새가족 → 정착중
- 정착중 → 목장배정완료
- 목장배정완료 → 봉사연결
- 봉사연결 → 봉사연결(고정)
- 휴면 → 새가족
- 심방필요 → 정착중

주의:
- 이 전이 맵은 현재 임시 운영 규칙 수준이다
- 나중에 더 세밀한 상태 머신 또는 조건 기반 액션으로 분리 가능

---

### E. 사람 목록 운영 큐 강화
경로:
- `app/app/[churchSlug]/members/page.tsx`
- `lib/workspace-data.ts`

추가된 것:
- 사람 목록에 `다음 작업` 열 추가
- 각 행에 `다음 단계` 빠른 처리 버튼 추가
- 후속 연락, 미배정 기준으로 운영 큐를 읽을 수 있게 정리

의미:
- 목록이 단순 조회 테이블이 아니라 **운영 액션 테이블**로 바뀌는 중

---

### F. 대시보드 운영 큐 강화
경로:
- `app/app/[churchSlug]/dashboard/page.tsx`
- `lib/workspace-data.ts`

추가된 것:
- 후속 연락 수
- 미배정 인원 수
- 심방 필요 수
- 최근 등록 인원의 상태 + 다음 작업 표시
- focus queue / today board 강화

데이터 로더 확장:
- `dormantMembers`
- `visitNeededMembers`
- 다음 처리 대상 조회

의미:
- 대시보드가 숫자판이 아니라 **오늘 바로 처리할 운영 큐**로 변하는 중

---

### G. 설정에서 기본값 관리 가능
경로:
- `app/app/[churchSlug]/settings/actions.ts`
- `app/app/[churchSlug]/settings/page.tsx`
- `components/members/workspace-member-form.tsx`

설정 가능 항목:
- 가족 기본값 (`household`)
- 교구 기본값 (`district`)
- 목장 기본값 (`group`)
- 교회별 용어 (`교구 / 부서 / 목장`)

중요 결정:
- 성도 등록 폼의 가족/교구/목장 값은 하드코딩/시드가 아니라 **설정에서 운영자가 직접 관리하는 구조**

---

### H. 조직 관리 CRUD 구축
경로:
- `app/app/[churchSlug]/organizations/actions.ts`
- `app/app/[churchSlug]/organizations/page.tsx`
- `lib/organization-data.ts`

구현 상태:
- 조직 생성
- 조직 수정
- 상위 조직 지정
- 조직 용어 라벨 수정
- 조직별 성도 연결 미리보기

현재 용도:
- 교구 / 부서 / 사역 / 기타 공동체를 내부 중립 구조로 다루기 위한 기반

---

### I. CSV 일괄 등록 구축
경로:
- `app/app/[churchSlug]/members/import/page.tsx`
- `app/app/[churchSlug]/members/import/actions.ts`

현재 구현 상태:
- CSV 업로드
- 서버 측 CSV 파싱
- 미리보기
- 중복 행 판별
- 필수값 누락 판별
- 등록 실행
- 실패 행 표시
- 중복 건너뜀 수 표시
- CSV 템플릿 다운로드
- 컬럼 가이드 카드 표시

현재 컬럼 처리 규칙:
- 필수: `이름`, `전화번호`
- 인식 가능한 컬럼 예시:
  - 성별
  - 이메일
  - 교구
  - 목장
  - 가족
  - 직분
  - 상태
  - 등록일
  - 직업
  - 메모

중요 연결 규칙:
- 교구/목장/가족 이름이 설정값에 없으면 자동 생성 후 연결
- 중복 기준은 `이름 + 전화번호`

주의:
- 현재 파서는 단순 CSV 파서다
- quoted comma 정도는 처리하지만, 엑셀 변종/인코딩 이슈는 아직 깊게 다루지 않음

---

### J. Vercel 배포 이슈 해결
경로:
- `vercel.json`

변경:
- functions region `sin1` → `icn1`

원인:
- 코드 문제라기보다 싱가포르 리전 장애성 실패

교훈:
- 이후 동일 유형 배포 실패 시 코드보다 **리전 상태** 먼저 의심할 것

---

## 3. 현재 파일별 역할

### 상태/행동 로직
- `lib/member-status.ts`
  - 상태 메타
  - quickActions
  - 상태 저장 자동 규칙

### 성도 메인 action
- `app/app/[churchSlug]/members/actions.ts`
  - create/update/delete/restore
  - status update
  - status advance
  - 가족 링크
  - 조직 소속
  - 심방/출석/사역 기록

### 성도 조회 데이터
- `lib/workspace-data.ts`
  - dashboard data
  - member list
  - member detail record
  - application list
  - notice list

### 성도 등록/수정/요약
- `components/members/workspace-member-form.tsx`
- `app/app/[churchSlug]/members/new/page.tsx`
- `app/app/[churchSlug]/members/[id]/edit/page.tsx`
- `app/app/[churchSlug]/members/[id]/summary/page.tsx`

### CSV
- `app/app/[churchSlug]/members/import/page.tsx`
- `app/app/[churchSlug]/members/import/actions.ts`

### 조직
- `app/app/[churchSlug]/organizations/page.tsx`
- `app/app/[churchSlug]/organizations/actions.ts`
- `lib/organization-data.ts`

### 설정
- `app/app/[churchSlug]/settings/page.tsx`
- `app/app/[churchSlug]/settings/actions.ts`

---

## 4. 현재 UX/아키텍처 결정 사항

### 결정 1. 등록 직후는 상세 페이지가 아니라 summary
이건 사실상 확정이다.
다른 에이전트가 이어서 작업할 때도 이 흐름을 유지하는 편이 좋다.

### 결정 2. 목록은 조회 화면이 아니라 운영 화면
사람 목록, 대시보드, summary 모두
- 상태
- 다음 작업
- 빠른 처리
를 중심으로 더 강화하는 방향이 맞다.

### 결정 3. 설정은 실제 운영 기본값 관리 화면이어야 함
가족/교구/목장/용어는 설정에서 운영자가 바꾸는 구조를 유지한다.

### 결정 4. 카피는 대화체보다 웹서비스 톤
예:
- “이 화면이야”, “여기서 보자” 같은 대화체 카피보다
- “등록 미리보기”, “배정 상태”, “다음 작업”, “기본값 관리” 같은 제품 문구 유지

---

## 5. 현재 기술 부채 / 한계 / 주의점

### 1) 상태 시스템은 아직 얕음
- 지금은 상태 메타 + 단순 전이 + 일부 자동 규칙 수준
- 결국엔 상태별 전용 액션, 조건, 기록 연결이 더 필요함

### 2) CSV는 아직 1.5단계 수준
- 템플릿/가이드는 붙었지만
- 컬럼 매핑 UI
- 부분 성공 리포트 구조화
- 인코딩/대용량/엑셀 업로드 대응
- dry-run API 분리
는 아직 없음

### 3) summary에서 즉시 수정은 아직 링크 위주
- 배정 정보 바로 수정 CTA는 edit 페이지로 이동시키는 방식
- summary 자체에서 inline assignment form을 띄우는 건 아직 안 함

### 4) 권한 구조는 아직 미착수에 가까움
- workspace member role + org scope 설계가 아직 코드화되지 않음
- 지금은 교회 범위 membership 기준의 접근이 중심

---

## 6. 다음 우선순위 제안

### 1순위
**summary에서 즉시 배정 수정**
- 교구 선택
- 목장 선택
- 상태별 핵심 필드 바로 수정
- edit full page로 가지 않고 summary에서 해결

### 2순위
**상태별 전용 액션 실동작화**
예:
- 새가족 → 첫 연락 기록 남기기
- 정착중 → 출석/정착 메모 추가
- 심방필요 → 심방 기록 작성으로 직결
- 봉사연결 → 사역 기록 작성으로 직결

### 3순위
**CSV 컬럼 매핑/결과 구조화**
- 컬럼 자동 추정 + 수동 매핑
- dry-run 결과 JSON 분리
- 성공/실패/중복 상세 결과 테이블

### 4순위
**권한 구조 초안 시작**
- workspace role
- organization scope
- 기록 열람/편집 범위

---

## 7. 다른 에이전트가 작업할 때 지켜야 할 것

1. `/app/[churchSlug]` 기준으로만 생각할 것
2. 성도 중심 시스템이라는 전제를 흔들지 말 것
3. UI는 점점 더 **운영 큐 / 다음 작업 / 빠른 처리** 중심으로 갈 것
4. 폼 컴포넌트에 auth / fetch / business logic를 다시 섞지 말 것
5. 카피는 제품 문구처럼 짧고 명확하게 유지할 것
6. 일반 개발 작업은 수정 → 빌드 → 커밋 → 푸시까지 한 번에 진행하는 흐름을 유지할 것

---

## 8. 현재까지 반영된 대표 커밋
- `28a94ec` — Add member summary landing flow
- `8d80e70` — Add CSV member import flow
- `d2fe85c` — Connect member status to next actions
- `c5f564f` — Harden CSV import and status rules
- `d6cdb12` — Strengthen member operation queues
- `522798c` — Improve member assignment and CSV guidance

---

## 9. 한 줄 결론
지금 soom-church는 **교회 워크스페이스 기반 성도 운영 시스템**으로서,
- 성도 등록
- 등록 후 정리(summary)
- 상태 기반 운영
- CSV 일괄 등록
- 조직/기본값 관리
까지 1차 골격이 올라온 상태다.

다음 에이전트는 여기서 **summary 즉시 수정 + 상태별 전용 액션 + 권한 구조**로 이어가면 된다.
