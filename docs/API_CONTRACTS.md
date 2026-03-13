# API Contracts

- Last updated: 2026-03-12
- Primary references:
  - `packages/contracts/src/index.ts`
  - `services/application-service/src/routes/forms.ts`
  - `services/application-service/src/routes/applications.ts`

## 목적

이 문서는 현재 확정된 서비스 계약을 정리한다. 현재 시점에서 외부 계약으로 명확히 문서화할 수 있는 것은 `application-service` API다.

## Contract Status

- Stable now: `application-service`
- Internal only for now: 대부분의 `core-service` 기능
- Future: content, notification, ai, community service APIs

## Common Conventions

- Content type: `application/json`
- Validation: `@soom/contracts`의 `zod` 스키마 기준
- Tenant scope: 필요한 경우 `churchId`를 query 또는 body에 포함
- Timestamp fields: ISO 8601 datetime string

## Health

### `GET /health`

목적:

- 서비스 프로세스가 응답 가능한지 확인

응답 예시:

```json
{
  "service": "application-service",
  "status": "ok",
  "timestamp": "2026-03-12T00:00:00.000Z"
}
```

## Application Forms

### `GET /forms`

목적:

- 신청 폼 목록 조회

Query:

- `churchId?: string`
- `activeOnly?: boolean`

응답 타입:

- `ApplicationFormDto[]`

`ApplicationFormDto`

```json
{
  "id": "string",
  "churchId": "string | null",
  "title": "string",
  "description": "string | null",
  "isActive": true,
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

### `POST /forms`

목적:

- 신청 폼 생성

Request body:

```json
{
  "churchId": "string | null",
  "title": "Newcomer Registration",
  "description": "string | null",
  "isActive": true
}
```

응답 타입:

- `ApplicationFormDto`

## Applications

### `GET /applications`

목적:

- 신청 목록 조회

Query:

- `churchId?: string`
- `status?: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED"`
- `limit?: number` with max `100`

응답 타입:

- `ApplicationRecordDto[]`

`ApplicationRecordDto`

```json
{
  "id": "string",
  "churchId": "string | null",
  "formId": "string",
  "formTitle": "string",
  "applicantName": "string",
  "applicantPhone": "string | null",
  "payloadJson": "string | null",
  "status": "PENDING",
  "assignedToId": "string | null",
  "createdAt": "ISO datetime",
  "updatedAt": "ISO datetime"
}
```

### `GET /applications/summary`

목적:

- 신청 요약과 최근 신청 조회

Query:

- `churchId?: string`
- `limit?: number`

응답 타입:

```json
{
  "pendingCount": 3,
  "recentApplications": []
}
```

### `POST /applications`

목적:

- 신청 생성

Request body:

```json
{
  "churchId": "string | null",
  "formId": "string",
  "applicantName": "string",
  "applicantPhone": "string | null",
  "payloadJson": "string | null",
  "assignedToId": "string | null"
}
```

응답 타입:

- `ApplicationRecordDto`

### `PATCH /applications/:id/status`

목적:

- 신청 상태 변경

Request body:

```json
{
  "status": "IN_REVIEW"
}
```

응답 타입:

- `ApplicationRecordDto`

## Error Behavior

- 잘못된 입력은 `zod` 검증 실패로 에러가 반환된다.
- 존재하지 않는 리소스 갱신 시 ORM 레벨 에러가 발생할 수 있다.
- 현재 공통 에러 포맷은 별도 표준화가 덜 되어 있으므로, 런칭 전 정리 대상이다.

## Core-Service Interface Note

현재 `core-service`는 주로 서버 컴포넌트, 페이지 로직, Prisma 접근, 서비스 클라이언트 호출의 조합으로 동작한다. 따라서 아래 기능은 사용자에게 제공되지만 아직 별도 공개 API 계약 문서가 확정된 상태는 아니다.

- 멤버 관리
- 공지 관리
- 활동 로그 조회
- 플랫폼 관리자 기능

런칭 전 선택지:

- 선택지 A: `core-service`는 내부 앱 셸로 유지하고 공개 API 문서화를 미룬다.
- 선택지 B: 런칭 범위 기능에 대해 점진적으로 HTTP 계약을 도출한다.

현재 프로젝트 상태에서는 선택지 A가 더 현실적이다.
