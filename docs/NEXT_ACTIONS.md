# SOOM-CHURCH NEXT ACTIONS

이 파일은 다음 세션 시작 시 가장 먼저 읽는 복구용 파일이다.
긴 문서 보기 전에 이것부터 확인한다.

---

## LATEST SESSION RECOVERY - 2026-04-09
### 제품 정의
- 숨은 `목자가 목원을 관리하기 편하게 만드는 워크스페이스`
- 홈은 launcher / overview
- 실제 운영은 `목원 관리`, `관리`, `중보`, `근황`에서 처리
- AI는 장식이 아니라 정리, 복구, 우선순위 제안, 다음 행동 연결 역할

### 오늘까지 완료
1. 홈을 launcher형으로 재구성
2. `목원 관리` 목록을 등록 / 구조 보완 / 오늘 관리 대상 / 기록 바로가기 중심으로 재구성
3. 목원 상세에 `교회 이벤트`, `교구/목장/부서`, `사역 기록` 섹션 추가
4. 가정 상세에서 `가정 대표 / 배우자 / 자녀 / 기타 가족 / 미지정` 역할 구분과 즉시 수정 흐름 추가

### 바로 다음에 할 것
1. households에서 `배우자 추가 / 가족 연결`을 더 빠르게 만드는 UI 붙이기
2. households와 members 사이 family-link 흐름 정리
3. 교회 이벤트를 현재 faith milestone 범위를 넘는 일반 이벤트 모델로 확장할지 검토

### 꼭 같이 볼 문서
- `docs/GIDO_BETA_WORKSPACE_PLAN_2026-04-09.md`
- `memory/2026-04-09.md`

### 운영 메모
- OpenClaw cron은 전부 제거됨, 현재 `/home/kinddragon/.openclaw/cron/jobs.json` = 빈 jobs
- 텔레그램 발신은 정상
- `channels.telegram.apiRoot` 미지원 경고 로그 있음, 나중에 설정 정리 필요
- G.I.D.O 외 로컬 변경 파일 `app/login/page.tsx`, `app/workspace/page.tsx`, `components/auth/login-form.tsx` 는 커밋 대상에서 계속 제외할 것

---

## 2026-04-09 G.I.D.O ACTIVE TRACK
- 기준 문서: `docs/GIDO_BETA_WORKSPACE_PLAN_2026-04-09.md`
- 현재 제품 정의: 숨은 목자가 목원을 관리하기 편하게 만드는 워크스페이스
- 현재 화면 책임: 홈은 launcher, 실제 운영은 `목원 관리`, `관리`, `중보`, `근황`
- 현재 우선순위: `목원 관리` 목록 화면을 등록 / 보완 / 관리 / 기록 진입 중심으로 재구성

---

## 지금 상태 한 줄
숨은 이제 **워크스페이스를 메인 상품으로 전면에 둔 제품형 구조**로 전환되었고,
`/workspace`는 gloo 벤치마크 기반의 앱형 데모/제품 셸로 발전한 상태다.

## 현재 큰 방향
- 메인 상품: **SOOM workspace**
- 서브 상품: **콘텐츠 제작**
  - 쇼츠 · 홍보영상
  - 유튜브 운영 세팅
  - 행사 랜딩 · 안내 제작
- 블로그: 신뢰/브랜딩/SEO 자산
- 홈은 랜딩, workspace는 앱처럼 유지

## 유지할 것
- 홈 메인 카피: `교회를 돕다`
- 홈 서브 카피: `분별이 필요한 시대, 교회와 사역자의 거룩한 구별이 더 선명해지도록`
- 브랜드 팔레트: **네이비 + 골드**
  - 메인 네이비: `#0F172A`
  - 딥 네이비: `#0B1220`
  - 포인트 골드: `#C8A96B`
  - 소프트 골드: `#E7D7B1`
  - 배경 아이보리: `#F7F4EE`
  - 텍스트: `#121212`
- 사용자 노출 문구는 존댓말 유지
- 네비게이션의 `AI 안내서`는 사용자 노출상 **블로그**로 표기 유지

## 최근 완료된 핵심 작업
1. 프로덕션 도메인 연결 완료: `soom.io.kr`
2. SEO 기본 세팅 완료
   - canonical
   - metadataBase
   - OG/Twitter
   - robots/sitemap
3. 빌드 시 `DATABASE_URL` 경고 해결 완료
4. 홈을 워크스페이스 중심으로 전환
5. `/workspace` 페이지 생성 후 gloo 스타일로 반복 고도화
6. 워크스페이스 하위 페이지 생성/보강
   - `/workspace`
   - `/workspace/people`
   - `/workspace/notices`
   - `/workspace/tasks`
   - `/workspace/content`
   - `/workspace/settings`
7. 워크스페이스 전체를 네이비+골드 팔레트로 통일
8. 워크스페이스에서 홈으로 가는 버튼 추가
9. 사이드바를 제품 카테고리 구조로 재편
   - workspace
   - system
10. 페이지 언어도 새 제품 구조에 맞게 정렬
   - 커뮤니케이션
   - 작업 흐름
   - 콘텐츠 스튜디오

## 지금 바로 할 일 (우선순위 순)
1. **홈페이지 톤을 workspace와 같은 브랜드/제품 톤으로 정리**
   - 네이비+골드 적용 여부 점검
   - 워크스페이스 메인 상품 구조 더 선명하게

2. **workspace 탑바/디테일 고도화**
   - 검색
   - 알림
   - 프로필
   - 상태칩
   - 실제 앱 같은 상단 유틸리티 강화

3. **gloo 제품 구조 추가 해부 후 IA 재정리**
   - 현재 확인한 내부 홈 구조를 바탕으로
   - communications / people / content studio / support 흐름 고도화

4. **홈과 workspace의 브랜드 연결성 강화**
   - 홈에서 workspace 유입 더 강하게
   - 콘텐츠 제작은 서브 서비스로 정돈

## 참고 파일
- 메인 복구 문서: `soom-church/docs/SESSION_SUMMARY_2026-03-23.md`
- 작업 규칙: `soom-church/docs/WORKING_RULES.md`
- 메모: `memory/2026-03-23.md`
- 홈 코드: `soom-church/app/page.tsx`
- workspace 레이아웃: `soom-church/app/workspace/layout.tsx`
- workspace 홈: `soom-church/app/workspace/page.tsx`

## 다음 세션 시작용 지시문
- `soom-church NEXT_ACTIONS부터 읽고 이어가`
- `숨 프로젝트 이어서 해줘. workspace 기준으로`
- `WORKING_RULES 지키면서 계속 개발해`

## 응답 방식 원칙
- 선용은 비개발자다
- 항상 짧고 실행 가능하게 답한다
- 기본 형식:
  1. 지금 상태 한 줄
  2. 바로 할 일 1개
  3. 내가 대신 수정할 수 있는 것
  4. 확인만 필요한 것

## 톤 구분 메모
- 대화 톤: 반말
- 홈페이지/제품/마케팅 문구 톤: 존댓말
- 작업 중 헷갈리면 대화 톤과 사이트 문구 톤을 분리해서 판단한다
