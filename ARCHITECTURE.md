# Soom Church Architecture

## 목적

이 문서는 현재 코드베이스의 시스템 경계와 서비스 책임을 설명한다. 제품 범위는 `PRD.md`, 현재 작업 상태는 `PROJECT_WORKING_DOC.md`를 기준으로 본다.

## 아키텍처 요약

현재 구조는 완성된 마이크로서비스가 아니라, `core-service` 중심 모놀리스에서 서비스 분리를 시작한 과도기 구조다.

- UI와 대부분의 제품 로직은 `core-service`에 남아 있다.
- `application-service`는 신청 도메인을 별도 서비스로 분리하는 첫 단계다.
- 나머지 서비스는 실행 골격과 인프라 연결 위주다.

## 시스템 구성

```text
Client
  -> Gateway (Nginx :8081)
    -> core-service (:3002)
    -> application-service (:3004)
    -> content-service (:3003)
    -> notification-service (:3005)
    -> community-service (:3006)
    -> ai-service (:3007)

Shared infrastructure
  -> PostgreSQL (:5434)
  -> Redis (:6379)
```

## 서비스 책임

### core-service

- Next.js 기반 관리자 UI
- 로그인/로그아웃
- 워크스페이스/교회 컨텍스트
- 플랫폼 관리자 기능
- 교인, 교구, 목장, 공지, 활동 로그 등 현재 핵심 기능

### application-service

- 신청 폼 조회/생성
- 신청 접수
- 신청 목록 조회
- 신청 요약 조회
- 신청 상태 변경

### content-service

- 향후 설교/콘텐츠 도메인 담당
- 현재는 스켈레톤

### notification-service

- 향후 이메일/SMS/푸시/예약 발송 담당
- 현재는 스켈레톤

### ai-service

- 향후 LLM 통합 및 모델 라우팅 담당
- 현재는 스켈레톤

### community-service

- 향후 소모임/채팅/피드 담당
- 현재는 스켈레톤

## 데이터 경계

현재는 신청 도메인이 완전 분리되지 않았다.

- `services/core-service/prisma/schema.prisma`에 신청 관련 모델이 남아 있다.
- `services/application-service/prisma/schema.prisma`에도 신청 관련 모델이 존재한다.
- 즉, 새 서비스 경로를 먼저 안정화한 뒤 점진적으로 이관하는 상태다.

이 판단은 배포 안전성과 단계적 전환을 위한 의도적 중간 상태다.

## 현재 라우팅 관점

- 관리자 및 플랫폼 관리 UI는 `core-service`가 제공한다.
- 신청 도메인은 `application-service` API를 우선 사용한다.
- 초기 전환 단계에서는 일부 로컬 Prisma 폴백이 남아 있다.

## 공통 패키지

### `@soom/contracts`

- DTO와 `zod` 스키마
- 현재는 신청 도메인 계약이 중심

### `@soom/service-client`

- 서비스 간 HTTP 호출 유틸

### `@soom/events`

- 향후 비동기 이벤트 타입 초안

### `@soom/shared`

- 기존 공통 유틸

## 향후 아키텍처 방향

- 신청 도메인의 데이터/쓰기 경계를 `application-service`로 더 명확히 이동
- 서비스 간 계약을 `@soom/contracts` 중심으로 고정
- 폴백 제거 후 도메인별 책임 분리 강화
- 이후 콘텐츠, 알림, AI, 커뮤니티 순으로 실질 구현 확장
