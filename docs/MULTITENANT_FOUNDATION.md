# Multi-tenant SaaS Foundation (1차 울타리)

## 1) 변경 개요
숨을 단일 교회 앱에서 다중 교회 워크스페이스 SaaS로 확장하기 위한 데이터/라우팅 울타리를 추가했다.

핵심:
- 공식 홈페이지 영역과 앱 영역 분리
- 앱 라우트에 churchSlug 컨텍스트 도입
- Prisma에 Church / ChurchMembership / Subscription 추가
- 핵심 운영 데이터에 churchId 스코프 필드 도입

---

## 2) 데이터 모델 설계

### 신규 모델
- **Church**: 워크스페이스(테넌트) 루트
  - slug(unique), name, timezone, isActive
- **ChurchMembership**: 사용자-교회 연결(다대다)
  - userId + churchId unique
  - role(enum): OWNER/ADMIN/PASTOR/LEADER/VIEWER
  - customRole(roleId) 확장 슬롯
- **Subscription**: 구독 확장 슬롯
  - churchId, plan(enum), status(enum), trialEndsAt, currentPeriodEnd

### 기존 모델의 churchId 추가
- Role
- Household
- District
- Group
- Member
- ApplicationForm
- Application
- Notice
- ActivityLog

### 제약/인덱스 재설계
- District.name 전역 unique 제거 → `@@unique([churchId, name])`
- Group unique 강화 → `@@unique([churchId, districtId, name])`
- 대부분 운영 쿼리용 churchId 복합 인덱스 추가

---

## 3) 왜 churchId가 필요한가
1. **데이터 격리**: 교회 A의 데이터가 교회 B에 노출되지 않게 강제
2. **쿼리 안전성**: 모든 리스트/통계/조회가 교회 컨텍스트로 제한
3. **확장성**: 구독/권한/감사로그를 교회 단위로 관리 가능
4. **운영 명확성**: 온보딩·결제·권한변경 이벤트를 교회 단위로 추적

---

## 4) 라우팅 울타리

### 홈페이지 영역
- /
- /features
- /pricing
- /contact
- /login
- /signup

### 앱 영역
- /app/[churchSlug]/dashboard
- /app/[churchSlug]/members
- /app/[churchSlug]/applications
- /app/[churchSlug]/notices

`lib/church-context.ts`의 `getChurchBySlug`로 church context를 추출하도록 준비.

---

## 5) 온보딩 흐름(초안)
회원가입 후:
1. **교회 생성** (새 워크스페이스)
2. 또는 **초대 수락** (기존 교회 멤버십 연결)

이번 단계에서는 UI/라우팅 자리 확보까지 수행.

---

## 6) 마이그레이션 주의사항
1. 기존 단일테넌트 데이터는 churchId가 없으므로 백필(backfill) 필요
2. relation이 복합 키(churchId 포함)로 바뀌어 기존 코드가 즉시 깨질 수 있음
3. 순서 권장:
   - 신규 Church 1개 생성
   - 기존 레코드 일괄 churchId 주입
   - unique 제약 전환
   - 애플리케이션 쿼리 churchId 스코프 전환

---

## 7) 기존 코드에서 깨질 가능성이 큰 지점
- 모든 prisma 쿼리(`findMany`, `count`, `update`)에서 churchId 누락
- 기존 upsert unique 키 이름 변경(예: district name, group key)
- seed 스크립트 및 테스트 fixture
- `/dashboard` 계열 구 라우트의 전역 데이터 접근 가정

---

## 8) 2차 적용 상태 (이번 작업)
1. 로그인 성공 시 사용자 첫 멤버십 교회로 `/app/[churchSlug]/dashboard` 리다이렉트
2. `/app` 엔트리 라우트 추가(현재 사용자 기준 churchSlug 자동 진입)
3. `lib/workspace-data.ts` 추가: dashboard/members/applications/notices 쿼리를 churchId로 스코프
4. `/app/[churchSlug]/*` 페이지들이 실제 churchId 스코프 데이터를 조회하도록 반영

## 9) 다음 단계 제안
1. current church 선택 UI(다중 멤버십 전환)
2. role 기반 권한 미들웨어(OWNER/ADMIN/PASTOR/LEADER/VIEWER)
3. 초대 토큰(Invitation) 모델 + 가입 승인 플로우
4. 결제 연동 전 Subscription 상태 전이 규칙 명문화
5. 기존 `/dashboard` 레거시 라우트를 `/app/[churchSlug]/*`로 통합
