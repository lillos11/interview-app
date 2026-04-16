#!/usr/bin/env bash
set -euo pipefail

ensure_node() {
  if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
    return
  fi

  if command -v brew >/dev/null 2>&1; then
    echo "Node.js not found. Installing with Homebrew..."
    brew install node
  else
    echo "Node.js is required."
    echo "Install Homebrew from https://brew.sh then rerun ./deploy.sh"
    echo "or install Node.js directly from https://nodejs.org"
    exit 1
  fi

  if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
    echo "Node.js installation did not complete in this shell."
    echo "Open a new terminal and run ./deploy.sh again."
    exit 1
  fi
}

ensure_node

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Deploying to Vercel (production)..."
npx vercel --prod
