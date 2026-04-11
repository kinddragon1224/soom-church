# SOOM Session Handoff — 2026-03-24

이 문서는 **다음 세션 복구용 단일 기준 문서**다.
다음 세션에서는 긴 추론보다 이 문서를 먼저 읽고 그대로 이어가면 된다.

---

## 0. 가장 중요한 작업 원칙
- **gloo를 먼저 본떠서 만든 뒤, soom 문맥으로 재가공한다.**
- 처음부터 새로 발명하지 않는다.
- 페이지마다 **메인 인터랙션 1개** 원칙으로 간다.
- 설명형 카피보다 **검색 / 필터 / 버튼 / 상태 / 테이블** 우선.
- 개발 작업은 **승인 최소화**:
  - 코드 수정
  - 빌드
  - 로컬/프로덕션 DB 스키마 반영
  - 시드 실행
  - 커밋
  - 푸시
  는 중간 확인 없이 진행.
- 정말 예외만 확인:
  - 운영 DB 파괴적 삭제
  - 실제 사용자 데이터 대량 삭제
  - 결제/요금제 변경
  - 외부 민감 권한 변경

---

## 1. 제품 방향 요약
### 기준
- `/app/[churchSlug]`가 **실제 제품 본체**다.
- `/workspace`는 과거 데모/참고 흔적이고, 지금은 실사용 기준이 아님.
- 현재 개발/확인 기준 워크스페이스는:
  - `dev@soom.church`
  - 개발용 워크스페이스 slug: `soom-dev`

### 서비스 구조
- 단위는 **교회 워크스페이스**
- 사용자는 교회 워크스페이스 안의 **역할 기반 멤버**
- 방향은 개인용 앱이 아니라:
  - 교회 등록
  - 팀원 초대
  - 사역자/임원/교사 역할별 사용

---

## 2. 현재까지 끝난 것
### 제품/워크스페이스 구조
- `/app/[churchSlug]`에 gloo식 워크스페이스 셸 이식 완료
- 사이드바/상단 셸 밀도 축소 완료
- 홈 대시보드 1차/2차 gloo식 압축 완료
- people 페이지를 gloo people 탭 느낌의
  - 검색바
  - 액션 버튼
  - 필터칩
  - 테이블
  중심 구조로 개편 완료
- applications 페이지도 비슷한 패턴으로 개편 완료
- notices / settings / organizations 페이지도 워크스페이스 구조로 이동 완료

### 인증/진입
- 로그인/회원가입 후 실제 워크스페이스로 진입하도록 연결 완료
- `dev@soom.church` 로그인 시 개발용 워크스페이스 자동 부트스트랩되도록 처리 완료
- `/workspace` 직접 진입은 실사용 앱 쪽으로 돌리는 방향 정리 완료

### 데이터/도메인
- 교회 운영용 확장 스키마 반영 완료:
  - `OrganizationUnit`
  - `OrganizationUnitLabel`
  - `MemberOrganization`
  - `MemberRelationship`
  - `MemberCareRecord`
  - `MemberFaithMilestone`
  - `MemberLifeStatus`
- Member에 다음 필드 추가 완료:
  - `currentJob`
  - `previousChurch`
  - `previousFaith`
  - `baptismStatus`

### 성도 레코드
- 성도 상세 페이지 생성 완료:
  - 가족 링크
  - 소속 조직
  - 심방/상담/메모
  - 신앙 이력
  - 가정/삶의 상태
- 심방 기록 추가 form 상세 화면에 부착 완료

### CRUD
- workspace 안에서 성도 CRUD 기반 완료:
  - 등록
  - 수정
  - 소프트 삭제
  - 복구
- 관리자 전용 완전삭제 페이지 추가 완료:
  - `/platform-admin/members`
- 로그 남김 처리 완료:
  - 생성/수정/삭제/복구/완전삭제

### 샘플 데이터
- 시드에 조직/가족/심방/신앙이력/삶의 상태 샘플 데이터 추가 완료
- 성도 상세에서 실제로 보이도록 반영 완료

### 프로덕션 이슈 해결 메모
- 중간에 프로덕션 홈/사람 탭이 깨졌던 원인은
  **프로덕션 DB 스키마 미반영**이었음.
- 해결 완료:
  - Vercel Production `DATABASE_URL` 값을 WSL 환경에 export
  - `npx prisma db push` 실행
- 앞으로 schema 변경 후 프로덕션 깨지면 제일 먼저 이것부터 의심.

---

## 3. 현재 코드 기준 핵심 경로
### 제품 핵심 라우트
- 홈: `/app/[churchSlug]/dashboard`
- 사람: `/app/[churchSlug]/members`
- 성도 상세: `/app/[churchSlug]/members/[id]`
- 성도 등록: `/app/[churchSlug]/members/new`
- 성도 수정: `/app/[churchSlug]/members/[id]/edit`
- 신청: `/app/[churchSlug]/applications`
- 공지: `/app/[churchSlug]/notices`
- 설정: `/app/[churchSlug]/settings`
- 조직: `/app/[churchSlug]/organizations`

