# Soom Church 프로젝트 운영 문서

작성 기준일: 2026-03-12

## 1. 이 문서의 목적

이 문서는 아래 두 가지를 한 번에 해결하기 위한 기준 문서다.

1. 현재 프로젝트 상태를 빠르게 이해한다.
2. 앞으로 진행한 작업과 남은 작업을 같은 문서에 계속 기록한다.

이 문서는 "현재 상태와 작업 기록" 문서다. 제품 요구사항은 `PRD.md`, 시스템 설계는 `ARCHITECTURE.md`, 실행 기준은 `docs/` 아래 문서를 우선 기준으로 본다.

### 현재 기준 문서

- 제품 요구사항: `PRD.md`
- 시스템 구조: `ARCHITECTURE.md`
- 기능 상세: `docs/FEATURE_SPECS.md`
- 도메인 모델: `docs/DOMAIN_MODEL.md`
- API 계약: `docs/API_CONTRACTS.md`
- 운영 런북: `docs/OPERATIONS_RUNBOOK.md`
- 런칭 체크리스트: `docs/LAUNCH_CHECKLIST.md`

---

## 2. 프로젝트 한 줄 요약

`Soom Church`는 교회 운영 플랫폼이며, 원래 하나의 Next.js 기반 모놀리식 구조로 시작했지만, 현재는 마이크로서비스 구조로 단계적으로 전환하는 중이다.

현재 기준으로는:

- `core-service`가 메인 UI 셸과 인증/워크스페이스 허브 역할을 한다.
- `application-service`가 첫 번째로 분리 준비된 독립 도메인 서비스다.
- 나머지 서비스는 디렉터리와 Docker 연결은 있으나 아직 기능 구현은 거의 없는 스켈레톤 상태다.

---

## 3. 현재 구조 요약

### 루트 워크스페이스

- 루트는 npm workspace 기준이다.
- 주요 명령:
  - `npm install`
  - `npm run dev`
  - `npm run build`
  - `npm run typecheck`

### 디렉터리 구조

```text
/
├── docker/                      # gateway, DB 초기화, 개발용 compose 관련 파일
├── docker-compose.yml           # 현재 실행 기준 compose
├── packages/
│   ├── contracts/               # DTO, zod schema, 공통 타입
│   ├── events/                  # 이벤트 이름/타입 초안
│   ├── service-client/          # 서비스 간 HTTP 호출 유틸
│   └── shared/                  # 기존 공통 유틸
├── services/
│   ├── core-service/            # Next.js UI 셸, 인증, 멀티테넌시 허브
│   ├── application-service/     # 신청 도메인 API
│   ├── content-service/         # 스켈레톤
│   ├── notification-service/    # 스켈레톤
│   ├── ai-service/              # 스켈레톤
│   └── community-service/       # 스켈레톤
└── PROJECT_WORKING_DOC.md       # 이 문서
```

---

## 4. 서비스별 현재 상태

### `core-service`

역할:

- 메인 관리자 UI
- 로그인/로그아웃
- 사용자/교회/워크스페이스 컨텍스트
- 플랫폼 관리자 기능
- 교인/교구/목장/공지 등 기존 핵심 기능

현재 상태:

- 실제 제품 기능이 가장 많이 들어 있는 서비스다.
- 아직 완전한 마이크로서비스 허브는 아니고, 기존 모놀리스의 대부분이 이 안에 남아 있다.
- 신청 도메인 일부 조회/변경 경로는 `application-service` 호출로 우선 전환되었다.
- 단, 초기 전환 안정성을 위해 로컬 Prisma 폴백이 남아 있다.

### `application-service`

역할:

- 신청 폼 관리
- 신청 접수
- 신청 상태 변경
- 신청 요약 조회

현재 상태:

- Express 기반 최소 실행 골격이 있다.
- 독립 Prisma schema가 있다.
- 현재 제공 엔드포인트:
  - `GET /health`
  - `GET /forms`
  - `POST /forms`
  - `GET /applications`
  - `GET /applications/summary`
  - `POST /applications`
  - `PATCH /applications/:id/status`

