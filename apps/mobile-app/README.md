# soom mobile app

Expo 기반 iOS / Android 앱 시작점.

## 목표
- 세로형 월드 앱
- 채팅형 운영
- 사람 / 가정 / 할 일 흐름

## 시작
```bash
cd apps/mobile-app
cp .env.example .env
# .env에서 EXPO_PUBLIC_CHURCH_SLUG 확인
npm install --legacy-peer-deps
npm run dev:tunnel
```

## 현재 상태
- Expo Router 뼈대 추가
- 첫 홈 화면 placeholder 추가
- 실제 인증/API 연결 전
