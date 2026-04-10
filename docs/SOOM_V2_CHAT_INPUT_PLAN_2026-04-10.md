# SOOM V2 CHAT INPUT PLAN - 2026-04-10

## 목표
프로토타입 1차 목표는 `일반 채팅 입력만으로 목원 등록/심방 기록/이벤트/중보기도/후속조치`가 관리자 워크스페이스 데이터로 자연스럽게 쌓이게 만드는 것이다.

---

## 왜 이걸 먼저 해야 하나
현재 구조는 `기존 사람에게 기록 붙이기`는 어느 정도 되지만,
`새 사람 등록`과 `불완전한 입력을 안전하게 받기`는 아직 약하다.

특히 지금 `Member`는 아래 값이 바로 필요하다.
- 이름
- 전화번호
- 생년월일
- 성별

그래서 목자가 채팅에
- `박지은 자매 오늘 처음 왔어`
- `오상준 형제 등록해줘`
처럼 말했을 때,
지금 구조로는 안전하게 바로 사람 레코드 생성하기가 어렵다.

즉, 첫 큰 작업의 핵심은 `채팅 입력을 바로 Member에 꽂는 것`이 아니라,
`안전한 intake 레이어`를 만드는 것이다.

---

## 1차 구현 방향

## A. 채팅 입력이 만드는 결과 타입
채팅 입력 결과는 우선 2종류로 나눈다.

### 1) 바로 반영 가능한 것
- 기존 사람에게 붙는 심방 기록
- 기도제목
- 출석 변화
- 교회 이벤트
- 후속조치
- 명확한 관계 연결

이건 지금 구조를 계속 강화하면 된다.

### 2) 바로 반영하면 위험한 것
- 새 사람 등록
- 사람/가정 매칭이 불확실한 것
- 정보가 너무 부족한 것

이건 바로 `Member`로 넣지 않고 `intake candidate`로 먼저 둔다.

---

## B. 새로 필요한 레이어

## Intake Candidate
목자가 채팅으로 넣은 새 등록 후보를 임시로 담는 레이어

예시 필드:
- churchId
- sourceCaptureId
- candidateType (`MEMBER_REGISTRATION`, `HOUSEHOLD`, `RELATIONSHIP`, `UNRESOLVED_NOTE`)
- proposedName
- proposedPhone
- proposedBirthDate
- proposedGender
- proposedHouseholdName
- rawSummary
- rawPayloadJson
- resolutionStatus (`PENDING`, `CONFIRMED`, `MERGED`, `REJECTED`)

### 역할
- 정보가 덜 있어도 우선 받는다
- 관리자 워크스페이스에서 나중에 보완 가능하다
- 기존 Member 테이블을 억지로 오염시키지 않는다

---

## 2. 일반 채팅 입력 1차 범위

### 채팅으로 바로 받아야 하는 것
1. 기존 목원 기록 추가
2. 새 목원 등록 후보 생성
3. 기도제목 추가
4. 심방/병원/상담/근황 기록 추가
5. 이벤트 추가
6. 후속조치 생성

### 예시
- `오상준 형제 허벅지 다쳐서 내일 병원 가. 중보기도도 올렸어.`
  - care record
  - prayer
  - follow-up(optional)

- `박지은 자매 오늘 처음 왔어. 남편이랑 같이 왔어.`
  - member registration candidate
  - relationship candidate

- `김민수 이번 주 예배 못 왔어. 다음 주에 전화해보자.`
  - attendance
  - follow-up

---

## 3. 관리자 워크스페이스 반영 방식

## Members
- 기존 사람 목록
- 직접 추가 버튼 유지
- 직접 수정 유지
- 기록 열람/수정 유지
- intake candidate에서 사람으로 확정 생성 가능

## Prayer
- 기도제목 목록
- 사람/가정 연결
- 진행중 / 종료 구분

## Follow-up
- 연락 필요 목록
- 일정/사유/최근 원인

## Timeline
- 반영된 운영 로그만 표시
- 원문 채팅은 기본 노출하지 않음

## Confirm Needed
- 기존 Review를 이 역할로 축소
- 애매한 것만 여기
- 새 등록 후보도 여기서 확정 가능

---

## 4. 지금 바로 개발 순서

### Step 1
기존 채팅 추출을 `기존 사람 기록 입력` 기준으로 더 안정화
- 심방
- 기도
- 이벤트
- 후속조치
- 출석

### Step 2
`새 사람 등록 후보`용 intake candidate 모델 추가

### Step 3
채팅에서 `처음 왔어 / 등록해줘 / 새가족` 패턴을 candidate로 저장

### Step 4
Members에서 candidate를 실제 사람으로 확정 생성하는 흐름 추가

### Step 5
기록 수정 UI를 Members 상세에서 붙이기

---

## 5. 현재 가장 중요한 판단
프로토타입 1차에서 중요한 건
`채팅이 자연스럽게 먹히는가`지,
`모든 것을 완전 자동 생성하는가`가 아니다.

따라서 첫 기준은 이거다.
- 기존 사람 기록은 자동 반영
- 새 사람 등록은 candidate로 안전하게 수용
- 관리자는 Members에서 최소 수정만 함

이 구조가 지금 단계에서 가장 안전하고 제품 방향에도 맞다.
