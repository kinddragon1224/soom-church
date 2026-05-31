# 커리어 진단 리드 운영 문서

작성일: 2026-05-02

목적: `/diagnosis` 무료 진단에서 `/diagnosis/report-intake` 상세 리포트 베타 요청으로 들어온 리드를 수동으로 확인하고, 판매 실험 지표로 정리한다.

## 저장 위치

상세 리포트 베타 요청은 Notion 저장을 우선 시도하고, Notion 설정이 없거나 실패하면 JSONL fallback으로 저장한다.

Notion 저장에 사용할 수 있는 환경값은 다음 순서로 확인한다.

```txt
NOTION_DIAGNOSIS_API_KEY
NOTION_CONTACT_API_KEY
NOTION_API_KEY_SOOM_BLOG
NOTION_API_KEY

NOTION_DIAGNOSIS_REPORT_DATABASE_ID
NOTION_REPORT_INTAKE_DATABASE_ID
NOTION_CONTACT_DATABASE_ID
NOTION_CONSULTATION_DATABASE_ID
NOTION_INQUIRY_DATABASE_ID
```

Notion 데이터베이스에 해당 속성이 있으면 자동으로 채우고, 없는 속성은 무시한다. 그래서 처음에는 `이름`, `연락처`, `Track`, `Wanted Outcome`, `Created At`처럼 필요한 속성만 만들어도 된다.

JSONL fallback 위치는 아래와 같다.

```txt
ops/diagnosis-report-requests/requests.jsonl
```

Vercel 프로덕션에서 Notion 저장이 실패하면 `/tmp/diagnosis-report-requests/requests.jsonl`에 임시 fallback으로 저장된다. 이 값은 영구 운영 저장소가 아니므로, 실제 런칭 전에는 Notion 환경값을 우선 확인한다.

요청 현황은 아래 명령으로 빠르게 확인한다.

```bash
node scripts/diagnosis-leads-summary.mjs
```

동작 방식:

- Notion 환경값과 데이터베이스 ID가 있으면 Notion 요청 목록을 먼저 요약한다.
- Notion 설정이 없거나 조회가 실패하면 로컬 JSONL을 요약한다.
- 로컬 JSONL만 강제로 보고 싶으면 `--source jsonl`을 사용한다.
- Notion만 강제로 보고 싶으면 `--source notion`을 사용한다.

자동화/연동용 JSON 출력이 필요하면 아래를 사용한다.

```bash
node scripts/diagnosis-leads-summary.mjs --json
```

운영 확인 예시:

```bash
node scripts/diagnosis-leads-summary.mjs --source notion
node scripts/diagnosis-leads-summary.mjs --source jsonl
node scripts/diagnosis-leads-summary.mjs --source notion --json
```

요약에서 확인할 항목:

- 총 요청 수.
- track 분포.
- source 파라미터 분포.
- diagnosisResultType 분포.
- 최근 요청 5개.

리드가 0건이면 먼저 확인할 것:

- 실제 폼 제출이 `/api/diagnosis/report-intake`에 성공했는지.
- Vercel 환경변수에 Notion API key와 database ID가 들어있는지.
- Notion 데이터베이스에 integration이 초대되어 있는지.
- Notion 데이터베이스에 `Contact`, `Track`, `Source`, `Created At` 같은 속성이 있는지.
- Notion이 실패했을 때 `/tmp` fallback만 발생한 것은 아닌지.

## Notion DB 스키마 점검

실제 런칭 전에는 아래 명령으로 Notion 데이터베이스 속성이 충분한지 확인한다.

```bash
node scripts/diagnosis-notion-schema-check.mjs
```

자동화/공유용 JSON 출력:

```bash
node scripts/diagnosis-notion-schema-check.mjs --json
```

필수 속성:

- `Contact`: `rich_text`, `email`, `phone_number` 중 하나.
- `Track`: `select` 또는 `rich_text`.
- `Source`: `select` 또는 `rich_text`.
- `Created At`: `date` 또는 `rich_text`.

권장 속성:

- `Request ID`
- `Diagnosis Type`
- `Target Type`
- `Stage`
- `Focus`
- `Child Grade Or Age`
- `Current Anxiety`
- `Avoid Future`
- `Tried Activities`
- `Current Situation`
- `Wanted Outcome`
- `Strengths`
- `Avoid Path`
- `Reference URL`

필수 속성이 빠져도 API는 가능한 범위에서 저장을 시도하지만, 운영자가 리드를 분류하기 어려워진다. 런칭 전에는 필수 속성 4개와 title 속성 1개를 먼저 맞춘다.

