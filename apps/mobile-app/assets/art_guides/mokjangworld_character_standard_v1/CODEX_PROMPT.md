# Codex 작업 요청: 목장월드 캐릭터 아트 기준 통일

첨부한 ZIP은 예수님 NPC와 초보 목자 LV.1의 크기, 비율, 해상도, 스타일을 통일하기 위한 기준 시트입니다.

현재 문제:
- 예수님 NPC와 초보 목자 캐릭터의 비율이 다름
- 픽셀 밀도와 외곽선 느낌이 다름
- 화면에서 서로 다른 게임 에셋처럼 보임
- 단순 width/height 조절로 해결되지 않음

## 1. ZIP 위치

ZIP을 아래 경로에 풀어줘.

```text
assets/art_guides/mokjangworld_character_standard_v1/
```

## 2. 기준 시트 확인

아래 파일을 기준 이미지로 사용해줘.

```text
assets/art_guides/mokjangworld_character_standard_v1/mokjangworld_character_standard_sheet_v1.png
```

그리고 아래 manifest도 읽어줘.

```text
assets/art_guides/mokjangworld_character_standard_v1/art_style_manifest.json
```

## 3. 앞으로 모든 캐릭터 에셋 기준

모든 목장월드 캐릭터는 아래 규칙을 따라야 해.

```text
- 캐릭터별 기본 캔버스: 128x128
- 캐릭터 실제 높이: 약 104px
- 비율: 2.5등신 SD 치비
- 기본 시점: 3/4 front
- 발 기준선: 모든 캐릭터 동일
- 외곽선: 따뜻한 진갈색 1~2px
- 그림자: 같은 스타일의 타원형 발밑 그림자
- 렌더링: 모바일 RPG용 선명한 픽셀아트풍
- 색감: 따뜻한 목장월드 팔레트
- 배경: 실제 앱 에셋은 투명 PNG
- export: 96, 128, 256, 512 PNG
```

## 4. 예수님 NPC 규칙

예수님 NPC는 고정 안내자야.

```text
역할:
- 홈화면 고정 NPC
- 안내자 / 위로자 / 축복자

유지할 디자인:
- 흰 로브
- 파란 띠
- 갈색 머리와 수염
- 따뜻한 표정

금지:
- 레벨업 연결 금지
- exp 연결 금지
- 강화/진화/뽑기 UI 연결 금지
```

## 5. 초보 목자 LV.1 규칙

초보 목자는 성장형 플레이어 캐릭터야.

```text
역할:
- 성장형 목자 캐릭터
- 목양 퀘스트 보상과 연결 가능

유지할 디자인:
- 양털 모자
- 베이지색 기본 옷
- 작은 목자 지팡이
- 작은 수첩/가방
- 순하고 성실한 표정
```

## 6. 기존 홈화면 수정

현재 홈화면에서 예수님과 목자가 서로 다른 스타일로 보이는 문제를 줄이기 위해 우선 아래를 적용해줘.

```text
1. 두 캐릭터가 같은 baseline 위에 서도록 정렬
2. 표시 높이는 우선 둘 다 동일하게 104px 기준으로 맞춤
3. 예수님이 너무 작게 보이면 108px까지 허용
4. 목자가 너무 크게 보이면 100~104px로 축소
5. 두 캐릭터 모두 같은 타원형 shadow/aura 사용
6. 이름표 높이, radius, font size 동일하게 맞춤
7. 목자 옆의 점점점 말풍선은 상태 메시지와 연결되지 않으면 제거
8. 메시지 바가 캐릭터를 가리지 않게 위치 조정
```

## 7. 에셋 교체 전략

지금 당장 완벽한 신규 PNG가 없으면, 아래처럼 구조만 먼저 정리해줘.

```text
src/components/characters/CharacterStage.tsx
src/components/characters/CharacterNameTag.tsx
src/components/characters/CharacterShadow.tsx
src/components/characters/JesusNpcCharacter.tsx
src/components/characters/ShepherdCharacter.tsx
src/components/characters/characterArtGuide.ts
```

`characterArtGuide.ts`에는 아래 상수를 만들어줘.

```ts
export const CHARACTER_ART_STANDARD = {
  canvas: 128,
  characterHeight: 104,
  defaultDisplayHeight: 104,
  view: "3/4-front",
  baseline: "shared",
  shadow: {
    widthRatio: 0.72,
    height: 12,
    opacity: 0.28,
  },
  nameTag: {
    height: 28,
    borderRadius: 14,
    fontSize: 13,
  },
} as const;
```

## 8. 최종 목표

목장월드 홈화면에서 예수님 NPC와 초보 목자 LV.1이 같은 게임의 같은 아트셋처럼 보여야 해.

가장 중요한 기준:
- 같은 높이감
- 같은 선명도
- 같은 외곽선 느낌
- 같은 바닥 기준선
- 같은 그림자
- 같은 이름표 UI
