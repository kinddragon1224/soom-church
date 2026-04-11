# Platform Admin Inventory — 2026-03-25

이 문서는 **플랫폼 관리자 기능이 한 곳에 집약되어 있는지**, **DB 연결이 실제로 매끄러운지**, **무엇이 아직 빠져 있는지**를 세션 전환 없이 이어가기 위해 정리한 기준 문서다.

---

## 1. 기준 구조

현재부터 플랫폼 관리자 관련 작업은 이 구조를 기준으로 본다.

### 플랫폼 관리자
- `/platform-admin`
- `/platform-admin/churches`
- `/platform-admin/churches/[id]`
- `/platform-admin/users`
- `/platform-admin/subscriptions`
- `/platform-admin/provisioning`
- `/guides` (관리자 블로그/콘텐츠 작성)

### 공개 블로그
- `/ai-guides`
- `/ai-guides/[slug]`

### 제외/후순위
- `/app/[churchSlug]/blog`
  - 현재는 축이 분산되므로 플랫폼 관리자 본체 정리 전에는 우선순위 낮춤

---

## 2. 현재 기능 inventory

아래 표기는 이렇게 본다.
- `정상`: 실제 데이터 읽기/기본 동선 가능
- `부분`: 읽기/화면은 있으나 액션/연결/완성도 부족
- `미구현`: 사실상 아직 없음

| 영역 | 경로 | 현재 상태 | DB 연결 | 비고 |
|---|---|---:|---:|---|
| 관리자 홈 | `/platform-admin` | 부분 | 정상 | 교회/구독/사용자/블로그 요약 수치, 주의 상태, 바로 처리할 작업 있음. 하지만 실제 운영 액션은 링크 중심 |
| 교회 목록 | `/platform-admin/churches` | 정상 | 정상 | Church + Subscription + ActivityLog(onboarding metadata) + member count를 함께 읽음 |
| 교회 상세 | `/platform-admin/churches/[id]` | 부분 | 정상 | 기본 정보/플랜/온보딩/최근 성도/최근 활동/운영 메모/우선순위 태그 수정 가능. 구독 상태 변경, 위험 태그, 세부 운영 액션은 아직 없음 |
| 사용자 목록 | `/platform-admin/users` | 정상 | 정상 | User + Membership + Church + onboarding metadata 읽기 가능 |
| 구독 목록 | `/platform-admin/subscriptions` | 부분 | 정상 | 조회만 가능. 상태 변경/플랜 변경/메모 없음 |
| 프로비저닝 | `/platform-admin/provisioning` | 부분 | 약함 | 화면은 있음. 실제 생성 action은 아직 없음 |
| 관리자 블로그 작성 | `/guides` | 부분 | 정상 | GuidePost 기반 작성/수정/발행 가능. 블록 에디터 1차, SEO, 대표 이미지 업로드 1차 포함 |
| 공개 블로그 목록 | `/ai-guides` | 정상 | 정상 | 발행된 GuidePost 목록 읽음 |
| 공개 블로그 상세 | `/ai-guides/[slug]` | 정상 | 정상 | 발행된 GuidePost 상세 읽음. 블록 렌더링 지원 |
| 관리자 로그인 | `/login` | 부분 | 부분 | `platform-admin@soom.church` 자동 보정으로 로그인 가능. 운영 계정 관리 체계는 아직 임시 성격 |
| 로그아웃 | 헤더 / 관리자 셸 | 정상 | 정상 | `/api/logout` 기반 |

---

## 3. 현재 DB 연결 상태

### 정상 연결된 것
#### 1) 관리자 홈 수치
`/platform-admin`
- `Church`
- `Subscription`
- `User`
- `GuidePost`
를 실제로 읽고 있음

#### 2) 교회 목록/상세
`/platform-admin/churches`
`/platform-admin/churches/[id]`
- `Church`
- `Subscription`
- `ChurchMembership`
- `Member`
- `ActivityLog`
를 함께 읽음
- `WORKSPACE_ONBOARDED` metadata를 파싱해서 온보딩 메타로 사용

#### 3) 사용자 목록
`/platform-admin/users`
- `User`
- `ChurchMembership`
- `Church`
- `ActivityLog`(온보딩 메타)
를 같이 읽음

#### 4) 블로그/공개 페이지
`/guides`
`/ai-guides`
- `GuidePost` 하나의 데이터 축으로 작성/수정/발행/공개 연결됨
- `published: true` 기준으로 공개 목록/상세 노출

---

## 4. 현재 불안정하거나 임시 처리인 부분

