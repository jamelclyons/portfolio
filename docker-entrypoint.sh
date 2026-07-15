#!/bin/bash
set -e

cd /app

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm ci
fi

npm run build

npm run stage