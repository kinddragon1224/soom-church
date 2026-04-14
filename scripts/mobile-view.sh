#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/kinddragon/.openclaw/workspace/soom-church"
APP_DIR="$ROOT/apps/mobile-app"
PORT="8082"

cd "$ROOT"

echo "[mobile-view] sync latest code..."
git pull --ff-only || true

if ss -ltn 2>/dev/null | grep -q ":${PORT} "; then
  echo "[mobile-view] expo dev server already running on :${PORT}"
  echo "[mobile-view] web: http://localhost:${PORT}"
  echo "[mobile-view] phone: scan current Expo QR"
  exit 0
fi

echo "[mobile-view] start fresh dev server..."
cd "$APP_DIR"
npx expo start --clear --port "$PORT" --tunnel