### A. 관리자 계정 보정
- `platform-admin@soom.church / 1234`
- 로그인 API에서 자동 보정하는 임시 방식 사용 중
- 즉, 현재는 “운영 계정 체계”라기보다 “접속 보정” 성격이 강함

### B. 블로그 경로 명칭 혼재
- 내부 모델은 아직 `GuidePost`
- 공개 경로는 아직 `/ai-guides`
- 관리자 화면 문구는 블로그로 바꾸는 중
- 즉 **기능은 하나로 연결되지만 네이밍은 아직 완전 통합 아님**

### C. 프로비저닝은 아직 설명 화면
- 새 교회 실제 생성 없음
- OWNER 생성 없음
- subscription 초기화 없음
- 초기 기본값 세팅 없음

### D. 구독은 조회만 가능
- 플랜 변경
- 상태 변경
- trial 종료일 조정
- 내부 메모
전부 아직 없음

---

## 5. 지금 당장 중요한 부족분

### 1순위 — 관리자 순기능 완성
#### 교회 운영 액션
- 구독 상태 변경
- 플랜 변경
- 운영 위험 태그
- 내부 메모 고도화
- 최근 활동/최근 로그인/최근 데이터 더 선명하게

### 2순위 — 실제 프로비저닝
- 교회 생성 폼
- 슬러그 중복 검증
- OWNER 계정 생성
- 기본 subscription 생성
- 초기 안내/기본 데이터 주입

### 3순위 — 블로그 축 정리
- 관리자 `/guides`는 사실상 블로그 관리자 역할 중
- 이걸 `/platform-admin/blog`로 흡수할지, `/guides` 유지 후 네이밍만 바꿀지 결정 필요
- 지금 단계에서는 **플랫폼 관리자에서 접근되는 하나의 콘텐츠 축**으로만 보면 됨

### 4순위 — 구독 관리 실동작
- 조회 페이지에서 액션 페이지로 승격 필요

---

## 6. 현재 판단

### 이미 “한 곳에 집약된 것”
- 교회 조회
- 사용자 조회
- 구독 조회
- 공개 블로그/관리자 블로그 연결

### 아직 “한 곳에 집약되지 않은 것”
- 새 교회 생성
- 구독 조정
- 블로그 명칭/라우트 완전 통합
- 운영 액션 전체

즉 지금 플랫폼 관리자는
**조회 콘솔은 됐고, 운영 액션 콘솔은 아직 진행 중**이다.

---

## 7. 세션 넘어가도 유지해야 할 결정

1. 플랫폼 관리자 작업은 **플랫폼 관리자 기준 정보 구조 먼저** 본다.
2. 화면 단위가 아니라 **관리자 순기능 / DB 연결 / 운영 액션** 기준으로 판단한다.
3. 블로그/콘텐츠는 일단 플랫폼 관리자 축에서 관리한다.
4. 워크스페이스 블로그는 지금 당장 섞지 않는다.
5. 다음 작업은 “보기 좋은 화면”보다 **구독/프로비저닝/교회 운영 액션** 쪽이 더 중요하다.

---

## 8. 다음 작업 제안 순서

1. `platform-admin/subscriptions`를 실동작 페이지로 승격
2. `platform-admin/provisioning`에 실제 생성 action 추가
3. `platform-admin/churches/[id]`에 구독/위험 상태 액션 추가
4. `/guides` → 관리자 블로그 관리라는 정보 구조 더 명확화

## 9. 2026-03-25 추가 교정

관리자/일반 사용자 진입 동선은 아래 규칙으로 고정한다.

- 플랫폼 관리자 계정은 공개 헤더에서 `관리자 콘솔` 버튼이 보인다.
- 플랫폼 관리자 계정이 `/app`로 들어가면 워크스페이스 선택 화면이 아니라 `/platform-admin`으로 리다이렉트된다.
- 로그인 페이지는 이미 로그인된 사용자를 다시 `/app`로 보내지 않고 `getPostLoginPath()` 기준 경로로 보낸다.
- 일반 사용자만 `/app` 워크스페이스 선택/진입 흐름을 사용한다.

즉, 관리자와 일반 사용자 동선은 이제 분리된 것으로 간주하고 이어서 작업한다.

---

## 9. 한 줄 결론

지금 플랫폼 관리자 페이지는 **실제 DB 기반 조회 콘솔로는 작동**하고 있다.
하지만 **운영자가 실제로 조치하는 액션(생성/변경/관리)**은 아직 부족하다.
앞으로는 관리자 화면을 “예쁘게”가 아니라 **운영 기능 완성도** 기준으로 밀어야 한다.
