# MOBILE WORLD ASSET SLOTS 2026-04-14

## 슬롯 규칙
- `world`: 월드 배경/맵용 대표 슬롯
- `house`: 가정/집 오브젝트 슬롯
- `person`: 목원/NPC 슬롯
- `hub`: 목양 관리 허브 슬롯

## 코드 원칙
- 월드 오브젝트는 `kind`만 넘기고, 실제 fallback 에셋 연결은 `apps/mobile-app/lib/world-asset-slots.ts`에서만 관리한다.
- 프레임 톤(border/bg/badge), 사이즈, resizeMode도 같은 파일에서 같이 관리한다.
- 실에셋 교체는 슬롯 파일의 `worldAssetFallbackSources`만 바꾸는 걸 기본으로 한다.

## fallback 경로 규칙
- 기본 경로: `apps/mobile-app/assets/sprites/*`
- 현재 fallback 매핑
  - `world` -> `hub.jpg` 임시 공용 fallback
  - `house` -> `house.jpg`
  - `person` -> `person.png`
  - `hub` -> `hub.jpg`
- 이후 실에셋이 들어오면 파일명은 바꿔도 되지만, 화면 코드는 슬롯 이름(`world/house/person/hub`)만 계속 사용한다.
