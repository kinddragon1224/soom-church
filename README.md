# Soom Church

교회 운영 플랫폼을 위한 워크스페이스다. 현재 제품 현실은 `core-service` 중심의 관리자 운영 허브이며, `application-service`가 첫 번째 분리 도메인으로 이동 중이다.

## 현재 상태

- 제품 중심: 교인/교구/목장/신청/공지/활동 로그를 다루는 관리자 웹
- 아키텍처 상태: 모놀리스에서 서비스 분리로 넘어가는 과도기
- 구현 상태: `core-service`가 대부분의 기능을 보유, 나머지 서비스는 주로 스켈레톤

## 빠른 시작

```bash
cp .env.example .env
npm install
npm run dev
```

주요 포트:

- Gateway: `8081`
- Core: `3002`
- Application: `3004`
- PostgreSQL: `5434`
- Redis: `6379`

## 워크스페이스 구조

```text
/
├── docker/                      # gateway, DB 초기화, 개발용 compose
├── docker-compose.yml           # 현재 실행 기준 compose
├── packages/                    # contracts, events, service-client, shared
├── services/
│   ├── core-service/            # Next.js UI 셸, 인증, 워크스페이스 허브
│   ├── application-service/     # 신청 도메인 API
│   ├── content-service/         # 스켈레톤
│   ├── notification-service/    # 스켈레톤
│   ├── ai-service/              # 스켈레톤
│   └── community-service/       # 스켈레톤
├── docs/                        # 실행 문서 세트
├── PRD.md                       # 제품 요구사항 원문
├── ARCHITECTURE.md              # 시스템 설계 기준
└── PROJECT_WORKING_DOC.md       # 현재 상태, 진행 기록, 남은 일
```

## 문서 맵

- 제품 요구사항: [PRD.md](./PRD.md)
- 시스템 구조: [ARCHITECTURE.md](./ARCHITECTURE.md)
- 프로젝트 현황: [PROJECT_WORKING_DOC.md](./PROJECT_WORKING_DOC.md)
- 기능 상세: [docs/FEATURE_SPECS.md](./docs/FEATURE_SPECS.md)
- 도메인 모델: [docs/DOMAIN_MODEL.md](./docs/DOMAIN_MODEL.md)
- API 계약: [docs/API_CONTRACTS.md](./docs/API_CONTRACTS.md)
- 운영 런북: [docs/OPERATIONS_RUNBOOK.md](./docs/OPERATIONS_RUNBOOK.md)
- 런칭 체크리스트: [docs/LAUNCH_CHECKLIST.md](./docs/LAUNCH_CHECKLIST.md)

## 개발 명령

```bash
npm run dev
npm run dev:detach
npm run down
npm run logs
npm run build
npm run typecheck
```
