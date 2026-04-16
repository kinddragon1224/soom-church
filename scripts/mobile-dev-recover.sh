#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/kinddragon/.openclaw/workspace/soom-church"
APP="$ROOT/apps/mobile-app"
WEB_LOG="/tmp/soom-web-dev.log"

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

if host_ip=$(detect_host_ip); then
  export EXPO_PUBLIC_WEB_BASE_URL="http://${host_ip}:3000"
  echo "[mobile-recover] EXPO_PUBLIC_WEB_BASE_URL forced to ${EXPO_PUBLIC_WEB_BASE_URL}"
  cat > "$APP/.env" <<EOF
EXPO_PUBLIC_WEB_BASE_URL=${EXPO_PUBLIC_WEB_BASE_URL}
EOF
  echo "[mobile-recover] wrote $APP/.env"
else
  echo "[mobile-recover] warning: host LAN IP detection failed"
fi

ensure_web_bridge() {
  local local_ok=""
  if curl -fsS --max-time 2 "http://127.0.0.1:3000/api/mobile/chat-command" >/dev/null 2>&1; then
    local_ok="yes"
  fi

  if [[ -n "$local_ok" ]]; then
    echo "[mobile-recover] web bridge already running on :3000"
    return 0
  fi

  echo "[mobile-recover] starting web bridge (next dev -H 0.0.0.0 -p 3000)..."
  pkill -f "next dev" || true

  cd "$ROOT"
  nohup npm run dev -- --hostname 0.0.0.0 --port 3000 >"$WEB_LOG" 2>&1 &

  for i in {1..20}; do
    if curl -fsS --max-time 2 "http://127.0.0.1:3000/api/mobile/chat-command" >/dev/null 2>&1; then
      echo "[mobile-recover] web bridge ready (:3000)"
      return 0
    fi
    sleep 1
  done

  echo "[mobile-recover] warning: web bridge failed to boot, check $WEB_LOG"
  return 1
}

ensure_web_bridge || true

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
