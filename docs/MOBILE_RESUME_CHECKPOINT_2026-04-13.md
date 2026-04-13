# MOBILE RESUME CHECKPOINT (2026-04-13)

## 현재 상태 (완료)
- 모바일 앱 중심 전환 구조 고정 (웹은 소개/로그인/브리지/관리)
- 웹 로그인 → 앱 복귀 딥링크 브리지 동작
- churchSlug 자동 선택: 최근 사용 church 우선
- 월드/사람/할일/채팅 탭 공통 스토어 연결
- 월드 오브젝트 → 채팅 초안 연결
- 채팅 명령 전송 API 연결
- 채팅 응답 액션을 할 일 탭에 자동 추가
- 런타임 할 일 영속 저장(앱 재시작 후 유지) + 완료 토글

## 최근 커밋
- 46dd275 Persist runtime tasks and support completion toggle
- 1f286ae Add action-driven mobile chat to task pipeline
- 843aea2 Add mobile chat command API and input flow
- 1fbd9eb Link world object actions to chat draft flow
- 093cb4d Prefer recent church for mobile auth return
- 7018a48 Auto-resolve mobile church slug from login return
- 8f1fc77 Wire mobile world snapshot to DB-backed API

## 다음 작업 우선순위
1. 런타임 할 일 DB 동기화 API (기기 변경 시에도 유지)
2. 채팅 명령 → 실제 워크플로 액션 실행(상태 갱신/후속 처리)
3. 월드 맵 오브젝트를 실제 데이터 변화와 더 강하게 동기화

## 밖에서 복구용 실행 명령
```bash
cd /home/kinddragon/.openclaw/workspace/soom-church
pkill -f "expo start" || true
pkill -f "metro" || true
npm run mobile:dev:tunnel
```

## 세션 재개용 한 줄 프롬프트
"soom-church 모바일 작업 재개. docs/MOBILE_RESUME_CHECKPOINT_2026-04-13.md 기준으로 다음 우선순위 1번부터 바로 진행해줘."
