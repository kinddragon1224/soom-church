# MOBILE WORLD OBJECT SCALE SPEC 2026-04-15

타일 기준으로 월드 오브젝트 크기를 고정한다.

## 기준
- 1 tile = 32px
- 캔버스 = 928x1152 (29x36 tiles)
- 모든 에셋은 먼저 타일 단위로 설계, 이후 px로 출력

## 기본 크기표
- NPC: `2x3 tiles` (64x96)
- 집(가정): `4x4 tiles` (128x128)
- 건물(예배당/홀): `6x5 tiles` (192x160)
- 무화과 나무(메인): `3x5 tiles` (96x160)
- 꽃: `1x1 tiles` (32x32)

## 배치 원칙
1. NPC는 집 문 높이의 70~80% 안에서 유지
2. 건물은 NPC 대비 최소 2.5배 이상 면적
3. 나무는 NPC보다 크고 건물보다 작게 유지
4. 꽃/소형 오브젝트는 1tile 또는 2tile 묶음만 사용

## 제작/검수
- 작업 전: `assets/world-tiles/object-scale-spec.json` 확인
- 작업 중: `world-ground-tile-guide-32.png` 위에 시안 배치
- 검수 항목:
  - [ ] NPC, 집, 건물, 나무, 꽃 스케일 규칙 준수
  - [ ] 월드 화면에서 원근/비례 붕괴 없음
  - [ ] UI 오버레이와 충돌 없음
