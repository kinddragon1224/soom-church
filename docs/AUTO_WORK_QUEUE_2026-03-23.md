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
   - 2026-03-23 23:31 KST: 홈 hero/queue/recent/areas 1차 재배치 완료

2. `/app/[churchSlug]/layout`
   - [done] 좌측 네비 밀도/활성 상태 개선
   - [done] 상단 유틸 더 gloo식으로 압축
   - 2026-03-24 00:07 KST: 좌측 네비 active badge/밀도 정리, 상단 헤더를 현재 섹션 중심으로 압축

3. `/app/[churchSlug]/members`
   - [done] 리스트 밀도 조정
   - 액션 버튼 더 직관적으로 정리
   - 카드 텍스트 추가 축소
   - 2026-03-24 00:33 KST: 사람 목록을 카드 나열에서 gloo식 dense row 리스트로 압축

4. `/app/[churchSlug]/applications`
   - 신청 상태 표현 한국형으로 정리
   - 리스트/우선순위 흐름 단순화

5. `/app/[churchSlug]/notices`
   - 공지 리스트 밀도 압축
   - 고정/일반/전달 상태 표현 정리

6. `/app/[churchSlug]/settings`
   - 실제 설정 편집 흐름 준비
   - 팀/역할/기본값 입력 구조 초안

7. 가입/온보딩
   - 가입 후 생성 워크스페이스 진입 더 매끄럽게
   - 온보딩 입력값 구조 보강
   - 관리자 조회 화면 정리

8. 플랫폼 관리자
   - users/churches 시야 개선
   - 온보딩 메타 표시 정리

## Done so far
- `/app` 실사용 진입 복구
- dev 워크스페이스 자동 부트스트랩
- 홈 / people / applications / notices / settings 1차 gloo식 이식
- 홈 2차 단순화 진행
