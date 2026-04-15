# STYLE LOCK PROMPT TEMPLATE (NPC)

## 입력 레퍼런스
- `jesus-npc.png` (마스터)
- (선택) 캐릭터 콘셉트 레퍼런스 1장

## 프롬프트 템플릿
Use `jesus-npc.png` as strict master style.
Create a new NPC sprite with:
- exact same sprite rendering style (pixel density, line thickness, shading granularity, edge sharpness)
- front-facing full body pose
- canvas-ready transparent cutout only (no background, no plate, no shadow panel, no text)
- same proportion family as Jesus sprite
- only character identity changes (face, color accents, small gesture)

Output requirements:
- PNG with alpha
- target size family: 80x120
- no white/gray matte artifacts around edges

## 후처리 규칙
1. 배경 제거
2. 80x120 리사이즈
3. 예수님과 1:1 시각 비교 (선명도/라인/명암)
4. 월드 실제 배치 체크
