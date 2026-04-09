# SOOM V2 REVIEW SCHEMA - 2026-04-09

## 목적
채팅에서 들어온 목장 운영 내용을 바로 DB에 꽂지 않고,
`추출 -> 검토 -> 반영` 흐름으로 안정화하기 위한 기준 문서.

## 전체 파이프라인
1. Capture
2. Extract
3. Review
4. Apply
5. Recover

---

## 1. Capture
### 의미
목자가 모라에게 보낸 원문 메시지, 또는 모라와 오간 운영 대화 조각.

### 최소 필드
- source_channel
- source_chat_id
- source_message_id
- speaker_role (`pastor` / `assistant` / `system`)
- raw_text
- happened_at
- captured_at
- thread_key

### 메모
- 처음에는 텔레그램 기반으로 시작
- 나중에 앱 내 채팅이 생겨도 같은 capture 구조를 유지

---

## 2. Extracted Update
### 의미
원문에서 AI가 뽑아낸 운영 데이터 후보.

### 최소 필드
- id
- capture_id
- update_type
- confidence
- payload_json
- target_member_hint
- target_household_hint
- ambiguity_flags
- status
- created_at

### update_type 후보
- member_profile
- household_profile
- relationship
- prayer
- care_record
- attendance
- church_event
- follow_up
- status_change

### payload 예시
```json
{
  "type": "care_record",
  "memberName": "김민수",
  "category": "HEALTH",
  "summary": "어머니 수술 예정",
  "happenedAt": "2026-04-09",
  "needsFollowUp": true
}
```

---

## 3. Review Item
### 의미
바로 반영하면 위험한 후보를 목자가 확인하는 큐 항목.

### 최소 필드
- id
- extracted_update_id
- review_reason
- suggested_action
- status
- reviewer_id
- reviewed_at
- resolution_note

### review_reason 후보
- ambiguous_member_match
- ambiguous_household_match
- relationship_uncertain
- duplicate_candidate
- low_confidence
- missing_required_field
- conflicting_existing_data

### status 후보
- pending
- approved
- edited_and_approved
- rejected
- skipped
- merged

### suggested_action 예시
- existing member에 연결
- 새 member 생성
- household에 추가
- spouse 관계 생성
- care record로 저장
- follow-up 생성

---

## 4. Apply Result
### 의미
승인된 후보가 실제 어떤 도메인 레코드로 반영됐는지 남기는 기록.

### 최소 필드
- id
- extracted_update_id
- applied_entity_type
- applied_entity_id
- applied_patch_json
- applied_at
- actor_id

### applied_entity_type 후보
- Member
- Household
- MemberRelationship
- MemberCareRecord
- MemberFaithMilestone
- FollowUpItem

---

## 5. Recover Index
### 의미
나중에 검색과 복구를 쉽게 하기 위한 검색용 인덱스.

### 최소 필드
- extracted_update_id
- member_ids
- household_ids
- keywords
- date_bucket
- event_kind

---

## 기존 도메인 모델과의 연결
### 그대로 활용 가능한 것
- `Member`
- `Household`
- `MemberRelationship`
- `MemberCareRecord`
- `MemberFaithMilestone`

### 잠정적으로 보류할 것
- 출석 전용 모델
- 후속 전용 모델
- 채팅 capture / review 전용 테이블

처음에는 문서 기준으로 흐름을 먼저 굳히고,
그 다음 Prisma 스키마를 추가하는 순서로 간다.

---

## Review UI에서 꼭 필요한 액션
1. 누구 이야기인지 선택
2. 기존 가정에 연결 / 새 가정 생성
3. 관계 승인
4. 기록 종류 변경
5. 메모 보정
6. 보류
7. 무시

---

## 첫 번째 구현 범위
### 반드시 들어갈 것
- capture list
- extracted update list
- review card
- approve / reject / edit
- apply log

### 아직 미루는 것
- 복잡한 다중 승인 흐름
- 자동 병합 규칙 다수
- 고급 배치 처리
- 사용자 권한 세분화

---

## Review 카드 예시
### 카드 헤더
- `관계 확인 필요`

### 원문
- `김민수네 이번에 아내도 같이 예배 나왔어`

### 추출 결과
- member: 김민수
- relationship: spouse
- new member candidate: 미상

### 액션
- 기존 인원에 연결
- 새 배우자 생성
- 보류
- 무시

---

## 구현 순서
1. 문서 기준 확정
2. Prisma 초안 추가
3. Review Queue 화면 제작
4. Telegram capture 연결
5. 모라 extraction prompt / tool flow 설계
6. People / Households 반영 흐름 연결

---

## 현재 결정
- 숨 v2의 첫 실제 구현 화면은 `Review Queue`
- 핵심은 AI가 대신 쓰고, 목자는 확인만 하게 만드는 것
- 검토 없는 자동 기록보다, 낮은 마찰의 승인 흐름이 우선이다
