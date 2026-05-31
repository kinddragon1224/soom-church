# 커리어 진단 상품 MVP 커밋 범위 주의 문서

작성일: 2026-05-02

목적: 현재 작업트리에 Threads 운영 파일, generated 파일, 기존 웹 변경이 섞여 있을 수 있으므로 커리어 진단 상품 MVP와 무관한 변경을 함께 커밋하지 않도록 범위를 고정한다.

## 가장 중요한 원칙

- 전체 커밋 금지.
- `git add .` 금지.
- 커리어 진단 상품 관련 파일만 골라 커밋한다.
- Threads 운영 파일과 런타임/generated 파일은 절대 섞지 않는다.
- 상담폼이나 홈 랜딩 변경은 내용 확인 후 진단 상품 전환에 직접 필요할 때만 포함한다.

## 포함 후보

커리어 진단 상품 MVP 커밋에 포함 가능한 파일:

```txt
app/diagnosis/page.tsx
app/diagnosis/report-intake/page.tsx
components/diagnosis/career-diagnosis-flow.tsx
components/diagnosis/diagnosis-data.ts
components/diagnosis/report-intake-form.tsx
app/api/diagnosis/report-intake/route.ts
docs/CAREER_DIAGNOSIS_PRODUCT_MVP_2026-05-02.md
docs/CAREER_DIAGNOSIS_THREADS_CTA_2026-05-02.md
docs/CAREER_DIAGNOSIS_LEAD_OPS_2026-05-02.md
docs/CAREER_DIAGNOSIS_COMMIT_SCOPE_2026-05-02.md
```

## 조건부 포함 후보

다음 파일은 진단 상품 전환과 직접 연결되는 변경인지 확인 후 포함한다.

```txt
app/contact/page.tsx
components/contact/consultation-inquiry-form.tsx
app/api/contact/*
app/page.tsx
```

포함 기준:

- `/diagnosis` 또는 `/diagnosis/report-intake`로 자연스럽게 연결하는 문구.
- 30분 방향 진단 신청 흐름에 직접 필요한 수정.
- 진단 상품과 무관한 브랜딩/레이아웃 변경이면 별도 커밋.

## 제외 후보

이번 진단 상품 커밋에서 제외해야 할 파일:

```txt
ops/threads/*
scripts/threads-*
docs/THREADS_*.md
ops/threads/queue/*
ops/threads/reports/*
ops/threads/state/*
ops/threads/audit/*
ops/threads/quality/*
ops/threads/research/*
ops/threads/strategy/*
```

`package.json` 변경도 이번 진단 상품과 직접 관련 없으면 제외한다.

## 추천 staging 명령

상태를 먼저 확인한다.

```bash
git status --short
git diff --stat
```

커리어 진단 상품 파일만 선별 staging한다.

```bash
git add -- \
  app/diagnosis/page.tsx \
  app/diagnosis/report-intake/page.tsx \
  components/diagnosis/career-diagnosis-flow.tsx \
  components/diagnosis/diagnosis-data.ts \
  components/diagnosis/report-intake-form.tsx \
  app/api/diagnosis/report-intake/route.ts \
  docs/CAREER_DIAGNOSIS_PRODUCT_MVP_2026-05-02.md \
  docs/CAREER_DIAGNOSIS_THREADS_CTA_2026-05-02.md \
  docs/CAREER_DIAGNOSIS_LEAD_OPS_2026-05-02.md \
  docs/CAREER_DIAGNOSIS_COMMIT_SCOPE_2026-05-02.md
```

staged diff를 확인한다.

```bash
git diff --cached --stat
git diff --cached --name-status
```

## 커밋 메시지 후보

```txt
Package career diagnosis report beta funnel
```

또는 문서만 커밋하는 경우:

```txt
Document career diagnosis sales experiment ops
```

## 커밋 전 확인

- `/diagnosis` CTA가 `/diagnosis/report-intake`로 이어지는지.
- `/diagnosis/report-intake`가 JSONL 접수 흐름을 유지하는지.
- 결제, DB, 자동 리포트 생성이 추가되지 않았는지.
- Threads/ops runtime 파일이 staged에 없는지.
