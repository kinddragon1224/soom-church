# SOOM Workspace Harness Adaptation — 2026-04-02

## 왜 이 작업을 했는가
`claw-code` 류 하네스에서 가져올 것은 전체 CLI/플러그인 시스템이 아니라,
**운영 구조를 registry + runtime 관점으로 분리하는 방식**이다.

숨에서는 이를 `workspace` 데모/제품 셸에 먼저 적용한다.

---

## 이번에 먼저 적용한 것
### 1. workspace registry 신설
파일: `lib/workspace-registry.ts`

한곳으로 모은 항목:
- navigation sections
- utility links
- pulse items
- route meta
- module cards
- control stats
- automation rail
- team rhythm
- next action map
- workspace home quick links
- workspace home today board

### 2. layout/page 하드코딩 제거
수정 파일:
- `app/workspace/layout.tsx`
- `app/workspace/page.tsx`

적용 효과:
- 화면 파일이 표현 레이어에 더 가까워짐
- 운영 정의/액션 정의를 별도 레이어에서 관리 가능
- 이후 실제 데이터 연결 시 교체 지점이 선명해짐

### 3. getter 도입
- `getWorkspaceRouteMeta(pathname)`
- `getWorkspaceNextActions(pathname)`

하드코딩된 분기 대신 registry 조회 구조로 바꿨다.

---

## 이번에 일부러 안 한 것
- plugin system
- hook runtime
- remote server
- CLI command system
- 다중 런타임 구조

숨은 웹 제품이므로 하네스 전체를 복제하지 않는다.
필요한 것만 제품 구조에 맞게 차용한다.

---

## 다음 적용 후보
### 우선순위 1
1. `workspace` 모듈 정의를 실제 데이터 fetch 레이어와 연결
2. 페이지별 `next actions`를 mock이 아닌 계산 함수로 전환
3. `people / notices / tasks / content` 공통 카드 스키마 통일

### 우선순위 2
4. workspace action registry 도입
   - 예: `followUp`, `sendNotice`, `approveContent`, `assignOwner`
5. action -> UI CTA -> 실제 route/API 연결 구조 만들기

### 우선순위 3
6. automation rule registry 도입
7. workspace health 계산 로직 분리
8. transcript / activity summary 레이어 정리

---

## 제품 관점 해석
숨에서 하네스식으로 가져갈 핵심은 5개다.

1. registry
2. runtime/data separation
3. action definition
4. route-aware state resolution
5. later: automation hooks

즉, 숨의 workspace는 단순 페이지 모음이 아니라
**운영 액션과 handoff가 보이는 제품 셸**로 가야 한다.
