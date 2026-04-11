# Notion Blog Integration Plan — 2026-03-25

## 목표
자체 홈페이지 글쓰기 기능 고도화는 잠시 멈추고,
**노션을 블로그 CMS로 먼저 연결**해서 더 빠르게 실사용 가능한 콘텐츠 운영 흐름을 만든다.

---

## 1. 기본 전략

### 운영 방식
- 글 작성: Notion
- 사이트 공개: soom-church
- 관리자 확인: 플랫폼 관리자 또는 공개 블로그 페이지

즉,
- Notion은 **콘텐츠 관리/작성 도구**
- soom-church는 **렌더링/공개 도구**
역할로 분리한다.

---

## 2. 추천 구조

### 권장: API 키 1개 + DB 여러 개
가장 추천하는 구조:
- `NOTION_API_KEY` 하나
- Notion 내부에서 데이터베이스 여러 개 운영
  - 블로그 DB
  - 운영 메모 DB
  - 온보딩 DB

장점:
- 구현 단순
- 권한 관리 쉬움
- 유지보수 용이

### 대안: API 키 여러 개
구조상 가능함.
이미 코드도 여러 키를 받을 수 있게 준비함.

지원 예정 환경변수:
- `NOTION_API_KEY`
- `NOTION_BLOG_API_KEY`
- `NOTION_OPS_API_KEY`

우선순위:
1. `NOTION_BLOG_API_KEY` 있으면 블로그 전용으로 사용
2. 없으면 `NOTION_API_KEY` fallback

즉 **API 키 여러 개 사용 가능**하도록 구조를 열어둠.

---

## 3. 현재 준비된 코드

파일:
- `lib/notion.ts`

현재 가능한 것:
- Notion 토큰 로드
- 여러 API 키 fallback 처리
- Notion data source query helper
- Notion fetch 공통 래퍼

즉, 아직 키/DB ID가 없어서 실제 연결은 안 했지만
**연결용 코드 기반은 이미 준비됨**.

---

## 4. 다음에 필요한 값

연동 시작하려면 최소 아래가 필요함.

### 필수
- `NOTION_API_KEY` 또는 `NOTION_BLOG_API_KEY`
- 블로그용 `data_source_id`

### 추천 블로그 DB 필드
- `Title` (title)
- `Slug` (rich_text or title-linked slug)
- `Status` (select: Draft / Published / Archived)
- `Excerpt` (rich_text)
- `CoverImage` (url or files)
- `PublishedAt` (date)
- `Tags` (multi_select)
- `SEO Title` (rich_text)
- `SEO Description` (rich_text)

---

## 5. 연결 순서

### 1단계
Notion DB에서 발행된 글 목록 읽기
- `/ai-guides` 또는 이후 `/blog`가 Notion published rows를 렌더

### 2단계
Notion 페이지 본문 블록 읽기
- `/ai-guides/[slug]`에서 Notion block children 렌더

### 3단계
플랫폼 관리자에서 연결 상태 확인
- 키 존재 여부
- data source 연결 여부
- 최근 동기화 상태

### 4단계
기존 Prisma `GuidePost`와 병행 또는 전환 결정
- 초기에는 fallback 가능
- 최종적으로는 Notion 중심으로 이동할지 판단

---

## 6. 현재 결정

- 자체 블로그 에디터 고도화는 잠시 후순위
- 먼저 **Notion CMS 연동**을 1순위로 둠
- 관리자/워크스페이스/공개 블로그 축이 섞이지 않도록
  **블로그 데이터 소스는 Notion 기준으로 단일화**하는 방향이 더 적합함

---

## 7. 다음 액션

1. Notion integration key 받기
2. 블로그용 data source id 받기
3. published 글 목록 조회 연결
4. 상세 본문 블록 렌더 연결
5. 플랫폼 관리자에 Notion 연결 상태 카드 추가
