#!/bin/bash
set -e

cd /app

if [ ! -d "node_modules/@vitejs" ]; then
  echo "Installing dependencies..."
  npm install --legacy-peer-deps
else
  echo "Dependencies already installed..."
fi

npm run dev