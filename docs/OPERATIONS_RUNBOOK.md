# Operations Runbook

- Last updated: 2026-03-12
- Scope: local development, staging readiness, launch operations baseline

## 목적

이 문서는 Soom Church를 실행, 점검, 장애 대응하는 최소 운영 기준을 정의한다.

## 서비스와 포트

- Gateway: `8081`
- Core: `3002`
- Content: `3003`
- Application: `3004`
- Notification: `3005`
- Community: `3006`
- AI: `3007`
- PostgreSQL: `5434`
- Redis: `6379`

## 필수 환경 변수

### 루트 `.env`

- `APPLICATION_SERVICE_URL`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`
- `ELEVENLABS_API_KEY`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

### `services/core-service/.env`

- `DATABASE_URL`
- `APPLICATION_SERVICE_URL`
- `JWT_SECRET`

## 로컬 부팅

### 전체 워크스페이스

```bash
cp .env.example .env
npm install
npm run dev
```

### core-service 단독 실행

```bash
cd services/core-service
cp .env.example .env
npm install
npm run prisma:generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

### application-service 단독 실행

```bash
cd services/application-service
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## 기본 운영 점검

### 애플리케이션 점검

- Gateway가 `8081`에서 응답하는지 확인
- Core UI가 로드되는지 확인
- `GET /health`로 application-service 응답 확인
- 로그인 후 대시보드 진입이 가능한지 확인

### 데이터 점검

- Prisma migration이 반영됐는지 확인
- seed 데이터가 로그인과 기본 화면 검증에 충분한지 확인
- 교회 스코프 데이터가 섞이지 않는지 확인

## 배포 전 점검

- `npm run build`
- `npm run typecheck`
- core-service 환경 변수 확인
- application-service 환경 변수 확인
- DB 백업 또는 복구 지점 확보
- 롤백 가능한 배포 아티팩트 보관

## 런칭 당일 운영 루틴

1. 최신 배포 아티팩트를 기준 환경에 반영한다.
2. DB migration 적용 여부를 확인한다.
3. Core와 Application 서비스 헬스 체크를 통과시킨다.
4. 관리자 테스트 계정으로 로그인 검증을 수행한다.
5. 교인 목록, 신청 목록, 공지 목록을 최소 샘플 데이터로 확인한다.
6. 에러 로그와 컨테이너 로그를 1차 관찰한다.

## 장애 대응 우선순위

### P1

- 로그인 불가
- 전체 대시보드 진입 불가
- 신청 조회/상태 변경 불가
- DB 연결 실패

### P2

- 특정 관리 화면 오류
- 일부 집계 수치 불일치
- 공지 작성 또는 조회 실패

### P3

- 비핵심 UI 문제
- 향후 모듈 스켈레톤 관련 오류

## 장애 대응 절차

1. 장애 범위를 `core-service`, `application-service`, DB, gateway 중 어디인지 분리한다.
2. 최근 배포 변경점과 migration 적용 여부를 확인한다.
3. `application-service`는 `/health`와 신청 목록 조회로 상태를 확인한다.
4. `core-service`는 로그인, 대시보드, 핵심 목록 화면으로 영향도를 확인한다.
5. 데이터 손상 가능성이 있으면 즉시 쓰기 작업을 제한한다.
6. 필요 시 직전 안정 배포본으로 롤백하고 DB는 백업 기준으로 복구한다.

## 롤백 원칙

- 코드 롤백과 DB 롤백은 분리해서 판단한다.
- migration이 비가역적일 수 있으므로 DB 백업 없이 코드만 되돌리지 않는다.
- 로컬 개발용 강제 reset 절차를 운영 환경 표준으로 사용하지 않는다.

## 관찰 포인트

- Docker Compose 로그
- Core 런타임 에러
- Application service validation 오류
- Prisma 연결 오류
- 로그인 실패율

## 운영상 남은 과제

- 에러 응답 표준화
- 헬스 체크 범위 확대
- structured logging 정비
- staging 환경과 production 체크리스트 분리
