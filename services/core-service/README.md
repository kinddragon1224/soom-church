# Core Service

`core-service`는 현재 Soom Church의 메인 제품 셸이다. 관리자 UI, 인증, 워크스페이스 컨텍스트, 그리고 대부분의 운영 기능이 이 서비스에 있다.

제품 범위와 상세 요구사항은 루트 문서를 기준으로 본다.

- 제품 요구사항: `../../PRD.md`
- 기능 상세: `../../docs/FEATURE_SPECS.md`
- 도메인 모델: `../../docs/DOMAIN_MODEL.md`
- API 계약: `../../docs/API_CONTRACTS.md`

## 역할

- Next.js 기반 관리자 UI
- 로그인/로그아웃
- 교회 워크스페이스 컨텍스트
- 플랫폼 관리자 기능
- 교인/교구/목장/공지/활동 로그
- 신청 도메인의 UI 셸 및 일부 폴백 로직

## 기술 스택

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL

## 로컬 실행

```bash
cp .env.example .env
npm install
npm run prisma:generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

기본 테스트 로그인:

- `admin@soom.church / demo-admin`

## 관련 문서

- 멀티테넌시 배경: `docs/MULTITENANT_FOUNDATION.md`
- 현재 프로젝트 상태: `../../PROJECT_WORKING_DOC.md`