### `content-service`

역할 예정:

- 설교/콘텐츠
- 요약/쇼츠/TTS 연계

현재 상태:

- 패키지/도커 초안만 있고 실질 로직은 거의 없다.

### `notification-service`

역할 예정:

- 이메일, SMS, 푸시, 예약 발송

현재 상태:

- 스켈레톤 상태다.

### `ai-service`

역할 예정:

- LLM 통합 레이어
- 모델 라우팅/프롬프트 래핑

현재 상태:

- 스켈레톤 상태다.

### `community-service`

역할 예정:

- 소모임, 채팅, 게시판, 피드

현재 상태:

- 스켈레톤 상태다.

---

## 5. 공통 패키지 역할

### `@soom/contracts`

용도:

- 서비스 간 요청/응답 DTO 정의
- `zod` 기반 입력 검증
- enum과 공통 타입 정리

현재는 신청 도메인 중심 계약이 들어 있다.

### `@soom/service-client`

용도:

- 내부 서비스 HTTP 호출 공통 유틸
- timeout, JSON 요청/응답 처리

### `@soom/events`

용도:

- 향후 이벤트 브로커 연결 시 사용할 이벤트 이름/타입 기준

현재는 초안 수준이며 실제 브로커 연결은 아직 없다.

### `@soom/shared`

용도:

- 기존 공통 유틸

현재는 역할이 작고, 앞으로 필요한 경우 `contracts`, `events`, `service-client` 중심으로 더 분리해서 사용할 가능성이 높다.

---

## 6. 현재 아키텍처 판단

현재 프로젝트는 문서와 폴더 구조만 보면 마이크로서비스처럼 보이지만, 실제로는 아래 상태에 가깝다.

- 배포 구조: 마이크로서비스 방향
- 코드 구조: 부분 분리 시작
- 데이터 구조: 아직 완전 분리 아님
- 운영 구조: 초기 준비 단계

즉, 지금은 "완성된 마이크로서비스"가 아니라 "스트랭글러 패턴으로 모놀리스를 분해하는 첫 단계"라고 이해하는 것이 맞다.

---

## 7. 현재 데이터 경계 상태

현재 중요한 사실:

- `core-service` Prisma schema 안에 아직 신청 모델이 남아 있다.
- `application-service`에도 신청 도메인용 독립 Prisma schema가 생겼다.
- 즉, 지금은 완전 이관이 아니라 "새 경로를 먼저 만들고 점진적으로 옮기는 중간 상태"다.

이 상태를 유지하는 이유:

- UI를 한 번에 깨지지 않게 유지하기 위해
- 새로운 서비스 API를 먼저 안정화하기 위해
- 이후 DB 분리와 폴백 제거를 단계적으로 하기 위해

---

## 8. 로컬 실행 기준

### 기본 실행 순서

```bash
cp .env.example .env
npm install
npm run dev
```

### 주요 포트

| 이름 | 포트 | 비고 |
|------|------|------|
| Gateway | 8081 | 외부 진입점 |
| Core | 3002 | 메인 UI 셸 |
| Application | 3004 | 신청 도메인 서비스 |
| Content | 3003 | 스켈레톤 |
| Notification | 3005 | 스켈레톤 |
| Community | 3006 | 스켈레톤 |
| AI | 3007 | 스켈레톤 |
| PostgreSQL | 5434 | 개발 DB |
| Redis | 6379 | 캐시/큐 |

### 환경 변수에서 지금 중요한 것

- `APPLICATION_SERVICE_URL`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`
- `ELEVENLABS_API_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

---

## 9. 이번 단계에서 이미 끝난 일

