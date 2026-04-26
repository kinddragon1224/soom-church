# Codex 작업 요청: 목장월드 초보 목자 LV.1 캐릭터 연결

아래 ZIP 에셋팩을 프로젝트에 추가하고, 목장월드 홈화면에서 사용할 성장형 목자 캐릭터 컴포넌트를 만들어줘.

## 1. 에셋 위치

ZIP을 다음 경로에 풀어줘.

```text
assets/characters/shepherd_lv1/
```

폴더 안에는 `manifest.json`과 여러 PNG 파일이 들어있어.

## 2. 목표

React Native 앱에서 사용할 `ShepherdCharacter` 컴포넌트를 만들어줘.

## 3. 요구사항

### 컴포넌트 API

```tsx
type ShepherdPose =
  | "idle"
  | "pray"
  | "bless"
  | "teach"
  | "walk"
  | "think"
  | "joy"
  | "concern"
  | "comfort";

type ShepherdCharacterProps = {
  pose?: ShepherdPose;
  size?: "sm" | "md" | "lg";
  showAura?: boolean;
  message?: string;
};
```

### 동작

1. `pose`가 없으면 `"idle"`로 fallback.
2. 알 수 없는 pose가 들어오면 `"idle"`로 fallback.
3. 기본 이미지는 256px 파일을 사용.
4. size는 아래처럼 매핑.
   - sm: 96px
   - md: 128px
   - lg: 256px
5. `message`가 있으면 캐릭터 아래 또는 옆에 말풍선을 표시.
6. `showAura`가 true이면 발밑에 은은한 원형 glow view를 추가.
7. 추후 애니메이션 확장을 위해 이미지 매핑을 한 파일에 분리해줘.

## 4. 포즈 매핑

manifest.json의 `usage_map`을 기준으로 매핑해줘.

```ts
const SHEPHERD_POSE_IMAGES = {
  idle: require("../assets/characters/shepherd_lv1/shepherd_lv1_idle_greeting_256.png"),
  pray: require("../assets/characters/shepherd_lv1/shepherd_lv1_pray_256.png"),
  bless: require("../assets/characters/shepherd_lv1/shepherd_lv1_bless_256.png"),
  teach: require("../assets/characters/shepherd_lv1/shepherd_lv1_teach_256.png"),
  walk: require("../assets/characters/shepherd_lv1/shepherd_lv1_walk_256.png"),
  think: require("../assets/characters/shepherd_lv1/shepherd_lv1_think_256.png"),
  joy: require("../assets/characters/shepherd_lv1/shepherd_lv1_joy_256.png"),
  concern: require("../assets/characters/shepherd_lv1/shepherd_lv1_comfort_concern_256.png"),
  comfort: require("../assets/characters/shepherd_lv1/shepherd_lv1_comfort_concern_256.png"),
};
```

경로는 실제 프로젝트 구조에 맞게 조정해줘.

## 5. 홈화면 상태 예시

홈화면에서 아래 상태값을 임시로 연결해줘.

```ts
const homePastoralState = {
  hasNewPrayerRequests: false,
  hasUncheckedMembers: true,
  completedTodayQuest: false,
  isLoadingRecommendation: false,
};
```

상태별 pose 선택 로직:

```ts
function getShepherdPose(state) {
  if (state.isLoadingRecommendation) return "think";
  if (state.completedTodayQuest) return "joy";
  if (state.hasNewPrayerRequests) return "pray";
  if (state.hasUncheckedMembers) return "concern";
  return "idle";
}
```

## 6. 메시지 예시

```ts
const SHEPHERD_MESSAGES = {
  idle: "오늘의 목양을 함께 시작해볼까요?",
  pray: "새 기도제목이 있어요. 함께 기억해요.",
  bless: "좋은 돌봄이 기록되었어요.",
  teach: "오늘 목장에 필요한 안내를 준비했어요.",
  think: "목장 상황을 살펴보고 있어요.",
  joy: "오늘의 목양 기록이 잘 채워졌어요!",
  concern: "조용히 안부가 필요한 목원이 있어요.",
  comfort: "괜찮아요. 한 걸음씩 함께 가요.",
};
```

## 7. 결과물

가능하면 아래 파일 구조로 만들어줘.

```text
src/components/characters/ShepherdCharacter.tsx
src/components/characters/shepherdAssets.ts
src/components/characters/shepherdTypes.ts
```

그리고 홈화면에서 예시로 import해서 렌더링해줘.