각 줄은 하나의 요청이며, 주요 필드는 다음과 같다.

- `requestId`
- `createdAt`
- `source`
- `diagnosisResultType`
- `track`
- `name`
- `contact`
- `stage`
- `focus`
- `currentSituation`
- `wantedOutcome`
- `strengths`
- `avoidPath`
- `referenceUrl`

## 매일 확인할 항목

- 접수 수: 하루 총 요청 수.
- track 분포: `student_parent`, `early_career`, `transition` 중 어디가 강한지.
- `currentSituation` 반복 표현: 사람들이 같은 말로 막히는 지점.
- `wantedOutcome` 반복 표현: 돈을 내고 받고 싶은 결과의 언어.
- DM/댓글 구매 신호: "가격", "언제 받을 수 있나요", "제 상황도 되나요", "아이 것도 가능한가요" 같은 표현.

## 3일 실험 기준

### 1. 진단 클릭

- Threads CTA를 본 뒤 `/diagnosis`로 들어오는 흐름이 있는지 본다.
- 당장은 정밀 트래킹보다 댓글/DM 반응과 접수 수를 함께 본다.

### 2. 상세 리포트 요청 수

- 무료 결과를 본 사람이 `/diagnosis/report-intake`까지 넘어오는지 확인한다.
- 3일 동안 요청이 3건 이상이면 베타 상품 문구를 유지하며 더 밀어본다.

### 3. 강한 트랙

- `student_parent`: 부모가 아이 진로를 대신 고민하는 언어가 반복되는지.
- `early_career`: 20대가 "뭘 해야 할지", "내 경험을 어떻게 말할지"를 묻는지.
- `transition`: 40~50대가 "이 경력을 어디에 다시 쓸 수 있는지"를 묻는지.

### 4. 29,000원 베타 전환 가능성

- 리포트 요청 후 가격 안내에 거부감이 적은지 본다.
- "29,000원이면 받아보고 싶다"는 반응이 3건 이상이면 결제 연결을 검토한다.
- 단, 결제 연결 전에는 수동 리포트 3~5건을 먼저 작성해 상품 품질을 확인한다.

## 수동 리포트 작성 프로세스

1. JSONL에서 요청 확인.
2. 현재 상황 한 줄 진단 작성.
3. 피해야 할 착각 2개 작성.
4. 먼저 볼 방향 2~3개 작성.
5. 다음 7일 행동 3개 작성.
6. 30분 방향 진단 제안 여부 판단.

상세 응답/가격 안내/리포트 작성 템플릿은 아래 문서를 기준으로 한다.

```txt
docs/CAREER_DIAGNOSIS_REPORT_DELIVERY_PLAYBOOK_2026-05-04.md
```

운영 우선순위는 다음과 같다.

1. 접수 후 10분 안에 확인 메시지를 보낸다.
2. 미니 리포트, 상세 리포트, 프리미엄 1:1 중 어떤 경로가 맞는지 분류한다.
3. 기본 판매는 상세 리포트로 제안한다.
4. 1:1 방향 진단은 복잡한 선택일 때만 제한적으로 제안한다.

## 수동 리포트 기본 구조

```txt
[리포트 제목]
김선용의 AI 커리어 해석 리포트 베타

1. 현재 상태 한 줄 진단
- ...

2. 피해야 할 착각 2개
- ...
- ...

3. 먼저 볼 방향 2~3개
- ...
- ...
- ...

4. 다음 7일 행동 3개
- ...
- ...
- ...

5. 30분 방향 진단 제안 여부
- 필요 / 보류 / 불필요
- 이유:
```

## 트랙별 리포트 초점

### student_parent

- 아이가 오래 버틸 환경.
- 부모가 피해야 할 개입.
- 다음 탐색 순서.

### early_career

- 경험의 시장 언어 번역.
- 아직 부족한 증거.
- 2주 실행 과제.

### transition

- 기존 경력 재호명.
- 전환 후보.
- 피해야 할 재취업 착각.

## 아직 하지 말 것

- 결제 붙이지 않기.
- 자동 리포트 생성 붙이지 않기.
- DB 추가하지 않기.
- 리포트 품질 검증 전 가격을 크게 올리지 않기.
- 접수 데이터를 Threads 자동화나 발행 스크립트와 섞지 않기.

## 운영 루틴

- 매일 저녁 요청 수와 트랙 분포를 확인한다.
- 반복 표현은 별도 메모로 모아 다음 Threads 글 소재로 사용한다.
- 수동 리포트 3건을 만든 뒤, 실제로 29,000원 가치가 있는지 문장 밀도를 점검한다.