- 루트 npm workspace 정리
- 공통 계약 패키지 추가
- 서비스 클라이언트 패키지 추가
- 이벤트 패키지 초안 추가
- `application-service` 최소 API 골격 추가
- `application-service` 독립 Prisma schema 추가
- `core-service`의 신청 화면 일부를 서비스 클라이언트 기반으로 전환
- Docker Compose 기준 정리
- `.env.example`와 README 갱신
- 빌드/타입체크 검증 완료

---

## 10. 다음 단계 우선순위

아래 순서대로 가는 것이 가장 안전하다.

### 1순위: 신청 도메인 완전 이관

- `core-service` 안의 신청 관련 직접 Prisma 접근 제거
- `application-service`가 신청 관련 읽기/쓰기의 단일 소스가 되도록 정리
- 폴백 제거 시점 결정

### 2순위: 데이터 마이그레이션 정리

- `core-service` DB의 신청 데이터 -> `application-service` DB로 이관 전략 수립
- 초기 데이터 마이그레이션 스크립트 작성
- seed 전략 분리

### 3순위: 서비스 간 인증/권한 전달 정리

- 현재는 `core-service` 중심 인증 구조
- 이후 다른 서비스가 사용자/교회 컨텍스트를 어떻게 검증할지 정해야 함
- 최소 요구:
  - 사용자 식별자
  - 교회 식별자
  - 역할 또는 권한 스코프

### 4순위: 나머지 도메인 분리 후보 선정

추천 순서:

1. `notification-service`
2. `content-service`
3. `ai-service`
4. `community-service`

이 순서를 추천하는 이유:

- 알림은 이벤트 기반 분리가 쉬운 편이다.
- 콘텐츠와 AI는 외부 API/연산 부하 분리 가치가 크다.
- 커뮤니티는 실시간 요구사항이 있어 설계 비용이 더 크다.

---

## 11. 진행 체크리스트

### 기반 구조

- [x] 루트 workspace 정리
- [x] 공통 계약 패키지 추가
- [x] 서비스 호출 유틸 추가
- [x] application-service 기본 서버 추가
- [x] application-service 독립 Prisma schema 추가
- [ ] 서비스별 공통 로깅 규칙 정리
- [ ] 서비스별 헬스체크/레디니스 기준 통일

### 신청 서비스 분리

- [x] 신청 목록 조회 경로 분리 시작
- [x] 신청 상태 변경 경로 분리 시작
- [ ] 신청 생성 UI를 application-service 기준으로 전환
- [ ] 신청 폼 관리 UI를 application-service 기준으로 전환
- [ ] core-service 내부 신청 직접 접근 제거
- [ ] 신청 데이터 이관 완료
- [ ] Prisma 폴백 제거

### 플랫폼 공통

- [ ] 인증 토큰 또는 내부 서비스 인증 방식 정의
- [ ] 이벤트 발행/구독 기준 확정
- [ ] 공통 에러 응답 형식 전 서비스 통일
- [ ] 관측성 기준 정리

### 후속 서비스

- [ ] notification-service 실제 구현 시작
- [ ] content-service 실제 구현 시작
- [ ] ai-service 실제 구현 시작
- [ ] community-service 실제 구현 시작

---

## 12. 작업 원칙

앞으로 작업할 때 아래 원칙을 유지한다.

1. 한 번에 전체 분리하지 않는다.
2. UI는 당분간 `core-service` 단일 셸을 유지한다.
3. 새 도메인 서비스는 먼저 API를 만들고, 그다음 UI 연결을 옮긴다.
4. 데이터 분리는 코드 경계가 안정된 뒤에 한다.
5. 폴백은 임시 수단으로만 두고, 제거 시점을 문서에 명시한다.
6. 새로 만드는 서비스 간 통신 계약은 `packages/contracts` 기준으로 관리한다.

---

## 13. 진행 기록 규칙

앞으로 작업이 끝날 때마다 아래 형식으로 이 문서 맨 아래 로그에 추가한다.

기록 원칙:

