#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/kinddragon/.openclaw/workspace/soom-church"
APP="$ROOT/apps/mobile-app"

detect_host_ip() {
  local ips
  ips=$(hostname -I 2>/dev/null || true)

  for ip in $ips; do
    if [[ "$ip" =~ ^192\.168\. ]]; then
      echo "$ip"
      return 0
    fi
  done

  for ip in $ips; do
    if [[ "$ip" =~ ^10\. ]]; then
      echo "$ip"
      return 0
    fi
  done

  for ip in $ips; do
    if [[ "$ip" =~ ^172\.(1[6-9]|2[0-9]|3[0-1])\. ]]; then
      echo "$ip"
      return 0
    fi
  done

  return 1
}

if [[ -z "${EXPO_PUBLIC_WEB_BASE_URL:-}" ]]; then
  if host_ip=$(detect_host_ip); then
    export EXPO_PUBLIC_WEB_BASE_URL="http://${host_ip}:3000"
    echo "[mobile-recover] EXPO_PUBLIC_WEB_BASE_URL auto-set to ${EXPO_PUBLIC_WEB_BASE_URL}"
  else
    echo "[mobile-recover] warning: host LAN IP detection failed (keeping existing EXPO_PUBLIC_WEB_BASE_URL)"
  fi
else
  echo "[mobile-recover] EXPO_PUBLIC_WEB_BASE_URL preset: ${EXPO_PUBLIC_WEB_BASE_URL}"
fi

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
