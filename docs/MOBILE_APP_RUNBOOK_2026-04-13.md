# SOOM Mobile App Runbook (outside-work stable flow)

## 1) One-time setup
```bash
cd /home/kinddragon/.openclaw/workspace/soom-church
npm run mobile:install
```

## 2) Start app dev server (recommended)
```bash
cd /home/kinddragon/.openclaw/workspace/soom-church
npm run mobile:dev:tunnel
```
- Tunnel mode is default recommendation for outside/home Wi‑Fi mismatch.
- Expo Go on phone should scan the **latest** QR only.

## 3) If app hangs or wrong bundle is loaded
```bash
pkill -f "expo start" || true
pkill -f "metro" || true
cd /home/kinddragon/.openclaw/workspace/soom-church/apps/mobile-app
rm -rf .expo
npm install --legacy-peer-deps
npm run dev:tunnel
```

## 4) Current login bridge flow
1. Open app login screen
2. Tap `웹에서 로그인하기`
3. Complete Google login on web
4. Tap `앱으로 돌아가기`

## 5) Quality gate before pushing
```bash
cd /home/kinddragon/.openclaw/workspace/soom-church
npm run mobile:typecheck
npm run build
```

## 6) Scope rule (fixed)
- Web app: 소개/유입/관리
- Mobile app: 제품 본체 (월드/채팅/사람/할 일)
- No new feature expansion on legacy web workspace routes
