# Domain Model

- Last updated: 2026-03-12
- Primary schema references:
  - `services/core-service/prisma/schema.prisma`
  - `services/application-service/prisma/schema.prisma`

## 목적

이 문서는 현재 제품 MVP의 핵심 엔티티, 관계, 데이터 경계, 이관 중인 영역을 정리한다.

## 데이터 경계 요약

- 운영 핵심 엔티티는 현재 `core-service` Prisma schema에 존재한다.
- 신청 도메인은 `core-service`와 `application-service` 양쪽에 스키마가 존재한다.
- 따라서 신청 관련 데이터는 완전 분리 전의 중간 상태로 본다.

## Core Tenant and Access Entities

### Church

교회 워크스페이스의 최상위 엔티티다.

주요 필드:

- `id`
- `slug`
- `name`
- `timezone`
- `isActive`

연결 관계:

- memberships
- subscriptions
- roles
- households
- districts
- groups
- members
- applicationForms
- applications
- notices
- activityLogs

### User

플랫폼 사용자 엔티티다.

주요 필드:

- `id`
- `email`
- `passwordHash`
- `name`
- `isActive`

연결 관계:

- church memberships
- authored notices
- assigned applications
- activity logs

### ChurchMembership

사용자와 교회의 연결 엔티티다.

주요 필드:

- `userId`
- `churchId`
- `role`
- `roleId`
- `isActive`
- `joinedAt`

역할 enum:

- `OWNER`
- `ADMIN`
- `PASTOR`
- `LEADER`
- `VIEWER`

### Role

교회별 커스텀 역할 확장을 위한 엔티티다.

주요 필드:

- `churchId`
- `key`
- `name`

### Subscription

워크스페이스 구독 상태를 저장한다.

주요 필드:

- `churchId`
- `plan`
- `status`
- `trialEndsAt`
- `currentPeriodEnd`

플랜 enum:

- `FREE`
- `STARTER`
- `GROWTH`
- `ENTERPRISE`

상태 enum:

- `TRIALING`
- `ACTIVE`
- `PAST_DUE`
- `CANCELED`

## Member Operations Entities

### Household

가족 단위 교인 묶음이다.

주요 필드:

- `churchId`
- `name`
- `address`
- `notes`

### District

교구 엔티티다.

주요 필드:

- `churchId`
- `name`
- `leadName`

### Group

목장 또는 소그룹 엔티티다.

주요 필드:

- `churchId`
- `districtId`
- `name`

### Member

운영 허브의 핵심 레코드다.

주요 필드:

- `churchId`
- `name`
- `gender`
- `birthDate`
- `phone`
- `email`
- `address`
- `householdId`
- `districtId`
- `groupId`
- `registeredAt`
- `position`
- `statusTag`
- `requiresFollowUp`
- `notes`
- `isDeleted`

성별 enum:

- `MALE`
- `FEMALE`
- `OTHER`

## Application Domain Entities

### ApplicationForm

신청서 템플릿이다.

주요 필드:

- `churchId`
- `title`
- `description`
- `isActive`

### Application

실제 신청 레코드다.

주요 필드:

- `churchId`
- `formId`
- `applicantName`
- `applicantPhone`
- `payloadJson`
- `status`
- `assignedToId`

상태 enum:

- `PENDING`
- `IN_REVIEW`
- `APPROVED`
- `REJECTED`

## Communication and Audit Entities

### Notice

운영 공지 엔티티다.

주요 필드:

- `churchId`
- `title`
- `content`
- `pinned`
- `authorId`

### ActivityLog

행동 추적용 감사 로그다.

주요 필드:

- `churchId`
- `actorId`
- `action`
- `targetType`
- `targetId`
- `memberId`
- `metadata`

## 주요 관계

- `Church` 1:N `ChurchMembership`
- `Church` 1:N `Subscription`
- `Church` 1:N `District`
- `District` 1:N `Group`
- `Church` 1:N `Member`
- `Household` 1:N `Member`
- `District` 1:N `Member`
- `Group` 1:N `Member`
- `ApplicationForm` 1:N `Application`
- `User` 1:N `Notice`
- `User` 1:N `ActivityLog`
- `User` 1:N assigned `Application`

## 현재 데이터 이관 이슈

- 신청 모델이 두 서비스에 동시에 존재한다.
- 읽기/쓰기 경계가 완전히 `application-service`로 이동한 상태는 아니다.
- 런칭 전에는 최소한 "어떤 화면이 어떤 소스를 기준으로 읽고 쓰는지"를 고정해야 한다.

## 런칭 전 데이터 관점 체크포인트

- 모든 핵심 운영 엔티티에 `churchId` 스코프가 적용되는지 확인
- 교인 삭제 정책이 소프트 삭제 기준으로 일관적인지 확인
- 신청 도메인에서 중복 저장 또는 불일치 가능성이 없는지 확인
- 시드 데이터가 멀티테넌트 구조와 충돌하지 않는지 확인
