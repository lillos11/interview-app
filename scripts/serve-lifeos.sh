#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PORT="${1:-5500}"

if command -v python3 >/dev/null 2>&1; then
  echo "LifeOS running at http://localhost:${PORT}/index.html"
  exec python3 -m http.server "$PORT"
elif command -v python >/dev/null 2>&1; then
  echo "LifeOS running at http://localhost:${PORT}/index.html"
  exec python -m SimpleHTTPServer "$PORT"
else
  echo "Python is required to run a local web server."
  echo "Install Python 3 and run again."
  exit 1
fi
