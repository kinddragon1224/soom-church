# MOBILE WORLD MVP ASSET PLAN 2026-04-15

## 목표
- 월드를 `목원 표시` 중심에서 `마을 운영` 중심으로 전환한다.
- MVP는 레이어 6장을 유지하되, **NPC 레이어 품질을 최우선**으로 올린다.
- 실제 앱 반영 가능한 에셋 세트로 만든다(교체 즉시 동작).

## 월드 컨셉(고정)
- 키워드: 마을화, 건물, 나무, 크리처, 배경, NPC
- 톤: 어두운 고대 마을 + 따뜻한 돌봄 신호
- 카메라: 상단 고정 뷰(현재 4:5 레이아웃 유지)

## MVP 에셋 범위 (필수)
1) 배경 (`bg-layer.png`)
- 하늘/지형/원경 산, 물길, 빛 방향
- 너무 복잡한 디테일 금지(중경/전경과 충돌 방지)

2) 건물 (`buildings-layer.png`)
- 예배당/공동체 홀/작은 집 군집
- 실루엣으로 기능 구분 가능해야 함

3) 상징 나무 (`fig-tree-layer.png`)
- 월드 중심 앵커 역할
- UI 텍스트와 겹쳐도 형태가 살아야 함

4) NPC (`npc-disciples-layer.png`)  ← 최우선
- 핵심 NPC 3~5명 실루엣 + 포즈 차등
- 역할이 보이는 외형(돌봄/안내/기도)
- 배경과 분리되는 명도 대비 필수

5) 지면 오브젝트 (`ground-objects-layer.png`)
- 표지판/돌/램프/작은 식생
- 시선 유도 + 빈 공간 메움

6) 캐릭터 (`characters-layer.png`)
- 플레이어/방문자 느낌 최소 인원
- 과밀 배치 금지

## 우선순위
- P0: NPC, 배경, 건물
- P1: 나무, 지면 오브젝트
- P2: 캐릭터 디테일

## 제작 규격(고정)
- 비율: 4:5
- 캔버스: 928x1152 (레이어 전부 동일)
- 포맷: PNG(투명)
- 파일명: 기존 고정 파일명 유지
  - `bg-layer.png`
  - `buildings-layer.png`
  - `fig-tree-layer.png`
  - `npc-disciples-layer.png`
  - `ground-objects-layer.png`
  - `characters-layer.png`

## 즉시 반영 규칙
- 새 에셋은 `apps/mobile-app/assets/world-layers/`에 같은 이름으로 교체
- 코드 수정 없이 앱 반영
- 반영 확인 기준:
  1. 상단 월드에서 요소 겹침/깨짐 없음
  2. 실행창 오버레이와 시각 충돌 없음
  3. NPC가 첫 시선에서 식별됨

## 1차 제작 배치(오늘)
- 배치 A: `npc-disciples-layer.png` 고품질 1안
- 배치 B: `bg-layer.png`, `buildings-layer.png` 톤 맞춤 1안
- 배치 C: `fig-tree-layer.png`와 `ground-objects-layer.png` 빈 공간 보정

## 완료 판정
- 월드 첫 인상에서 "마을 + 인물 관계"가 즉시 읽힘
- NPC가 장식이 아니라 동작 주체로 느껴짐
- 기존 모바일 UI 비율을 깨지 않음
