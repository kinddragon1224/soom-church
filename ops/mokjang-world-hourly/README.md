# Mokjang World Hourly Loop

이 디렉터리는 1시간 주기 개선 루프의 프로그램형 입력/상태 파일을 담는다.

## 실행
```bash
node /home/kinddragon/.openclaw/workspace/soom-church/scripts/mokjang-world-hourly-loop.mjs
```

## 생성 파일
- `state.json`: 다음 실행 포인터 상태
- `current.json`: 이번 실행에 선택된 작업 정보
- `PROMPT.txt`: 에이전트가 그대로 수행할 실행 프롬프트

## 목적
- 앱개발
- 앱디자인
- 에셋구현
- 벤치마킹→우리화

4개 축을 매 시간 순환하며 개선한다.
