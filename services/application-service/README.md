# Application Service

Soom Church의 첫 번째 독립 도메인 서비스다.

## 책임

- 신청 폼 생성/조회
- 신청 접수
- 신청 상태 변경
- 교회 단위 신청 요약 조회

## 실행

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## 주요 엔드포인트

- `GET /health`
- `GET /forms`
- `POST /forms`
- `GET /applications`
- `GET /applications/summary`
- `POST /applications`
- `PATCH /applications/:id/status`
