# world-tiles

타일 작업용 베이스(32px)

## 규격
- 캔버스: 928x1152
- 타일: 32x32
- 그리드: 29 x 36 (정확히 나눠짐)

## 파일
- `world-ground-tile-guide-32.png`: 월드 배경 위 그리드 가이드
- `ground-tile-sample-01~04.png`: 샘플 타일 4종
- `ground-tile-atlas-sample.png`: 샘플 타일 아틀라스
- `tilemap-template.json`: 타일 배치 데이터 템플릿

## 작업 원칙
1. 배경은 클린 플레이트(`bg-layer.png`)를 바닥으로 사용
2. 바닥 디테일은 타일 단위로 제작/교체
3. 나무/NPC/오브젝트는 타일이 아니라 별도 레이어 유지
4. 픽셀 작업자는 32px 셀 기준으로만 수정
