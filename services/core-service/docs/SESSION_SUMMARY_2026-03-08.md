# soom-church 작업 기록 (2026-03-08)

## 1) 오늘의 핵심 목표
- 숨을 단일 교회 데모 앱이 아닌 **교회 운영 SaaS 플랫폼**으로 정렬
- 워크스페이스 접근/로그인 흐름 안정화
- 플랫폼 관리자와 워크스페이스 사용자 동선 분리
- 공홈을 브랜드형 랜딩으로 고도화
- 네이밍 원칙 확정: **숨=플랫폼, 대흥교회 이음두빛=데모 워크스페이스**

---

## 2) 주요 결정사항

1. 제품 정체성
- 숨(SOOM)은 플랫폼 브랜드
- 교회는 숨 안의 워크스페이스 인스턴스
- 데모 교회는 `대흥교회 이음두빛`으로 통일

2. 완료 기준
- 작업 완료는 반드시 **빌드 확인 + 커밋 + 푸시** (필요 시 배포까지)

3. 미구현 기능 원칙
- 동작하는 척 금지
- `준비 중`, `곧 연결` 등 상태 명시

4. 접근 가드 원칙
- `/app/[churchSlug]` 이하는 로그인 + current user + membership 검증
- 실패 시 null/404보다 안내+다음 행동 제공

---

## 3) 구조/기능 작업 요약

## A. SaaS 구조/온보딩 안정화
- `/signup`을 안내문 수준에서 온보딩 시작 화면으로 개선
- `/app` 진입 시 교회가 없으면 다음 액션(교회 만들기/초대/데모)을 제시
- 워크스페이스 접근 가드 유틸 분리:
  - `getCurrentUserOrRedirect()`
  - `getAccessibleChurchBySlug()`
  - `requireWorkspaceMembership()`

## B. 멀티테넌트 기반 강화
- Prisma에 Church / ChurchMembership / Subscription 등 SaaS 모델 반영
- 주요 엔티티 churchId 스코프 기반으로 조회하도록 전환 시작

## C. 로그인 동선 분리
- 사용자 로그인과 플랫폼 관리자 로그인 분기
- 플랫폼 관리자 전용 영역 추가:
  - `/platform-admin`
  - `/platform-admin/churches`
  - `/platform-admin/users`
  - `/platform-admin/subscriptions`
  - `/platform-admin/provisioning`
- 관리자 페이지에서도 홈/워크스페이스로 돌아가는 링크 추가

## D. 데모 교회 네이밍 통일
- 데모 church slug/name 통일:
  - slug: `daehung-ieum-dubit`
  - name: `대흥교회 이음두빛`
- `demo-soom` 레거시 명칭 교정 로직 seed에 반영

## E. 공홈 리디자인
- 카드 나열형에서 브랜드 랜딩형으로 전환
- 구조:
  1) 미니멀 헤더
  2) 대형 히어로(검은 배경, 흰 타이포, 큰 카피)
  3) 브랜드 메시지 섹션
  4) 플랫폼 구조 섹션
  5) 모듈 섹션
  6) 하단 CTA
- 로그인 상태면 홈 CTA를 세션 상태에 맞게 동적으로 변경

## F. 성능/운영 보강
- 워크스페이스 데이터에 캐시(`unstable_cache`) 적용
- 일부 라우트에 리전 선호(`sin1`) 설정
- 빌드 시 Prisma Client 생성 보장(`prisma generate && next build`)

---

## 4) 디자인 관련 이슈/교훈

### 로고 이슈
- SVG에 `<text>`를 사용하면 폰트 렌더링 차이로 원본 형태가 계속 달라짐
- 배경 포함 이미지(네모 캔버스)는 헤더 로고에서 작고 어색하게 보임

### 교훈
- 로고는 최종적으로 **투명 PNG** 또는 **아웃라인 path-only SVG**로 고정해야 안정적
- 텍스트 기반 SVG 로고는 환경 차이로 재현성이 낮음

---

## 5) 사용자 피드백 기반 반영 포인트
- 홈에서 데모 워크스페이스 직접 노출 축소/제거
- 플랫폼 관리자 화면에서 홈 복귀 동선 추가
- 로그인 유지 상태에서 홈으로 돌아가도 세션 컨텍스트가 유지되도록 조정

---

## 6) 현재 남은 과제
1. 온보딩 실동작 연결 (교회 생성/초대 수락)
2. 다중 워크스페이스 선택 UX
3. RBAC 세분화(OWNER/ADMIN/LEADER/VIEWER)
4. 레거시 단일 관리자 경로 정리(리다이렉트/축소)
5. 로고 에셋 최종본(path-only SVG 또는 투명 PNG) 확정 후 1회 고정 배포

---

## 7) 다음 협업 제안 (재성 + Arti)
- 짧은 스프린트 단위로 진행:
  - Sprint 1: 온보딩 실동작(교회 생성/초대)
  - Sprint 2: 권한/워크스페이스 선택
  - Sprint 3: 관리자 콘솔 실기능(교회/구독 조작)
- PR마다 고정 체크:
  - 숨=플랫폼 / 교회=워크스페이스 위계 유지
  - churchId 스코프 누락 여부
  - 모바일 레이아웃 회귀 여부
  - 미구현 기능 상태 표기 적절성

---

## 8) 참고
- 상세 인수인계 문서:
  - `docs/HANDOFF_FOR_JAESUNG_OPENCLAW_ARTI.md`
  - `docs/HANDOFF_FOR_JAESUNG_OPENCLAW_ARTI.txt`