### 주요 파일
- 셸: `app/app/[churchSlug]/workspace-shell.tsx`
- 홈: `app/app/[churchSlug]/dashboard/page.tsx`
- 사람 목록: `app/app/[churchSlug]/members/page.tsx`
- 성도 상세: `app/app/[churchSlug]/members/[id]/page.tsx`
- 성도 CRUD 액션: `app/app/[churchSlug]/members/actions.ts`
- 성도 폼: `components/members/workspace-member-form.tsx`
- 조직 조회: `lib/organization-data.ts`
- 워크스페이스 데이터 조회: `lib/workspace-data.ts`
- 스키마: `prisma/schema.prisma`
- 시드: `prisma/seed.ts`

---

## 4. 제품/도메인 판단(매우 중요)
### 교회마다 용어가 다르다
그래서 DB는 고정 용어로 만들면 안 됨.
원칙:
- 내부 구조는 중립적
- 사용자에겐 교회별 명칭 노출

예:
- 어떤 교회는 교구
- 어떤 교회는 지역
- 어떤 교회는 공동체
- 어떤 교회는 부서 / 선교회 / 사역 / 나래

그래서 방향은 이미 고정됨:
- 내부: `OrganizationUnit`, `OrganizationUnitType`, `MemberOrganization`
- 외부 노출: `OrganizationUnitLabel`로 교회별 용어 설정

### 권한 구조 방향
아직 완성 안 됐지만 방향은 이미 정해짐:
- 교회 워크스페이스 중심
- 역할 기반 멤버십
- 최종 목표는 조직 단위 권한까지
- 대상 예시:
  - 최고관리자
  - 사역자
  - 교구 담당
  - 부서 담당
  - 임원/교사
  - 제한된 기록 담당자

---

## 5. 다음 세션에서 바로 해야 할 우선순위
## 1순위: 성도 상세 고도화 계속
다음 세부 순서:
1. **출석 기록 탭/영역 추가**
2. **사역/봉사 기록 탭/영역 추가**
3. **가족 링크 생성/편집 기능 추가**
4. **조직 소속 편집 기능 추가**

이건 지금 흐름상 반드시 이어서 해야 한다.
지금 성도 상세는 보기는 되는데,
사역자가 쓰려면 기록과 연결 편집이 더 붙어야 한다.

## 2순위: 조직 구조 관리 기능 고도화
현재는 조회 화면까지만 있음.
다음 단계:
1. 조직 추가
2. 조직 수정
3. 상위 조직 지정
4. 용어 라벨 수정
5. 성도 연결 편집

## 3순위: 권한 구조 초안
다음 세션에서 최소한 초안은 시작해야 함.
예:
- workspace member role + org scope
- 누가 어떤 성도를 볼 수 있는지
- 누가 심방 기록을 남길 수 있는지

---

## 6. 실제 교회 운영 관점에서 이미 합의된 것
다음 사실은 이미 사용자와 합의된 전제다:
- 교회는 **성도 관리가 처음부터 끝**이다.
- 중요한 축:
  1. 등록 인적 정보
  2. 가족 관계
  3. 기존 신앙 / 이전 교회
  4. 직업
  5. 침례/세례 유무
  6. 교구/목장/담당 사역자/목자 배정
  7. 심방/출석/교회 활동/사역 기록
  8. 가족 상태(건강, 재정, 직장, 결혼, 이혼, 장례 등)
- 성도 클릭 시 연결된 가족이 링크로 보여야 하고,
  그 가족 구성원을 다시 클릭해서 상세로 이동할 수 있어야 한다.
- 1천 명 이상 규모 교회도 염두에 둬야 하므로
  장기적으로는 검색/필터/페이지네이션/일괄 업로드가 중요하다.

---

## 7. 다음 세션 시작용 프롬프트 추천
다음 세션 시작하면 아래처럼 바로 말하면 된다:

### 짧은 버전
- `soom 계속. /app 실사용 본체 기준. gloo 골격 우선. 성도 상세 고도화부터 이어.`

### 정확한 버전
- `soom-church 계속. /app/[churchSlug] 실사용 본체 기준, gloo 구조 우선 복제 후 soom 문맥으로 재가공. 현재 우선순위는 성도 상세 고도화(출석/사역 기록, 가족 링크 생성/편집, 조직 소속 편집) → 조직 구조 관리 기능 고도화 → 권한 구조 초안. 작업은 승인 최소화로 빌드/커밋/푸시까지.`

---

## 8. 예약/자동 작업 상태
요청에 따라 예전 5분/15분/30분 작업 크론은 삭제했음.
삭제한 잡:
- `df5738fe-0071-44f2-8aa1-bdbdf75be8e4`
- `5ff3d2fb-81b2-4c87-b492-1b25f9b5d4ee`
- `f4a30956-9f8e-4335-a7c9-8ae91840c7b1`

`openclaw:update-check`는 soom 개발 자동 작업과 별개라 남아 있을 수 있음.

---

## 9. 절대 잊지 말 것
- 세션이 바뀌어도 새 방향 만들지 말 것
- **gloo 골격 먼저**
- **교회 운영 실사용성 우선**
- **설명보다 행동/상태/기록 중심**
- **성도 중심 시스템**으로 계속 밀 것