- 날짜를 반드시 적는다.
- 무엇을 바꿨는지보다 왜 바꿨는지를 같이 적는다.
- 다음 작업 1개를 반드시 적는다.
- 문제가 있으면 "리스크" 항목에 적는다.

기록 템플릿:

```text
### YYYY-MM-DD

- 작업:
- 이유:
- 결과:
- 다음 작업:
- 리스크:
```

---

## 14. 작업 로그

### 2026-03-12

- 작업:
  - 루트 workspace 정리
  - `packages/contracts`, `packages/events`, `packages/service-client` 추가
  - `application-service` 최소 실행 골격 추가
  - `core-service` 신청 조회/상태 변경 일부를 서비스 클라이언트 기반으로 전환
  - Docker Compose, env, README 정리
- 이유:
  - 모놀리스에서 바로 완전 분리하지 않고, 첫 도메인 서비스를 안정적으로 떼어내기 위한 기반이 필요했음
- 결과:
  - 프로젝트는 이제 "마이크로서비스 개발을 시작할 수 있는 상태"까지 정리됨
  - 다만 신청 도메인의 완전 분리는 아직 끝나지 않았고 폴백이 남아 있음
- 다음 작업:
  - `core-service` 안의 신청 직접 접근 지점을 더 줄이고, 신청 생성/폼 관리도 `application-service` 기준으로 옮기기
- 리스크:
  - 현재는 `core-service`와 `application-service`에 신청 모델이 동시에 존재하는 과도기 상태라 데이터 정합성 관리가 필요함

### 2026-03-12

- 작업:
  - 루트에 `PRD.md` 추가
  - `README.md`, `ARCHITECTURE.md`, `services/core-service/docs/PRODUCT_SPEC.md` 역할 재정리
  - `docs/FEATURE_SPECS.md`, `docs/DOMAIN_MODEL.md`, `docs/API_CONTRACTS.md`, `docs/OPERATIONS_RUNBOOK.md`, `docs/LAUNCH_CHECKLIST.md` 추가
  - `PROJECT_WORKING_DOC.md`에 기준 문서 체계 반영
- 이유:
  - PRD만으로는 구현과 런칭 준비까지 바로 연결되기 어려워, 실행 문서 세트를 추가해 Ralph loop에 넣을 수 있는 문서 구조가 필요했음
  - 기존 문서들 사이의 제품 범위와 구조 설명 중복을 줄이고, 어떤 문서가 원문인지 명확히 할 필요가 있었음
- 결과:
  - 제품 요구사항, 시스템 설계, 현재 상태, 실행 문서가 역할별로 분리됨
  - 현재 코드베이스 기준으로 기능 상세, 도메인 모델, API 계약, 운영 기준, 런칭 체크리스트가 정리됨
  - `PRODUCT_SPEC.md`는 독립 원문이 아니라 `PRD.md`를 가리키는 요약 문서로 축소됨
- 다음 작업:
  - `LAUNCH_CHECKLIST.md` 기준으로 실제 코드 갭을 이슈 단위로 분해하기
- 리스크:
  - `core-service`의 멤버/공지/활동 로그는 아직 내부 구현 중심이라 외부 API 계약 수준으로는 문서화가 덜 되어 있음
  - 신청 도메인은 여전히 서비스 분리 중간 상태라 문서 기준과 실제 데이터 경계가 완전히 일치하지 않을 수 있음

---

## 15. 이 문서를 어떻게 써야 하는가

이 문서는 앞으로 아래 순서로 사용하면 된다.

1. 작업 시작 전:
   - `10. 다음 단계 우선순위`와 `11. 진행 체크리스트`를 본다.
2. 작업 중:
   - 구조가 바뀌면 `3~8번` 내용을 갱신한다.
3. 작업 끝난 후:
   - `14. 작업 로그`에 한 줄이 아니라 실제 판단과 결과를 기록한다.

이 문서가 최신이면, 새로운 사람이 와도 현재 프로젝트를 빠르게 이해할 수 있어야 한다.
