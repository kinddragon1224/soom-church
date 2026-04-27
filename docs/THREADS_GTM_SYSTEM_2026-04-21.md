# Threads 운영 시스템 (역학 × 신학) — 2026-04-21

## 프로필 코어
- 문장: `역학과 신학을 바탕으로 세상을 봅니다.`
- 실제 포지션: 점술가가 아니라 AI를 잘 다루는 기획자이자 해석형 컨설턴트
- 상품 방향: 점술 상품보다 브랜딩 컨설팅 / AI 기획 컨설팅으로 연결
- 고객 축:
  - 3040: 방향 전환, 일, 관계, 생산성, AI 활용 + 지역 색(대전/로컬 감각/생활권 언어)
  - 5060: 돈은 잘 쓰지만 미래가 불안하고, 뭘 해야 할지 모르는 상태를 해석하고 붙잡아주는 축

## 발행 정책
- 시간: 매일 07:00~23:00, 2시간 간격 1개 (총 9개)
- 구조:
  - 공감/문제 제기 4개
  - 해석(역학×신학) 3개
  - 사례 1개
  - CTA 1개
- CTA 링크: `https://soom.io.kr`
- 이미지 정책: 필요 시 핵심 슬롯 3개(09/15/21시)만 이미지 포함, 나머지는 텍스트+첫댓글

## 판매 전환 구조 (Soom)
1. Threads 포스트/댓글에서 DM 유도
2. DM에서 `30분 해석 세션` 제안
3. 신청/결제/납품은 soom.io.kr 랜딩에서 처리
4. 납품 후 후기 회수 -> 다음 전환

## 자동화 작업
- 00:10: 다음 날 게시물 자동 생성
- 01:00: 전일 통계 리포트 생성 (조회/좋아요/답글/리포스트/인용)
- 01:10: 진로/직업/커리어 자료 리서치 브리프 생성
- 01:25: 전략 편집 브리프 생성(성과+자료 기반으로 primary/secondary track, 슬롯 역할 결정)
- 01:40: 당일 게시물 큐 생성 + quality gate 자동 보정/검사
- 06:40: preflight 검사(큐/감사/quality/research/strategy/중복/위험도). 실패 시 당일 자동 발행 차단
- 07:00~23:00: 2시간 간격 슬롯별 자동 게시
- 모든 크론은 `flock` 잠금으로 중복 실행 방지
- 이미지 슬롯은 사용자가 오전에 직접 생성 후 전달하는 반수동 구조 가능

## 파일 경로
- 큐: `ops/threads/queue/YYYY-MM-DD.json`
- 게시 상태: `ops/threads/state/published.json`
- 게시 로그: `ops/threads/logs/publish.jsonl`
- 통계 리포트: `ops/threads/reports/YYYY-MM-DD.md`
- 리서치 브리프: `ops/threads/research/YYYY-MM-DD.md`
- 전략 브리프: `ops/threads/strategy/YYYY-MM-DD.md`

## 운영 규칙
- 하루 CTA는 1회만
- 고성과 문장 패턴 재사용하되 같은 문장/같은 리듬 반복 금지
- 원천 생성 포맷은 실제 장면형 / 반전·통찰형 / 체크리스트형 3종으로 운용
- 브랜드 버전은 `brand-flow-v1`로 잠금. queue/post brand mismatch 시 quality/preflight에서 차단
- 매일 research brief를 먼저 만들고, 큐에는 `sourceResearch`와 `researchSignal`을 남긴다. 원문 기사 문장은 본문에 직접 붙이지 않는다.
- 매일 strategy brief로 9개 슬롯의 역할(problem-awareness/pillar-depth/authority/evidence-translation/checklist/contrarian/scene-case/conversion-prep/daily-close)을 먼저 정한다.
- 저성과 포스트는 다음날 각색 후 A/B
- 계정의 본질은 개인 일기보다 `복잡한 흐름을 읽고 행동 1개로 번역하는 계정`
- 주역은 중심 축이지만 전부는 아님. 일상/관계/AI/브랜딩/기획으로 확장
- 이미지가 붙는 글은 오후 슬롯 우선(15/19/21시)
- 해시태그/태그성 꼬리문구 사용 금지 (`#...`, 하단 라벨 포함)
- 중복 글 발행 절대 금지 (기발행 문안과 동일/유사 문안 재업로드 금지)
- 발행 시점 중복 감지에서 legacy 즉석 재생성은 기본 비활성화. 중복이면 발행 차단 우선
- 발행 스크립트는 당일 preflight `ok` 리포트가 없으면 실행하지 않는다
