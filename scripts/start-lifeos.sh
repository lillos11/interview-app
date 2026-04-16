#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Node.js and npm are required."
  echo "Install with: brew install node"
  exit 1
fi

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Generating Prisma client..."
npm run prisma:generate

if [ ! -f "prisma/dev.db" ]; then
  echo "Setting up database (migration + seed)..."
  npm run prisma:migrate
  npm run prisma:seed
fi

echo "Starting LifeOS at http://localhost:3000"
npm run dev
