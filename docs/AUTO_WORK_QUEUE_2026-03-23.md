# SOOM Auto Work Queue — 2026-03-23

우선순위 원칙
- gloo 골격 우선 복제
- 우리 기능은 그 골격 안에 이식
- 설명 줄이고 상태/버튼/행동 우선
- 작업 단위마다 빌드 → 커밋 → 푸시
- 사용자 보고는 1줄만

## Queue
1. `/app/[churchSlug]/dashboard`
   - [done] 홈 텍스트 추가 압축
   - [done] Get Started / Feed / 최근 항목 밀도 정리
   - [done] gloo 홈처럼 더 단순하게 재배치
   - [done] 카드 중심 구성을 dense row 운영 화면으로 재정리
   - 2026-03-23 23:31 KST: 홈 hero/queue/recent/areas 1차 재배치 완료
   - 2026-03-24 07:03 KST: dashboard hero 보조 정보와 queue/modules/recent를 gloo식 dense row 운영 보드로 다시 압축
   - 2026-03-24 07:31 KST: dashboard에 최근 활동 로그 5개를 dense row 섹션으로 추가해 운영 변화도 같은 보드에서 바로 읽게 정리
   - 2026-03-24 08:09 KST: dashboard hero를 gloo식 today board로 다시 압축해서 오늘 처리할 2개와 마지막 변화 1개를 상단에서 바로 읽게 정리
   - 2026-03-24 09:06 KST: dashboard 상태 카드를 gloo식 status rail 한 줄 row로 다시 묶어 전체 사람/후속/신청/미배정을 같은 보드 톤으로 바로 누르게 정리

2. `/app/[churchSlug]/layout`
   - [done] 좌측 네비 밀도/활성 상태 개선
   - [done] 상단 유틸 더 gloo식으로 압축
   - 2026-03-24 00:07 KST: 좌측 네비 active badge/밀도 정리, 상단 헤더를 현재 섹션 중심으로 압축
   - 2026-03-24 08:33 KST: 상단 유틸을 플랜/역할/오늘 후속/미처리 신청/미배정 상태 레일로 재구성하고, 현재 섹션 기준 빠른 액션 3개를 붙여 gloo식 top utility 청크를 한 번 더 압축

3. `/app/[churchSlug]/members`
   - [done] 리스트 밀도 조정
   - [done] 액션 버튼 더 직관적으로 정리
   - [done] 카드 텍스트 추가 축소
   - 2026-03-24 00:33 KST: 사람 목록을 카드 나열에서 gloo식 dense row 리스트로 압축
   - 2026-03-24 01:02 KST: 상단 빠른 액션과 행별 CTA 버튼을 추가해 등록/후속/배정 정리 흐름을 바로 누르게 정리
   - 2026-03-24 06:34 KST: members hero/action rail/리스트 헤더 문구를 더 짧게 줄이고 action rail을 dense row 구조로 압축

4. `/app/[churchSlug]/applications`
   - [done] 신청 상태 표현 한국형으로 정리
   - [done] 리스트/우선순위 흐름 단순화
   - 2026-03-24 01:36 KST: 신청 상태를 접수됨/확인중/승인됨으로 현지화하고 dense row + 상태별 quick filter 구조로 단순화

5. `/app/[churchSlug]/notices`
   - [done] 공지 리스트 밀도 압축
   - [done] 고정/일반/전달 상태 표현 정리
   - 2026-03-24 02:00 KST: 공지 목록을 카드 나열에서 gloo식 dense row 리스트로 압축하고 요약 카운트/행 액션으로 재배치
   - 2026-03-24 02:32 KST: 상단 고정/이번 주 전달/지난 공지 3단 상태로 재구성하고 행별 전달 리듬 라벨을 추가

6. `/app/[churchSlug]/settings`
   - [done] 실제 설정 편집 흐름 준비
   - [done] 팀/역할/기본값 입력 구조 초안
   - 2026-03-24 03:08 KST: 설정 페이지를 gloo식 체크리스트 + 현재값 row + 기본 동작값 초안 구조로 재정리
   - 2026-03-24 03:36 KST: 역할 템플릿 3종, 초대 기본값, 신청/공지/후속관리 입력 초안 row를 추가해 settings 한 청크 마감

7. 가입/온보딩
   - [done] 가입 후 생성 워크스페이스 진입 더 매끄럽게
   - [done] 온보딩 입력값 구조 보강
   - [done] 관리자 조회 화면 정리
   - 2026-03-24 06:10 KST: `/app` 진입을 단일 워크스페이스면 즉시 이동, 다중 워크스페이스면 선택 row 노출 구조로 바꿔 가입 후 재진입/멀티 소속 흐름을 더 매끄럽게 정리
   - 2026-03-24 04:00 KST: `/app` 생성 흐름에 역할/팀/출석규모/우선 목표/운영 메모 입력을 추가하고, 생성 시 activity log metadata까지 남기도록 정리
   - 2026-03-24 04:38 KST: `platform-admin/churches`를 dense row 기반 운영 화면으로 재구성하고, 온보딩 메타/플랜/운영 메모를 한 줄 흐름으로 바로 보게 정리

8. 플랫폼 관리자
   - [done] users/churches 시야 개선
   - [done] 온보딩 메타 표시 정리
   - 2026-03-24 05:08 KST: `platform-admin/users`를 dense row 기반 운영 화면으로 재구성해 계정 상태, 소속 워크스페이스, 역할, 다중 소속 여부를 한 줄 흐름으로 바로 보게 정리
   - 2026-03-24 05:32 KST: `platform-admin/users`에 워크스페이스별 온보딩 메타(팀/출석규모/우선 목표/유입 경로)를 함께 노출해 사용자-교회 연결 상태를 운영 화면에서 바로 읽게 정리

## Done so far
- `/app` 실사용 진입 복구
- dev 워크스페이스 자동 부트스트랩
- 홈 / people / applications / notices / settings 1차 gloo식 이식
- 홈 2차 단순화 진행
