# world-layers

모바일 월드 레이어 규격(잠금):
- 해상도: 1024x1024
- 포맷: PNG(투명 배경 지원)
- 레이어 순서:
  1. `bg-layer.png` (배경)
  2. `buildings-layer.png` (건물/고정 구조)
  3. `fig-tree-layer.png` (무화과 나무/상징 오브젝트)
  4. `npc-disciples-layer.png` (예수님/제자 레이어)
  5. `ground-objects-layer.png` (지면 오브젝트)
  6. `characters-layer.png` (사람/캐릭터)

규칙:
- 각 파일은 같은 캔버스 크기/기준점 유지
- 캐릭터/오브젝트는 배경에 합치지 않고 반드시 분리
- 임시 시안은 투명 PNG로 교체 가능 (현재 3,4,5,6 레이어는 placeholder 사용 가능)
