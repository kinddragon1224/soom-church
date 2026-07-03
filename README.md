# 한국사 진로 세특 로드맵

한국사를 외우는 과목에서, 내 진로를 설명하는 탐구 과목으로 바꾸기 위한 MVP입니다.

이 앱은 회원가입, 결제, DB 저장 없이 학생이 희망 진로를 입력하면 한국사 단원과 연결된 탐구 주제, 질문, 보고서 목차, 세특 방향 예시를 즉시 보여줍니다.

## 핵심 흐름

- `/history-roadmap`: 랜딩 + 검색형 입력폼
- `/api/history-roadmap`: 외부 유료 API 없이 로컬 규칙 엔진으로 결과 생성
- `/history-roadmap/result`: 결과 카드, 전체 복사, 탐구보고서 설계 문의 CTA

## 실행

```bash
npm install
npm run dev
```

## 검증

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## 환경변수

```bash
NEXT_PUBLIC_CONSULTING_URL=
```

상담 문의 링크가 없으면 CTA는 임시 `#` 링크로 동작합니다.
