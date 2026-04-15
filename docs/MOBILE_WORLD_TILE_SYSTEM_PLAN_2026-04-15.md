# MOBILE WORLD TILE SYSTEM PLAN 2026-04-15

## 왜 타일화하나
- 마을 꾸미기 작업을 픽셀 단위로 반복 가능하게 만들기 위해
- 배경 전체를 매번 다시 그리지 않고, 바닥만 교체/확장하기 위해

## MVP 기준
- 월드 바닥만 타일화
- 타일 규격: 32px
- 캔버스: 928x1152 -> 29x36 타일

## 레이어 구조(고정)
1. `bg-layer.png` (클린 베이스 플레이트)
2. `ground tile layer` (타일 기반 바닥 디테일)
3. `buildings-layer.png`
4. `fig-tree-layer.png`
5. `npc-disciples-layer.png`
6. `ground-objects-layer.png`
7. `characters-layer.png`

## 작업 방식
- 아티스트/작업자는 `world-ground-tile-guide-32.png`에서 셀 기준으로 작업
- 타일 데이터는 `tilemap-template.json`에 저장 가능
- 나무/NPC는 항상 분리 레이어로 관리 (교체 가능성 확보)

## 오늘 산출물
- `apps/mobile-app/assets/world-tiles/` 생성
- 32px 가이드 + 샘플 타일 + 템플릿 파일 준비

## 다음 액션
1. ground 타일셋 16개(기본/밝음/어두움/경계) 제작
2. 타일 배치 1차 시안 적용
3. 월드 화면에서 타일 레이어 렌더 방식 연결 여부 결정
