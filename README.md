# 숨 (Sum) 관리자 대시보드 MVP

교회 교적/행정 운영 허브를 위한 Next.js + Prisma 기반 MVP.

## 기술 스택
- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui 스타일 컴포넌트 패턴
- PostgreSQL
- Prisma

## 실행 방법
```bash
cp .env.example .env
npm install
npm run prisma:generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

- 로그인: `admin@soom.church / demo-admin`

## 1차 구현 범위
- 로그인
- 관리자 공통 레이아웃 (좌측 사이드바 + 상단 헤더)
- 대시보드 홈 (핵심 KPI + 최근 데이터 + 빠른작업)
- 교인 목록/상세/등록/수정
- 교구/목장 관리
- 신청 관리
- 공지 관리
- 활동 로그

## 멀티테넌트 SaaS 1차 울타리
- Prisma 스키마에 Church / ChurchMembership / Subscription 추가
- 핵심 운영 엔티티 churchId 스코프 도입
- 홈페이지/앱 라우트 분리 기반 추가
- 상세 문서: `docs/MULTITENANT_FOUNDATION.md`

## 롤백 플랜
1. 배포 전 커밋 태그 생성: `git tag pre-mvp`.
2. 장애 발생 시 즉시 복구:
   - 코드: `git reset --hard pre-mvp`
   - DB: 직전 백업 복원 또는 `prisma migrate reset` 후 seed
3. 핫픽스 후 재배포, 로그 점검.

## 확장 가이드
- 후속 모듈(설교 요약/나눔지/TTS/커뮤니티)은 현재 `app/(admin)` 라우트 그룹 하위로 모듈 추가.
- 엔티티 확장은 `prisma/schema.prisma` 중심으로 관리.
