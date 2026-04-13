#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/kinddragon/.openclaw/workspace/soom-church"
APP="$ROOT/apps/mobile-app"

cd "$ROOT"
pkill -f "expo start" || true
pkill -f "metro" || true
pkill -f "ngrok" || true

cd "$APP"

echo "[mobile-recover] trying Expo tunnel..."
if npx expo start --tunnel --clear --port 8082; then
  exit 0
fi

echo "[mobile-recover] tunnel failed, switching to LAN mode..."
exec npx expo start --lan --clear --port 8082
