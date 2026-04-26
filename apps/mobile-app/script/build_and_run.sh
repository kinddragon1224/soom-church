#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

show_help() {
  cat <<'EOF'
Usage: ./script/build_and_run.sh [mode]

Modes:
  --tunnel      Start Expo with tunnel mode for Expo Go on a phone.
  --lan         Start Expo in LAN mode for phones on the same Wi-Fi.
  --tailscale   Start Expo over Tailscale using the current Tailnet IP.
  --localhost   Start Expo in localhost mode for local browser/emulator use.
  --web         Start Expo web preview.
  --android     Start Expo and open Android target.
  --ios         Start Expo and open iOS target.
  --clear       Start Expo with Metro cache cleared.
  --help        Show this help.

Default:
  Start Expo on the configured local port.
EOF
}

run_expo() {
  if [ -x ./node_modules/.bin/expo ]; then
    ./node_modules/.bin/expo "$@"
  else
    npx expo "$@"
  fi
}

case "${1:-}" in
  --help|-h)
    show_help
    ;;
  --tunnel)
    run_expo start --tunnel --clear --port 8082
    ;;
  --lan)
    run_expo start --lan --clear --port 8082
    ;;
  --tailscale)
    REACT_NATIVE_PACKAGER_HOSTNAME="${TAILSCALE_HOSTNAME:-100.118.15.27}" run_expo start --lan --clear --port 8082
    ;;
  --localhost)
    run_expo start --localhost --clear --port 8082
    ;;
  --web)
    run_expo start --web --port 8082
    ;;
  --android)
    run_expo start --android --port 8082
    ;;
  --ios)
    run_expo start --ios --port 8082
    ;;
  --clear)
    run_expo start --clear --port 8082
    ;;
  "")
    run_expo start --port 8082
    ;;
  *)
    echo "Unknown mode: $1" >&2
    show_help >&2
    exit 2
    ;;
esac
